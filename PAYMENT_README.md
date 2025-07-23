# 支付功能说明

## 功能概述

本项目实现了完整的微信支付功能，包括：

- 订单信息展示
- 微信支付集成
- 支付结果处理
- 支付成功页面

## 文件结构

```
pages/payment/payment.vue          # 支付页面
pages/payment-success/payment-success.vue  # 支付成功页面
utils/payment.js                   # 支付工具函数
static/wechat-pay.png             # 微信支付图标
```

## 主要功能

### 1. 支付页面 (pages/payment/payment.vue)

**功能特点：**

- 展示订单详细信息（订单号、商品名称、金额等）
- 支持微信支付方式选择
- 美观的 UI 设计，符合微信小程序规范
- 支付状态提示和错误处理

**页面结构：**

- 头部：显示"订单支付"标题
- 订单信息：展示订单详情
- 支付方式：选择微信支付
- 支付按钮：触发支付流程
- 支付说明：用户提示信息

### 2. 支付成功页面 (pages/payment-success/payment-success.vue)

**功能特点：**

- 成功图标和提示
- 订单信息确认
- 操作按钮（查看订单、返回首页）
- 温馨提示

### 3. 支付工具函数 (utils/payment.js)

**主要函数：**

- `wechatPay(orderInfo)`: 完整的微信支付流程
- `getWechatPayParams(orderInfo)`: 获取微信支付参数
- `requestWechatPayment(payParams)`: 调用微信支付
- `verifyPaymentResult(orderInfo)`: 验证支付结果
- `getErrorMessage(error)`: 获取错误信息
- `formatAmount(amount)`: 格式化金额
- `generateNonceStr(length)`: 生成随机字符串

## 使用方法

### 1. 跳转到支付页面

```javascript
// 从其他页面跳转到支付页面
uni.navigateTo({
  url: "/pages/payment/payment?orderId=YOUR_ORDER_ID",
});
```

### 2. 配置微信支付

在 `utils/payment.js` 中配置您的微信支付参数：

```javascript
const WECHAT_PAY_CONFIG = {
  appId: "YOUR_WECHAT_APP_ID", // 微信小程序AppID
  mchId: "YOUR_MERCHANT_ID", // 商户号
  apiKey: "YOUR_API_KEY", // API密钥
};
```

### 3. 配置后端 API

需要实现以下后端 API 接口：

1. **创建支付订单**

   ```
   POST /api/payment/wechat/create
   {
     "orderId": "订单ID",
     "amount": 9900,  // 金额（分）
     "description": "商品购买"
   }
   ```

2. **验证支付结果**
   ```
   POST /api/payment/verify
   {
     "orderId": "订单ID"
   }
   ```

## 支付流程

1. **用户进入支付页面**

   - 页面加载时获取订单信息
   - 展示订单详情和支付金额

2. **用户点击支付按钮**

   - 调用 `wechatPay()` 函数
   - 获取微信支付参数
   - 调用微信支付接口

3. **微信支付处理**

   - 用户确认支付
   - 微信处理支付请求
   - 返回支付结果

4. **支付结果处理**
   - 验证支付结果
   - 更新订单状态
   - 跳转到成功页面

## 错误处理

系统会自动处理以下错误情况：

- 网络请求失败
- 支付参数获取失败
- 用户取消支付
- 支付超时
- 支付失败

## 样式说明

- 使用微信绿色主题色 (#07c160)
- 响应式设计，适配不同屏幕尺寸
- 圆角设计，符合现代 UI 规范
- 渐变按钮效果
- 清晰的信息层级

## 注意事项

1. **微信支付配置**

   - 需要在微信商户平台配置支付参数
   - 确保小程序已通过微信审核
   - 配置正确的回调地址

2. **金额处理**

   - 金额以分为单位存储和传输
   - 显示时转换为元并保留两位小数

3. **安全性**

   - 支付参数由后端生成，前端不处理敏感信息
   - 支付结果需要后端验证
   - 使用 HTTPS 传输

4. **测试**
   - 开发环境使用微信支付沙箱
   - 生产环境使用正式微信支付

## 扩展功能

可以基于现有代码扩展以下功能：

- 支付宝支付
- 银行卡支付
- 优惠券使用
- 积分抵扣
- 分期付款

## 技术支持

如有问题，请联系开发团队或查看微信支付官方文档。
