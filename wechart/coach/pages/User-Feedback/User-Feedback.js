// pages/User-Feedback/User-Feedback.js
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classStatus: [{
      statusIndex: '1',
      name: '意见建议'
    }, {
      statusIndex: '2',
      name: '需求'
    }],
    statusIndex: 0,
    dataStatus: '1',
    isExperience: [{
      experienceIndex: '0',
      name: '否'
    }, {
      experienceIndex: '1',
      name: '是'
    }],
    experienceIndex: 0,
    dataExperience: '0',
    booleanr: false,
    telephone: false,
    opinion: [],
    showNotMore: false,
    title: "",
    content: "",
    phone: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  modalcnt: function () {
    wx.showModal({
      title: '提示',
      content: '是否需要回访：如果您希望平台方对您上述反馈的问题进行回复，可在下面留下电话或手机号，工作人员会在确定结果后联系到您。',
      showCancel: false,
      confirmText: '我知道了',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击我知道了')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 表单手机号

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    queryAdviseList(this);
  },
  userTitleInput: function (e) {
    console.log(e.detail.value);
    this.setData({
      title: e.detail.value
    })
  },
  //对输入的内容一个监听事件
  userContentInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      content: e.detail.value
    })
  },

  userPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },


  sunMit: function (that) {
    var that = this;
    if (that.data.title == "") {
      wx.showToast({
        title: '请输入反馈标题！',
        icon: 'none'
      })
      return false;
    }
    if (that.data.content == "") {
      wx.showToast({
        title: '请输入反馈内容！',
        icon: 'none'
      })
      return false;
    }
    //输入的回访电话做一个判断，如果正确执行后面的事件，如果错误，提示输入正确的参数
    var phoneNum = that.data.phone;
    if (that.data.telephone && phoneNum == "") {
      wx.showToast({
        title: '请输入回访的号码！',
        icon: 'none'
      })
      return false;
    }
    // var reg = /^1[345678][0-9]{9}$/;
    // if (!reg.test(phoneNum)) {
    //   wx.showToast({
    //     title: '请输入正确的号码！',
    //     icon: 'none'
    //   })
    //   return false;
    // }

    wx.request({
      //服务器API接口路径的调用
      url: app.url + '/v1/help/saveAdviseRequest',
      //发送一个原始 HTTP标头
      header: {
        'token': wx.getStorageSync('userInfo').token
      },
      //如何发送表单数据到action属性所指定的页面（OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT）
      method: 'POST',
      //向被选元素附加数据，或者从被选元素获取数据。
      data: {
        "content": that.data.content,
        "receiptCall": phoneNum,
        "returnReceipt": that.data.telephone ? "1" : "0",
        "title": that.data.title,
        "type": that.data.dataStatus,
        "userId": wx.getStorageSync('userInfo').userId,
        "userType": "2"
      },
      //事件访问成功与否
      success: function (res) {
        if (res.data.code == '10000') {
          wx.showToast({
            title: '操作成功！',
            icon: 'none',
          })
          console.log(that.data.title)
          console.log(that.data.content)
          that.setData({
            title: '',
            content: '',
            phone: '',
            experienceIndex: 0,
            telephone: false
          });
          queryAdviseList(that);
        }
      }
    })


  },
  userNameInput: function (mobile) {
    var regExp = /^[1][0-9]{10}$/;
    var that = this;
    var phoneNum = this.data.phone;
    if (regExp.test(phoneNum)) {
      sendCoded(that, phoneNum);
    } else {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none'
      })
    }
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

  // 反馈类型切换
  classStatusChange: function (e) {
    var vm = this;
    var bol = this.data.booleanr;
    console.log('classStatusChange,发送选择改变，携带值为', e.detail.value);
    let statusIndex = e.detail.value;
    let dataStatus = vm.data.classStatus[statusIndex].statusIndex;
    // console.log(dataStatus);
    vm.setData({
      statusIndex: statusIndex,
      dataStatus: dataStatus
    })
    this.setData({
      booleanr: !bol
    })
  },

  //是否需要回访选择
  experienceChange: function (e) {
    var vm = this;
    var bol = this.data.telephone;
    // console.log(e)
    console.log('experienceChange,发送选择改变，携带值为', e.detail.value)
    let experienceIndex = e.detail.value;
    let dataExperience = vm.data.isExperience[experienceIndex].experienceIndex;
    vm.setData({
      experienceIndex: experienceIndex,
      dataExperience: dataExperience
    })
    this.setData({
      telephone: experienceIndex == "1" ? true : false
    })
  },



})

// 获取该学员意见反馈

function queryAdviseList(that) {
  console.log(wx.getStorageSync('userInfo').userId);
  wx.request({
    url: app.url + '/v1/help/get/Advise',
    header: {
      'token': wx.getStorageSync('userInfo').token
    },
    method: 'GET',
    data: {
      'userId': wx.getStorageSync('userInfo').userId,
      'userType': '2'
    },
    success: function (res) {
      if (res.data.code == '10000') {
        that.setData({
          opinion: res.data.response
        })
        var opinionArr = that.data.opinion; //将接口数据存入opinionArr数组
        var newTime = '';
        var a = ''; //存取截取后的字段
        // 遍历接口数据
        for (var i = 0; i < opinionArr.length; i++) {
          var newTime = opinionArr[i].createTime; //获取接口数据中的createTime
          if (newTime) {
            var a = opinionArr[i].createTime.substr(0, 10); //截取字符串去掉时分秒
            opinionArr[i].newDate = a;
          }
        }
        //操作后的数据重新赋值给初始化data中的opinion
        that.setData({
          opinion: opinionArr
        })

      }
    }
  })
}