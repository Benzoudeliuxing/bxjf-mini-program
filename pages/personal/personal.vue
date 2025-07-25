<template>
  <view class="personal-container">
    <!-- 用户信息区域 -->
    <view class="user-info-section">
      <view class="user-avatar">
        <image
          :src="userInfo.avatarUrl || '/static/logo.jpg'"
          mode="aspectFill"
          class="avatar-img"
        ></image>
      </view>
      <view class="user-details">
        <text class="user-name">{{ userInfo.nickname || "未设置昵称" }}</text>
        <text class="user-mobile">{{ userInfo.mobile || "未绑定手机号" }}</text>
        <text class="user-desc">{{
          userInfo.nickname ? "已登录" : "请先登录"
        }}</text>
      </view>
      <view class="user-actions">
        <button
          v-if="!isLoggedIn"
          class="login-btn"
          size="mini"
          @click="goToLogin"
        >
          去登录
        </button>
        <button v-else class="logout-btn" size="mini" @click="handleLogout">
          退出登录
        </button>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @click="handleMenuClick('order')">
        <text class="menu-text">保险订单记录</text>
        <text class="menu-arrow">></text>
      </view>
      <!-- <view class="menu-item" @click="handleMenuClick('about')">
        <view class="menu-icon">ℹ️</view>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">></text>
      </view>

      <view class="menu-item" @click="handleMenuClick('feedback')">
        <view class="menu-icon">💬</view>
        <text class="menu-text">意见反馈</text>
        <text class="menu-arrow">></text>
      </view> -->
    </view>

    <!-- 版本信息 -->
    <view class="version-section">
      <text class="version-text">版本 1.0.0</text>
    </view>
  </view>
</template>

<script>
import Auth from "../../utils/auth.js";

export default {
  name: "Personal",
  data() {
    return {
      userInfo: {},
      isLoggedIn: false,
    };
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      this.userInfo = Auth.getUserInfo() || {};
      this.isLoggedIn = Auth.isLoggedIn();
    },

    // 跳转到登录页
    goToLogin() {
      uni.navigateTo({
        url: "/pages/login/login",
      });
    },

    // 退出登录
    handleLogout() {
      uni.showModal({
        title: "确认退出",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            Auth.logout();
          }
        },
      });
    },

    // 菜单点击处理
    handleMenuClick(type) {
      if (!this.isLoggedIn) {
        uni.showToast({
          title: "请先登录",
          icon: "none",
        });
        return;
      }

      switch (type) {
        case "order":
          uni.navigateTo({
            url: "/pages/payment-record/payment-record",
          });
          break;
        case "about":
          uni.showModal({
            title: "关于我们",
            content:
              "这是一个基于uni-app开发的微信小程序，提供便捷的服务功能。",
            showCancel: false,
          });
          break;
        case "feedback":
          uni.showToast({
            title: "意见反馈功能开发中",
            icon: "none",
          });
          break;
      }
    },
  },

  onShow() {
    // 每次显示页面时更新用户信息
    this.getUserInfo();
  },

  onLoad() {
    this.getUserInfo();
  },
};
</script>

<style scoped>
.personal-container {
  min-height: 100vh;
  background: #f8f6f3;
}

/* 用户信息区域 */
.user-info-section {
  background: linear-gradient(135deg, #a5834e 0%, #247b3f 100%);
  padding: 60rpx 40rpx;
  display: flex;
  align-items: center;
  color: #ffffff;
  box-shadow: 0 4rpx 20rpx rgba(165, 131, 78, 0.3);
}

.user-avatar {
  margin-right: 30rpx;
}

.avatar-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.user-mobile {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  display: block;
  margin-bottom: 6rpx;
}

.user-desc {
  font-size: 24rpx;
  opacity: 0.85;
  display: block;
}

.user-actions {
  margin-left: 20rpx;
}

.login-btn,
.logout-btn {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border: 2rpx solid rgba(255, 255, 255, 0.4);
  border-radius: 30rpx;
  font-size: 24rpx;
  padding: 10rpx 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.login-btn:active {
  background: rgba(255, 255, 255, 0.25);
}

.logout-btn {
  background: rgba(43, 141, 188, 0.3);
  border-color: rgba(43, 141, 188, 0.5);
}

.logout-btn:active {
  background: rgba(43, 141, 188, 0.4);
}

/* 功能菜单 */
.menu-section {
  background: #ffffff;
  margin: 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 16rpx rgba(165, 131, 78, 0.08);
  border: 1rpx solid rgba(165, 131, 78, 0.1);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx 40rpx;
  border-bottom: 1rpx solid rgba(165, 131, 78, 0.08);
  transition: all 0.3s ease;
  position: relative;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: linear-gradient(
    90deg,
    rgba(165, 131, 78, 0.05) 0%,
    rgba(36, 123, 63, 0.05) 100%
  );
  transform: translateX(4rpx);
}

.menu-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6rpx;
  background: linear-gradient(180deg, #a5834e 0%, #247b3f 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.menu-item:active::before {
  opacity: 1;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 30rpx;
  width: 40rpx;
  text-align: center;
  color: #a5834e;
}

.menu-text {
  flex: 1;
  font-size: 32rpx;
  color: #2c2c2c;
  font-weight: 500;
}

.menu-arrow {
  font-size: 32rpx;
  color: #2b8dbc;
  font-weight: bold;
}

/* 版本信息 */
.version-section {
  text-align: center;
  padding: 60rpx 0;
}

.version-text {
  font-size: 24rpx;
  color: rgba(165, 131, 78, 0.6);
  font-weight: 400;
}
</style>
