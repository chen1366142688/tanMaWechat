// pages/My/Personal-Information/Personal-Information.js
const app = getApp().globalData
Page({
  data: {
    imgUrl: app.url,
    defaultImgUrl: app.url+'My/head-portrait.png',
    array: ['孩子本人', '孩子妈妈', '孩子爸爸'],
    objectArray: [
      {
        id: '01',
        name: '孩子本人'
      },
      {
        id: '02',
        name: '孩子妈妈'
      },
      { 
        id: '03',
        name: '孩子爸爸'
      }
    ],
    index: 0,
    array1: [],
    objectArray1: [],
    index1: 0,
    activeProvinceId: 510,
    activeProvince:'',
    array2: [],
    objectArray2: [],
    index2: 0,
    activecityId: 510100000000,
    activecityName:'',
    Height: 0,
    Weight: 0,
    onselfObj:{}
  },
  bindPickerChange(e) {
    let old = wx.getStorageSync('oldRelationCode');
    if (old) {
      wx.showToast({
        title: '当前关系不能改变',
        icon: 'none'
      })
      return false;
    }
    this.setData({
      index: e.detail.value
    })
    let relationCode = e.detail.value == '0' ? '01' : e.detail.value == '1' ? '02' : '03';
    this.modify(relationCode)
  },
  bindPickerChange1(e){
    const that = this;
    let index = e.detail.value;
    let objectArray1 = that.data.objectArray1;
    for (let i = 0; i < objectArray1.length; i++) {
      if (i == index) {
        that.setData({ activeProvinceId: objectArray1[i].provinceId, activeProvince: objectArray1[i].provinceName })
      }
    }
    this.setData({ index1: index })
    provinceInfo(that,1)
  },
  bindPickerChange2(e){
    const that = this;
    let index = e.detail.value;
    let objectArray2 = that.data.objectArray2;
    for (let i = 0; i < objectArray2.length; i++) {
      if (i == index) {
        that.setData({ activecityId: objectArray2[i].cityId, activecityName: objectArray2[i].cityName })
      }
    }
    this.setData({ index2: index })
    updatePatriarch(that)
  },
  alterphone () {
    wx.navigateTo({
      url: '../../../pages/My/Alter-Phone-number/Alter-Phone-number',
    })
  },
  alterpassword() {
    wx.navigateTo({
      url: '../../../pages/My/Alter-Password/Alter-Password',
    })
  },
  modifyImg (e) {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中..',
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        for (let i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.rQUrl + '/v1/file/upload', //仅为示例，非真实的接口地址
            header: { 
              'token': wx.getStorageSync('userInfo').oauthToken.token ,
              'content-type':'multipart/form-data'
            },
            filePath: tempFilePaths[i],
            name: 'muFiles',
            formData: {
              'type': 'user_img'
            },
            success(re) {
              var data = JSON.parse(re.data)
              if (data.code == '10000') {
                var photoAddress = data.response[0];
                let onselfObj = that.data.onselfObj;
                onselfObj.avatarUrl = photoAddress
                that.setData({ onselfObj: onselfObj })
                wx.request({
                  url: app.rQUrl + '/v1/patriarch/updatePatriarchAvatarUrl',
                  header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
                  method: 'GET',
                  data: {
                    'patriarchId': wx.getStorageSync('userInfo').patriarchId,
                    'avatarUrl': photoAddress
                  },
                  success(re) {
                    wx.hideLoading();
                    if(re.data.code == '10000'){
                      //修改成功
                    }else{
                      wx.showToast({
                        title: re.data.msg,
                        icon:'none'
                      })
                    }
                    
                  },
                  fail(info){
                    wx.hideLoading();
                    wx.showToast({
                      title: '上传失败',
                      icon:'none'
                    })
                  }
                })
              } else {
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: '图片大小超过5M,请重新上传'
                })
              }
            },
            fail(info){
              wx.hideLoading();
              wx.showToast({
                title: info.data.msg,
                icon:'none'
              })
            }
          })
        }
      }
    })
  },
  modifyName(e){
      wx.navigateTo({
      url: '../../../pages/My/Alter-Name/Alter-Name',
    })
  },
  modify(relationCode){
    wx.request({
      url: app.rQUrl + '/v1/patriarch/updatePatriarchRelation',
      method: 'GET',
      header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
      data: {
         patriarchId: wx.getStorageSync('userInfo').patriarchId,
        relationCode: relationCode
      },
      success(res) {
        if (res.data.code == '10000') {
          console.log("修改成功")
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail(info) {
        wx.showToast({
          title: info.data.msg,
          icon: 'none'
        })
      }
    })
  },
  sinOut(e){
    wx.setStorageSync('userInfo',{});
    wx.redirectTo({
      url: '../../../pages/login/Register/Register',
    })
  },
  onLoad(options) { },
  onReady () { },
  onShow () {
    let activeProvince = wx.getStorageSync('userInfo').provinceId;
    let activecityName = wx.getStorageSync('userInfo').cityId;
    this.setData({ activeProvince: activeProvince, activecityName: activecityName })
    oneself(this)
    provinceAll(this)
   },
  onHide () { },
  onUnload () { },
  onPullDownRefresh () { },
  onReachBottom () { },
  onShareAppMessage () { }
})
function oneself(that) {
  wx.request({
    url: app.rQUrl + '/v1/patriarch/getPatriarchInfo',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
    data: { patriarchId: wx.getStorageSync('userInfo').patriarchId },
    success(res) {
      if (res.data.code == '10000') {
        let results = res.data.response;
        let phone = String(results.phoneNum);
        results.phoneNum = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        results.relationCode == '01' ? that.setData({ index: 0 }) : results.relationCode == '02' ? that.setData({ index: 1 }) : that.setData({ index: 2 })
        that.setData({
          onselfObj: results
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    },
    fail(info) {
      wx.showToast({
        title: info.data.msg,
        icon:'none'
      })
    }
  })
}
//获取所有省份信息
function provinceAll(that) {
  wx.request({
    url: app.rQUrl + '/v1/regionInfo/get/allProvinceInfo',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token || '1' },
    data: {},
    success(res) {
      if (res.data.code == '10000') {
        let result = res.data.response;
        let len = result.length;
        let array = new Array();
        for (let i = 0; i < len; i++) {
          if (result[i].provinceId == that.data.activeProvince) {
            that.setData({ index1: i, activeProvinceId: result[i].provinceId })
          }
          array.push(result[i].provinceName);
        }
        that.setData({ array1: array, objectArray1: result })
        provinceInfo(that,2)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    fail(info) {
      wx.showToast({
        title: info.data.msg,
        icon: 'none'
      })
    }
  })
}
//通过省份id查询所属城市列表
function provinceInfo(that,num) {
  wx.request({
    url: app.rQUrl + '/v1/regionInfo/get/allCityInfoByProvinceId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token || '1' },
    data: {
      provinceId: that.data.activeProvinceId
    },
    success(res) {
      if (res.data.code == '10000') {
        let result = res.data.response;
        let len = result.length;
        let array2 = new Array();
        for (let i = 0; i < len; i++) {
          if (result[i].cityId == that.data.activecityName) {
            that.setData({ index2: i, activecityId: result[i].cityId })
          } else {
            that.setData({ index2: 0, activecityId: result[0].cityId })
          }
          array2.push(result[i].cityName);
        }
        that.setData({ array2: array2, objectArray2: result })
        if (num == 1) {updatePatriarch(that)}
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    fail(info) {
      wx.showToast({
        title: info.data.msg,
        icon: 'none'
      })
    }
  })
}
//提交修改的所在城市
function updatePatriarch(that){
  wx.request({
    url: app.rQUrl +'/v1/patriarch/updatePatriarchAddr',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token || '1' },
    data: {
      provinceId: that.data.activeProvinceId,
      patriarchId: wx.getStorageSync('userInfo').patriarchId,
      cityId: that.data.activecityId
    },
    success(res){
      if(res.data.code == '10000'){
        let userInfo = wx.getStorageSync('userInfo');
        userInfo.provinceId = that.data.activeProvinceId;
        userInfo.cityId = that.data.activecityId;
        wx.setStorageSync('userInfo', userInfo)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    },
    fail(info){
      wx.showToast({
        title: info.data.msg,
        icon:'none'
      })
    }
  })
}