const app = getApp().globalData;
Page({
  data: {
    userId: "",
    classId: "",
    url: app.imgUrl,
    classDetail: {},
    articleList: [],
    sectionList: [],
    payPrice: 0,
    selectIdList: [],
    remarks: "",
    payInfo: {},
   // orderClashStatus: false,
    homeName: "",
    classTutors: "",
    showModal: false,            //透明黑色遮罩层
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      payInfo: {},
      classId: options.classId,
     // orderClashStatus: false,
      userId: wx.getStorageSync('userInfo').userId
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
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
    queryClassDetail(this);
    queryArticleList(this);
    queryClassSection(this);
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  radioChange: function (e) {
    //debugger
    console.log(e.detail.value);
    //checkSection(this, e.detail.value);
  },
  checkChange: function (e) {
    var sectionId = e.currentTarget.dataset.sectionid;
    console.log(e.currentTarget.dataset.checked);
    checkSection(this, sectionId);
  },
  bindKeyInput: function (e) {
    this.setData({
      remarks: e.detail.value
    })
    //输入表情符号
    /*
  var  isEmFirst =  isEmojiCharacter();
 
  if (isEmFirst){
    console.log('sdfsdafsdfs');
    }
    */
  },
  hideModalcourse: function (e) {
    this.setData({
      showModal: false
    });
    payInfo(this, "0");
  },

  payOrder: function (e) {
    var that = this;
    let payType = e.currentTarget.dataset.paytype;

    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.userType.substr(1, 1) == '0') {
      wx.showModal({
        title: '注册提示',
        content: '只有注册用户才能下单购买课程，是否去注册？',
        cancelText: '取消',
        confirmText: '去注册',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../../pages/register/register'
            })
          } else if (res.cancel) {

          }
        }
      })
      return false;
    } else {
      checkinfo(that, payType);
    }
  }
})


//购买课程
function checkSection(that, sectionId) {

  let tempSection = that.data.sectionList;
  for (let i = 0; i < tempSection.length; i++) {
    if (tempSection[i].sectionId == sectionId) {
      if (tempSection[i].check){       
        tempSection[i].check=false;
        that.setData({
          sectionList: tempSection
        });
        return;
      }else{
        tempSection[i].check = true;
        that.setData({
          sectionList: tempSection
        });
      }    
      let data = {
        studentUserId: that.data.userId,
        weekDay: tempSection[i].weekDay,
        dayTimeStart: tempSection[i].dayTimeStart,
        dayTimeEnd: tempSection[i].dayTimeEnd
      }
      wx.request({
        url: app.url + '/v1/order/getOrderClash',
        header: { 'token': wx.getStorageSync('userInfo').token },
        method: 'GET',
        data: data,
        success: function (res) {
          if (res.data.code == '10000') {
            if (res.data.response > 0) {
              wx.showToast({
                icon: 'none',
                title: '提示：当前选择的时间段和您购买的其他课程时间有冲突！',
                duration: 3000
              })
              tempSection[i].check = false;
              that.setData({
                sectionList: tempSection
              });
            }
          } else {
            wx.showToast({
              title: '后台开小差了',
            })
          }
        },
        fail: function (info) {
          console.log("请求后台失败")
        }
      })  
      return;
    } 
  }
}

function payInfo(that, payType) {
  // if (that.data.orderClashStatus) {
  //   wx.showToast({
  //     icon: 'none',
  //     title: '提示：当前选择的时间点，您已经存在别的课程了！',
  //     duration: 3000
  //   })
  //   return false;
  // }

  if (that.data.payInfo.paySign && that.data.payInfo.paySign.length > 10) {
    if (payType == 1) {
      toPay(that);
    } else {
      updatePayType(that);
    }
    return false;
  }
  let data = {
    classId: that.data.classId,
    payType: payType,
    remarks: that.data.remarks, //下单备注
    sectionIdList: that.data.selectIdList
  };
  wx.request({
    url: app.url + '/v1/order/createOrderClass',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'POST',
    data: data,
    success: function (res) {
      // console.log(res)
      if (res.data.code == '30005') {
        //跳转到首页  
        wx.navigateTo({
          url: "../../../pages/register/register"
        });
        return;
      }

      if (res.data.code == '10000') {
        that.setData({
          payInfo: res.data.response
        })
        if (payType == '1') {
          toPay(that);
        } else {
          wx.redirectTo({
            url: '../paymentsuccessfully/paymentsuccessfully?orderCode=' + that.data.payInfo.orderCode + '&homeName=' + that.data.homeName + '&classTutors=' + that.data.classTutors,
          })
        }
      } else {
        wx.showToast({
          title: '后台开小差了',
        })
      }
    },
    fail: function (info) {
      console.log("请求后台失败")
    }
  })
}


