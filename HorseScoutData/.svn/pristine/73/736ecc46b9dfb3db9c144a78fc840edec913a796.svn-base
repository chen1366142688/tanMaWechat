// pages/Exercise/Exercise-Program/Exercise-Program.js
const app = getApp().globalData;
Page({
  data: {
    imgUrl:app.url,
    scroll:true,
    childName:[ ],
    active:'Exercise-Program-choose-one',
    defaultPlan:[],
    childId:11,
  },
  onLoad: function (options) {
    const that = this;
    //是否登录
    if(wx.getStorageSync('userInfo')){
      childList(that)
    }else{
      defaultPlan(that)
    }
  },
  //添加新计划
  addCoach: function () {
    const that = this;
    if(wx.getStorageSync('userInfo')){
        //判断是否添加了孩子
      if (that.data.childName.length == 0){
        wx.navigateTo({
          url: '../../../pages/My/Child-Information/Child-Information',
        })
      }else{
        wx.navigateTo({
          url: '../../../pages/Exercise/Select-Planning/Select-Planning?childrenid=' + that.data.childId,
        })
      }
    }else{
      wx.navigateTo({
        url: '../../../pages/login/Register/Register',
      })
    }
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function (e) {},
  //切换child
  cilckChild(e) {
    const that = this;
    let childId = e.currentTarget.dataset.childid;
    let index = e.currentTarget.dataset.index;
    let childName = that.data.childName;
    for (let i = 0; i < childName.length; i++) {
      if (index == i) {
        childName[i].active = true;
      } else {
        childName[i].active = false;
      }
    }
    that.setData({ childName: childName, childId: childId, defaultPlan: [] })
    childPlan(that, childId)
  },
  //跳转到计划详情
  planDetail(e){
    let planId = e.currentTarget.dataset.planid;
    wx.navigateTo({
      url: "../../../pages/Exercise/Program-Particulars/Program-Particulars?planId=" + planId + '&&childrenId=' + this.data.childId,
    })
  },
})
//获取所有默认计划
function defaultPlan(that){
  wx.request({
    url: app.rQUrl + '/v1/exercisePlan/getAllDefaultPlan',
    method:'GET',
    success(res){
      if(res.data.code == '10000'){
        let results = res.data.response;
        that.setData({
          defaultPlan:results
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
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
}
//通过家长id获取孩子列表
function childList(that){
  wx.request({
    url: app.rQUrl + '/v1/exercisePlan/getChildrenListByUserId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token},
    data: { userId: wx.getStorageSync('userInfo').userId},
    success(res) {
      if (res.data.code == '10000') {
        let results = res.data.response;
        for(let i =0 ;i<results.length;i++){
          if(i == 0){
            results[i].active = true;
          }else{
            results[i].active = false;
          }
        }
        that.setData({
          childName: results
        })
        if(results.length == 0){
          defaultPlan(that)
        } else { 
          childPlan(that, results[0].childrenId)
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    fail(info) {
      wx.showToast({
        title: info.data.msg,
        icon: 'none'
      })
    }
  })
}
//根据孩子id获取孩子锻炼计划
function childPlan(that, childrenId){
  wx.request({
    url: app.rQUrl + '/v1/exercisePlan/getExercisePlanByChildrenId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
    data: { childrenId: childrenId },
    success(res) {
      if (res.data.code == '10000') {
        let results = res.data.response;
        that.setData({
          defaultPlan: results
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    fail(info) {
      wx.showToast({
        title: info.data.msg,
        icon: 'none'
      })
    }
  })
}