// pages/my/Accretion-coach/Accretion-coach.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coachList: [],
    pageNumber: 1,
    theNumber: 10,
    value: '', 
    width:0,
    height: 0,
    options: {},
    ismore: false,//是否允许下次加载
    more: false,//是否允许下次加载
    padding: 0,
    showModal:false,
    phoneNo:'',
    showCode:false,
    thisTime: 60,
    coachUserId:'',
    code:'',
    Period:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var res = wx.getSystemInfoSync()
    this.setData({width:res.windowWidth,height:res.windowHeight})
    searchCoach(this)
  },
  searchInput(e){
    this.setData({value:e.detail.value})
  },
  search(e){
    searchCoach(this)
  },
  coachInformation(e){
    let phoneNo = e.currentTarget.dataset.phone;
    let coachUserId = e.currentTarget.dataset.coachuserid;
    
    this.setData({ 
      phoneNo: phoneNo,
      showModal:true,
      coachUserId: coachUserId
      })
  },
  closeModal(e){
    this.setData({showModal:false})
  },
  sendCode(e) {
    const that = this;
    let phoneNo = that.data.phoneNo;
    var isPhoneNo = isPoneAvailable(phoneNo);
    if (isPhoneNo) {
      sendSMS(that);
    } else {
      wx.showModal({
        title: '提示',
        content: '手机号码不正确',
        showCancel: false
      })
      return false;
    }
  },
  inputCode(e){
    let value = e.detail.value;
    this.setData({code:value})
  },
  submitCode(e){
    console.log("coachUserId:"+this.data.coachUserId)
    console.log("code:"+this.data.code)
    const that = this;
    let coachUserId = this.data.coachUserId;
    let code = this.data.code;
    if(code.length == 6){
      wx.request({
        url: app.url+'/v1/coach/confirmCoachBelongForMyCoach',
        header: {'token': wx.getStorageSync('userInfo').token},
        method: 'GET',
        data: {
          "coachUserId": coachUserId,
          "code": code
        },
        success(res){
          if(res.data.code == '10000'){
            that.setData({ showModal: false });
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              success: function (res) {
                wx.navigateBack({//返回上一页
                  delta: 1
                });
              }
            });            
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail(info){
          wx.showToast({
            title: info.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }else{
      wx.showToast({
        title: '请填写正确的验证码',
        icon:'none'
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

  }
})

//搜索学员列表
function searchCoach(that) {
  wx.request({
    url: app.url + '/v1/coach/getCoachFilterForMyCoach',
    header: {
      'token': wx.getStorageSync('userInfo').token
    },
    method: 'GET',
    data: {
      "filterName":that.data.value
    },
    success(res) {
      if (res.data.code == '10000') {
        let result=res.data.response;
        if(result.length>0){
          that.setData({ coachList: result, Period: false})
        }else{
          that.setData({ coachList: result, Period:true})
        }  
      }
    },
    fail(info) {
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon: 'none'
      })
    }
  })
}
function isPoneAvailable(str) {
  var myreg = /^[1][0-9]{10}$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
}
function sendSMS(vm) {
  wx.request({
    url: app.url + '/v1/coach/sendSMSForMyCoach',
    header: {
      'token': wx.getStorageSync('userInfo').token
    },
    data: {
      "coachUserId": vm.data.coachUserId
    },
    method: 'GET',
    success: (res) => {
      if (res.data.code == '10000') {
        vm.setData({
          showCode: true
        });
        changeThisTime(vm);

        wx.showToast({
          title: res.data.msg
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