// pages/changGuan/c-VenueOrder-item/c-VenueOrder-item.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:['报名中','已签到'],
    url: app.imgUrl,
    orderCode:'',
    classId:'',
    userId: "",
    orderItems:{},
    week: '',
    orderStates:[],
    statusArr:'',
    isDialogShow: false,
    isDialogPay: false,
    isScroll: true,
   // sectionid: ""
  },
  //拨打电话
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.orderItems.coachPhone ,
    })
  },
  //跳转到申请退款页面
  // refund:function(e){
  //   this.setData({
  //     isDialogPay: false,
  //     isScroll: true
  //   })
  //   wx.navigateTo({
  //     url: '../../../pages/changGuan/c-VenueOrder-Application/c-VenueOrder-Application?orderCode=' + this.data.orderItems.orderCode + '&router=venOrderItem',
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    _this.setData({
      orderCode: options.code,
      classId: options.classId,
      //userId:options.uid,
      //statusArr: options.status,
      //best:options.best,
      userId: wx.getStorageSync('userInfo').userId
    })
    getOrderList(_this, options.code);
    orderState(_this, options.classId, options.code, wx.getStorageSync('userInfo').userId)
  },
  //评论课程直接跳转
  goCurriculum: function (e) {
    let code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../../../pages/changGuan/c-Venuecomment/c-Venuecomment?orderCode=' + code,
    })
  },
  //点击去付款出现的弹窗
  goPay: function (e) {
    let code = e.currentTarget.dataset.code;
    let classid = e.currentTarget.dataset.classid;
    let sectionid = e.currentTarget.dataset.sectionid;
    this.setData({
      isDialogPay: true,
      //isScroll: false
    })
  },
  //更多操作（暂停课程、申请退款）
  goStops: function (e) {
    let code = e.currentTarget.dataset.code;
    console.log(code)
    this.setData({
      isDialogShow: true,
      //isScroll: false,
      stopCode: code
      
    })
  },
  //申请退款直接跳转
  refundFun: function (e) {
    if (e.currentTarget.dataset.code) {
      let code = e.currentTarget.dataset.code;
      wx.navigateTo({
        url: '../../../pages/changGuan/c-VenueOrder-Application/c-VenueOrder-Application?orderCode=' + code + '&router=venOrderItem',
      })
    } else {
      let code = this.data.stopCode;
      wx.navigateTo({
        url: '../../../pages/changGuan/c-VenueOrder-Application/c-VenueOrder-Application?orderCode=' + code + '&router=venOrderItem',
      })
    }
    this.setData({
      isDialogPay: false,
      //isScroll: true,
      isDialogShow: false
    }) 
  },
  //取消事件
  cancels: function (e) {
    this.setData({
      isDialogPay: false,
      //isScroll: true,
      isDialogShow: false
    })  
  },
  //暂停课程
  stopCoase: function (e) {
    var that = this;
    let code = e.currentTarget.dataset.code;
    if (code) {
      that.setData({
        isDialogPay: false,
        //isScroll: true,
        isDialogShow: false
      })
      wx.showModal({
        title: '提示',
        content: '您确认暂停课程吗？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.url + '/v1/order/updateOrderClassStatus',
              header: { 'token': wx.getStorageSync('userInfo').token },
              method: 'GET',
              data: {
                'orderCode': code,
                'classStatus': '01',
                'source': '0'
              },
              success: (res) => {
                if (res.data.code == '10000') {
                  let orderItems = that.data.orderItems;
                  orderItems.orderStatus = '06';
                  that.setData({
                    orderItems: orderItems
                  })
                }else{
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  });
                }
              },
              fail: (info) => {
                wx.showToast({
                  title: '暂停失败，请刷新重试',
                  icon:'none'
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }

      })
    } else {
      let code = that.data.stopCode;
      that.setData({
        isisDialogPay: false,
        //isScroll: true,
        isDialogShow: false
      })
      wx.showModal({
        title: '提示',
        content: '您确认暂停课程吗？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.url + '/v1/order/updateOrderClassStatus',
              header: { 'token': wx.getStorageSync('userInfo').token },
              method: 'GET',
              data: {
                'orderCode': code,
                'classStatus': '01',
                'source': '0'
              },
              success: (res) => {
                if (res.data.code == '10000') {
                  let orderItems = that.data.orderItems;
                  orderItems.orderStatus = '06';
                  that.setData({
                    orderItems: orderItems
                  })
                }else{
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  });
                }
              },
              fail: (info) => {
                wx.showToast({
                  title: '暂停失败，请刷新重试',
                  icon: 'none'
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }

      })
    }
  },
  //学员取消退款
  cancelreFund: function (e) {
    var that = this;
    let code = e.currentTarget.dataset.code;
    wx.request({
      url: app.url + '/v1/order/updateOrderRefund',
      header: { 'token': wx.getStorageSync('userInfo').token },
      method: 'GET',
      data: {
        'orderCode': code,
        'refundStatus': '03'
      },
      success: (res) => {
        if (res.data.code == '10000') {
          let statuList = that.data.orderItems;
            if (statuList.orderCode == code) {
              statuList.orderStatus = '02'
          }
          wx.showToast({
            title: '取消成功',
          })
          that.setData({
            status: statuList
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },800);
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          });
        }
      },
      fail: (info) => {
        wx.showToast({
          title: '取消退款失败，请稍后再试',
          icon: 'none'
        })
      }
    })
  },

  //微信支付
  goWechatPay: function (e) {
    var that = this;
    
    if (that.data.orderItems.spareCost <= 0) {
      wx.showToast({
        title: '课程金额为0元，请选择线下支付！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    that.setData({
      isDialogPay: false,
      //isScroll: true
    });
    toPayClass(that, that.data.orderCode, that.data.userId)
  },

  //已线下支付
  goDownPay: function (e) {
    var that = this;
    that.setData({
      isDialogPay: false,
      //isScroll: true
    })
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
          if (results == '00' || results == '01') {//线下支付允许已报满购买
            wx.request({
              url: app.url + '/v1/order/updateOrderPayType',
              header: { 'token': wx.getStorageSync('userInfo').token },
              method: 'GET',
              data: {
                'orderCode': that.data.orderCode,
                'payType': '0'
              },
              success: (res) => {
                if (res.data.code == '30005') {
                  //跳转到首页  
                  wx.navigateTo({
                    url: "../../../pages/register/register"
                  });
                  return;
                }
                if (res.data.code == '10000') {
                  let orderItems = that.data.orderItems;
                  orderItems.orderStatus = "00";  
                    that.setData({
                      orderItems: orderItems
                    })
                    wx.showToast({
                      title: "提交成功，请等待教练确认！",
                      icon: "none"
                    });
                }else{
                  wx.showToast({
                    title: res.data.msg,
                    icon: "none"
                  }); 
                }
              },
              fail: (info) => {
                wx.showToast({
                  title: '提交失败，请稍后再试',
                  icon: "none"
                });
              }
            })
          } else {
            let message = (results == '02' ? "该课程已下架,无法继续购买!" : results == '03' ? "该课程已不存在,无法继续购买!" : results == '04' ? "订单中课程时段与您已经购买的课程有冲突,无法继续购买" : "操作失败请稍后再试！");
            wx.showToast({
              title: message,
              icon: "none"
            });
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          }); 
        }
      },
      fail: function (info) {
        console.log("请求后台失败")
      }
    })
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
    app.noType();
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


  weiLiao: function (e) {
    let coachuserId = this.data.orderItems.coachUserId;
    let nickname = this.data.orderItems.classCoach;
    let avatarurl = this.data.orderItems.coachPhotoAddress;
    let userimname = "coachIM" + coachuserId;
    wx.navigateTo({
      url: '../../../pages/new/chitchat/chitchat?userimname=' + userimname + '&type=coach&avatarurl=' + avatarurl + '&nickname=' + nickname,
    })
  },
})
//获取学员订单详情
function getOrderList(that,code){ 
  wx.request({
    url: app.url + '/v1/order/getOrderDetailForStudent',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method:'GET',
    data:{
      'orderCode':code
    },
    success:function(res){
      console.log(res)
      res.data.response.itemStudentGrade = 'L' + res.data.response.itemStudentGrade.replace(new RegExp(",", 'g'), "L");
      res.data.code == '10000' ? that.setData({orderItems:res.data.response}) : wx.showToast({
        title: '后台出错了',
      })
      // that.setData({
      //   week:chinanum(res.data.response.weekDay),
      //   sectionid: res.data.response.classSectionId,
      //   classId: res.data.response.classId,
      // })
    },
    fail:function(info){
      wx.showToast({
        title: '获取订单详情失败，请稍后再试',
        icon: "none"
      });
    }
  })
}
//获取学员订单已参加的课程情况
function orderState(_this,classId,orderCode,userId){
  wx.request({
    url: app.url + '/v1/attend/getClassAttendForStudent',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method:'GET',
    data:{
      'classId': classId,
      'orderCode': orderCode,
      'userId': userId
    },
    success:(res)=>{
      if (res.data.code == '30005') {
        //跳转到首页  
        wx.navigateTo({
          url: "../../../pages/register/register"
        });
        return;
      }
      if(res.data.code=='10000'){
        _this.setData({
          orderStates:res.data.response
        })
      }
    },
    fail:(info)=>{
      wx.showToast({
        title: '获取已参加课程失败，请稍后再试',
        icon: "none"
      });
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

function toPayClass(that, orderCode, userId) {
  wx.request({
    url: app.url + '/v1/order/getClassJoinStatusByOrderCode',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      orderCode: orderCode
    },
    success: function (res) {
      if (res.data.code == '10000') {
        let code = res.data.response;
        if (code == '00') {
          wx.request({
            url: app.url + '/v1/order/getPayInfoByOrderCode',
            header: { 'token': wx.getStorageSync('userInfo').token },
            method: 'GET',
            data: {
              userId: userId,
              orderCode: orderCode
            },
            success: function (res) {
              if (res.data.code == '30005') {
                //跳转到首页  
                wx.navigateTo({
                  url: "../../../pages/register/register"
                });
                return;
              }
              if (res.data.code == '10000') {
                wx.requestPayment(
                  {
                    'timeStamp': res.data.response.timeStamp,
                    'nonceStr': res.data.response.nonceStr,
                    'package': res.data.response.packageValue,
                    'signType': res.data.response.signType,
                    'paySign': res.data.response.paySign,
                    'success': function (res) {
                      wx.redirectTo({
                        url: '../../keChen/paymentsuccessfully/paymentsuccessfully?orderCode=' + orderCode,
                      })
                    },
                    'fail': function (res) {
                      wx.showToast({
                        title: '网络异常，请稍后再试',
                        icon: "none"
                      });
                    }
                  })


              } else {
                wx.showToast({
                  title: '网络异常，请刷新后再试！',
                })
              }
            },
            fail: function (info) {
              wx.showToast({
                title: '网络异常，请稍后再试',
                icon: "none"
              });
            }
          })
        } else {
          let message = (code == '01' ? "订单中包含报名已满的时段,无法继续购买!" : code == '02' ? "该课程已下架,无法继续购买!" : code == '03' ? "该课程已不存在,无法继续购买!" : code == '04' ? "订单中课程时段与您已经购买的课程有冲突,无法继续购买":"操作失败请稍后再试！");
          wx.showToast({
            title: message,
            icon:"none"
          })
        }
      } else {
        wx.showToast({
          title: '后台开小差了',
        })
      }
    },
    fail: function (info) {
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon: "none"
      });
    }
  })
}