import request from '@/utils/request';

/**
 * 用户登录
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Promise} 返回 { token, userId, username }
 */
export function loginApi(username, password) {
  return request.post('/auth/login', { username, password });
}

/**
 * 用户注册
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Promise} 返回 { userId, username }
 */
export function registerApi(username, password) {
  return request.post('/auth/register', { username, password });
}
