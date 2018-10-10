const app = getApp().globalData;  
// pages/changGuan/c-VenueStudent/c-VenueStudent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    listTop:350,
    names:['张翔','李冰'],
    coachList:[],
    itemList:[],
    authStatus:"",
    coachNickName:'',
    itemId:"",
    itemStudentGrade:"",
    pageNo:1,
    pageSize:10,
    popularitySort:"",
    totalItemSort:"",
    cityName:"",
    longitude:"",
    latitude:"",
    showFooter:false,
    upImg:"http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/downward.png",
    downwardImg: "http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/xiala2.png",
    selectAuth:true,
    selectL:false,
    selectP:false,
    selectC: false,
    aList: [{ name: '全部', id: "" }
          , { name: '已认证', id: "1" }],
    lList: [{ name: '全部', id: "" },
       { name: '含L1', id: "1" },
       { name: '含L2', id: "2"}, 
       { name: '含L3', id: "3"}, 
       { name: '含L4', id: "4"}, 
       { name: '含L5', id: "5"}, 
       { name: '含L6', id: "6"}, 
       { name: '含L7', id: "7"}, 
       { name: '含L8', id: "8"}, 
       { name: '含L9', id: "9"}],
    pList: [{ name: '默认', id: "" }
      , { name: '从高到低', id: "1" }
      , { name: '从低到高', id: "2" }],

    cList: [{ name: '默认', id: "" }
      , { name: '从高到低', id: "1" }
      , { name: '从低到高', id: "2" }],
    thisList: [],
    thisId:"",
    thisType:"",
  },
    
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    var that = this;
    var location = wx.getStorageSync("location");
    let cityNames = "";
    if (location.result.address_component != null){
        cityNames = location.result.address_component.city || '';
    }
    let longitudes = location.result.location.lng;
    let latitudes = location.result.location.lat;
    that.setData({
      cityName: cityNames,
      longitude: longitudes,
      latitude: latitudes
    })
    queryCoachList(that, that.data.pageNo);
    this.setData({
      itemList: wx.getStorageSync('itemList')
    })
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

  scroll: function (e) {
    var that = this;
    if (e.currentTarget.offsetTop > 5 && that.data.coachList.length > 2) {
      that.setData({
        show: false,
        listTop: 240
      })
    }
  },

  scrolltoupper: function (e) {
    var that = this;
    that.setData({
      show: true,
      listTop: 350
    })
  },

  selectLineItem:function(e){
    var that = this;
    if (that.data.thisType == 'p') {
      that.setData({
        selectP: false,
        popularitySort: e.currentTarget.dataset.id,
        thisList: [],
      });
    } else if (that.data.thisType == 'a') {
      that.setData({
        selectAuth: false,
        authStatus: e.currentTarget.dataset.id,
        thisList:[],
      });
    } else if (that.data.thisType == 'l') {
      let status = that.data.selectL ? false : true;
      that.setData({
        selectL: false,
        itemStudentGrade: e.currentTarget.dataset.id,
        thisList: [],
      });
    } else if (that.data.thisType == 'c') {
      let status = that.data.selectC ? false : true;
      that.setData({
        selectC: false,
        totalItemSort: e.currentTarget.dataset.id,
        thisList: [],
      });
    }
    queryCoachList(that, that.data.pageNo);
  },

  selectItem :function(e){
    var that = this;
    console.log(e.currentTarget.dataset.id);
    that.setData({
      itemId: e.currentTarget.dataset.id
    });
    queryCoachList(that, that.data.pageNo);
  },

  queryByName:function(e){
    var that = this;
    queryCoachList(that, that.data.pageNo);
  },
  selectLine: function(e){
    var that = this;
    if (e.currentTarget.dataset.type == 'p'){
      let status = that.data.selectP?false:true;
      that.setData({
        selectAuth: false,
        selectL: false,
        selectP: status,
        selectC: false,
        thisList: that.data.pList,
        thisId: that.data.popularitySort,
        thisType: e.currentTarget.dataset.type,
      });
      if (!status){
        that.setData({
          thisList: [],
        });
      }
    } else if (e.currentTarget.dataset.type == 'a'){
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

  toDetailPage:function(e){
    wx.navigateTo({
      url: '../Coach-introduction/Coach-introduction?userId=' + e.currentTarget.dataset.user + '&coachId=' + e.currentTarget.dataset.coach
    })
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
  searchScrollLower: function () {
    var that = this;
    if (!that.data.showFooter && that.data.coachList.length > 0){
      that.setData({
        pageNo: that.data.pageNo + 1
      });
      queryCoachList(that, that.data.pageNo);
    }
  },

})

function queryCoachList(that,pageNo){
  if (pageNo==1){
    that.setData({
      coachList: [],
      showFooter: false
    })
  }
  wx.request({
    url: 'http://192.168.3.4:8081/v1/coach/get/serachCoachList',
    method: 'POST',
    data: {
      "latitude": that.data.latitude,
      "longitude": that.data.longitude,
      'itemId': that.data.itemId,
      'cityName': that.data.cityName,
      'authStatus ': that.data.authStatus,
      'itemStudentGrade ': that.data.itemStudentGrade,
      'popularitySort  ': that.data.popularitySort ,
      'totalItemSort  ': that.data.totalItemSort ,
      'coachNickName': that.data.coachNickName,
      'pageNo': pageNo,
      'pageSize': that.data.pageSize
    },
    success: function (res) {
      console.log("请求成功，下面返回的参数")
      console.log(res.data)
      if (res.data.code == "10000") {
        let tempList = res.data.response.result;
        for (let i = 0; i < tempList.length; i++) {
          if (tempList[i].itemPhotoAddress != null){
            tempList[i].itemPhotoAddress = tempList[i].itemPhotoAddress.split(',')[0];
          }
          if (tempList[i].itemName != null){
            tempList[i].itemName = tempList[i].itemName.split(',')[0];
          }
          if (tempList[i].itemStudentGrade != null) {
            let tempGrade = tempList[i].itemStudentGrade.split(',');
            let retrunGrade = "";
              var json = {};
              for (var j = 0; j < tempGrade.length; j++) {
                if (!json[tempGrade[j]]) {
                  retrunGrade = retrunGrade+ '  L'+tempGrade[j]
                  json[tempGrade[j]] = 1;
                }
              }
              tempList[i].itemStudentGrade = retrunGrade;
          }
        }
        if (tempList.length > 0){
          let oldList = that.data.coachList;
          oldList = oldList.concat(tempList);
          let tempShowFooter = false;
          if (oldList.length == res.data.response.total) {
            tempShowFooter = true;
          }
          that.setData({
            coachList: tempList,
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