/**
 * API接口模块
 * 统一管理所有业务接口
 */

import request from "./request.js";
import { API_CONFIG } from "./config.js";

/**
 * 用户相关接口
 */
export const userApi = {
  /**
   * 获取用户信息
   */
  getProfile() {
    return request.get(API_CONFIG.user.profile);
  },

  /**
   * 更新用户信息
   * @param {Object} data 用户数据
   */
  updateProfile(data) {
    return request.put(API_CONFIG.user.updateProfile, data);
  },
};

/**
 * 支付相关接口
 */
export const paymentApi = {
  /**
   * 创建支付订单
   * @param {Object} orderData 订单数据
   */
  createPayment(params) {
    return request.get(API_CONFIG.payment.create, params);
  },
};

/**
 * 文件上传接口
 */
export const uploadApi = {
  /**
   * 上传图片
   * @param {String} filePath 文件路径
   * @param {Object} formData 额外数据
   */
  uploadImage(filePath, formData = {}) {
    return request.upload(API_CONFIG.upload.image, filePath, formData, {
      name: "image",
    });
  },

  /**
   * 上传文件
   * @param {String} filePath 文件路径
   * @param {Object} formData 额外数据
   */
  uploadFile(filePath, formData = {}) {
    return request.upload(API_CONFIG.upload.file, filePath, formData, {
      name: "file",
    });
  },
};

/**
 * 业务相关接口
 */
export const businessApi = {
  /**
   * 提交表单
   * @param {Object} formData 表单数据
   */
  submitForm(formData) {
    return request.post(API_CONFIG.business.form, formData);
  },

  /**
   * 获取保险订单列表
   * @param {Object} params 查询参数
   */
  getOrderList(params = {}) {
    return request.get(API_CONFIG.business.list, params);
  },
  // 获取详情
  getOrderDetail(params) {
    return request.get(API_CONFIG.business.detail, params);
  },
  // 删除订单
  deleteOrder(id) {
    return request.delete(API_CONFIG.business.delete + "?id=" + id);
  },
};

/**
 * 微信相关接口
 */
export const wechatApi = {
  /**
   * 获取微信支付参数
   * @param {Object} orderInfo 订单信息
   */
  getWechatPayParams(orderInfo) {
    return request.post("/wechat/pay/create", {
      orderId: parseInt(orderInfo.orderId),
      amount: orderInfo.amount,
      description: orderInfo.description || "商品购买",
    });
  },

  /**
   * 微信登录
   * @param {Object} data 登录数据
   */
  wechatLogin(data) {
    return request.post("/app-api/member/auth/weixin-mini-app-login", data);
  },
};

// 默认导出所有API
export default {
  user: userApi,
  payment: paymentApi,
  upload: uploadApi,
  business: businessApi,
  wechat: wechatApi,
};
