<template>
  <view class="payment-container">
    <!-- 订单信息 -->
    <view class="order-info">
      <view class="order-header">
        <text class="order-title">订单详情</text>
        <text
          class="order-status"
          :class="getStatusClass(orderInfo.payStatus)"
          >{{ getStatusText(orderInfo.payStatus) }}</text
        >
      </view>

      <view class="order-item">
        <text class="label">订单号：</text>
        <text class="value">{{ orderInfo.orderNo }}</text>
      </view>
      <view class="order-item">
        <text class="label">商品名称：</text>
        <text class="value">{{ orderInfo.productName }}</text>
      </view>
      <view class="order-item">
        <text class="label">保险类型：</text>
        <text class="value">学生意外伤害保险</text>
      </view>
      <view class="order-item">
        <text class="label">保险期限：</text>
        <text class="value">1年</text>
      </view>
      <view class="order-item">
        <text class="label">订单金额：</text>
        <text class="value price"
          >¥{{ (orderInfo.amount / 100).toFixed(2) }}</text
        >
      </view>
      <view class="order-item total-amount">
        <text class="label">应付金额：</text>
        <text class="value price total"
          >¥{{ (orderInfo.payPrice / 100).toFixed(2) }}</text
        >
      </view>
    </view>

    <!-- 投保人信息 -->
    <view class="person-info">
      <view class="info-title">投保人信息</view>
      <view class="info-item">
        <text class="label">姓名：</text>
        <text class="value">{{ orderInfo.tbName }}</text>
      </view>
      <view class="info-item">
        <text class="label">身份证号：</text>
        <text class="value">{{ formatIdCard(orderInfo.tbIdCard) }}</text>
      </view>
      <view class="info-item">
        <text class="label">手机号：</text>
        <text class="value">{{ orderInfo.tbPhone }}</text>
      </view>
      <view class="info-item">
        <text class="label">住址：</text>
        <text class="value">{{ orderInfo.tbAddress }}</text>
      </view>
    </view>

    <!-- 被保人信息 -->
    <view class="person-info">
      <view class="info-title">被保人信息</view>
      <view class="info-item">
        <text class="label">姓名：</text>
        <text class="value">{{ orderInfo.bbName }}</text>
      </view>
      <view class="info-item">
        <text class="label">身份证号：</text>
        <text class="value">{{ formatIdCard(orderInfo.bbIdCard) }}</text>
      </view>
      <view class="info-item">
        <text class="label">手机号：</text>
        <text class="value">{{ orderInfo.bbPhone }}</text>
      </view>
      <view class="info-item">
        <text class="label">住址：</text>
        <text class="value">{{ orderInfo.bbAddress }}</text>
      </view>
      <view class="info-item">
        <text class="label">学校：</text>
        <text class="value">{{ orderInfo.bbSchool }}</text>
      </view>
      <view class="info-item">
        <text class="label">班级：</text>
        <text class="value">{{ orderInfo.bbClass }}</text>
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="payment-method" v-if="orderInfo.payStatus === 1">
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
    <view
      class="payment-action"
      v-if="orderInfo.payStatus === 1 || orderInfo.payStatus == null"
    >
      <button class="pay-btn" @click="handlePayment" :disabled="isPaying">
        {{ isPaying ? "支付中..." : "立即支付" }}
      </button>
    </view>

    <!-- 已支付状态提示 -->
    <view class="paid-status" v-if="orderInfo.payStatus === 2">
      <view class="paid-icon">✓</view>
      <text class="paid-text">订单已支付完成</text>
    </view>

    <!-- 退款状态提示 -->
    <view
      class="refund-status"
      v-if="orderInfo.payStatus === 3 || orderInfo.payStatus === 4"
    >
      <view class="refund-icon">⟲</view>
      <text class="refund-text">{{
        orderInfo.payStatus === 3 ? "申请退款中" : "已完成退款"
      }}</text>
    </view>

    <!-- 支付说明 -->
    <view class="payment-tips" v-if="orderInfo.payStatus === 1">
      <text class="tips-text">支付说明：</text>
      <text class="tips-content">1. 请确保微信已安装并已登录</text>
      <text class="tips-content">2. 支付完成后请勿关闭小程序</text>
      <text class="tips-content">3. 如有问题请联系客服</text>
    </view>
  </view>
</template>

<script>
import { wechatPay, getErrorMessage } from "@/utils/payment.js";
import api from "../../utils/api";

