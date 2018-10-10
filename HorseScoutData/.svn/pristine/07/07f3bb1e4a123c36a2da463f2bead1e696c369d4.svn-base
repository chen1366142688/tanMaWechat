// pages/Information/Selection-school/Selection-school.js
const app = getApp().globalData
Page({
  data: {
    imgUrl: app.url,
    array:['幼儿园','小学','初中','高中'],
    index:0,
    schoolName:'',
    schoolList:[],
    value:''
  },
  bindPickerChange(e){
    this.setData({index:e.detail.value})
    wx.setStorageSync('seceltSchoolTypeStatus', true)
    wx.setStorageSync('seceltSchoolType', e.detail.value)
    const that = this;
    let schoolName = that.data.schoolName || '';
    let index = e.detail.value;
    let schoolType = index == 0 ? 1 : index == 1 ? 2 : index == 2 ? 3 : 4;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  //上一个页面
    let info = prevPage.data //取上页data里的数据也可以修改
    let cityId = info.activecityId;
    searchSchool(that, cityId, schoolName, schoolType)
  },
  inputSchool(e){
    this.setData({ schoolName: e.detail.value})
  },
  searchSchool(e){
    const that = this;
    let schoolName = that.data.schoolName;
    let index = that.data.index;
    let schoolType = index == 0 ? 1 : index == 1 ? 2 : index == 2 ? 3 : 4;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  //上一个页面
    let info = prevPage.data //取上页data里的数据也可以修改
    let cityId = info.activecityId;
    searchSchool(that, cityId, schoolName, schoolType)
  },
  selectedSchool(e){
    let school = e.currentTarget.dataset.school;
    let schoolId = e.currentTarget.dataset.schoolid;
    wx.setStorageSync('schoolName', school)
    wx.setStorageSync('schoolId', schoolId)
    wx.navigateBack({
      delta:1
    })
  },
  onLoad: function (options) {
    console.log(options)
    //this.setData({value: options.value || ''})
  },
  onReady: function () {},
  onShow: function () {
    const that = this;
    let schoolName = that.data.schoolName || '';
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  //上一个页面
    let info = prevPage.data //取上页data里的数据也可以修改
    let cityId = info.activecityId;
    let index = info.index2;
    that.setData({index:index})
    let schoolType = index == 0 ? 1 : index == 1 ? 2 : index == 2 ? 3 : 4;
    searchSchool(that, cityId, schoolName, schoolType)
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})
function searchSchool(that, cityId, schoolName, schoolType){
  wx.request({
    url: app.rQUrl + '/v1/school/getSchoolSingleInfoList',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token || '1' },
    data: {
      'cityId': cityId,
      'schoolName': schoolName,
      'schoolType': schoolType,
    },
    success(res){
      if(res.data.code == '10000'){
        if(res.data.response.length == 0){
          wx.showToast({
            title: '此搜索条件没有对应的学校',
            icon:'none',
            duration:2000,
            mask:true
          })
        }else{
          that.setData({ schoolList: res.data.response})
        }
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
        icono:'none'
      })
    }
  })
}