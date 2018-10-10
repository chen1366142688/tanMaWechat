// pages/curriculum/project-Editor/project-Editor.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    classArticle:{
      articleName:'',
      articleContent:''
    },
    tag: true,
    classIndex:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var vm=this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    let classIndex = options.classIndex;
    if(classIndex){
      let classList = prevPage.data.classArticleList;
      let classes = classList[classIndex];
      vm.setData({
        classArticle: classes,
        classIndex: classIndex
      })
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
    app.noType();
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      hotRed: '11'
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
  onShareAppMessage: function () {
  
  },
  articleName:function(e){
      var vm=this;
      // console.log(e);
      let articleName=e.detail.value;
      let articleContent = vm.data.classArticle.articleContent;
      vm.setData({
        classArticle:{
          articleName: articleName,
          articleContent: articleContent
        }
      })
  },
  articleContent:function(e){
    var vm = this;
    // console.log(e);
    let articleContent = e.detail.value;
    let articleName = vm.data.classArticle.articleName;
    vm.setData({
      classArticle: {
        articleName:articleName,
        articleContent: articleContent
      }
    })
  },
  submitSport:function(e){
    var vm=this;
    let articleName = vm.data.classArticle.articleName;
    let articleContent = vm.data.classArticle.articleContent;
    if(!articleName){
      wx.showModal({
        title: '提示',
        content: '请输入项目名称',
        showCancel: false
      })
      return;
    }
    if (!articleContent) {
      wx.showModal({
        title: '提示',
        content: '请输入项目内容',
        showCancel: false
      })
      return;
    }

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    let list=prevPage.data.classArticleList;
    let classArticle = vm.data.classArticle;
    let classIndex = vm.data.classIndex;
    if(classIndex){
      list.splice(classIndex, 1);
    }
    list.push(classArticle);
    prevPage.setData({
      classArticleList: list
    })
    wx.navigateBack({ changed: true });//返回上一页  
  }



})