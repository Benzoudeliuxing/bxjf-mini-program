<template>
  <view class="payment-success-container">
    <!-- 成功图标 -->
    <view class="success-icon">
      <view class="icon-circle">
        <text class="icon-text">✓</text>
      </view>
    </view>

    <!-- 成功标题 -->
    <view class="success-title">
      <text class="title-text">支付成功</text>
    </view>

    <!-- 订单信息 -->
    <view class="order-info">
      <view class="info-item">
        <text class="label">订单号：</text>
        <text class="value">{{ orderInfo.orderNo }}</text>
      </view>
      <view class="info-item">
        <text class="label">支付金额：</text>
        <text class="value price">¥{{ (orderInfo.payAmount / 100).toFixed(2) }}</text>
      </view>
      <view class="info-item">
        <text class="label">支付时间：</text>
        <text class="value">{{ orderInfo.payTime }}</text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="btn btn-primary" @click="viewOrder">查看订单</button>
      <button class="btn btn-secondary" @click="backToHome">返回首页</button>
    </view>

    <!-- 温馨提示 -->
    <view class="tips">
      <text class="tips-title">温馨提示：</text>
      <text class="tips-content">1. 订单已提交，商家将尽快为您处理</text>
      <text class="tips-content">2. 您可以在"我的订单"中查看订单状态</text>
      <text class="tips-content">3. 如有疑问，请联系客服</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "PaymentSuccess",
  data() {
    return {
      orderInfo: {
        orderNo: "",
        payAmount: 0,
        payTime: "",
      },
    };
  },
  onLoad(options) {
    // 获取支付成功后的订单信息
    this.getOrderInfo(options.orderId);
  },
  methods: {
    // 获取订单信息
    getOrderInfo(orderId) {
      // 这里应该调用API获取订单信息
      // 暂时使用模拟数据
      this.orderInfo = {
        orderNo: "ORDER" + Date.now(),
        payAmount: 99.0,
        payTime: this.formatTime(new Date()),
      };
    },

    // 格式化时间
    formatTime(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      const second = String(date.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },

    // 查看订单
    viewOrder() {
      uni.navigateTo({
        url: "/pages/payment-record/payment-record",
      });
    },

    // 返回首页
    backToHome() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
  },
};
</script>

<style scoped>
.payment-success-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-icon {
  margin: 60rpx 0 40rpx 0;
}

.icon-circle {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #07c160, #10ad6a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 20rpx rgba(7, 193, 96, 0.3);
}

.icon-text {
  color: #fff;
  font-size: 60rpx;
  font-weight: bold;
}

.success-title {
  margin-bottom: 60rpx;
}

.title-text {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.order-info {
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 28rpx;
  color: #666;
}

.value {
  font-size: 28rpx;
  color: #333;
}

.price {
  color: #ff6b35;
  font-weight: bold;
  font-size: 32rpx;
}

.action-buttons {
  width: 100%;
  margin-bottom: 40rpx;
}

.btn {
  width: 100%;
  height: 90rpx;
  border-radius: 45rpx;
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #07c160, #10ad6a);
  color: #fff;
  border: none;
}

.btn-secondary {
  background-color: #fff;
  color: #666;
  border: 2rpx solid #ddd;
}

.tips {
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
}

.tips-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: block;
}

.tips-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  display: block;
  margin-bottom: 10rpx;
}
</style>
