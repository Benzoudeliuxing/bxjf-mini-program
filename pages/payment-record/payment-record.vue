<template>
  <view class="payment-record-container">
    <!-- 搜索和筛选 -->
    <view class="search-filter">
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
          :class="{ active: currentStatus === '1' }"
          @click="filterByStatus('1')"
        >
          待支付
        </view>
        <view
          class="filter-tab"
          :class="{ active: currentStatus === '2' }"
          @click="filterByStatus('2')"
        >
          已支付
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
          <text class="record-title">{{
            record.title || record.name || "保险订单"
          }}</text>
          <text class="record-status" :class="getStatusClass(record.payStatus)">
            {{ getStatusText(record.payStatus) }}
          </text>
        </view>

        <view class="record-info">
          <view class="info-row">
            <text class="label">缴费金额：</text>
            <text class="amount">¥{{ record.payPrice }}</text>
          </view>
          <view class="info-row">
            <text class="label">缴费时间：</text>
            <text class="time">{{ record.payTime || "-" }}</text>
          </view>
          <view class="info-row">
            <text class="label">订单号：</text>
            <text class="order-no">{{ record.orderNo || "-" }}</text>
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
import { businessApi } from "@/utils/api.js";

export default {
  name: "PaymentRecord",
  data() {
    return {
      searchKeyword: "",
      currentStatus: "", // 空字符串表示全部，1-待支付，2-已支付
      records: [],
      loading: false,
      pageNo: 1,
      pageSize: 10,
      hasMore: true,
    };
  },
  computed: {
    filteredRecords() {
      let filtered = this.records;

      // 按关键词搜索
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        filtered = filtered.filter(
          (record) =>
            (record.title && record.title.toLowerCase().includes(keyword)) ||
            (record.orderNo &&
              record.orderNo.toLowerCase().includes(keyword)) ||
            (record.description &&
              record.description.toLowerCase().includes(keyword))
        );
      }

      return filtered;
    },
  },
  methods: {
    formatAmount,

    onSearchInput() {
      // 搜索输入处理，可以添加防抖逻辑
    },

    async filterByStatus(status) {
      this.currentStatus = status;
      this.pageNo = 1;
      this.records = [];
      this.hasMore = true;
      await this.loadPaymentRecords();
    },

    getStatusText(payStatus) {
      const statusMap = {
        1: "待支付",
        2: "已支付",
        3: "申请退款",
        4: "已退款",
      };
      return statusMap[payStatus] || "未知状态";
    },

    getStatusClass(payStatus) {
      const classMap = {
        1: "unpaid",
        2: "paid",
        3: "refunding",
        4: "refunded",
      };
      return classMap[payStatus] || "";
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
        url: `/pages/payment-detail/payment-detail?id=${record.id}&orderNo=${
          record.orderNo || record.orderNumber
        }`,
      });
    },

    async loadPaymentRecords() {
      if (this.loading || !this.hasMore) return;

      this.loading = true;

      try {
        const params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        };

        // 如果有选择支付状态，添加到参数中
        if (this.currentStatus) {
          params.payStatus = this.currentStatus;
        }

        const response = await businessApi.getOrderList(params);

        if (response && response.data) {
          const newRecords = response.data.list || response.data || [];

          if (this.pageNo === 1) {
            this.records = newRecords;
          } else {
            this.records = [...this.records, ...newRecords];
          }

          // 判断是否还有更多数据
          this.hasMore = newRecords.length === this.pageSize;

          if (this.hasMore) {
            this.pageNo++;
          }
        }
      } catch (error) {
        console.error("获取订单列表失败:", error);
        uni.showToast({
          title: "获取数据失败",
          icon: "none",
        });
      } finally {
        this.loading = false;
      }
    },

    // 加载更多数据
    async loadMore() {
      if (!this.loading && this.hasMore) {
        await this.loadPaymentRecords();
      }
    },
  },

  async onLoad() {
    // 页面加载时获取缴费记录
    await this.loadPaymentRecords();
  },

  async onShow() {
    // 页面显示时刷新数据，重置到第一页
    this.pageNo = 1;
    this.records = [];
    this.hasMore = true;
    await this.loadPaymentRecords();
  },

  // 页面触底事件
  onReachBottom() {
    this.loadMore();
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
  background-color: #2b8dbc;
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
  color: #e09801;
}

.record-status.failed {
  background-color: #fff2f0;
  color: #c51d34;
}

.record-status.refunding {
  background-color: #fff7e6;
  color: #e09801;
}

.record-status.refunded {
  background-color: #f6ffed;
  color: #52c41a;
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
  color: #c51d34;
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
  color: #2b8dbc;
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
