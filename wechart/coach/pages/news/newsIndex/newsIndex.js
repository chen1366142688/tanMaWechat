// pages/news/newsIndex/newsIndex.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    avatarUrl:"",
    coachNickName:"",
    showUserList:[],
    showPage: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').userType && wx.getStorageSync('userInfo').userType.substr(2, 1) == '1') {
      } else {
        wx.navigateTo({
          url: '../../../pages/Register/Register'
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
    app.noType();
    app.chatListPageObject = this;
    this.setData({
      showPage: true,
      showUserList: wx.getStorageSync('IM_SHOW_USER_LIST')
    })
    app.getTotlCount();
    let that = this;
    queryCoachInfo(that);
    wx.setStorageSync('IM_LOGIN_COUNT', 0)
    queryList(that);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      showPage: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      showPage: false
    })
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
  toChat:function(e){
    let userimname = e.currentTarget.dataset.userimname;
    let nickname = e.currentTarget.dataset.nickname;
    let avatarurl = e.currentTarget.dataset.avatarurl;
    let imNames = userimname.split("IM");
    wx.navigateTo({
      url: '../../../pages/news/chitchat/chitchat?userimname=' + userimname + '&type=' + imNames[0] + '&avatarurl=' + avatarurl + '&nickname=' + nickname + '&myavatarurl=' + this.data.avatarUrl,
    })
  }, 
  showNewMessage: function (imUserName, content, tempTime){
    if (this.data.showPage) {
      queryList(this);
    }
  }
})

function queryList(that){
  //判断是否登录成功
    if (app.jim.isLogin()){
        //获取回话列表
        app.jim.getConversation().onSuccess(function (data) {
          if (data.message =='success'){
             let userList = [];
             if (userList){
               //教练ID列表
               let coachIds = "";
               //学员ID列表
               let studentIds = "";
               for (let i = 0; i < data.conversations.length;i++){
                 let userIms = data.conversations[i].username.split("IM");
                 if (userIms[0] == 'student'){
                   studentIds = studentIds == "" ? userIms[1] : studentIds + ","+userIms[1];
                 }else{
                   coachIds = coachIds == "" ? userIms[1] : coachIds + "," + userIms[1];
                 }
               }
               //查询教练和学员信息
               wx.request({
                 url: app.url + '/v1/userBaseInfo/query/queryChatUserList',
                 header: { 'token': wx.getStorageSync('userInfo').token },
                 method: 'post',
                 data: {
                   studentIds: studentIds,
                   coachIds: coachIds
                 },
                 success: function (res) {
                   if (res.data.code == 10000) {
                     let allCount = 0;
                     userList = new Array(data.conversations.length)
                     for (let j = 0; j < data.conversations.length;j++){
                       let tempUser = {};
                       let userIms = data.conversations[j].username.split("IM");
                       tempUser.imUserName = data.conversations[j].username;
                       tempUser.unreadCount = data.conversations[j].unread_msg_count;
                       //获取学员 头像 昵称等信息
                       if (userIms[0] == 'student') {
                         for (let k = 0; k < res.data.response.studentList.length;k++){
                           if (userIms[1] == res.data.response.studentList[k].userId){
                             tempUser.avatarUrl = res.data.response.studentList[k].avatarUrl;
                             tempUser.nickName = res.data.response.studentList[k].nickName;
                             tempUser.userId = res.data.response.studentList[k].userId;
                             tempUser.coachType = res.data.response.studentList[k].coachType;
                             tempUser.userType='student';
                           }
                         }
                       } else {
                         //获取教练 头像 昵称等信息
                         for (let k = 0; k < res.data.response.coachList.length;k++){
                           if (userIms[1] == res.data.response.coachList[k].userId) {
                             tempUser.avatarUrl = res.data.response.coachList[k].avatarUrl;
                             tempUser.nickName = res.data.response.coachList[k].nickName;
                             tempUser.userId = res.data.response.coachList[k].userId;
                             tempUser.coachType = res.data.response.coachList[k].coachType;
                             tempUser.userType = 'coach';
                           }
                         }
                       }
                       let userKey = 'IM_DATE_' + data.conversations[j].username;//用户聊天日历   IM_studentIM9
                       let showDates = wx.getStorageSync(userKey);
                       //获取最新消息内容
                       if (showDates != null && showDates.length>0){
                         let dateKey = 'IM_' + showDates[showDates.length - 1] + "_" + data.conversations[j].username;
                         let messageListNew = wx.getStorageSync(dateKey);
                         if (messageListNew != null && messageListNew.length>0){
                           tempUser.contemt = messageListNew[messageListNew.length - 1].imContent;
                           tempUser.time = messageListNew[messageListNew.length - 1].time;
                         }
                       }
                       if (wx.getStorageSync('IM_COUNT_' + tempUser.imUserName) && wx.getStorageSync('IM_COUNT_' + tempUser.imUserName) != "" && wx.getStorageSync('IM_COUNT_' + tempUser.imUserName) > 0 ){
                         tempUser.unreadCount = wx.getStorageSync('IM_COUNT_' + tempUser.imUserName);
                       }
                       allCount = allCount +tempUser.unreadCount;
                       userList[userList.length-1-j] = tempUser;
                     }
                     wx.setStorageSync('IM_COUNT', allCount);
                     that.setData({
                       showUserList: userList
                     })
                     wx.setStorageSync('IM_SHOW_USER_LIST', userList);
                   }
                 },
                 fail: function () {
                 }
               })
             }
          }
      }).onFail(function (data) {
      });
  }else{
      wx.setStorageSync('IM_LOGIN_COUNT', wx.getStorageSync('IM_LOGIN_COUNT') + 1);
      if (wx.getStorageSync('IM_LOGIN_COUNT') > 10) {
        return false;
      }
      app.loginIm();
      setTimeout(function () {
         queryList(that);
      }, 500);
  }
}

function queryCoachInfo(that){
  wx.request({
    url: app.url + '/v1/coach/get/coachSimpleInfoByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'get',
    data: {
      userId: wx.getStorageSync('userInfo').userId
    },
    success: function (res) {
      if (res.data.code == 10000){
          that.setData({
            avatarUrl: res.data.response.avatarUrl,
            coachNickName: res.data.response.nickName
          })
      } else if (res.data.code == 30005){
          wx.redirectTo({
            url: "../../../pages/Introduction/Introduction"
          });
      }
    },
    fail: function () {

    }
  })
}
  
