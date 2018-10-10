// pages/curriculum/Comment/Comment.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   * reds: '',
        hei: '',
        green: 'green',
        bad: 'Gay',
        ok: 'Gay',
        good: 'Green',
   */
  data: {
    imgUrl: app.imgUrl,
    reds: '',
    hei: '',
    green: 'green',
    redss: '',
    heis: '',
    greens: '',
    bad: 'Gay',
    ok: 'Gay',
    good: 'Green',
    bads: 'Gay',
    oks: 'Gay',
    goods: 'Gay',
    evaluateInfo: {},
    comment: '',
    orderCode: 4,
    evaluate: '1',
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    //selectData: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10'],//下拉列表的数据
    array: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'],
    objectArray: [
      {
        id: 1,
        name: 'L1'
      },
      {
        id: 2,
        name: 'L2'
      },
      {
        id: 3,
        name: 'L3'
      },
       {
        id: 4,
        name: 'L4'
      },
       {
         id: 5,
         name: 'L5'
       },
       {
         id: 6,
         name: 'L6'
       },
    ],
    index: 0,//选择的下拉列表下标
    itemGrade: 1,
    gradeId: '',
    isSuccess: false,
    isSubmit: false
  },
  // // 点击下拉显示框
  // selectTap() {
  //   this.setData({
  //     show: !this.data.show
  //   });
  // },
  // // 点击下拉列表
  // optionTap(e) {
  //   let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
  //   this.setData({
  //     index: Index,
  //     itemGrade: Index + 1,
  //     show: !this.data.show
  //   });
  // },
  cha: function (e) {
    var val = e.currentTarget.dataset.val;
    if (val == 'bad') {
      this.setData({
        reds: 'red',
        hei: '',
        green: '',
        bad: 'Red',
        ok: 'Gay',
        good: 'Gay',
        evaluate: '3'
      })
    } else if (val == 'ok') {
      this.setData({
        reds: '',
        hei: 'hei',
        green: '',
        bad: 'Gay',
        ok: 'Hei',
        good: 'Gay',
        evaluate: '2'
      })
    } else if (val == 'good') {
      this.setData({
        reds: '',
        hei: '',
        green: 'green',
        bad: 'Gay',
        ok: 'Gay',
        good: 'Green',
        evaluate: '1'
      })
    }
  },

  //修改教练类型
  bindCasPickerChange: function (e) {
    console.log(e.detail.value)
    let Index = e.detail.value;
    this.setData({
      index: Index,
      itemGrade: Number(Index) + 1
    })

  },
  //获取输入的信息
  arear: function (e) {
    var comment = e.detail.value;
    this.setData({
      comment: comment
    })

  },
  sunBtn: function (e) {
    var vm = this;
    let isSubmit = vm.data.isSubmit;
    let isSuccess = vm.data.isSuccess;
    if (isSubmit && isSuccess) {
      wx.showModal({
        title: '提示',
        content: '该评价已提交，无需重复提交',
        showCancel: false
      })
      return false;
    };
    if (isSubmit && !isSuccess) {
      wx.showModal({
        title: '提示',
        content: '您提交得太频繁了，休息一下吧',
        showCancel: false
      })
      return false;
    }
    vm.setData({
      isSubmit: true
    })
    //判断用户是否修改
    submit(vm);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var vm = this;
    let orderCode = options.orderCode;
   // let orderCode = '1086364868321276733'
    vm.setData({
      orderCode: orderCode
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
    var vm = this;
    app.noType();
    let userInfo = wx.getStorageSync("userInfo");
    vm.setData({
      userId: userInfo.userId,
      token: userInfo.token
    })
    getEvaluateInfo(vm)
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
//获取评价列表
function getEvaluateInfo(vm) {
  let orderCode = vm.data.orderCode;
  wx.request({
    url: app.url + '/v1/order/getOrderCoachComment',
    method: 'GET',
    data: {
      'orderCode': orderCode
    },
    header: {
      "token": vm.data.token
    },
    success: function (res) {
      // console.log("请求成功")
      console.log(res)
      var data = res.data.response;
      if (!data) { return false; } else {
        vm.setData({
          evaluateInfo: data,
          evaluate: data.evaluate,
          comment: data.comment,
          gradeId: data.gradeId,
          index: Number(data.itemGrade)-1,
          itemGrade: data.itemGrade
        })
        level(vm, data)
      }
    },
    fail: function (info) {
      console.log("info是失败的信息" + info)
    }
  })
};
//首次显示级别
function level(that, pus) {
  // console.log(pus.evaluate == '1')
  if (pus.evaluate == '1') {
    that.setData({
      green: 'green',
      good: 'Green'
    })
  } else if (pus.evaluate == '2') {
    that.setData({
      hei: 'hei',
      ok: 'Hei',
      green: 'Gay',
      good: 'Gay'
    })
  } else if (pus.evaluate == '3') {
    that.setData({
      reds: 'red',
      bad: 'Red',
      green: 'Gay',
      good: 'Gay'
    })
  } else {
    console.log("没有评级信息")
  }
};
function submit(vm) {
  wx.request({
    url: app.url + '/v1/order/applyOrderCoachComment',
    method: 'GET',
    header: {
      "token": vm.data.token
    },
    data: {
      'orderCode': vm.data.orderCode,
      'evaluate': vm.data.evaluate,
      'itemGrade': vm.data.itemGrade,
      'comment': vm.data.comment,
      'gradeId': vm.data.gradeId
    },
    success: function (res) {
      // console.log(res)
      let data = res.data;
      if (data.code == 10000) {
        wx.showModal({
          title: '提示',
          content: '提交成功',
          showCancel: false,
          success: function (res) {
            wx.navigateBack({ changed: true });//返回上一页  
          }
        });
        vm.setData({
          isSuccess: true
        });
        // wx.navigateBack({ changed: true });//返回上一页  
      } else {
        wx.showModal({
          title: '提示',
          content: '提交失败',
          showCancel: false
        });
        vm.setData({
          isSuccess: false,
          isSubmit: false
        })
      }

    },
    fail: function (info) {
      console.log("info是失败的信息" + info)
    }
  })
}