export default {
  name: "Payment",
  data() {
    return {
      orderId: 0,
      orderInfo: {
        orderId: 0,
        orderNo: "",
        productName: "",
        amount: 0,
        payPrice: 0,
        payStatus: 1,
        tbName: "",
        tbIdCard: "",
        tbPhone: "",
        tbAddress: "",
        bbName: "",
        bbIdCard: "",
        bbPhone: "",
        bbAddress: "",
        bbSchool: "",
        bbClass: "",
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
      console.log("支付页面接收到的参数:", options);

      // 从页面参数获取订单信息，确保转换为整数类型
      this.orderId = parseInt(options.id);

      api.business.getOrderDetail({ id: this.orderId }).then((res) => {
        console.log("订单信息:", res);
        if (res.code == 0) {
          this.orderInfo = res.data;
        }
      });
    },

    // 获取支付状态文本
    getStatusText(status) {
      const statusMap = {
        1: "待支付",
        2: "已支付",
        3: "申请退款",
        4: "已退款",
      };
      // 当status为null、undefined或其他值时，默认为待支付
      return statusMap[status] || "待支付";
    },

    // 获取支付状态样式类
    getStatusClass(status) {
      const classMap = {
        1: "status-pending",
        2: "status-paid",
        3: "status-refunding",
        4: "status-refunded",
      };
      // 当status为null、undefined或其他值时，默认为待支付样式
      return classMap[status] || "status-pending";
    },

    // 格式化身份证号（隐藏中间部分）
    formatIdCard(idCard) {
      if (!idCard || idCard.length < 10) return idCard;
      return (
        idCard.substring(0, 6) + "****" + idCard.substring(idCard.length - 4)
      );
    },

    // 选择支付方式
    selectPaymentMethod(method) {
      this.selectedMethod = method;
    },

    // 处理支付
    async handlePayment() {
      if (this.isPaying) return;

      // 验证orderId是否有效
      if (!this.orderId || this.orderId <= 0) {
        uni.showToast({
          title: "订单信息错误",
          icon: "none",
        });
        return;
      }

      this.isPaying = true;

      try {
        // 调用微信支付，确保orderId为整数类型
        const orderId = parseInt(this.orderId);
        const result = await wechatPay({ orderId: orderId });

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

      // 跳转到支付成功页面，传递更多订单信息
      setTimeout(() => {
        const successParams = {
          orderId: this.orderInfo.orderId,
          orderNo: this.orderInfo.orderNo,
          amount: this.orderInfo.payPrice,
          productName: this.orderInfo.productName,
        };

        const queryString = Object.keys(successParams)
          .map((key) => `${key}=${encodeURIComponent(successParams[key])}`)
          .join("&");

        uni.redirectTo({
          url: `/pages/payment-success/payment-success?${queryString}`,
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

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.order-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.order-status {
  font-size: 26rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  border: 1rpx solid;
}

.status-pending {
  color: #ff6b35;
  background-color: #fff2ee;
  border-color: #ffdbcc;
}

.status-paid {
  color: #07c160;
  background-color: #f0f9ff;
  border-color: #b3e5fc;
}

.status-refunding {
  color: #ffa726;
  background-color: #fff8e1;
  border-color: #ffcc02;
}

.status-refunded {
  color: #9e9e9e;
  background-color: #f5f5f5;
  border-color: #e0e0e0;
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

.total-amount {
  background-color: #f8f9fa;
  margin: 20rpx -20rpx -20rpx -20rpx;
  padding: 20rpx;
  border-radius: 0 0 20rpx 20rpx;
}

.total-amount .label {
  font-size: 30rpx;
  font-weight: bold;
}

.total-amount .price.total {
  font-size: 36rpx;
  color: #ff4757;
}

/* 人员信息样式 */
.person-info {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 20rpx;
}

.info-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  font-size: 28rpx;
  color: #666;
  min-width: 120rpx;
  flex-shrink: 0;
}

.info-item .value {
  font-size: 28rpx;
  color: #333;
  text-align: right;
  word-break: break-all;
  flex: 1;
  margin-left: 20rpx;
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

/* 已支付状态样式 */
.paid-status {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  margin-bottom: 20rpx;
  text-align: center;
}

.paid-icon {
  font-size: 80rpx;
  color: #07c160;
  margin-bottom: 20rpx;
}

.paid-text {
  font-size: 32rpx;
  color: #07c160;
  font-weight: bold;
}

/* 退款状态样式 */
.refund-status {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  margin-bottom: 20rpx;
  text-align: center;
}

.refund-icon {
  font-size: 80rpx;
  color: #ffa726;
  margin-bottom: 20rpx;
}

.refund-text {
  font-size: 32rpx;
  color: #ffa726;
  font-weight: bold;
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
