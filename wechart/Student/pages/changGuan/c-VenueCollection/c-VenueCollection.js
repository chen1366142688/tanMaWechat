// pages/changGuan/c-VenueCollection/c-VenueCollection.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.imgUrl,
    collection: [],
    pageNum: 1,
    theNumber: 10,
    showNotMore: false,
    Period:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //判断元素否被选中
  checkboxChange: function (e) {
    var that = this;
    let ecections = this.data.collection
    var v = ecections.length;
    let len = e.detail.value.length;
    let id = e.currentTarget.dataset.id;
    if (len > 0) {
      while (v--) {
        if (ecections[v].storeId == id) {
          ecections[v].remindType = 1;
          that.setData({
            collection: ecections
          })
        }
      }
      modify(id, 1)
    } else {
      while (v--) {
        if (ecections[v].storeId == id) {
          ecections[v].remindType = 0;
          that.setData({
            collection: ecections
          })
        }
      }
      modify(id, 0)
    }
  },
  //删除收藏
  deleteStore: function (e) {
    var that = this;
    var storeid = e.currentTarget.dataset.storeid;
    var classid = e.currentTarget.dataset.classid;
    var ecetion = this.data.collection;
    var x = ecetion.length;
    wx.showModal({
      title: '提示',
      content: '确定删除收藏吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.url + '/v1/studentStore/deleteStoreByStoreId',
            header: { 'token': wx.getStorageSync('userInfo').token },
            method: 'GET',
            data: {
              'storeId': storeid
            },
            success: (res) => {
              if (res.data.code == '30005') {
                //跳转到首页  
                wx.navigateTo({
                  url: "../../../pages/register/register"
                });
                return;
              }
              if (res.data.code == '10000') {
                app.classIdList.push({ "classId": classid, "status": 0 })
                that.setData({
                  pageNum: 1,
                  theNumber: 10,
                  collection: [],
                  showNotMore: false
                })
                store(that, that.data.pageNum, that.data.theNumber);
                wx.showToast({
                  title: '删除成功',
                })
              }
            },fail(){
              wx.showToast({
                title: '删除失败，请重试',
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
  //跳转课程详情
  courseDetailsValid: function (e) {
    var classId = e.currentTarget.dataset.classid; 
    let userId = wx.getStorageSync('userInfo').userId;
    let status = e.currentTarget.dataset.status;
    if(status == '1'){
      wx.navigateTo({
        url: '../../../pages/keChen/coursedetails/coursedetails?classId=' + classId + '&userId=' + userId,
      })
    }else{
      wx.showToast({
        title: '当前课程已失效',
        icon: 'none',
        duration: 2000
      })
    }
    
  },
  //改变收藏状态
  modifyStatus: function (e) { },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShow: function () {
    var that = this;
    app.noType();
    that.setData({
      pageNum: 1,
      theNumber: 10,
      collection: [],
      showNotMore: false,
      Period: 0
    })
    store(that, that.data.pageNum, that.data.theNumber);
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
    if (this.data.showNotMore) {
      return false;
    }
    this.setData({
      pageNum: this.data.pageNum + 1,
    })
    store(this, this.data.pageNum, this.data.theNumber);
  },

})
//获取学员收藏列表信息
function store(that, pageNum, theNumber) {
  wx.request({
    url: app.url + '/v1/studentStore/getStudentStoreList',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      'userId': wx.getStorageSync('userInfo').userId,
      'pageNumber': pageNum,
      'theNumber': theNumber
    },
    success: (res) => {
      if (res.data.code == '30005') {
        //跳转到首页  
        wx.navigateTo({
          url: "../../../pages/register/register"
        });
        return;
      }
      if (res.data.code == '10000') {
        var result = res.data.response;
        for (var i = 0; i < result.length; i++) {
          result[i].itemStudentGrade = 'L' + result[i].itemStudentGrade.replace(new RegExp(",", 'g'), "L");
        }
        if (result.length == 0 && pageNum==1){
          that.setData({ Period: 1,showNotMore: false,})
          return false;
        }
        if (result.length < that.data.theNumber) {
          that.setData({  
            showNotMore: true,
            Period: 0
          })
        }
        let oldList = that.data.collection;
        oldList = oldList.concat(result);
        that.setData({
          collection: oldList,
          Period: 0
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    },
    fail: (info) => {
      wx.showToast({
        title: '获取收藏信息失败，请刷新重试',
        icon: 'none'
      })
    }
  })
}
function modify(storeId, remindType) {
  wx.request({
    url: app.url + '/v1/studentStore/updateStoreRemindType',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      'storeId': storeId,
      'remindType': remindType
    },
    success: function (res) {
      if (res.data.code == '30005') {
        //跳转到首页  
        wx.navigateTo({
          url: "../../../pages/register/register"
        });
        return;
      }
    },
    fail: function (info) {
      console.log(info)
    }
  })
}
