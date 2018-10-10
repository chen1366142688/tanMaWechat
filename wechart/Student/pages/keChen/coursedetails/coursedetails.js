const app = getApp().globalData;
Page({
  data: {
    url: app.imgUrl,
    userInfo: {},
    noticeBox: {},
    project: [],
    sectionList: [],
    signUserList: [],
    classectionId: '',
    max: 17,
    dialog: false, //碳层
    tabImg: true, //当前图
    tabImgAc: false, //换图
    tabImgGay: false, //取消咨询 
    wei: true, //微信
    weing: false, //选中 
    phone: true, //电话
    phoneIng: false, //未选中
    signOver: 1,
    callBack: false,
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0,
    classId: "",
    otherStudentId: "",
    imgModal:[],
    imgNumber:0,
    imgList: [],
  },
  onLoad: function(options) {
    console.log(options)
    this.setData({ imgNumber:0})
    var that = this;
    var memberState = options.memberState;
    if (memberState == null || memberState == 'undefined'){
      memberState=0
    }
    that.setData({
      memberState: memberState,
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
    // 页面初始化 options为页面跳转所带来的参数
    wx.showShareMenu({
      withShareTicket: true,
      success: function(res) {
      },
      fail: function(res) {
      }
    })
    if (options.shar == "shareBtn") {
      that.setData({
        callBack: true
      }) 
    }
    this.setData({
      userInfo: options,
      signOver: 1,
      classId: options.classId
    })
    //培训项目信息
    proJect(this, this.data.classId);
    //curriculum date
    signUpuserList(this, this.data.classId, this.data.classectionId)
  },


  imgPreviewCoach: function (e) {
    let currentImg = e.currentTarget.dataset.url;
    wx.previewImage({
      current: currentImg, // 当前显示图片的http链接
      urls: [currentImg] // 需要预览的图片http链接列表
    })
  },

  imgPreview: function (e) {
    let currentImg = e.currentTarget.dataset.url;
    wx.previewImage({
      current: currentImg, // 当前显示图片的http链接
      urls: this.data.imgList // 需要预览的图片http链接列表
    })
  },

  imageLoad: function(e) {
    var _this = this;
    var imgModal = _this.data.imgModal;
   if(e == 1){//show
     if (_this.data.noticeBox.homePhoto.length == imgModal.length) {
       //说明加载完成
       let noticeBox = _this.data.noticeBox;
       for (var i = 0; i < noticeBox.homePhoto.length; i++) {
         noticeBox.homePhoto[i].width = imgModal[i]
       }
       _this.setData({ noticeBox: noticeBox })
     }
   }else{
     var $width = e.detail.width,    //获取图片真实宽度  
       $height = e.detail.height,
       ratio = $width / $height;   //图片的真实宽高比例
     var viewHeight = 210,           //设置图片显示高度，  
       viewWidth = 210 * ratio;    //计算的宽度值 
     imgModal.push(viewWidth)
     _this.setData({
       imgwidth: viewWidth,
       imgheight: viewHeight,
       imgModal: imgModal
     })
     if (_this.data.noticeBox.homePhoto.length == imgModal.length) {
       //说明加载完成
       let noticeBox = _this.data.noticeBox;
       for (var i = 0; i < noticeBox.homePhoto.length; i++) {
         noticeBox.homePhoto[i].width = imgModal[i]
       }
       _this.setData({ noticeBox: noticeBox })
     }
   } 
  },
  //look more people
  more: function(e) {
    var len = this.data.signUserList.length
    this.setData({
      max: len
    })
  },
  shop: function(e) {
    let storageUserType = wx.getStorageSync("userInfo").userType;
    let storageStudentId = wx.getStorageSync("studentBaseInfo").roleId;
    let userType = storageUserType != null ? storageUserType.substr(1, 1) : "";
    if (storageStudentId > 0 && userType == '1') {

    } else {
      shareLoginForRegister(this, 'shop');
      return false
    }
    var that = this;
    that.setData({
      dialog: false, //碳层
      tabImg: true, //当前图
      tabImgAc: false, //换图
      tabImgGay: false //取消咨询
    })
    var putawayStatus = this.data.noticeBox; //down  classId 
    if (putawayStatus.putawayStatus == 2 && that.data.signOver == 1) {
      wx.showModal({
        title: '提示',
        content: '该课程已下架或已报满',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../../pages/keChen/purchasecourse/purchasecourse?classId=' + this.options.classId //跳转到购买课程页面
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../../../pages/keChen/purchasecourse/purchasecourse?classId=' + this.options.classId //跳转到购买课程页面
      })
    }
  },
  //用户新增收藏课程
  studentStore: function(e) {
    let storageUserType = wx.getStorageSync("userInfo").userType;
    let storageStudentId = wx.getStorageSync("studentBaseInfo").roleId;
    let userType = storageUserType != null ? storageUserType.substr(1, 1) : "";
    if (storageStudentId > 0 && userType == '1') {

    } else {
      shareLoginForRegister(this, 'store');
      return false
    }
    var that = this;
    that.setData({
      dialog: false, //碳层
      tabImg: true, //当前图
      tabImgAc: false, //换图
      tabImgGay: false //取消咨询
    })
    var classId = this.data.userInfo.classId;
    var userId = wx.getStorageSync('userInfo').userId;
    if (this.data.noticeBox.storeStatus == 0) {
      wx.request({
        url: app.url + '/v1/studentStore/insertStore',
        header: {
          'token': wx.getStorageSync('userInfo').token
        },
        method: 'GET',
        data: {
          'classId': classId,
          'userId': userId,
          'studentId': wx.getStorageSync('studentBaseInfo').roleId,
          'remindType': 1
        },
        success: (res) => {
          if (res.data.code == '30005') {
            //跳转到首页  
            wx.navigateTo({
              url: "../../../pages/register/register"
            });
            return;
          }
          if (res.data.code == 10000) {
            var notice = that.data.noticeBox
            notice.storeStatus = 1;
            that.setData({
              noticeBox: notice
            })
            app.classIdList.push({
              "classId": classId,
              "status": 1
            })
            wx.setStorageSync('INDEX_CLASS_LIST_CLASS_ID', classId);
            //wx.setStorageSync('INDEX_CLASS_LIST_CLASS_STORE_STATUS', "1");
            wx.showToast({
              title: '收藏成功',
              icon: 'none'
            })
          }
        },
        fail: (info) => {
          wx.showToast({
            title: '收藏失败',
          })
        }
      })
    } else {
      wx.request({
        url: app.url + '/v1/studentStore/updateStudentSoreStatusByUserIdAndClassId',
        header: {
          'token': wx.getStorageSync('userInfo').token
        },
        method: 'GET',
        data: {
          'classId': classId,
          'userId': wx.getStorageSync('userInfo').userId
        },
        success: (res) => {
          if (res.data.code == '10000') {
            var notice = that.data.noticeBox
            notice.storeStatus = 0;
            that.setData({
              noticeBox: notice
            })
            wx.showToast({
              title: '取消收藏成功',
              icon: 'none'
            })
            app.classIdList.push({
              "classId": classId,
              'status': 0
            })
            wx.setStorageSync('INDEX_CLASS_LIST_CLASS_ID', classId);
            //wx.setStorageSync('INDEX_CLASS_LIST_CLASS_STORE_STATUS', "0");
          } else {
            wx.showToast({
              title: '取消收藏失败',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: (info) => {
          wx.showToast({
            title: '取消收藏失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }

  },

  //咨询教练
  what: function(e) {
    var that = this;
    if (that.data.dialog) {
      that.setData({
        dialog: false, //碳层
        tabImg: true, //当前图
        tabImgAc: false, //换图
        tabImgGay: false //取消咨询
      })
    } else {
      that.setData({
        dialog: true, //碳层
        tabImg: false, //当前图
        tabImgAc: true, //换图
        tabImgGay: true //取消咨询
      })
    }
  },
  //点击蒙层
  dialog: function(e) {
    this.setData({
      dialog: false, //碳层
      tabImg: true, //当前图
      tabImgAc: false, //换图
      tabImgGay: false //取消咨询
    })
  },
  //点击留言
  msg: function() {
    let storageUserType = wx.getStorageSync("userInfo").userType;
    let storageStudentId = wx.getStorageSync("studentBaseInfo").roleId;
    let userType = storageUserType != null ? storageUserType.substr(1, 1) : "";
    if (storageStudentId > 0 && userType == '1') {

    } else {
      shareLoginForRegister(this, 'im');
      return false
    }
    this.setData({
      // dialog: false,//碳层
      // tabImg: true,//当前图
      // tabImgAc: false,//换图
      // tabImgGay: false,//取消咨询
      wei: false, //微信
      weing: true, //选中
      phone: true, //电话
      phoneIng: false, //未选中
    })
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.userType.substr(1, 1) == '0') {
      wx.navigateTo({
        url: '../../../pages/register/register'
      })
      return false;
    }
    wx.navigateTo({
      url: '../../../pages/new/chitchat/chitchat?userimname=coachIM' + this.data.noticeBox.userId + '&type=coach&avatarurl=' + this.data.noticeBox.coachPhotoAddress + '&nickname=' + this.data.noticeBox.classCoach,
    })
  },
  //点击电话咨询
  callPhone: function(e) {
    this.setData({
      // dialog: false,//碳层
      // tabImg: true,//当前图
      // tabImgAc: false,//换图
      // tabImgGay: false,//取消咨询
      wei: true, //微信
      weing: false, //选中
      phone: false, //电话
      phoneIng: true, //未选中
    })
    var phoneNumber = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phoneNumber //仅为示例，并非真实的电话号码
    })
  },

  //回到首页
  returnhome: function() {
    let storageUserType = wx.getStorageSync("userInfo").userType;
    if (storageUserType) {} else {
      shareLoginNotRegister(this, 'index');
      return false
    }
    wx.switchTab({
      url: '../../../pages/keChen/keChen-index/keChen-index',
    })
  },

  //点击联系客服咨询
  telephone: function(e) {
    wx.makePhoneCall({
      phoneNumber: '400-666-1816' //仅为示例，并非真实的电话号码
    })
  },

  //跳转到开班情况
  openKe: function(e) {
    let storageUserType = wx.getStorageSync("userInfo").userType;
    if (storageUserType) {} else {
      shareLoginNotRegister(this, 'eachclassis');
      return false
    }
    wx.navigateTo({
      url: '../../../pages/keChen/eachclassis/eachclassis?classId=' + this.data.noticeBox.classId
    })
  },
  //跳转到场馆详情
  openVenue: function(e) {
    let storageUserType = wx.getStorageSync("userInfo").userType;
    if (storageUserType) {} else {
      shareLoginNotRegister(this, 'venue');
      return false
    }
    wx.navigateTo({
      url: '../../../pages/changGuan/c-VenueItem/c-VenueItem?homeId=' + this.data.noticeBox.homeId
    })
  },
  //跳转到教练详情
  openCoach: function(e) {
    let storageUserType = wx.getStorageSync("userInfo").userType;
    if (storageUserType) {} else {
      shareLoginNotRegister(this, 'coach');
      return false
    }
    wx.navigateTo({
      url: '../../../pages/techer/Coach-introduction/Coach-introduction?userId=' + this.data.noticeBox.userId
    })
  },
  toUserDetailPage: function(e) {
    let storageUserType = wx.getStorageSync("userInfo").userType;
    if (storageUserType) {} else {
      shareLoginNotRegister(this, 'student');
      return false
    }
    this.setData({
      otherStudentId: e.currentTarget.dataset.studentuserid
    })
    wx.navigateTo({
      url: '../../changGuan/c-VenueStudent/c-VenueStudent?userId=' + e.currentTarget.dataset.studentuserid
    })
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    wx.getNetworkType({
      success: function(res) {
        var networkType = res.networkType
        if (res.networkType == 'none') {
          wx.reLaunch({
            url: '../../../pages/welcome/welcomeNo/welcomeNo',
          })
        }
      }
    })
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(() => {
      wx.hideLoading()
    }, 1000)
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    if (prevPage && prevPage != 'undefined'){
        prevPage.setData({ touTu: true })//设置数据
    }
    classSectionList(this, this.data.classId);
    //课程详情列表
    noticeItem(this, this.data.classId, wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo').userId : 0)
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  onLaunch(ops) {
    if (ops.scene == 1044) {

      wx.getShareInfo({
        shareTicket: ops.shareTicket,
        success: function(res) {
          var encryptedData = res.encryptedData;
          var iv = res.iv;
        }
      })
    }
  },
  onShareAppMessage: function(options) {　 
    var that = this;
    that.setData({
      dialog: false, //碳层
      tabImg: true, //当前图
      tabImgAc: false, //换图
      tabImgGay: false //取消咨询
    })
    var shareObj = {　　　
      title: "课程详情",
      path: 'pages/keChen/coursedetails/coursedetails?classId=' + that.data.userInfo.classId + "&shar=shareBtn",
      imgUrl: '',
      　　　success: function(res) {
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function(res) {
            console.log(res)
          },
          fail: function(res) {
            console.log(res)
          },
          complete: function(res) {
            console.log(res)
          }
        })　　　
      },
      　　　　fail: function(res) {}　　
    };　　
    if (options.from == 'button') {
      shareObj.path = '/pages/keChen/coursedetails/coursedetails?classId=' + that.data.userInfo.classId + "&shar=shareBtn";　　
    }　　
    return shareObj;
  }
})

/*请求课程详情的信息*/
function noticeItem(that, classId, userId) {
  wx.request({
    url: app.url + '/v1/class/getClassDetail',
    header: {
      'token': wx.getStorageSync('userInfo').token
    },
    method: 'GET',
    data: {
      'classId': classId,
      'userId': userId
    },
    success: function(res) {
      if (res.data.code == '10000') {
        var result = res.data.response;
        result.itemStudentGrade = 'L' + result.itemStudentGrade.replace(new RegExp(",", 'g'), " L");
        var system = wx.getSystemInfoSync()
        result.classPhotoAddress = result.classPhotoAddress;
        wx.setStorageSync('ClassPtotoAddress', result.classPhotoAddress)
        wx.setStorageSync('ClassPtotoId', result.classId)
        //课程详情图片，将用户上传的图片删除封面图，其他图片在课程简介下方展示
        //循环数组删除首个（避免后端添加图片）
        // result.classPhotoVOList.length > 1 ? result.classPhotoVOList.splice(0, 1) : result.classPhotoVOList;
        //遍历classPhotoVOList数组，将defaultPhoto为1的删掉
        let index = -1;
        for (let i = 0; i < result.classPhotoVOList.length; i++) {
          result.classPhotoVOList[i].photoAddress = result.classPhotoVOList[i].photoAddress + '?x-oss-process=image/resize,m_mfit,w_' + system.windowWidth;
          //判断数组中defaultPhoto为1的数据
          if (result.classPhotoVOList[i].defaultPhoto == '1') {
            index = i;
          }
        }
        if (index >= 0) {
          //{splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目。}
          result.classPhotoVOList.splice(index, 1);
        }
        let tempImgList = new Array();
        for (var x = 0; x < result.homePhoto.length;x++){
          tempImgList.push(result.homePhoto[x]);
          result.homePhoto[x] = {"name":result.homePhoto[x],width:0} 
        }
        that.setData({
          noticeBox: result,
          imgList: tempImgList
        })
        if (that.data.imgNumber == 1) {
          that.imageLoad(1);
        } else {
          that.setData({ imgNumber: 1 })
        }

      }
    },
    fail: function(info) {
      console.log("请求失败")
    }
  })
}
/*获取课程培训项目*/
function proJect(that, classId) {
  wx.request({
    url: app.url + '/v1/class/getClassArticleInfo',
    header: {
      'token': wx.getStorageSync('userInfo').token
    },
    method: 'GET',
    data: {
      'classId': classId
    },
    success: function(res) {
      if (res.data.code == '10000') {
        that.setData({
          project: res.data.response
        })
      }
    },
    fail: function(info) {
    }
  })
}
/*获取课程时段信息*/
function classSectionList(that, classId) {
  that.setData({
    signOver: 1
  })
  wx.request({
    url: app.url + '/v1/class/getClassSectionList',
    header: {
      'token': wx.getStorageSync('userInfo').token
    },
    method: 'GET',
    data: {
      'classId': classId
    },
    success: function(res) {
      if (res.data.code == '10000') {
        var result = res.data.response;
        for (let i in result) {
          result[i].weekDay = '周' + chinanum(result[i].weekDay);
          if (result[i].signUpOver == 0) {
            that.setData({
              signOver: 0
            })
          }
        }
        that.setData({
          sectionList: result
        })
        let memberState = that.data.memberState;
        //状态不一样，更新报满的状态
        if (memberState != that.data.signOver) {
          updateSignUpState(that);
        }
        wx.setStorageSync('INDEX_CLASS_LIST_CLASS_ID', classId);
        wx.setStorageSync('INDEX_CLASS_LIST_CLASS_SIGN_UP_OVER', that.data.signOver);
      } else {
        wx.showToast({
          title: 'Backstage error',
        })
      }
    },
    fail: function(re) {
    }
  })
}
/*student is infomation*/
function signUpuserList(that, classId, classectionId) {
  wx.request({
    url: app.url + '/v1/class/getClassSignUpUserList',
    header: {
      'token': wx.getStorageSync('userInfo').token
    },
    method: 'GET',
    data: {
      'classId': classId,
      'classectionId': classectionId
    },
    success: function(res) {
      if (res.data.code == 10000) {
        that.setData({
          signUserList: res.data.response
        })
      } else {
        wx.showToast({
          title: 'error',
        })
      }
    },
    fail: function(info) {
      wx.showToast({
        title: 'request ERROR',
      })
    }
  })
}
//阿拉伯数字转星期
function chinanum(num) {
  num--;
  var china = new Array('一', '二', '三', '四', '五', '六', '日');
  var arr = new Array();
  for (var i = 0; i < china.length; i++) {
    arr[0] = china[num];
  }
  return arr.join("")
}

function shareLoginNotRegister(that, openTo) {
  that.setData({
    callBack: false
  })
  if (openTo == 'eachclassis') {
    wx.setStorageSync("SHARE_LOGIN_FOR_REGISTER", 'pages/keChen/eachclassis/eachclassis?classId=' + that.data.noticeBox.classId);
  } else if (openTo == 'index') {

  } else if (openTo == 'venue') {
    wx.setStorageSync("SHARE_LOGIN_FOR_REGISTER", 'pages/changGuan/c-VenueItem/c-VenueItem?homeId=' + that.data.noticeBox.homeId);
  } else if (openTo == 'student') {
    wx.setStorageSync("SHARE_LOGIN_FOR_REGISTER", 'pages/changGuan/c-VenueStudent/c-VenueStudent?userId=' + that.data.otherStudentId);
  } else if (openTo == 'coach') {
    wx.setStorageSync("SHARE_LOGIN_FOR_REGISTER", 'pages/techer/Coach-introduction/Coach-introduction?userId=' + that.data.noticeBox.userId);
  }
  wx.navigateTo({
    url: '../../../pages/Introduction/Introduction?openFrom=classShare&openTo=' + openTo
  })
}

function shareLoginForRegister(that, openTo) { //shop  store im
  let storageUserType = wx.getStorageSync("userInfo").userType;
  let userType = storageUserType != null ? storageUserType.substr(1, 1) : "";
  that.setData({
    callBack: false
  })
  if (openTo == 'im') {
    wx.setStorageSync("SHARE_LOGIN_FOR_REGISTER", 'pages/new/chitchat/chitchat?userimname=coachIM' + that.data.noticeBox.userId + '&type=coach&avatarurl=' + that.data.noticeBox.coachPhotoAddress + '&nickname=' + that.data.noticeBox.classCoach);
  } else if (openTo == 'shop') {
    wx.setStorageSync("SHARE_LOGIN_FOR_REGISTER", 'pages/keChen/purchasecourse/purchasecourse?classId=' + that.data.classId);
  } else if (openTo == 'store') {}
  if (storageUserType && userType == '0') {
    wx.navigateTo({
      url: '../../../pages/register/register?openTo=' + openTo
    })
  } else {
    wx.navigateTo({
      url: '../../../pages/Introduction/Introduction?openFrom=classShare&openTo=' + openTo
    })
  }
}

function updateSignUpState(vm) {
  wx.request({
    url: app.url + '/v1/class/updateSignUpMemberStateByClassId',
    header: {
      'token': wx.getStorageSync('userInfo').token
    },
    method: 'GET',
    data: {
      'classId': vm.data.classId
    },
    success: function(res) {

    },
    fail: function(re) {
      // wx.showToast({
      //   title: 'Get error',
      // })
    }
  })
}