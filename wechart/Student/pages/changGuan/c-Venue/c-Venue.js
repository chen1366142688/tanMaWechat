const app = getApp().globalData;
Page({
  data: {
    url: app.imgUrl,
    newUrl: app.newImgUrl,
    show: 1,
    showScroll: 0,
    showHeader: 1,
    showchang: 0,
    modal: '',
    urls: [],
    itemId: '',
    cityName: '',
    longitude: '',
    latitude: '',
    searchKeyword: null, 
    gymList: [],  
    isFromSearch: true,
    searchPageNum: 1,
    callbackcount: 15,
    searchLoading: false,
    searchLoadingComplete: false, 
    upToLoading: false,
    loacalHome:false,
    nearHome:true,
    scrollActive:'scroll-active',
    scrollIndex:1,
    Period:0,
    bannerHight:0,
    tabchangGuan:'附近场馆',
    SlippingHeight:0,
    SlippingHeightBackUps:0,
    scrollY:false,
    rectTop:0,
    tabLoad: true,
    itemShow:false,
    showFooter:false,
    locationInfo: wx.getStorageSync('LOCATION_INFO'),
    firstPage:true,
  },
  onLoad: function (options) {
    const vm = this;
    vm.setData({ searchPageNum: 1, gymList: [], scrollIndex: 1 })
    initPage(vm)
    getNearGyms(vm);
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
    var windowHeight = res.windowHeight;
    wx.createSelectorQuery().select('#affix').boundingClientRect(function (rect) {
      var rectHg = rect.height;
      vm.setData({ SlippingHeight : windowHeight - rectHg , SlippingHeightBackUps : windowHeight - rectHg , rectTop: rect.top })
    }).exec()
  },
  onPageScroll(scroll) {
    if (scroll.scrollTop >= 800) {
      if (this.data.scrollNum == 1) {
        return false;
      } else {
        this.setData({ itemShow: true, itemOPa: 'itemOPa', scrollNum: 1 })
      }
    }
    if (scroll.scrollTop < 800) {
      if (this.data.scrollNum == 1) {
        this.setData({ itemShow: false, itemOPa: 'itemOPas', scrollNum: 0 })
      } else {
        return false;
      }
    } 

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
  searchBtn(e){
    this.setData({
      searchPageNum: 1, 
      gymList: [], 
      isFromSearch: true,
      searchLoading: true,
      searchLoadingComplete: false 
    })
    getNearGyms(this);
  },
  //滚动到底部触发事件  
  onReachBottom(e){
    var that = this;
    if (!that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,   
        isFromSearch: false,  
        upToLoading: false
      });
      getNearGyms(that);
    }
  },
  searchScrollLower: function () {
    var that = this;
    if (!that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1, 
        isFromSearch: false, 
        upToLoading:false
      });
      getNearGyms(that);
    }
  } ,
  bust: function (e) {
    let _this = this;
    _this.setData({
      showchang: 1,
      show: 0,
      showScroll: 1,
      showHeader: 0,
      modal: 'modal'
    })
  },
  hideModal: function (e) {
    let _this = this;
    _this.setData({
      showchang: 0,
      show: 1,
      showScroll: 0,
      showHeader: 1,
      modal: ''
    });
  },
  onReady: function () {},
  onShow: function () {
    const that=this;
    app.noType();
    var res = wx.getSystemInfoSync()
    that.setData({ bannerHight: res.screenWidth-20})
    //判断时候更新位置
    if (wx.getStorageSync('LOCATION_INFO').latitude !== Number(that.data.locationInfo.latitude) || wx.getStorageSync('LOCATION_INFO').longitude !== Number(that.data.locationInfo.longitude)) {
      that.setData({ gymList:[]})
      if (!that.data.firstPage){
        that.setData({
          searchPageNum: 1,
          gymList: [], 
          isFromSearch: true,
          searchLoading: true, 
          searchLoadingComplete: false
        })
        getNearGyms(that)
      }
    } else {
      console.log("没有变化取旧值")
    }
    that.setData({
      firstPage: false
    })
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  //选择附近场馆
  nearHome:function(){
    var vm = this;
    let location = wx.getStorageSync('location') ? wx.getStorageSync('location') : wx.getStorageSync('thatLocation') ? wx.getStorageSync('thatLocation') : app.defaultLocation;
    let cityNames = location.result.address_component.city || '成都';
    let longitudes = location.result.location.lng || 104.04311;
    let latitudes = location.result.location.lat || 30.64242;
    this.setData({
      searchPageNum: 1, 
      gymList: [],
      isFromSearch: true,
      searchLoading: true,   
      searchLoadingComplete: false ,  
      upToLoading: false,
      cityName: null,
      longitude: longitudes,
      latitude: latitudes,
      nearHome:true,
      loacalHome:false,
      tabchangGuan:'附近场馆'
    })
    getNearGyms(vm);
  },
  //选择本地场馆
  localHome:function(){
    var vm = this;
    let location = wx.getStorageSync('location') ? wx.getStorageSync('location') : wx.getStorageSync('thatLocation') ? wx.getStorageSync('thatLocation') : app.defaultLocation;
    let cityNames = location.result.address_component.city || '成都';
    let longitudes = location.result.location.lng || 104.04311;
    let latitudes = location.result.location.lat || 30.64242;
    this.setData({
      searchPageNum: 1,
      gymList: [],   
      isFromSearch: true, 
      searchLoading: true,
      searchLoadingComplete: false,
      upToLoading: false ,
      cityName: cityNames,
      longitude: null,
      latitude: null,
      loacalHome:true,
      nearHome: false,
      tabchangGuan:'搜索本地'
    })
    getNearGyms(vm);
  },
  //选择科目
  itemChoose:function(e){
    var vm = this;
    let item = e.currentTarget.dataset.id;
    if(item == 9999){
      item = '';
    }
    vm.setData({
      itemId: item,
      searchPageNum: 1, 
      gymList: [],  
      isFromSearch: true,
      searchLoading: true, 
      searchLoadingComplete: false
    })
    getNearGyms(vm);
  },
  //点击搜索按钮，触发事件  
  keywordSearch: function (e) { 
    var vm=this;
    this.setData({
      searchPageNum: 1,    
      gymList: [], 
      isFromSearch: true, 
      searchLoading: true,  
      searchLoadingComplete: false 
    })
    getNearGyms(vm);
  }, 
  //输入框事件，每输入一个字符，就会触发一次  
  bindKeywordInput: function (e) {
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  //跳转详情页
  toDetail:function(e){
    var vm = this;
    let homeId = e.currentTarget.dataset.data;
    wx.navigateTo({
      url: '../c-VenueItem/c-VenueItem?homeId=' + homeId + '&time=' + new Date().getTime(),
    })
  }
});
function getNearGyms(vm) {
  wx.showLoading({
    title: '加载中...',
  })
  let data = {};
  if (vm.data.loacalHome){
    data = {
      "cityId": wx.getStorageSync('LOCATION_INFO').cityId,
      "homeName": vm.data.searchKeyword,
      "itemId": vm.data.itemId,
      "searchKeyword": vm.data.searchKeyword,
      "pageNo": vm.data.searchPageNum,
      "pageSize": 5
    };
  }else{
    data = {
      "homeName": vm.data.searchKeyword,
      "itemId": vm.data.itemId,
      "latitude": wx.getStorageSync('LOCATION_INFO').latitude,
      "longitude": wx.getStorageSync('LOCATION_INFO').longitude,
      "searchKeyword": vm.data.searchKeyword,
      "pageNo": vm.data.searchPageNum,
      "pageSize": 5
    };
  }
  wx.request({
    url: app.url + '/v1/home/get/gymListByCoordinate',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'POST',
    data: data,
    success: (res) => {
      wx.stopPullDownRefresh()
      wx.hideLoading();
      //更新初始位置值
      vm.setData({
        locationInfo: wx.getStorageSync('LOCATION_INFO')
      })
      if (res.data.code == '10000') {
        var data = res.data.response;
          if (vm.data.searchPageNum == 1 && data.result.length == 0) {
            vm.setData({ 
              Period: 1, 
              SlippingHeight:0,
              upToLoading: false,
              searchLoading: false,  
              searchLoadingComplete: true, 
              tabLoad:false,
              showFooter:false 
              })
            return false;
          }
        if (data.result.length == 0){
          vm.setData({
            Period: 0,
            SlippingHeight: vm.data.SlippingHeightBackUps,
            upToLoading:false,
            searchLoading: false,  
            searchLoadingComplete: true ,
            tabLoad:false,
            showFooter: true 
          })
        } else if (data.result.length < 5){
          let list = vm.data.gymList;
          list = list.concat(res.data.response.result);
         for(let x=0;x<list.length;x++){
           if (list[x].itemVOS.length < 1){
             list[x].height=292+'rpx';
             list[x].check=false;
           }else{
             list[x].height = 362 + 'rpx'
             list[x].check = true;
           }
         }
          vm.setData({
            Period: 0,
            SlippingHeight: vm.data.SlippingHeightBackUps,
            gymList: list,
            upToLoading: false,
            searchLoading: false,  
            searchLoadingComplete: true,
            tabLoad: false,
            showFooter: true 
          })
        }else{
          let list = vm.data.gymList;
          list = list.concat(res.data.response.result);
          for (let x = 0; x < list.length; x++) {
            if (list[x].itemVOS.length < 1) {
              list[x].height = 292 + 'rpx';
              list[x].check = false;
            } else {
              list[x].height = 362 + 'rpx'
              list[x].check = true;
            }
          }
          vm.setData({
            Period: 0,
            SlippingHeight: vm.data.SlippingHeightBackUps,
            gymList: list,
            searchLoading: false,  
            searchLoadingComplete: false, 
            upToLoading:true,
            tabLoad: true,
            showFooter: false  
          })
        }  
      }
    },
    fail: (info) => {
      wx.hideLoading();
      wx.showToast({
        title: '网络异常,请刷新重试',
        icon:'none'
      })
    }
  })
};
function initPage(that){
    let location = wx.getStorageSync('location') ? wx.getStorageSync('location') : wx.getStorageSync('thatLocation') ? wx.getStorageSync('thatLocation') : app.defaultLocation;
    if (!location) {setTimeout(()=> {initPage(that);}, 1000)
      return false;
    }
     let cityNames = location.result ? location.result.address_component.city : '成都市';
     let longitudes = location.result ? location.result.location.lng : '104.04311';
     let latitudes = location.result ? location.result.location.lat : '30.64242' ;

    var itemsList = wx.getStorageSync("itemList");
    itemsList.unshift({
      "itemId": '',
      "itemName": "全部",
      "itemPhotoAddress": "http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/iterationSport/allItem.png",
      "itemNums": null,
      "popularity": null,
      "itemMemberPrice": null,
      "itemDefaultPrice": null
    })
    that.setData({
      urls: itemsList,
      cityName: cityNames,
      longitude: longitudes,
      latitude: latitudes
    })
}