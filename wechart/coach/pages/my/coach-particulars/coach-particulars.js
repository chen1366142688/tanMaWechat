// pages/my/coach-particulars/coach-particulars.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:{},
    coach:{},
    coachUserList:[],
    Untie:true,
    permissionsList: [
      // { name: '00', value: '修改介绍', classId: '00', checked: true, group: '1' },
      // { name: '01', value: '查看订单', classId: '01',  group: '1' },
      // { name: '02', value: '查看所有学员', classId: '02', group: '1' },
      // { name: '03', value: '管理下属教练', classId: '03', group: '2' },
      // { name: '04', value: '查看课时安排', classId: '04', group: '1' },
      // { name: '05', value: '查看账户明细', classId: '05', group: '2' },
    ],
    selectStatus: [],
    stas: '',
    isSelect: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({options:options})
  },
  Untie(e){
    const that=this;
    wx.showModal({
      title: '提示',
      content: '确定解绑教练吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.url + '/v1/coach/cancelCoachBelongForMyCoach',
            header: { 'token': wx.getStorageSync('userInfo').token },
            method: 'GET',
            data: { coachUserId: that.data.options.coachId },
            success(res) {
              if (res.data.code == '10000') {
                wx.showToast({
                  title: '解绑成功',
                })
                wx.navigateBack({
                  delta:1
                })
              }else{
                wx.showToast({
                  title: res.data.msg,
                  icon:'none'
                })
              }
            },fail(info){
              wx.showToast({
                title: '网络异常，请稍后再试！',
                icon:'none'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  edit(e){
    let classId = e.currentTarget.dataset.classid;
    wx.navigateTo({
      url: '../../../pages/curriculum/Course-Composer/Course-Composer?classId=' + classId
    })
  },
  openHistory(e){
    console.log(e.currentTarget.dataset.classid)
    let classId = e.currentTarget.dataset.classid;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../../pages/curriculum/Tution/Tution?classId=' + classId+'&id=1'
    })
  },
  checkChange(e){//选择框改变
    let that=this;
    let permissionsCode = e.currentTarget.dataset.code;
    let checked = e.currentTarget.dataset.checked;
    var thisPermissions = that.data.permissionsList;
    for (let tmp of thisPermissions){
     if(permissionsCode == tmp.permissionsCode){
       if (checked){
         tmp.isHave='0';
         tmp.checked=false;
         deleteCoachPermissions(that, permissionsCode);//添加
        }else{
         tmp.isHave = '1';
         tmp.checked = true;
         addCoachPermissions(that, permissionsCode)//新增
        }
       break;
      }
   }
    that.setData({
     permissionsList: thisPermissions
   });
    console.log(checked);
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
    coachUser(this)
    coachUserList(this)
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
  
  }
})
function coachUser(that){
  wx.request({
    url: app.url+'/v1/coach/getCoachInfoForMyCoach',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: { coachUserId:that.data.options.coachId},
    success(res){
      if(res.data.code=='10000'){
        if (wx.getStorageSync('userInfo').userId == res.data.response.coachUserId){
          that.setData({ Untie:false})
        }else{
          getPermissionsByOrgAndCoach(that);//教练权限列表
        }
        that.setData({ coach:res.data.response})
      }else{
        wx.showToast({
          title: '网络异常，请稍后再试',
          icon:'none'
        })
      }
    },
    fail(info){
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon:'none'
      })
    }
  })
}
function coachUserList(that) {
  wx.showLoading({
    title: '加载中...',
  })
  wx.request({
    url: app.url + '/v1/coach/getClassListInfoForMyCoach',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: { coachUserId: that.data.options.coachId },
    success(res) {
      if (res.data.code == '10000') {
        for(let i=0;i<res.data.response.length;i++){
          res.data.response[i].itemStudentGrade = 'L' + res.data.response[i].itemStudentGrade.replace(new RegExp(",", 'g'), " L");
        }
        wx.hideLoading()
        that.setData({ coachUserList: res.data.response })
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常，请稍后再试',
          icon: 'none'
        })
      }
    },
    fail(info) {
      wx.hideLoading()
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon: 'none'
      })
    }
  })
}
//教练权限列表
function getPermissionsByOrgAndCoach(that) {
  wx.request({
    url: app.url + '/v1/coach/getPermissionsByOrgAndCoach',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: { coachUserId: that.data.options.coachId },
    success(res) {
      if (res.data.code == '10000') {
        let datalist = res.data.response;
        for (let tmp of datalist){
          tmp.checked = (tmp.isHave=='1');
        }
        that.setData({ permissionsList: datalist})
      } else {
        wx.showToast({
          title: '网络异常，请稍后再试',
          icon: 'none'
        })
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
//添加教练权限
function addCoachPermissions(that,code) {
  wx.request({
    url: app.url + '/v1/coach/addCoachPermissions',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: { coachUserId: that.data.options.coachId, permissionsCode: code },
    success(res) {
      if (res.data.code == '10000') {
         console.log("成功！");
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
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
//添加教练权限
function deleteCoachPermissions(that, code) {
  wx.request({
    url: app.url + '/v1/coach/deleteCoachPermissions',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: { coachUserId: that.data.options.coachId, permissionsCode: code},
    success(res) {
      if (res.data.code == '10000') {
        console.log("成功！");
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
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