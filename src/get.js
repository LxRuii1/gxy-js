var user = require('../serve')

// 全局变量
var phone
var password
var t
var userId
var token
var userId
var sign
var jrtime
var key = user.obj.serverJ


// 网络请求
var ajax = require('../components/axios/index')

// AES 加密
const AES = require('../components/aes/index.js')

function setAES() {
  // 账号加密
  let Pwphone = AES.AES.getAES(user.obj.phone)
  phone = Pwphone
  // console.log('账号----------' + phone);

  // 密码加密
  let passworld = AES.AES.getAES(user.obj.password)
  password = passworld
  // console.log('密码--------' + password);

  // 时间戳加密
  let date = new Date()
  let time = date.getTime()
  let pwt = AES.AES.getAES(time)
  t = pwt
  // console.log('时间戳-------' + t);
}
// setAES()

// 获取今日时间
function getdata() {
  var date = new Date();
  var y = date.getFullYear()
  var d = date.getDate();
  d <= 9 ? d = '0' + d : d = d + 0;
  var m = date.getMonth() + 1;
  m <= 9 ? m = '0' + m : m = m + 0;
  jrtime = `${y}-${m}-${d} 00:00:00 00:00:00` // 系统返回当前时间
}

// 登录
function getSign() {

  getdata() // 获取今日时间
  setAES() // 加密账密

  ajax.ajax({
    url: "https://api.moguding.net:9000/session/user/v3/login",
    // url: "https://twitter.com/",
    methods: "POST",
    header: {
      'content-type': 'application/json;charset=UTF-8',
    },
    data: {
      "version": "5.3.0",
      "password": password,
      "loginType": "android",
      "device": "android",
      "t": t,
      "phone": phone,
      "uuid": "",
    },
  }).then((res) => {
    if (res.code == 200) {
      console.log('登录成功');
      token = res.data.token
      userId = res.data.userId
      getdata()
      getMd5()
      getRb()
    }
  }).catch((err) => {
    getSign();
    console.log('超时了');
  })
}
// getSign()


// md5加密
var md5 = require("js-md5");
// 解析sign
function getMd5() {
  let uid = userId;
  let pid = 'f554902da5fb17f296d5f8fb3f8bc008';
  let d = 'day'
  let y = '3478cbbc33f84bd00d75d7dfa69e0daa'
  let s = uid + d + pid + user.obj.title + y
  sign = md5(s)
  // console.log(md5(s));
}

function getRb() {
  ajax.ajax({
    url: "https://api.moguding.net:9000/practice/paper/v4/save",
    methods: "POST",
    data: {
      "content": user.obj.content || 'abcdefghijklmnopqrstuvwxyz',
      "imageList": [],
      "planId": "f554902da5fb17f296d5f8fb3f8bc008",
      "reportTime": jrtime,
      "reportType": "day",
      "t": t,
      "title": user.obj.title || '日报',
    },
    headers: {
      "sign": sign,
      'authorization': token,
      'accept': 'application/json, text/plain, */*',
      "rolekey": 'student',
    }
  }).then((res) => {
    if (res.code == 200) {
      console.log('日报填写成功');
      getServers()
    }
  }).catch((err) => {
    getRb()
  });
}

// server酱推送
function getServers() {
  ajax.ajax({
    url: "https://sctapi.ftqq.com/" + key + ".send?title=" + '日报填写成功！！内容：' + user.obj.title + "&desp=" + user.obj.content,
    method: 'GET'
  }).catch((err) => {
    getServers()
  })
}



var app = {
  getSign: getSign()
}

module.exports = app
