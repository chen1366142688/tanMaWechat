// pages/news/chitchat/chitchat.js
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top: 0,
    height: 0,
    imType: "",
    imUserName: "",
    sendContent: "",
    showList: [],
    showDay: "",
    showCount: 0,
    toView: "#",
    showContent: "",
    userAvatarUrl: "",
    myAvatarUrl: "",
    ind:'',
    showPage: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imType: options.type,
      userAvatarUrl: options.avatarurl,
      myAvatarUrl: wx.getStorageSync('coachBaseInfo').avatarUrl,
      imUserName: options.userimname
    })
    //设置头部名称
    wx.setNavigationBarTitle({
      title: (options.type == 'student' ? "学员" : "教练") + "-" + options.nickname
    })

    var top = this.data.top;
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          height: res.windowHeight - 50
        })
      },
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
    app.chatPageObject = this;
    this.setData({
      showPage: true
    })
    showImMessage(this, this.data.imUserName, false);
    //总未读消息数量减少
    wx.setStorageSync('IM_COUNT', wx.getStorageSync('IM_COUNT') - wx.getStorageSync('IM_COUNT_' + this.data.imUserName));
    //清空未读消息数量
    wx.setStorageSync('IM_COUNT_' + this.data.imUserName, 0);
    wx.setStorageSync('IM_LOGIN_COUNT',0);
    //重置会话 未读消息数量
    if(app.jim.isLogin()){
      app.jim.resetUnreadCount({
        'username': this.data.imUserName
      });
    }else{
      app.loginIm();
    }
    setInd(this);
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
    wx.setStorageSync('IM_COUNT_' + this.data.imUserName, 0);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  chitchattoupper: function () {
    let tempShowList = [];
    let userKey = 'IM_DATE_' + this.data.imUserName;
    let tempShowDate = this.data.showDay;
    let tempDays = wx.getStorageSync(userKey);
    if (tempDays && tempDays.length > 1) {
      for (let i = 0; i < tempDays.length; i++) {
        if (tempShowDate == tempDays[i] && i > 0) {
          tempShowDate = tempDays[i - 1];
        }
      }
    }
    console.log(tempShowDate);
    if (tempShowDate != this.data.showDay) {
      tempShowList = new Array(tempDays.length);
      this.setData({
        showDay: tempShowDate
      })
      for (let i = tempDays.length - 1; i >= 0; i--) {
        if (this.data.showDay <= tempDays[i]) {
          let dateKey = 'IM_' + tempDays[i] + "_" + this.data.imUserName;//聊天记录key  格式  IM_20180502_studentIM9
          let tempDayInfo = {
            day: tempDays[i],
            messageList: wx.getStorageSync(dateKey)
          }
          tempShowList[i] = tempDayInfo;
        }
      }
      console.log(tempShowList);
      this.setData({
        showList: tempShowList
      })
    }
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

  senMessage: function (e) {
    if (this.data.sendContent != null && this.data.sendContent.length > 0) {
      wx.setStorageSync('IM_LOGIN_COUNT',0)
      sendMessageIm(this, this.data.sendContent, this.data.imUserName)
    }
  },
  inputMessage: function (e) {
    this.setData({
      sendContent: e.detail.value
    })
  },
  showImMessageList: function (e) {
    if (this.data.showPage) {
      showImMessage(this, this.data.imUserName, false);
      setInd(this);
    }
  }
})

function setInd(that) {
  var len = that.data.showList;
  if (len.length <= 0) {
    return false;
  }
  let ins = len[len.length - 1].day + ((len[len.length - 1].messageList.length) - 1);
  that.setData({
    ind: ins
  })
}

