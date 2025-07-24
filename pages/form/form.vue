<template>
  <view class="form-container">
    <view class="form-content">
      <!-- 投保人信息 -->
      <view class="section">
        <view class="section-title">
          <text class="section-text">投保人信息</text>
        </view>

        <view class="form-item">
          <text class="label">姓名 <text class="required">*</text></text>
          <input
            class="input"
            v-model="formData.tbName"
            placeholder="请输入投保人姓名"
            maxlength="20"
          />
        </view>

        <view class="form-item">
          <text class="label">身份证号 <text class="required">*</text></text>
          <input
            class="input"
            v-model="formData.tbIdCard"
            placeholder="请输入身份证号码"
            maxlength="18"
            type="idcard"
          />
        </view>

        <view class="form-item">
          <text class="label">联系电话 <text class="required">*</text></text>
          <input
            class="input"
            v-model="formData.tbPhone"
            placeholder="请输入手机号码"
            maxlength="11"
            type="number"
          />
        </view>

        <view class="form-item">
          <text class="label">住址 <text class="required">*</text></text>
          <textarea
            class="textarea"
            v-model="formData.tbAddress"
            placeholder="请输入详细住址"
            maxlength="100"
          />
        </view>
      </view>

      <!-- 被保险人信息 -->
      <view class="section">
        <view class="section-title">
          <text class="section-text">被保险人信息</text>
        </view>

        <view class="form-item">
          <text class="label">姓名 <text class="required">*</text></text>
          <input
            class="input"
            v-model="formData.bbName"
            placeholder="请输入被保险人姓名"
            maxlength="20"
          />
        </view>

        <view class="form-item">
          <text class="label">身份证号 <text class="required">*</text></text>
          <input
            class="input"
            v-model="formData.bbIdCard"
            placeholder="请输入身份证号码"
            maxlength="18"
            type="idcard"
          />
        </view>

        <view class="form-item">
          <text class="label">联系电话 <text class="required">*</text></text>
          <input
            class="input"
            v-model="formData.bbPhone"
            placeholder="请输入手机号码"
            maxlength="11"
            type="number"
          />
        </view>

        <view class="form-item">
          <text class="label">住址 <text class="required">*</text></text>
          <textarea
            class="textarea"
            v-model="formData.bbAddress"
            placeholder="请输入详细住址"
            maxlength="100"
          />
        </view>

        <view class="form-item">
          <text class="label">学校 <text class="required">*</text></text>
          <input
            class="input"
            v-model="formData.bbSchool"
            placeholder="请输入学校名称"
            maxlength="50"
          />
        </view>

        <view class="form-item">
          <text class="label">班级 <text class="required">*</text></text>
          <input
            class="input"
            v-model="formData.bbClass"
            placeholder="请输入班级"
            maxlength="20"
          />
        </view>
      </view>

      <!-- 快速填写按钮 -->
      <view class="quick-fill-section">
        <button class="quick-fill-btn" @click="quickFill">
          快速填写测试数据
        </button>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <button class="submit-btn" @click="submitForm" :disabled="isSubmitting">
          {{ isSubmitting ? "提交中..." : "提交信息" }}
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import request from "../../utils/request.js";
import Auth from "../../utils/auth.js";

