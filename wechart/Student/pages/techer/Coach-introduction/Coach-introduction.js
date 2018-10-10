// pages/techer/Coach-introduction /Coach-introduction.js
const app = getApp().globalData;
Page({
  data: {
    url: app.imgUrl,
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
    showFooter:false,
    callBack:false,
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0,
    levelList:[],
    dialog: false,//碳层
    tabImg: true,//当前图
    tabImgAc: false,//换图
    tabImgGay: false,//取消咨询
    wei: true,//微信
    weing: false,//选中
    phone: true,//电话
    phoneIng: false,//未选中
    otherStudentId: "",
    pageNo:1,
    pageSize:16,
    haveData:true,
    Heycurriculum:true,
    imgModal:[],
    imgNumber: 0,
    imgList:[],
  },
  //点击联系客服咨询
  telephone: function (e) {
    wx.makePhoneCall({
      phoneNumber: '400-666-1816' //仅为示例，并非真实的电话号码
    })
  },

  // 回到首页
  returnhome: function (e) {
    let storageUserType = wx.getStorageSync("userInfo").userType;
    if (storageUserType) {
    } else {
      shareLoginNotRegister(this, 'index');
      return false
    }
    wx.switchTab({
      url: '../../../pages/keChen/keChen-index/keChen-index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ imgNumber: 0 })
    const that=this;
    if (options.shar == "shareBtn") {
      that.setData({ callBack: true, userId: options.userId})
    }else{
      that.setData({
        userId: options.userId
      });
    }
  },
  imgPreview:function(e){
    let currentImg = e.currentTarget.dataset.url;
    wx.previewImage({
      current: currentImg, // 当前显示图片的http链接
      urls: this.data.imgList // 需要预览的图片http链接列表
    })
  },
  imgPreviewCoach: function (e) {
    wx.previewImage({
      current: this.data.coachDetail.coachBaseInfo.avatarUrl, // 当前显示图片的http链接
      urls: [this.data.coachDetail.coachBaseInfo.avatarUrl] // 需要预览的图片http链接列表
    })
  },
  imageLoad: function (e) {
    var _this = this;
    var imgModal = _this.data.imgModal;
    if (e == 1) {
      if (_this.data.coachDetail.sportsPhone.length == imgModal.length) {
        //说明加载完成
        let coachDetail = _this.data.coachDetail;
        for (var i = 0; i < coachDetail.sportsPhone.length; i++) {
          coachDetail.sportsPhone[i].width = imgModal[i]
        }
        _this.setData({ coachDetail: coachDetail })
      }
    }else{
      var $width = e.detail.width,    //获取图片真实宽度  
        $height = e.detail.height,
        ratio = $width / $height;   //图片的真实宽高比例
      var viewHeight = 140,           //设置图片显示高度，  
        viewWidth = 140 * ratio;    //计算的宽度值 
      imgModal.push(viewWidth)
      _this.setData({
        imgwidth: viewWidth,
        imgheight: viewHeight,
        imgModal: imgModal
      })
      if (_this.data.coachDetail.sportsPhone.length == imgModal.length) {
        //说明加载完成
        let coachDetail = _this.data.coachDetail;
        for (var i = 0; i < coachDetail.sportsPhone.length; i++) {
          coachDetail.sportsPhone[i].width = imgModal[i]
        }
        _this.setData({ coachDetail: coachDetail })
      }
    }
  },  
  kecheng: function (e) {
    var val = e.currentTarget.dataset.val;
    var that = this;
    if (val == 1) {
      that.setData({
        van: 'van-ac',
        vans: '',
        guanKe: false,
        guanJie: true,
        Heycurriculum:true
      })
    } else if (val == 2) {
      that.setData({
        van: '',
        vans: 'van-ac',
        guanKe: true,
        guanJie: false,
        Heycurriculum:false
      })
    }
  },
  onReady: function () {},
  onShow: function () {
    let that = this;
    wx.getNetworkType({
      success: function (res) {
        var networkType = res.networkType
        if (res.networkType == 'none') {
          wx.reLaunch({
            url: '../../../pages/welcome/welcomeNo/welcomeNo',
          })
        }
      }
    })
    that.setData({
      pageNo: 1,
      commentList: [],
      classList:[],
      showFooter: false
    });
    queryClassList(that);
    queryComment(that);
    queryCoachDetail(that);
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},

  toUserDetailPage: function (e) {
    this.setData({
      otherStudentId: e.currentTarget.dataset.user
    })
    let storageUserType = wx.getStorageSync("userInfo").userType;
    if (storageUserType) {
    } else {
      shareLoginNotRegister(this, 'student');
      return false
    }
    wx.navigateTo({
      url: '../../changGuan/c-VenueStudent/c-VenueStudent?userId=' + e.currentTarget.dataset.user
    })
  },

  toClassDetail:function(e){
    if (this.data.callBack){
      wx.navigateTo({
        url: '../../../pages/keChen/coursedetails/coursedetails?classId=' + e.currentTarget.dataset.classid + "&shar=shareBtn"
      }) 
    }else{
      wx.navigateTo({
        url: '../../../pages/keChen/coursedetails/coursedetails?classId=' + e.currentTarget.dataset.classid
      })
    }
  },

  showMoreComment:function(e){
      let that = this;
      this.setData({
        pageNo: that.data.pageNo+1
      });
      queryComment(that);
  },
  onReachBottom: function () {},
  onShareAppMessage: function (options, ev) {
    var that = this;
    var shareObj = {
      title: '教练介绍',
      path: "pages/techer/Coach-introduction/Coach-introduction?shar=shareBtn&&userId="+that.data.userId,
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
      // 此处可以修改 shareObj 中的内容
      shareObj.path = '/pages/techer/Coach-introduction/Coach-introduction?shar=shareBtn&&userId='+that.data.userId
    }
    return shareObj;
  },
  bindscrolltolower:function(e){
    var vm=this;
    let pageNo=vm.data.pageNo+1;
    vm.setData({
      pageNo: pageNo
    })
    var haveData=vm.data.haveData;
    if(haveData){
      queryClassList(vm);
    }else{
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
    }
  }
})

function queryComment(that){
  wx.request({
    url: app.url + '/v1/coach/get/coachEvaluate',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'POST',
    data: {
      "userId": that.data.userId,
      "pageNo": that.data.pageNo,
      "pageSize":that.data.pageSize
    },
    success: function (res) {
      if (res.data.code == "10000") {
        let tempList = res.data.response.result;
        let tempShowFooter = false;
        if (tempList.length < that.data.pageSize){
          tempShowFooter = true;
        }
        let oldList = that.data.commentList;
        let arr=[];
        oldList = oldList.concat(tempList);
        for (let i = 0; i < oldList.length;i++){
          if (oldList[i].evaluateContent==''){
           arr.push(i)
          }
        }
        let len=arr.length;
        while(len--){
          oldList.splice(arr[len],1)
        }
        that.setData({
          commentList: oldList,
          showFooter: tempShowFooter
        })
      }
    },
    fail: function (info) {
      console.log("请求失败返回信息是：" + info)
    }
  })
}

function queryCoachDetail(that) {
  wx.request({
    url: app.url + '/v1/coach/get/queryCoachDetail',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      "userId": that.data.userId
    },
    success: function (res) {
      if (res.data.code == "10000") {
        let result = res.data.response;
        let arr=new Array();
        let tempList = new Array();
        let levelList = result.certificateList;
        for (let i = 0; i < result.certificateList.length;i++){
          if (!result.certificateList[i].athleteGrade && !result.certificateList[i].coachGrade) {
            arr.push(i)
          }
          tempList.push(result.certificateList[i]);
        }
        let len = arr.length;
        while (len--) {
          levelList.splice(arr[len], 1)
        }
        result.certificateList = tempList;
        let tempImgList = new Array();
        if (result.sportsPhone && result.sportsPhone.length > 0){
          for (let i = 0; i < result.sportsPhone.length; i++) {
            tempImgList.push(result.sportsPhone[i].photoAddress);
          }
        }
        that.setData({
          coachDetail: result,
          levelList: levelList,
          imgList: tempImgList
        })
        if (that.data.imgNumber == 1) {
          that.imageLoad(1);
        } else {
          that.setData({ imgNumber: 1 })
        }
      }
    },
    fail: function (info) {
      console.log("请求失败返回信息是：" + info)
    }
  })
}

function queryClassList(that) {
  wx.request({
    url: app.url + '/v1/coach/get/coachClassesSimpleInfoByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'get',
    data: {
      "userId": that.data.userId,
      "pageNo":that.data.pageNo,
      "pageSize":that.data.pageSize
    },
    success: function (res) {
      if (res.data.code == "10000") {
        let tempList = res.data.response;
        if(tempList && tempList.length>0){
          for (let i = 0; i < tempList.length; i++) {
            tempList[i].itemStudentGrade = 'L' + tempList[i].itemStudentGrade.replace(new RegExp(",", 'g'), " L");
          }
          that.setData({
            scollHeight: 800
          })
          // if(tempList.length >=16){
          //   that.setData({
          //     scollHeight:1600
          //   })
          // }else{
          //   that.setData({
          //     scollHeight: tempList.length*140
          //   })
          // }
          let classList = that.data.classList;
          classList=classList.concat(tempList)
          that.setData({
            classList: classList
          })
        }else{
          that.setData({
            haveData:false
          })
        }
        
      }
    },
    fail: function (info) {
      console.log("请求失败返回信息是：" + info)
    }
  })
}
function shareLoginNotRegister(that,openTo) {
  that.setData({
    callBack: false
  })
  if (openTo == 'student') {
    wx.setStorageSync("SHARE_LOGIN_FOR_REGISTER", 'pages/changGuan/c-VenueStudent/c-VenueStudent?userId=' + that.data.otherStudentId);
  }
  wx.navigateTo({
    url: '../../../pages/Introduction/Introduction?openFrom=coachShare&openTo=' + openTo
  })
}