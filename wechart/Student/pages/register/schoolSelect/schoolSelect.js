// pages/register/Select/Select.js
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityId:"",
    schoolName:"",
    schoolList:[],
    schoolId:"",
    information:'',
    options:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({options:options})
    if (options.cityId != undefined && options.cityId != ""){
      this.setData({ 
        cityId: options.cityId,
      });
    }
    if (options.information){
      this.setData({ information:1})
    }
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
//bindInput
  inputSchoolName:function (e){
      this.setData({
        schoolName: e.detail.value
      });
  },
 //键盘点击搜索
  confirmSchoolName: function (e) {
    getSchoolList(this);
  },
  //查询按钮
 keywordSearch:function(e){
   getSchoolList(this);
 },
 //选择
 chooseSchool:function(e){
   var that=this;
   var index = e.currentTarget.dataset.index;
   if (this.data.information !==1){
     
     let pages = getCurrentPages();//当前页面
     let prevPage = pages[pages.length - 2];//上一页面
     prevPage.setData({//直接给上移页面赋值
       schoolName: this.data.schoolList[index].schoolName,
       studentSchoolId: this.data.schoolList[index].schoolId
     });
     wx.navigateBack(1);
   }else{
     //提交学校明天从这里开始改
     var wxCurrPage = getCurrentPages();//获取当前页面的页面栈
     var wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
     var userId = wxPrevPage.data.userInfo.userId;
     var studentType = wxPrevPage.data.userInfo.studentType;
     var studentSchoolId=that.data.schoolList[index].schoolId
     wx.request({
       url: app.url + '/v1/student/updateStudentSchoolNoByUserId',
       header: { 'token': wx.getStorageSync('userInfo').token },
       data: {
         'userId': userId,
         'schoolNo': studentSchoolId
       },
       success: function (res) {
         if (res.data.code == '10000') {
           wx.navigateBack(1);
         }
       }
     })
   }
   
},
//提交当前选中的学校
 subName: function (e) {
   var that = this;
   var userId = this.data.userId;
   var name = this.data.name;
   var studentType = this.data.studentType;
   if (this.data.mike == '1') {
     wx.request({
       url: app.url + '/v1/student/update/studentNickNameByUserId',
       header: { 'token': wx.getStorageSync('userInfo').token },
       data: {
         'userId': userId,
         'nikeName': name
       },
       success: function (res) {
         if (res.data.code == '10000') {
           wx.redirectTo({
             url: '../../../pages/my/myEditor-Personal/myEditor-Personal?userId=' + userId + '&studentType=' + studentType,
           })
         }
       }
     })
   } else {
     wx.request({
       url: app.url + '/v1/student/update/studentRealNameByUserId',
       header: { 'token': wx.getStorageSync('userInfo').token },
       data: {
         'userId': userId,
         'realName': name
       },
       success: function (res) {
         if (res.data.code == '10000') {
           wx.redirectTo({
             url: '../../../pages/my/myEditor-Personal/myEditor-Personal?userId=' + userId + '&studentType=' + studentType,
           })
         }
       }
     })
   }

 },

})




//查询
function getSchoolList(vm){
  if (vm.data.schoolName==""){
    wx.showToast({
      title: '请输入学校关键字',
      icon: 'none'
    });
    return false;
  }
  var data={
    cityId: vm.data.cityId,
    schoolName: vm.data.schoolName
  }
  wx.request({
    url: app.url + '/v1/school/getSchoolList',
    method: 'GET',
    data: data,
    success: function (res) {
      var result = res.data;
      if (result.code=10000){
        if (result.response.length==0){
            vm.setData({
              schoolList:[]
            });
            wx.showToast({
              title: '未搜索到相关学校！',
              icon: 'none'
            });
            return false;
          }
          vm.setData({
            schoolList: result.response
          });
      }else{
        wx.showModal({
          title: '提示',
          content: result.msg,
        })
      }
        
    },
    fail: function (info) {
      wx.showModal({
        title: '提示',
        content: '后台开小差了',
      });
    }
  })
}