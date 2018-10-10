//index.js
const app = getApp().globalData;
const QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
let qqmapsdk = new QQMapWX({
  key: 'BX6BZ-ZDEWF-EQVJ3-JPL6W-BPU6Q-4PFHB'
});
Page({
  data: {
    imgUrls: [],
    itemList: [],
    imgUrl:'',
    aListOfExperienceLessons: [],
    appScroll: true,
    scrollY: false,
    scrollTop: 0,
    indicatorDots: true,
    indicatorColor: '#fff',
    indicatorActiveColor: '#00C693',
    autoplay: true,
    interval: 2000,
    duration: 500,
    current: 0,
    circular: true,
    perienceListHeight: 465,
    address: '成都市',
    itemId: '',
    pageNumber: 1,
    showModal: false,   //请求如果有开课通知的话就直接弹出 
    showModalTwo:false,
    showModalList: {},
    newKaiTong: 0,
    NumberNewNotice: [],
    width: 0,
    height: 0,
    imgOk:false,
    imgOkSweiper:false,
    tabLoad:true,
    Rect:false,
    SlippingHeight:0,
    SlippingHeightBackUps: 0,
    rectTop:0,
    Period:false,
    footerText:'已显示全部',
    lastHeigthChangeTime: 0,
    scrollNum:0,
    itemShow:false,
    itemOPa:''
  },
  onLoad(options) {
  },
  //2.监听页面滚动距离scrollTop
  onPageScroll(scroll) {
    if (scroll.scrollTop >= 1000){
      if(this.data.scrollNum == 1){
        return false;
      }else{
        this.setData({ itemShow: true, itemOPa: 'itemOPa', scrollNum: 1})
      }
    }
    if (scroll.scrollTop < 1000){
      if(this.data.scrollNum == 1){
        this.setData({ itemShow: false, itemOPa: 'itemOPas', scrollNum: 0})
      }else{
        return false;
      }
    } 
  },
  //大容器滚到到顶部
  ScrollToTop(e){
    this.setData({ scrollY:false})
  },
  
  onReady() {
    const that = this;
    setTimeout(function () {
      let location = wx.getStorageSync('LOCATION_INFO');
      that.setData({
        address: location.address ,
      })
      Experience(that)  
      
    }, 800)
    getBanner(that) 
  }, 
  onShow(){
    let userId = wx.getStorageSync('userInfo').userId;
    newNotice(this, userId);
    const that = this;
    app.noType();
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
      // console.log(res)
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
    that.setData({
      itemList: itemList,
      width: res.windowWidth,
      height: res.windowHeight
    })
    //1.获取屏幕高度，获取当前手机上横向滚动元素的高度=列表的高度
    var windowHeight = res.windowHeight;
    // wx.createSelectorQuery().select('#affix').boundingClientRect(function (rect) {
    //   console.log(rect)
    //   var rectHg = rect.height;
    //   console.log(windowHeight - rectHg)
    //   that.setData({ SlippingHeight: windowHeight - rectHg, SlippingHeightBackUps: windowHeight - rectHg, rectTop: rect.top })
    // }).exec()
    
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
  appScrollBind(e) {
    let self = this;
    let top = e.detail.scrollTop;
    console.log(top)
    self.setData({
      scrollTop: top
    });
  },
  
  //调用扫码功能
  // Scavenging(e) {
  //   wx.scanCode({
  //     success: (res) => {
  //       let webSite = res.result;
  //       var params = new Object();
  //       params = GetRequest(webSite);
  //       let webType = params.type;
  //       if (webType == "02") {
  //         wx.navigateTo({
  //           url: '../../changGuan/c-VenueItem/c-VenueItem?homeId=' + params.id,
  //         })
  //       } else if (webType == "01") {
  //         wx.navigateTo({
  //           url: '../../techer/Coach-introduction/Coach-introduction?userId=' + params.id + '&coachId=' + params.coachId
  //         })
  //       } else {
  //         wx.showModal({
  //           title: '提示',
  //           content: '请扫描正确的二维码',
  //           success: function (res) {
  //             if (res.confirm) {
  //               console.log('用户点击确定')
  //             } else if (res.cancel) {
  //               console.log('用户点击取消')
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  /*迭代的方法*/
  //更多体验课
  moreCourse(e){
    wx.navigateTo({
      url: '../../../pages/Timetable/Workshop/Workshop',
    })
  },
  //附近机构
  nearbyInstitutions(e){
    wx.navigateTo({
      url: '../../../pages/techer/techer-index/techer-index',
    })
  },
  //附近场馆
  nearbyStadiums(e){
    wx.navigateTo({
      url: '../../../pages/changGuan/c-Venue/c-Venue',
    })
  },
  // 点击地址
  Acquire(e) {
    const that = this;
    wx.chooseLocation({
      success: function (resF) {
        console.log(resF)
        if (resF.name == ''){return ;}
        that.setData({ address: resF.name })
        //更改地址缓存信息重新获取省市区id
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: resF.latitude,
            longitude: resF.longitude
          },
          success: function (res) {
            wx.request({
              url: app.url + '/v1/systemconfig/getRegionInfoId',
              header: { 'token': wx.getStorageSync('userInfo').token },
              method: 'POST',
              data: {
                "cityName": res.result.address_component.city,
                "countryName": res.result.address_component.district,
                "provinceName": res.result.address_component.province
              },
              success: (response) => {
                if (response.data.code == '10000') {
                  let locationInfo = {
                    latitude: resF.latitude,
                    longitude: resF.longitude,
                    provinceId: response.data.response.provinceId,
                    provinceName: res.result.address_component.province,
                    cityId: response.data.response.cityId,
                    cityName: res.result.address_component.city,
                    countyId: response.data.response.countryId,
                    countyName: res.result.address_component.district,
                    address: res.result.address_component.street_number,
                  }
                  wx.setStorageSync('LOCATION_INFO', locationInfo);
                  that.setData({ aListOfExperienceLessons:[],pageNumber:1})
                  Experience(that)
                } else {
                  wx.showToast({
                    title: response.data.msg,
                    icon: 'none'
                  })
                }
              }
            })
          }
        });
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  //加载更多
  listTolower(e) {
    const that = this;
    var myDate = new Date();
    if (myDate.getTime() - that.data.lastHeigthChangeTime < 500) {
      return false;
    }else{
      that.setData({
        pageNumber: that.data.pageNumber + 1
      })
      Experience(that)
    }
  },
  //跳转到开课通知
  goLectureNtice(e){
    if (wx.getStorageSync('userInfo').userType) {
      let userType = wx.getStorageSync("userInfo").userType;
      let isOldUser = userType ? userType.substr(1, 1) : "";
      if (isOldUser == '1') {
        wx.navigateTo({
          url: '../../../pages/keChen/Notice/Notice',
        })
      } else {
        wx.redirectTo({
          url: "../../../pages/register/register?noBack=true"
        });
      }
    }
    
  },
  //跳转到课程订单
  goCourseOrder(e) {
    if (wx.getStorageSync('userInfo').userType) {
      let userType = wx.getStorageSync("userInfo").userType;
      let isOldUser = userType ? userType.substr(1, 1) : "";
      if (isOldUser == '1') {
        wx.navigateTo({
          url: '../../../pages/changGuan/c-VenueOrder/c-VenueOrder',
        })
      } else {
        wx.redirectTo({
          url: "../../../pages/register/register?noBack=true"
        });
      }
    }
    
  },
  toBannerDetail(e){
    let linkUrl = e.currentTarget.dataset.url;
    if (linkUrl == 'competition') {
      wx.navigateTo({
        url: '../../../pages/competition/competition-list/competition-list',
      })
    } else if (linkUrl  == 'invitation'){
      wx.navigateTo({
        url: '../../../pages/computer/computer',
      })
    }
    // if (linkUrl && linkUrl.length > 0){
    //   if (linkUrl == 'competition'){ 
    //       wx.navigateTo({
    //         url: '../../../pages/competition/competition-list/competition-list',
    //       })
    //   }else{
    //     wx.navigateTo({
    //       url: '../../../pages/computer/computer',
    //     })
    //   }
    // }
  },
  //根据课程类型请求列表信息
  fenItemList(e) {
    const that = this;
    var ItemId = e.currentTarget.dataset.id; //科目ID
    that.setData({
      itemId: e.currentTarget.dataset.id,
      aListOfExperienceLessons: [],
      pageNumber: 1,
      scrollIndex: 1,
      tabLoad:true
    });
    Experience(that)
  },
  /**
   * 拨打教练电话
   * 
   */
  callphone: function (e) {
    var phoneNumber = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨号失败")
      },
    })
  },
  //暂停课程
  stopKe: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.memberid)
    var memberid = e.currentTarget.dataset.memberid;
    var fash = e.currentTarget.dataset.fash;
    //这是弹窗的暂停开课
    this.setData({
      showModal: false,
      showModalTwo: true,
      memberId: memberid,
      fash: fash
    })
  },
  //取消开课
  cancelKe: function (e) {
    console.log(e)
    var that = this;
    var attendId = e.currentTarget.dataset.attend;
    var fash = e.currentTarget.dataset.fash;
    //这是弹窗的取消开课
    that.setData({
      showModal: false,
      showModalTwo: true,
      attendId: attendId,
      fash: fash
    })
  },
  /**
     * 对话框取消按钮点击事件
     */
  onCancel: function () {
    console.log('what')
    var that = this;
    that.setData({
      showModal: false,
      autoplay:true,
      showModalList: {}
    })
    var resuLst = that.data.showModalListItem;
    if (resuLst.length >= 1) {
      console.log("why")
      setTimeout(function () {
        that.setData({
          showModal: true,
          showModalList: resuLst.shift()
        })
      }, 800)
    } else {
      console.log(resuLst.length)
      that.setData({
        showModal: false,
        showModalTwo: false,
        newKaiTong: false
      })
    }
  },
  //上一步
  lastStep: function (e) {
    var that = this;
    that.setData({
      showModal: true,
      showModalTwo: false
    })
  },
  //弹窗暂停课程确认额
  curriculum: function (e) {
    var that = this;
    var memberid = that.data.memberId;
    wx.request({
      url: app.url + '/v1/attend/applySuspendAttend',
      header: { 'token': wx.getStorageSync('userInfo').token },
      method: 'GET',
      data: {
        'memberId': memberid
      },
      success: function (res) {
        console.log("请求成功，暂停课程ok")
        if (res.data.code == '10000') {
          wx.showToast({
            title: '暂停课程成功',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }

        that.setData({
          showModal: false,
          autoplay: true,
          showModalTwo: false,
          showModalList: {}
        })

        var resuLst = that.data.showModalListItem;
        if (resuLst.length >= 1) {
          console.log("why")
          setTimeout(function () {
            that.setData({
              showModal: true,
              autoplay: false,
              showModalList: resuLst.shift(),
              newKaiTong: 1
            })
          }, 800)
        } else {
          console.log(resuLst.length)
        }
      },
      fail: function (info) {
        wx.showToast({
          title: '暂停课程失败，请刷新重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //确定取消
  sureCancel: function (e) {
    var that = this;
    var attendId = that.data.attendId;
    wx.request({
      url: app.url + '/v1/attend/cancelAttend',
      header: { 'token': wx.getStorageSync('userInfo').token },
      method: 'GET',
      data: {
        'cancelType': 1,//1学员取消 0教练取消
        'attendId': attendId
      },
      success: function (res) {
        console.log("请求成功，取消开课ok")
        wx.showToast({
          title: '取消成功',
        })
        that.setData({
          showModal: false,
          autoplay: true,
          showModalTwo: false,
          showModalList: {}
        })
        var resuLst = that.data.showModalListItem;
        if (resuLst.length >= 1) {
          console.log("why")
          setTimeout(function () {
            that.setData({
              showModal: true,
              autoplay: false,
              showModalList: resuLst.shift()
            })
          }, 800)
        } else {
          console.log(resuLst.length)
        }
      },
      fail: function (info) {
        wx.showToast({
          title: '取消开课失败，请刷新重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  goCourseDetails(e){ 
    var classId = e.currentTarget.dataset.classid;
    var signUpOver = e.currentTarget.dataset.over;
    var marketingStatus = e.currentTarget.dataset.marketingstatus;//是否营销
    wx.setStorageSync('ClassPtotoAddress', '')
    wx.setStorageSync('ClassPtotoId', '')
    setTimeout(() => {
      if (marketingStatus=='0'){
        wx.navigateTo({
          url: '../../../pages/keChen/coursedetails/coursedetails?classId=' + classId + '&memberState=' + signUpOver,
        })
      }else{
        wx.navigateTo({
          url: '../../../pages/keChen/marketing-index/marketing-index?classId=' + classId,
        })       
      }
    }, 500)
  },
  loadImg(e) {
    this.setData({
      imgOk:true,
      imgOkSweiper:true  
    })
  },
  onReachBottom(e){
    const that = this;
    var myDate = new Date();
    if (myDate.getTime() - that.data.lastHeigthChangeTime < 500) {
      return false;
    } else {
      that.setData({
        pageNumber: that.data.pageNumber + 1
      })
      Experience(that)
    }
  }
})

function Experience(that) {
  wx.request({
    url: app.url + '/v1/class/getHomeClassListNew',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'POST',
    data: {
      "cityId": wx.getStorageSync('LOCATION_INFO').cityId,
      "itemId": that.data.itemId,
      "latitude": wx.getStorageSync('LOCATION_INFO').latitude,
      "longitude": wx.getStorageSync('LOCATION_INFO').longitude,
      "pageNumber": that.data.pageNumber,
      "provinceId": wx.getStorageSync('LOCATION_INFO').provinceId,
      "theNumber": 10
    },
    success(res) {
      if (res.data.code == '10000') {
        let result = res.data.response;
        let aListOf = that.data.aListOfExperienceLessons;
        if (result.length > 0 && that.data.pageNumber == 1) {
          that.setData({ aListOfExperienceLessons: result, footerText: '已显示全部', Period: false,})
        }
        if (result.length == 0 && that.data.pageNumber == 1) {
          that.setData({ Period: true, footerText: '', tabLoad: false})
          return false;
        }
        if (that.data.pageNumber !== 1 && result.length > 0) {
          aListOf = aListOf.concat(result);
          that.setData({ aListOfExperienceLessons: aListOf, footerText: '已显示全部', Period: false,})
        }
        if (result.length == 0){
          that.setData({ tabLoad: false, footerText: '已显示全部', Period: false,})
        }

      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    fail(res) {
      that.setData({ tabLoad: false })
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
    }
  })
}
function getBanner(that){
  wx.request({
    url: app.url + '/v1/class/getAllBroadcast',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data:{},
    success(res){
      if(res.data.code == '10000'){
        that.setData({ imgUrls:res.data.response})
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    },
    fail(info){
      wx.showToast({
        title: info.data.msg,
        icon:'none'
      })
    }
  })
}
/*获取最新开课通知*/
function newNotice(that, userId) {
  if (wx.getStorageSync('userInfo').userType) {
    let userType = wx.getStorageSync("userInfo").userType;
    let isOldUser = userType ? userType.substr(1, 1) : "";
    if (isOldUser != '1') {
      return false;
    }
  }
  wx.request({
    url: app.url + '/v1/attend/getNewAttendNotice',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      'userId': userId
    },
    success: function (res) {
      //code=30005时,暂不跳转到注册页面
      if (res.data.code == 10000) {
        var result = res.data.response;
        var NumberNewNotice = result.length;//通知条数
        // console.log('最新开课通知条数：' + NumberNewNotice);
        if (result.length > 0) {
          for (let i in result) {
            result[i].weekDay = '周' + chinanum(result[i].weekDay);
          }
          var resItem = result.shift(); 
          if (resItem.classCoach.length > 4) {
            resItem.classCoach = resItem.classCoach.substr(0, 3) + "...";
          }
          if (resItem.homeName.length > 4) {
            resItem.homeName = resItem.homeName.substr(0, 4) + "...";
          }
          
          that.setData({
            showModalListItem: result,
            showModalList: resItem,
            showModal: true,
            autoplay: false,
            newKaiTong: 1,
            NumberNewNotice: NumberNewNotice //通知条数
          })
        } else {
          that.setData({
            showModal: false
          })
          // console.log("没有新的开课通知")
        }
      }
    },
    fail: function (info) {
      wx.showToast({
        title: '获取最新开课通知失败，请刷新重试',
        icon: 'none',
        duration: 1000
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