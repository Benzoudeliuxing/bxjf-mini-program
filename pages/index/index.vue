<template>
  <view class="content">
    <!-- 当前的导航按钮使用v-if隐藏 -->
    <view class="nav-buttons" v-if="false">
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

    <!-- 保障说明内容 -->
    <view class="insurance-content">
      <view class="header">
        <text class="title">学生保险保障说明</text>
      </view>

      <view class="section">
        <view class="section-title">保障项目</view>
        <view class="item">
          <text class="item-name">意外身故、残疾给付</text>
          <text class="item-amount">100,000 元</text>
        </view>
        <view class="item">
          <text class="item-name">疾病身故给付</text>
          <text class="item-amount">60,000 元</text>
        </view>
        <view class="item">
          <text class="item-name">疾病和意外住院费用</text>
          <text class="item-amount">30,000 元</text>
        </view>
        <view class="item">
          <text class="item-name">意外门诊急诊费用</text>
          <text class="item-amount">3,000 元</text>
        </view>
      </view>

      <view class="section">
        <view class="section-title">特约条款</view>
        <view class="special-note">
          <text>本产品承保年龄为6到25周岁学生，本产品每人限购1份</text>
        </view>
      </view>

      <view class="section">
        <view class="section-title">意外伤害门诊医疗</view>
        <view class="detail-text">
          <text>社保目录内赔付，免赔100元后按照80%比例赔付</text>
        </view>
        <view class="detail-text">
          <text>疫苗类赔付限额500元</text>
        </view>
      </view>

      <view class="section">
        <view class="section-title">住院医疗</view>
        <view class="detail-text">
          <text class="sub-title">经医保报销情况：</text>
          <text
            >社保目录内赔付，经医保报销或其他商业保险机构报销后，免赔100元后，剩余部分按照90%比例赔付</text
          >
        </view>
        <view class="detail-text">
          <text class="sub-title">未经医保报销情况：</text>
          <text
            >免赔100元后，剩余部分按如下规定分级累进比例给付医疗保险金：</text
          >
        </view>
        <view class="payment-scale">
          <view class="scale-item">
            <text>• 100元以上至1,000元部分：按50%给付保险金</text>
          </view>
          <view class="scale-item">
            <text>• 1,000元以上至5,000元部分：按60%给付保险金</text>
          </view>
          <view class="scale-item">
            <text>• 5,000元以上至10,000元部分：按70%给付保险金</text>
          </view>
          <view class="scale-item">
            <text>• 10,000元以上至30,000元部分：按80%给付保险金</text>
          </view>
          <view class="scale-item">
            <text>• 30,000元以上部分：按90%给付保险金</text>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-title">理赔服务</view>
        <view class="claim-info">
          <view class="claim-item">
            <text class="claim-label">报案电话：</text>
            <text class="claim-value">安华农业保险 95540</text>
          </view>
          <view class="claim-item">
            <text class="claim-note">需用保单号报案</text>
          </view>
          <view class="claim-item">
            <text class="claim-label">理赔方式：</text>
            <text class="claim-value">电话报案，报案成功后有理赔老师对接</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-buttons">
      <button
        class="bottom-btn payment-btn"
        @click="navigateTo('/pages/form/form')"
      >
        缴费
      </button>
      <button
        class="bottom-btn personal-btn"
        @click="navigateTo('/pages/personal/personal')"
      >
        个人中心
      </button>
    </view>
  </view>
</template>

<script>
import Auth from "../../utils/auth.js";
import api from "../../utils/api.js";
export default {
  data() {
    return {
      title: "首页",
    };
  },
  onLoad() {
    if (Auth.isLoggedIn()) {
      api.user.getProfile().then((res) => {
        console.log(res);
        if (res.code == 0) {
          Auth.setUserInfo(res.data);
        }
      });
    }
  },
  methods: {
    navigateTo(url) {
      // 检查是否已登录
      if (!Auth.isLoggedIn()) {
        // 未登录，跳转到登录页面
        uni.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }

      // 已登录，正常跳转
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
  min-height: 100vh;
  background-color: #f5f5f5;
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

/* 新增的保障说明样式 */
.insurance-content {
  flex: 1;
  padding: 20rpx;
  margin-bottom: 120rpx;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
  padding: 30rpx 0;
  background: linear-gradient(135deg, #007aff, #0056b3);
  border-radius: 20rpx;
}

.header .title {
  font-size: 40rpx;
  font-weight: bold;
  color: white;
}

.section {
  background-color: white;
  margin-bottom: 20rpx;
  padding: 30rpx;
  border-radius: 15rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  padding-bottom: 10rpx;
  border-bottom: 2rpx solid #007aff;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #eee;
}

.item:last-child {
  border-bottom: none;
}

.item-name {
  font-size: 28rpx;
  color: #333;
}

.item-amount {
  font-size: 28rpx;
  font-weight: bold;
  color: #007aff;
}

.special-note {
  background-color: #fff3cd;
  padding: 20rpx;
  border-radius: 10rpx;
  border-left: 4rpx solid #ffc107;
}

.special-note text {
  font-size: 26rpx;
  color: #856404;
  line-height: 1.5;
}

.detail-text {
  margin-bottom: 15rpx;
  line-height: 1.6;
}

.detail-text text {
  font-size: 26rpx;
  color: #666;
}

.sub-title {
  font-weight: bold;
  color: #333 !important;
  display: block;
  margin-bottom: 10rpx;
}

.payment-scale {
  background-color: #f8f9fa;
  padding: 20rpx;
  border-radius: 10rpx;
  margin-top: 15rpx;
}

.scale-item {
  margin-bottom: 10rpx;
}

.scale-item text {
  font-size: 24rpx;
  color: #495057;
  line-height: 1.5;
}

.claim-info {
  background-color: #e7f3ff;
  padding: 20rpx;
  border-radius: 10rpx;
}

.claim-item {
  margin-bottom: 15rpx;
  display: flex;
  flex-wrap: wrap;
}

.claim-item:last-child {
  margin-bottom: 0;
}

.claim-label {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  margin-right: 10rpx;
}

.claim-value {
  font-size: 26rpx;
  color: #007aff;
  font-weight: bold;
}

.claim-note {
  font-size: 24rpx;
  color: #666;
  margin-left: 20rpx;
}

/* 底部按钮样式 */
.bottom-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: white;
  padding: 20rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.bottom-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 30rpx;
  font-weight: bold;
  margin: 0 10rpx;
}

.payment-btn {
  background-color: #007aff;
  color: white;
}

.payment-btn:active {
  background-color: #0056b3;
}

.personal-btn {
  background-color: #6c757d;
  color: white;
}

.personal-btn:active {
  background-color: #545b62;
}
</style>
