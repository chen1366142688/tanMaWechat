 /**
   * 页面的初始数据
   */
const app = getApp().globalData
Page({
  data: {
    url: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/',
    info: [
      { name: '我的昵称', value: '李华' }
    ],
    nameInfo: [
      { name: '监护人姓名/身份证号', value: '李明（510*****0035）' },
      { name: '与学员关系', value: '父亲' },
      { name: '监护人住址', value: '四川省成都市高新区益州大道中段1800号移动互联大厦' },
      { name: '监护人手机', value: '136*****556' },
      { name: '监护人微信', value: '12588sdsdd' }
    ],
    setting: [         
      { name: '登录密码', value: '修改' },
      { name: '交易密码', value: '修改' }
    ],    
    items: [ 
      { name: 'USA', value: '成人', checked: false },
      { name: 'CHN', value: '青少年', checked: false }
    ],
    mans: [
      { name: 'man', value: '男', checked: false },
      { name: 'wuman', value: '女', checked: false }
    ],
    state: 'active',
    states: '',
    date: '2018-07-11',
    userInfo: '',
    studentAdultInfo: {},
    birthday: false,
    guardianPhoneNo: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      userInfo: options
    })
  },
  //提交所有信息
  allIn: function (e) {
    var that = this;
    var mans = that.data.mans;
    var gender;
    for (var i in mans) {
      if (mans[i].checked == true) {
        if (mans[i].value == '男') {
          gender = 1
        } else {
          gender = 2
        }
      }
    }
    var userId = that.data.userInfo.userId;
    //判断是成人还是青少年
    if (that.data.userInfo.studentType == '1') {
      console.log("这是成人的提交的信息")
      wx.request({
        url: app.url + '/v1/student/update/studentTypeByUserId',
        method: 'GET',
        header: { 'token': wx.getStorageSync('userInfo').token },
        data: {
          'userId': userId,
          'studentType': that.data.userInfo.studentType
        },
        success: function (res) {
          console.log("提交学员类型成功")
          console.log(res)
          if (res.data.code == '10000') {
            //提交个人性别
            wx.request({
              url: app.url + '/v1/student/update/studentGenderByUserId',
              method: 'GET',
              header: { 'token': wx.getStorageSync('userInfo').token },
              data: {
                'userId': userId,
                'gender': that.data.studentAdultInfo.gender ? that.data.studentAdultInfo.gender : '1'
              },
              success: function (re) {
                if (re.data.code == '10000') {
                  console.log("修改性别成功")
                  wx.request({
                    url: app.url + '/v1/student/update/studentBirthdayByUserId',
                    method: 'GET',
                    header: { 'token': wx.getStorageSync('userInfo').token },
                    data: {
                      'userId': userId,
                      'birthDay': that.data.studentAdultInfo.birthDayTime ? that.data.studentAdultInfo.birthDayTime : that.date
                    },
                    success: function (rev) {
                      if (rev.data.code == '10000') {
                        console.log("修改生日成功")
                      }
                    },
                    fail: function (ins) {
                      console.log("修改生日失败")
                    }
                  })
                }
              },
              fail: function (info) {
                console.log("修改性别失败了")
              }
            })
          }
        },
        fail: function (ingo) {
          console.log("修改失败")
        }

      })
    } else if (that.data.userInfo.studentType == '2') {
      console.log("这是提交的青少年的信息")
      wx.request({
        url: app.url + '/v1/student/update/studentTypeByUserId',
        method: 'GET',
        header: { 'token': wx.getStorageSync('userInfo').token },
        data: {
          'userId': userId,
          'studentType': that.data.userInfo.studentType
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == '10000') {
            //提交个人性别
            console.log("提交学员类型成功")
            wx.request({
              url: app.url + '/v1/student/update/studentGenderByUserId',
              method: 'GET',
              header: { 'token': wx.getStorageSync('userInfo').token },
              data: {
                'userId': userId,
                'gender': that.data.studentAdultInfo.gender ? that.data.studentAdultInfo.gender : '1'
              },
              success: function (re) {
                if (re.data.code == '10000') {
                  console.log("修改性别成功")
                  wx.request({
                    url: app.url + '/v1/student/update/studentBirthdayByUserId',
                    method: 'GET',
                    header: { 'token': wx.getStorageSync('userInfo').token },
                    data: {
                      'userId': userId,
                      'birthDay': that.data.studentAdultInfo.birthDayTime && that.data.studentAdultInfo.birthDayTime != 'undefined' ? that.data.studentAdultInfo.birthDayTime : that.date
                    },
                    success: function (rev) {
                      if (rev.data.code == '10000') {
                        console.log("修改生日成功")
                        wx.request({
                          url: app.url + '/v1/student/update/studentGuardianRelationByUserId',
                          method: 'GET',
                          header: { 'token': wx.getStorageSync('userInfo').token },
                          data: {
                            'userId': userId,
                            'relation': that.data.studentAdultInfo.userRelation ? that.data.studentAdultInfo.userRelation : '无'
                          },
                          success: function (resInfo) {
                            if (resInfo.data.code == '10000') {
                              console.log("修改监护人与学员关系成功")
                            }
                          },
                          fail: function (init) {
                            console.log("修改监护人与学员关系失败")
                          }
                        })
                      }
                    },
                    fail: function (ins) {
                      console.log("修改生日失败")
                    }
                  })
                }
              },
              fail: function (info) {
                console.log("修改性别失败了")
              }
            })
          }
        },
        fail: function (ingo) {
          console.log("修改失败")
        }
      })
    }
    wx.navigateBack({
      delta: 1
    })
  },
  //修改交易密码
  modifyTransactionPwd: function (e) {
    var pwd = e.currentTarget.dataset.pwd;
    wx.navigateTo({
      url: '../../../pages/my/alter-Password/alter-Password?pwd=' + pwd,
    })
  },
  //修改登录密码
  modifyLoginPwd: function (e) {
    var pwd = e.currentTarget.dataset.pwd;
    wx.navigateTo({
      url: '../../../pages/my/alter-Password/alter-Password?pwd=' + pwd,
    })
  },
  //修改监护人手机
  modifyPhone: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.name)
    var name = e.currentTarget.dataset.name;
    if (name == 'student') {
      wx.navigateTo({
        url: '../../../pages/my/alter-phone/alter-phone?name=student&from=myinfo&studentType=' + that.data.userInfo.studentType,
      })
    } else {
      wx.navigateTo({
        url: '../../../pages/my/alter-phone/alter-phone?name=0&from=myinfo&guardianPhoneNo=' + that.data.guardianPhoneNo + '&studentType=' + that.data.userInfo.studentType,
      })
    }
  },
  //修改监护人姓名、身份证号
  modifyIdnumber: function (e) {
    wx.navigateTo({
      url: '../../../pages/my/alter-Guardian/alter-Guardian',
    })
  },
  //修改监护人微信
  modifywechat: function (e) {
    var name = e.currentTarget.dataset.name;
    if (name == 'student') {
      wx.navigateTo({
        url: '../../../pages/my/alter-wechat/alter-wechat?name=student',
      })
    } else {
      wx.navigateTo({
        url: '../../../pages/my/alter-wechat/alter-wechat?name=0',
      })
    }

  },
  //修改地址
  modifyAddress: function (e) {
    console.log(e.currentTarget.dataset.diss)
    var diss = e.currentTarget.dataset.diss;
    wx.navigateTo({
      url: '../../../pages/my/alter-site/alter-site?diss=' + diss,
    })
  },
  //修改学校
  selectSchool: function (e) {
    var cityId = e.currentTarget.dataset.cityid;
    var userId = this.data.userInfo.userId;
    var studentType = this.data.userInfo.studentType;
    wx.navigateTo({
      url: '../../../pages/register/schoolSelect/schoolSelect?cityId=' + cityId + '&information=1' + '&name=&userId=' + userId + '&studentType=' + studentType,
      //url: '../../../pages/register/schoolSelect/schoolSelect?cityId=510100000000&information=1' + '&name=' + name + '&userId=' + userId + '&studentType=' + studentType,
    })
  },
  //修改昵称
  modifyName: function (e) {
    var name = e.currentTarget.dataset.name;
    var userId = this.data.userInfo.userId;
    var studentType = this.data.userInfo.studentType;
    wx.navigateTo({
      url: '../../../pages/my/alter-Name/alter-Name?name=' + name + '&userId=' + userId + '&studentType=' + studentType + '&mike=1',
    })
    // wx.setNavigationBarTitle({
    //   title: '修改昵称'
    // })
  },
  //修改真实姓名
  modifyUserName: function (e) {
    var name = e.currentTarget.dataset.name;
    var userId = this.data.userInfo.userId;
    var studentType = this.data.userInfo.studentType;
    wx.navigateTo({
      url: '../../../pages/my/alter-Name/alter-Name?name=' + name + '&userId=' + userId + '&studentType=' + studentType + '&mike=2',
    })
    // wx.setNavigationBarTitle({
    //   title: '修改姓名'
    // })
  },
  //修改自我介绍
  introSelf: function (e) {
    var self = e.currentTarget.dataset.self;
    var userId = this.data.userInfo.userId;
    var studentType = this.data.userInfo.studentType;
    wx.navigateTo({
      url: '../../../pages/my/alter-intro/alter-intro?self=' + self + '&userId=' + userId + '&studentType=' + studentType,
    })
  },
  //修改头像
  userImgHead: function (e) {
    var that = this;
    // wx.navigateTo({
    //   url: '../../../pages/wx-cropper/index',
    // })
    var userInfos = this.data.studentAdultInfo;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中..',
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        for (let i = 0; i < tempFilePaths.length; i++) {
          console.log(tempFilePaths[i])
          wx.uploadFile({
            url: app.url + '/v1/file/upload', //仅为示例，非真实的接口地址
            header: { 'token': wx.getStorageSync('userInfo').token },
            filePath: tempFilePaths[i],
            name: 'muFiles',
            formData: {
              'type': 'coach_img'
            },
            success: function (re) {
              console.log("上传返回的")
              var data = JSON.parse(re.data)
              if (data.code == '10000') {
                var photoAddress = data.response[0];
                userInfos.avatarUrl = photoAddress;
                that.setData({ studentAdultInfo: userInfos })
                wx.request({
                  url: app.url + '/v1/student/update/studentAvatarUrlByUserId',
                  header: { 'token': wx.getStorageSync('userInfo').token },
                  method: 'GET',
                  data: {
                    'userId': that.data.userInfo.userId,
                    'url': photoAddress
                  },
                  success: function (re) {
                    console.log("上传成功")
                    wx.hideLoading();
                  }
                })
              }else{
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: '图片大小超过5M,请重新上传'
                })
              }
            }
          })
        }
      }
    })
  },
  guanXi: function (e) {
    var info = this.data.studentAdultInfo;
    info.userRelation = e.detail.value;
    this.setData({ studentAdultInfo: info })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var that = this;
    var value = e.detail.value;
    var studentAdultInfo = that.data.studentAdultInfo;
    if (value == 'USA') {
      studentAdultInfo.studentType = 1;
      that.setData({
        studentAdultInfo: studentAdultInfo
      })
    } else if (value == 'CHN') {
      studentAdultInfo.studentType = 2;
      that.setData({
        studentAdultInfo: studentAdultInfo
      })
    }
    var items = that.data.items;
    for (var i = 0; i < items.length; i++) {
      if (value == items[i].name) {
        items[i].checked = true;
      } else {
        items[i].checked = false;
      }
    }
    that.setData({
      items: items
    })
  },
  radioChange2: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var that = this;
    var value = e.detail.value;
    var studentAdultInfo = that.data.studentAdultInfo;
    if (value == 'man') {
      studentAdultInfo.gender = 1;
      that.setData({
        studentAdultInfo: studentAdultInfo
      })
    } else if (value == 'wuman') {
      studentAdultInfo.gender = 2;
      that.setData({
        studentAdultInfo: studentAdultInfo
      })
    }
    var mans = that.data.mans;
    for (var i = 0; i < mans.length; i++) {
      if (value == mans[i].name) {
        mans[i].checked = true;
      } else {
        mans[i].checked = false;
      }
    }
    that.setData({
      mans: mans
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexs: e.detail.value
    })
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var birthdaty = this.data.studentAdultInfo;
    birthdaty.birthDayTime = e.detail.value
    this.setData({
      studentAdultInfo: birthdaty
    })
  },
  switchBtn: function (e) {
    console.log(e.currentTarget.dataset.val)
    var _this = this;
    var status = e.currentTarget.dataset.val;
    if (status == 'open') {
      _this.setData({
        state: 'active',
        states: ''
      })
    } else if (status == 'close') {
      _this.setData({
        state: '',
        states: 'active'
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
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if (res.networkType == 'none') {
          wx.reLaunch({
            url: '../../../pages/welcome/welcomeNo/welcomeNo',
          })
        }
      }
    })
    var options = this.data.userInfo;
    console.log(options)
    if (options.studentType == '1') {//查询成人的信息
      studentAdultInfo(this, options.userId)
    } else if (options.studentType == '2') {//查询未成年人信息
      studentTeenaInfo(this, options.userId)
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
})
//查询成年学生信息
function studentAdultInfo(that, userId) {
  wx.request({
    url: app.url + '/v1/student/get/studentAdultInfoByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      'userId': userId
    },
    success: function (res) {
      if (res.data.code == '10000') {
        console.log("下面成年学生的信息列表：")
        console.log(res.data)
        var mans = that.data.mans;
        var items = that.data.items;
        var nameInfo = that.data.nameInfo;
        res.data.response.gender == '1' ? mans[0].checked = true : mans[1].checked = true;
        res.data.response.studentType == '1' ? items[0].checked = true : items[1].checked = true;
        let guardianName = res.data.response.guardianName && res.data.response.guardianName != 'null' ? res.data.response.guardianName : '';
        let identityCode = res.data.response.identityCode && res.data.response.identityCode != 'null' ? res.data.response.identityCode : '';
        let nameAndCode = '';
        if (guardianName && identityCode) {
          nameAndCode = guardianName + '(' + identityCode + ')';
        }
        nameInfo[0].value = nameAndCode;
        nameInfo[2].value = res.data.response.guardianAddrDetail && res.data.response.guardianAddrDetail != 'null' ? res.data.response.guardianAddrDetail : ''
        nameInfo[3].value = res.data.response.guardianPhoneNo && res.data.response.guardianPhoneNo != 'null' ? res.data.response.guardianPhoneNo : '';
        nameInfo[4].value = res.data.response.guardianWX && res.data.response.guardianWX != 'null' ? res.data.response.guardianWX : ''
        that.setData({
          studentAdultInfo: res.data.response,
          mans: mans,
          items: items,
          nameInfo: nameInfo,
          guardianPhoneNo: res.data.response.guardianPhoneNo
        })
        if (!that.data.studentAdultInfo.birthDayTime){
          let studentAdultInfo = that.data.studentAdultInfo;
          studentAdultInfo.birthDayTime='2018-05-25'
          that.setData({
            studentAdultInfo: studentAdultInfo
          })
        }
      } else { console.log("后台错误") }
    },
    fail: function (info) {
      wx.showToast({
        title: '获取失败',
      })
    }
  })
}
//查询未成年学生信息
function studentTeenaInfo(that, userId) {
  wx.request({
    url: app.url + '/v1/student/get/studentTeenagersInfoByUserId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {
      'userId': wx.getStorageSync('userInfo').userId
    },
    success: function (res) {
      if (res.data.code == '10000') {
        console.log("下面成年学生的信息列表：")
        console.log(res.data)
        var mans = that.data.mans;
        var items = that.data.items;
        var nameInfo = that.data.nameInfo;
        res.data.response.gender == '1' ? mans[0].checked = true : mans[1].checked = true;
        res.data.response.studentType == '1' ? items[0].checked = true : items[1].checked = true;
        let guardianName = res.data.response.guardianName && res.data.response.guardianName != 'null' ? res.data.response.guardianName : '';
        let identityCode = res.data.response.identityCode && res.data.response.identityCode != 'null' ? res.data.response.identityCode : '';
        let nameAndCode = '';
        if (guardianName && identityCode) {
          nameAndCode = guardianName + '(' + identityCode + ')';
        }
        nameInfo[0].value = nameAndCode;
        nameInfo[2].value = res.data.response.guardianAddrDetail && res.data.response.guardianAddrDetail != 'null' ? res.data.response.guardianAddrDetail : ''
        nameInfo[3].value = res.data.response.guardianPhoneNo && res.data.response.guardianPhoneNo != 'null' ? res.data.response.guardianPhoneNo : ''
        nameInfo[4].value = res.data.response.guardianWX && res.data.response.guardianWX != 'null' ? res.data.response.guardianWX : ''
        that.setData({
          studentAdultInfo: res.data.response,
          mans: mans,
          items: items,
          nameInfo: nameInfo,
          guardianPhoneNo: res.data.response.guardianPhoneNo
        })
      }
    },
    fail: function (info) {
      wx.showToast({
        title: '获取失败',
      })
    }
  })
};
//修改学员关系
function updateRelation(vm) {
  wx.request({
    url: app.url + '',
    data: {

    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: function (res) {

    }
  })
}
