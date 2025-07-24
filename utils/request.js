/**
 * 网络请求封装
 * 基于uni.request封装，提供统一的请求处理
 */

// 请求配置
const config = {
  // 基础URL，根据环境自动切换
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://192.168.11.111:8080"
      : "https://your-api-domain.com",

  // 请求超时时间60s
  timeout: 60000,

  // 默认请求头
  headers: {
    "Content-Type": "application/json",
  },

  // 是否显示loading
  showLoading: true,

  // loading文本
  loadingText: "请求中...",

  // 是否显示错误提示
  showError: true,
};

// 请求队列，用于管理loading状态
let requestQueue = [];

/**
 * 显示loading
 */
function showLoading(text = config.loadingText) {
  if (requestQueue.length === 0) {
    uni.showLoading({
      title: text,
      mask: true,
    });
  }
  requestQueue.push(1);
}

/**
 * 隐藏loading
 */
function hideLoading() {
  requestQueue.pop();
  if (requestQueue.length === 0) {
    uni.hideLoading();
  }
}

/**
 * 获取token
 */
function getToken() {
  return uni.getStorageSync("token") || "";
}

/**
 * 请求拦截器
 */
function requestInterceptor(options) {
  // 添加token
  const token = getToken();
  if (token) {
    options.header = {
      ...options.header,
      Authorization: `Bearer ${token}`,
    };
  }

  // 处理URL
  if (!options.url.startsWith("http")) {
    options.url = config.baseURL + options.url;
  }

  // 设置默认超时时间
  options.timeout = options.timeout || config.timeout;

  // 显示loading
  if (options.showLoading !== false && config.showLoading) {
    showLoading(options.loadingText);
  }

  console.log("请求发送:", options);
  return options;
}

/**
 * 响应拦截器
 */
function responseInterceptor(response, options) {
  // 隐藏loading
  if (options.showLoading !== false && config.showLoading) {
    hideLoading();
  }

  console.log("响应接收:", response);

  const { statusCode, data } = response;

  // HTTP状态码处理
  if (statusCode === 200) {
    // 业务状态码处理
    if (data.code === 0 || data.success === true) {
      return Promise.resolve(data);
    } else {
      // 业务错误
      const errorMsg = data.message || data.msg || "请求失败";

      // 特殊错误码处理
      if (data.code === 401 || data.code === 403) {
        handleAuthError();
        return Promise.reject(new Error("登录已过期，请重新登录"));
      }

      if (options.showError !== false && config.showError) {
        uni.showToast({
          title: errorMsg,
          icon: "none",
          duration: 2000,
        });
      }

      return Promise.reject(new Error(errorMsg));
    }
  } else {
    // HTTP错误
    const errorMsg = getHttpErrorMsg(statusCode);

    if (options.showError !== false && config.showError) {
      uni.showToast({
        title: errorMsg,
        icon: "none",
        duration: 2000,
      });
    }

    return Promise.reject(new Error(errorMsg));
  }
}

/**
 * 错误拦截器
 */
function errorInterceptor(error, options) {
  // 隐藏loading
  if (options.showLoading !== false && config.showLoading) {
    hideLoading();
  }

  console.error("请求错误:", error);

  let errorMsg = "网络请求失败";

  if (error.errMsg) {
    if (error.errMsg.includes("timeout")) {
      errorMsg = "请求超时，请检查网络连接";
    } else if (error.errMsg.includes("fail")) {
      errorMsg = "网络连接失败，请检查网络";
    }
  }

  if (options.showError !== false && config.showError) {
    uni.showToast({
      title: errorMsg,
      icon: "none",
      duration: 2000,
    });
  }

  return Promise.reject(new Error(errorMsg));
}

/**
 * 处理认证错误
 */
function handleAuthError() {
  // 清除token和用户信息
  uni.removeStorageSync("token");
  uni.removeStorageSync("userInfo");
  uni.removeStorageSync("isLoggedIn");

  // 跳转到登录页
  setTimeout(() => {
    uni.reLaunch({
      url: "/pages/login/login",
    });
  }, 1500);
}

/**
 * 获取HTTP错误信息
 */
function getHttpErrorMsg(statusCode) {
  const errorMap = {
    400: "请求参数错误",
    401: "未授权，请登录",
    403: "拒绝访问",
    404: "请求地址不存在",
    408: "请求超时",
    500: "服务器内部错误",
    502: "网关错误",
    503: "服务不可用",
    504: "网关超时",
  };

  return errorMap[statusCode] || `请求失败 (${statusCode})`;
}

/**
 * 核心请求方法
 */
function request(options) {
  return new Promise((resolve, reject) => {
    // 请求拦截
    const interceptedOptions = requestInterceptor({
      ...(config.headers && { header: config.headers }),
      ...options,
    });

    uni.request({
      ...interceptedOptions,
      success: (response) => {
        responseInterceptor(response, options).then(resolve).catch(reject);
      },
      fail: (error) => {
        errorInterceptor(error, options).catch(reject);
      },
    });
  });
}

/**
 * GET请求
 */
function get(url, params = {}, options = {}) {
  return request({
    url,
    method: "GET",
    data: params,
    ...options,
  });
}

/**
 * POST请求
 */
function post(url, data = {}, options = {}) {
  return request({
    url,
    method: "POST",
    data,
    ...options,
  });
}

/**
 * PUT请求
 */
function put(url, data = {}, options = {}) {
  return request({
    url,
    method: "PUT",
    data,
    ...options,
  });
}

/**
 * DELETE请求
 */
function del(url, params = {}, options = {}) {
  return request({
    url,
    method: "DELETE",
    data: params,
    ...options,
  });
}

/**
 * 文件上传
 */
function upload(url, filePath, formData = {}, options = {}) {
  return new Promise((resolve, reject) => {
    // 添加token
    const token = getToken();
    const header = {
      ...options.header,
    };
    if (token) {
      header["Authorization"] = `Bearer ${token}`;
    }

    // 处理URL
    if (!url.startsWith("http")) {
      url = config.baseURL + url;
    }

    // 显示loading
    if (options.showLoading !== false && config.showLoading) {
      showLoading("上传中...");
    }

    uni.uploadFile({
      url,
      filePath,
      name: options.name || "file",
      formData,
      header,
      success: (response) => {
        try {
          const data = JSON.parse(response.data);
          if (data.code === 0 || data.success === true) {
            resolve(data);
          } else {
            const errorMsg = data.message || data.msg || "上传失败";
            if (options.showError !== false && config.showError) {
              uni.showToast({
                title: errorMsg,
                icon: "none",
              });
            }
            reject(new Error(errorMsg));
          }
        } catch (error) {
          reject(new Error("响应数据解析失败"));
        }
      },
      fail: (error) => {
        const errorMsg = "上传失败，请重试";
        if (options.showError !== false && config.showError) {
          uni.showToast({
            title: errorMsg,
            icon: "none",
          });
        }
        reject(new Error(errorMsg));
      },
      complete: () => {
        if (options.showLoading !== false && config.showLoading) {
          hideLoading();
        }
      },
    });
  });
}

/**
 * 设置全局配置
 */
function setConfig(newConfig) {
  Object.assign(config, newConfig);
}

/**
 * 获取当前配置
 */
function getConfig() {
  return { ...config };
}

// 导出
export default {
  request,
  get,
  post,
  put,
  delete: del,
  upload,
  setConfig,
  getConfig,
};

// 便于解构导入
export { request, get, post, put, del as delete, upload, setConfig, getConfig };
