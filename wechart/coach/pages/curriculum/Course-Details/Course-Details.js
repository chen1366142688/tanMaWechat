// pages/curriculum/Course-Details/Course-Details.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
const system = wx.getSystemInfoSync()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    classId: "",
    classDetail: {},
    sectionList: [],
    studentList: [],
    showSectionId: "",
    articleList: [],
    putawayStatus: "",  
    isCanEdit:false,
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0,
  },

  changePutAwayStatus: function (e) {
    let that = this;
    wx.request({
      url: app.url + '/v1/class/updateClassStatus',
      method: 'GET',
      header: { 'token': wx.getStorageSync('userInfo').token },
      data: {
        classId: that.data.classId,
        classStatus: that.data.putawayStatus == 1 ? "2" : "1"
      },
      success: function (res) {
        if (res.data.code == '10000') {
          wx.showToast({ title: '操作成功！', icon: "none" });
          that.setData({
            putawayStatus: that.data.putawayStatus == 1 ? "2" : "1"
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
          })
        }
      },
      fail: function (info) {
        console.log("请求后台失败")
      }
    })
  },

  classesOf: function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../Tution/Tution?classId=' + this.data.classId+'&id=2'
    })
  },

  toAuditClass:function(e){
    wx.navigateTo({
      url: '../Course-Composer/Course-Composer?classId=' + this.data.classId
    })
  },

  changeOption: function (e) {
    let that = this;
    var sectionId = e.currentTarget.dataset.sectionid;
    var attendStatus = e.currentTarget.dataset.attendstatus;
    attendStatus = attendStatus == 1 ? 0 : 1;
    wx.request({
      url: app.url + '/v1/class/updateClassSectionStatus',
      method: 'GET',
      header: { 'token': wx.getStorageSync('userInfo').token },
      data: {
        sectionId: sectionId,
        attendStatus: attendStatus
      },
      success: function (res) {
        if (res.data.code == '10000') {
          wx.showToast({ title: '操作成功！', icon: "none" });
          queryClassSection(that);
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
  },

  queryStudentList: function (e) {
    var sectionId = e.currentTarget.dataset.sectionid;
    let that = this;
    if (sectionId == that.data.showSectionId) {
      that.setData({
        studentList: [],
        showSectionId: ""
      });
      return false;
    }
    that.setData({
      studentList: [],
      showSectionId: sectionId
    })
    wx.request({
      url: app.url + '/v1/class/getClassSignUpUserList',
      method: 'GET',
      header: { 'token': wx.getStorageSync('userInfo').token },
      data: {
        classId: that.data.classId,
        classectionId: sectionId
      },
      success: function (res) {
        if (res.data.code == '10000') {
          that.setData({
            studentList: res.data.response
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      classId: options.classId
    })
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });  
  },
  imageLoad: function (e) {
    var _this = this;
    var $width = e.detail.width,    //获取图片真实宽度  
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例  
    var viewHeight = 210,           //设置图片显示宽度，  
      viewWidth = 210 * ratio;    //计算的高度值     
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
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
    let that = this;
    app.noType();
    queryClassDetail(that);
    queryClassSection(that);
    queryArticleList(that);
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
  editeAttend:function(e){
    wx.navigateTo({
      url: '../../index/redact/redact?attendId=',
    })
  }

})

function queryClassDetail(that) {
  wx.request({
    url: app.url + '/v1/class/getClassDetail',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      classId: that.data.classId
    },
    success: function (res) {
      if (res.data.code == '10000') {
        let classInfo = res.data.response;
        classInfo.itemStudentGrade = 'L' + classInfo.itemStudentGrade.replace(new RegExp(",", 'g'), " L");
        // classInfo.classPhotoAddress = classInfo.classPhotoAddress + '?x-oss-process=image/resize,m_mfit,w_' + system.windowWidth;
        countNumByUserIdAndOrgUserId(that, classInfo.userId)
        // if (classInfo.classType == '1' && wx.getStorageSync("coachBaseInfo").userId != classInfo.userId){
        //   that.setData({
        //     isCanEdit:false
        //   })
        // }
        //课程详情图片，将用户上传的图片删除封面图，其他图片在课程简介下方展示
        //循环数组删除首个
        // classInfo.classPhotoVOList.length > 1 ? classInfo.classPhotoVOList.splice(0, 1) : classInfo.classPhotoVOList;
        //遍历classPhotoVOList数组，将defaultPhoto为1的删掉
        let index = -1;
        for (let i = 0; i < classInfo.classPhotoVOList.length; i++) {
          classInfo.classPhotoVOList[i].photoAddress = classInfo.classPhotoVOList[i].photoAddress + '?x-oss-process=image/resize,m_mfit,w_' + system.windowWidth;
          if (classInfo.classPhotoVOList[i].defaultPhoto == '1') {
            index = i;
          }
        }
        if (index >= 0) {
          classInfo.classPhotoVOList.splice(index, 1);
        }


        that.setData({
          classDetail: classInfo,
          putawayStatus: classInfo.putawayStatus
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

function queryClassSection(that) {
  wx.request({
    url: app.url + '/v1/class/getClassSectionList',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      classId: that.data.classId
    },
    success: function (res) {
      if (res.data.code == '10000') {
        that.setData({
          sectionList: res.data.response
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

function queryArticleList(that) {
  wx.request({
    url: app.url + '/v1/class/getClassArticleInfo',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      classId: that.data.classId
    },
    success: function (res) {
      if (res.data.code == '10000') {
        that.setData({
          articleList: res.data.response
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
function countNumByUserIdAndOrgUserId(that, orgUserId) {
  if (orgUserId == wx.getStorageSync('userInfo').userId){
    that.setData({
      isCanEdit: true
    })
    return false;
  }

  wx.request({
    url: app.url + '/v1/coach/countNumByUserIdAndOrgUserId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      userId: wx.getStorageSync('userInfo').userId,
      orgUserId: orgUserId
    },
    success: function (res) {
      if (res.data.code == '10000') {
        if (res.data.response > 0) {
          that.setData({
            isCanEdit: true
          })
        }else{
          that.setData({
            isCanEdit: false
          })
        }
      } else if (res.data.code == '30005') {
        wx.navigateTo({
          url: '../../Introduction/Introduction',
        })
      } else {
        wx.showToast({
          title: '后台开小差了',
        })
      }
      wx.hideLoading();
    },
    fail: function (info) {
      console.log("请求后台失败")
    }
  })
}

