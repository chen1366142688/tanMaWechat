// pages/changGuan/c-Venuescreen/c-Venuescreen.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkted:'',
    checkted1:'',
    Existing :[],
    orderState:[
      { name: '00', value: '已下单，待教练确认', classId: '00',checked: true},
      { name: '01', value: '已下单，待学员付款', classId: '01',checked: true},
      { name: '02', value: '已付款,课程进行中', classId: '02',checked: true,},
      { name: '03', value: '课程已结束', classId: '03',checked: true},
      { name: '04', value: '申请退款中', classId: '04'},
      { name: '05', value: '已退款完成', classId: '05'},
      { name: '06', value: '申请暂停中', classId: '06'},
      { name: '07', value: '课程暂停中', classId: '07'},
    ],
    vanue:[],
    userId:'1',
    pageNum:'1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    console.log(options)
    _this.setData({
      userId:options.userId,
      pageNum:options.pageNum
    })
    already(_this,_this.data.userId)
    vanue(_this, _this.data.userId)
  },
  /*点击选中和取消*/
  checkboxChange:function(e){
    var that = this;
    var arrList = e.detail.value;
    console.log(arrList)
    var arr = new Array();
    var check = new Array();
    var exting = that.data.Existing;
    for (let i in exting) {
      arr.push(exting[i].classId);
      check.push(exting[i].checked)
    }
    arrList = arrList.map(Number)
    arr = arr.map((arr) => {
      return parseInt(arr);
    })
    for (var v = 0, attrs = [], len = check.length; v < len; v++) {
      if (check[v] == true) {
        attrs.push(check[v])
      } else {
      }
    }
    if (arrList.length < attrs.length) {
      console.log("这是在减少")
      //取出不同的值
      let difference = arrList
        .filter(x => arr.indexOf(x) == -1)
        .concat(arr.filter(x => arrList.indexOf(x) == -1));
      for (let i in exting) {
        for (let x in difference) {
          if (exting[i].classId == difference[x]) {
            exting[i].checked = false;
            that.setData({
              Existing: exting
            })
          }
        }

      }
    } else {
      console.log("这是在增加")
      for (let i in exting) {//还没开始写逻辑
        for (let x in arrList) {
          console.log(arrList[x])
          if (exting[i].classId == arrList[x]) {
            exting[i].checked = true;
            that.setData({
              Existing: exting
            })
          }
        }

      }
    }
    
  },
  checkboxChange2: function (e) {
    var that = this;
    var arrList = e.detail.value;
    var arr = new Array();
    var check = new Array();
    var exting = that.data.orderState;
    for (let i in exting) {
      arr.push(exting[i].classId);
      check.push(exting[i].checked)
    }
    arrList = arrList.map(Number)
    arr = arr.map((arr) => {
      return parseInt(arr);
    })
    for(var v=0,attrs=[],len=check.length;v<len;v++){
      if(check[v] == true){
        attrs.push(check[v])
      }else{
      }
    }
    if (arrList.length < attrs.length) {
      console.log("这是在减少")
      //取出不同的值
      let difference = arrList
        .filter(x => arr.indexOf(x) == -1)
        .concat(arr.filter(x => arrList.indexOf(x) == -1));
      for (let i in exting) {
        for (let x in difference) {
          if (exting[i].classId == difference[x]) {
            exting[i].checked = false;
            that.setData({
              orderState: exting
            })
          }
        }

      }
    } else {
      console.log("这是在增加")
      for (let i in exting) {//还没开始写逻辑
        for (let x in arrList) {
          if (exting[i].classId == arrList[x]) {
            exting[i].checked = true;
            that.setData({
              orderState: exting
            })
          }
        }

      }
    }

  },
  checkboxChange3: function (e) {
    var that = this;
    var arrList = e.detail.value;
    var arr = new Array();
    var check = new Array();
    var exting = that.data.vanue;
    for (let i in exting) {
      arr.push(exting[i].homeId);
      check.push(exting[i].checked)
    }
    arrList = arrList.map(Number)
    arr = arr.map((arr) => {
      return parseInt(arr);
    })
    for (var v = 0, attrs = [], len = check.length; v < len; v++) {
      if (check[v] == true) {
        attrs.push(check[v])
      } else {
      }
    }
    if (arrList.length < attrs.length) {
      console.log("这是在减少")
      //取出不同的值
      let difference = arrList
        .filter(x => arr.indexOf(x) == -1)
        .concat(arr.filter(x => arrList.indexOf(x) == -1));
      for (let i in exting) {
        for (let x in difference) {
          if (exting[i].homeId == difference[x]) {
            exting[i].checked = false;
            that.setData({
              vanue: exting
            })
          }
        }

      }
    } else {
      console.log("这是在增加")
      for (let i in exting) {
        for (let x in arrList) {
          if (exting[i].homeId == arrList[x]) {
            exting[i].checked = true;
            that.setData({
              vanue: exting
            })
          }
        }

      }
    }

  },
  //获取学员状态管理
  studentState:function(e){
    var that=this;
    console.log("what")
    let ex=that.data.Existing; 
    let exArr=new Array();
    let state= that.data.orderState;
    let staArr=new Array();
    let van= that.data.vanue;
    let vanArr=new Array();
    let num=that.data.pageNum;
    let userId=that.data.userId;
    for(let i=0;i<ex.length;i++){
      if(ex[i].checked==true){
        exArr.push(ex[i].classId);
      } 
    }
    console.log(exArr)
    for (let i = 0; i < state.length; i++) {
      if (state[i].checked == true) {
        staArr.push(state[i].classId);
      }
    }
    console.log(staArr)
    for (let i = 0; i < van.length; i++) {
      if (van[i].checked == true) {
        vanArr.push(van[i].homeId);
      }
    }
     console.log(vanArr)
    wx.request({
      url: 'http://192.168.3.4:8081/v1/order/getOrderForStudentList',
      method: 'POST',
      data: {
        "classIds": exArr,
        "homeIds": vanArr,
        "orderStatuss": staArr,
        "pageNumber": num,
        "theNumber": 10,
        "userId": userId
      },
      success: (res) => {
        if(res.data.code=='10000'){
          wx.setStorageSync('sortResult', res.data.response);
          wx.redirectTo({
            url: '../../../pages/changGuan/c-VenueOrder/c-VenueOrder?sortOk=ok&num='+num,
          })
        }
      },
      fail: (info) => {
        console.log("请求失败了")
      }
    })
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
  
  }
})
//获取学员已有课程
function already(_this,userId){
  wx.request({
    url: 'http://192.168.3.4:8081/v1/order/getOrderClassList',
    method:'GET',
    data:{
      userId:userId
    },
    success:(res)=>{
      console.log(res.data)
      if(res.data.code == '10000'){
        for(var i=0;i<res.data.response.length;i++){
          res.data.response[i].checked=true;
        }
        _this.setData({
          Existing: res.data.response
        })
      }
    },
    fial:(info)=>{
      console.log("后台报错了"+info)
    }
  })
} 
//获取学员所在场馆
function vanue(_this, userId) {
  wx.request({
    url: 'http://192.168.3.4:8081/v1/order/getOrderHomeList',
    method: 'GET',
    data: {
      userId: userId
    },
    success: (res) => {
      console.log(res.data)
      if (res.data.code == '10000') {
        for (var i = 0; i < res.data.response.length; i++) {
          res.data.response[i].checked = true;
        }
        _this.setData({
          vanue: res.data.response
        })
      }
    },
    fial: (info) => {
      console.log("后台报错了" + info)
    }
  })
} 

