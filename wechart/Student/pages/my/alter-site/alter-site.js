// pages/my/alter-site/alter-site.js
const app = getApp().globalData
Page({
  data: {
    url:'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/',
    array: ['--'],
    objectArray: [],
    array1: ['--市'],
    objectArray1: ['请选择省份'],
    array2: ['--区'],
    objectArray2: ['请选择市区'],
    index: 0,
    index1: 0,
    index2: 0,
    province:'',
    provinceName: '',
    cityId:'',
    cityName:"",
    county:'',
    countyName:"",
    address:'请输入详细地址',
    addr:'',
    diss:false,
    location:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    if(options.index){//这是从课程首页过来的
      that.setData({ location: options.index })
    }
      if(options.diss=='true'){
        that.setData({
          diss: options.diss
        })
      } else if (options.diss == 'false'){
        that.setData({
          diss: options.diss
        })
      }
  },
  
  subMit:function(e){
    if(this.data.location=='1'){
        let locationInfo = wx.getStorageSync('LOCATION_INFO');
        locationInfo.provinceId = this.data.province;
        locationInfo.provinceName = this.data.provinceName;
        locationInfo.cityId = this.data.cityId;
        locationInfo.cityName = this.data.cityName;
        locationInfo.countyId = this.data.county;
        locationInfo.countyName = this.data.countyName;
        locationInfo.address = this.data.addr;
        wx.setStorageSync('LOCATION_INFO', locationInfo);
        wx.switchTab({
          url: '../../../pages/keChen/keChen-index/keChen-index'
        });
    }else{
    var wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    var wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
    var userId = wxPrevPage.data.userInfo.userId;
    var province = this.data.province;
    var city = this.data.cityId;
    var county = this.data.county;
    var addressDetail = this.data.addr;
    var url='';
    if(this.data.diss=='true'){
       url = app.url + '/v1/student/update/studentAddressByUserId';
    }else{
      url = app.url + '/v1/student/update/studentGuardianAddressByUserId';
    }
    wx.request({
      url: url,
      method:'GET',
      header: { 'token': wx.getStorageSync('userInfo').token },
      data: {
        'userId': userId,
        'addressDetail': addressDetail,
        'province': province,
        'city': city,
        'county': county
      },
      success:function(res){
        if(res.data.code=='10000'){
          var userId = wxPrevPage.data.userInfo.userId;
          var studentType = wxPrevPage.data.userInfo.studentType;
          wx.navigateBack({
            delta: 1
          })
        }
      },
      fail:function(info){
        wx.showToast({
          title: '提交失败',
        })
      }
    })
    }
  },
  userNameInput:function(e){
    this.setData({addr:e.detail.value})
  },
  bindPickerChange: function (e) {
    var that=this;
    this.setData({
      index: e.detail.value
    })
    var province = this.data.objectArray;
    for(var i in province){
      if (i == e.detail.value){
        //console.log(province[i]);
        this.setData({ 
          province: province[i].provinceId,
          provinceName: province[i].provinceName
        });
      } 
    }
    wx.showLoading({
      title: '加载中...',
    })
    cityList(this)
    setTimeout(function () { countyLsit(that) }, 1000)
  },
  bindPickerChange1: function (e) {
    this.setData({
      index1: e.detail.value
    })
    var city = this.data.objectArray1;
    for (var i in city) {
      if (i == e.detail.value) {
        //console.log(city[i]);
        this.setData({ 
          cityId : city[i].cityId,
          cityName: city[i].cityName
        });
      }
    }
    wx.showLoading({
      title: '加载中...',
    })
    countyLsit(this)
  },
  bindPickerChange2: function (e) {
    this.setData({
      index2: e.detail.value
    })
    var county = this.data.objectArray2;
    for (var i in county) {
      if (i == e.detail.value) {
        //console.log(county[i]);
        this.setData({ 
          county: county[i].countyId,
          countyName: county[i].countyName
        });
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that=this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if (res.networkType == 'none') {
          wx.reLaunch({
            url: '../../../pages/welcome/welcomeNo/welcomeNo',
          })
        }
      }
    })
    if (that.data.location == 1) {//这是从日程首页过来的（判断是定位的地址还是请求后端的地址还是取的默认app的地址）
      let locationInfo = wx.getStorageSync('LOCATION_INFO');
      that.setData({
        province: locationInfo.provinceId,
        provinceName: locationInfo.provinceName,
        cityId: locationInfo.cityId,
        cityName: locationInfo.cityName,
        county: locationInfo.countyId,
        countyName: locationInfo.countyName,
        addr: locationInfo.address
      })
      wx.request({
        url: app.url + '/v1/systemconfig/get/allProvinceInfo',
        method: 'GET',
        header: { 'token': wx.getStorageSync('userInfo').token },
        data: {},
        success: function (res) {
          if (res.data.code == '10000') {
            var result = res.data.response;
            var len = result.length;
            var arr = new Array();
            while (len--) {
              arr.unshift(result[len].provinceName);
            }
            for (var i = 0; i < result.length; i++) {
              if (result[i].provinceId == that.data.province) {
                that.setData({
                  index: i,
                  province: result[i].provinceId,
                  provinceName: result[i].provinceName
                })
              }
            }
            that.setData({ objectArray: result, array: arr })
            //获取市位置
            wx.request({
              url: app.url + '/v1/systemconfig/get/allCityInfoByProvinceId',
              method: 'GET',
              header: { 'token': wx.getStorageSync('userInfo').token },
              data: { 'provinceId': that.data.province },
              success: function (res) {
                if (res.data.code == '10000') {
                  var result = res.data.response;
                  var len = result.length;
                  var arr = new Array();
                  while (len--) {
                    arr.unshift(result[len].cityName);
                  }
                  for (let x = 0; x < result.length; x++) {
                    if (result[x].cityId == that.data.cityId) {
                      that.setData({
                        index1: x,
                        cityId: result[x].cityId,
                        cityName: result[x].cityName
                      })
                    }
                  }
                  that.setData({ objectArray1: result, array1: arr })
                  //获取区位置
                  wx.request({
                    url: app.url + '/v1/systemconfig/get/allCountyInfoByCityId',
                    method: 'GET',
                    header: { 'token': wx.getStorageSync('userInfo').token },
                    data: { 'cityId': that.data.cityId },
                    success: function (res) {
                      if (res.data.code == '10000') {
                        //console.log("获取到区")
                        var result = res.data.response;
                        var len = result.length;
                        var arr = new Array();
                        while (len--) {
                          arr.unshift(result[len].countyName);
                        }
                        for (let y = 0; y < result.length; y++) {
                          if (result[y].countyId == that.data.county) {
                            that.setData({
                              index2: y,
                              county: result[y].countyId,
                              countyName: result[y].countyName
                            })
                          }
                        }
                        that.setData({ objectArray2: result, array2: arr })
                      }
                    },
                    fail: function (info) {
                      ////console.log("请求失败")
                    }
                  })
                }
              },
              fail: function (info) {
                ////console.log("请求失败")
              }
            })

          }
        },
        fail: function (info) {
          ////console.log("请求失败")
        }
      })

    }else{
      console.log("这是从修改地址过来的")
      //prviceList(that);
      var wxCurrPage = getCurrentPages();//获取当前页面的页面栈
      var wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
      var province = wxPrevPage.data.studentAdultInfo.province;
      var city = wxPrevPage.data.studentAdultInfo.city;
      var county = wxPrevPage.data.studentAdultInfo.county; 
      var addrDetail = wxPrevPage.data.studentAdultInfo.addrDetail;
      var guardianAddrDetail  = wxPrevPage.data.studentAdultInfo.guardianAddrDetail ;
      console.log(province)
      console.log(city)
      console.log(county)
      if(that.data.diss){
        that.setData({ 
          addr: addrDetail,
          province: province,
          cityId: city, 
          county: county 
        })
        console.log(that.data.county)
        
      }else{
        that.setData({ addr: guardianAddrDetail, province: province, cityId: city, county: county })
      } 
      wx.request({
        url: app.url + '/v1/systemconfig/get/allProvinceInfo',
        method: 'GET',
        header: { 'token': wx.getStorageSync('userInfo').token },
        data: {},
        success: function (res) {
          
          if (res.data.code == '10000') {
            //console.log("获取到省位置")
            var result = res.data.response;
            var len = result.length;
            var arr = new Array();
            while (len--) {
              arr.unshift(result[len].provinceName);
            }
            for (var i = 0; i < result.length; i++) {
              if (result[i].provinceId == that.data.province) {
                that.setData({
                  index: i,
                  province: result[i].provinceId,
                  provinceName: result[i].provinceName
                })
                break;
              }
            }
            that.setData({ objectArray: result, array: arr })
            //获取市位置
            wx.request({
              url: app.url + '/v1/systemconfig/get/allCityInfoByProvinceId',
              method: 'GET',
              header: { 'token': wx.getStorageSync('userInfo').token },
              data: { 'provinceId': that.data.province },
              success: function (res) {
                if (res.data.code == '10000') {
                  var result = res.data.response;
                  var len = result.length;
                  var arr = new Array();
                  while (len--) {
                    arr.unshift(result[len].cityName);
                  }
                  for (let x = 0; x < result.length; x++) {
                    if (result[x].cityId == that.data.cityId) {
                      that.setData({
                        index1: x,
                        cityId: result[x].cityId,
                        cityName: result[x].cityName
                      })
                      break;
                    }
                  }
                  that.setData({ objectArray1: result, array1: arr })
                  //获取区位置
                  wx.request({
                    url: app.url + '/v1/systemconfig/get/allCountyInfoByCityId',
                    method: 'GET',
                    header: { 'token': wx.getStorageSync('userInfo').token },
                    data: { 'cityId': that.data.cityId },
                    success: function (res) {
                      if (res.data.code == '10000') {
                        //console.log("获取到区")
                        var result = res.data.response;
                        var len = result.length;
                        var arr = new Array();
                        while (len--) {
                          arr.unshift(result[len].countyName);
                        }
                        for (let y = 0; y < result.length; y++) {
                          if (result[y].countyId == that.data.county) {
                            console.log(that.data.county)
                            that.setData({
                              index2: y,
                              county: result[y].countyId,
                              countyName: result[y].countyName
                            })
                            break;
                          }
                        }
                        that.setData({ objectArray2: result, array2: arr })
                      }
                    },
                    fail: function (info) {
                      ////console.log("请求失败")
                    }
                  })
                }
              },
              fail: function (info) {
                ////console.log("请求失败")
              }
            })

          }
        },
        fail: function (info) {
          ////console.log("请求失败")
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
})
//获取所有省份信息列表
function prviceList(that){
  var wxCurrPage = getCurrentPages();//获取当前页面的页面栈
  var wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
  var province = wxPrevPage.data.studentAdultInfo.province;
  var city = wxPrevPage.data.studentAdultInfo.city;
  var county = wxPrevPage.data.studentAdultInfo.county;
  wx.request({
    url: app.url +'/v1/systemconfig/get/allProvinceInfo',
    method:'GET',
    header:{'token':wx.getStorageSync('userInfo').token},
    data:{},
    success:function(res){
      if(res.data.code=='10000'){
        var result=res.data.response;
        var len=result.length;
        var arr=new Array();
        while(len--){
          arr.unshift(result[len].provinceName);
        }
        
        for (var i = 0; i < result.length; i++) {
          if (result[i].provinceId == province) {
            that.setData({
              index: i,
              province: result[i].provinceId,
              provinceName: result[i].provinceName
            })
            cityList(that);
          }
        }
        that.setData({ objectArray: result, array:arr})
      }
    },
    fail:function(info){
      ////console.log("请求失败")
    }
  })
}
//根据省份ID查询城市列表
function cityList(that){
  var province = that.data.province;
  wx.request({
    url: app.url + '/v1/systemconfig/get/allCityInfoByProvinceId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: { 'provinceId': province},
    success: function (res) {
      wx.hideLoading();
      if (res.data.code == '10000') {
        var result = res.data.response;
        var len = result.length;
        var arr = new Array();
        while (len--) {
          arr.unshift(result[len].cityName);
        }
        that.setData({ 
          objectArray1: result, 
          array1: arr, 
          cityId: result[0].cityId,
          cityName: result[0].cityName
        })
        countyLsit(that);
      }
    },
    fail: function (info) {
    }
  })
}
//根据城市ID 查询区
function countyLsit(that) {
  var cityId = that.data.cityId;
  wx.request({
    url: app.url + '/v1/systemconfig/get/allCountyInfoByCityId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: { 'cityId': cityId },
    success: function (res) {
      wx.hideLoading();
      ////console.log(res)
      if (res.data.code == '10000') {
        var result = res.data.response;
        var len = result.length;
        var arr = new Array();
        while (len--) {
          arr.unshift(result[len].countyName );
        }
        that.setData({ 
          objectArray2: result, 
          array2: arr, 
          county: result[0].countyId,
          countyName: result[0].countyName
        })
      }
    },
    fail: function (info) {
      ////console.log("请求失败")
    }
  })
}