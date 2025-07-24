<template>
  <view class="personal-container">
    <!-- 用户信息区域 -->
    <view class="user-info-section">
      <view class="user-avatar">
        <image
          :src="userInfo.avatarUrl || '/static/logo.png'"
          mode="aspectFill"
          class="avatar-img"
        ></image>
      </view>
      <view class="user-details">
        <text class="user-name">{{ userInfo.nickname || "未设置昵称" }}</text>
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
      <view class="menu-item" @click="handleMenuClick('about')">
        <view class="menu-icon">ℹ️</view>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">></text>
      </view>

      <view class="menu-item" @click="handleMenuClick('feedback')">
        <view class="menu-icon">💬</view>
        <text class="menu-text">意见反馈</text>
        <text class="menu-arrow">></text>
      </view>
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
  background: #f5f5f5;
}

/* 用户信息区域 */
.user-info-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60rpx 40rpx;
  display: flex;
  align-items: center;
  color: #ffffff;
}

.user-avatar {
  margin-right: 30rpx;
}

.avatar-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.user-desc {
  font-size: 24rpx;
  opacity: 0.8;
  display: block;
}

.user-actions {
  margin-left: 20rpx;
}

.login-btn,
.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 30rpx;
  font-size: 24rpx;
  padding: 10rpx 20rpx;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.1);
}

/* 功能菜单 */
.menu-section {
  background: #ffffff;
  margin: 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx 40rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: background-color 0.3s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background-color: #f8f8f8;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 30rpx;
  width: 40rpx;
  text-align: center;
}

.menu-text {
  flex: 1;
  font-size: 32rpx;
  color: #333333;
}

.menu-arrow {
  font-size: 32rpx;
  color: #cccccc;
}

/* 版本信息 */
.version-section {
  text-align: center;
  padding: 60rpx 0;
}

.version-text {
  font-size: 24rpx;
  color: #999999;
}
</style>