export default {
  name: "Form",
  data() {
    return {
      isSubmitting: false,
      formData: {
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
        payPrice: "1",
        openid: "",
      },
    };
  },
  onLoad() {
    // 从缓存中获取openid
    const openid = Auth.getOpenid();
    if (openid) {
      this.formData.openid = openid;
    }
  },
  methods: {
    // 验证身份证号
    validateIdCard(idCard) {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      return reg.test(idCard);
    },

    // 验证手机号
    validatePhone(phone) {
      const reg = /^1[3-9]\d{9}$/;
      return reg.test(phone);
    },

    // 验证必填项
    validateRequired(value, fieldName) {
      if (!value || value.trim() === "") {
        uni.showToast({
          title: `请填写${fieldName}`,
          icon: "none",
        });
        return false;
      }
      return true;
    },

    // 提交表单
    async submitForm() {
      if (this.isSubmitting) return;

      // 验证投保人信息
      if (!this.validateRequired(this.formData.tbName, "投保人姓名")) return;
      if (!this.validateRequired(this.formData.tbIdCard, "投保人身份证号"))
        return;
      if (!this.validateIdCard(this.formData.tbIdCard)) {
        uni.showToast({
          title: "投保人身份证号格式不正确",
          icon: "none",
        });
        return;
      }
      if (!this.validateRequired(this.formData.tbPhone, "投保人联系电话"))
        return;
      if (!this.validatePhone(this.formData.tbPhone)) {
        uni.showToast({
          title: "投保人手机号格式不正确",
          icon: "none",
        });
        return;
      }
      if (!this.validateRequired(this.formData.tbAddress, "投保人住址")) return;

      // 验证被保险人信息
      if (!this.validateRequired(this.formData.bbName, "被保险人姓名")) return;
      if (!this.validateRequired(this.formData.bbIdCard, "被保险人身份证号"))
        return;
      if (!this.validateIdCard(this.formData.bbIdCard)) {
        uni.showToast({
          title: "被保险人身份证号格式不正确",
          icon: "none",
        });
        return;
      }
      if (!this.validateRequired(this.formData.bbPhone, "被保险人联系电话"))
        return;
      if (!this.validatePhone(this.formData.bbPhone)) {
        uni.showToast({
          title: "被保险人手机号格式不正确",
          icon: "none",
        });
        return;
      }
      if (!this.validateRequired(this.formData.bbAddress, "被保险人住址"))
        return;
      if (!this.validateRequired(this.formData.bbSchool, "学校")) return;
      if (!this.validateRequired(this.formData.bbClass, "班级")) return;

      // 所有验证通过，提交数据
      await this.submitToServer();
    },

    // 快速填写测试数据
    quickFill() {
      // 保留当前的openid值
      const currentOpenid = this.formData.openid;

      this.formData = {
        tbName: "张三",
        tbIdCard: "110101199001011234",
        tbPhone: "13800138000",
        tbAddress: "北京市朝阳区朝阳路123号",
        bbName: "李四",
        bbIdCard: "110101200501012345",
        bbPhone: "13900139000",
        bbAddress: "北京市朝阳区朝阳路456号",
        bbSchool: "北京市第一中学",
        bbClass: "高三(1)班",
        payPrice: "1",
        openid: currentOpenid, // 保持openid不变
      };

      uni.showToast({
        title: "测试数据填写完成",
        icon: "success",
        duration: 1500,
      });
    },

    // 提交到服务器
    async submitToServer() {
      this.isSubmitting = true;

      try {
        // 显示加载提示
        uni.showLoading({
          title: "提交中...",
          mask: true,
        });

        const response = await request.post(
          "/app-api/bxgm/order/create",
          this.formData
        );

        console.log("提交成功:", response);

        uni.hideLoading();

        uni.showToast({
          title: "信息提交成功",
          icon: "success",
          duration: 1500,
        });

        // 延迟跳转到支付页面，让用户看到成功提示
        setTimeout(() => {
          // 构建支付页面参数
          const paymentParams = {
            id: response.data,
          };

          // 跳转到支付页面
          const queryString = Object.keys(paymentParams)
            .map((key) => `${key}=${encodeURIComponent(paymentParams[key])}`)
            .join("&");
          uni.redirectTo({
            url: `/pages/payment/payment?${queryString}`,
          });
        }, 1500);
      } catch (error) {
        console.error("提交失败:", error);

        uni.hideLoading();

        // 根据错误类型显示不同的提示
        let errorMessage = "提交失败，请重试";
        if (error.message) {
          errorMessage = error.message;
        } else if (error.errMsg) {
          errorMessage = error.errMsg;
        }

        uni.showToast({
          title: errorMessage,
          icon: "none",
          duration: 3000,
        });
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
.form-container {
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

.form-content {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
}

.section {
  margin-bottom: 40rpx;
}

.section-title {
  border-bottom: 2rpx solid #e0e0e0;
  padding-bottom: 20rpx;
  margin-bottom: 30rpx;
}

.section-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
  font-weight: 500;
}

.required {
  color: #ff4757;
}

.input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background-color: #fff;
  box-sizing: border-box;
}

.textarea {
  width: 100%;
  height: 120rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  padding: 20rpx;
  font-size: 28rpx;
  background-color: #fff;
  box-sizing: border-box;
  resize: none;
}

.input:focus,
.textarea:focus {
  border-color: #007aff;
  outline: none;
}

.submit-section {
  margin-top: 60rpx;
  padding: 0 20rpx;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #007aff, #0056cc);
  color: #fff;
  border: none;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.submit-btn[disabled] {
  background: #cccccc !important;
  color: #999999 !important;
  cursor: not-allowed;
}

.submit-btn[disabled]:active {
  transform: none;
  opacity: 1;
}

.quick-fill-section {
  margin-top: 40rpx;
  margin-bottom: 20rpx;
  padding: 0 20rpx;
}

.quick-fill-btn {
  width: 100%;
  height: 76rpx;
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: #fff;
  border: none;
  border-radius: 38rpx;
  font-size: 28rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-fill-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}
</style>
