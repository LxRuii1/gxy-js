var CryptoJS = require("crypto-js");
/**
  * 
  * 第一个参数word是待加密或者解密的字符串；
  * 第二个参数keyStr是aes加密需要用到的16位字符串的key；
  * 
  * 如果想对一个js对象加密，需要先把该对象转成json字符串。 
  */
module.exports.AES = {
  // 加密
  encrypt(word) {
    let key = CryptoJS.enc.Utf8.parse('23DbtQHR2UMbH6mJ');
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    return encrypted = encrypted.ciphertext.toString();
  },
  // 解密
  decrypt(word, keyStr) {
    keyStr = keyStr ? keyStr : "23DbtQHR2UMbH6mJ";
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var decrypt = CryptoJS.AES.decrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  },
  getAES(data) {
    let str = this.encrypt(data)
    return str.toUpperCase()
  },
};

