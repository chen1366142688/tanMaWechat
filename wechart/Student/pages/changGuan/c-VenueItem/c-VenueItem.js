// pages/changGuan/c-VenueItem/c-VenueItem.js
var util=require('../../../utils/util.js');
const app = getApp().globalData;
const system = wx.getSystemInfoSync()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: app.imgUrl,
    guanKe:false,
    guanJie:true,
    van:'van-ac',
    vans:'',
    homeInfo:null,
    itemList:[],
    homeId:0,
    homeDesc:null,
    itemId:null,
    supportItems:false,
    items: true,
    haveData:true,
    pageNo:1,
    pageSize:16

  },
  kecheng:function(e){
    var val = e.currentTarget.dataset.val;
    var that=this;
    if(val == 1){
      that.setData({
        van:'van-ac',
        vans:'',
        guanKe: false,
        guanJie: true,
        items: true
      })
    }else if(val == 2){
      that.setData({
        van: '',
        vans: 'van-ac',
        guanKe: true,
        guanJie: false,
        items: false
      })
    }
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var vm=this;
    let homeId = options.homeId;
    this.setData({
      homeId: homeId
    })
    homeDetailInfo(vm);
    getHomeDesc(vm);
    getHomeItems(vm);
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
    app.noType();
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

  //选择科目
  itemChoose: function (e) {
    var vm = this;
    let item = e.currentTarget.dataset.id;
    if (item == 9999) {
      item = null;
    }
    this.setData({
      itemId: item,   
      itemList: [] //放置返回数据的数组,设为空  
    })
    getHomeItems(vm);
  },
  toMap:function(e){
    var vm=this;
    let lat=vm.data.homeInfo.latitude;
    let lng = vm.data.homeInfo.longitude;
    let addr = vm.data.homeInfo.addrDetail;
    wx.navigateTo({
      url: '../c-VenueLocation/c-VenueLocation?latitude=' + lat + '&longitude=' + lng +'&address='+addr,
    })
  },
  toClassDetail: function (e) {
    wx.navigateTo({
      url: '../../../pages/keChen/coursedetails/coursedetails?classId=' + e.currentTarget.dataset.classid,
    })
  },
  bindscrolltolower: function (e) {
    var vm = this;
    let pageNo = vm.data.pageNo + 1;
    vm.setData({
      pageNo: pageNo
    })
    var haveData = vm.data.haveData;
    if (haveData) {
      getHomeItems(vm);
    } else {
      // wx.showToast({
      //   title: '没有更多数据了',
      //   icon: 'none',
      //   duration: 1000
      // })
    }
  },
})
function homeDetailInfo(vm){
  var homeId=vm.data.homeId;
  wx.request({
    url: app.url + '/v1/home/get/gymIinfoByHomeId?homeId='+homeId,
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    success: (res) => {
      if (res.data.code == '10000') {
        var data = res.data.response;
        var sup = data.supportItems;
        if(sup.length>0){
          vm.setData({
            supportItems: true
          })
        }
        
        data.homeMainPhoto = data.homeMainPhoto;
        vm.setData({
          homeInfo:data
        })
        
      }
    },
    fail: (info) => {
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon:'none'
      })
    }
  })
};
function getHomeDesc(vm) {
  var homeId = vm.data.homeId;
  wx.request({
    url: app.url + '/v1/home/get/gymDescribeByHomeId?homeId=' + homeId,
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    success: (res) => {
      if (res.data.code == '10000') {
        var data = res.data.response;
        vm.setData({
          homeDesc: data
        })

      }
    },
    fail: (info) => {
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon: 'none'
      })
    }
  })
};
function getHomeItems(vm) {
  var homeId = vm.data.homeId;
  var iteamId=vm.data.itemId;
  var paramsUrl='';
  // if(iteamId){
  //   paramsUrl = '/v1/home/get/classSimpleInfoByHomeIdAndItemId?homeId=' + homeId + '&itemId=' + iteamId
  // }else{
  //   paramsUrl = '/v1/home/get/classSimpleInfoByHomeIdAndItemId?homeId=' + homeId 
  // }
  wx.request({
    url: app.url + '/v1/home/get/classSimpleInfoByHomeIdAndItemId',
    data: {
      "homeId": homeId,
      "itemId": iteamId ? iteamId:0,
      "pageNo": vm.data.pageNo,
      "pageSize": vm.data.pageSize
    },
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    success: (res) => {
      if (res.data.code == '10000') {
        var data = res.data.response;

        if(data && data.length>0){
            for(var i=0;i<data.length;i++){
              if (data[i].itemStudentGrade){
                data[i].itemStudentGrade = util.stringPrefixSet(data[i].itemStudentGrade, ' L');
              }             
            }
            vm.setData({
              scollHeight: 800
            })
            // if (data.length >= 16) {
            //   vm.setData({
            //     scollHeight: 1600
            //   })
            // } else {
            //   vm.setData({
            //     scollHeight: data.length * 210
            //   })
            // }
            let itemList = vm.data.itemList;
            itemList = itemList.concat(data)
            vm.setData({
              itemList: itemList
            })
        }else{
          vm.setData({
            haveData: false
          })
        }
      }
    },
    fail: (info) => {
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon: 'none'
      })
    }
  })
};
