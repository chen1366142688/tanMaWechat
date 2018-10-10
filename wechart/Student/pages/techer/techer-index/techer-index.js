const app = getApp().globalData;
// pages/changGuan/c-VenueStudent/c-VenueStudent.js
Page({
  data: {
    imgUrl: app.imgUrl,
    newUrl:app.newImgUrl,
    show: true,
    listTop: 350,
    coachList: [],
    itemList: [],
    authStatus: "",
    coachNickName: '',  
    itemId: "",
    itemStudentGrade: "",
    pageNo: 1,
    pageSize: 10,
    popularitySort: "",
    totalItemSort: "",
    cityName: "",
    longitude: "",
    latitude: "",
    showFooter: false,
    upImg: app.newImgUrl + "c32.png",
    downwardImg: app.newImgUrl + "c30.png",
    selectAuth: false,
    selectL: false,
    selectP: false,
    selectC: false,
    aList: [{ name: '全部', id: "" }
      , { name: '已认证', id: "1" }],
    lList: [
    { name: '全部', id: "" },
    { name: '适合L1 (基础认识)', id: "1" },
    { name: '适合L2 (初级动作)', id: "2" },
    { name: '适合L3 (技能提高)', id: "3" },
    { name: '适合L4 (进阶练习)', id: "4" },
    { name: '适合L5 (高级运用)', id: "5" },
    { name: '适合L6 (实战能力)', id: "6" }
    ],
    pList: [{ name: '默认', id: "" }
      , { name: '从高到低', id: "1" }
      , { name: '从低到高', id: "2" }],

    cList: [{ name: '默认', id: "" }
      , { name: '从高到低', id: "1" }
      , { name: '从低到高', id: "2" }],
    thisList: [],
    thisId: "",
    thisType: "",
    isChecked:false,
    MikeBox:[],
    headers: '', 
    scrollBook:'',
    scrollModal:'',
    scrollIndex:1,
    marginTop:20,
    search:'',
    SlippingHeight:980,
    SlippingHeightBackUps: 0,
    scrollY: false,
    rectTop: 0,
    tabLoad: true, 
    Period: 0,
    scrollNum: 0,
    itemShow: false,
    itemOPa: '',
    locationInfo:wx.getStorageSync('LOCATION_INFO'),
    firstPage: true,
  },
  onLoad: function (options) {
    var that = this;
    that.setData({ thisList: [], selectAuth: false, selectL: false, selectP: false, selectC: false });
    let location = wx.getStorageSync('location') ? wx.getStorageSync('location') : wx.getStorageSync('thatLocation') ? wx.getStorageSync('thatLocation') : app.defaultLocation;
    let cityNames = location.result ? location.result.address_component.city : '成都市';
    let longitudes = location.result ? location.result.location.lng : '104.04311';
    let latitudes = location.result ? location.result.location.lat : '30.64242';
    that.setData({
      cityName: cityNames,
      longitude: longitudes,
      latitude: latitudes,
      scrollIndex: 1
    })
    queryCoachList(that, 1);
    let itemList = wx.getStorageSync('itemList');
    itemList.unshift({
      "itemId": '',
      "itemName": "全部",
      "itemPhotoAddress": "http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/iterationSport/allItem.png",
      "itemNums": null,
      "popularity": null,
      "itemMemberPrice": null,
      "itemDefaultPrice": null
    })
    try {
      var res = wx.getSystemInfoSync()
    } catch (e) {
      var res = {
        SDKVersion: "1.9.91",
        batteryLevel: 100,
        benchmarkLevel: 1,
        brand: "devtools",
        fontSizeSetting: 16,
        language: "zh_CN",
        model: "iPhone 6",
        pixelRatio: 2,
        platform: "devtools",
        screenHeight: 667,
        screenWidth: 375,
        statusBarHeight: 20,
        system: "iOS 10.0.1",
        version: "6.6.3",
        windowHeight: 555,
        windowWidth: 375,
      }
    }
    //1.获取屏幕高度，获取当前手机上横向滚动元素的高度=列表的高度
    var windowHeight = res.windowHeight;
    wx.createSelectorQuery().select('#sortBox').boundingClientRect(function (rect) {
      var rectHg = rect.height;
      console.log(rectHg)
      that.setData({ SlippingHeight: windowHeight - rectHg, SlippingHeightBackUps: windowHeight - rectHg, rectTop: rect.top })
    }).exec()
    that.setData({ itemList: itemList }) 
  },
  onReachBottom(e){
    var that = this;
    if (!that.data.showFooter) {
      that.setData({
        pageNo: that.data.pageNo + 1,
        shuaXin: true
      });
      queryCoachList(that, that.data.pageNo);
    }
  },
  //2.监听页面滚动距离scrollTop
  onPageScroll(scroll) {
    if (scroll.scrollTop >= 500) {
      if (this.data.scrollNum == 1) {
        return false;
      } else {
        this.setData({ itemShow: true, itemOPa: 'itemOPa', scrollNum: 1 })
      }
    }
    if (scroll.scrollTop < 500) {
      if (this.data.scrollNum == 1) {
        this.setData({ itemShow: false, itemOPa: 'itemOPas', scrollNum: 0 })
      } else {
        return false;
      }
    } 

  },
  searchBtn(e){
    queryCoachList(this, 1);
  },
  onReady: function () {

  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '探马运动',
      path: 'pages/Introduction/Introduction'
    }
  },
  onShow: function () {
    const that=this;
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
    //判断时候更新位置
    if (wx.getStorageSync('LOCATION_INFO').latitude !== Number(that.data.locationInfo.latitude) || wx.getStorageSync('LOCATION_INFO').longitude !== Number(that.data.locationInfo.longitude)){
      console.log("位置有变化，取新值")
      if (!that.data.firstPage){
        queryCoachList(that, 1)
      }
    }else{
      console.log("没有变化取旧值")
    }
    that.setData({
      firstPage:false
    })
  },
  onHide: function () {

  },
  onUnload: function () {

  },

  imgPreview: function (e) {
    let currentImg = e.currentTarget.dataset.url;
    wx.previewImage({
      current: currentImg, // 当前显示图片的http链接
      urls: [currentImg] // 需要预览的图片http链接列表
    })
  },

  scrolltoupper: function (e) {
    var that = this;
    that.setData({
      show: true,
    })
  },

  selectLineItem: function (e) {
    var that = this;
    if (that.data.thisType == 'p') {
      that.setData({
        selectP: false,
        popularitySort: e.currentTarget.dataset.id,
        authStatus:'',
        itemStudentGrade:'',
        totalItemSort:'',
        thisList: [],
      });
    } else if (that.data.thisType == 'a') {
      that.setData({
        selectAuth: false,
        authStatus: e.currentTarget.dataset.id,
        popularitySort: '',
        itemStudentGrade: '',
        totalItemSort: '',
        thisList: [],
      });
    } else if (that.data.thisType == 'l') {
      let status = that.data.selectL ? false : true;
      that.setData({
        selectL: false,
        itemStudentGrade: e.currentTarget.dataset.id,
        popularitySort: '',
        authStatus: '',
        totalItemSort: '',
        thisList: [],
      });
    } else if (that.data.thisType == 'c') {
      let status = that.data.selectC ? false : true;
      that.setData({
        selectC: false,
        totalItemSort: e.currentTarget.dataset.id,
        popularitySort:'',
        authStatus: '',
        itemStudentGrade: '',
        thisList: [],
      });
    }
    queryCoachList(that, 1);
  },

  selectItem: function (e) {
    var that = this;
    that.setData({
      itemId: e.currentTarget.dataset.id,
      showFooter:false
    });
    queryCoachList(that, 1);
  },

  queryByName: function (e) {
    var that = this;
    queryCoachList(that, that.data.pageNo);
  },
  selectLine: function (e) {
    var that = this;
    if (e.currentTarget.dataset.type == 'p') {
      let status = that.data.selectP ? false : true;
      that.setData({
        selectAuth: false,
        selectL: false,
        selectP: status,
        selectC: false,
        thisList: that.data.pList,
        thisId: that.data.popularitySort,
        thisType: e.currentTarget.dataset.type,
      });
      if (!status) {
        that.setData({
          thisList: [],
        });
      }
    } else if (e.currentTarget.dataset.type == 'a') {
      let status = that.data.selectAuth ? false : true;
      that.setData({
        selectAuth: status,
        selectL: false,
        selectP: false,
        selectC: false,
        thisList: that.data.aList,
        thisId: that.data.authStatus,
        thisType: e.currentTarget.dataset.type,
      });
      if (!status) {
        that.setData({
          thisList: [],
        });
      }
    } else if (e.currentTarget.dataset.type == 'l') {
      let status = that.data.selectL ? false : true;
      that.setData({
        selectAuth: false,
        selectL: status,
        selectP: false,
        selectC: false,
        thisList: that.data.lList,
        thisId: that.data.itemStudentGrade,
        thisType: e.currentTarget.dataset.type,
      });
      if (!status) {
        that.setData({
          thisList: [],
        });
      }
    } else if (e.currentTarget.dataset.type == 'c') {
      let status = that.data.selectC ? false : true;
      that.setData({
        selectAuth: false,
        selectL: false,
        selectP: false,
        selectC: status,
        thisList: that.data.cList,
        thisId: that.data.totalItemSort,
        thisType: e.currentTarget.dataset.type,
      });
      if (!status) {
        that.setData({
          thisList: [],
        });
      }
    }
  },

  bindKeywordInput: function (e) {
    this.setData({
      coachNickName: e.detail.value
    })
  },

  toDetailPage: function (e) {
    wx.navigateTo({
      url: '../Coach-introduction/Coach-introduction?userId=' + e.currentTarget.dataset.user + '&coachId=' + e.currentTarget.dataset.coach
    })
  },

  /**
   * 用户点击右上角分享
   */
  searchScrollLower: function () {
    var that = this;
    if (!that.data.showFooter && that.data.coachList.length > 0) {
      that.setData({
        pageNo: that.data.pageNo + 1,
        shuaXin:true
      });
      queryCoachList(that, that.data.pageNo);
    }
  },

})

