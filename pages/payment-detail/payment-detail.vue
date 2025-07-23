<template>
  <view class="payment-detail-container">
    <!-- 头部 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="title">缴费详情</text>
    </view>

    <!-- 缴费状态卡片 -->
    <view class="status-card">
      <view class="status-icon" :class="paymentDetail.status">
        <text v-if="paymentDetail.status === 'paid'">✓</text>
        <text v-else-if="paymentDetail.status === 'unpaid'">⏳</text>
        <text v-else>✗</text>
      </view>
      <text class="status-text">{{ getStatusText(paymentDetail.status) }}</text>
      <text class="amount">¥{{ formatAmount(paymentDetail.amount) }}</text>
    </view>

    <!-- 缴费信息 -->
    <view class="info-section">
      <view class="section-title">缴费信息</view>
      <view class="info-list">
        <view class="info-item">
          <text class="label">缴费项目</text>
          <text class="value">{{ paymentDetail.title }}</text>
        </view>
        <view class="info-item">
          <text class="label">缴费金额</text>
          <text class="value amount-text"
            >¥{{ formatAmount(paymentDetail.amount) }}</text
          >
        </view>
        <view class="info-item">
          <text class="label">订单号</text>
          <text class="value order-no">{{ paymentDetail.orderNo }}</text>
        </view>
        <view class="info-item">
          <text class="label">缴费时间</text>
          <text class="value">{{ formatDate(paymentDetail.paymentTime) }}</text>
        </view>
        <view class="info-item">
          <text class="label">缴费方式</text>
          <text class="value">{{
            paymentDetail.paymentMethod || "微信支付"
          }}</text>
        </view>
        <view class="info-item">
          <text class="label">备注</text>
          <text class="value">{{ paymentDetail.description || "无" }}</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-section" v-if="paymentDetail.status === 'unpaid'">
      <button class="pay-btn" @click="goToPay">立即缴费</button>
    </view>

    <!-- 缴费记录 -->
    <view class="record-section" v-if="paymentDetail.status === 'paid'">
      <view class="section-title">缴费记录</view>
      <view class="record-item">
        <view class="record-header">
          <text class="record-title">支付成功</text>
          <text class="record-time">{{
            formatDate(paymentDetail.paymentTime)
          }}</text>
        </view>
        <view class="record-detail">
          <text class="detail-text"
            >支付方式：{{ paymentDetail.paymentMethod || "微信支付" }}</text
          >
          <text class="detail-text"
            >交易流水：{{ paymentDetail.transactionId || "暂无" }}</text
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { formatAmount } from "@/utils/payment.js";

export default {
  name: "PaymentDetail",
  data() {
    return {
      recordId: null,
      orderNo: "",
      paymentDetail: {
        id: null,
        title: "",
        amount: 0,
        status: "unpaid",
        paymentTime: null,
        orderNo: "",
        description: "",
        paymentMethod: "微信支付",
        transactionId: "",
      },
    };
  },
  methods: {
    formatAmount,

    goBack() {
      uni.navigateBack();
    },

    getStatusText(status) {
      const statusMap = {
        paid: "缴费成功",
        unpaid: "待缴费",
        failed: "缴费失败",
      };
      return statusMap[status] || "未知状态";
    },

    formatDate(dateString) {
      if (!dateString) return "待缴费";
      const date = new Date(dateString);
      return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },

    goToPay() {
      // 跳转到缴费页面
      uni.navigateTo({
        url: `/pages/payment/payment?orderNo=${this.orderNo}&amount=${this.paymentDetail.amount}&title=${this.paymentDetail.title}`,
      });
    },

    loadPaymentDetail() {
      // 模拟数据 - 实际应该从API获取
      const mockData = {
        1: {
          id: 1,
          title: "2024年春季学费",
          amount: 500000,
          status: "paid",
          paymentTime: "2024-03-15 14:30:25",
          orderNo: "PAY202403150001",
          description: "2024年春季学期学费缴纳",
          paymentMethod: "微信支付",
          transactionId: "WX20240315143025001",
        },
        2: {
          id: 2,
          title: "2024年住宿费",
          amount: 300000,
          status: "paid",
          paymentTime: "2024-02-28 09:15:10",
          orderNo: "PAY202402280002",
          description: "2024年春季学期住宿费",
          paymentMethod: "微信支付",
          transactionId: "WX20240228091510002",
        },
        3: {
          id: 3,
          title: "2024年秋季学费",
          amount: 500000,
          status: "unpaid",
          paymentTime: null,
          orderNo: "PAY202409010003",
          description: "2024年秋季学期学费",
          paymentMethod: "微信支付",
          transactionId: "",
        },
        4: {
          id: 4,
          title: "教材费",
          amount: 80000,
          status: "paid",
          paymentTime: "2024-03-10 16:45:30",
          orderNo: "PAY202403100004",
          description: "2024年春季教材费用",
          paymentMethod: "微信支付",
          transactionId: "WX20240310164530004",
        },
        5: {
          id: 5,
          title: "实验费",
          amount: 120000,
          status: "unpaid",
          paymentTime: null,
          orderNo: "PAY202403200005",
          description: "2024年春季实验课程费用",
          paymentMethod: "微信支付",
          transactionId: "",
        },
      };

      // 根据ID或订单号获取详情
      let detail = null;
      if (this.recordId && mockData[this.recordId]) {
        detail = mockData[this.recordId];
      } else {
        // 根据订单号查找
        for (const key in mockData) {
          if (mockData[key].orderNo === this.orderNo) {
            detail = mockData[key];
            break;
          }
        }
      }

      if (detail) {
        this.paymentDetail = { ...detail };
      } else {
        uni.showToast({
          title: "未找到缴费记录",
          icon: "none",
        });
      }
    },
  },

  onLoad(options) {
    // 接收页面参数
    if (options.id) {
      this.recordId = parseInt(options.id);
    }
    if (options.orderNo) {
      this.orderNo = options.orderNo;
    }

    // 加载缴费详情
    this.loadPaymentDetail();
  },
};
</script>

<style scoped>
.payment-detail-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  margin-bottom: 20rpx;
}

.back-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 50%;
  margin-right: 20rpx;
}

.back-icon {
  font-size: 36rpx;
  color: #333;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.status-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  text-align: center;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.status-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20rpx;
  font-size: 60rpx;
  color: #fff;
}

.status-icon.paid {
  background-color: #52c41a;
}

.status-icon.unpaid {
  background-color: #fa8c16;
}

.status-icon.failed {
  background-color: #ff4d4f;
}

.status-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.amount {
  font-size: 48rpx;
  font-weight: bold;
  color: #ff6b35;
}

.info-section,
.record-section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  color: #666;
  font-size: 28rpx;
}

.value {
  color: #333;
  font-size: 28rpx;
  text-align: right;
  max-width: 60%;
}

.amount-text {
  color: #ff6b35;
  font-weight: bold;
}

.order-no {
  font-family: monospace;
  color: #999;
}

.action-section {
  padding: 40rpx 0;
}

.pay-btn {
  width: 100%;
  height: 100rpx;
  background-color: #007aff;
  color: #fff;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
}

.pay-btn:active {
  background-color: #0056cc;
}

.record-item {
  background-color: #f8f8f8;
  border-radius: 16rpx;
  padding: 30rpx;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.record-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #52c41a;
}

.record-time {
  font-size: 24rpx;
  color: #999;
}

.record-detail {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.detail-text {
  font-size: 26rpx;
  color: #666;
}
</style>
