<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>

    <view class="nav-buttons">
      <button class="nav-btn" @click="navigateTo('/pages/personal/personal')">
        个人中心
      </button>
      <button class="nav-btn" @click="navigateTo('/pages/login/login')">
        登录授权
      </button>
      <button class="nav-btn" @click="navigateTo('/pages/form/form')">
        表单页面
      </button>
      <button class="nav-btn" @click="navigateTo('/pages/payment/payment')">
        支付页面
      </button>
      <button
        class="nav-btn"
        @click="navigateTo('/pages/payment-success/payment-success')"
      >
        支付成功
      </button>
      <button
        class="nav-btn"
        @click="navigateTo('/pages/payment-record/payment-record')"
      >
        缴费记录
      </button>
      <button
        class="nav-btn"
        @click="navigateTo('/pages/payment-detail/payment-detail')"
      >
        缴费详情
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "首页",
    };
  },
  onLoad() {},
  methods: {
    navigateTo(url) {
      uni.navigateTo({
        url: url,
      });
    },
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 100rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
  margin-bottom: 60rpx;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.nav-buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.nav-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #007aff;
  color: white;
  border-radius: 10rpx;
  font-size: 28rpx;
}

.nav-btn:active {
  background-color: #0056b3;
}
</style>
