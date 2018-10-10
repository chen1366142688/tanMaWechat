// pages/my/Edit-Profile/Edit-Profile.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: wx.getStorageSync('userInfo').userId,
    //userId: "12",
    imgUrl: app.imgUrl,
    avatarUrl: "",
    nickName: "",
    gender: "",
    provinceName: "",
    cityName: "",
    auditStatus: "",//审核状态0 审核中，1审核未通过，2审核通过 
    coachDescription: "",
    coachId: "",
    phoneNo: "",
    certificateRequestList: [],
    coachSelfPhotos: [],
    itemList: [],
    objectItemList: [],
    coachGradeList: ["无", "三级教练", "二级教练", "一级教练", "高级教练", "国家级教练"], //4三级教练、3二级教练、2一级教练、1高级教练、0国家级教练
    objectCoachGradeList: ["", "4", "3", "2", "1", "0"],
    athleteGradeList: ["无", "三级运动员", "二级运动员", "一级运动员", "运动健将", "国际运动健将"], // 4三级运动员、3二级运动员、2一级运动员、1运动健将、0国际运动健将
    objectAthleteGradeList: ["", "4", "3", "2", "1", "0"],
    paddingBtm: 0,
    orgUserId:''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面数据获取
    var vm = this;
    vm.setData({
      orgUserId: options.orgUserId
    });

    getItemList(vm);
  },
  // setPadding(){
  //   var res = wx.getSystemInfoSync().windowHeight;
  //   console.log(res)
  //   this.setData({ paddingBtm: 300})
  // },
  // setPaddEmpity(){
  //   this.setData({ paddingBtm: 0 })
  // },
  modalcnte: function () {
    wx.showModal({
      title: '提示',
      content: '资料审核：本页面的任何修改都会使得资料进入再次审核状态，请慎重编辑。处于“审核中”和“审核不通过”状态的教练账号，所发的课程和本人无法被用户看到和搜索到。',
      showCancel: false,
      confirmText: '我知道了',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击我知道了')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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
    var vm = this;
    app.noType();
    vm.setData({
      userId: wx.getStorageSync('userInfo').userId,
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
  //运动项目改变事件
  itemBindChange: function (e) {
    var certificateRequestList = this.data.certificateRequestList;
    certificateRequestList[e.currentTarget.dataset.index].itemIndex = Number(e.detail.value);
    this.setData({
      certificateRequestList: certificateRequestList,
    });
  },
  //运动员证书改变事件
  coachGradeBindChange: function (e) {
    var certificateRequestList = this.data.certificateRequestList;
    certificateRequestList[e.currentTarget.dataset.index].coachGradeIndex = Number(e.detail.value);
    if (certificateRequestList[e.currentTarget.dataset.index].coachGradeIndex != 0
      || certificateRequestList[e.currentTarget.dataset.index].athleteGradeIndex != 0) {
      certificateRequestList[e.currentTarget.dataset.index].showPhoto = true;
    } else {
      certificateRequestList[e.currentTarget.dataset.index].showPhoto = false;
    }
    this.setData({
      certificateRequestList: certificateRequestList,

    });
  },
  //教练证书改变事件
  athleteGradeBindChange: function (e) {
    var certificateRequestList = this.data.certificateRequestList;
    certificateRequestList[e.currentTarget.dataset.index].athleteGradeIndex = Number(e.detail.value);

    if (certificateRequestList[e.currentTarget.dataset.index].athleteGradeIndex != 0
      || certificateRequestList[e.currentTarget.dataset.index].coachGradeIndex != 0) {
      certificateRequestList[e.currentTarget.dataset.index].showPhoto = true;
    } else {
      certificateRequestList[e.currentTarget.dataset.index].showPhoto = false;
    }
    this.setData({
      certificateRequestList: certificateRequestList,
    });
  },
  //添加运动证书照片
  addItemImg: function (e) {
    var vm = this;
    var certificateRequestList = vm.data.certificateRequestList;
    var index = e.currentTarget.dataset.index;
    if (certificateRequestList[index].photos.length >= 5) {
      wx.showModal({
        title: '提示',
        content: "证书照片不能超过5张！",
        showCancel: false
      });
      return false;
    }
    //选择照片
    wx.chooseImage({
      count: 5 - certificateRequestList[index].photos.length,
      sizeType: ['compressed'],
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中......',
        });
        var tempFiles = res.tempFiles;
        var showFlag = false;
        for (let i = 0; i < tempFiles.length; i++) {
          let path = tempFiles[i].path;
          let size = tempFiles[i].size;
          if (size > 5 * 1024 * 1024) {
            showFlag = true;
            continue;
          }
          const uploadTask = wx.uploadFile({
            url: app.url + '/v1/file/upload',
            filePath: path,
            name: 'muFiles',
            formData: {
              'type': 'coach_img'
            },
            success: function (re) {
              var data = JSON.parse(re.data);
              if (data.code == 10000) {
                certificateRequestList[index].photos.push(data.response[0]);
                vm.setData({
                  certificateRequestList: certificateRequestList,
                });
                if (i == (tempFiles.length - 1)) {
                  wx.hideLoading();
                  if (showFlag) {
                    wx.showModal({
                      title: '提示',
                      content: "上传照片大小不能超过5M！",
                      showCancel: false
                    });
                  }
                }
              }
            },
            fail: function (res) {
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '网络请求失败！',
              });

            }
          });
        }
      }
    })

  },

  //删除运动证书照片
  deleteItemImg: function (e) {
    var certificateRequestList = this.data.certificateRequestList;
    var index = e.currentTarget.dataset.index;
    var photoindex = e.currentTarget.dataset.photoindex;
    certificateRequestList[index].photos.splice(photoindex, 1);
    this.setData({
      certificateRequestList: certificateRequestList,
    });
  },
  //删除运动项目
  deleteItem: function (e) {
    var index = e.currentTarget.dataset.index;
    var certificateRequestList = this.data.certificateRequestList;
    certificateRequestList.splice(index, 1);
    this.setData({
      certificateRequestList: certificateRequestList,
    });
  },
  //添加运动项目
  addItem: function () {
    var certificateRequestList = this.data.certificateRequestList;
    if (certificateRequestList.length == this.data.itemList.length) {
      wx.showModal({
        title: '提示',
        content: "运动项目数不能超过项目数！",
        showCancel: false
      });
      return false;
    }
    certificateRequestList.push({
      itemIndex: 0,
      coachGradeIndex: 0,
      athleteGradeIndex: 0,
      photos: [],
      showPhoto: false
    });
    this.setData({
      certificateRequestList: certificateRequestList,
    });
  },

  //自我介绍
  bindTextArea: function (e) {
    this.setData({
      coachDescription: e.detail.value,
    });
  },

  //删除运动照片
  deleteCoachImg: function (e) {
    var coachSelfPhotos = this.data.coachSelfPhotos;
    var index = e.currentTarget.dataset.index;
    coachSelfPhotos.splice(index, 1);
    this.setData({
      coachSelfPhotos: coachSelfPhotos,
    });
  },
  //添加运动照片
  addCoachImg: function (e) {
    var vm = this;
    var coachSelfPhotos = vm.data.coachSelfPhotos;
    if (coachSelfPhotos.length >= 5) {
      wx.showModal({
        title: '提示',
        content: "运动照片不能超过5张！",
        showCancel: false
      });
      return false;
    }
    //选择照片
    wx.chooseImage({
      count: 5 - coachSelfPhotos.length,
      sizeType: ['compressed'],
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中......',
        });
        var tempFiles = res.tempFiles;
        var showFlag = false;
        for (let i = 0; i < tempFiles.length; i++) {
          let path = tempFiles[i].path;
          let size = tempFiles[i].size;
          if (size > 5 * 1024 * 1024) {
            showFlag = true;
            continue;
          }
          const uploadTask = wx.uploadFile({
            url: app.url + '/v1/file/upload',
            filePath: path,
            name: 'muFiles',
            formData: {
              'type': 'coach_img'
            },
            success: function (re) {
              var data = JSON.parse(re.data);
              if (data.code == 10000) {
                coachSelfPhotos.push(data.response[0]);
                vm.setData({
                  coachSelfPhotos: coachSelfPhotos,
                });
                if (i == (tempFiles.length - 1)) {
                  wx.hideLoading();
                  if (showFlag) {
                    wx.showModal({
                      title: '提示',
                      content: "上传照片大小不能超过5M！",
                      showCancel: false
                    });
                  }
                }
              }
            },
            fail: function (res) {
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '网络请求失败！',
              });

            }
          });
        }
      }
    })

  },
  //保存
  submitCoachInfo: function (e) {
    var vm = this;
    const certificateList = vm.data.certificateRequestList;
    var certificateRequestList = [];
    var item = [];
    //运动项目
    for (let i = 0; i < certificateList.length; i++) {
      const itemIndex = certificateList[i].itemIndex;
      const coachGradeIndex = certificateList[i].coachGradeIndex;
      const athleteGradeIndex = certificateList[i].athleteGradeIndex;
      const showPhoto = certificateList[i].showPhoto;
      const photos = certificateList[i].photos;
      if (item.indexOf(itemIndex) > -1) {
        wx.showModal({
          title: '提示',
          content: "添加的运动项目不能相同！",
          showCancel: false
        });
        return false;
      }
      item.push(itemIndex);
      var coachPhotosRequestList = [];
      if (showPhoto) {//
        for (let j = 0; j < photos.length; j++) {
          coachPhotosRequestList.push({
            //"coachId": vm.data.coachId,
            "photoAddress": photos[j],
            "photoSort": j,
            "photoType": "1",
            "userId": vm.data.orgUserId
          });
        }
      }
      certificateRequestList.push({
        "athleteGrade": vm.data.objectAthleteGradeList[athleteGradeIndex],
        "coachGrade": vm.data.objectCoachGradeList[coachGradeIndex],
        //"coachId": vm.data.coachId,
        "coachPhotosRequestList": coachPhotosRequestList,
        "itemId": vm.data.objectItemList[itemIndex].itemId,
        "userId": vm.data.orgUserId
      });
    }
    if (certificateRequestList.length == 0) {
      wx.showModal({
        title: '提示',
        content: "请至少添加一项运动项目！",
        showCancel: false
      });
      return false;
    }
    //运动照片
    var coachSelfPhotos = [];
    var newcoachSelfPhotos = []
    const photos = vm.data.coachSelfPhotos;
    for (let j = 0; j < photos.length; j++) {
      coachSelfPhotos.push({
      //  "coachId": vm.data.coachId,
        "photoAddress": photos[j],
        "photoSort": j,
        "photoType": "0",
        "userId": vm.data.orgUserId
      });
      newcoachSelfPhotos.push(
        photos[j]
      );
    }
    var data = {
      userId: vm.data.orgUserId,
      description: vm.data.coachDescription,
      coachSelfPhotos: coachSelfPhotos,
      certificateRequestList: certificateRequestList
    };
    // console.log(data);
    if (vm.data.oldDesc == vm.data.coachDescription && checckArray(vm.data.oldCertificateList, vm.data.certificateRequestList) && checckArray(vm.data.oldcoachSelfPhotos, newcoachSelfPhotos)) {
      console.log("当前并没有改变什么")
      wx.showModal({
        title: '提示',
        content: "当前并没有什么改变，无需提交",
        showCancel: false,
        success: function () {
        }
      });
      return false;
    }
    //请求保存
    // return false;
    wx.request({
      url: app.url + '/v1/coach/updateOrgInfoByCoach',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('userInfo').token
      },
      data: data,
      success: function (res) {
        var result = res.data;
        if (result.code == '30005') {
          //跳转到注册  
          wx.redirectTo({
            url: "../../../pages/Introduction/Introduction"
          });
          return;
        }
        if (result.code == 10000) {
          wx.showModal({
            title: '',
            content: "提交成功！",
            showCancel: false,
            success: function () {
              console.log("用户点击了确定")
              //刷新页面
              //获取教练信息
              // getCoachInfo(vm);
              // getCoachCertificate(vm);
              // getCoachPhoto(vm);
              wx.navigateBack({
                delta: 1,
              })
            }
          });

        } else if (res.data.code == '30001') {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              wx.navigateBack({//返回上一页
                delta: 1
              });
            }
          })
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none'
          });
        }
      },
      fail: function (info) {
        wx.showModal({
          title: '提示',
          content: '网络请求失败！',
        });
      }
    });

  },

  editCoach: function (e) {
    //跳转到个人信息
    wx.navigateTo({
      url: "../../../pages/my/personal-details/personal-details"
    });
  },
  tips: function (e) {
    var vm = this;
    console.log(e);
    let havaClass = e.currentTarget.dataset.havaclass;
    if (havaClass) {
      wx.showModal({
        title: '提示',
        content: '当前项目已有课程发布，无法变更',
      });
    }
  }


})
//获取教练基本信息
function getCoachInfo(vm) {
  wx.request({
    url: app.url + '/v1/coach/get/coachSimpleInfoByOrgUserId',
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync('userInfo').token
    },
    data: {
      orgUserId: vm.data.orgUserId
    },
    success: function (res) {
      var result = res.data;
      if (result.code == '30005') {
        //跳转到注册  
        wx.redirectTo({
          url: "../../../pages/Introduction/Introduction"
        });
        return;
      }
      if (result.code == 10000) {
        var data = result.response;
        vm.setData({
          avatarUrl: data.avatarUrl,
          nickName: data.nickName,
          gender: data.gender == '1' ? "男" : data.gender == '2' ? "女" : "未知",
          provinceName: data.provinceName,
          cityName: data.cityName,
          auditStatus: data.auditStatus == '0' ? "审核中" : data.auditStatus == '1' ? "审核未通过" : "审核通过",//审核状态0 审核中，1审核未通过，2审核通过 
          coachDescription: data.coachDescription,
          oldDesc: data.coachDescription,
          coachId: data.coachId,
          phoneNo: data.phoneNo.substring(0, 3) + "****" + data.phoneNo.substring(7, 3)
        });

        getCoachCertificate(vm);
      } else if (res.data.code == '30001') {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          success: function (res) {
            wx.navigateBack({//返回上一页
              delta: 1
            });
          }
        })
      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
      }
    },
    fail: function (info) {
      wx.showModal({
        title: '提示',
        content: '网络请求失败！',
      });
    }
  });
}

