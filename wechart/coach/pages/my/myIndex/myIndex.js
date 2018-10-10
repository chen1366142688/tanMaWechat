const app = getApp().globalData
Page({
  data: {
    imgUrl: app.imgUrl,
    defaultHead: app.imgUrl + 'coachNewImg/default-photo.png',
    coteGry: [
      { name: '篮球', value: 'L1' },
      { name: '羽毛球', value: 'L2' }
    ],
    cost: [
      { name: '我的介绍', value: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/coach/public/staff-introduction.png.png', type: 1 },
      { name: '课程订单', value: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/coach/public/from.png', type: 2 },
      { name: '我的学员', value: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/coach/public/studentManagement.png', type: 7 },
      { name: '下属教练', value:  'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/coach/public/timeMange.png', type: 8 },
      { name: '课时管理', value: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/coach/public/myOrder.png', type: 9 },
      { name: '账户明细', value: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/coach/public/detail.png', type: 3 },
      { name: '系统通知', value: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/coach/public/inform.png', type: 4 },
      { name: '系统设置', value: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/coach/public/Setting.png', type: 5 },
      { name: '意见建议及需求', value: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/coach/public/opinion.png', type: 6 },
      { name: '我的消息', value: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/coach/public/assist.png', type: 10 }
      // { name: '新手帮助', value: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/coach/public/assist.png', type: 10 }
    ],
    userBaseInfo: '',
    userId:"",
    userType:"",
    userGradeList: [],
    coachAccount: '',
    total:0,
    coachPermissionsList:[]
  },
  onLoad(options) {
    let that = this
    let app = getApp()
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  onReady() {

  },
  onShow() {
    var vm = this;
    app.noType();
    vm.setData({
      userId: wx.getStorageSync('userInfo').userId,
      userType: wx.getStorageSync('coachBaseInfo').userType
    })
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    //teacherInformation(this, wx.getStorageSync('userInfo').userId)
    var vm = this;
    getCoachBaseInfo(vm);
    getCoachGradeInfo(vm);
    if (vm.data.userType=='1'){
      getCoachBelongOrg(vm);//教练获取所属机构权限信息
    }else{
      getCoachAccount(vm);//机构获取余额信息
    }
    newTotal(vm)
  },
  onHide() {

  },
  onUnload() {

  },
  onPullDownRefresh() {

  },
  onReachBottom() {

  },
  onShareAppMessage() {

  },
  //点击联系客服咨询
  telephone: function (e) {
    wx.makePhoneCall({
      phoneNumber: '400-666-1816' //仅为示例，并非真实的电话号码
    })
  },
  //跳转到个人信息页面
  editProfile (e) {
    let userId=wx.getStorageSync('userInfo').userId;
    wx.navigateTo({
      url: '../../../pages/my/personal-details/personal-details?userId='+userId,
    })
  },
  //跳转到账户明细  accountDetailsbind 点击剩余课时的
  accountDetailsbind(e) {
    if (this.data.userType=='1'){//为教练则不跳转
       return;
     }
     let userId = wx.getStorageSync('userInfo').userId;
    wx.navigateTo({
      url: '../../../pages/my/Account-Details/Account-Details?userId=' + userId,
    })
  }, 
  goMyInfomation(){
    wx.navigateTo({
      url: '../../../../../../../pages/my/Edit-Profile/Edit-Profile'
    })
  }, 
  onselectitem(e) {
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: '../../../../../../../pages/my/Edit-Profile/Edit-Profile'
      })
    } else if (type == 2) {
      wx.navigateTo({
        url: '../../../../../../../pages/curriculum/Curriculum-Order/Curriculum-Order'
      })
    } else if (type == 3) {
      wx.navigateTo({
        url: '../../../../../../../pages/my/Account-Details/Account-Details'
      })
    } else if (type == 4) {
      wx.navigateTo({
        url: '../../../../../../../pages/my/systematicnotification/systematicnotification'
      })
    } else if (type == 5) {
      wx.navigateTo({
        url: '../../../../../../../pages/my/set/set'
      })
    } else if (type == 6) {
      wx.navigateTo({
        url: '../../../../../../../pages/User-Feedback/User-Feedback'
      })
    } else if (type == 7) {
      wx.navigateTo({
        url: '../../../../../../../pages/my/student/student'
      })
    } else if (type == 8) {
      wx.navigateTo({
        url: '../../../../../../../pages/my/Subordinate-coach/Subordinate-coach'
      })
    } else if (type == 9) {
      wx.navigateTo({
        url: '../../../../../../../pages/my/coach-period/coach-period'
      })
    } else if (type == 10) {
      wx.navigateTo({
        url: '../../../../../../../pages/news/newsIndex/newsIndex'
      })
    }
  },
  //机构权限跳转页面
  bindCoachPermissions(e){
    var thisType = e.currentTarget.dataset.type;
    var orgUserId = e.currentTarget.dataset.orguserid;
    var orgName = e.currentTarget.dataset.orgname;
    let param = '?orgUserId=' + orgUserId + '&orgName='+orgName;
    if (thisType == '01') {//
      wx.navigateTo({
        url: '../../../../../../../pages/my/Edit-Profile-Coach/Edit-Profile-Coach' + param
      })
    } else if (thisType == '02') {
      // wx.navigateTo({
      //   url: '../../../../../../../pages/curriculum/Curriculum-Order/Curriculum-Order'
      // })
    } else if (thisType == '03') {
      // wx.navigateTo({
      //   url: '../../../../../../../pages/my/Account-Details/Account-Details'
      // })
    } else if (thisType == '04') {
      // wx.navigateTo({
      //   url: '../../../../../../../pages/my/systematicnotification/systematicnotification'
      // })
    } else if (thisType == '05') {
      // wx.navigateTo({
      //   url: '../../../../../../../pages/my/set/set'
      // })
    } else if (thisType == '06') {
      wx.navigateTo({
        url: '../../../../../../../pages/my/Account-Details-Coach/Account-Details-Coach' + param
      })
    }

  }



})
function getCoachBaseInfo(vm){
  wx.request({
    url: app.url + '/v1/coach/get/coachBaseInfoByUserId',
    data: { 
      "userId": vm.data.userId
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      if (res.data.code == '10000') {
        var data = res.data.response;
        vm.setData({
          userBaseInfo: data
        })
        let cost = vm.data.cost;
        let len = cost.length;
        if (data.coachType == 3){
          console.log("机构全显示")
        }else{
          console.log("不是机构选其中几个显示")
          while (len--) {
            if (cost[len].type == 7 || cost[len].type == 8 || cost[len].type == 9 ) {
              cost.splice(len, 1)
            }
          }
          vm.setData({ cost: cost })
        }
        
      }
      if (res.data.code == '30005') {
        wx.navigateTo({
          url: '../../Introduction/Introduction',
        })
      }
    },
    fail: (info) => {
      console.log("请求失败了");
    }
  })
};
function getCoachGradeInfo(vm){
  wx.request({
    url: app.url + '/v1/coach/get/coachCertificateSingleInfoByUserId',
    data: {
      "userId": vm.data.userId
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      console.log(res)
      if (res.data.code == '10000') {
        var data = res.data.response;
        vm.setData({
          userGradeList: data
        }) 
      }
      if (res.data.code == '30005') {
        wx.navigateTo({
          url: '../../Introduction/Introduction',
        })
      }
    },
    fail: (info) => {
      console.log("请求失败了");
    }
  })
};
function getCoachAccount(vm){
  wx.request({
    url: app.url + '/v1/account/queryCoachAccount',
    data: {
      "userId": vm.data.userId
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      if (res.data.code == '10000') {
        var data = res.data.response;
        vm.setData({
          coachAccount: (data.amount/100).toFixed(2)
        })
      }
      if (res.data.code == '30005') {
        wx.navigateTo({
          url: '../../Introduction/Introduction',
        })
      }
    },
    fail: (info) => {
      console.log("请求失败了");
    }
  })
}
function newTotal(that){
  wx.request({
    url: app.url+'/v1/student/get/studentNotReadNoticeByUserId',
    data: {
      "userId": that.data.userId,
      "userType":"1"
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success(res){
      if (res.data.code == 10000){
        that.setData({total:res.data.response})
      }
    },
    fail(info){
      console.log(info)
    }
  })
}
//获取教练所属机构权限列表
function getCoachBelongOrg(that){
  wx.request({
    url: app.url + '/v1/coach/getCoachBelongOrg',
    data: {},
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success(res) {
      if (res.data.code == 10000) {
        that.setData({coachPermissionsList: res.data.response})
      }
    },
    fail(info) {
      console.log(info)
    }
  })
}