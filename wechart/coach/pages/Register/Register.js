// pages/Register/Register.js
var util = require('../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    userId: "",
    items: [{
        name: '1',
        value: '教练',
        classId: '00',
        checked: 'true'
      },
      // { name: '2', value: '助教',classId: '01', },
      {
        name: '3',
        value: '主教练/机构',
        classId: '02',
      },
    ],
    placeholder: '请输入教练昵称',
    coachType: 1,
    coachName: '',
    phoneNo: '',
    code: '',
    isSubmit: false,
    isSuccess: false,
    showCode: false,
    thisTime: 60,
    classList: [],
    index: '',
    dataClass: '',
    projectnamea01: false, //动态项目名称
    projectnamea02: true //默认文字  请输入项目名称
  },
  modalcnt: function(e) {
    console.log(e)
    var name = e.currentTarget.dataset.name;
    // var vm = this;
    if (name == 1) {
      wx.showModal({
        title: '提示',
        content: '以归属于某俱乐部/团体/培训机构的教练，注册时需关联对应机构',
        showCancel: false,
        confirmText: '我知道了',
        success: res => {
          if (res.confirm) {
            console.log('用户点击我知道了')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else if (name == 3) {
      wx.showModal({
        title: '提示',
        content: '独立教练/团体/各类培训机构账户，注册后可管理所有下属关联教练',
        showCancel: false,
        confirmText: '我知道了',
        success: res => {
          if (res.confirm) {
            console.log('用户点击我知道了')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  /**
   * 选择项目
   */
  bindUnfoldChange: function(e) {
    var vm = this;
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    let index = e.detail.value;
    let classList = vm.data.classList;
    let dataClass = classList[index].itemId
    this.setData({
      index: index,
      dataClass: dataClass
    })
    if (index) {
      this.setData({
        projectnamea01: true, //动态项目名称
        projectnamea02: false //默认文字  请输入项目名称
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options && options.phoneNo && options.smscode){
       this.setData({
         phoneNo: options.phoneNo,
         code: options.smscode
       })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // debugger
    var vm = this;
    //是否已经注册检查
    app.noType();
    this.setData({
      userId: wx.getStorageSync('userInfo').userId,
      classList: wx.getStorageSync('classList')
    })
    // let index = 0;
    // let classList = vm.data.classList;
    // let dataClass = classList[index].itemId
    // this.setData({
    //   index: index,
    //   dataClass: dataClass
    // })


    if (wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').userType && (wx.getStorageSync('userInfo').userType).substr(2, 1) == "1") {
      wx.showModal({
        title: '提示',
        content: '您已经注册,不能重复注册！',
        showCancel: false,
        success: function() {
          //跳转到首页  
          wx.switchTab({
            url: '../index/scheduleIndex/scheduleindex'
          });
        }
      });
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  radioChange: function(e) {
    var vm = this;
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    let coachType = e.detail.value;
    if (coachType == 1) {
      vm.setData({
        placeholder: '请输入教练昵称'
      })
    } else {
      vm.setData({
        placeholder: '请输入机构名称'
      })
    }
    vm.setData({
      coachType: coachType
    })
  },
  coachName: function(e) {
    var vm = this;
    // console.log(e)
    let coachName = e.detail.value;
    vm.setData({
      coachName: coachName
    })
  },
  phoneNo: function(e) {
    var vm = this;
    // console.log(e)
    let phoneNo = e.detail.value;
    vm.setData({
      phoneNo: phoneNo
    })
  },
  code: function(e) {
    var vm = this;
    // console.log(e)
    let code = e.detail.value;
    vm.setData({
      code: code
    })
  },
  sendSms: function(e) {
    var vm = this;
    let phoneNo = vm.data.phoneNo;
    var isPhoneNo = isPoneAvailable(phoneNo);
    if (isPhoneNo) {
      sendSMS(vm);
    } else {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号码',
        showCancel: false
      })
      return false;
    }
  },
  registe: function() {
    var vm = this;
    
    if (!vm.data.isSubmit && !vm.data.isSuccess) {
      checkParams(vm);
    } else if (vm.data.isSubmit && !vm.data.isSuccess) {
      wx.showModal({
        title: '提示',
        content: '注册中，请耐心等待',
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您已经注册,不需要重复注册！',
        showCancel: false,
        success: function() {
          //跳转到首页  
          wx.switchTab({
            url: "../curriculum/curriculumeIndex/curriculumIndex"
          });
        }
      });
    }

  }
});

function sendSMS(vm) {
  wx.request({
    url: app.url + '/v1/common/sendSMS',
    header: {
      'token': wx.getStorageSync('userInfo').token
    },
    data: {
      "type": '2',
      "userId": wx.getStorageSync('userInfo').userId,
      "userPhoneNo": vm.data.phoneNo
    },
    method: 'POST',
    success: (res) => {
      console.log(res)
      if (res.data.code == '10000') {
        vm.setData({
          showCode: true
        });
        changeThisTime(vm);

        wx.showModal({
          title: '提示',
          content: res.data.msg,
        });

      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    },
    fail: (info) => {
      wx.showToast({
        title: '发送失败',
        icon: 'none',
        duration: 2000
      })
      console.log("请求失败了");
    }
  })
};

function checkParams(vm) {
  if (!vm.data.userId) {
    wx.showModal({
      title: '提示',
      content: '身份信息验证失败',
      showCancel: false
    })
    vm.setData({
      isSubmit: false
    })
    return false;
  }
  if (!vm.data.dataClass) {
    wx.showModal({
      title: '提示',
      content: '请选择项目',
      showCancel: false
    })
    vm.setData({
      isSubmit: false
    })
    return false;
  }
  if (!vm.data.coachType) {
    wx.showModal({
      title: '提示',
      content: '请选择教练类型',
      showCancel: false
    })
    vm.setData({
      isSubmit: false
    })
    return false;
  }
  if (!vm.data.coachName) {
    wx.showModal({
      title: '提示',
      content: '请填写你的昵称',
      showCancel: false
    })
    vm.setData({
      isSubmit: false
    })
    return false;
  }
  if (!vm.data.phoneNo) {
    wx.showModal({
      title: '提示',
      content: '请填写注册的手机号',
      showCancel: false
    })
    vm.setData({
      isSubmit: false
    })
    return false;
  }
  if (!vm.data.code) {
    wx.showModal({
      title: '提示',
      content: '请填写验证码',
      showCancel: false
    })
    vm.setData({
      isSubmit: false
    })
    return false;
  }
  wx.showToast({
    title: '注册中...',
    icon: 'none',
    duration: 2000
  })
  vm.setData({
    isSubmit: true
  })
  toregiste(vm);
};

function toregiste(vm) {
  wx.request({
    url: app.url + '/v1/coach/add/coachregioninfo',
    header: {
      'token': wx.getStorageSync('userInfo').token
    },
    data: {
      "code": vm.data.code,
      "userId": vm.data.userId,
      "userName": vm.data.coachName,
      "userPhoneNo": vm.data.phoneNo,
      "userType": vm.data.coachType,
      "itemId": vm.data.dataClass
    },

    method: 'POST',
    success: (res) => {
      console.log(res)
      if (res.data.code == '10000') {
        vm.setData({
          isSubmit: true,
          isSuccess: true
        })
        //聊天IM账户
        var IMInfo = {
          userId: "coachIM" + wx.getStorageSync('userInfo').userId,
          password: res.data.msg
        }
        wx.setStorageSync('coachIM', IMInfo);
        //重新获取登录信息
        wx.login({
          success: res => {
            console.log(res)
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            // login(res.code, '2', that)
            login(res.code, '2', this);
          }
        })
      } else {
        if (res.data.code == '20004') {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '注册失败',
            icon: 'none',
            duration: 2000
          })
        }

        vm.setData({
          isSubmit: false,
          isSuccess: false
        })
      }
    },
    fail: (info) => {
      wx.showToast({
        title: '注册失败',
        icon: 'none',
        duration: 2000
      })
      vm.setData({
        isSubmit: false,
        isSuccess: false
      })
      console.log("请求失败了");
    }
  })
};

function isPoneAvailable(str) {
  var myreg = /^[1][0-9]{10}$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
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

};

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
          getCoachBaseInfo(that);
          wx.showModal({
            title: '提示',
            content: '注册成功!',
            showCancel: false,
            success: function() {
              //跳转到首页  
              wx.switchTab({
                url: "../curriculum/curriculumeIndex/curriculumIndex"
              });
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

function getCoachBaseInfo(vm) {
  wx.request({
    url: app.url + '/v1/coach/getCoachStorageInfoByUserId',
    data: {
      "userId": wx.getStorageSync("userInfo").userId
    },
    method: 'GET',
    header: {
      'token': wx.getStorageSync('userInfo').token
    },
    success: (res) => {
      if (res.data.code == '10000') {
        var data = res.data.response;
        wx.setStorageSync('coachBaseInfo', data)
        app.loginInitIM();
      }
    },
    fail: (info) => {
      console.log("请求失败了");
    }
  })
}