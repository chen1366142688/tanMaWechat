const regExp = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/;
const app = getApp().globalData;
let countShowMessage = 60;
const imgUrl = 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/computer/'
Page({
  data: {
    isLogin:false,
    modal:false,//登录、帮组好友
    mySort:false,//我的排名
    showSuccess:false,//帮助成功
    modalBox:false,//弹层
    diss:true,//发送验证码是否可点击
    imgUrl: imgUrl,
    phoneNum: '',
    code : '',
    ontxt:'帮助好友',
    btnTxt:'帮&nbsp;助&nbsp;好&nbsp;友',//按钮文字（登录）
    holderPhone: '请输入手机号',//手机号holder（请输入参与活动的手机号）
    holderCode:'请输入验证码',//验证码holder（请输入短信验证码）
    countShowMessage:60,
    peopleNum:5,
    peopleNumMore:false,
    difference:'500米',
    userName:'用户名称',
    width:0,
    activeNum:0,
    imgUrldefault: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/computer/defaultImg.png',
    userInfos:{},
    friendsBox:[],
    invitationUserId:null,
    orderList:[
      {
        "invitationUserCount": 0,
        "myInvitation": "string",
        "nickName": "string",
        "orderindex": 0,
        "phone": "string",
        "userId": 0
      }
    ],
    moreBoxH:400
  },
  goIndex(e){
    let result = wx.getStorageSync('userInfo');
    if (result && result.userType){
      var isOldUser = result.userType.substr(1, 1);
      if (isOldUser == 1) {
        getStudentBaseInfo(this)
      }
    }
    wx.switchTab({
      url: '../../pages/keChen/keChen-index/keChen-index',
    })
  },
  inputPhone(e){
    let value = e.detail.value;
    this.setData({ phoneNum: value })
  },
  inputCode(e){
    let value = e.detail.value;
    if(value.length>0){
      this.setData({ code: value })
    }
    // else{
    //   wx.showToast({
    //     title: '请输入验证码',
    //     icon:'none'
    //   })
    //   return;
    // }
  },
  sendCode(){
    const that = this;
    if (!regExp.test(that.data.phoneNum)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return;
    }
    sendCoded(that.data.phoneNum,that)
  },
  helpfriend(e){
    const that = this;
    if (!regExp.test(that.data.phoneNum)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return;
    }
    if (that.data.code.length < 6) {
      wx.showToast({
        title: '请输入6位数字验证码',
        icon: 'none'
      })
      return;
    }
    wx.request({
      url: app.url +'/v1/student/add/studentregioninfo',
      header: { 'token': wx.getStorageSync('userInfo').token },
      method: 'POST',
      data: {
        "avatarUrl": that.data.userInfos.avatarUrl,
        "code": that.data.code,
        "userId": wx.getStorageSync('userInfo').userId,
        "userName": that.data.userInfos.nickName,
        "userPhoneNo": that.data.phoneNum,
        "userType": "1",
        "invitationUserId": that.data.invitationUserId
      },
      success(res){
        if(res.data.code == '10000'){
          that.setData({ 
            modal: !that.data.modal,
            modalBox: !that.data.modalBox
          })
          if (that.data.invitationUserId && that.data.invitationUserId>0){
            that.setData({
              modalBox:true,
              showSuccess: true
            })
          }
          //参加比赛
          join(that)
          wx.setStorageSync('userInfo', res.data.response.wechartInitResponse);
          wx.setStorageSync('studentBaseInfo', res.data.response.studentVO);
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            duration:2000
          })
        }
      },
      fail(info){
        wx.showToast({
          title: info.data.msg,
          icon:'none'
        })
      }
    })
  },
  hidenShowSuccess(e){
    this.setData({
      modalBox: false,
      showSuccess: false
    })
  },
  bindGetUserInfo(e){
    const that = this;
    let text = e.currentTarget.dataset.text;
    let tempUserInfo = wx.getStorageSync('userInfo');
    if (tempUserInfo && tempUserInfo.userType.substr(1, 1) == 1 ){
      if (wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').token){
        join(that)
        that.setData({ isLogin: true, isLoginTxt:'邀请好友助力'})
      }
    } else {
      wx.getUserInfo({
        success: function (res) {
          let myUserInfo = JSON.parse(res.rawData)
          that.setData({ userInfos: myUserInfo })
        }
      })
      //去授权
      wx.getSetting({
        success: res => {
          let date = new Date();
          console.log(date.getTime);
          if (res.authSetting['scope.userLocation'] && res.authSetting['scope.userInfo']) {
            let encryptedData = e.detail.encryptedData;
            let iv = e.detail.iv;
            wx.login({
              success: res => {
                let date = new Date();
                console.log(date.getTime);
                console.log(res)
                login(res.code, '1', that, encryptedData, iv);
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '小程序需要你的授权才能使用',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.openSetting({});
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }
      }) 
    }
  },
  tapMySort(e){
    orderList(this);
  },
  takeUp(e){
    this.setData({
      mySort: !this.data.mySort,
      modalBox: !this.data.modalBox
    })
  },
  tapMoreBox(e){
    this.setData({
      modal: false,//登录、帮组好友
      mySort: false,//我的排名
      showSuccess: false,//帮助成功
      modalBox: false
    })
  },
  onLoad(options) {//判断是从哪里进入
    let tempUserInfo = wx.getStorageSync('userInfo');
    let isOldUser="0";
    if (tempUserInfo && tempUserInfo.userType){
      isOldUser = tempUserInfo.userType.substr(1, 1);
    }
    if (options.share == 'share' && isOldUser == "0"){
      this.setData({
        ontxt: '帮助好友',
        invitationUserId: options.invitationUserId
      })
    }else{//首页
      this.setData({
          ontxt:'参加比赛',
          btnTxt: '参&nbsp;加&nbsp;比&nbsp;赛',//按钮文字（登录）
      })
    }
  },
  onReady() { },
  onShow() {
    let that = this;
    let tempUserInfo = wx.getStorageSync('userInfo');
    let isOldUser = "0";
    if (tempUserInfo && tempUserInfo.userType) {
      isOldUser = tempUserInfo.userType.substr(1, 1);
      if (isOldUser==1){
        takePart(this)
      }
    }
    setTimeout(function () {
      let tempUserInfo = wx.getStorageSync('userInfo');
      let isOldUser = "0";
      if (tempUserInfo && tempUserInfo.userType) {
        isOldUser = tempUserInfo.userType.substr(1, 1);
        if (isOldUser == 1) {
          takePart(that)
        }
      }
    }, 1000);        
  },
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage(options) {
    var shareObj = {
      title: "要赢要持久，一人怎么够！",
      path: 'pages/computer/computer?share=share&invitationUserId=' + wx.getStorageSync('userInfo').userId,
      imgUrl: '',
      success: function (res) {
        console.log(res)
      },
      fail: function (res) { }
    };
    if (options.from == 'button') {
      shareObj.path = 'pages/computer/computer?share=share&invitationUserId=' + wx.getStorageSync('userInfo').userId;
    }
    return shareObj;
  }
})
//判断是否参加比赛
function takePart(that){
  let peopleNum = 5;
  let difference = '500米';
  let width = 0;
  wx.request({
    url: app.url+'/v1/activity/invitation/get/invitationInfoByUserId',
    method: 'GET',
    header: {
      'token': wx.getStorageSync('userInfo').token
    },
    data:{
      userId: wx.getStorageSync('userInfo').userId
    },
    success(res){
      console.log(res)
      if(res.data.code == '10000'){
        let result = res.data.response;
        if(result.joinStatus == '1'){//已参加
          that.setData({ 
            isLogin: true,
            isLoginTxt: '邀请好友助力',
            imgUrldefault: result.avatarUrl
          })
          if (result.invitationUserCount < 5) {
            peopleNum = 5 - result.invitationUserCount;
            difference = '500米';
            width = result.invitationUserCount * 20;
          } else if (result.invitationUserCount == 5) {
            peopleNum = 10 - result.invitationUserCount;
            difference = '1000米';
            width = result.invitationUserCount * 20;
          } else if (result.invitationUserCount > 5 && result.invitationUserCount < 10) {
            peopleNum = 10 - result.invitationUserCount;
            difference = '1000米';
            width = result.invitationUserCount * 20;
          } else if (result.invitationUserCount == 10) {
            peopleNum = 20 - result.invitationUserCount;
            difference = '2公里';
            width = result.invitationUserCount * 20;
          } else if (result.invitationUserCount > 10 && result.invitationUserCount < 20) {
            peopleNum = 20 - result.invitationUserCount;
            difference = '2公里';
            width = 250;
          } else if (result.invitationUserCount == 20) {
            peopleNum = 40 - result.invitationUserCount;
            difference = '4公里';
            width = 300;
          } else if (result.invitationUserCount > 20 && result.invitationUserCount < 40) {
            peopleNum = 40 - result.invitationUserCount;
            difference = '4公里';
            width = 350;
          } else if (result.invitationUserCount == 40) {
            peopleNum = 80 - result.invitationUserCount;
            difference = '8公里';
            width = 400;
          } else if (result.invitationUserCount >= 40 && result.invitationUserCount < 80) {
            peopleNum = 80 - result.invitationUserCount;
            difference = '8公里';
            width = 450;
          } else if (result.invitationUserCount == 80) {
            peopleNum = 80 - result.invitationUserCount;
            difference = '12公里';
            width = 500;
          } else if (result.invitationUserCount >= 80 && result.invitationUserCount < 120) {
            peopleNum = 120 - result.invitationUserCount;
            difference = '12公里';
            width = 550;
          } else if (result.invitationUserCount == 120) {
            //超过120改变文案
            peopleNum = result.invitationUserCount;
            width = 600;
          } else {
            //超过120改变文案
            peopleNum = result.invitationUserCount;
            width = 650;
          }
          if (result.invitationUserCount > 7) {
            result.invitationUserList = result.invitationUserList.slice(0, 6);
            that.setData({
              peopleNumMore: true,
            })
          } else {
            that.setData({
              peopleNumMore: false,
            })
          }
          that.setData({
            imgUrldefault: result.avatarUrl,
            userName: result.nickName,
            peopleNum: peopleNum,
            activeNum: result.invitationUserCount,
            difference: difference,
            width: width,
            friendsBox: result.invitationUserList
          })
          console.log(that.data.width)
        } else if (result.joinStatus == '0'){//未参加
          that.setData({ 
            isLoginTxt:'参加比赛',
            isLogin: false
          })
        }
      }
    },
    fail(info){
      wx.showToast({
        title: info.data.msg,
      })
    }
  })
}
//用户参加比赛
function join(that){
  let peopleNum = 5;
  let difference = '500米';
  let width = 0;
  wx.request({
    url: app.url + '/v1/activity/invitation/join/invitation',
    method: 'GET',
    header: {
      'token': wx.getStorageSync('userInfo').token
    },
    data: {
      userId: wx.getStorageSync('userInfo').userId
    },
    success(res) {
      if (res.data.code == '10000') {
        let result = res.data.response;
        that.setData({
          isLogin: true,
          isLoginTxt: '邀请好友助力',
          imgUrldefault: result.avatarUrl
        })
        if (result.invitationUserCount < 5){
          peopleNum = 5 - result.invitationUserCount;
          difference = '500米';
          width = result.invitationUserCount *20;
        } else if (result.invitationUserCount == 5 ) {
          peopleNum = 10 - result.invitationUserCount;
          difference = '1000米';
          width = result.invitationUserCount * 20;
        }else if (result.invitationUserCount > 5 && result.invitationUserCount <10){
          peopleNum = 10 - result.invitationUserCount;
          difference = '1000米';
          width = result.invitationUserCount * 20;
        } else if (result.invitationUserCount == 10) {
          peopleNum = 20 - result.invitationUserCount;
          difference = '2公里';
          width = result.invitationUserCount * 20;
        } else if (result.invitationUserCount > 10 && result.invitationUserCount < 20){
          peopleNum = 20 - result.invitationUserCount;
          difference = '2公里';
          width = 250;
        } else if (result.invitationUserCount == 20) {
          peopleNum = 40 - result.invitationUserCount;
          difference = '4公里';
          width = 300;
        } else if (result.invitationUserCount > 20 && result.invitationUserCount < 40) {
          peopleNum = 40 - result.invitationUserCount;
          difference = '4公里';
          width = 350;
        } else if (result.invitationUserCount == 40 ) {
          peopleNum = 80 - result.invitationUserCount;
          difference = '8公里';
          width = 400;
        }else if (result.invitationUserCount >= 40 && result.invitationUserCount < 80) {
          peopleNum = 80 - result.invitationUserCount;
          difference = '8公里';
          width = 450;
        } else if (result.invitationUserCount == 80) {
          peopleNum = 80 - result.invitationUserCount;
          difference = '12公里';
          width = 500;
        } else if (result.invitationUserCount >= 80 && result.invitationUserCount < 120) {
          peopleNum = 120 - result.invitationUserCount;
          difference = '12公里';
          width = 550;
        }else if (result.invitationUserCount == 120 ) {
          //超过120改变文案
          peopleNum = result.invitationUserCount;
          width = 600;
        }else{
          //超过120改变文案
          peopleNum = result.invitationUserCount;
          width = 650;
        }
        if (result.invitationUserCount > 7){
          result.invitationUserList = result.invitationUserList.slice(0, 6);
          that.setData({
            peopleNumMore:true,
          })
        }else{
          that.setData({
            peopleNumMore: false,
          })
        }
        that.setData({
          imgUrldefault: result.avatarUrl,
          userName: result.nickName,
          peopleNum: peopleNum,
          activeNum: result.invitationUserCount,
          difference: difference,
          width: width,
          friendsBox: result.invitationUserList
        })
      }
    },
    fail(info) {
      wx.showToast({
        title: info.data.msg,
      })
    }
  })
}
//发送验证码
function sendCoded(phone,that) {
 wx.request({
    url: app.url + '/v1/common/sendSMS',
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync('userInfo').token
    },
    data: JSON.stringify({
      'type': '1',
      'userId': wx.getStorageSync('userInfo').userId,
      'userPhoneNo': phone
    }),
    success(res) {
      if (res.data.code == 10000) {
        that.setData({ diss: !that.data.diss })
        showMessageTime(that);
        console.log("发送成功")
      } else {
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    },
    error(info) {
      wx.showToast({
        title: '发送失败',
        icon:'none'
      })
    }
  })
}
//倒计时
function showMessageTime(that) {
  countShowMessage = that.data.countShowMessage;
  if (countShowMessage == 0) {
    that.setData({ countShowMessage:60,diss:!that.data.diss})
    return false;
  } else {
    countShowMessage--;
    that.setData({ countShowMessage: countShowMessage})
  }
  setTimeout(function () {
    showMessageTime(that);
  }, 1000);
}
//登录
function login(code, appType, vm, encryptedData, iv) {
  // console.log(str)
  let date = new Date();
  console.log(date.getTime);
  wx.request({
    url: app.url + '/v1/login/wechart/init',
    data: {
      encryptedData: encryptedData,
      iv: iv,
      appType: appType,
      code: code
    },
    method: 'GET',
    ContentType: 'application/json;charset=UTF-8',
    success: (res) => {
      let date = new Date();
      console.log(date.getTime);
      console.log(res)
      if (res.data.code == '10000') {
        var result = res.data.response;
        wx.setStorageSync('userInfo', result);
        var isOldUser = result.userType.substr(1, 1);
        if (isOldUser ==1){
          //如果第二位数字等于1说明是学员用户，获取学员信息
          getStudentBaseInfo(vm)
        }else{
          vm.setData({
            modalBox: true,
            modal: true
          })
        }
      }
    },
    fail: (info) => {
      wx.showToast({
        title: '登录失败，请刷新重试',
        icon: none
      })
    }
  })
};
//获取学员信息
function getStudentBaseInfo(vm) {
  wx.request({
    url: app.url + '/v1/student/getStudentStorageInfoByUserId',
    data: {
      "userId": wx.getStorageSync("userInfo").userId
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      if (res.data.code == '10000') {
        var data = res.data.response;
        wx.setStorageSync('studentBaseInfo', data);
      }
    },
    fail: (info) => {
      wx.showToast({
        title: '获取您的信息失败，请刷新重试',
        icon: none
      })
    }
  })
};
//获取排名
function orderList(that){
  wx.request({
    url: app.url + '/v1/activity/invitation/get/invitationOrderList',
    data: {
      "userId": wx.getStorageSync("userInfo").userId
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      if (res.data.code == '10000') {
        let data = res.data.response;
        let len = data.length;
        if(data.length>0){
          that.setData({ orderList: data, mySort: true, modalBox:true})
        }
      }
    },
    fail: (info) => {
      wx.showToast({
        title: '获取您的信息失败，请刷新重试',
        icon: none
      })
    }
  })
}