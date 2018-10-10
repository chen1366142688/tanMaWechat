const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

let appUrl = getApp().globalData.url
// let appUrl = "../pages/"
// 发送请求
let http = (url , data, method, s) => {
  wx.request({
    url: appUrl + url,
    method : method,
    header : {"token" : wx.getStorageSync("userInfo").token},
    data : data,
    success : (res)=>{
      if (res.data.code == 10000){
        s(res.data.response)
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    },
    fail: function (info) {
      wx.showModal({
        title: '提示',
        content: '网络请求失败！',
      });
    }
  })
}











// 暴露这个文件里面的函数
module.exports = {
  formatTime: formatTime,
  http: http
}


