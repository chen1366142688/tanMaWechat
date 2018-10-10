const baseUrl = getApp().globalData.url;
const http = ({ url = '', param = {}, ...other } = {}) => {
  wx.showLoading({
    title: '加载中...',
    mask:true,
    duration:2000
  });
  let timeStart = Date.now();
  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(url),
      data: param,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('userInfo').token
      },
      ...other,
      complete: (res) => {
        // console.log(`请求用时${Date.now() - timeStart}`);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
          wx.hideLoading();
        } else {
          reject(res)
          wx.hideLoading();
        }
      }
    })
  })
}
const getUrl = (url) => {
  if (url.indexOf('://') == -1) {
    url = baseUrl + url;
  }
  return url
}

// get方法
const _get = (url, param = {}) => {
  return http({
    url,
    param
  })
}

const _post = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'post'
  })
}

const _put = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'put'
  })
}

const _delete = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'put'
  })
}

module.exports = {
  baseUrl,
  _get,
  _post,
  _put,
  _delete
}


/*************************使用方法******************************/
/**
 * const api = require('../../utils/api.js')

// 单个请求
api._get('list').then(res => {
  console.log(res)
}).catch(e => {
  console.log(e)
})
// 一个页面多个请求
Promise.all([
  api._get('list'),
  api._get(`detail/${id}`)
]).then(result => {
  console.log(result)
}).catch(e => {
  console.log(e)
})
 * **/