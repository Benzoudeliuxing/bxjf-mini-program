<template>
  <view class="payment-record-container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">缴费记录</text>
    </view>

    <!-- 搜索和筛选 -->
    <view class="search-filter">
      <view class="search-box">
        <input
          class="search-input"
          placeholder="搜索缴费记录"
          v-model="searchKeyword"
          @input="onSearchInput"
        />
        <text class="search-icon">🔍</text>
      </view>

      <view class="filter-tabs">
        <view
          class="filter-tab"
          :class="{ active: currentStatus === '' }"
          @click="filterByStatus('')"
        >
          全部
        </view>
        <view
          class="filter-tab"
          :class="{ active: currentStatus === 'paid' }"
          @click="filterByStatus('paid')"
        >
          已缴费
        </view>
        <view
          class="filter-tab"
          :class="{ active: currentStatus === 'unpaid' }"
          @click="filterByStatus('unpaid')"
        >
          未缴费
        </view>
      </view>
    </view>

    <!-- 记录列表 -->
    <view class="record-list">
      <view
        class="record-item"
        v-for="record in filteredRecords"
        :key="record.id"
        @click="goToDetail(record)"
      >
        <view class="record-header">
          <text class="record-title">{{ record.title }}</text>
          <text class="record-status" :class="record.status">
            {{ getStatusText(record.status) }}
          </text>
        </view>

        <view class="record-info">
          <view class="info-row">
            <text class="label">缴费金额：</text>
            <text class="amount">¥{{ formatAmount(record.amount) }}</text>
          </view>
          <view class="info-row">
            <text class="label">缴费时间：</text>
            <text class="time">{{ formatDate(record.paymentTime) }}</text>
          </view>
          <view class="info-row">
            <text class="label">订单号：</text>
            <text class="order-no">{{ record.orderNo }}</text>
          </view>
        </view>

        <view class="record-footer">
          <text class="detail-text">点击查看详情 ></text>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="filteredRecords.length === 0">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无缴费记录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { formatAmount } from "@/utils/payment.js";

export default {
  name: "PaymentRecord",
  data() {
    return {
      searchKeyword: "",
      currentStatus: "",
      records: [
        {
          id: 1,
          title: "2024年春季学费",
          amount: 500000, // 5000元，以分为单位
          status: "paid",
          paymentTime: "2024-03-15 14:30:25",
          orderNo: "PAY202403150001",
          description: "2024年春季学期学费缴纳",
        },
        {
          id: 2,
          title: "2024年住宿费",
          amount: 300000, // 3000元
          status: "paid",
          paymentTime: "2024-02-28 09:15:10",
          orderNo: "PAY202402280002",
          description: "2024年春季学期住宿费",
        },
        {
          id: 3,
          title: "2024年秋季学费",
          amount: 500000, // 5000元
          status: "unpaid",
          paymentTime: null,
          orderNo: "PAY202409010003",
          description: "2024年秋季学期学费",
        },
        {
          id: 4,
          title: "教材费",
          amount: 80000, // 800元
          status: "paid",
          paymentTime: "2024-03-10 16:45:30",
          orderNo: "PAY202403100004",
          description: "2024年春季教材费用",
        },
        {
          id: 5,
          title: "实验费",
          amount: 120000, // 1200元
          status: "unpaid",
          paymentTime: null,
          orderNo: "PAY202403200005",
          description: "2024年春季实验课程费用",
        },
      ],
    };
  },
  computed: {
    filteredRecords() {
      let filtered = this.records;

      // 按状态筛选
      if (this.currentStatus) {
        filtered = filtered.filter(
          (record) => record.status === this.currentStatus
        );
      }

      // 按关键词搜索
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        filtered = filtered.filter(
          (record) =>
            record.title.toLowerCase().includes(keyword) ||
            record.orderNo.toLowerCase().includes(keyword) ||
            record.description.toLowerCase().includes(keyword)
        );
      }

      // 按时间倒序排列
      return filtered.sort((a, b) => {
        if (a.paymentTime && b.paymentTime) {
          return new Date(b.paymentTime) - new Date(a.paymentTime);
        }
        return 0;
      });
    },
  },
  methods: {
    formatAmount,

    onSearchInput() {
      // 搜索输入处理
    },

    filterByStatus(status) {
      this.currentStatus = status;
    },

    getStatusText(status) {
      const statusMap = {
        paid: "已缴费",
        unpaid: "未缴费",
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
      });
    },

    goToDetail(record) {
      uni.navigateTo({
        url: `/pages/payment-detail/payment-detail?id=${record.id}&orderNo=${record.orderNo}`,
      });
    },
    loadPaymentRecords() {
      // 这里可以调用API获取真实的缴费记录数据
      // 目前使用模拟数据
      console.log("加载缴费记录");
    },
  },

  onLoad() {
    // 页面加载时获取缴费记录
    this.loadPaymentRecords();
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadPaymentRecords();
  },
};
</script>

<style scoped>
.payment-record-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
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

.search-filter {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.search-box {
  position: relative;
  margin-bottom: 30rpx;
}

.search-input {
  width: 100%;
  height: 80rpx;
  padding: 0 80rpx 0 30rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 40rpx;
  font-size: 28rpx;
  background-color: #f8f8f8;
}

.search-icon {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 32rpx;
  color: #999;
}

.filter-tabs {
  display: flex;
  gap: 20rpx;
}

.filter-tab {
  flex: 1;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  background-color: #f0f0f0;
  border-radius: 30rpx;
  font-size: 26rpx;
  color: #666;
  transition: all 0.3s;
}

.filter-tab.active {
  background-color: #007aff;
  color: #fff;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.record-item {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.record-item:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.record-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.record-status {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: bold;
}

.record-status.paid {
  background-color: #e8f5e8;
  color: #52c41a;
}

.record-status.unpaid {
  background-color: #fff7e6;
  color: #fa8c16;
}

.record-status.failed {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.record-info {
  margin-bottom: 20rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
  font-size: 26rpx;
}

.label {
  color: #666;
}

.amount {
  color: #ff6b35;
  font-weight: bold;
}

.time {
  color: #333;
}

.order-no {
  color: #999;
  font-family: monospace;
}

.record-footer {
  border-top: 2rpx solid #f0f0f0;
  padding-top: 20rpx;
  text-align: center;
}

.detail-text {
  color: #007aff;
  font-size: 26rpx;
}

.empty-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
}

.empty-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
}
</style>
