/**
 * 应用配置文件
 */

// 环境配置
const ENV_CONFIG = {
  // 开发环境
  development: {
    baseURL: "http://192.168.11.111:8080",
    apiPrefix: "/api",
    timeout: 10000,
    debug: true,
  },

  // 测试环境
  test: {
    baseURL: "https://test-api.your-domain.com",
    apiPrefix: "/api",
    timeout: 15000,
    debug: true,
  },

  // 生产环境
  production: {
    baseURL: "https://api.your-domain.com",
    apiPrefix: "/api",
    timeout: 15000,
    debug: false,
  },
};

// 获取当前环境
const getCurrentEnv = () => {
  // #ifdef MP-WEIXIN
  // 微信小程序环境判断
  const accountInfo = uni.getAccountInfoSync();
  if (accountInfo.miniProgram.envVersion === "develop") {
    return "development";
  } else if (accountInfo.miniProgram.envVersion === "trial") {
    return "test";
  } else {
    return "production";
  }
  // #endif

  // #ifdef H5
  // H5环境判断
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    return "development";
  } else if (location.hostname.includes("test")) {
    return "test";
  } else {
    return "production";
  }
  // #endif

  // 默认返回开发环境
  return "development";
};

// 当前环境
const currentEnv = getCurrentEnv();

// 当前环境配置
const config = ENV_CONFIG[currentEnv];

// API接口地址配置
const API_CONFIG = {
  // 用户相关
  user: {
    profile: "/app-api/member/user/get",
    updateProfile: "/app-api/member/user/update",
  },

  // 支付相关
  payment: {
    create: "/app-api/bxgm/order/createOrder",
    verify: "/payment/verify",
    list: "/payment/list",
    detail: "/payment/detail",
  },

  // 文件上传
  upload: {
    image: "/upload/image",
    file: "/upload/file",
  },

  // 其他业务接口
  business: {
    form: "/app-api/bxgm/order/create",
    list: "/app-api/bxgm/order/list",
    detail: "/app-api/bxgm/order/get",
  },
};

// 状态码配置
const STATUS_CODE = {
  SUCCESS: 0,
  ERROR: -1,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// 错误信息配置
const ERROR_MSG = {
  NETWORK_ERROR: "网络连接失败，请检查网络",
  TIMEOUT_ERROR: "请求超时，请重试",
  SERVER_ERROR: "服务器错误，请稍后重试",
  UNAUTHORIZED: "登录已过期，请重新登录",
  FORBIDDEN: "没有权限访问",
  NOT_FOUND: "请求的资源不存在",
};

// 导出配置
export { config, API_CONFIG, STATUS_CODE, ERROR_MSG, currentEnv };

export default {
  ...config,
  api: API_CONFIG,
  statusCode: STATUS_CODE,
  errorMsg: ERROR_MSG,
  env: currentEnv,
};
