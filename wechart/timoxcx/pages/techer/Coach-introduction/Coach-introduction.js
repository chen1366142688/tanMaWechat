// pages/techer/Coach-introduction /Coach-introduction.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/',
    guanKe: false,
    guanJie: true,
    van: 'van-ac',
    vans: '',
    userId:"",
    classList:[],
    pageSize:5,
    pageNo:1,
    commentList:[],
    coachDetail:{},
    showFooter:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: options.userId
    });
  },
  kecheng: function (e) {
    var val = e.currentTarget.dataset.val;
    console.log(val)
    var that = this;
    if (val == 1) {
      that.setData({
        van: 'van-ac',
        vans: '',
        guanKe: false,
        guanJie: true,
      })
    } else if (val == 2) {
      that.setData({
        van: '',
        vans: 'van-ac',
        guanKe: true,
        guanJie: false,
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
      this.setData({
        pageNo: 1
      });
      let that = this;
      queryClassList(that);
      queryComment(that);
      queryCoachDetail(that);
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

  toUserDetailPage: function (e) {
    wx.navigateTo({
      url: '../../changGuan/c-VenueStudent/c-VenueStudent?userId=' + e.currentTarget.dataset.user
    })
  },
  showMoreComment:function(e){
      let that = this;
      this.setData({
        pageNo: that.data.pageNo+1
      });
      queryComment(that);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options, ev) {
    console.log(options)
    var oEvent = ev || event;
    oEvent.cancelBubble = true;
    oEvent.stopPropagation();
    var that = this;
    var shareObj = {
      title: '教练介绍',
      path: "pages/techer/Coach-introduction /Coach-introduction",
      imgUrl: '',
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {

        }
      },
      fail: function (res) {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
    };
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      var eData = options.target.dataset;
      console.log(eData.name);     // shareBtn
      // 此处可以修改 shareObj 中的内容
      shareObj.path = '/pages/techer/Coach-introduction /Coach-introduction?btn_name=' + eData.name;
    }
    return shareObj;
  }
})

function queryComment(that){
  wx.request({
    url: 'http://192.168.3.4:8081/v1/coach/get/coachEvaluate',
    method: 'POST',
    data: {
      "userId": that.data.userId,
      "pageNo": that.data.pageNo,
      "pageSize":that.data.pageSize
    },
    success: function (res) {
      if (res.data.code == "10000") {
        let tempList = res.data.response.result;
        if (tempList.length > 0) {
          let oldList = that.data.commentList;
          oldList = oldList.concat(tempList);
          let tempShowFooter = false;
          if (oldList.length == res.data.response.total) {
            tempShowFooter = true;
          }
          that.setData({
            commentList: oldList,
            showFooter: tempShowFooter
          })
        }
      }
    },
    fail: function (info) {
      console.log("请求失败返回信息是：" + info)
    }
  })
}

function queryCoachDetail(that) {
  wx.request({
    url: 'http://192.168.3.4:8081/v1/coach/get/queryCoachDetail',
    method: 'GET',
    data: {
      "userId": that.data.userId
    },
    success: function (res) {
      if (res.data.code == "10000") {
        that.setData({
          coachDetail: res.data.response
        })
      }
    },
    fail: function (info) {
      console.log("请求失败返回信息是：" + info)
    }
  })
}

function queryClassList(that) {
  wx.request({
    url: 'http://192.168.3.4:8081/v1/coach/get/coachClassesSimpleInfoByUserId',
    method: 'get',
    data: {
      "userId": that.data.userId
    },
    success: function (res) {
      if (res.data.code == "10000") {
        let tempList = res.data.response;
        for(let i=0;i<tempList.length;i++){
          tempList[i].itemStudentGrade = 'L' + tempList[i].itemStudentGrade.replace(new RegExp(",",'g'),"L");
        }
        that.setData({
          classList: tempList
        })
      }
    },
    fail: function (info) {
      console.log("请求失败返回信息是：" + info)
    }
  })
}