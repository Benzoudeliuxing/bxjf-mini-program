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
  }

  /**
   * 获取用户昵称
   */
  static getNickname() {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.nickName : "";
  }

  /**
   * 检查是否需要设置昵称
   */
  static needSetNickname() {
    const userInfo = this.getUserInfo();
    return !userInfo || !userInfo.nickName || userInfo.nickName === "微信用户";
  }

  /**
   * 微信授权登录
   */
  static async wechatLogin() {
    return new Promise((resolve, reject) => {
      uni.getUserProfile({
        desc: "用于完善用户资料",
        success: (res) => {
          console.log("获取用户信息成功:", res.userInfo);
          resolve(res.userInfo);
        },
        fail: (err) => {
          console.error("获取用户信息失败:", err);
          reject(err);
        },
      });
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
