// pages/changGuan/c-VenueOrder-item/c-VenueOrder-item.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: ['报名中', '已签到'],
    imgUrl: app.imgUrl,
    orderCode: '1',
    classId: '1',
    userId: '1',
    orderItems: {},
    week: '',
    orderStates: [],
    statusArr: '',
    isDialogShow: false,
    isScroll: true,
    height: 0,
    showSure: false,
    marksOne: true,
    showSure2: false,
    marksTwo: false,
    marksThree: true,
    showSure3: false,
    array: ['美国', '中国', '巴西', '日本'],
    objectArray: [
      {
        id: 0,
        name: '美国'
      },
      {
        id: 1,
        name: '中国'
      },
      {
        id: 2,
        name: '巴西'
      },
      {
        id: 3,
        name: '日本'
      }
    ],
    index: 0,
    pickDate: 0,
    marginTop: 0,
    nowHeight: 0,
    focus: false,
  },
  // toTop(){
  //   let that=this;
  //   that.setData({ marginTop: -130, height: that.data.height + 200, focus: true,})
  // },
  // goDown(){
  //   let that = this;
  //   that.setData({ marginTop: 0, height: that.data.nowHeight, focus: false, })
  // },
  //点击修改私教方案
  editorProgramme: function (e) {
    var that = this;
    that.setData({
      showSure3: true,
      marksThree: false
    })
  },
  //提交新的私教方案
  subPrgrome: function (e) {
    var that = this;
    var pushPrgrome = that.data.pushPrgrome;
    var code = that.data.orderItems.orderCode;
    var superme = e.currentTarget.dataset.superme;
    var spareTime = that.data.pickDate;
    var order = that.data.orderItems;
    order.personalPlan = pushPrgrome
    that.setData({
      orderItems: order,
      marksThree: true,
      showSure3: false
    })
    subContext(superme, that, code, '', pushPrgrome, '')
  },
  //输入新的私教方案
  pushPrgrome: function (e) {
    console.log(e.detail.value)
    var that = this;
    var orders = that.data.orderItems;
    orders.personalPlan = e.detail.value;
    that.setData({
      pushPrgrome: e.detail.value
    })
  },

  //修改备注按钮
  edtorRemarks: function (e) {
    var that = this;
    that.setData({
      showSure: true,
      marksOne: false
    })
  },
  //输入的时候改变data的值
  orderBeiZhu: function (e) {
    var that = this;
    console.log(e.detail.value)
    var orders = that.data.orderItems;
    orders.coachRemarks = e.detail.value;
    that.setData({
      orderItems: orders
    })
  },
  //提交修改备注
  subContent: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.superme)
    var superMe = e.currentTarget.dataset.superme;
    var code = that.data.orderItems.orderCode;
    var coachRemarks = that.data.orderItems.coachRemarks;
    var personalPlan = that.data.orderItems.personalPlan;
    var spareTime = that.data.orderItems.dayTimeStart + that.data.orderItems.dayTimeEnd
    subContext(superMe, that, code, coachRemarks, personalPlan, spareTime)
  },

  //点击修改时段的按钮改变图片和picker
  editorDate: function (e) {
    var that = this;
    // that.setData({
    //   marksTwo:true,
    //   showSure2:true
    // })
    let orderSectionList = [];
    for (let section of that.data.orderItems.orderSectionList) {
      orderSectionList.push(section.classSectionId);
    }
    wx.navigateTo({
      url: "../../../pages/curriculum/Edit-Time/Edit-Time?orderCode=" + that.data.orderCode + "&classId=" + that.data.orderItems.classId + "&orderSectionList=" + orderSectionList + "&studentUserId=" + that.data.orderItems.studentUserId
    });



  },

  //点击picker确定
  bindPickerChange: function (e) {
    console.log('picker携带值为:' + e.detail.value)
    var that = this;
    var index = e.detail.value;
    that.setData({
      index: index
    })
    var fctory = this.data.objectArray;
    if (index == 0) {
      that.setData({
        pickDate: that.data.orderItems.classSectionId
      })
    } else {
      for (var y in fctory) {
        if (index == y) {
          that.setData({
            pickDate: fctory[y].sectionId
          })
        }
      }
    }
  },

  //提交修改的时候且改变图标和元素
  subDate: function (e) {
    console.log(e.currentTarget.dataset.superme)
    var that = this;
    var code = that.data.orderItems.orderCode;
    var superme = e.currentTarget.dataset.superme;
    var spareTime = that.data.pickDate;
    this.setData({
      showSure2: false,
      marksTwo: false
    })
    subContext(superme, that, code, '', '', spareTime)
  },
  //拨打电话
  callPhone: function (e) {
    console.log(this.data.orderItems.studentPhone)
    wx.makePhoneCall({
      phoneNumber: this.data.orderItems.studentPhone,
    })
  },

  //学员申请退款
  cancelreFund: function (e) {
    var that = this;
    var name = that.data.orderItems.studentName;
    wx.showModal({
      title: '学员申请退款',
      content: '学员' + name + '申请退还本课程的全部费用，是否同意？',
      cancelText: '不同意',
      confirmText: '同意',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击同意')
          studentTui(that, '01')
        } else if (res.cancel) {
          console.log('用户点击取消')
          studentTui(that, '02')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.screenHeight)
        _this.setData({ height: res.screenHeight + 80, nowHeight: res.screenHeight + 80 })
      }
    })
    let userInfo = wx.getStorageSync("userInfo");
    _this.setData({
      orderCode: options.code,
      classId: options.classId,
      userId: options.uid,
      statusArr: options.status,
      best: options.best,
      userId: userInfo.userId,
      stas: options.stas
    })
    // getOrderList(_this, options.code);
    // orderState(_this, options.classId, options.code, options.uid)   
  },

  //点击与教练聊天
  weiLiao: function (e) {
    let studentuserid = e.currentTarget.dataset.studentuserid;
    let nickname = this.data.orderItems.studentName;
    let avatarurl = this.data.orderItems.studentPhotoAddress;
    let userimname = "studentIM" + studentuserid;
    console.log(nickname, avatarurl, userimname)
    wx.navigateTo({
      url: '../../../pages/news/chitchat/chitchat?userimname=' + userimname + '&type=coach&avatarurl=' + avatarurl + '&nickname=' + nickname,
    })
  },


  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {
    app.noType();
    getOrderList(this, this.data.orderCode);
    console.log(1);
    orderState(this, this.data.classId, this.data.orderCode, this.data.userId)
  },

  //评论课程直接跳转
  goCurriculum: function (e) {
    wx.navigateTo({
      url: '../../../pages/curriculum/Comment/Comment?orderCode=' + this.data.orderItems.orderCode,
    })
  },
  //确认已付款
  goSure: function (e) {

    var that = this;
    var name = that.data.orderItems.studentName;
    wx.request({
      url: app.url + '/v1/order/getClassJoinStatusByOrderCode',
      header: { 'token': wx.getStorageSync('userInfo').token },
      method: 'GET',
      data: {
        orderCode: that.data.orderCode
      },
      success: function (res) {
        if (res.data.code == '10000') {
          let results = res.data.response;
          if (results != '04') { //04=时间冲突
            wx.showModal({
              title: '线下付款确认',
              content: '学员' + name + ' 已在线下支付本课程的全部费用，是否确认？',
              cancelText: '未付款',
              confirmText: '已付款',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  updateOrderPayStatus(that, "02")
                } else if (res.cancel) {
                  console.log('用户点击取消')
                  updateOrderPayStatus(that, "01")
                }
              }
            })
          } else {
            wx.showModal({
              title: '上课时间冲突',
              content: '学员' + name + '在该时间点报名了其他课程，当前订单付款失败，是否确认？',
              cancelText: '关闭',
              confirmText: '确认',
              success: function (res) {
                if (res.confirm) {
                  console.log("冲突关闭");
                  updateOrderPayStatus(that, "01")
                } else if (res.cancel) {

                }
              }
            })
          }
        } else {
          wx.showToast({
            title: '后台开小差了',
          })
        }
      },
      fail: function (info) {
        console.log("请求后台失败")
      }
    })


  },
  //学员申请暂停
  cancelreStop: function (e) {
    var that = this;
    var code = that.data.orderItems.orderCode;
    var name = that.data.orderItems.studentName;
    var classname = that.data.orderItems.className;
    wx.showModal({
      title: '学员申请暂停课程',
      content: '学员' + name + '申请暂停课程' + classname + '，是否同意？',
      cancelText: '不同意',
      confirmText: '同意',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击同意')
          sureMOney(that, '02')
        } else if (res.cancel) {
          console.log('用户点击不同意')
          sureMOney(that, '00')
        }
      }
    })
  },
  //重启课程
  cancelreStart: function (e) {
    var that = this;
    var code = that.data.orderItems.orderCode;
    var name = that.data.orderItems.studentName;
    var classname = that.data.orderItems.className;
    wx.showModal({
      title: '学员课程重启',
      content: '确定重启学员' + name + '的' + classname + '课程？',
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          sureMOney(that, '00')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //点击取消订单
  cancelOrder: function (e) {
    var that = this;
    studentTui(that, '99');
  },
  //直接暂停课程
  stopOrderStatus: function (e) {
    var that = this;
    var code = that.data.orderItems.orderCode;
    var name = that.data.orderItems.studentName;
    var className = that.data.orderItems.className;
    var maxNumber = that.data.orderItems.maxMember;
    wx.showModal({
      title: '提示',
      content: '暂停学员' + name + ' 的 ' + className + ' | ' + maxNumber + '人班 课程（暂停后，该学员不再收到本课程的任何开课通知），是否确认？',
      confirmText: '确认暂停',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.url + '/v1/order/updateOrderClassStatus',
            method: 'GET',
            header: { 'token': wx.getStorageSync('userInfo').token },
            data: {
              'orderCode': code,
              'classStatus': '02',
              'source': '1'
            },
            success: (res) => {
              if (res.data.code == '10000') {
                wx.showToast({
                  title: '操作成功',
                })
                var orderItems = that.data.orderItems;
                orderItems.orderStatus = '07'
                that.setData({
                  orderItems: orderItems
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                });
              }
            },
            fail: (info) => {
              console.log("请求失败了")
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }

    })
  },


  //更多操作（暂停课程、修改剩余课时）
  goStops: function (e) {
    this.setData({
      isDialogShow: true,
      isScroll: false,
    })
  },
  //修改剩余课时直接跳转
  refundFun: function (e) {
    var that = this;
    var orderCode = that.data.orderItems.orderCode;
    that.setData({
      isDialogShow: false,
      isScroll: true
    });
    wx.navigateTo({
      url: '../../../pages/curriculum/Modification/Modification?orderCode=' + orderCode,
    })
  },

  //取消事件
  cancels: function (e) {
    console.log("用户点击了取消")
    this.setData({
      isScroll: true,
      isDialogShow: false
    })
  },
  //暂停课程
  stopCoase: function (e) {
    var that = this;
    that.setData({
      isScroll: true,
      isDialogShow: false
    })
    var code = that.data.orderItems.orderCode;
    var name = that.data.orderItems.studentName;
    var className = that.data.orderItems.className;
    var maxNumber = that.data.orderItems.maxMember;
    wx.showModal({
      title: '提示',
      content: '暂停学员' + name + ' 的 ' + className + ' | ' + maxNumber + '人班 课程（暂停后，该学员不再收到本课程的任何开课通知），是否确认？',
      confirmText: '确认暂停',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.url + '/v1/order/updateOrderClassStatus',
            method: 'GET',
            header: { 'token': wx.getStorageSync('userInfo').token },
            data: {
              'orderCode': code,
              'classStatus': '02',
              'source': '1'
            },
            success: (res) => {
              if (res.data.code == '10000') {
                wx.showToast({
                  title: '操作成功',
                })
                var orderItems = that.data.orderItems;
                orderItems.orderStatus = '07'
                that.setData({
                  orderItems: orderItems
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                });
              }
            },
            fail: (info) => {
              console.log("请求失败了")
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }

    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  onShareAppMessage: function () {

  }
})
//获取学员订单详情
function getOrderList(that, code) {
  wx.request({
    url: app.url + '/v1/order/getOrderDetailForCoach',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      'orderCode': code
    },
    success: function (res) {
      console.log(res)
      res.data.code == '10000' ? that.setData({ orderItems: res.data.response }) : wx.showToast({
        title: '后台出错了',
      })
      // dateList(res.data.response.classId);
      // dateList(that, that.data.classId);
      that.setData({
        week: chinanum(res.data.response.weekDay)
      })
    },
    fail: function (info) {
      console.log("失败了 ")
    }
  })
}
//获取学员订单已参加的课程情况
function orderState(_this, classId, orderCode, userId) {
  wx.request({
    url: app.url + '/v1/attend/getClassAttendForStudent',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      'classId': classId,
      'orderCode': orderCode,
      'userId': userId
    },
    success: (res) => {
      console.log(res)
      if (res.data.code == '10000') {
        _this.setData({
          orderStates: res.data.response
        })
      }
    },
    fail: (info) => {
      console.log("请求失败")
    }
  })
}
//阿拉伯数字转星期
function chinanum(num) {
  num--;
  var china = new Array('一', '二', '三', '四', '五', '六', '日');
  var arr = new Array();
  for (var i = 0; i < china.length; i++) {
    arr[0] = china[num];
  }
  return arr.join("")
}

/*提交修改的内容*/
function subContext(superMe, that, code, coachRemarks, personalPlan, spareTime) {
  var data = {}
  if (superMe == 1) {
    data = {
      'orderCode': code,
      'coachRemarks': coachRemarks ? coachRemarks : ""
    }
  } else if (superMe == 2) {
    data = {
      'orderCode': code,
      'personalPlan': personalPlan ? personalPlan : ""
    }
  } else if (superMe == 3) {
    data = {
      'orderCode': code,
      'spareTime': spareTime
    }
  }
  wx.request({
    url: app.url + '/v1/order/updateOrderCoachInfo',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: data,
    success: function (res) {
      console.log("修改成功")
      console.log(res)
      that.setData({
        showSure: false,
        marksOne: true
      })
    },
    fail: function (info) {
      wx.showToast({
        title: '修改失败',
      })
    }
  })
}
//获取时段ID
function dateList(that, classId) {
  wx.request({
    url: app.url + '/v1/class/getClassEditSectionList',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      'classId': classId
    },
    success: function (res) {
      console.log(res)
      var arr = new Array();
      let data = res.data.response;
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          arr.push('周' + chinanum(res.data.response[i].weekDay) + '：' + res.data.response[i].dayTimeStart + '-' + res.data.response[i].dayTimeEnd);
        }
      }
      // for(var i in res.data.response){
      //   arr.push('周'+chinanum(res.data.response[i].weekDay)+'：'+res.data.response[i].dayTimeStart + '-' + res.data.response[i].dayTimeEnd);
      // }
      // var orderItems=that.data.orderItems;
      // arr.unshift('周' + chinanum(orderItems.weekDay) + '：' + orderItems.dayTimeStart + '-' + orderItems.dayTimeEnd);

      that.setData({
        array: arr,
        objectArray: res.data.response
      })

      console.log("上面是请求的时段信息的列表信息")
    },
    fail: function (res) {
      console.log("没有获取到时段信息")
    }
  })
}