//获取教练所有运动项目
function getCoachCertificate(vm) {
  wx.request({
    url: app.url + '/v1/coach/get/coachcertificateBaseInfoByOrgUserId',
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync('userInfo').token
    },
    data: {
      orgUserId: vm.data.orgUserId
    },
    success: function (res) {
      var result = res.data;
      if (result.code == '30005') {
        //跳转到注册  
        wx.redirectTo({
          url: "../../../pages/Introduction/Introduction"
        });
        return;
      }
      if (result.code == 10000) {
        getCoachPhoto(vm);
        
        var data = result.response;
        console.log(data)
        if (data.length == 0) {
          vm.setData({
            certificateRequestList: []
          });
          return false;
        }
        var certificateRequestList = [];
        const objectItemList = vm.data.objectItemList;
        const objectCoachGradeList = vm.data.objectCoachGradeList;
        const objectAthleteGradeList = vm.data.objectAthleteGradeList;
        for (let i = 0; i < data.length; i++) {
          //运动项目
          var itemIndex = 0;
          for (let j = 0; j < objectItemList.length; j++) {
            if (data[i].itemId == objectItemList[j].itemId) {
              itemIndex = j;
              break;
            }
          }
          //运动员证书
          var coachGradeIndex = 0;
          if (data[i].coachGradeId != null) {
            for (let j = 0; j < objectCoachGradeList.length; j++) {
              if (data[i].coachGradeId.toString() == objectCoachGradeList[j]) {
                coachGradeIndex = j;
                break;
              }
            }
          }
          //教练证书
          var athleteGradeIndex = 0;
          if (data[i].athleteGradeId != null) {
            for (let j = 0; j < objectAthleteGradeList.length; j++) {
              if (data[i].athleteGradeId.toString() == objectAthleteGradeList[j]) {
                athleteGradeIndex = j;
                break;
              }
            }
          }
          //照片
          var photos = [];
          if (data[i].photos.length > 0) {
            for (let j = 0; j < data[i].photos.length; j++) {
              photos.push(data[i].photos[j].photoAddress);
            }
          }
          var showPhoto = false;
          if (coachGradeIndex != 0 || athleteGradeIndex != 0) {
            showPhoto = true;
          }
          certificateRequestList.push({
            itemIndex: itemIndex,
            coachGradeIndex: coachGradeIndex,
            athleteGradeIndex: athleteGradeIndex,
            photos: photos,
            showPhoto: showPhoto,
            havaClass: data[i].haveClass
          });
        }
        vm.setData({
          certificateRequestList: certificateRequestList,
          oldCertificateList: certificateRequestList
        });
        console.log(vm.data.certificateRequestList);

      } else if (res.data.code == '30001') {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          success: function (res) {
            wx.navigateBack({//返回上一页
              delta: 1
            });
          }
        })
      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
      }
    },
    fail: function (info) {
      wx.showModal({
        title: '提示',
        content: '网络请求失败！',
      });
    }
  });
}
//获取教练运动照片
function getCoachPhoto(vm) {
  console.log(vm)
  wx.request({
    url: app.url + '/v1/coach/get/coachSportsPhotosByOrgUserId',
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync('userInfo').token
    },
    data: {
      orgUserId: vm.data.orgUserId
    },
    success: function (res) {
      var result = res.data;
      if (result.code == '30005') {
        //跳转到注册  
        wx.redirectTo({
          url: "../../../pages/Introduction/Introduction"
        });
        return;
      }
      if (result.code == 10000) {
        var data = result.response;
        if (data.length == 0) {
          vm.setData({
            coachSelfPhotos: [],
            oldcoachSelfPhotos: []
          });
          return false;
        }
        var coachSelfPhotos = [];
        for (let i = 0; i < data.length; i++) {
          coachSelfPhotos.push(data[i].photoAddress);
        }
        vm.setData({
          coachSelfPhotos: coachSelfPhotos,
          oldcoachSelfPhotos: coachSelfPhotos
        });

      } else if (res.data.code == '30001') {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          success: function (res) {
            wx.navigateBack({//返回上一页
              delta: 1
            });
          }
        })
      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
      }
    },
    fail: function (info) {
      wx.showModal({
        title: '提示',
        content: '网络请求失败！',
      });
    }
  });
}
//项目信息
function getItemList(vm) {
  wx.request({
    url: app.url + '/v1/item/getItemList',
    method: 'GET',
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync('userInfo').token
    },
    data: {},
    success: function (res) {
      var result = res.data
      console.log(result)
      if (result.code == 10000) {
        var data = result.response;
        if (data.length == 0) {
          return false;
        }
        var arr = [];
        for (let i = 0; i < data.length; i++) {
          arr.push(data[i].itemName);
        }
        vm.setData({
          itemList: arr,
          objectItemList: data
        }, function () {
          //获取教练信息
          getCoachInfo(vm);
       //   getCoachCertificate(vm);
       //   getCoachPhoto(vm);
        });

      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
      }
    },
    fail: function (info) {
      wx.showModal({
        title: '提示',
        content: '网络请求失败！',
      });
    }
  });
}

function checckArray(array1, array2) {
  // console.log("1")
  console.log(array1)
  console.log(array2)
  if (!array1 || !array2) {
    // console.log("2")
    return false;
  }
  if (array2.length != array1.length) {
    // console.log("3")
    return false;
  }

  for (var i = 0, l = array2.length; i < l; i++) {
    if (array2[i] instanceof Array && array1[i] instanceof Array) {
      if (!array2[i].equals(array1[i])) {
        // console.log("4")
        return false;
      }
    } else if (JSON.stringify(array2[i]) != JSON.stringify(array1[i])) {
      return false;
    }
  }
  return true;
}