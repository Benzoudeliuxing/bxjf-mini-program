<template>
  <view class="login-container">
    <view class="header">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="title">欢迎使用</text>
      <text class="subtitle">请授权登录以使用完整功能</text>
    </view>

    <view class="content">
      <button
        class="login-btn"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
      >
        微信授权登录
      </button>

      <view class="tips">
        <text class="tips-text">登录后即可使用所有功能</text>
      </view>
    </view>

    <!-- 昵称设置弹窗 -->
    <view v-if="showNicknamePopup" class="popup-mask" @click="closePopup">
      <view class="nickname-popup" @click.stop>
        <view class="popup-header">
          <text class="popup-title">设置昵称</text>
        </view>
        <view class="popup-content">
          <text class="popup-desc"
            >请设置您的昵称，方便我们为您提供更好的服务</text
          >
          <input
            class="nickname-input"
            v-model="nickname"
            placeholder="请输入昵称"
            maxlength="20"
            @input="onNicknameInput"
          />
          <text class="input-tips">昵称长度1-20个字符</text>
        </view>
        <view class="popup-footer">
          <button
            class="confirm-btn"
            type="primary"
            @click="confirmNickname"
            :disabled="!nickname.trim()"
          >
            确认
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Auth from "../../utils/auth.js";

export default {
  name: "Login",
  data() {
    return {
      isLoading: false,
      nickname: "",
      userInfo: null,
      showNicknamePopup: false,
    };
  },
  methods: {
    // 获取手机号回调
    getPhoneNumber(e) {
      console.log(e);
      const phoneCode = e.detail.code;
      this.handleWechatLogin(phoneCode);
    },

    // 微信授权登录
    async handleWechatLogin(phoneCode) {
      this.isLoading = true;

      try {
        // 获取用户信息
        const userInfo = await Auth.wechatLogin(phoneCode);

        if (userInfo) {
          this.userInfo = userInfo;

          // 检查是否有昵称
          if (Auth.needSetNickname()) {
            // 显示昵称设置弹窗
            this.showNicknamePopup = true;
          } else {
            // 直接登录成功
            this.loginSuccess(userInfo);
          }
        }
      } catch (error) {
        console.error("登录失败:", error);
        uni.showToast({
          title: "登录失败，请重试",
          icon: "none",
        });
      } finally {
        this.isLoading = false;
      }
    },

    // 昵称输入处理
    onNicknameInput(e) {
      this.nickname = e.detail.value;
    },

    // 关闭弹窗
    closePopup() {
      this.showNicknamePopup = false;
    },

    // 确认昵称设置
    async confirmNickname() {
      if (!this.nickname.trim()) {
        uni.showToast({
          title: "请输入昵称",
          icon: "none",
        });
        return;
      }

      try {
        // 更新用户信息
        const updatedUserInfo = {
          ...this.userInfo,
          nickName: this.nickname.trim(),
        };

        // 保存用户信息
        Auth.setUserInfo(updatedUserInfo);

        // 关闭弹窗
        this.showNicknamePopup = false;

        // 登录成功
        this.loginSuccess(updatedUserInfo);

        uni.showToast({
          title: "昵称设置成功",
          icon: "success",
        });
      } catch (error) {
        console.error("设置昵称失败:", error);
        uni.showToast({
          title: "设置失败，请重试",
          icon: "none",
        });
      }
    },

    // 登录成功处理
    loginSuccess(userInfo) {
      uni.showToast({
        title: "登录成功",
        icon: "success",
      });

      // 延迟跳转到首页
      setTimeout(() => {
        uni.reLaunch({ url: "/pages/index/index" });
      }, 1500);
    },
  },

  onLoad() {
    // 检查是否已登录
    if (Auth.isLoggedIn()) {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    }
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.header {
  text-align: center;
  margin-bottom: 100rpx;
}

.logo {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 40rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #ffffff;
  display: block;
  margin-bottom: 20rpx;
}

.subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
}

.content {
  width: 100%;
  max-width: 600rpx;
}

.login-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  background: #ffffff;
  border: none;
  margin-bottom: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-text {
  color: #333333;
  font-size: 32rpx;
  font-weight: 500;
}

.tips {
  text-align: center;
}

.tips-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
}

/* 弹窗遮罩层 */
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

/* 昵称设置弹窗样式 */
.nickname-popup {
  background: #ffffff;
  border-radius: 20rpx;
  width: 600rpx;
  padding: 40rpx;
  margin: 40rpx;
}

.popup-header {
  text-align: center;
  margin-bottom: 40rpx;
}

.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
}

.popup-content {
  margin-bottom: 40rpx;
}

.popup-desc {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.5;
  margin-bottom: 30rpx;
  display: block;
}

.nickname-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
}

.input-tips {
  font-size: 24rpx;
  color: #999999;
  display: block;
}

.popup-footer {
  text-align: center;
}

.confirm-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.confirm-btn[disabled] {
  background: #cccccc !important;
  color: #ffffff !important;
}
</style>
