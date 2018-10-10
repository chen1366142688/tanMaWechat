// pages/changGuan/c-VenueOrder/c-VenueOrder.js
const app=getApp().globalData;  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:['申请退款','评论课程','去付款','评论课程'],
    footerTxt:'————已全部显示————',
    order:'active',
    url: app.imgUrl,
    orders:'',
    week:'',
    arr1: ['03', '05', '99'],
    arr2:['00','01','02','04','06','07'],
    isDialogShow:false,
    isDialogPay: false,
    isScroll: true ,
    goPayCode:'',
    payCost:0,
    stopCode:'',
    num:1,
    uid: wx.getStorageSync('userInfo').userId,
    stas:1,
    showFooter:0,
    sortOk:false,
    sortOks: false,
    Period: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },/**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.noType();
    
   
    let fromPage = wx.getStorageSync("orderListFrom");
    let isChange = wx.getStorageSync("orderListChange");
    wx.setStorageSync("orderListChange",false);
    wx.setStorageSync("orderListFrom", "");
    if ('select' == fromPage){
      if (isChange == true){
        that.setData({
          num: 1,
          showFooter:0,
          orderList: []
        })
        studentState(that);
      }else{
         return false;
      }
    } else if ('im' == fromPage || "callPhone" == fromPage){

    } else if ('detail' == fromPage || 'comment' == fromPage){
      that.setData({
        num: 1,
        showFooter: 0,
        orderList: []
      })
      studentState(that);
    }else if (fromPage == '' || fromPage == null){
      that.setData({
        order: 'active',
        orders: '',
        stas: 1,
        num: 1,
        showFooter: 0,
        orderList:[]
      })
      if (this.data.stas == 1){
        wx.setStorageSync("orderStatus", that.data.arr2)
      }else{
        wx.setStorageSync("orderStatus", that.data.arr1)
      }
      studentState(that)
    }
    if (that.data.orderList.length == 0) {
      that.setData({ Period: 1 })
    } else {
      that.setData({ Period: 0 })
    }
  },
  //跳转到订单详情
  orderItem:function(e){
    wx.setStorageSync("orderListFrom","detail");
    let orderCode = e.currentTarget.dataset.ordercodes;
    let classId = e.currentTarget.dataset.classid;
    let status = e.currentTarget.dataset.status;
    let spareTime = e.currentTarget.dataset.sparetime; 
    let courseCount = e.currentTarget.dataset.coursecount;
    let types = e.currentTarget.dataset.type;
    let uid=this.data.uid;
    let best=''
    let paySectionId = e.currentTarget.dataset.paysectionid;
    let payType = e.currentTarget.dataset.paytype
    if (status=='02' && (spareTime == courseCount) && types==1){
      console.log("更多操作（暂停课程/申请退款）")
      best ='更多操作'
    } else if (status == '02' && (spareTime == courseCount) && types == 2){
      best = '申请退款'
    } else if (status == '02' && (spareTime < courseCount) && types == 1){
      best = '暂停课程'
    } else if (status == '04'){
      best = '取消退款'
    }
    else if (status == '03') {
      best = '评论课程'
    }
    else if (status == '01') {
      best = '去付款'
    }
    wx.navigateTo({
      url: '../../../pages/changGuan/c-VenueOrder-item/c-VenueOrder-item?code=' + orderCode + '&&classId=' + classId,
    })
  },
  //订单筛选
  orderSort:function(e){
    wx.navigateTo({
      url: '../../../pages/changGuan/c-Venuescreen/c-Venuescreen?&stas=' + this.data.stas,
    })
  },
  //拨打电话
  callPhone:function(e){
    let fromPage = wx.setStorageSync("orderListFrom", 'callPhone');
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  //切换颜色
  order:function(e){
    var that=this;
    var val=e.currentTarget.dataset.order;
    if(val == 1 ){
      wx.setStorageSync("orderStatus", that.data.arr2)
      that.setData({
        order:'active',
        orders:'',
        stas: val,
        num: 1,
        showFooter: 0,
        orderList: [],
        Period:0
      })
    }else{
      wx.setStorageSync("orderStatus", that.data.arr1)
      that.setData({
        order: '',
        orders: 'active',
        stas: val,
        num: 1,
        showFooter: 0,
        orderList: [],
        Period:0
      })
    }
    studentState(that) 
  },
  //暂停课程
  stopCoase:function(e){
    var that=this;
    let code = e.currentTarget.dataset.code;
    if(code){
      that.setData({
        isDialogShow: false,
        isScroll: true
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
                  let statuList = that.data.orderList;
                  for (let x in statuList) {
                    if (statuList[x].orderCode == code) {
                      statuList[x].orderStatus = '06'
                    }
                  }
                  that.setData({
                    orderList: statuList
                  })
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  });
                }
              },
              fail: (info) => {
                wx.showToast({
                  title: '暂停失败，请稍后再试',
                  icon: 'none'
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }

      })
    }else{
      let code = that.data.stopCode;
      that.setData({
        isDialogShow: false,
        isScroll: true
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
                  let statuList = that.data.orderList;
                  for (let x in statuList) {
                    if (statuList[x].orderCode == code) {
                      statuList[x].orderStatus = '06'
                    }
                  }
                  that.setData({
                    orderList: statuList
                  })
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  });
                }
              },
              fail: (info) => {
                wx.showToast({
                  title: '暂停失败，请稍后再试',
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
  //点击去付款出现的弹窗
  goPay:function(e){
    var that=this;
    let code = e.currentTarget.dataset.code;
    let cost = e.currentTarget.dataset.cost;
    let classid = e.currentTarget.dataset.classid;
    //let sectionid = e.currentTarget.dataset.sectionid;
    that.setData({
      isDialogPay: true,
      isScroll: false,
      goPayCode:code,
      payCost:cost,
      goPayClassId:classid,
     // goPaySectionId: sectionid
    })
  },
  //评论课程直接跳转
  goCurriculum:function(e){
    wx.setStorageSync("orderListFrom", "comment");
    let code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../../../pages/changGuan/c-Venuecomment/c-Venuecomment?orderCode=' + code,
    })
  },
  //申请退款直接跳转
  refundFun:function(e){
    if (e.currentTarget.dataset.code){
      let code = e.currentTarget.dataset.code;
      wx.navigateTo({
        url: '../../../pages/changGuan/c-VenueOrder-Application/c-VenueOrder-Application?orderCode=' + code+'&router=venOrder',
      }) 
      this.setData({
        isDialogShow:false
      })
    }else{
      let code = this.data.stopCode;
      wx.navigateTo({
        url: '../../../pages/changGuan/c-VenueOrder-Application/c-VenueOrder-Application?orderCode=' + code + '&router=venOrder',
      })
      this.setData({
        isDialogShow: false
      })
    }
    
  },
//学员取消退款
  cancelreFund:function(e){
    var that = this;
    let code = e.currentTarget.dataset.code;
    wx.request({
      url: app.url + '/v1/order/updateOrderRefund',
      header: { 'token': wx.getStorageSync('userInfo').token },
      method:'GET',
      data:{
        'orderCode':code,
        'refundStatus':'03'
      },
      success:(res)=>{
        if(res.data.code=='10000'){
          let statuList = that.data.orderList;
          for (let x in statuList) {
            if (statuList[x].orderCode == code) {
              statuList[x].orderStatus = '02'
            }
          }
          that.setData({
            orderList: statuList
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          });
        }
      },
      fail:(info)=>{
        wx.showToast({
          title: '取消失败，请稍后再试',
          icon: 'none'
        })
      }
    })
  },
  //更多操作（暂停课程、申请退款）
  goStops:function(e){
    var that=this;
    let code = e.currentTarget.dataset.code;
    that.setData({
      isDialogShow: true,
      isScroll: true,
      stopCode:code
    })
  },
  //微信支付
  goWechatPay:function(e){
    var that=this;
    let code = that.data.goPayCode;
    let cost = that.data.payCost;
    if (cost <= 0){
      wx.showToast({
        title: '课程金额为0元，请选择线下支付！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    that.setData({
      isDialogPay: false,
      isScroll: true
    });
    toPayClass(that, code, that.data.uid)
  },
  //已线下支付
  goDownPay:function(e){
    var that = this;
    let code = that.data.goPayCode;
    that.setData({
      isDialogPay: false,
      isScroll: true
    })
    wx.request({
      url: app.url + '/v1/order/getClassJoinStatusByOrderCode',
      header: { 'token': wx.getStorageSync('userInfo').token },
      method: 'GET',
      data: {
        orderCode: code
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
                  'orderCode': code,
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
                    let statuList = that.data.orderList;
                    for (let x in statuList) {
                      if (statuList[x].orderCode == code) {
                        statuList[x].orderStatus = '00'
                      }
                    }
                    that.setData({
                      orderList: statuList
                    })
                    wx.showToast({
                      title: "修改成功，请等待教练确认！",
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
                    title: '修改失败，请稍后再试',
                    icon: 'none'
                  })
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
        wx.showToast({
          title: '网络异常，请稍后再试',
          icon: 'none'
        })
      }
    })   
  },
  //取消事件
  cancels:function(e){
    var that=this;
    that.setData({
      isDialogPay: false,
      isDialogShow: false,
      isScroll: true
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  weiLiao:function(e){
    let fromPage = wx.setStorageSync("orderListFrom",'im');
    let coachuserId = e.currentTarget.dataset.coachuserid;
    let nickname = e.currentTarget.dataset.nickname;
    let avatarurl = e.currentTarget.dataset.photo;
    let userimname = "coachIM" + coachuserId;
    wx.navigateTo({
      url: '../../../pages/new/chitchat/chitchat?userimname=' + userimname + '&type=coach&avatarurl=' + avatarurl + '&nickname=' + nickname,
    })
  },
  //下拉刷新
  tolower:function(){
    // 显示加载图标  
    if (this.data.showFooter == 0){
      var that = this;
      that.setData({
        num: that.data.num + 1
      })
      studentState(that);
    }
  },
})
//请求列表
function studentState(that) {
  wx.showLoading({
    title: '加载中...',
  })
  wx.request({
    url: app.url + '/v1/order/getOrderForStudentList',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'POST',
    data: {
      "orderStatuss": wx.getStorageSync("orderStatus"),
      "pageNumber": that.data.num,
      "theNumber": 10,
      "userId": wx.getStorageSync('userInfo').userId
    },
    success: (res) => {
      if (res.data.code == '30005') {
        wx.hideLoading();
        //跳转到首页  
        wx.navigateTo({
          url: "../../../pages/register/register"
        });
        return;
      }
      if (res.data.code == '10000') {
        if (that.data.num == 1 && res.data.response.length == 0) {
          that.setData({
            Period: 1,
            showFooter: 0,
          })
          wx.hideLoading();
          return false;
        }
        if (res.data.response.length < 10) {
          that.setData({
            showFooter: 1,
            Period: 0,
          })
        }
        for (let i in res.data.response) {
          res.data.response[i].weekDay = '周' + chinanum(res.data.response[i].weekDay)
        }
        let addStatus = that.data.orderList;
        addStatus = addStatus.concat(res.data.response);
        that.setData({
          Period: 0,
          orderList: addStatus
        })
      }
      wx.hideLoading();
    },
    fail: (info) => {
      wx.hideLoading();
      console.log("请求失败了")
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

function toPayClass(that, orderCode, userId){
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
              userId: wx.getStorageSync('userInfo').userId,
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
                        icon: 'none'
                      })
                    },
                    'complete': function (res) {

                    }
                  })
              } else {
                wx.showToast({
                  title: '网络异常，请刷新后再试！',
                  icon: 'none'
                });
              }
            },
            fail: function (info) {
              console.log("请求后台失败")
            }
          })
        } else {
          
          let message = (code == '01' ? "订单中包含报名已满的时段,无法继续购买!" : code == '02' ? "该课程已下架,无法继续购买!" : code == '03' ? "该课程已不存在,无法继续购买!" : code == '04' ? "订单中课程时段与您已经购买的课程有冲突,无法继续购买" : "操作失败请稍后再试！");
          wx.showToast({
            title: message,
            icon: "none"
          });
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
};