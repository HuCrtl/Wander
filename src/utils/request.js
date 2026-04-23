import axios from 'axios';

// 创建 Axios 实例，统一管理 API 请求
//全局 axios 配置会污染所有请求；多接口域名、多项目、多 token 场景，必须创建独立实例，实例配置互不影响。
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器：自动携带 Token
request.interceptors.request.use(
  (config) => {
    //成功：处理配置，必须返回config
    //1：从本地获取token，统一挂载请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    //2：开启全局loading
    //3：返回配置，继续发送请求
    return config;
  },
  (error) => {
    //请求配置出错，直接拒绝Promise
    return Promise.reject(error);
  }
);

// 响应拦截器：统一错误处理
request.interceptors.response.use(
  (response) => {
    //成功相应：直接返回后端核心data，业务代码不用写res.data
    return response;
  },
  (error) => {
    //响应错误：统一处理所有接口报错
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        alert('登录已过期，请重新登录');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      } else if (status === 500) {
        alert('服务器异常，请稍后重试');
      }
    } else {
      alert('网络连接失败，请检查网络');
    }
    return Promise.reject(error);
  }
);

export default request;
