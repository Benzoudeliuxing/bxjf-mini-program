import api from "./api";
/**
 * 用户认证工具类
 */
class Auth {
  /**
   * 检查用户是否已登录
   */
  static isLoggedIn() {
    return uni.getStorageSync("isLoggedIn") === true;
  }

  /**
   * 获取用户信息
   */
  static getUserInfo() {
    return uni.getStorageSync("userInfo") || null;
  }

  /**
   * 保存用户信息
   */
  static setUserInfo(userInfo) {
    uni.setStorageSync("userInfo", userInfo);
    uni.setStorageSync("isLoggedIn", true);
  }

  /**
   * 清除用户信息
   */
  static clearUserInfo() {
    uni.removeStorageSync("userInfo");
    uni.removeStorageSync("isLoggedIn");
    uni.removeStorageSync("token");
    uni.removeStorageSync("openid");
  }

  /**
   * 获取token
   */
  static getToken() {
    return uni.getStorageSync("token") || null;
  }

  /**
   * 保存token
   */
  static setToken(token) {
    uni.setStorageSync("token", token);
  }

  /**
   * 清除token
   */
  static clearToken() {
    uni.removeStorageSync("token");
  }

  /**
   * 获取openid
   */
  static getOpenid() {
    return uni.getStorageSync("openid") || null;
  }

  /**
   * 保存openid
   */
  static setOpenid(openid) {
    uni.setStorageSync("openid", openid);
  }

  /**
   * 清除openid
   */
  static clearOpenid() {
    uni.removeStorageSync("openid");
  }

  /**
   * 获取用户昵称
   */
  static getNickname() {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.nickname : "";
  }

  /**
   * 检查是否需要设置昵称
   */
  static needSetNickname() {
    const userInfo = this.getUserInfo();
    return !userInfo || !userInfo.nickname || userInfo.nickname === "微信用户";
  }

  /**
   * 微信授权登录
   */
  static async wechatLogin(phoneCode) {
    return new Promise((resolve, reject) => {
      uni.login({
        provider: "weixin",
        success: (res) => {
          console.log("微信授权成功:", res);
          const loginCode = res.code;
          const data = {
            phoneCode: phoneCode,
            loginCode: loginCode,
            state: "9b2ffbc1-7425-4155-9894-9d5c08541d62",
          };
          api.wechat.wechatLogin(data).then((res) => {
            console.log("微信登录结果:", res);
            if (res.code == 0) {
              const token = res.data.accessToken;
              const openid = res.data.openid;
              // 保存token到本地存储
              this.setToken(token);
              this.setOpenid(openid);
              api.user.getProfile().then((res) => {
                if (res.code == 0) {
                  this.setUserInfo(res.data);
                  resolve(res.data);
                }
              });
            } else {
              reject(res);
            }
          });
        },
        fail: (err) => {
          console.error("微信授权失败:", err);
          reject(err);
        },
      });
      // uni.getUserProfile({
      //   desc: "用于完善用户资料",
      //   success: (res) => {
      //     console.log("获取用户信息成功:", res.userInfo);
      //     resolve(res.userInfo);
      //   },
      //   fail: (err) => {
      //     console.error("获取用户信息失败:", err);
      //     reject(err);
      //   },
      // });
    });
  }

  /**
   * 退出登录
   */
  static logout() {
    this.clearUserInfo();
    uni.showToast({
      title: "已退出登录",
      icon: "success",
    });

    // 跳转到登录页
    setTimeout(() => {
      uni.reLaunch({
        url: "/pages/login/login",
      });
    }, 1500);
  }
}

export default Auth;
