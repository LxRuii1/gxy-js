/**
 * 接口请求方法封装
 */
// 导入环境配置
var axios = require('axios').default;
// import axios from 'axios';


// 公共配置
function _empty(v) {
	let tp = typeof v,
		rt = false;
	if (tp == "number" && String(v) == "") {
		rt = true
	} else if (tp == "undefined") {
		rt = true
	} else if (tp == "object") {
		if (JSON.stringify(v) == "{}" || JSON.stringify(v) == "[]" || v == null) rt = true
	} else if (tp == "string") {
		if (v == "" || v == "undefined" || v == "null" || v == "{}" || v == "[]") rt = true
	} else if (tp == "function") {
		rt = false
	}
	return rt
}

let API_BASE_PATH = ''
// 设置统一的请求url
axios.defaults.baseURL = API_BASE_PATH;
// 设置axios超时时长
axios.defaults.timeout = '60000';


// axios 默认配置
// 设置默认请求头
axios.defaults.headers = {
	// 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	'Content-Type': 'application/json;charset=UTF-8',
};

exports.ajax = function (option) {
	/**
	option = { // option配置说明
		url,
		header,
		method,
		params, // params对象的值会作为字符串拼接在URL请求地址中
		needAuth,  // 是否让header里携带token
		contentType,
		noCode, // 不做code判断及相关处理
		noErrorMsg， // 不需要自动用showToast暴露错误信息
		dotToLogin: 不登录
	}
	*/
	return new Promise((resolve, reject) => {
		var c_url
		if (/^https?:\/\//.test(option.url)) {
			c_url = option.url
		} else {
			c_url = API_BASE_PATH + option.url
		}

		var header = {
			'Content-Type': 'application/json;charset=UTF-8', // ContentType:'application/json;charset=utf-8'
			'accept': 'application/json, text/plain, */*',
			"rolekey": 'student',
		}
		if (option.headers) {
			// console.log(option.headers);
			header = Object.assign({}, header, option.headers);
		}

		let paramsObj = {
			url: c_url,
			method: option.method || 'POST',
			headers: header
		};

		if (!_empty(option.params)) {
			paramsObj.params = option.params || {}; // query参数
		}
		if (!_empty(option.data)) {
			paramsObj.data = option.data || {}; // body参数
		}
		if (option.timeout) {
			paramsObj.timeout = option.timeout;
		}

		axios(paramsObj).then(res => {
			// console.log('res',res);
			if (res.data.code === undefined || res.data.code === null || res.data.code === 'undefined' || res.data.code === 'null') {
				res = {
					data: res.data,
					code: res.status,
					msg: res.statusText || '操作成功'
				}
			} else {
				res = res.data;
			}
			if (option.noCode) {
				resolve(res)
			} else {
				if (res.code != 200) {
					if (res.code == 401) {

					} else if (res.code == 403) {

					} else if (!_empty(res.msg) && res.msg !== '操作失败') {
						console.log(res.msg);
					}
				}
				resolve(res)
			}
		}).catch(ret => {
			reject(ret);
		})
	})
}

