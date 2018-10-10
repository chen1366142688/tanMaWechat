// pages/changGuan/c-VenueOrder/c-VenueOrder.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    orderList:['申请退款','评论课程','去付款','评论课程'],
    footerTxt:'————已全部显示————',
    order:'active',
    orders:'',
    week:'',
    arr1: ['03', '05', '99'],
    arr2:['00','01','02','04','06','07'],  
    isDialogShow:false,
    isScroll: true ,
    goPayCode:'',
    stopCode:'',
    num:1,
    uid:'1',
    stas:1,
    showFooter:0,
    markes:'这是订单备注',
    diss:true,
    option:{},
    focus:false,
    coachEdtorSure:false,
    coachEdtor:true,
    orderValue:'',
    marks:[],
    indes:'',
    name:'',
    classId:"",
    Period: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var uid = options.userId;
    var titleName=options.name;
    var classId = options.classId;
    var nums = options.nums;
    that.setData({
      option:options,
      classId: classId
    })
    wx.setNavigationBarTitle({
      title: titleName+' '+ nums+'人班'
    })
  },
  //修改编辑状态
  orderEditor:function(e){
    //编辑当前的备注信息
    console.log(e)
    var orderCode = e.currentTarget.dataset.ordercode;
    console.log(orderCode)
    var that=this;
    var status = that.data.orderList;
    for (var i = 0; i <status.length;i++){
      if (status[i].orderCode == orderCode){
        status[i].diss = false;
      }
    }
    that.setData({
      orderList:status
    })
  },
  //提交修改的备注信息
  orderEditorSub:function(e){
    var that=this;
    var orderCode = e.currentTarget.dataset.ordercode;
    var status = that.data.orderList;
    var value;
    for (var i = 0; i < status.length; i++) {
      if (status[i].orderCode == orderCode) {
        value = status[i].coachRemarks;
      }
    }
    var url = app.url + '/v1/order/updateOrderCoachInfo?orderCode='+orderCode+'&coachRemarks='+value;
    wx.request({
      url: url,
      method:'GET',
      header: { 'token': wx.getStorageSync('userInfo').token },
      data:{},
      success:function(res){
        if(res.data.code=='10000'){
          wx.showToast({
            title: '修改成功',
          })
          var status = that.data.orderList;
          for (var i = 0; i < status.length; i++) {
            if (status[i].orderCode == orderCode) {
              status[i].diss = true;
              status[i].coachEdtor=false;
            }
          }
          that.setData({
            orderList: status
          })
        }else{
          wx.showToast({
            title: '修改失败',
          })
        }
      },
      fail:function(info){
        wx.showToast({
          title: '修改失败',
        })
      }
    })
  },

  weiLiao: function (e) {
    let fromPage = wx.setStorageSync("orderListFrom", 'im');
    let studentuserid = e.currentTarget.dataset.studentuserid;
    let nickname = e.currentTarget.dataset.nickname;
    let avatarurl = e.currentTarget.dataset.photo;
    let userimname = "studentIM" + studentuserid;
    wx.navigateTo({
      url: '../../../pages/news/chitchat/chitchat?userimname=' + userimname + '&type=coach&avatarurl=' + avatarurl + '&nickname=' + nickname,
    })
  },
  //输入的时候显示对勾
  pushText:function(e){
    var that=this;
    var status = that.data.orderList;
    var code = e.currentTarget.dataset.id;
    var value = e.detail.value;
    var cursor = e.detail.cursor;
    console.log(value)
    if (!cursor){//等于0
    console.log("这是等于0")
      for (var i = 0; i < status.length; i++) {
        if (status[i].orderCode == code) {
          status[i].coachEdtor = false;
          status[i].coachRemarks=value;
        }
      }
      that.setData({
        orderList: status
      })
    }else{
      console.log("这是不等0")
      for (var i = 0; i < status.length; i++) {
        if (status[i].orderCode == code) {
          status[i].coachEdtor = true;
          status[i].coachRemarks = value;
        }
      }
      that.setData({
        orderList: status
      })
    }
    
  },
  //跳转到订单详情
  orderItem:function(e){
    console.log(e)
    wx.setStorageSync("orderListFrom", "detail");
    let orderCode = e.currentTarget.dataset.ordercodes;
    let classId = e.currentTarget.dataset.classid;
    let status = e.currentTarget.dataset.status;
    let spareTime = e.currentTarget.dataset.spareTime; 
    let courseCount = e.currentTarget.dataset.courseCount;
    let types = e.currentTarget.dataset.type;
    let uid=this.data.uid;
    let best=''
    if (status=='00'){
      console.log("已下单待教练确认")
      best ='确认已付款'
    } else if (status == '01'){
      console.log("已下单待学员支付")
      best = '取消订单'
    } else if (status == '02'){
      console.log("已支付课程进行中")
      best = '更多操作'
    } else if (status == '04'){
      console.log("退款申请中")
      best = '学员申请退款'
    }
    else if (status == '03' || status == '05') {
      console.log("评论课程")
      best = '评论学员' 
    }
    console.log(best)
    wx.navigateTo({
      url: '../../../pages/curriculum/Order-Form/Order-Form?code=' + orderCode + '&&classId=' + classId + '&&uid=' + uid + '&&status=' + status + '&&best=' + best + '&&stas=' + this.data.stas ,
    })
  },
  //订单筛选
  orderSort:function(e){
    wx.navigateTo({
      url: '../../../pages/curriculum/Order-Selection/Order-Selection?userId=' + this.data.uid + '&pageNum=' + this.data.num + "&classId=" + this.data.classId + "&stas=" + this.data.stas,
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
    var that = this;
    var val = e.currentTarget.dataset.order;
    if (val == 1) {
      wx.setStorageSync("orderStatus", that.data.arr2)
      that.setData({
        order: 'active',
        orders: '',
        stas: val,
        num: 1,
        showFooter: 0,
        Period:0,
        orderList: []
      })
    } else {
      wx.setStorageSync("orderStatus", that.data.arr1)
      that.setData({
        order: '',
        orders: 'active',
        stas: val,
        num: 1,
        showFooter: 0,
        Period:0,
        orderList: []
      })
    }
    queryOrderList(that);
  },
  //暂停课程
  stopCoase:function(e){
    var that=this;
    let code = that.data.stopCode;
    let name = that.data.name;   
    let className = that.data.className;
    let maxNumber = that.data.maxNumber;
    if(code){
      that.setData({
        isDialogShow: false,
        isScroll: true
      })
      wx.showModal({
        title: '提示',
        content: '暂停学员' + name + ' 的 ' + className + ' | ' + maxNumber+'人班 课程（暂停后，该学员不再收到本课程的任何开课通知），是否确认？',
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
                'source':'1'
              },
              success: (res) => {
                if (res.data.code == '10000') {
                  wx.showToast({
                    title: '操作成功',
                  })
                  let statuList = that.data.orderList;
                  for (let x in statuList) {
                    if (statuList[x].orderCode == code) {
                      statuList[x].orderStatus = '07'
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
              fail: (info) => {
                console.log("请求失败了")
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
           
          }
        }
      })
    }
  },
  //点击确认已付款弹窗提示
  goPay:function(e){
    var that=this;
    var code = e.currentTarget.dataset.code;
    var name = e.currentTarget.dataset.name;
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
          if (results != '04') { //04=时间冲突
            wx.showModal({
              title: '线下付款确认',
              content: '学员' + name + ' 已在线下支付本课程的全部费用，是否确认？',
              cancelText: '未付款',
              confirmText: '已付款',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  updateOrderPayStatus(that, code, "02")
                } else if (res.cancel) {
                  console.log('用户点击取消')
                  updateOrderPayStatus(that, code, "01")
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
                  updateOrderPayStatus(that, code, "01")
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
  //评论课程直接跳转
  goCurriculum:function(e){
    wx.setStorageSync("orderListFrom", "comment");
    let code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../../../pages/curriculum/Comment/Comment?orderCode=' + code,
    })
  },
  //修改剩余课时是跳转下个界面
  refundFun:function(e){
    var that=this;
    if (e.currentTarget.dataset.code){
      var code = e.currentTarget.dataset.code;
      var name = e.currentTarget.dataset.name;
    }else{
      var code = this.data.stopCode;
      var name = this.data.name;
    }
    that.setData({
      isDialogShow: false,
      isScroll: true
    });
    wx.navigateTo({
      url: '../../../pages/curriculum/Modification/Modification?orderCode='+code,//这是修改课时页面
    })
  },
  
//学员申请退款
  cancelreFund:function(e){
    console.log("what")
    var that = this;
    var code = e.currentTarget.dataset.code;
    var name = e.currentTarget.dataset.name;
    wx.showModal({
      title: '学员申请退款',
      content: '学员' + name + '申请退还本课程的全部费用，是否同意？',
      cancelText: '不同意',
      confirmText: '同意',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击同意')
          studentTui(that, code, '01')
        } else if (res.cancel) {
          console.log('用户点击取消')
          studentTui(that, code, '02')
        }
      }
    })
  },

  //学员申请暂停
  cancelreStop: function (e) {
    var that = this;
    var code = e.currentTarget.dataset.code;
    var name = e.currentTarget.dataset.name;
    var classname = e.currentTarget.dataset.classname;
    wx.showModal({
      title: '学员申请暂停课程',
      content: '学员' + name + '申请暂停课程' +classname+'，是否同意？',
      cancelText: '不同意',
      confirmText: '同意',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击同意')
          sureMOney(that, code, '02')
        } else if (res.cancel) {
          console.log('用户点击不同意')
          sureMOney(that, code, '00')
        }
      }
    })
  },
//重启课程
  cancelreStart: function (e) {
    var that = this;
    var code = e.currentTarget.dataset.code;
    var name = e.currentTarget.dataset.name;
    var classname = e.currentTarget.dataset.classname;
    wx.showModal({
      title: '学员课程重启',
      content: '确定重启学员' + name + '的' + classname + '课程？',
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          sureMOney(that, code, '00')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //取消订单
  cancelOrder: function (e) {
    var that = this;
    var code = e.currentTarget.dataset.code;
    studentTui(that, code, '99');
  },
//直接暂停课程
  stopOrderStatus: function (e) {
    var that = this;
    var code = e.currentTarget.dataset.code;
    var name = e.currentTarget.dataset.name;
    var className = e.currentTarget.dataset.classname;
    var maxNumber = e.currentTarget.dataset.maxnumber;
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
                let statuList = that.data.orderList;
                for (let x in statuList) {
                  if (statuList[x].orderCode == code) {
                    statuList[x].orderStatus = '07'
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

  //更多操作（暂停课程、申请退款）
  goStops:function(e){
    var that=this;
    console.log(e)
    var code = e.currentTarget.dataset.code;
    var name = e.currentTarget.dataset.name;
    var className = e.currentTarget.dataset.classname;
    var maxNumber = e.currentTarget.dataset.maxnumber;
    that.setData({
      isDialogShow: true,
      isScroll: false,
      stopCode:code,
      name:name,
      className: className,
      maxNumber: maxNumber
    })
  },
  
  
  //取消事件
  cancels:function(e){
    console.log("用户点击了取消")
    var that=this;
    that.setData({
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var res = wx.getSystemInfoSync()
    let fromPage = wx.getStorageSync("orderListFrom");
    let isChange = wx.getStorageSync("orderListChange");
    wx.setStorageSync("orderListChange", false);
    wx.setStorageSync("orderListFrom", "");
    if ('select' == fromPage) {
      if (isChange == true) {
        that.setData({
          num: 1,
          showFooter: 0,
          orderList: []
        })
        queryOrderList(that);
      } else {
        return false;
      }
    } else if ('im' == fromPage || "callPhone" == fromPage) {

    } else if ('detail' == fromPage || 'comment' == fromPage) {
      that.setData({
        num: 1,
        showFooter: 0,
        orderList: []
      })
      queryOrderList(that);
    } else if (fromPage == '' || fromPage == null) {
      that.setData({
        order: 'active',
        orders: '',
        stas: 1,
        num: 1,
        showFooter: 0,
        orderList: []
      })
      if (this.data.stas == 1) {
        wx.setStorageSync("orderStatus", that.data.arr2)
      } else {
        wx.setStorageSync("orderStatus", that.data.arr1)
      }
      queryOrderList(that)
    }
    if (that.data.orderList.length == 0) {
      that.setData({ Period: 1 })
    } else {
      that.setData({ Period: 0 })
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
    console.log("用户下拉了")
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
    
  },
  //下拉刷新、
  toRefash:function(e){
  },
  //上拉加载更多
  tolower:function(){
    // 显示加载图标  
    if (this.data.showFooter == 0) {
      var that = this;
      that.setData({
        num: that.data.num + 1
      })
      queryOrderList(that);
    }
  },
})
//请求列表
function queryOrderList(that) {
  wx.showLoading({
    title: '加载中...',
  })
  wx.request({
    url: app.url + '/v1/order/getOrderForCoachList',
    method: 'POST',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      "classId": that.data.classId,
      "orderStatuss": wx.getStorageSync("orderStatus"),
      "pageNumber": that.data.num,
      "theNumber": 10,
      "userId": wx.getStorageSync('userInfo').userId,
    },
    success: (res) => {
      wx.hideLoading();
      if (res.data.code == '10000') {
        if (res.data.response.length == 0 && that.data.num==1){
          that.setData({ Period: 1, showFooter: 0})
          return false;
        }
        if (res.data.response.length < 10) {
          that.setData({
            Period: 0,
            showFooter: 1
          })
        }
        for (let i = 0; i < res.data.response.length; i++) {
         // res.data.response[i].weekDay = '周' + chinanum(res.data.response[i].weekDay);
          res.data.response[i].coachEdtor = false;
          res.data.response[i].diss = true;
          res.data.response[i].itemStudentGrade = 'L' + res.data.response[i].itemStudentGrade.replace(new RegExp(",", 'g'), " L");
        }
        let list = that.data.orderList;
        list = list.concat(res.data.response);
        that.setData({
          Period: 0,
          orderList: list
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        });
      }
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
/**
 * refundStatus（01审核通过 02审核不通过 99教练取消订单）
 */
function studentTui(that, orderCode, refundStatus){
  var status = that.data.orderList;
    wx.request({
      url: app.url + '/v1/order/updateOrderRefund',
      method: 'GET',
      header: { 'token': wx.getStorageSync('userInfo').token },
      data: {
        'orderCode': orderCode,
        'refundStatus': refundStatus
      },
      success: function (res) {
        if(res.data.code=='10000'){
          var orderStatus="";
          if (refundStatus == '01') { 
            orderStatus = "05";
          } else if (refundStatus == '02') { 
            orderStatus = '02'
          }else{
            orderStatus = '99'
          }
          for (var i in status) {
            if (status[i].orderCode == orderCode) {
              if (refundStatus == '99'){
                status.splice(i, 1);
              }else{
                status[i].orderStatus = orderStatus
              }
            }
          }
          that.setData({
            orderList: status
          })
          wx.showToast({
            title: '操作成功！',
          }) 
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      },
      fail: function (info) {
        wx.showToast({
          title: '操作失败，请重试',
        })
      }
    })
}
/**
 * 改变课程状态
 * payStatus：00正常；02暂停中
 */
function sureMOney(that, code, classStatus){
  wx.request({
    url: app.url + '/v1/order/updateOrderClassStatus',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      'orderCode': code,
      'classStatus': classStatus,
      'source': '1'
    },
    success: function (res) {
      if (res.data.code == '10000') {
        var status = that.data.orderList;
        var orderStatus="";
        if (classStatus == '00') {
          orderStatus="02";//
        } else if (classStatus == '02') {
          orderStatus = "07";//
        }
        for (var i in status) {
          if (status[i].orderCode == code) {
            status[i].orderStatus = orderStatus
          }
        }
        that.setData({
          orderList: status
        })
        wx.showToast({
          title: '操作成功！',
        }) 
      }else{
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
function updateOrderPayStatus(that, code, payStatus) {
  wx.request({
    url: app.url + '/v1/order/updateOrderPayStatus',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      'orderCode': code,
      'payStatus': payStatus
    },
    success: function (res) {
      if (res.data.code == '10000') {
        var status = that.data.orderList;
        var orderStatus = "";
        if (payStatus == '01') {
          orderStatus = "01";//
        } else if (payStatus == '02') {
          orderStatus = "02";//
        }
        for (var i in status) {
          if (status[i].orderCode == code) {
            status[i].orderStatus = orderStatus
          }
        }
        that.setData({
          orderList: status
        })
        wx.showToast({
          title: '操作成功！',
        })
      }else{
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