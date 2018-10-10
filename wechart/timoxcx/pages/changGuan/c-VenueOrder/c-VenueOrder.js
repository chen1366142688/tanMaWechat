// pages/changGuan/c-VenueOrder/c-VenueOrder.js
const app=getApp().globalData;  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:['申请退款','评论课程','去付款','评论课程'],
    footerTxt:'已经到底了',
    order:'active',
    url:'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/',
    orders:'',
    week:'',
    arr1:['03','05'],
    arr2:['00','01','02','04','06','07'],
    isDialogShow:false,
    isDialogPay: false,
    isScroll: true ,
    goPayCode:'',
    stopCode:'',
    num:1,
    uid:'1',
    stas:1,
    showFooter:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    var num = that.data.num;
    var uid = that.data.uid;
    var yes = 'n';
    console.log(options.sortOk)
    if (options.sortOk == 'ok') {
      /*这是筛选过来的*/
      var sortResult = wx.getStorageSync('sortResult');
      if (sortResult.length=="0"){
        wx.showToast({
          title: '没有数据',
        })
        that.setData({
          status: sortResult,
          num: options.num,
          footerTxt:"此条件没有数据"
        }) 
      }else{
        that.setData({
          status: sortResult,
          num: options.num
        }) 
      }
    }else{
      studentState(that, that.data.arr2, num, uid, yes) 
    }  
  },
  //跳转到订单详情
  orderItem:function(e){
    console.log(e)
    let orderCode = e.currentTarget.dataset.ordercodes;
    let classId = e.currentTarget.dataset.classid;
    let status = e.currentTarget.dataset.status;
    let spareTime = e.currentTarget.dataset.spareTime; 
    let courseCount = e.currentTarget.dataset.courseCount;
    let types = e.currentTarget.dataset.type;
    let uid=this.data.uid;
    let best=''
    if (status=='02' && (spareTime == courseCount) && types==1){
      console.log("更多操作（暂停课程/申请退款）")
      best ='更多操作'
    } else if (status == '02' && (spareTime == courseCount) && types == 2){
      console.log("申请退款")
      best = '申请退款'
    } else if (status == '02' && (spareTime < courseCount) && types == 1){
      console.log("暂停课程")
      best = '暂停课程'
    } else if (status == '04'){
      console.log("取消退款")
      best = '取消退款'
    }
    else if (status == '03') {
      console.log("评论课程")
      best = '评论课程'
    }
    else if (status == '01') {
      console.log("去付款")
      best = '去付款'
    }
    wx.navigateTo({
      url: '../../../pages/changGuan/c-VenueOrder-item/c-VenueOrder-item?code=' + orderCode + '&&classId=' + classId + '&&uid=' + uid + '&&status=' + status+'&&best='+best,
    })
  },
  //订单筛选
  orderSort:function(e){
    wx.navigateTo({
      url: '../../../pages/changGuan/c-Venuescreen/c-Venuescreen?userId='+this.data.uid+'&pageNum='+this.data.num,
    })
  },
  //拨打电话
  callPhone:function(e){
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  //切换颜色
  order:function(e){
    console.log(e)
    var that=this;
    var uid = that.data.uid;
    var val=e.currentTarget.dataset.order;
    var yes='n'
    if(val == 1 ){
      studentState(that, that.data.arr2, 1, uid,yes) 
      that.setData({
        order:'active',
        orders:'',
        stas: val
      })
    }else{
      studentState(that, that.data.arr1, 1, uid,yes)
      that.setData({
        order: '',
        orders: 'active',
        stas: val
      })
    }
  },
  //暂停课程
  stopCoase:function(e){
    var that=this;
    let code = e.currentTarget.dataset.orderCode;
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
            console.log('用户点击确定')
            wx.request({
              url: 'http://192.168.3.4:8081/v1/order/updateOrderClassStatus',
              method: 'GET',
              data: {
                'orderCode': code,
                'classStatus': '01'
              },
              success: (res) => {
                console.log(res)
                if (res.data.code == '10000') {
                  let statuList = that.data.status;
                  for (let x in statuList) {
                    if (statuList[x].orderCode == code) {
                      statuList[x].orderStatus = '07'
                    }
                  }
                  that.setData({
                    status: statuList
                  })
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
            console.log('用户点击确定')
            wx.request({
              url: 'http://192.168.3.4:8081/v1/order/updateOrderClassStatus',
              method: 'GET',
              data: {
                'orderCode': code,
                'classStatus': '01'
              },
              success: (res) => {
                console.log(res)
                if (res.data.code == '10000') {
                  let statuList = that.data.status;
                  for (let x in statuList) {
                    if (statuList[x].orderCode == code) {
                      statuList[x].orderStatus = '07'
                    }
                  }
                  that.setData({
                    status: statuList
                  })
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
  //点击去付款出现的弹窗
  goPay:function(e){
    let code = e.currentTarget.dataset.code;
    that.setData({
      isDialogShow: true,
      isScroll: false,
      goPayCode:code
    })
  },
  //评论课程直接跳转
  goCurriculum:function(e){
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
        url: '../../../pages/changGuan/c-VenueOrder-Application/c-VenueOrder-Application?orderCode=' + code,
      })
    }else{
      let code = e.currentTarget.dataset.code;
      wx.navigateTo({
        url: '../../../pages/changGuan/c-VenueOrder-Application/c-VenueOrder-Application?orderCode=' + code,
      })
    }
    
  },
//学员取消退款
  cancelreFund:function(e){
    console.log("what")
    var that = this;
    let code = e.currentTarget.dataset.code;
    wx.request({
      url: 'http://192.168.3.4:8081/v1/order/updateOrderRefund',
      method:'GET',
      data:{
        'orderCode':code,
        'refundStatus':'03'
      },
      success:(res)=>{
        console.log(res)
        if(res.data.code=='10000'){
          let statuList = that.data.status;
          for (let x in statuList) {
            if (statuList[x].orderCode == code) {
              statuList[x].orderStatus = '02'
            }
          }
          that.setData({
            status: statuList
          })
        }
      },
      fail:(info)=>{
        console.log("取消失败了")
      }
    })
  },
  //更多操作（暂停课程、申请退款）
  goStops:function(e){
    let code = e.currentTarget.dataset.code;
    that.setData({
      isDialogShow: false,
      isScroll: true,
      stopCode:code
    })
  },
  //微信支付
  goWechatPay:function(e){
    var that=this;
    let code = that.data.goPayCode;
    that.setData({
      isDialogPay: false,
      isScroll: true
    })
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
      url: 'http://192.168.3.4:8081/v1/order/updateOrderPayType',
      method:'GET',
      data:{
        'orderCode':code,
        'payType':'0'
      },
      success:(res)=>{
        console.log("ok");
        if (res.data.code == '10000') {
          let statuList = that.data.status;
          for (let x in statuList) {
            if (statuList[x].orderCode == code) {
              statuList[x].orderStatus = '00'
            }
          }
          that.setData({
            status: statuList
          })
        }
      },
      fail:(info)=>{
        console.log("后端返回失败了")
      }
    })
  },
  //取消事件
  cancels:function(e){
    console.log("用户点击了取消")
    that.setData({
      isDialogPay: false,
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
  //下拉刷新
  tolower:function(){
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    })
    var that = this;
    var num = that.data.num;
     num ++;
     that.setData({num:num})
    var sta = that.data.stas;
    var uid = that.data.uid;
    var arr1=that.data.arr1;
    var arr2=that.data.arr2;
    var yes='y'
    if (sta == '') {
      studentState(that, arr2, num, uid,yes);
    } else if (sta == 1) {
      studentState(that, arr2, num, uid, yes);
    } else {
      studentState(that, arr1, num, uid, yes);
    }
  },
})
//请求列表
function studentState(that,arr,num,uid,yes) {
  //判断是否是点击的事件
  if(num==1){//这是第一次或者是点击的请求
    wx.request({
      url: 'http://192.168.3.4:8081/v1/order/getOrderForStudentList',
      method: 'POST',
      data: {
        "classIds": [],
        "homeIds": [],
        "orderStatuss": arr,
        "pageNumber": num,
        "theNumber": 10,
        "userId": uid
      },
      success: (res) => {
        if (res.data.code == '10000') {
          wx.hideLoading();
          for (let i in res.data.response) {
            res.data.response[i].weekDay = '周' + chinanum(res.data.response[i].weekDay)
          }
          that.setData({
            status: res.data.response
          })
        }
      },
      fail: (info) => {
        console.log("请求失败了")
      }
    })
  }else{
      //判断数据是否为空
      if (that.data.showFooter==1){
        wx.hideLoading();
        return false;
      }else{
        wx.request({
          url: 'http://192.168.3.4:8081/v1/order/getOrderForStudentList',
          method: 'POST',
          data: {
            "classIds": [],
            "homeIds": [],
            "orderStatuss": arr,
            "pageNumber": num,
            "theNumber": 10,
            "userId": uid
          },
          success: (res) => {
            if (res.data.code == '10000') {
              if(res.data.response==''){
                wx.hideLoading();
                that.setData({
                  showFooter:1
                })
                return false;
              } 
              wx.hideLoading();
              for(let i in res.data.response){
                res.data.response[i].weekDay='周'+chinanum(res.data.response[i].weekDay)
              }
              //插入数据,这是正常载入
              if(yes=='n'){
                that.setData({
                  status: res.data.response
                })
              }else{//这是加载更多
                let addStatus=that.data.status;
                addStatus=addStatus.concat(res.data.response);
                that.setData({
                  status: addStatus
                })
              }
            }
          },
          fail: (info) => {
            wx.showToast({
              title: '请求失败',
            })
          }
        })
      }
    }
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