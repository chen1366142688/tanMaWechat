// pages/curriculum/Teaching-Assistant/Teaching-Assistant.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    provinceName: '',
    cityName: '',
    countyName: '',
    nickName: '',
    coachList: [],
    itemId: 1,
    coach: {
      tutorId: '',
      userId: '',
      avatarUrl: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var vm=this;
    seachCoach(vm);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var vm = this;
    app.noType();
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面

    let location = wx.getStorageSync("location");
    // console.log(location)
    let provinceName = location.result.address_component.province;
    let cityName = location.result.address_component.city;
    let countyName = location.result.address_component.district;

    // let itemId = prevPage.data.dataItem;   
    vm.setData({
      // itemId: itemId ? vm.data.itemId:'',
      provinceName: provinceName ? provinceName : '',
      cityName: cityName ? cityName : '',
      countyName: countyName ? countyName : '',
    });
   
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

  },
  nickName: function (e) {
    var vm = this;
    // console.log(e);
    let nickName = e.detail.value;
    vm.setData({
      nickName: nickName
    })
  },
  searCoach: function (e) {
    var vm = this;
    seachCoach(vm);
  },
  chooseCoach: function (e) {
    var vm = this;
    // console.log(e);
    console.log(1)
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    let list = prevPage.data.tutorList;
    let coach = e.currentTarget.dataset.index;
    if (list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].userId == coach.userId) {
          wx.showModal({
            title: '提示',
            content: '该助教已添加',
            showCancel: false
          });
           return;
        }
      }
      var tutor = { tutorId: coach.coachId, userId: coach.userId, avatarUrl: coach.avatarUrl };
      vm.setData({
        coach: tutor
      })
      list.push(tutor);
      prevPage.setData({
        tutorList: list,
        hotRed: true
      })
      wx.navigateBack({ changed: true });//返回上一页 
      // wx.redirectTo({
      //   url: '../../../pages/curriculum/Course-Composer/Course-Composer?changed=true',
      // }) 
    } else {
      var tutor = { tutorId: coach.coachId, userId: coach.userId, avatarUrl: coach.avatarUrl };
      vm.setData({
        coach: tutor
      })
      list.push(tutor);
      prevPage.setData({
        tutorList: list,
        hotRed: true
      })
      wx.navigateBack({ changed: true });//返回上一页 
      // wx.redirectTo({
      //   url: '../../../pages/curriculum/Course-Composer/Course-Composer?changed=true',
      // }) 
    }

  }
});
function seachCoach(vm) {
  wx.request({
    url: app.url + '/v1/coach/get/assistantSimpleInfo',
    data: {
      "cityName": vm.data.cityName,
      "itemId": vm.data.itemId,
      "nickName": vm.data.nickName,
      "provinceName": vm.data.provinceName
    },
    method: 'POST',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      console.log(res)
      if (res.data.code == '10000') {
        // console.log(res.data.response);
        var data = res.data.response;
        // console.log(data);
        vm.setData({
          coachList: data
        })

      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
}