<template>
  <view class="payment-detail-container">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>

    <!-- 订单详情内容 -->
    <view v-else-if="orderDetail">
      <!-- 支付状态卡片 -->
      <view class="status-card">
        <view
          class="status-icon"
          :class="getStatusClass(orderDetail.payStatus)"
        >
          <text v-if="orderDetail.payStatus === 2">✓</text>
          <text v-else-if="orderDetail.payStatus === 1">⏳</text>
          <text v-else-if="orderDetail.payStatus === 3">🔄</text>
          <text v-else-if="orderDetail.payStatus === 4">↩</text>
          <text v-else>✗</text>
        </view>
        <text class="status-text">{{
          getStatusText(orderDetail.payStatus)
        }}</text>
        <text class="amount">¥{{ orderDetail.payPrice }}</text>
      </view>

      <!-- 投保人信息 -->
      <view class="info-section">
        <view class="section-title">投保人信息</view>
        <view class="info-list">
          <view class="info-item">
            <text class="label">姓名</text>
            <text class="value">{{ orderDetail.tbName || "-" }}</text>
          </view>
          <view class="info-item">
            <text class="label">身份证号</text>
            <text class="value">{{ formatIdCard(orderDetail.tbIdCard) }}</text>
          </view>
          <view class="info-item">
            <text class="label">手机号</text>
            <text class="value">{{ orderDetail.tbPhone || "-" }}</text>
          </view>
          <view class="info-item">
            <text class="label">住址</text>
            <text class="value">{{ orderDetail.tbAddress || "-" }}</text>
          </view>
        </view>
      </view>

      <!-- 被保人信息 -->
      <view class="info-section">
        <view class="section-title">被保人信息</view>
        <view class="info-list">
          <view class="info-item">
            <text class="label">姓名</text>
            <text class="value">{{ orderDetail.bbName || "-" }}</text>
          </view>
          <view class="info-item">
            <text class="label">身份证号</text>
            <text class="value">{{ formatIdCard(orderDetail.bbIdCard) }}</text>
          </view>
          <view class="info-item">
            <text class="label">手机号</text>
            <text class="value">{{ orderDetail.bbPhone || "-" }}</text>
          </view>
          <view class="info-item">
            <text class="label">住址</text>
            <text class="value">{{ orderDetail.bbAddress || "-" }}</text>
          </view>
          <view class="info-item">
            <text class="label">学校</text>
            <text class="value">{{ orderDetail.bbSchool || "-" }}</text>
          </view>
          <view class="info-item">
            <text class="label">班级</text>
            <text class="value">{{ orderDetail.bbClass || "-" }}</text>
          </view>
        </view>
      </view>

      <!-- 支付信息 -->
      <view class="info-section">
        <view class="section-title">支付信息</view>
        <view class="info-list">
          <view class="info-item">
            <text class="label">支付金额</text>
            <text class="value amount-text">¥{{ orderDetail.payPrice }}</text>
          </view>
          <view class="info-item">
            <text class="label">支付时间</text>
            <text class="value">{{ formatDate(orderDetail.payTime) }}</text>
          </view>
          <view class="info-item">
            <text class="label">支付状态</text>
            <text
              class="value"
              :class="getStatusClass(orderDetail.payStatus)"
              >{{ getStatusText(orderDetail.payStatus) }}</text
            >
          </view>
        </view>
      </view>

      <!-- 操作按钮 - 只有待支付时显示 -->
      <view class="action-section" v-if="orderDetail.payStatus === 1">
        <button class="pay-btn" @click="goToPay">支付订单</button>
        <button class="delete-btn" @click="deleteOrder">删除订单</button>
      </view>
    </view>

    <!-- 错误状态 -->
    <view v-else class="error-state">
      <text>订单信息加载失败</text>
    </view>
  </view>
</template>

<script>
import { formatAmount } from "@/utils/payment.js";
import { businessApi } from "@/utils/api.js";