function queryCoachList(that, pageNo) {
  wx.showLoading({
    title: '加载中...',
  })
  if (pageNo == 1) {
    that.setData({
      coachList: [],
      showFooter: false,
      pageNo:1
    })
  }
  wx.request({
    url: app.url + '/v1/coach/get/serachCoachList',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'POST',
    data:{
      "authStatus": that.data.authStatus,
      "cityId": wx.getStorageSync('LOCATION_INFO').cityId,
      "coachNickName": that.data.coachNickName,
      "itemId": that.data.itemId,
      "itemStudentGrade": that.data.itemStudentGrade,
      "latitude": wx.getStorageSync('LOCATION_INFO').latitude,
      "longitude": wx.getStorageSync('LOCATION_INFO').longitude,
      "pageNo": pageNo,
      "pageSize": that.data.pageSize,
      "popularitySort": that.data.popularitySort,
      "totalItemSort": that.data.totalItemSort
    },
    success: function (res) {
      wx.stopPullDownRefresh();
      wx.hideLoading();
      //更新初始位置值
      that.setData({ locationInfo: wx.getStorageSync('LOCATION_INFO')})
      if (res.data.code == "10000") {
        let tempList = res.data.response.result;
        let tempShowFooter = false;
        console.log(that.data.pageNo)
        console.log(tempList.length)
        if (pageNo == 1 && tempList.length == 0) {
          that.setData({
            Period: 1,
            height: 0,
            tabLoad:false
          })
          tempShowFooter = true;
          return false;
        }
        if (tempList.length < that.data.pageSize){
          tempShowFooter = true;
          that.setData({ tabLoad:false})
        }
        for (let i = 0; i < tempList.length; i++) {
          if (tempList[i].itemName != null && tempList[i].itemPhotoAddress != null) {
            let itemList = tempList[i].itemName.split(',');
            let itemListPhoto = tempList[i].itemPhotoAddress.split(',');
            for (let k = 0; k < itemList.length;k++){
              itemList[k]={
                itemName: itemList[k],
                itemPhoto: itemListPhoto[k]
              }
            }
            tempList[i].itemName = itemList;
          }
          if (tempList[i].itemStudentGrade != null) {
            let tempGrade = tempList[i].itemStudentGrade.split(',');
            let retrunGrade = "";
            var json = {};
            for (var j = 0; j < tempGrade.length; j++) {
              if (!json[tempGrade[j]]) {
                retrunGrade = retrunGrade + '  L' + tempGrade[j]
                json[tempGrade[j]] = 1;
              }
            }
            tempList[i].itemStudentGrade = retrunGrade;
          }
        }
        if (tempList.length > 0) {
          let oldList = that.data.coachList;
          oldList = oldList.concat(tempList);
          if (that.data.shuaXin){
            var List = that.data.coachList.concat(tempList);
            that.setData({
              Period: 0,
              SlippingHeight: that.data.SlippingHeightBackUps,
              coachList: List,
              showFooter: tempShowFooter
            })
          }else{
            that.setData({
              Period: 0,
              SlippingHeight: that.data.SlippingHeightBackUps,
              coachList: tempList,
              showFooter: tempShowFooter
            })
          }
        }else{
          that.setData({
            showFooter: tempShowFooter
          })
        }
      }
    },
    fail: function (info) {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '获取教练信息失败了,请确认网络或定位后重试',
        icon:'none'
      })
    }
  })
}