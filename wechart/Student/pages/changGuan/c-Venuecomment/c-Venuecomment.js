// pages/changGuan/c-Venuecomment/c-Venuecomment.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.imgUrl,
    reds:'',
    hei: '',
    green:'',
    redss: '',
    heis: '',
    greens: '',
    bad:'Gay',
    ok:'Gay',
    good:'Gay',
    bads: 'Gay',
    oks: 'Gay',
    goods: 'Gay',
    getList:{},
    shuRu:'',
    classId:'',
    homeId:'',
    comment:'',
    orderCode:''
  },
  cha:function(e){
    var val = e.currentTarget.dataset.val;
    if(val=='bad'){
      this.setData({
        reds:'red',
        hei:'',
        green:'',
        bad:'Red',
        ok:'Gay',
        good:'Gay',
        classId:'3'
      })
    } else if (val == 'ok'){
      this.setData({
        reds: '',
        hei: 'hei',
        green: '',
        bad: 'Gay',
        ok: 'Hei',
        good: 'Gay',
        classId:'2'
      })
    } else if (val == 'good'){
      this.setData({
        reds: '',
        hei: '',
        green: 'green',
        bad: 'Gay',
        ok: 'Gay',
        good: 'Green',
        classId:'1'
      })
    }
  },
  chas: function (e) {
    var val = e.currentTarget.dataset.val;
    if (val == 'bad') {
      this.setData({
        redss: 'red',
        heis: '',
        greens: '',
        bads: 'Red',
        oks: 'Gay',
        goods: 'Gay',
        homeId:'3'
      })
    } else if (val == 'ok'){
      this.setData({
        redss: '',
        heis: 'hei',
        greens: '',
        bads: 'Gay',
        oks: 'Hei',
        goods: 'Gay',
        homeId:'2'
      })
    } else if (val == 'good'){
      this.setData({
        redss: '',
        heis: '',
        greens: 'green',
        bads: 'Gay',
        oks: 'Gay',
        goods: 'Green',
        homeId:'1'
      })
    }
  },
  //获取输入的信息
  arear:function(e){
    var shuRu=e.detail.value;
    this.setData({
      shuRu:shuRu
    })

  },
  sunBtn:function(e){
    var that=this;
    //判断用户是否修改
    var thatComment = that.data.shuRu;
    var classGreade=that.data.getList.classGrade ; 
    var homeGrade=that.data.getList.homeGrade ;
    if (that.data.classId == '' || that.data.classId == null){
      wx.showToast({
        title: '请对课程进行整体评价！',
        icon: 'none'
      })
      return false;
    }
    if (that.data.homeId == '' || that.data.homeId==null) {
      wx.showToast({
        title: '请对场馆进行整体评价！',
        icon: 'none'
      })
      return false;
    }
    if (that.data.getList.classCommentId==null){
      wx.request({
        url: app.url + '/v1/order/applyOrderComment',
        header: { 'token': wx.getStorageSync('userInfo').token },
        method: 'GET',
        data: {
          'orderCode': that.data.orderCode,
          'classGrade': that.data.classId,
          'homeGrade': that.data.homeId,
          'comment': that.data.shuRu == null ? "" : that.data.shuRu
        },
        success: function (res) {
          if (res.data.code == '10000') {
            wx.setStorageSync('comment', 'commentStudent')
            wx.showToast({
              title: '评论成功',
              success(res) {
                wx.navigateBack({
                  delta: 1
                })
                return false;
              }
            })
          } else {
            wx.showToast({
              title: '后台开小差了',
              icon: 'none'
            })
          }
        },
        fail: function (info) {
          wx.setStorageSync('comment', 'commentStudent')
          wx.showToast({
            title: '提交失败',
            icon: 'none'
          })
        }
      })
    }else if (that.data.classId == classGreade && that.data.homeId == homeGrade && that.data.getList.comment == thatComment){//这是没有修改的
      wx.request({
        url: app.url + '/v1/order/applyOrderComment',
        header: { 'token': wx.getStorageSync('userInfo').token },
        method: 'GET',
        data: {
          'orderCode': that.data.getList.orderCode,
          'classGrade': classGreade,
          'homeGrade': homeGrade,
          'comment': thatComment
        },
        success: function (res) {
          if(res.data.code=='10000'){
            wx.setStorageSync('comment', 'commentStudent')
            wx.showToast({
              title: '评论成功',
              success(res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }else{
            wx.showToast({
              title: '后台开小差了',
              icon:'none'
            })
          } 
        },
        fail: function (info) {
          wx.setStorageSync('comment', 'commentStudent')
          wx.showToast({
            title: '提交失败',
            icon:'none'
          })
        }
      })
    }else{//这是修改了的
      wx.request({
        url: app.url + '/v1/order/applyOrderComment',
        header: { 'token': wx.getStorageSync('userInfo').token },
        method: 'GET',
        data: {
          'orderCode': that.data.getList.orderCode,
          'classCommentId': that.data.getList.classCommentId ,
          'homeCommentId': that.data.getList.homeCommentId ,
          'classGrade': that.data.classId,
          'homeGrade': that.data.homeId,
          'comment': that.data.shuRu
        },
        success: function (res) {
          wx.setStorageSync('comment', 'commentStudent')
          if(res.data.code=='10000'){
            wx.showToast({
              title: '评论成功',
              success() {
                wx.redirectTo({
                  url: '../../../pages/changGuan/c-VenueOrder/c-VenueOrder?sortOk=no',
                })
              }
            })
          }else{
            wx.showToast({
              title: '后台开小差了',
              icon: 'none'
            })
          }
        },
        fail: function (info) {
          wx.setStorageSync('comment', 'commentStudent')
         wx.showToast({
           title: '评论失败',
           icon:'none'
         })
        }
      })
    }
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({orderCode:options.orderCode})
    //that.setData({ orderCode: '1089814116711055873' })
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
    getList(this, this.data.orderCode);
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
//获取评价列表
function getList(that,orderCode){
  wx.request({
    url: app.url + '/v1/order/getOrderCommentForStudent',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method:'GET',
    data:{
      'orderCode': orderCode
    },
    success:function(res){
      if (res.data.code == '30005') {
        //跳转到首页  
        wx.navigateTo({
          url: "../../../pages/register/register"
        });
        return;
      }      
      var pus = res.data.response;
      if (JSON.stringify(pus) == "{}") { return false; }else{
        that.setData({
          getList: pus,
          classId: pus.classGrade,
          homeId: pus.homeGrade,
          shuRu: pus.comment
        })
        level(that, pus)
      } 
    },
    fail:function(info){
      console.log("info是失败的信息"+info)
    }
  })
}
//首次显示级别
function level(that, pus){
  if (pus.classGrade == '1') {
    that.setData({
      green: 'green',
      good: 'Green'
    })
  } else if (pus.classGrade == '2') {
    that.setData({
      hei: 'hei',
      ok: 'Hei'
    })
  } else if (pus.classGrade == '3') {
    that.setData({
      reds: 'red',
      bad: 'Red'
    })
  } else {
    console.log("没有评级信息")
  }
  if (pus.homeGrade  == '1') {
    that.setData({
      greens: 'green',
      goods: 'Green'
    })
  } else if (pus.homeGrade  == '2') {
    that.setData({
      heis: 'hei',
      oks: 'Hei'
    })
  } else if (pus.homeGrade  == '3') {
    that.setData({
      redss: 'red',
      bads: 'Red'
    })
  } else {
    console.log("没有评级信息")
  }
}
