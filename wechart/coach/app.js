//app.js
var JMessage = require('./utils/jmessage-wxapplet-sdk-1.4.0.min.js');
const jim = new JMessage({
  debug: false
});

if (!wx.canIUse('getUpdateManager')) {
  wx.showModal({
    title: '提示',
    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
  })
}
const updateManager = wx.getUpdateManager()

updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调
  // console.log(res.hasUpdate)
})

updateManager.onUpdateReady(function () {
  wx.showModal({
    title: '更新提示',
    content: '新版本已经准备好，点击重启应用？',
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      } else if (res.cancel) {
        updateManager.applyUpdate()
      }
    }
  })

})

updateManager.onUpdateFailed(function () {
  // 新的版本下载失败
  wx.showModal({
    title: '下载提示',
    content: '新版本下载失败，请手动删除本地小程序重新下载',
  })
})
wx.setStorageSync('locations', {
  result: {
    location: { "lat": 30.64242, "lng": 104.04311 },
    address: "四川省成都市武侯区益州大道中段移动互联大厦1800号",
    address_component: {
      nation: '中国',
      province: '四川省',
      city: '成都市',
      district: '武侯区',
      street: '益州大道中段',
      street_number: '益州大道中段移动互联大厦1800号'
    }
  }
})
App({
  onLaunch: function () {
    let that = this;
    wx.onNetworkStatusChange(function (res) {
      if (res.networkType == 'none') {
        wx.reLaunch({
          url: '../../../pages/welcome/welcomeNo/welcomeNo',
        })
      }
    })
    auth(this);
    //启动缓存清理
    nativeSaveManage();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    getLocations();
    getItemList(this);
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userLocation']) {
        }
      }
    });

  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      // wx.login({
      //   success: function () {
      //     wx.getUserInfo({
      //       success: function (res) {
      //         that.globalData.userInfo = res.userInfo
      //         typeof cb == "function" && cb(that.globalData.userInfo)
      //       }
      //     })
      //   }
      // })
    }
  },
  globalData: {
    userInfo: null,
    //***************开发环境******************* */
    //  url: 'http://192.168.3.18:8081', //局域网开发环境


    //***************测试环境******************* */
      url: 'https://timosports.cn/gateway', 
      htmlUrl: 'https://timosports.cn/static/html/page',

    //***************正式环境******************* */
    // url: 'https://www.timosports.cn/gateway',
    // htmlUrl: 'https://www.timosports.cn/static/html/page',


    //***************静态资源******************* */
    imgUrl: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/',
    getLocations: null,
    jim: jim,
    chatPageObject: null,
    defaultLocation: wx.getStorageSync('locations'),
    chatListPageObject: null,
    loginIm: function () {
      let that = this;
      if (wx.getStorageSync('IM_INIT_AUTH').appkey) {
        if (!jim.isInit() || !jim.isConnect()) {
          jim.init({
            "appkey": wx.getStorageSync('IM_INIT_AUTH').appkey,
            "random_str": wx.getStorageSync('IM_INIT_AUTH').randomStr,
            "signature": wx.getStorageSync('IM_INIT_AUTH').signature,
            "timestamp": wx.getStorageSync('IM_INIT_AUTH').timestamp
          }).onSuccess(function (data) {
          }).onFail(function (data) {
          });
        }
        console.log("jim.isLogin()");
        console.log(jim.isLogin());
        if (jim.isInit() && jim.isConnect() && !jim.isLogin()) {
          if (wx.getStorageSync('IM_USER_PASSWORD') && wx.getStorageSync('IM_USER_PASSWORD').passWord) {
            console.log("jim.isLogin(IM_USER_PASSWORD)");
            jim.login({
              'username': wx.getStorageSync('IM_USER_PASSWORD').userName,
              'password': wx.getStorageSync('IM_USER_PASSWORD').passWord
            }).onSuccess(function (suRes) {
              console.log("jim.isLogin(IM_USER_PASSWORD)");
              console.log(jim.isLogin());
              //查询回话列表 计算当前未读数量
              jim.getConversation().onSuccess(function (data) {
                if (data.message == 'success' && data.conversations) {
                  let allCount = 0
                  for (let i = 0; i < data.conversations.length; i++) {
                    let conver = data.conversations[i];
                    if (wx.getStorageSync('IM_COUNT_' + conver.username) && wx.getStorageSync('IM_COUNT_' + conver.username) != "" && wx.getStorageSync('IM_COUNT_' + conver.username) > 0) {
                      if (wx.getStorageSync('IM_COUNT_' + conver.username) > conver.unread_msg_count) {
                        allCount = allCount + wx.getStorageSync('IM_COUNT_' + conver.username);
                      } else {
                        allCount = allCount + data.conversations[i].unread_msg_count;
                      }
                    } else {
                      allCount = allCount + data.conversations[i].unread_msg_count;
                    }
                  }
                  //当前总未读数量
                  wx.setStorageSync('IM_COUNT', allCount);
                }
              }).onFail(function (data) {

              });
            }).onFail(function (data) {

            });
          } else {
            //获取JPUSH账号密码
            wx.request({
              url: that.url + '/v1/login/jpush/pwd',
              data: {
                userId: wx.getStorageSync("userInfo").userId,
                appType: '2'
              },
              success: function (res) {
                if (res.data.code == '10000') {
                  var results = res.data.response;
                  //本地缓存 JPUSH账号密码
                  wx.setStorageSync('IM_USER_PASSWORD', results);
                  if (jim.isConnect()) {
                    //登录JPUSH
                    jim.login({
                      'username': results.userName,
                      'password': results.passWord
                    }).onSuccess(function (suRes) {
                      //查询回话列表 计算当前未读数量
                      jim.getConversation().onSuccess(function (data) {
                        if (data.message == 'success' && data.conversations) {
                          let allCount = 0
                          for (let i = 0; i < data.conversations.length; i++) {
                            let conver = data.conversations[i];
                            if (wx.getStorageSync('IM_COUNT_' + conver.username) && wx.getStorageSync('IM_COUNT_' + conver.username) != "" && wx.getStorageSync('IM_COUNT_' + conver.username) > 0) {
                              if (wx.getStorageSync('IM_COUNT_' + conver.username) > conver.unread_msg_count) {
                                allCount = allCount + wx.getStorageSync('IM_COUNT_' + conver.username);
                              } else {
                                allCount = allCount + data.conversations[i].unread_msg_count;
                              }
                            } else {
                              allCount = allCount + data.conversations[i].unread_msg_count;
                            }
                          }
                          //当前总未读数量
                          wx.setStorageSync('IM_COUNT', allCount);
                        }
                      }).onFail(function (data) {

                      });
                    }).onFail(function (data) {

                    });
                  }
                }
              },
              fail: (info) => {
                console.log("后台错误,I don`t kwon")
              }
            })
          }
        }
      }
    },
    noType: function () {
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
    getTotlCount: function () {
      setTimeout(function () {
        if (wx.getStorageSync('IM_COUNT') && wx.getStorageSync('IM_COUNT') * 1 > 0) {
          wx.setTabBarBadge({
            index: 2,
            text: (wx.getStorageSync('IM_COUNT') * 1) + ""
          })
        } else {
          wx.removeTabBarBadge({
            index: 2
          })
        }
      }, 500);
    },
    loginInitIM: function () {
      let that = this;
      if (!jim.isInit()) {
        wx.request({
          url: that.globalData.url + '/v1/login/jpush/auth',
          success: function (res) {
            if (res.data.code == '10000') {
              wx.setStorageSync('IM_INIT_AUTH', res.data.response)
              var result = res.data.response;
              jim.init({
                "appkey": result.appkey,
                "random_str": result.randomStr,
                "signature": result.signature,
                "timestamp": result.timestamp
              }).onSuccess(function (data) {
                //获取JPUSH账号密码
                wx.request({
                  url: that.url + '/v1/login/jpush/pwd',
                  data: {
                    userId: wx.getStorageSync("userInfo").userId,
                    appType: '2'
                  },
                  success: function (res) {
                    if (res.data.code == '10000') {
                      var results = res.data.response;
                      //本地缓存 JPUSH账号密码
                      wx.setStorageSync('IM_USER_PASSWORD', results);
                      //登录JPUSH
                      jim.login({
                        'username': results.userName,
                        'password': results.passWord
                      }).onSuccess(function (suRes) {
                        //查询回话列表 计算当前未读数量
                        jim.getConversation().onSuccess(function (data) {
                          if (data.message == 'success' && data.conversations) {
                            let allCount = 0
                            for (let i = 0; i < data.conversations.length; i++) {
                              let conver = data.conversations[i];
                              if (wx.getStorageSync('IM_COUNT_' + conver.username) && wx.getStorageSync('IM_COUNT_' + conver.username) != "" && wx.getStorageSync('IM_COUNT_' + conver.username) > 0) {
                                if (wx.getStorageSync('IM_COUNT_' + conver.username) > conver.unread_msg_count) {
                                  allCount = allCount + wx.getStorageSync('IM_COUNT_' + conver.username);
                                } else {
                                  allCount = allCount + data.conversations[i].unread_msg_count;
                                }
                              } else {
                                allCount = allCount + data.conversations[i].unread_msg_count;
                              }
                            }
                            //当前总未读数量
                            wx.setStorageSync('IM_COUNT', allCount);
                          }
                        }).onFail(function (data) {

                        });
                      }).onFail(function (data) {

                      });
                    }
                  },
                  fail: (info) => {
                    console.log("后台错误,I don`t kwon")
                  }
                })
              }).onFail(function (data) {
              });
            }
          }
        });
      } else {
        //获取JPUSH账号密码
        wx.request({
          url: that.url + '/v1/login/jpush/pwd',
          data: {
            userId: wx.getStorageSync("userInfo").userId,
            appType: '2'
          },
          success: function (res) {
            if (res.data.code == '10000') {
              var results = res.data.response;
              //本地缓存 JPUSH账号密码
              wx.setStorageSync('IM_USER_PASSWORD', results);
              //登录JPUSH
              jim.login({
                'username': results.userName,
                'password': results.passWord
              }).onSuccess(function (suRes) {
                //查询回话列表 计算当前未读数量
                jim.getConversation().onSuccess(function (data) {
                  if (data.message == 'success' && data.conversations) {
                    let allCount = 0
                    for (let i = 0; i < data.conversations.length; i++) {
                      let conver = data.conversations[i];
                      if (wx.getStorageSync('IM_COUNT_' + conver.username) && wx.getStorageSync('IM_COUNT_' + conver.username) != "" && wx.getStorageSync('IM_COUNT_' + conver.username) > 0) {
                        if (wx.getStorageSync('IM_COUNT_' + conver.username) > conver.unread_msg_count) {
                          allCount = allCount + wx.getStorageSync('IM_COUNT_' + conver.username);
                        } else {
                          allCount = allCount + data.conversations[i].unread_msg_count;
                        }
                      } else {
                        allCount = allCount + data.conversations[i].unread_msg_count;
                      }
                    }
                    //当前总未读数量
                    wx.setStorageSync('IM_COUNT', allCount);
                  }
                }).onFail(function (data) {

                });
              }).onFail(function (data) {

              });
            }
          },
          fail: (info) => {
            console.log("后台错误,I don`t kwon")
          }
        })
      }
    }
  }
})
function login(str, num, that) {
  wx.request({
    url: that.globalData.url + '/v1/login/wechart/getUserInfo',
    data: {
      code: str,
      appType: '2'
    },
    success: (res) => {
      if (res.data.code == '10000') {
        var result = res.data.response;
        if (result) {
          wx.setStorageSync('userInfo', result);
          //判断是否是新用户
          var isNewUser = result.userType.substr(2, 1);
          //如果第三位数字等于1说明是教练用户，获取用户账号密码
          if (isNewUser == '1') {
            // that.globalData.loginInitIM();
            getCoachBaseInfo(that);
          } else {
            console.log(result.userType)
          }
        }
      }
    },
    fail: (info) => {
      console.log(info)
    }
  })
}
function getCoachBaseInfo(vm) {
  wx.request({
    url: vm.globalData.url + '/v1/coach/getCoachStorageInfoByUserId',
    data: {
      "userId": wx.getStorageSync("userInfo").userId
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      if (res.data.code == '10000') {
        var data = res.data.response;
        wx.setStorageSync('coachBaseInfo', data)
        vm.globalData.loginInitIM();
      }
    },
    fail: (info) => {
      console.log("请求失败了");
    }
  })
}
//location
function getLocations() {
  var QQMapWX = require('utils/qqmap-wx-jssdk.min.js');
  var qqmapsdk;
  // 实例化API核心类
  qqmapsdk = new QQMapWX({
    key: 'BX6BZ-ZDEWF-EQVJ3-JPL6W-BPU6Q-4PFHB'
  });
  wx.getLocation({
    type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    success: function (res) {
      var latitude = res.latitude
      var longitude = res.longitude
      // 调用接口
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function (res) {
          wx.setStorageSync('location', res)
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }
  })

};
function getItemList(that) {
  wx.request({
    url: that.globalData.url + '/v1/item/getItemList',
    method: 'GET',
    data: {},
    success: function (res) {
      if (res.data.code == '10000') {
        wx.setStorageSync('classList', res.data.response)
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





/***********************************IM相关***********************************/
//启动后 认证当前程序
function auth(that) {
  wx.request({
    url: that.globalData.url + '/v1/login/jpush/auth',
    success: function (res) {
      if (res.data.code == '10000') {
        wx.setStorageSync('IM_INIT_AUTH', res.data.response)
        var result = res.data.response;
        jim.init({
          "appkey": result.appkey,
          "random_str": result.randomStr,
          "signature": result.signature,
          "timestamp": result.timestamp
        }).onSuccess(function (data) {
        }).onFail(function (data) {
        });
      }
    }
  });
  //收到及时消息
  jim.onMsgReceive(function (data) {
    for (let i = 0; i < data.messages.length; i++) {
      let imUserName = data.messages[i].content.from_name;
      let imContent = data.messages[i].content.msg_body.text;
      let date = new Date(data.messages[i].content.create_time);
      let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
      let messageDate = date.getFullYear() + "-" + month + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
      nativeSaveMessage(imUserName, imContent, messageDate, that, date);
    }
  });
  jim.onDisconnect(function (data) {
    console.log('======================')
  });
  //收到离线消息
  jim.onSyncConversation(function (data) {
    for (let j = 0; j < data.length; j++) {
      for (let i = 0; i < data[j].msgs.length; i++) {
        let imUserName = data[j].msgs[i].content.from_name;
        let imContent = data[j].msgs[i].content.msg_body.text;
        let date = new Date(data[j].msgs[i].content.create_time);
        let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        let messageDate = date.getFullYear() + "-" + month + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
        nativeSaveMessage(imUserName, imContent, messageDate, that, date);
      }
    }
  });
}



//本地消息存储
function nativeSaveMessage(imUserName, imContent, messageDate, that, date) {
  let dateKey = 'IM_' + messageDate + "_" + imUserName;//聊天记录key  格式  IM_20180502_studentIM9
  let userKey = 'IM_DATE_' + imUserName;//用户聊天日历   IM_DATE_studentIM9
  //消息发生时间
  let tempTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
  //锁定当前本地存储状态
  if (!wx.getStorageSync('IM_NATICE_SAVE_SYNC')) {
    wx.setStorageSync('IM_NATICE_SAVE_SYNC', true)
    //获取当前消息列表
    let newsList = wx.getStorageSync(dateKey);
    let userDateList = wx.getStorageSync(userKey);
    var newarray = [{ imUserName: imUserName, imContent: imContent, imtype: 'other', time: tempTime }];
    if (newsList) {
      newsList = newsList.concat(newarray);
    } else {
      newsList = newarray;
    }
    let tempDate = [messageDate];
    if (userDateList) {
      //判断历史消息时间 是否存在当天数据
      let tempDateHave = false;
      for (let k = 0; k < userDateList.length; k++) {
        if (userDateList[k] == messageDate) {
          tempDateHave = true;
        }
      }
      if (!tempDateHave) {
        userDateList = userDateList.concat(tempDate)
      }
    } else {
      userDateList = [messageDate];
    }
    //存储当天数据
    wx.setStorageSync(dateKey, newsList);
    //存储当前用户聊天记录日期
    wx.setStorageSync(userKey, userDateList);
    //更新总未读消息数
    if (wx.getStorageSync('IM_COUNT') && wx.getStorageSync('IM_COUNT') != "") {
      wx.setStorageSync('IM_COUNT', wx.getStorageSync('IM_COUNT') + 1);
    } else {
      wx.setStorageSync('IM_COUNT', 1);
    }
    //更新当前用户未读消息数
    wx.setStorageSync('IM_COUNT_' + imUserName, wx.getStorageSync('IM_COUNT_' + imUserName) + 1);
    //解锁存储操作
    wx.setStorageSync('IM_NATICE_SAVE_SYNC', false)
    //刷新聊天界面消息列表
    if (that.globalData.chatPageObject) {
      that.globalData.chatPageObject.showImMessageList();
    }
    //刷新消息列表界面消息列表
    if (that.globalData.chatListPageObject) {
      that.globalData.chatListPageObject.showNewMessage(imUserName, imContent, tempTime);
    }
  } else {
    //如果当前以及被锁定 则延迟 后重新执行
    setTimeout(function () {
      nativeSaveMessage(imUserName, imContent, messageDate, that, date)
    }, 10);
  }
  that.globalData.getTotlCount();
}

//本地缓存管理
function nativeSaveManage() {
  wx.getStorageInfo({
    success: function (res) {
      if (res.currentSize > 8000) {
        for (let i = 0; i < res.keys.length; i++) {
          if (res.keys[i].length > 9 && res.keys[i].substr(0, 8) == 'IM_DATE_') {
            let tempDataList = wx.getStorageSync(res.keys[i]);
            if (tempDataList && tempDataList.length > 0) {
              if (tempDataList.length > 10) {
                let tempList = new Array(10);
                let temCount = 9;
                for (let j = tempDataList.length - 1; j >= 0; j--) {
                  if (temCount >= 0) {
                    tempList[temCount] = tempDataList[j];
                    temCount--;
                  } else {
                    wx.removeStorageSync('IM_' + tempDataList[j] + "_" + res.keys[i].substr(8, res.keys[i].length));
                  }
                }
                wx.setStorageSync(res.keys[i], tempList);
              }
            } else {
              wx.removeStorageSync(res.keys[i]);
            }
          }
        }
      }
    }
  })
}

/***********************************IM相关***********************************/