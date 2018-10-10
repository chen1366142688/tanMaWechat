// page/index/index.js
const app = getApp().globalData;
Page({
  data: {
    url: app.newImgUrl,
    items: [

      { name: '1', value: '成人', checked: 'true' }
    ],
    provinceList: [],
    objectProvinceList: [],
    provinceIndex: '0', 
    cityList: [],
    objectCityList: [],
    cityIndex: '0',
    head_image_url: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/coach/iteration/default-avatar.png',
    showSchool: true,
    showadultDistance: false, //距离上边距离
    schoolName: "",
    userName: "",
    userType: "1",
    userPhoneNo: "",
    studentSchoolId: "",
    code: "",
    userId: "",
    showCode: false,
    thisTime: 60,
    focusFlag: false,
    isSubmit: false,
    noBack:true,
    openTo:"",
  },
  radioChange: function (e) {
    if (e.detail.value === '1') {
      this.setData({
        showSchool: false,
        showadultDistance: true,
        userType: "1"
      });
    } else {
      this.setData({ //2 是青少年
        showSchool: true,
        showadultDistance: false,
        userType: "2"
      });
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //省市
    this.setData({
      userId: wx.getStorageSync('userInfo').userId
    })
    if (options.noBack=='true'){//这是不需要返回的
      this.setData({noBack:true})
    }else{
      this.setData({ noBack: false })
    }
    // getProvinceList(this);
    if (options.openTo && options.openTo != ''){
        this.setData({
          openTo:options.openTo
        })
    }
  },
  navCallBack(){
    const that=this;
    if(that.data.noBack){
      wx.switchTab({
        url: '../../pages/keChen/keChen-index/keChen-index',
      })
    }else{
      wx.navigateBack({
        delta:1
      })
    }
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    //页面显示
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
    //是否已经注册检查
    if (wx.getStorageSync('userInfo').userType && wx.getStorageSync('userInfo').userType.substr(1, 1) == "1") {
      wx.showModal({
        title: '提示',
        content: '您已经注册,不能重复注册！',
        showCancel: false,
        success: function () {
          //跳转到首页        
          wx.switchTab({
            url: "../../pages/keChen/keChen-index/keChen-index"
          });
        }
      });
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  //省改变
  provinceBindChange: function (e) {
    var values = e.detail.value;
    console.log(this.data.objectProvinceList[values]);
    this.setData({
      provinceIndex: values
    });
    // getCityList(this, this.data.objectProvinceList[values].provinceId);
  },
  //市改变
  cityBindChange: function (e) {
    var values = e.detail.value;
    this.setData({
      cityIndex: values,
      studentSchoolId: "",
      schoolName: ""
    })
  },
  //学校获得焦点
  schoolFocus: function (e) {
    this.setData({
      focusFlag: false
    });
    var cityId = this.data.objectCityList[this.data.cityIndex].cityId;
    var belongArea = this.data.provinceList[this.data.provinceIndex] + "-" + this.data.cityList[this.data.cityIndex];
    wx.navigateTo({
      url: "../../pages/register/schoolSelect/schoolSelect?cityId=" + cityId + "&belongArea=" + belongArea
    });
  },
  //昵称改变
  userNameChange: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  //电话改变
  userPhoneNoChange: function (e) {
    this.setData({
      userPhoneNo: e.detail.value
    })
  },
  //验证码改变
  codeChange: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  //点击发送验证码
  getCode: function (e) {
    var that = this;
    var phoneNum = that.data.userPhoneNo;
    var reg = /^[1][0-9]{10}$/;
    if (reg.test(phoneNum)) {
      sendCoded(that, phoneNum);
    } else {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none'
      })
    }
  },

  //点击注册按钮
  submitData: function (e) {
    var vm=this;
    if (vm.data.isSubmit) {
      wx.showToast({
        title: '验证中，请勿重复提交',
        icon: 'none'
      })
      return false;
    }
    

    //验证
    if (vm.data.userType == '2' && vm.data.studentSchoolId == '') {
      wx.showToast({
        title: '请选择所在学校！',
        icon: 'none'
      })
      return false;
    }
    if (vm.data.userName == '') {
      wx.showToast({
        title: '请输入昵称！',
        icon: 'none'
      })
      return false;
    }
    if (vm.data.userPhoneNo == '') {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none'
      })
      return false;
    }
    var reg = /^[1][0-9]{10}$/;
    if (!reg.test(vm.data.userPhoneNo)) {
      wx.showToast({
        title: '请输入正确的手机号！',
        icon: 'none'
      })
      return false;
    }
    if (vm.data.code == '') {
      wx.showToast({
        title: '请输入验证码！',
        icon: 'none'
      })
      return false;
    }
    //注册
    var data = {
      "code": vm.data.code,
      "studentSchoolId": vm.data.studentSchoolId,
      "userId": vm.data.userId,
      "userName": vm.data.userName,
      "userPhoneNo": vm.data.userPhoneNo,
      "userType": vm.data.userType
    };
    vm.setData({
      isSubmit: true
    })
    wx.request({
      url: app.url + '/v1/student/add/studentregioninfo',
      header: { 'token': wx.getStorageSync('userInfo').token },
      method: 'POST',
      data: data,
      success: function (res) {
        var result = res.data
        vm.setData({
          isSubmit: false
        })
        if (result.code == 20004) {//验证码错误
          wx.showToast({
            title: result.msg,
            icon: 'none'
          })
          vm.setData({
            isSubmit: false
          })
        } else if (result.code == 10000) {//成功
          wx.setStorageSync('userInfo', result.response.wechartInitResponse);
          wx.setStorageSync('studentBaseInfo', result.response.studentVO);
          //聊天IM账户
          var IMInfo = {
            userId: "studentIM" + wx.getStorageSync('userInfo').userId,
            password: result.msg
          }
          wx.setStorageSync('studentIM', IMInfo);
          wx.showModal({
            title: '提示',
            content: '验证成功!',
            showCancel: false,
            success: function () {
              let openTo = vm.data.openTo;
              let toParam = wx.getStorageSync("SHARE_LOGIN_FOR_REGISTER");
              wx.setStorageSync("SHARE_LOGIN_FOR_REGISTER", "");
              console.log('../../' + toParam);
              console.log(openTo);
              vm.setData({
                openTo: ""
              })
              if (openTo == 'im' || openTo == 'shop') {//跳转到 聊天界面  跳转到 订单确认  跳转回 课程详情
                wx.redirectTo({
                  url: '../../' + toParam
                })
              } else if (openTo == 'store') {//如果是点击收藏 触发的注册 
                wx.navigateBack({
                  delta: 1
                })
              } else {
                //跳转到首页  
                wx.switchTab({
                  url: "../../pages/keChen/keChen-index/keChen-index"
                });
              }
            }
          });
          app.loginInitIM();
          // login(str, num, this);
          vm.setData({
            isSubmit: false
          })
        } else {//其他
          wx.showToast({
            title: result.msg,
            icon: 'none'
          })
          vm.setData({
            isSubmit: false
          })
        }

      },
      fail: function (info) {
        wx.showModal({
          title: '提示',
          content: '后台开小差了',
        })
        vm.setData({
          isSubmit: false
        })
      }
    })

  },

  //点击返回
  regSecBackfistOn: function (e) {
    // 在C页面内 navigateBack，将返回A页面
    wx.navigateBack({
      delta: 1
    })
  },
})

