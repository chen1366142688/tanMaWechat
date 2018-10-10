// pages/curriculum/Addition-coach/Addition-coach.js
// var util = require('../../utils/util.js');
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    cityName:'',
    coachName:'',
    coachList:[],

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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  var vm=this;
  app.noType();
  let cityName = wx.getStorageSync("location").result.address_component.city;
  vm.setData({
    cityName: cityName
  })
  getCoachList(vm)
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
  nickName:function(e){
    var vm=this;
    // console.log(e)
    let coachName=e.detail.value;
    vm.setData({
      coachName: coachName
    })
  },
  serach:function(){
    var vm=this;
    getCoachList(vm);
  },
  chooseCoach:function(e){
    var vm=this;
    // console.log(e)
    let userId=e.currentTarget.dataset.userid;
    let nickName = e.currentTarget.dataset.nickname;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    var classCoach={
      "userId": userId,
      "nickName": nickName
    }
      prevPage.setData({
        classCoach: classCoach,
        chooseCoach:true,
      })
      wx.navigateBack({ changed: true });//返回上一页 
  }
});
function getCoachList(vm){
  wx.request({
    url: app.url + '/v1/coach/getCoachListByCoachName',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      coachName: vm.data.coachName,
      cityName: vm.data.cityName
    },
    success: function (res) {
      // console.log(res)
      if (res.data.code == '10000') {
        // var data=res.data.response;
        let tempList = res.data.response;
        for (let i = 0; i < tempList.length; i++) {
          if (tempList[i].itemPhotoAddress != null) {
            tempList[i].itemPhotoAddress = tempList[i].itemPhotoAddress.split(',')[0];
          }
          if (tempList[i].itemName != null) {
            tempList[i].itemName = tempList[i].itemName.split(',')[0];
          }
          if (tempList[i].itemStudentGrade != null) {
            let tempGrade = tempList[i].itemStudentGrade.split(',');
            let retrunGrade = "";
            var json = {};
            for (var j = 0; j < tempGrade.length; j++) {
              if (!json[tempGrade[j]]) {
                retrunGrade = retrunGrade + '  L' + tempGrade[j]
                json[tempGrade[j]] = 1;
              }
            }
            tempList[i].itemStudentGrade = retrunGrade;
          }
        }
          vm.setData({
            coachList: tempList
          })
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
}