function toPay(that) {
  wx.requestPayment(
    {
      'timeStamp': that.data.payInfo.timeStamp,
      'nonceStr': that.data.payInfo.nonceStr,
      'package': that.data.payInfo.packageValue,
      'signType': that.data.payInfo.signType,
      'paySign': that.data.payInfo.paySign,
      'success': function (res) {
        wx.redirectTo({
          url: '../paymentsuccessfully/paymentsuccessfully?orderCode=' + that.data.payInfo.orderCode + '&homeName=' + that.data.homeName + '&classTutors=' + that.data.classTutors,
        })
      },
      'fail': function (res) {

      },
      'complete': function (res) {

      }
    })
}

function queryClassDetail(that) {
  wx.request({
    url: app.url + '/v1/class/getClassDetail',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      classId: that.data.classId
    },
    success: function (res) {
      // console.log("classdetail"+res)
      if (res.data.code == '10000') {
        let classInfo = res.data.response;
        let classTutorsTemp = classInfo.classTutors;
        let allClassTutors = "";
        if (classTutorsTemp && classTutorsTemp.length > 0) {
          // for (let i = 0; i < classTutorsTemp.length; i++) {
          //   if (classTutorsTemp[i].nickName && classTutorsTemp[i].nickName.length > 2) {
          //     classTutorsTemp[i].nickName = classTutorsTemp[i].nickName.substr(0, 2) + "...";
          //   }
          //   allClassTutors = allClassTutors + classTutorsTemp[i].nickName;
          // }
        }
        that.setData({
          classTutors: allClassTutors
        })
        classInfo.classTutors = classTutorsTemp;
        if (classInfo.homeName.length > 4) {
          //classInfo.homeName = classInfo.homeName.substr(0, 4) + "...";
        }
        that.setData({
          homeName: classInfo.homeName
        })
        //if (classInfo.classCoach.length > 2) {
          //classInfo.classCoach = classInfo.classCoach.substr(0, 2) + "...";
        //}

        that.setData({
          classDetail: classInfo,
          payPrice: (classInfo.courseCost * classInfo.courseCount / 100).toFixed(2)
        })
      } else {
        wx.showToast({
          title: '后台开小差了',
        })
      }
    },
    fail: function (info) {
      console.log("请求后台失败")
    }
  })
}

function queryClassSection(that) {
  wx.request({
    url: app.url + '/v1/class/getClassSectionList',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      classId: that.data.classId
    },
    success: function (res) {
      // console.log("section" + res)
      if (res.data.code == '10000') {
        let tempSection = res.data.response;
        //tempSection[0].check = true;
        for (let temp of tempSection){
           temp.check=false;
        }
        //getOrderClash(that, tempSection[0].weekDay, tempSection[0].dayTimeStart, tempSection[0].dayTimeEnd);
        that.setData({
          //selectSectionId: tempSection[0].sectionId,
          sectionList: tempSection
        })
      } else {
        wx.showToast({
          title: '后台开小差了',
        })
      }
    },
    fail: function (info) {
      console.log("请求后台失败")
    }
  })
}

function updatePayType(that) {
  wx.request({
    url: app.url + '/v1/order/updateOrderPayType',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      orderCode: that.data.payInfo.orderCode,
      payType: '0'
    },
    success: function (res) {
      if (res.data.code == '10000') {
        wx.redirectTo({
          url: '../paymentsuccessfully/paymentsuccessfully?orderCode=' + that.data.payInfo.orderCode + '&homeName=' + that.data.homeName + '&classTutors=' + that.data.classTutors,
        })
      } else {
        wx.showToast({
          title: '后台开小差了',
        })
      }
    },
    fail: function (info) {
      console.log("请求后台失败")
    }
  })
}


function queryArticleList(that) {
  wx.request({
    url: app.url + '/v1/class/getClassArticleInfo',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      classId: that.data.classId
    },
    success: function (res) {
      // console.log("articlelist" + res)
      if (res.data.code == '10000') {
        that.setData({
          articleList: res.data.response
        })
      } else {
        wx.showToast({
          title: '后台开小差了',
        })
      }
    },
    fail: function (info) {
      console.log("请求后台失败")
    }
  })
}