function getProvinceList(that) {//请求省列表
  wx.request({
    url: app.url + '/v1/systemconfig/get/allProvinceInfo',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {},
    success: function (res) {
      if (res.data.code == 10000) {
        var result = res.data.response;
        var arr = [];
        let provinIdtemp = "";
        if (wx.getStorageSync('LOCATION_INFO') && wx.getStorageSync('LOCATION_INFO').provinceId > 0){
            provinIdtemp = wx.getStorageSync('LOCATION_INFO').provinceId;
        }
        for (let i = 0; i < result.length; i++) {
          arr.push(result[i].provinceName);
          if (provinIdtemp != "" && provinIdtemp == result[i].provinceId){
              that.setData({
                provinceIndex:i
              })
          }
        }
        setTimeout(function () {
          that.setData({
            objectProvinceList: result,
            provinceList: arr,
          })
        }, 100)
        if (provinIdtemp == ""){
            provinIdtemp = result[0].provinceId;
        }
        getCityList(that, provinIdtemp);
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }
    },
    fail: function (info) {
      wx.showModal({
        title: '提示',
        content: '后台开小差了',
      })
    }
  })
}
function getCityList(that, provinceId) {//请求市列表
  wx.request({
    url: app.url + '/v1/systemconfig/get/allCityInfoByProvinceId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: { "provinceId": provinceId },
    success: function (res) {
      var result = res.data.response;
      var arr = [];
      let cityIdtemp = "";
      if (wx.getStorageSync('LOCATION_INFO') && wx.getStorageSync('LOCATION_INFO').cityId > 0) {
        cityIdtemp = wx.getStorageSync('LOCATION_INFO').cityId;
      }
      for (let i = 0; i < result.length; i++) {
        arr.push(result[i].cityName);
        if (cityIdtemp != "" && cityIdtemp == result[i].cityId) {
          that.setData({
            cityIndex: i
          })
        }
      }
      setTimeout(function () {
        that.setData({
          objectCityList: result,
          cityList: arr,
          schoolName: "",
          studentSchoolId: ""
        })
      }, 100)
    },
    fail: function (info) {
      wx.showModal({
        title: '提示',
        content: '后台开小差了',
      })
    }
  })
}