/**
 * refundStatus（01审核通过 02审核不通过 99教练取消订单）
 */
function studentTui(that, refundStatus) {
  var orderItems = that.data.orderItems;
  wx.request({
    url: app.url + '/v1/order/updateOrderRefund',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      'orderCode': that.data.orderCode,
      'refundStatus': refundStatus
    },
    success: function (res) {
      if (res.data.code == '10000') {
        var orderStatus = "";
        if (refundStatus == '01') {
          orderStatus = "05";
        } else if (refundStatus == '02') {
          orderStatus = '02'
        } else {
          orderStatus = '99'
        }
        orderItems.orderStatus = orderStatus;
        that.setData({
          orderItems: orderItems
        })
        wx.showToast({
          title: '操作成功！',
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        });
      }

    },
    fail: function (info) {
      console.log("error")
    }
  })
}
/**
 * 改变课程状态
 * payStatus：00正常；02暂停中
 */
function sureMOney(that, classStatus) {
  var orderItems = that.data.orderItems;
  wx.request({
    url: app.url + '/v1/order/updateOrderClassStatus',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      'orderCode': that.data.orderCode,
      'classStatus': classStatus,
      'source': '1'
    },
    success: function (res) {
      if (res.data.code == '10000') {

        var orderStatus = "";
        if (classStatus == '00') {
          orderStatus = "02";//
        } else if (classStatus == '02') {
          orderStatus = "07";//
        }
        orderItems.orderStatus = orderStatus;
        that.setData({
          orderItems: orderItems
        })
        wx.showToast({
          title: '操作成功！',
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        });
      }
    },
    fail: function (info) {
      wx.showToast({
        title: '后台故障',
      })
    }
  })
}
/**
 * 
 * payStatus：线下支付确认（01未支付 02已支付）
 */
function updateOrderPayStatus(that, payStatus) {
  var orderItems = that.data.orderItems;
  wx.request({
    url: app.url + '/v1/order/updateOrderPayStatus',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      'orderCode': that.data.orderCode,
      'payStatus': payStatus
    },
    success: function (res) {
      if (res.data.code == '10000') {
        var orderStatus = "";
        if (payStatus == '01') {
          orderStatus = "01";//
        } else if (payStatus == '02') {
          orderStatus = "02";//
        }
        orderItems.orderStatus = orderStatus;
        that.setData({
          orderItems: orderItems
        })
        wx.showToast({
          title: '操作成功！',
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        });
      }
    },
    fail: function (info) {
      wx.showToast({
        title: '后台故障',
      })
    }
  })
} 