<template>
  <view class="payment-container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">订单支付</text>
    </view>

    <!-- 订单信息 -->
    <view class="order-info">
      <view class="order-item">
        <text class="label">订单号：</text>
        <text class="value">{{ orderInfo.orderNo }}</text>
      </view>
      <view class="order-item">
        <text class="label">商品名称：</text>
        <text class="value">{{ orderInfo.productName }}</text>
      </view>
      <view class="order-item">
        <text class="label">订单金额：</text>
        <text class="value price"
          >¥{{ (orderInfo.amount / 100).toFixed(2) }}</text
        >
      </view>
      <view class="order-item">
        <text class="label">支付金额：</text>
        <text class="value price"
          >¥{{ (orderInfo.payAmount / 100).toFixed(2) }}</text
        >
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="payment-method">
      <view class="method-title">选择支付方式</view>
      <view class="method-item" @click="selectPaymentMethod('wechat')">
        <view class="method-info">
          <image
            class="method-icon"
            src="/static/wechat-pay.png"
            mode="aspectFit"
          ></image>
          <text class="method-name">微信支付</text>
        </view>
        <view class="method-check">
          <view
            class="check-icon"
            :class="{ active: selectedMethod === 'wechat' }"
          ></view>
        </view>
      </view>
    </view>

    <!-- 支付按钮 -->
    <view class="payment-action">
      <button class="pay-btn" @click="handlePayment" :disabled="isPaying">
        {{ isPaying ? "支付中..." : "立即支付" }}
      </button>
    </view>

    <!-- 支付说明 -->
    <view class="payment-tips">
      <text class="tips-text">支付说明：</text>
      <text class="tips-content">1. 请确保微信已安装并已登录</text>
      <text class="tips-content">2. 支付完成后请勿关闭小程序</text>
      <text class="tips-content">3. 如有问题请联系客服</text>
    </view>
  </view>
</template>

<script>
import { wechatPay, getErrorMessage } from "@/utils/payment.js";

export default {
  name: "Payment",
  data() {
    return {
      orderInfo: {
        orderId: "",
        orderNo: "",
        productName: "",
        amount: 0,
        payAmount: 0,
      },
      selectedMethod: "wechat",
      isPaying: false,
    };
  },
  onLoad(options) {
    // 获取订单信息
    this.getOrderInfo(options);
  },
  methods: {
    // 获取订单信息
    getOrderInfo(options) {
      // 从页面参数获取订单信息
      const orderNo = options.orderNo || "ORDER" + Date.now();
      const amount = parseInt(options.amount) || 9900;
      const title = options.title || "商品名称";

      this.orderInfo = {
        orderId: options.id || "ORDER" + Date.now(),
        orderNo: orderNo,
        productName: title,
        amount: amount,
        payAmount: amount,
      };
    },

    // 选择支付方式
    selectPaymentMethod(method) {
      this.selectedMethod = method;
    },

    // 处理支付
    async handlePayment() {
      if (this.isPaying) return;

      this.isPaying = true;

      try {
        // 调用微信支付
        const result = await wechatPay(this.orderInfo);

        if (result.success) {
          this.paymentSuccess();
        } else {
          this.paymentFail(result.error);
        }
      } catch (error) {
        this.paymentFail(error);
      } finally {
        this.isPaying = false;
      }
    },

    // 支付成功
    paymentSuccess() {
      uni.showToast({
        title: "支付成功",
        icon: "success",
      });

      // 跳转到支付成功页面
      setTimeout(() => {
        uni.redirectTo({
          url: `/pages/payment-success/payment-success?orderId=${this.orderInfo.orderId}`,
        });
      }, 1500);
    },

    // 支付失败
    paymentFail(error) {
      const message = getErrorMessage(error);

      uni.showToast({
        title: message,
        icon: "none",
      });
    },
  },
};
</script>

<style scoped>
.payment-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.header {
  text-align: center;
  padding: 40rpx 0;
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.order-info {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 20rpx;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.order-item:last-child {
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

.payment-method {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 20rpx;
}

.method-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}

.method-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.method-info {
  display: flex;
  align-items: center;
}

.method-icon {
  width: 60rpx;
  height: 60rpx;
  margin-right: 20rpx;
}

.method-name {
  font-size: 30rpx;
  color: #333;
}

.method-check {
  display: flex;
  align-items: center;
}

.check-icon {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #ddd;
  border-radius: 50%;
  position: relative;
}

.check-icon.active {
  border-color: #07c160;
  background-color: #07c160;
}

.check-icon.active::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20rpx;
  height: 20rpx;
  background-color: #fff;
  border-radius: 50%;
}

.payment-action {
  margin-bottom: 20rpx;
}

.pay-btn {
  width: 100%;
  height: 100rpx;
  background: linear-gradient(135deg, #07c160, #10ad6a);
  color: #fff;
  border: none;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-btn:disabled {
  background: #ccc;
}

.payment-tips {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
}

.tips-text {
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