//发送验证码
function sendCoded(that, phone) {
  wx.request({
    url: app.url + '/v1/common/sendSMS',
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync('userInfo').token
    },
    data: {
      'type': '1',
      'userId': that.data.userId,
      'userPhoneNo': phone
    },
    success: function (res) {
      console.log(res)
      var result = res.data;
      if (result.code == 10000) {
        // wx.showModal({
        //   title: '提示',
        //   content: result.msg,
        // });
        that.setData({ showCode: true });
        changeThisTime(that)

      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
      }

    },
    fail: function (info) {
      console.log("发送失败")
    }
  })
}
function changeThisTime(that) {
  var time = that.data.thisTime;
  time--;
  if (time >= 0) {
    that.setData({
      thisTime: time,
    });
    setTimeout(() => {
      changeThisTime(that)
    }, 1000)
  } else {
    that.setData({
      showCode: false,
      thisTime: 60
    });
  }

}
function login(str, num, that) {
  wx.request({
    url: app.url + '/v1/login/wechart/getUserInfo',
    data: {
      code: str,
      appType: num
    },
    success: (res) => {
      // console.log(res)
      if (res.data.code == '10000') {
        var result = res.data.response;
        if (result) {
          wx.setStorageSync('userInfo', result);
          //判断是否是新用户
          var isNewUser = result.userType.substr(1, 1);
          //如果第二位数字等于1说明是学员用户，获取用户账号密码

          // isNewUser == '1' ? app.userPwd(result.userId, isNewUser, that) : console.log("这可能是新学员");
          getStudentBaseInfo(that);
          wx.showModal({
            title: '提示',
            content: '注册成功!',
            showCancel: false,
            success: function () {
              let openTo = that.data.openTo;
              let toParam = wx.getStorageSync("SHARE_LOGIN_FOR_REGISTER");
              wx.setStorageSync("SHARE_LOGIN_FOR_REGISTER", "");
              console.log('../../' + toParam);
              console.log(openTo);
              that.setData({
                openTo: ""
              })
              if (openTo == 'im' || openTo == 'shop') {//跳转到 聊天界面  跳转到 订单确认  跳转回 课程详情
                wx.redirectTo({
                  url: '../../' + toParam
                })
              } else if (openTo == 'store') {//如果是点击收藏 触发的注册 
                wx.navigateBack({
                  delta: 1
                })
              }else{
                //跳转到首页  
                wx.switchTab({
                  url: "../../pages/keChen/keChen-index/keChen-index"
                });
              }
            }
          });
        }

      }
    },
    fail: (info) => {
      console.log(info)
    }
  })
};
function getStudentBaseInfo(vm) {
  wx.request({
    url: app.url + '/v1/student/getStudentStorageInfoByUserId',
    data: {
      "userId": wx.getStorageSync("userInfo").userId
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      if (res.data.code == '10000') {
        var data = res.data.response;
        app.loginInitIM();
        wx.setStorageSync('studentBaseInfo', data)
      }
    },
    fail: (info) => {
      console.log("请求失败了");
    }
  })
}