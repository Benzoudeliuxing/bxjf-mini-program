<template>
  <view class="privacy-container">
    <scroll-view class="content" scroll-y="true">
      <view class="privacy-content">
        <text class="section-title">学平险采集小程序隐私政策</text>

        <text class="update-time">更新日期：2025年7月25日</text>

        <view class="section">
          <text class="section-header">引言</text>
          <text class="section-text">
            感谢您使用学平险采集小程序。我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。我们致力于维持您对我们的信任，恪守以下原则，保护您的个人信息：权责一致原则、目的明确原则、选择同意原则、最少够用原则、确保安全原则、主体参与原则、公开透明原则等。
          </text>
        </view>

        <view class="section">
          <text class="section-header">我们收集的信息</text>
          <text class="section-text">
            为了向您提供更好的服务，我们可能会收集和使用以下信息：
          </text>
          <view class="list-item">
            <text class="bullet">•</text>
            <text class="list-text"
              >基本信息：包括您的昵称、头像等基本资料，用于您在小程序中的身份识别和个性化服务</text
            >
          </view>
          <view class="list-item">
            <text class="bullet">•</text>
            <text class="list-text"
              >个人信息：包括姓名、手机号、身份证号、学籍信息等，用于您在创建保险订单时信息的填写</text
            >
          </view>
          <view class="list-item">
            <text class="bullet">•</text>
            <text class="list-text"
              >设备信息：设备型号、操作系统版本、应用版本等</text
            >
          </view>
          <view class="list-item">
            <text class="bullet">•</text>
            <text class="list-text"
              >使用数据：您在使用小程序过程中产生的操作记录</text
            >
          </view>
        </view>

        <view class="section">
          <text class="section-header">信息使用目的</text>
          <text class="section-text">
            我们收集和使用您的个人信息，主要用于以下目的：
          </text>
          <view class="list-item">
            <text class="bullet">•</text>
            <text class="list-text">提供和维护小程序服务</text>
          </view>
          <view class="list-item">
            <text class="bullet">•</text>
            <text class="list-text">用户身份验证和账户安全</text>
          </view>
          <view class="list-item">
            <text class="bullet">•</text>
            <text class="list-text">改进和优化服务质量</text>
          </view>
          <view class="list-item">
            <text class="bullet">•</text>
            <text class="list-text">发送重要通知和服务信息</text>
          </view>
        </view>

        <view class="section">
          <text class="section-header">信息共享与披露</text>
          <text class="section-text">
            我们不会出售、出租或以其他方式披露您的个人信息给第三方，除非：
          </text>
          <view class="list-item">
            <text class="bullet">•</text>
            <text class="list-text">事先获得您明确的同意</text>
          </view>
          <view class="list-item">
            <text class="bullet">•</text>
            <text class="list-text">根据法律法规要求或政府主管部门的要求</text>
          </view>
          <view class="list-item">
            <text class="bullet">•</text>
            <text class="list-text">为维护我们或其他用户的合法权益</text>
          </view>
        </view>

        <view class="section">
          <text class="section-header">您的权利</text>
          <text class="section-text"> 关于您的个人信息，您享有以下权利： </text>
          <view class="list-item">
            <text class="bullet">•</text>
            <text class="list-text">查询、更正您的个人信息</text>
          </view>
          <view class="list-item">
            <text class="bullet">•</text>
            <text class="list-text">删除您的个人信息</text>
          </view>
          <view class="list-item">
            <text class="bullet">•</text>
            <text class="list-text">撤回授权同意</text>
          </view>
          <view class="list-item">
            <text class="bullet">•</text>
            <text class="list-text">投诉举报</text>
          </view>
        </view>

        <view class="section">
          <text class="section-header">未成年人保护</text>
          <text class="section-text">
            我们非常重视对未成年人个人信息的保护。若您是18周岁以下的未成年人，建议您请您的父母或监护人仔细阅读本隐私政策，并在征得您的父母或监护人同意后使用我们的服务或向我们提供信息。
          </text>
        </view>

        <view class="section">
          <text class="section-header">政策更新</text>
          <text class="section-text">
            我们可能会不时更新本隐私政策。更新后的隐私政策一旦公布即为有效，除非您停止使用我们的服务，否则将受到更新后的隐私政策的约束。
          </text>
        </view>

        <view class="section" v-if="false">
          <text class="section-header">联系我们</text>
          <text class="section-text">
            如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：
          </text>
          <view class="contact-info">
            <text class="contact-text">邮箱：privacy@example.com</text>
            <text class="contact-text">电话：400-000-0000</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: "Privacy",
  methods: {
    goBack() {
      uni.navigateBack();
    },
  },
  onLoad() {
    // 设置导航栏标题
    uni.setNavigationBarTitle({
      title: "隐私协议",
    });
  },
};
</script>

<style scoped>
.privacy-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #ffffff;
  border-bottom: 1rpx solid #e8e8e8;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  height: 88rpx;
}

.back-btn {
  font-size: 32rpx;
  color: #666666;
  font-weight: 500;
}

.title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
}

.placeholder {
  width: 100rpx;
}

.content {
  height: calc(100vh - 128rpx);
}

.privacy-content {
  padding: 40rpx 30rpx;
  background: #ffffff;
  margin: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 42rpx;
  font-weight: 700;
  color: #333333;
  display: block;
  text-align: center;
  margin-bottom: 20rpx;
  line-height: 1.4;
}

.update-time {
  font-size: 26rpx;
  color: #999999;
  display: block;
  text-align: center;
  margin-bottom: 50rpx;
}

.section {
  margin-bottom: 50rpx;
}

.section-header {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  display: block;
  margin-bottom: 24rpx;
  position: relative;
  padding-left: 20rpx;
}

.section-header::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8rpx;
  height: 36rpx;
  background: linear-gradient(135deg, #a5834e, #247b3f);
  border-radius: 4rpx;
}

.section-text {
  font-size: 30rpx;
  color: #666666;
  line-height: 1.8;
  display: block;
  margin-bottom: 20rpx;
}

.list-item {
  display: flex;
  margin-bottom: 16rpx;
  align-items: flex-start;
}

.bullet {
  font-size: 30rpx;
  color: #a5834e;
  margin-right: 16rpx;
  margin-top: 4rpx;
  font-weight: 600;
}

.list-text {
  font-size: 30rpx;
  color: #666666;
  line-height: 1.7;
  flex: 1;
}

.contact-info {
  margin-top: 20rpx;
  padding: 30rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border-left: 6rpx solid #a5834e;
}

.contact-text {
  font-size: 30rpx;
  color: #666666;
  display: block;
  margin-bottom: 12rpx;
  line-height: 1.6;
}

.contact-text:last-child {
  margin-bottom: 0;
}
</style>
