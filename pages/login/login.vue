<template>
  <view class="login-container">
    <view class="header">
      <image class="logo" src="/static/logo.jpg" mode="aspectFit"></image>
      <text class="title">欢迎使用 学平险采集小程序</text>
      <text class="subtitle">请授权登录以使用完整功能</text>
    </view>

    <view class="content">
      <!-- 隐私协议勾选 -->
      <view class="agreement-section">
        <view class="checkbox-wrapper" @click="toggleAgreement">
          <view class="checkbox" :class="{ checked: isAgreed }">
            <text v-if="isAgreed" class="check-icon">✓</text>
          </view>
          <text class="agreement-text">
            我已阅读并同意
            <text class="agreement-link" @click.stop="goToPrivacy"
              >《隐私协议》</text
            >
          </text>
        </view>
      </view>

      <button
        class="login-btn"
        :class="{ disabled: !isAgreed }"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
        :disabled="!isAgreed"
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
      isAgreed: false, // 是否同意隐私协议
    };
  },
  methods: {
    // 切换隐私协议同意状态
    toggleAgreement() {
      this.isAgreed = !this.isAgreed;
    },

    // 跳转到隐私协议页面
    goToPrivacy() {
      uni.navigateTo({
        url: "/pages/privacy/privacy",
      });
    },

    // 获取手机号回调
    getPhoneNumber(e) {
      console.log(e);

      // 检查是否同意隐私协议
      if (!this.isAgreed) {
        uni.showToast({
          title: "请先同意隐私协议",
          icon: "none",
        });
        return;
      }

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
  background: linear-gradient(135deg, #a5834e 0%, #247b3f 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  position: relative;
}

/* 添加装饰性背景元素 */
.login-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 20%,
      rgba(165, 131, 78, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(36, 123, 63, 0.3) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.header {
  text-align: center;
  margin-bottom: 100rpx;
  position: relative;
  z-index: 1;
}

.logo {
  width: 140rpx;
  height: 140rpx;
  object-fit: cover;
  border-radius: 20rpx;
  margin-bottom: 40rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 48rpx;
  font-weight: 600;
  color: #ffffff;
  display: block;
  margin-bottom: 20rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 30rpx;
  color: rgba(255, 255, 255, 0.9);
  display: block;
  font-weight: 400;
}

.content {
  width: 100%;
  max-width: 600rpx;
  position: relative;
  z-index: 1;
}

.login-btn {
  width: 100%;
  height: 96rpx;
  border-radius: 48rpx;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  margin-bottom: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  font-size: 32rpx;
  font-weight: 600;
  color: #247b3f;
  transition: all 0.3s ease;
}

.login-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
}

.login-btn.disabled {
  background: rgba(204, 204, 204, 0.8) !important;
  color: #999999 !important;
  box-shadow: none !important;
  transform: none !important;
}

.btn-text {
  color: #a5834e;
  font-size: 32rpx;
  font-weight: 600;
}

/* 隐私协议勾选样式 */
.agreement-section {
  margin-bottom: 40rpx;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
}

.checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.8);
  border-radius: 6rpx;
  margin-right: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition: all 0.3s ease;
}

.checkbox.checked {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(255, 255, 255, 0.95);
}

.check-icon {
  font-size: 20rpx;
  color: #247b3f;
  font-weight: 700;
}

.agreement-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

.agreement-link {
  color: #ffffff;
  text-decoration: underline;
  font-weight: 500;
  text-underline-offset: 4rpx;
}

.tips {
  text-align: center;
}

.tips-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

/* 弹窗遮罩层 */
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(4rpx);
}

/* 昵称设置弹窗样式 */
.nickname-popup {
  background: #ffffff;
  border-radius: 24rpx;
  width: 600rpx;
  padding: 50rpx 40rpx;
  margin: 40rpx;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.2);
}

.popup-header {
  text-align: center;
  margin-bottom: 40rpx;
  position: relative;
}

.popup-header::after {
  content: "";
  position: absolute;
  bottom: -20rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 4rpx;
  background: linear-gradient(90deg, #a5834e, #247b3f);
  border-radius: 2rpx;
}

.popup-title {
  font-size: 38rpx;
  font-weight: 600;
  color: #333333;
}

.popup-content {
  margin-bottom: 50rpx;
}

.popup-desc {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 30rpx;
  display: block;
}

.nickname-input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 30rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.nickname-input:focus {
  border-color: #a5834e;
  box-shadow: 0 0 0 4rpx rgba(165, 131, 78, 0.1);
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
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: 600;
  background: linear-gradient(135deg, #a5834e 0%, #247b3f 100%);
  color: #ffffff;
  border: none;
  box-shadow: 0 6rpx 20rpx rgba(165, 131, 78, 0.3);
  transition: all 0.3s ease;
}

.confirm-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 3rpx 12rpx rgba(165, 131, 78, 0.4);
}

.confirm-btn[disabled] {
  background: #cccccc !important;
  color: #ffffff !important;
  box-shadow: none !important;
  transform: none !important;
}
</style>