// function getOrderClash(that, weekDay, dayTimeStart, dayTimeEnd) {
//   let data = {
//     studentUserId: that.data.userId,
//     weekDay: weekDay,
//     dayTimeStart: dayTimeStart,
//     dayTimeEnd: dayTimeEnd
//   }
//   wx.request({
//     url: app.url + '/v1/order/getOrderClash',
//     header: { 'token': wx.getStorageSync('userInfo').token },
//     method: 'GET',
//     data: data,
//     success: function (res) {
//       if (res.data.code == '10000') {
//         if (res.data.response > 0) {
//           wx.showToast({
//             icon: 'none',
//             title: '提示：当前选择的时间点，您已经存在别的课程了！',
//             duration: 3000
//           })
//           that.setData({
//             orderClashStatus: true,
//           })
//         } else {
//           that.setData({
//             orderClashStatus: false
//           })
//         }
//       } else {
//         wx.showToast({
//           title: '后台开小差了',
//         })
//       }
//     },
//     fail: function (info) {
//       console.log("请求后台失败")
//     }
//   })
// };
function checkinfo(that, payType) {
  // 
  var selectIdList=[];
  for (let section of that.data.sectionList){
    if (section.check){
      if (payType == '1' && section.signUpOver=='1'){
          wx.showToast({
            icon: 'none',
            title: '已报满的课程时段不能选择，请重新选择！',
            duration: 3000
          })
          return;
        }
        selectIdList.push(section.sectionId);     
       }
  }
  // if (selectIdList.length<=0){
  //   wx.showToast({
  //     title: '请选择课程时段！',
  //     icon: 'none',
  //     duration: 2000
  //   })
  //   return;
  // }
  that.setData({
    selectIdList: selectIdList
  });
  if (payType == "0") {
        that.setData({
          showModal: true
        })
  }else{
    if (that.data.payPrice <= 0){
          wx.showToast({
            title: '课程金额为0元，请选择线下支付！',
            icon: 'none',
            duration: 3000
          })
          return false;
      }
      payInfo(that, payType);
  }

  // wx.request({
  //   url: app.url + '/v1/order/getClassJoinStatusByClassIdAndSection',
  //   header: { 'token': wx.getStorageSync('userInfo').token },
  //   method: 'GET',
  //   data: {
  //     classId: that.data.classId,
  //     sectionId: that.data.selectSectionId
  //   },
  //   success: function (res) {
  //     if (res.data.code == '10000') {
  //       let code = res.data.response;
  //       if (code == '00'|| code=='01') {
  //         if (payType == "0") {
  //           that.setData({
  //             showModal: true
  //           })
  //         } else {
  //           if (code == "01") {
  //               wx.showToast({
  //                 title: '购买人数已满,不能购买',
  //                 icon: 'none',
  //                 duration: 2000
  //               })
  //           } else {
  //             payInfo(that, payType);
  //           }
  //         }
  //       } else {
  //         // 01购买人数已满不能购买，02该课程已下架，03该课程已删除，04已购买该课程
  //         // if(code == '01'){
  //         //   wx.showToast({
  //         //     title: '购买人数已满,不能购买',
  //         //     icon: 'none',
  //         //     duration: 2000
  //         //   })
  //         // }
  //         if (code == '02') {
  //           wx.showToast({
  //             title: '该课程已下架',
  //             icon: 'none',
  //             duration: 2000
  //           })
  //         }
  //         if (code == '03') {
  //           wx.showToast({
  //             title: '该课程已删除',
  //             icon: 'none',
  //             duration: 2000
  //           })
  //         }
  //         if (code == '04') {
  //           wx.showModal({
  //             title: '提示',
  //             content: '已购买该课程,不能重复购买！',
  //           })
  //         }

  //         // that.setData({
  //         //   showModal: true
  //         // })
  //       }
  //     } else {
  //       wx.showToast({
  //         title: '后台开小差了',
  //       })
  //     }
  //   },
  //   fail: function (info) {
  //     console.log("请求后台失败")
  //   }
  // })

}

/*
emoj 表情图片过滤 
js判断文本中是否有emoji表情
*/
/*
function isEmojiCharacter(substring) {
  var length;
  for (var i = 0; i < substring.length; i++) {
    var hs = substring.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (substring.length > 1) {
      var ls = substring.charCodeAt(i + 1);
      if (ls == 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2B05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
        || hs == 0x2b50) {
        return true;
      }
    }
  }
} 
*/