//展示聊天内容数据
function showImMessage(that, imUserName, isShowHis) {
  let tempShowList = that.data.showList;
  let userKey = 'IM_DATE_' + imUserName;//用户聊天日历   IM_studentIM9
  let showDates = wx.getStorageSync(userKey);
  let tempDay = "";
  let tempList = [];
  if (!isShowHis && (tempShowList == null || tempShowList.length < showDates.length)) {
    tempShowList = new Array(showDates.length);
    tempDay = showDates[showDates.length - 1];
    let dateKey = 'IM_' + tempDay + "_" + imUserName;//聊天记录key  格式  IM_20180502_studentIM9
    let tempDayInfo = {
      day: tempDay,
      messageList: wx.getStorageSync(dateKey)
    }
    tempShowList[showDates.length - 1] = tempDayInfo;
  } else {
    if (isShowHis) {
      for (let i = showDates.length - 1; i >= 0; i--) {
        if (that.data.showDay > showDates[i]) {
          that.setData({
            showDay: showDates[i]
          })
          let dateKey = 'IM_' + showDates[i] + "_" + imUserName;//聊天记录key  格式  IM_20180502_studentIM9
          let tempDayInfo = {
            day: showDates[i],
            messageList: wx.getStorageSync(dateKey)
          }
          tempShowList[i] = tempDayInfo;
          break;
        }
      }
    } else {
      tempDay = showDates[showDates.length - 1];
      for (let j = 0; j < tempShowList.length; j++) {
        if (tempShowList[j] && tempShowList[j].day == tempDay) {
          let dateKey = 'IM_' + tempDay + "_" + imUserName;//聊天记录key  格式  IM_20180502_studentIM9
          tempShowList[j].messageList = wx.getStorageSync(dateKey);
        }
      }
    }
  }
  if (that.data.showDay == "" || that.data.showDay == 'undefined') {
    that.setData({
      showDay: tempDay
    })
  }
  that.setData({
    showList: tempShowList
  })
  let tempShowCount = 0
  for (let i = 0; i < that.data.showList.length; i++) {
    if (that.data.showList[i]) {
      tempShowCount = tempShowCount + that.data.showList[i].messageList.length;
    }
  }
  that.setData({
    showCount: tempShowCount
  })
  if (tempShowCount < 10 && that.data.showDay > showDates[0]) {
    showImMessage(that, that.data.imUserName, true);
  }
}
//发送聊天消息
function sendMessageIm(that, content, imUserName) {
  //判断是否登录成功
  console.log("app.jim.isLogin()");
  console.log(app.jim.isLogin());
  if (app.jim.isLogin()) {
    let messageInfo = {
      target_username: imUserName,
      content: content,
      appkey: wx.getStorageSync('auth').appkey,
      extras: ''
    }
    //发送消息
    app.jim.sendSingleMsg(messageInfo).onSuccess(function (data, msg) {
      that.setData({
        sendContent: "",
        showContent: ""
      })
      addChatNotice(that);
      let date = new Date();
      let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
      let messageDate = date.getFullYear() + "-" + month + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
      let tempTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
      //本地消息存储
      nativeSaveMessage(imUserName, content, messageDate, that, tempTime);
    }).onFail(function (data) {
    });
  } else {
    wx.setStorageSync('IM_LOGIN_COUNT', wx.getStorageSync('IM_LOGIN_COUNT') + 1);
    if (wx.getStorageSync('IM_LOGIN_COUNT') > 10) {
      wx.showToast({
        title: '网络连接失败，请稍后重试。',
        icon:"none"
      })
      return false;
    }
    app.loginIm();
    setTimeout(function () {
      sendMessageIm(that, content, imUserName);
    }, 500);
  }
}
//本地消息存储
function nativeSaveMessage(imUserName, imContent, messageDate, that, tempTime) {
  let dateKey = 'IM_' + messageDate + "_" + imUserName;//聊天记录key  格式  IM_20180502_studentIM9
  let userKey = 'IM_DATE_' + imUserName;//用户聊天日历   IM_studentIM9
  if (!wx.getStorageSync('IM_NATICE_SAVE_SYNC')) {
    wx.setStorageSync('IM_NATICE_SAVE_SYNC', true)
    let newsList = wx.getStorageSync(dateKey);
    let userDateList = wx.getStorageSync(userKey);
    var newarray = [{ imUserName: imUserName, imContent: imContent, imtype: 'my', time: tempTime }];
    if (newsList) {
      newsList = newsList.concat(newarray);
    } else {
      newsList = newarray;
    }
    let tempDate = [messageDate];
    if (userDateList) {
      if (userDateList[userDateList.length - 1] < messageDate) {
        userDateList = userDateList.concat(tempDate)
      }
    } else {
      userDateList = [messageDate];
    }
    wx.setStorageSync(dateKey, newsList);
    wx.setStorageSync(userKey, userDateList);
    wx.setStorageSync('IM_NATICE_SAVE_SYNC', false)
    that.showImMessageList();
  } else {
    setTimeout(function () {
      nativeSaveMessage(imUserName, imContent, messageDate, tempTime)
    }, 100);
  }
};
function addChatNotice(vm){
  let studentUserId = vm.data.imUserName.substr(9, 2);
  console.log(studentUserId);
  wx.request({
    url: app.url + '/v1/notice/addChatNotice',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'get',
    data: {
      "studentUserId": studentUserId ,
      "coachUserId": wx.getStorageSync('userInfo').userId,
      "chatType":"1"
    },
    success: function (res) {
      
    },
    fail: function () {

    }
  })
}