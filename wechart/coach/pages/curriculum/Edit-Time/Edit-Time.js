// pages/curriculum/Edit-Time/Edit-Time.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    checkted: '',
    checkted1: '',
    items: [],
    userId: '',
    classId:'',
    orderCode:'',
    studentUserId:'',
    orderSectionList:[],
    seletId:''
  },
  radioChange(e) {
    var value = e.detail.value;
    //console.log(value);
    var that=this;
    //var list=that.data.items;
    // for(var i=0;i<list.length;i++){
    //   if (value==list[i].sectionId){
    //     list[i].checked=true
    //   }else{
    //     list[i].checked = false
    //   }
    // }
    // that.setData({
    //   items:list,
    //   seletId: value
    // })
    //  that.setData({
    //    orderSectionList: value,
    // })
  },
  checkChange: function (e) {
    var sectionId = e.currentTarget.dataset.sectionid;
    console.log(e.currentTarget.dataset.checked);
    checkSection(this, sectionId);
  },
  studentState:function(e){
    var that=this;
    let tempSection = that.data.items;
    var selectSectionList=[];
    for (let i = 0; i < tempSection.length; i++) {
      if (tempSection[i].checked){
         selectSectionList.push(tempSection[i].sectionId);
         }
    }
    if (selectSectionList.length==0){
      wx.showToast({
        title: '请选择课程时段!',
      })
      return;
    }
    wx.request({
      url: app.url +'/v1/order/updateOrderSectionId',
      method:'GET',
      header: { 'token': wx.getStorageSync('userInfo').token },
      data:{
        'orderCode': that.data.orderCode,
        'sectionIdList': selectSectionList.toString()
      },
      success:function(res){
        if(res.data.code=='10000'){          
          wx.showToast({
            title: '提交成功！'
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1000);
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      },
      fail:function(re){
        wx.showToast({
          title: '提交失败！'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      orderCode: options.orderCode,
        classId: options.classId,
        orderSectionList: options.orderSectionList.split(","),
        studentUserId: options.studentUserId
    })
    console.log(this.data.orderSectionList);
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
    var vm=this;
    app.noType();
    let userInfo = wx.getStorageSync("userInfo");
    vm.setData({
      userId: userInfo.userId
    })
    detaInfo(vm, vm.data.classId)
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
//获取时段
function detaInfo(that,classId){
  wx.request({
    url: app.url +'/v1/class/getClassSectionList',
    method:'GET',
    data:{
      'classId': classId
    },
    header: { 'token': wx.getStorageSync('userInfo').token },
    success:function(res){
      console.log("请求时段成功")
      console.log(res)
      if(res.data.code=='10000'){
         //let 
        for(var i=0;i<res.data.response.length;i++){
          res.data.response[i].weekDay_ch = '周' + chinanum(res.data.response[i].weekDay);
          if (that.data.orderSectionList.indexOf(res.data.response[i].sectionId.toString())>-1){
            res.data.response[i].checked=true;
          }else{
            res.data.response[i].checked=false;
          }
        }
        that.setData({
          items:res.data.response
        })
      }
    },
    fail:function(info){
      wx.showToast({
        title: '获取时段失败',
        icon:'none'
      })
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

function checkSection(that, sectionId) {
 
  let tempSection = that.data.items;
  for (let i = 0; i < tempSection.length; i++) {
    if (tempSection[i].sectionId == sectionId) {
      if (tempSection[i].checked) {
        tempSection[i].checked = false;
        that.setData({
          items: tempSection
        });
        return;
      } else {
        tempSection[i].checked = true;
        that.setData({
          items: tempSection
        });
      }
      let data = {
        studentUserId: that.data.studentUserId,
        weekDay: tempSection[i].weekDay,
        dayTimeStart: tempSection[i].dayTimeStart,
        dayTimeEnd: tempSection[i].dayTimeEnd,
        orderCode: that.data.orderCode
      }
      wx.request({
        url: app.url + '/v1/order/getOrderClashForCoach',
        header: { 'token': wx.getStorageSync('userInfo').token },
        method: 'GET',
        data: data,
        success: function (res) {
          if (res.data.code == '10000') {
            if (res.data.response > 0) {
              wx.showToast({
                icon: 'none',
                title: '提示：当前时间段与学员的其他课程时间有冲突！',
                duration: 3000
              })
              tempSection[i].checked = false;
              that.setData({
                items: tempSection
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
      return;
    }
  }
}