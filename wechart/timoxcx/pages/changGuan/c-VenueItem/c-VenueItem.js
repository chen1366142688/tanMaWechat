// pages/changGuan/c-VenueItem/c-VenueItem.js
var util=require('../../../utils/util.js');
const app = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    guanKe:false,
    guanJie:true,
    van:'van-ac',
    vans:'',
    homeInfo:null,
    itemList:[],
    homeId:0,
    homeDesc:null,
    itemId:null,
    supportItems:false

  },
  kecheng:function(e){
    var val = e.currentTarget.dataset.val;
    // console.log(val)
    var that=this;
    if(val == 1){
      // console.log(1110)
      that.setData({
        van:'van-ac',
        vans:'',
        guanKe: false,
        guanJie: true,
      })
    }else if(val == 2){
      // console.log(222)
      that.setData({
        van: '',
        vans: 'van-ac',
        guanKe: true,
        guanJie: false,
      })
    }
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var vm=this;
    let homeId = options.homeId;
    // console.log(params)
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
  //选择科目
  itemChoose: function (e) {
    var vm = this;
    //  console.log(e);
    let item = e.currentTarget.dataset.id;
    // console.log(item);
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
  }
})
function homeDetailInfo(vm){
  var homeId=vm.data.homeId;
  wx.request({
    url: app.url + '/v1/home/get/gymIinfoByHomeId?homeId='+homeId,
    method: 'GET',
    success: (res) => {
      // console.log(res)
      if (res.data.code == '10000') {
        // console.log(res.data.response);
        var data = res.data.response;
        var sup = data.supportItems;
        if(sup.length>0){
          vm.setData({
            supportItems: true
          })
        }
        vm.setData({
          homeInfo:data
        }) 
        
      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
};
function getHomeDesc(vm) {
  var homeId = vm.data.homeId;
  wx.request({
    url: app.url + '/v1/home/get/gymDescribeByHomeId?homeId=' + homeId,
    method: 'GET',
    success: (res) => {
      // console.log(res)
      if (res.data.code == '10000') {
        // console.log(res.data.response);
        var data = res.data.response;
        vm.setData({
          homeDesc: data
        })

      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
};
function getHomeItems(vm) {
  var homeId = vm.data.homeId;
  var iteamId=vm.data.itemId;
  // console.log(vm.data)
  var paramsUrl='';
  if(iteamId){
    paramsUrl = '/v1/home/get/classSimpleInfoByHomeIdAndItemId?homeId=' + homeId + '&itemId=' + iteamId
  }else{
    paramsUrl = '/v1/home/get/classSimpleInfoByHomeIdAndItemId?homeId=' + homeId 
  }
  // console.log(homeId)
  wx.request({
    url: app.url + paramsUrl,
    method: 'GET',
    success: (res) => {
      // console.log(res)
      if (res.data.code == '10000') {
        // console.log(res.data.response);
        var data = res.data.response;

        if(data){
            for(var i=0;i<data.length;i++){              
              data[i].itemStudentGrade = util.stringPrefixSet(data[i].itemStudentGrade,'L');
            }
        }
        vm.setData({
          itemList: data
        })

      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
};
