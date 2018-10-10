// pages/changGuan/c-VenueCollection/c-VenueCollection.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.imgUrl,
    collection:[],
      uid:'1',
      pageNum:1,
      theNumber:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    store(that,that.data.uid, that.data.pageNum, that.data.theNumber)
  },
  //判断元素否被选中
  checkboxChange:function(e){
    var that=this;
    console.log(e)
    console.log(e.detail.value.length)
    console.log(e.currentTarget.dataset.id)
    let ecections = this.data.collection
    var v = ecections.length;
    let len = e.detail.value.length;
    let id = e.currentTarget.dataset.id;
    if(len>0){
      console.log("this is add action")
      while(v--){
        if (ecections[v].storeId == id) { 
          ecections[v].remindType =1;
          that.setData({
            collection: ecections
          })
        } 
      }
      modify(id, 1)
    }else{
      console.log("this is cancel")
      while (v--) {
        if (ecections[v].storeId == id) {
          ecections[v].remindType = 0;
          that.setData({
            collection: ecections
          })
        }
      }
      modify(id, 0)
    }
  },
  //删除收藏
  deleteStore:function (e){
    var that=this;
    console.log(e.currentTarget.dataset.storeid)
    var storeid = e.currentTarget.dataset.storeid;
    var ecetion = this.data.collection;
    var x=ecetion.length;
    wx.showModal({
      title: '提示',
      content: '确定删除收藏吗',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: 'http://192.168.3.4:8081/v1/studentStore/deleteStoreByStoreId',
            method: 'GET',
            data: {
              'storeId': storeid
            },
            success: (res) => {
              if (res.data.code == '10000') {
                for (var i = 0; i < x; i++) {
                  ecetion[i].storeId == storeid ? ecetion.splice(i, 1) : console.log(11222)
                }
                that.setData({
                  collection: ecetion
                })
                wx.showToast({
                  title: '删除成功',
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //改变收藏状态
  modifyStatus:function(e){},
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
  
  }
})
//获取学员收藏列表信息
function store(that,uid,pageNum,theNumber){
  wx.request({
    url: 'http://192.168.3.4:8081/v1/studentStore/getStudentStoreList',
    method:'GET',
    data:{
      'userId':uid,
      'pageNumber':pageNum,
      'theNumber':theNumber
    },
    success:(res)=>{
      console.log("下面学员收藏信息")
      console.log(res)
      if(res.data.code=='10000'){
        var result = res.data.response;
        that.setData({
          collection:result
        })
      }
    },
    fail:(info)=>{
      console.log(info)
    }
  })
}
function modify(storeId, remindType){
  wx.request({
    url: 'http://192.168.3.4:8081/v1/studentStore/updateStoreRemindType',
    method:'GET',
    data:{
      'storeId': storeId,
      'remindType': remindType
    },
    success:function(res){
      console.log(res)
    },
    fail:function(info){
      console.log(info)
    }
  })
}
