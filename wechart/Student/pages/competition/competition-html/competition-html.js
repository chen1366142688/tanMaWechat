const app = getApp().globalData;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    organizationId:0,
    token: "",
    userName: "",
    avatarUrl: "",
    userId: "",
    phoneNo: "",
    needRegister: 0,
    urlappxcx: app.tanmaCompetitionHtmlUrl, //全局的接口请求地址 url app的小程序
    openUrl:"",
    showsignup:"",
    cpuserid:"",
    competitionid:"",
    sigupType:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var organizationId = options.organizationId;
    var token = options.token;
    var userName = options.userName;
    var avatarUrl = options.avatarUrl;
    var userId = options.userId;
    var needRegister = options.needRegister;

    var showsignup = options.showsignup;
    var cpuserid = options.cpuserid;
    var competitionid = options.competitionid;
    var sigupType = options.sigupType;

    if (organizationId && organizationId != "" && organizationId != 0 && organizationId != 'undefined') {
      this.setData({
        organizationId: organizationId
      })
    }
    if (token && token != 'undefined' && needRegister && needRegister !='undefined'){
      this.setData({
        token: token,
        userName: userName,
        avatarUrl: avatarUrl,
        userId: userId,
        needRegister: needRegister,
      })
    }
    if (showsignup == '1'){
      this.setData({
        showsignup: showsignup,
        cpuserid: cpuserid,
        competitionid: competitionid,
        sigupType: sigupType,
      })
      if (sigupType == '1'){
        this.setData({
          openUrl: this.data.urlappxcx + '/view/activity/signup_group_result.html?id=' + this.data.competitionid + '&userId=' + this.data.cpuserid + '&organizationId=' + this.data.organizationId
        })
      }else{
        this.setData({
          openUrl: this.data.urlappxcx + '/view/activity/signup_person_result.html?id=' + this.data.competitionid + '&userId=' + this.data.cpuserid + '&organizationId=' + this.data.organizationId
        })
      }
    }else{
      this.setData({
        openUrl: this.data.urlappxcx + '/?orgId=' + this.data.organizationId + '&token=' + this.data.token + '&userName=' + encodeURI(this.data.userName) + '&avatarUrl=' + this.data.avatarUrl + '&userId=' + this.data.userId + '&needRegister=' + this.data.needRegister
      })
    }
    
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

  },
})
