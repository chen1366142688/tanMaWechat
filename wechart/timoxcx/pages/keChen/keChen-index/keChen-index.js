const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: 1,
    showScroll: 0,
    showHeader: 1,
    height: 760,
    showchang: 0,
    modal: '',
    url: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/',
    urls: [],
    keChenInfo: [],
    location: {},
    items: [],
    info: '',
    scrollTop: 0,
    trainingcourse: false,
    noticecoursetab: true,
    coursepersona: 'course-head-ad',
    coursepersonbnotice: '',
    //showModal:true ,     //删除弹框显示隐藏 开课通知弹窗提示
    showModal: false,   //显示弹框显示隐藏
    cityCode: { "provinceId": 510, "cityId": 510100000000, "countryId": 510107000000},
    lastFoot:'已经到底了',
    showStore:0,
    showItems:0,
    showSure1:0,
    showSure2: 0,
    showSure3: 0,
    top:true,
    down:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //g获取用户当前地址信息
    let itemList=wx.getStorageSync('itemList');
    let location = wx.getStorageSync('location');
    that.setData({
      location: location.result,
      urls: itemList
    })
    //省份。市。区
    let province=location.result.address_component.province
    let city=location.result.address_component.city
    let district=location.result.address_component.district
    //根据省市区获取城市ID
    getCityId(that,city, district, province)
    setTimeout(function(){
      //获取课程列表
      var cityObj = that.data.cityCode;
      var location = that.data.location;
      getKeChenList(that, cityObj,location,1)
    },100)
    
    //根据省市区查询场馆ID和场馆名称列表、
    getHomeList(province, city, district)
  },
//调用扫码功能
  Scavenging:function(e){
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
  },
  //用户新增收藏课程
  studentStore :function(e){
    console.log(e.currentTarget.dataset.storeid)
    var classId = e.currentTarget.dataset.storeid;
    wx.request({
      url: 'http://192.168.3.4:8081/v1/studentStore/insertStore',
      method: 'GET',
      data: {
        'classId': classId,
        'userId': 1,
        'studentId': 1,
        'remindType': 1
      },
      success: (res) => {
        console.log("新增课程成功")
        console.log(res)
      },
      fail: (info) => {
        console.log("新增收藏失败")
      }
    })
  },
  //点击选择类型出现勾选状态
  bindSure:function(e){
    var that=this;
    console.log(e.currentTarget.dataset.val)
    var val = e.currentTarget.dataset.val;
    if(val=='1'){
      that.setData({
        showSure1:1 ,
        showSure2: 1, 
        showSure3: 1 
      })
    }else if(val == "2"){
      that.setData({
        showSure2: 1,
        showSure1: 0,
        showSure3: 0,
      })
    } else if (val == "3") {
      that.setData({
        showSure3: 1,
        showSure2: 0,
        showSure1: 0
      })
    }
  },
  //点击课程类型，附近场馆，排名等出现筛选条件
  showChirden:function(e){
    console.log(e.currentTarget.dataset.show)
    var show = e.currentTarget.dataset.show;
    var that=this;
    if(show=="1"){
      that.setData({
        showItems: 1
      })
    }else if(show=="2"){
      that.setData({
        showItems:1
      })
    }else if(show=="3"){
      that.setData({
        showItems: 1
      })
    } else if (show == "4") {
      that.setData({
        showItems: 1
      })
    }
    
  },
  //点击切换tabbar
  kecheng: function (e) {
    var val = e.currentTarget.dataset.val;
    console.log(val)
    var that = this;
    if (val == 1) {
      console.log(111)
      that.setData({
        coursepersona: 'course-head-ad',
        coursepersonbnotice: '',
        trainingcourse: false,
        noticecoursetab: true,
      })
    } else if (val == 2) {
      console.log(222)
      that.setData({
        coursepersona: '',
        coursepersonbnotice: 'course-head-ad',
        trainingcourse: true,
        noticecoursetab: false,
      })
    }
  },
