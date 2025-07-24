/**
 * 支付工具类
 */

import { wechatApi, paymentApi } from "./api.js";
import api from "./api.js";

// 微信支付配置
const WECHAT_PAY_CONFIG = {
  // 这里需要配置您的微信支付参数
  appId: "", // 微信小程序AppID
  mchId: "", // 商户号
  apiKey: "", // API密钥
};

/**
 * 获取微信支付参数
 * @param {Object} orderInfo 订单信息
 * @returns {Promise} 支付参数
 */
export async function getWechatPayParams(orderInfo) {
  try {
    // 确保orderId为整数类型
    const paymentData = {
      ...orderInfo,
      orderId: parseInt(orderInfo.orderId),
    };

    const result = await api.payment.createPayment(paymentData);
    return result.data;
  } catch (error) {
    throw new Error(error.message || "获取支付参数失败");
  }
}

/**
 * 调用微信支付
 * @param {Object} payParams 支付参数
 * @returns {Promise} 支付结果
 */
export function requestWechatPayment(payParams) {
  return new Promise((resolve, reject) => {
    uni.requestPayment({
      provider: "wxpay",
      timeStamp: payParams.timeStamp,
      nonceStr: payParams.nonceStr,
      package: payParams.package,
      signType: payParams.signType,
      paySign: payParams.paySign,
      success: (res) => {
        resolve({
          success: true,
          data: res,
        });
      },
      fail: (err) => {
        resolve({
          success: false,
          error: err,
        });
      },
    });
  });
}

/**
 * 验证支付结果
 * @param {Object} orderInfo 订单信息
 * @returns {Promise} 验证结果
 */
export async function verifyPaymentResult(orderInfo) {
  try {
    const result = await paymentApi.verifyPayment({
      orderId: parseInt(orderInfo.orderId),
    });
    return result.data;
  } catch (error) {
    throw new Error(error.message || "验证支付结果失败");
  }
}

/**
 * 完整的微信支付流程
 * @param {Object} orderInfo 订单信息
 * @returns {Promise} 支付结果
 */
export async function wechatPay(orderInfo) {
  try {
    // 1. 获取支付参数
    const payParams = await getWechatPayParams(orderInfo);

    // 2. 调用微信支付
    const payResult = await requestWechatPayment(payParams);

    if (payResult.success) {
      // 3. 验证支付结果
      const verifyResult = await verifyPaymentResult(orderInfo);

      return {
        success: true,
        data: verifyResult,
      };
    } else {
      return {
        success: false,
        error: payResult.error,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 格式化金额
 * @param {number} amount 金额（分）
 * @returns {string} 格式化后的金额
 */
export function formatAmount(amount) {
  return (amount / 100).toFixed(2);
}

/**
 * 生成随机字符串
 * @param {number} length 字符串长度
 * @returns {string} 随机字符串
 */
export function generateNonceStr(length = 32) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 获取错误信息
 * @param {Object} error 错误对象
 * @returns {string} 错误信息
 */
export function getErrorMessage(error) {
  if (typeof error === "string") {
    return error;
  }

  if (error.errMsg) {
    if (error.errMsg.includes("cancel")) {
      return "支付已取消";
    } else if (error.errMsg.includes("fail")) {
      return "支付失败，请重试";
    } else if (error.errMsg.includes("timeout")) {
      return "支付超时，请重试";
    }
  }

  return "支付失败，请重试";
}
