// pages/my/Withdraw-Deposit/Withdraw-Deposit.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    totleAmount:0,//总余额
    showAmount:0,
    amont:0,//提现金额
    userId:"1",
    transactionPwd:"",
    hisList:[],//提现记录列表
    pageNumber: 1,
    theNumber: 10,
    showNotMore:false,//是否显示 已经到底了
    nickName:"",//机构昵称
    orgUserId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
         nickName : options.orgName,
        orgUserId : options.orgUserId
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
    this.setData({
      showNotMore: false,
      pageNumber:1,
      hisList:[]
    })
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userId: userInfo.userId
    })
    //查询账户余额
    queryCoachAccount(this);
    //查询历史提现记录
    queryAccountExpenditureForCoach(this);
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
    if (!this.data.showNotMore){
      this.setData({
        pageNumber: this.data.pageNumber+1
      });
      queryAccountExpenditureForCoach(this);
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  //全部提现
  selectAll:function(e){
    this.setData({
      amont: Number(this.data.totleAmount)*100,
      showAmount: this.data.totleAmount
    })
  },
  //输入密码
  bindKeyInputPwd:function(e){
    console.log(e.detail.value)
    this.setData({
      transactionPwd: e.detail.value
    })
  },
   //输入提现金额
  bindKeyInputAmount: function (e) {
    console.log(e.detail.value * 100)
    this.setData({
      amont: e.detail.value*100,
      showAmount: e.detail.value*1
    })
  },
  //申请提现
  toApply:function(e){
    if (this.data.amont <= 0){
      wx.showToast({
        title: '请输入提现金额！',
        icon: "none"
      })
      return false;
    } 
    else if (this.data.totleAmount * 100 < this.data.amont){
      wx.showToast({
        title: '余额不足！',
        icon: "none"
      })
      return false;
    }
     else if (this.data.transactionPwd == "" || this.data.transactionPwd.length < 5) {
      wx.showToast({
        title: '请输入完整交易密码！',
        icon: "none"
      })
      return false;
    }else{
      coachExpenditureApply(this)
    }
  }
})
//查询账户余额
function queryCoachAccount(that) {
  wx.request({
    url: app.url + '/v1/account/queryCoachAccountForCoach',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      orgUserId: that.data.orgUserId
    },
    success: function (res) {
      if (res.data.code == '10000') {
         that.setData({
           totleAmount: (res.data.response.amount/100).toFixed(2)
         })
      } else {
        wx.showToast({
          title: res.data.msg,
        })
      }
    },
    fail: function (info) {
      console.log("请求后台失败")
    }
  })
}
//申请提现
function coachExpenditureApply(that) {
  wx.request({
    url: app.url + '/v1/account/coachExpenditureApplyForCoach',
    method: 'POST',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      amont: that.data.amont,
      coachUserId: that.data.orgUserId,
      transactionPwd: that.data.transactionPwd
    },
    success: function (res) {
      if (res.data.code == '10000') {
        wx.showToast({
          title: '操作成功！'
        })
        that.setData({
          showNotMore: false,
          pageNumber: 1,
          hisList:[],
          showAmount:0,
          transactionPwd:''
        })
        //数据清空

        queryCoachAccount(that);
        queryAccountExpenditureForCoach(that);
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    },
    fail: function (info) {
      console.log("请求后台失败")
    }
  })
}

function queryAccountExpenditureForCoach(that) {
  wx.request({
    url: app.url + '/v1/account/queryAccountExpenditureForOrgCoach',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      orgUserId: that.data.orgUserId,
      pageNumber: that.data.pageNumber,
      theNumber: that.data.theNumber
    },
    success: function (res) {
      if (res.data.code == '10000') {
        let tempList = res.data.response;
        for (let i = 0; i < tempList.length;i++){
          tempList[i].aoumt = (tempList[i].aoumt/100).toFixed(2);
        }
        if (tempList.length < that.data.theNumber){
          that.setData({
            showNotMore:true
          })
        }
        let oldList = that.data.hisList;
        oldList = oldList.concat(tempList);
        that.setData({
          hisList: oldList
        })
      } else {
        wx.showToast({
          title: res.data.msg,
        })
      }
    },
    fail: function (info) {
      console.log("请求后台失败")
    }
  })
}