//往上滑动时显示上面的样式
  scroll: function (e) {
    var that = this;
    if (e.currentTarget.offsetTop > 5) {
      that.setData({
        show: 0,
        showScroll: 1,
        showHeader: 0,
        height: 940,
        showStore:1
      })
    }
  },
  //往下拉到顶部的样式
  scrolltoupper: function (e) {
    var that = this;
    that.setData({
      show: 1,
      showScroll: 0,
      showHeader: 1,
      height: 760,
      showStore:0
    })
  },
  //回到顶部
  toTop: function (e) {
    var that = this;
    that.setData({
      scrollTop: that.scrollTop / 0
    })
  },
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
  //开课通知弹窗提示 模态框
  hideModalcourse: function () {
    this.setData({
      showModal: false
    });
  },

  //暂停课程
  stopKe: function (e) {
    console.log(e.currentTarget.dataset.memberid)
    var memberid = e.currentTarget.dataset.memberid;
    wx.request({
      url: 'http://192.168.3.4:8081/v1/attend/applySuspendAttend',
      method: 'GET',
      data: {
        'memberId': memberid
      },
      success: function (res) {
        console.log("请求成功，暂停课程ok")
      },
      fail: function (info) {
        console.log("请求失败了")
      }
    })
  },
  //取消开课
  cancelKe: function (e) {
    console.log(e)
    var attendId = e.currentTarget.dataset.attend;
    wx.request({
      url: 'http://192.168.3.4:8081/v1/attend/cancelAttend',
      method: 'GET',
      data: {
        'cancelType': 1,//1学员取消 0教练取消
        'attendId': attendId
      },
      success: function (res) {
        console.log("请求成功，取消开课ok")
      },
      fail: function (info) {
        console.log("请求失败了")
      }
    })
  },
  //联系教练拨打电话
  callCoach: function (e) {
    var phoneNumber = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phoneNumber //仅为示例，并非真实的电话号码
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
     * 对话框取消按钮点击事件
     */
  onCancel: function () {
    this.hideModalcourse();
  },
  /**
   * 对话框确认按钮点击事件
   * 保存备份这个方法 备用
   */
  /*onConfirm: function (e) {
    //this.hideModalcourse();
    // 下一个方法
    
  },*/
  /**
   * 拨打教练电话
   * 
   */
  callphone: function (e) {
    wx.makePhoneCall({
      //phoneNumber: 'coach_phone',//此号码并非真实电话号码，仅用于测试
      phoneNumber: '13799999999',
      success: function () {
        console.log("拨打电话成功！")
       },
      fail: function () {
        console.log("拨打电话失败！")
       },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
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
  //根据课程类型请求列表信息
  fenItemList:function(e){
    var that=this;
    wx.showLoading({
      title: '加载中...',
    })
    console.log(e.currentTarget.dataset.id)
    var ItemId = e.currentTarget.dataset.id;
    var cityObj = that.data.cityCode;
    var location = that.data.location;
    getKeChenList(that, cityObj, location, ItemId)
  },
})
//根据省市区获取城市ID
function getCityId(that,cityName, countryName, provinceName){
  wx.request({
    url: 'http://192.168.3.4:8081/v1/systemconfig/getRegionInfoId',
    method:'POST',
    data:{
      "cityName": cityName,
      "countryName": countryName,
      "provinceName": provinceName
    },
    success:(res)=>{
      console.log(res)
      if(res.code=='10000'){
        that.setData({
          cityCode: res.response
        })
      } 
    },
    fail:(info)=>{
      console.log("请求失败")
    } 
  })
}
//请求课程列表
function getKeChenList(that, cityObj, location, classType) {
  wx.request({
    url: 'http://192.168.3.4:8081/v1/class/getHomeClassList',
    method: 'POST',
    data: {
      "cityId": cityObj.cityId,
      "classCost": "0",
      "classHot": "0",
      "classType": 1,
      "countryId": cityObj.countryId,
      "homeId": "1",
      "itemId": classType,
      "latitude": location.location.lat,
      "longitude": location.location.lng,
      "pageNumber": "1",
      "provinceId": cityObj.provinceId,
      "theNumber": "10",
      "userId": "1"
    },
    success: function (res) {
      var results=res.data.response;
      wx.hideLoading();
      if(res.data.code=="10000"){
        //如果返回的是空
        if (results.length<1){
          wx.showToast({
            title: '没有数据',
          })
          that.setData({
            keChenInfo:{},
            lastFoot:'没有数据'
          })
        }else{
          that.setData({
            keChenInfo: results
          })
        }
      }
    },
    fail: function (info) {
      console.log("请求失败了")
    }
  })
} 

//根据省市区查询场馆id和场馆名称列表
function getHomeList(province, city, district){
  wx.request({
    url: 'http://192.168.3.4:8081/v1/home/get/homeIdAndHomeNameList',
    method:'POST',
    data:{
      "cityName": city,
      'countyName': district,
      'provinceName': province
    },
    success:(res)=>{
      console.log(res)
    },
    fail:(info)=>{
      console.log("请求失败了")
    }
  })
}
