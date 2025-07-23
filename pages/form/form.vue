<template>
  <view class="form-container">
    <view class="header">
      <text class="title">保险信息填写</text>
    </view>

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
            v-model="formData.policyholder.name"
            placeholder="请输入投保人姓名"
            maxlength="20"
          />
        </view>

        <view class="form-item">
          <text class="label">身份证号 <text class="required">*</text></text>
          <input
            class="input"
            v-model="formData.policyholder.idCard"
            placeholder="请输入身份证号码"
            maxlength="18"
            type="idcard"
          />
        </view>

        <view class="form-item">
          <text class="label">联系电话 <text class="required">*</text></text>
          <input
            class="input"
            v-model="formData.policyholder.phone"
            placeholder="请输入手机号码"
            maxlength="11"
            type="number"
          />
        </view>

        <view class="form-item">
          <text class="label">住址 <text class="required">*</text></text>
          <textarea
            class="textarea"
            v-model="formData.policyholder.address"
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
            v-model="formData.insured.name"
            placeholder="请输入被保险人姓名"
            maxlength="20"
          />
        </view>

        <view class="form-item">
          <text class="label">身份证号 <text class="required">*</text></text>
          <input
            class="input"
            v-model="formData.insured.idCard"
            placeholder="请输入身份证号码"
            maxlength="18"
            type="idcard"
          />
        </view>

        <view class="form-item">
          <text class="label">联系电话 <text class="required">*</text></text>
          <input
            class="input"
            v-model="formData.insured.phone"
            placeholder="请输入手机号码"
            maxlength="11"
            type="number"
          />
        </view>

        <view class="form-item">
          <text class="label">住址 <text class="required">*</text></text>
          <textarea
            class="textarea"
            v-model="formData.insured.address"
            placeholder="请输入详细住址"
            maxlength="100"
          />
        </view>

        <view class="form-item">
          <text class="label">学校 <text class="required">*</text></text>
          <input
            class="input"
            v-model="formData.insured.school"
            placeholder="请输入学校名称"
            maxlength="50"
          />
        </view>

        <view class="form-item">
          <text class="label">班级 <text class="required">*</text></text>
          <input
            class="input"
            v-model="formData.insured.class"
            placeholder="请输入班级"
            maxlength="20"
          />
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <button class="submit-btn" @click="submitForm">提交信息</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "Form",
  data() {
    return {
      formData: {
        policyholder: {
          name: "",
          idCard: "",
          phone: "",
          address: "",
        },
        insured: {
          name: "",
          idCard: "",
          phone: "",
          address: "",
          school: "",
          class: "",
        },
      },
    };
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
    submitForm() {
      // 验证投保人信息
      if (!this.validateRequired(this.formData.policyholder.name, "投保人姓名"))
        return;
      if (
        !this.validateRequired(
          this.formData.policyholder.idCard,
          "投保人身份证号"
        )
      )
        return;
      if (!this.validateIdCard(this.formData.policyholder.idCard)) {
        uni.showToast({
          title: "投保人身份证号格式不正确",
          icon: "none",
        });
        return;
      }
      if (
        !this.validateRequired(
          this.formData.policyholder.phone,
          "投保人联系电话"
        )
      )
        return;
      if (!this.validatePhone(this.formData.policyholder.phone)) {
        uni.showToast({
          title: "投保人手机号格式不正确",
          icon: "none",
        });
        return;
      }
      if (
        !this.validateRequired(this.formData.policyholder.address, "投保人住址")
      )
        return;

      // 验证被保险人信息
      if (!this.validateRequired(this.formData.insured.name, "被保险人姓名"))
        return;
      if (
        !this.validateRequired(this.formData.insured.idCard, "被保险人身份证号")
      )
        return;
      if (!this.validateIdCard(this.formData.insured.idCard)) {
        uni.showToast({
          title: "被保险人身份证号格式不正确",
          icon: "none",
        });
        return;
      }
      if (
        !this.validateRequired(this.formData.insured.phone, "被保险人联系电话")
      )
        return;
      if (!this.validatePhone(this.formData.insured.phone)) {
        uni.showToast({
          title: "被保险人手机号格式不正确",
          icon: "none",
        });
        return;
      }
      if (!this.validateRequired(this.formData.insured.address, "被保险人住址"))
        return;
      if (!this.validateRequired(this.formData.insured.school, "学校")) return;
      if (!this.validateRequired(this.formData.insured.class, "班级")) return;

      // 所有验证通过，提交数据
      console.log("表单数据:", this.formData);
      uni.showToast({
        title: "信息提交成功",
        icon: "success",
      });

      // 这里可以添加实际的提交逻辑
      // this.submitToServer();
    },

    // 提交到服务器的方法（示例）
    submitToServer() {
      // 这里添加实际的API调用
      // uni.request({
      //   url: 'your-api-url',
      //   method: 'POST',
      //   data: this.formData,
      //   success: (res) => {
      //     console.log('提交成功:', res);
      //   },
      //   fail: (err) => {
      //     console.error('提交失败:', err);
      //   }
      // });
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
</style>