export default {
  name: "PaymentDetail",
  data() {
    return {
      orderId: null,
      orderDetail: null,
      loading: true,
    };
  },
  methods: {
    formatAmount,

    goBack() {
      uni.navigateBack();
    },

    getStatusText(status) {
      const statusMap = {
        1: "待支付",
        2: "已支付",
        3: "申请退款",
        4: "已退款",
      };
      return statusMap[status] || "未知状态";
    },

    getStatusClass(status) {
      const classMap = {
        1: "unpaid",
        2: "paid",
        3: "refunding",
        4: "refunded",
      };
      return classMap[status] || "unknown";
    },

    formatDate(dateString) {
      if (!dateString) return "待支付";
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

    formatIdCard(idCard) {
      if (!idCard) return "-";
      // 身份证号脱敏处理
      if (idCard.length >= 10) {
        return (
          idCard.substring(0, 6) + "****" + idCard.substring(idCard.length - 4)
        );
      }
      return idCard;
    },

    goToPay() {
      // 构建支付页面参数
      const paymentParams = {
        id: this.orderId,
      };

      // 跳转到支付页面
      const queryString = Object.keys(paymentParams)
        .map((key) => `${key}=${encodeURIComponent(paymentParams[key])}`)
        .join("&");
      uni.redirectTo({
        url: `/pages/payment/payment?${queryString}`,
      });
    },

    async deleteOrder() {
      try {
        const result = await uni.showModal({
          title: "确认删除",
          content: "确定要删除这个订单吗？",
          confirmText: "删除",
          cancelText: "取消",
        });

        if (result.confirm) {
          uni.showLoading({ title: "删除中..." });

          await businessApi.deleteOrder(this.orderId);

          uni.hideLoading();
          uni.showToast({
            title: "删除成功",
            icon: "success",
          });

          // 延迟返回上一页
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }
      } catch (error) {
        console.error("删除订单失败:", error);
        uni.hideLoading();
        uni.showToast({
          title: "删除失败，请重试",
          icon: "none",
        });
      }
    },

    async loadOrderDetail() {
      if (!this.orderId) {
        uni.showToast({
          title: "订单ID不能为空",
          icon: "none",
        });
        return;
      }

      try {
        this.loading = true;
        const response = await businessApi.getOrderDetail({ id: this.orderId });

        if (response && response.data) {
          this.orderDetail = response.data;
        } else {
          throw new Error("获取订单详情失败");
        }
      } catch (error) {
        console.error("加载订单详情失败:", error);
        uni.showToast({
          title: "加载失败，请重试",
          icon: "none",
        });
      } finally {
        this.loading = false;
      }
    },
  },

  onLoad(options) {
    // 接收页面参数
    if (options.id) {
      this.orderId = parseInt(options.id);
      // 加载订单详情
      this.loadOrderDetail();
    } else {
      uni.showToast({
        title: "订单ID不能为空",
        icon: "none",
      });
      this.loading = false;
    }
  },

  // 页面显示时刷新数据
  onShow() {
    if (this.orderId) {
      this.loadOrderDetail();
    }
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

.loading {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
}

.error-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
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
  background-color: #e09801;
}

.status-icon.refunding {
  background-color: #2b8dbc;
}

.status-icon.refunded {
  background-color: #722ed1;
}

.status-icon.unknown {
  background-color: #d9d9d9;
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

.info-section {
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
  min-width: 120rpx;
}

.value {
  color: #333;
  font-size: 28rpx;
  text-align: right;
  max-width: 60%;
  word-break: break-all;
}

.amount-text {
  color: #ff6b35;
  font-weight: bold;
}

.value.paid {
  color: #52c41a;
}

.value.unpaid {
  color: #e09801;
}

.value.refunding {
  color: #2b8dbc;
}

.value.refunded {
  color: #722ed1;
}

.action-section {
  padding: 40rpx 0;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.pay-btn {
  width: 100%;
  height: 100rpx;
  background-color: #2b8dbc;
  color: #fff;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-btn:active {
  background-color: #2b8dbc;
}

.delete-btn {
  width: 100%;
  height: 100rpx;
  background-color: #c51d34;
  color: #fff;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:active {
  background-color: #c51d34;
}
</style>
