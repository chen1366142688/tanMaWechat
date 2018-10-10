// pages/changGuan/c-Venue/c-Venue.js
const app = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/',
    show: 1,
    showScroll: 0,
    showHeader: 1,
    height: 760,
    showchang: 0,
    modal: '',
    urls: [],
    // homeName: null,
    itemId: null,
    cityName: '',
    longitude: '',
    latitude: '',
    searchKeyword: null,  //需要搜索的字符  
    gymList: [], //放置返回数据的数组  
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    upToLoading:true,
    loacalHome:false,
    nearHome:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log(this);
    var location = wx.getStorageSync("location");
    // console.log(location)
    let cityNames = location.result.address_component.city || null;
    let longitudes = location.result.location.lng || null;
    let latitudes = location.result.location.lat || null;

    var itemsList=wx.getStorageSync("itemList");
    console.log(itemsList)
    var more = { itemId: 9999, itemPhotoAddress: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/van-more.png', itemName: '更多' ,itemNums:null,popularity:null};
    itemsList.push(more)
    console.log(itemsList)
    that.setData({
      urls: itemsList,
      cityName: cityNames,
      longitude: longitudes,
      latitude: latitudes
    })



  },
  scroll: function (e) {
    var that = this;
    if (e.currentTarget.offsetTop > 5) {
      that.setData({
        show: 0,
        showScroll: 1,
        showHeader: 0,
        height: 940
      })
    }
  },

  scrolltoupper: function (e) {
    var that = this;
    that.setData({
      show: 1,
      showScroll: 0,
      showHeader: 1,
      height: 760
    })
  },
  //滚动到底部触发事件  
  searchScrollLower: function () {
    // console.log("到底部了")
    var that = this;
    // console.log(!that.data.searchLoading && !that.data.searchLoadingComplete)
    if (!that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false,  //触发到上拉事件，把isFromSearch设为为false  
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
    getNearGyms(vm);
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
  //选择附近场馆
  nearHome:function(){
    var vm = this;
    var location = wx.getStorageSync("location");
    // console.log(location)
    let cityNames = location.result.address_component.city || null;
    let longitudes = location.result.location.lng || null;
    let latitudes = location.result.location.lat || null;
    this.setData({
      searchPageNum: 1,   //第一次加载，设置1  
      gymList: [],  //放置返回数据的数组,设为空  
      isFromSearch: true,  //第一次加载，设置true  
      searchLoading: true,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false ,//把“没有数据”设为false，隐藏  
      upToLoading: false,
      cityName: null,
      longitude: longitudes,
      latitude: latitudes,
      nearHome:true,
      loacalHome:false
    })
    getNearGyms(vm);
  },
  //选择本地场馆
  localHome:function(){
    var vm = this;
    var location = wx.getStorageSync("location");
    // console.log(location)
    let cityNames = location.result.address_component.city || null;
    let longitudes = location.result.location.lng || null;
    let latitudes = location.result.location.lat || null;
    this.setData({
      searchPageNum: 1,   //第一次加载，设置1  
      gymList: [],  //放置返回数据的数组,设为空  
      isFromSearch: true,  //第一次加载，设置true  
      searchLoading: true,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false, //把“没有数据”设为false，隐藏 
      upToLoading: false ,
      cityName: cityNames,
      longitude: null,
      latitude: null,
      loacalHome:true,
      nearHome: false
    })
    getNearGyms(vm);
  },
  //选择科目
  itemChoose:function(e){
    var vm = this;
    //  console.log(e);
    let item = e.currentTarget.dataset.id;
    // console.log(item);
    if(item ==9999){
      item=null;
    }
    this.setData({
      itemId: item,
      searchPageNum: 1,   //第一次加载，设置1  
      gymList: [],  //放置返回数据的数组,设为空  
      isFromSearch: true,  //第一次加载，设置true  
      searchLoading: true,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })
    getNearGyms(vm);
  },
  //点击搜索按钮，触发事件  
  keywordSearch: function (e) {  
    var vm=this;
    console.log("点击搜索了")
    this.setData({
      // searchKeyword: searchKeyword,
      searchPageNum: 1,   //第一次加载，设置1  
      gymList: [],  //放置返回数据的数组,设为空  
      isFromSearch: true,  //第一次加载，设置true  
      searchLoading: true,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })
    getNearGyms(vm);
  }, 
  //输入框事件，每输入一个字符，就会触发一次  
  bindKeywordInput: function (e) {
    console.log("输入框事件")
    // console.log(e)
    this.setData({
      searchKeyword: e.detail.value
    })
    console.log(this.data)
  },   
  //跳转详情页
  toDetail:function(e){
    var vm = this;
    //  console.log(e);
    let homeId = e.currentTarget.dataset.data;
    // console.log(homeId)
    wx.navigateTo({
      url: '../c-VenueItem/c-VenueItem?homeId=' + homeId + '&time=' + new Date().getTime(),
    })
  }
});
function getNearGyms(vm) {
  // console.log(vm)
  // console.log(vm.data)
  wx.request({
    url: app.url + '/v1/home/get/gymListByCoordinate',
    method: 'POST',
    data: {
      "cityName": vm.data.cityName,
      "homeName": vm.data.searchKeyword,
      "itemId": vm.data.itemId,
      "latitude": vm.data.latitude,
      "longitude": vm.data.longitude,
      "searchKeyword": vm.data.searchKeyword,
      "pageNo": vm.data.searchPageNum,
      // "pageSize": 2
    },
    success: (res) => {
      // console.log(res)
      if (res.data.code == '10000') {
        // console.log(res.data.response);
        var data = res.data.response;
        // console.log(res.data.response.result);
        let pages=data.pages;
        let pageNos=data.pageNum;
        // console.log(pages == pageNos)
        if(pages < pageNos){
          vm.setData({
            upToLoading:false,
            searchLoading: false,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: true //把“没有数据”设为false，隐藏  
          })
        }else if(pages==pageNos){
          
          let list = vm.data.gymList;
          list = list.concat(res.data.response.result);
          // console.log(list)
          vm.setData({
            gymList: list,
            upToLoading: false,
            searchLoading: false,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: true //把“没有数据”设为false，隐藏  
          })
        }else{
          let list = vm.data.gymList;
          list = list.concat(res.data.response.result);
          vm.setData({
            gymList: list,
            searchLoading: false,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false, //把“没有数据”设为false，隐藏  
            upToLoading:true
          })
        }
      //  console.log(vm.data) 
       
        
      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
};
function getItems() {

}