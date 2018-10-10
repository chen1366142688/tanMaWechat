// pages/curriculum/Course-Composer/Course-Composer.js
var util = require('../../../utils/util.js');
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    classStatus: [{ statusIndex: '1', name: '上架' }, { statusIndex: '2', name: '下架' }],
    statusIndex: 0,
    dataStatus: '1',
    isExperience: [{ experienceIndex: '0', name: '否' }, { experienceIndex: '1', name: '是' }],
    experienceIndex: 0,
    dataExperience: '0',
    classType: [{ typeIndex: '1', name: '大课' }, { typeIndex: '2', name: '私教' }],
    typeIndex: 0,
    dataType: 1,
    studentNums: '', 
    itemList: [],
    itemIndex: '',
    dataItem: '',
    itemGrade: [
      { name: 'L1', value: '1', checked: false },
      { name: 'L2', value: '2', checked: false },
      { name: 'L3', value: '3', checked: false },
      { name: 'L4', value: '4', checked: false },
      { name: 'L5', value: '5', checked: false },
      { name: 'L6', value: '6', checked: false },
      // { name: 'L7', value: '7' },
      // { name: 'L8', value: '8' },
      // { name: 'L9', value: '9' },
    ],
    gradeShow: '请选择该项目适应能力',
    gradeWillShow: '',
    dataGrade: '',
    homeList: [],
    homeIndex: '',
    dataHome: '',
    courseTime: [
      { name: '0.5小时', value: '5' },
      { name: '1小时', value: '10' },
      { name: '1.5小时', value: '15' },
      { name: '2小时', value: '20' },
      { name: '2.5小时', value: '25' },
      { name: '3小时', value: '30' },
      { name: '3.5小时', value: '35' },
      { name: '4小时', value: '40' }
    ],
    courseIndex: 1,
    dataCourse: 10,
    showModal: false,
    timeOk : true,
    timeCount : 0,
    provinceName: '',
    cityName: '',
    countyName: '',
    classSectionList: [],
    weekList: [
      { name: '周一', value: 1 },
      { name: '周二', value: 2 },
      { name: '周三', value: 3 },
      { name: '周四', value: 4 },
      { name: '周五', value: 5 },
      { name: '周六', value: 6 },
      { name: '周日', value: 7 }
    ],
    weekIndex: 1,
    className: '',
    classDesc: '',
    classPhotos: [],
    uploadPic: true,
    classArticleList: [],
    courseCount: '',
    courseCountIndex: 14,
    courseCountList: [
      { name: '1', value: 1 },
      { name: '2', value: 2 },
      { name: '3', value: 3 },
      { name: '4', value: 4 },
      { name: '5', value: 5 },
      { name: '6', value: 6 },
      { name: '7', value: 7 },
      { name: '8', value: 8 },
      { name: '9', value: 9 },
      { name: '10', value: 10 },
      { name: '11', value: 11 },
      { name: '12', value: 12 },
      { name: '13', value: 13 },
      { name: '14', value: 14 },
      { name: '15', value: 15 },
      { name: '16', value: 16 },
      { name: '17', value: 17 },
      { name: '18', value: 18 },
      { name: '19', value: 19 },
      { name: '20', value: 20 },
      { name: '21', value: 21 },
      { name: '22', value: 22 },
      { name: '23', value: 23 },
      { name: '24', value: 24 },
      { name: '25', value: 25 },
      { name: '26', value: 26 },
      { name: '27', value: 27 },
      { name: '28', value: 28 },
      { name: '29', value: 29 },
      { name: '30', value: 30 }
    ],
    courseFee: '',
    courseFeeShow: '',
    tutorList: [],
    homeTf: true,
    classId: null,
    userId: '',
    coachId: 6,
    editeStatus: false,
    editing: false,
    isRepeat: 0,
    tijiao: true,
    uploading: false,
    itemListTf: false,
    itemListEdite: true,
    textNum: 0,
    outOfSize: [],
    duiOr: '',
    hotRed: false,
    isOnShow: true,
    classCoach: '',
    isCompany: false,
    isItemChange: false,
    orgList:[],
    orgIndex: '',
    orgCoachId: '',
    orgUserId: '',
    haveHomeFee: [{ haveHomeFeeIndex: '0', name: '否' }, { haveHomeFeeIndex: '1', name: '是' }],
    haveHomeFeeIndex:0,
    haveHomeFeeData:0,
    isCanediteOrg:true,
    deitInfo:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var vm = this;
    console.log(options)
    let classId = options.classId;
    // classId = 68;
    if (classId) {
      vm.setData({
        classId: classId
      })
    }

  },
  //点击图片
  clickImg(e) {
    let that = this;
    console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index;
    let classPhotos = that.data.classPhotos;
    for (let i = 0; i < classPhotos.length; i++) {
      if (index == i) {
        classPhotos[i].y = false;
      } else {
        classPhotos[i].y = true;
      }
    }
    that.setData({ classPhotos: classPhotos })
  },
  //跳转到适合等级说明
  myLevel: function (e) {
    /* myrating h5界面
       myratingstu 小程序界面
   */
    wx.navigateTo({
      url: '../../../pages/curriculum/type/type',
    })
  },

  modalcnte: function () {
    wx.showModal({
      title: '提示',
      content: '这里为本课程需要教学的内容，您可以在平台的内容模板上，进行编辑，也可以点击“添加课程内容”，增加新的内容。',
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
  modalcnt: function () {
    wx.showModal({
      title: '提示',
      content: '可添加平台已注册的助教，仅用于展示，也可不填写。',
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
  modalcnta: function () {
    wx.showModal({
      title: '提示',
      content: '当设置为“下架”时，本课程不再被看到以及搜索，但学员已购买的课程的开课通知会继续发出。',
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
  modalcntb: function () {
    wx.showModal({
      title: '提示',
      content: '私教，为1对1课程；大课，则为2人及2人以上的课程。',
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
  modalcntc: function () {
    wx.showModal({
      title: '提示',
      content: '如果课程设有多个时段（如周六下午和周日下午），这里人数为每个时段可接受的最大人数。',
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
    var vm = this;
    let itemList = vm.data.itemList;
    // console.log(itemList)
    if (itemList && itemList.length > 0) {
      vm.setData({
        itemIndex: 0
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var vm = this;
    
    app.noType();
    if (vm.data.hotRed) {
      console.log("是从添加助教过来的")
      return false;
    } else {
      // console.log("不是从助教过来的")
      // console.log(vm.data)
    }
    
    let isOnShow = vm.data.isOnShow;
    if (!isOnShow) {
      return false;
    }
    getOrgInfoList(vm);
    var itemsList = wx.getStorageSync("classList");
    var location = wx.getStorageSync("location").result.address_component;
    var userInfo = wx.getStorageSync("userInfo");
    var coachBaseInfo = wx.getStorageSync("coachBaseInfo");
    let coachTypea = coachBaseInfo.userType;
    if (coachTypea && coachTypea != '3') {
      vm.setData({
        isCompany: false
      })
    } else {
      vm.setData({
        isCompany: true
      })
    }
    // console.log(location)
    var cityName = location.city;
    var provinceName = location.province;
    var countyName = location.district;
    vm.setData({
      // itemList: itemsList,
      provinceName: provinceName ? provinceName : '',
      cityName: cityName ? cityName : '',
      countyName: countyName ? countyName : '',
      userId: userInfo.userId,
      token: userInfo.token
    });
    
    
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
  orgChange:function(e){
    var vm=this;
    console.log('orgChange,发送选择改变，携带值为', e.detail.value);
    let orgIndex = e.detail.value;
    let orgUserId = vm.data.orgList[orgIndex].orgUserId;
    let orgCoachId = vm.data.orgList[orgIndex].orgCoachId;
    // console.log(dataStatus);
    vm.setData({
      orgIndex: orgIndex,
      orgCoachId: orgCoachId,
      orgUserId: orgUserId
    });
    getCoachCertificateSingleList(vm);
  },
  classStatusChange: function (e) {
    var vm = this;
    console.log('classStatusChange,发送选择改变，携带值为', e.detail.value);
    let statusIndex = e.detail.value;
    let dataStatus = vm.data.classStatus[statusIndex].statusIndex;
    // console.log(dataStatus);
    vm.setData({
      statusIndex: statusIndex,
      dataStatus: dataStatus
    })
  },
  experienceChange: function (e) {
    var vm = this;
    // console.log(e)
    console.log('experienceChange,发送选择改变，携带值为', e.detail.value)
    let experienceIndex = e.detail.value;
    let dataExperience = vm.data.isExperience[experienceIndex].experienceIndex;
    vm.setData({
      experienceIndex: experienceIndex,
      dataExperience: dataExperience
    })
  },
  homeFeeChange: function (e) {
    var vm = this;
    // console.log(e)
    console.log('homeFeeChange,发送选择改变，携带值为', e.detail.value)
    let haveHomeFeeIndex = e.detail.value;
    let haveHomeFeeData = vm.data.haveHomeFee[haveHomeFeeIndex].haveHomeFeeIndex;
    vm.setData({
      haveHomeFeeIndex: haveHomeFeeIndex,
      haveHomeFeeData: haveHomeFeeData
    })
  },
  classTypeChange: function (e) { 
    var vm = this;
    // console.log(e)
    console.log('classTypeChange,发送选择改变，携带值为', e.detail.value)
    let typeIndex = e.detail.value;
    let dataType = vm.data.classType[typeIndex].typeIndex;
    vm.setData({
      typeIndex: typeIndex,
      dataType: dataType,
      studentNums: ''
    })
    if (dataType == '2') {
      vm.setData({
        studentNums: 1
      })
    }
  },
  // showM(e){
  //   let that = this;
  //   wx.showModal({
  //     title: '提示',
  //     content: '修改课程人数上限只会影响没有学生报名的课班！',
  //     success(res) {
  //       that.setData({ deitInfo:true ]})
  //       console.log(res.confirm)
  //       if (res.confirm) {
  //         console.log("确定")
  //       } else if (res.cancel) {
  //         console.log("取消")
  //       }
  //     }
  //   })
  // },
  maxMember: function (e) {
    var vm = this;
    let dataType = vm.data.dataType;
    let maxMember = parseInt(e.detail.value);
    if (dataType == '2' || dataType == 2) {
      wx.showToast({
        title: '私教只能支持一人',
        icon: 'none',
        duration: 2000
      })
      vm.setData({
        studentNums: 1
      })
    } else {
      vm.setData({
        studentNums: maxMember
      })
    }
  },
  itemChoose: function (e) {
    var vm = this;
    let itemListEdite = vm.data.itemListEdite;
    let itemList = vm.data.itemList;
    if (itemList.length < 1) {
      if (itemListEdite && !vm.data.editeStatus) {
        wx.showModal({
          title: '提示',
          content: '请先添加您的运动能力',
          showCancel: false
        })
      }
    }

  },
  itemChange: function (e) {
    var vm = this;
    // console.log(e)
    console.log('itemChange,发送选择改变，携带值为', e.detail.value)
    let itemIndex = e.detail.value;
    let dataItem = vm.data.itemList[itemIndex].itemId;
    vm.setData({
      itemIndex: itemIndex,
      dataItem: dataItem,
      isItemChange: true
    });
    getHomeSingleList(vm, dataItem);
    console.log("这是第一个")
    autoClassNameAndDesc(vm);
    if (vm.data.dataGrade) {
      getTemplet(vm);
    }
  },
  preventTouchMove: function () {

  },
  chooseLevel: function (e) {
    var vm = this;
    // let editeStatus = vm.data.editeStatus;
    // if (!editeStatus) {
      vm.setData({
        textNum: -1,
        showModal: true
      })
    // }
  },
  checkBoxSure: function (e) {
    var vm = this;
    let gradeWillShow = vm.data.gradeWillShow;
    //  let info=gradeWillShow.split(',');
    //  if(info.length<=3){
    //    console.log('ok no problem')
    //  }else{
    //    wx.showModal({
    //      title: '提示',
    //      content: '适应能力不能超过3个',
    //    })
    //    return false;
    //  }
    checkBoxChoose(gradeWillShow, vm);
    if (gradeWillShow) {
      vm.setData({
        textNum: 0,
        showModal: false,
        gradeShow: util.stringPrefixSet(gradeWillShow, " L"),
        dataGrade: gradeWillShow
      });
      if (vm.data.dataItem) {
        getTemplet(vm);

      }
    } else {
      vm.setData({
        textNum: 0,
        showModal: false
      })
    }
  },
  checkBoxCancle: function (e) {
    var vm = this;
    vm.setData({
      textNum: 0,
      showModal: false,
      gradeWillShow: ''
    })
  },
  checkboxChange: function (e) {
    var vm = this;
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    let arr = e.detail.value;
    if (arr.length > 0) {
      vm.setData({
        gradeWillShow: arr.sort().join(",")
      })
    } else {
      let itemGrade = vm.data.itemGrade;
      for (let k = 0; k < itemGrade.length; k++) {
        itemGrade[k].checked = false;
      }
      console.log("什么也没选")
      vm.setData({
        gradeShow: '请选择该项目适应能力',
        gradeWillShow: '',
        dataGrade: '',
        itemGrade: itemGrade
      })

    }
  },
  homeChange: function (e) {
    var vm = this;
    console.log('homeChange,发生change事件，携带value值为：', e.detail.value)
    let itemId = vm.data.dataItem;
    console.log(itemId)
    if (!itemId) {
      wx.showModal({
        title: '提示',
        content: '请先选择培训项目',
        showCancel: false
      })
      return;
    }

    let homeIndex = e.detail.value;
    let dataHome = vm.data.homeList[homeIndex].homeId;
    vm.setData({
      homeIndex: homeIndex,
      dataHome: dataHome
    });
  },
  courseChange: function (e) {
    var vm = this;
    // console.log(e)
    console.log('courseChange,发送选择改变，携带值为', e.detail.value)
    let courseIndex = e.detail.value;
    let dataCourse = vm.data.courseTime[courseIndex].value;
    vm.setData({
      courseIndex: courseIndex,
      dataCourse: dataCourse
    })
  },
  addClassSection: function (e) {
    var vm = this;
    let classSectionList = vm.data.classSectionList;
    let lastTime = vm.data.timeCount == 0 ? "09:00" : vm.data.classSectionList[vm.data.timeCount - 1].dayTimeEnd;
    let overTime;
    if (vm.data.courseIndex % 2 == 0){
       overTime = lastTime.split(":")[1] == "00" ? parseFloat(lastTime.split(":")[0]) + vm.data.courseIndex/2 + ":30" : parseFloat(lastTime.split(":")[0]) + vm.data.courseIndex/2 + ":00"
    }else{
       overTime = lastTime.split(":")[1] == "00" ? parseFloat(lastTime.split(":")[0]) + (parseFloat(vm.data.courseIndex)+1)/2 + ":00" : parseFloat(lastTime.split(":")[0]) + (parseFloat(vm.data.courseIndex)+1)/2 + ":30"
    }
    if (overTime.split(":")[0] >= 22){
      wx.showModal({
        title: '提示',
        content: '超出规定时间',
        showCancel: false
      })
      overTime = lastTime;
    }
    let classParams = {
      "dayTimeEnd": overTime,
      "dayTimeStart": lastTime,
      "weekDay": vm.data.weekIndex
    };
    let list = vm.data.classSectionList;
    list.push(classParams);
    vm.setData({
      classSectionList: list,
      timeCount: vm.data.timeCount + 1
    })
  },
  deleteCourseTime: function (e) {
    var vm = this;
    // console.log(e)
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        // 用户点击了确定 可以调用删除方法了
        if (sm.confirm) {
          let list = vm.data.classSectionList;
          list.splice(e.currentTarget.dataset.index, 1);
          vm.setData({
            classSectionList: list,
            timeCount : vm.data.timeCount - 1
          });
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  bindWeekChange: function (e) {
    var vm = this;
     console.log(e);
    let listIndex = e.currentTarget.dataset.index;
    let weekIndex = e.detail.value;
    let classList = vm.data.classSectionList;
    classList[listIndex].weekDay = parseInt(weekIndex) + 1;
    vm.setData({
      classSectionList: classList,
      weekIndex: classList[listIndex].weekDay
    })
  },
  starTimeChange: function (e) {
    console.log(e)
    var vm = this;
    let listIndex = e.currentTarget.dataset.index;
    let dayTimeStart1 = e.detail.value;
    let classList = vm.data.classSectionList;

    let dayTimeEnd1 = classList[listIndex].dayTimeEnd;

    var tf = CompareDate(dayTimeStart1, dayTimeEnd1);
    classList[listIndex].dayTimeStart = dayTimeStart1;
    if (!tf){
      classList[listIndex].dayTimeEnd = classList[listIndex].dayTimeStart.split(":")[1] == "00" ? classList[listIndex].dayTimeStart.split(":")[0] + ":30" : parseFloat(classList[listIndex].dayTimeStart.split(":")[0]) + 1 + ":00"   
    }
    for (var i = 0; i < classList.length; i++) {
      if (i == listIndex && classList.length != 1) {
        continue;
      }
      if (classList[listIndex].weekDay == classList[i].weekDay) {
        let resultCheckStart = checkTime(classList[listIndex].dayTimeStart, classList[i].dayTimeStart, classList[i].dayTimeEnd)
        let resultCheckStart2 = checkTime(classList[i].dayTimeStart, classList[listIndex].dayTimeStart, classList[listIndex].dayTimeEnd)
        let resultCheckEnd2 = checkTime(classList[i].dayTimeEnd, classList[listIndex].dayTimeStart, classList[listIndex].dayTimeEnd)
        if (resultCheckStart && resultCheckStart2 && resultCheckEnd2) {
          vm.setData({
            classSectionList: classList,
            timeOk : true
          })
        } else {
          vm.setData({
            timeOk: false
          })
          wx.showModal({
            title: '提示',
            content: '时间有冲突',
            showCancel: false
          })
        }
      }else{
        vm.setData({
          classSectionList: classList
        })
      }
    } 
  },
  endTimeChange: function (e) {
    var vm = this;
     console.log(e);
    let listIndex = e.currentTarget.dataset.index;
    let dayTimeEnd1 = e.detail.value;
    let classList = vm.data.classSectionList;
    let starTime = classList[listIndex].dayTimeStart;
    var tf = CompareDate(starTime, dayTimeEnd1);
    if (tf) {
      classList[listIndex].dayTimeEnd = dayTimeEnd1;
      for (var i = 0 ; i < classList.length ; i++){
        if (i == listIndex && classList.length != 1){
          continue ;
        }
        if (classList[listIndex].weekDay == classList[i].weekDay){
          let resultCheckStart = checkTime(classList[listIndex].dayTimeStart, classList[i].dayTimeStart, classList[i].dayTimeEnd)
          let resultCheckStart2 = checkTime(classList[i].dayTimeStart, classList[listIndex].dayTimeStart, classList[listIndex].dayTimeEnd)
          let resultCheckEnd = checkTime(classList[listIndex].dayTimeEnd, classList[i].dayTimeStart, classList[i].dayTimeEnd)
          let resultCheckEnd2 = checkTime(classList[i].dayTimeEnd, classList[listIndex].dayTimeStart, classList[listIndex].dayTimeEnd)

          if (resultCheckEnd && resultCheckStart && resultCheckStart2 && resultCheckEnd2){
            vm.setData({
              classSectionList: classList
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '时间有冲突',
              showCancel: false
            })
          }
        } else {
          vm.setData({
            classSectionList: classList
          })
        }
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '开始时间不能小于结束时间',
        showCancel: false
      })
    }
  },
  classNameBlur: function (e) {
    var vm = this;
    vm.setData({
      className: e.detail.value
    });
    if (vm.data.classId) {
      vm.setData({
        editing: true
      });
    }
  },
  classDescBulr: function (e) {
    var vm = this;
    vm.setData({
      classDesc: e.detail.value
    })
    if (vm.data.classId) {
      vm.setData({
        editing: true
      });
    }
  },
  uploadPic: function (e) {
    var vm = this;
    vm.setData({
      isOnShow: false
    })
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // var tempFilePaths = res.tempFilePaths
        var tempFiles = res.tempFiles;
        console.log(res)
        wx.showLoading({
          title: '上传中......',
        }),
          vm.setData({
            uploading: true
          })
        // console.log(tempFilePaths.length)
        var outOfSize = [];
        var picLength = tempFiles.length;
        if (picLength > 10) {
          wx.showToast({
            title: '上传图片不能超过9张',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        for (let i = 0; i < picLength; i++) {
          let path = tempFiles[i].path;
          let size = tempFiles[i].size;
          if (size > 1 * 1024 * 1024) {
            console.log(i + 1)
            outOfSize.push(i + 1);
            vm.setData({
              outOfSize: outOfSize
            })
            continue;
          }
          const uploadTask = wx.uploadFile({
            url: app.url + '/v1/file/upload', //仅为示例，非真实的接口地址
            // timeout: 10000, //超时时间设置，单位毫秒
            filePath: path,
            // sizeLimit: '102400000',//改大
            name: 'muFiles',
            formData: {
              'type': 'coach_img'
            },
            success: function (re) {
              var data = JSON.parse(re.data)
              if (data.code == '10000') {
                var defaultPhoto = '0';
                var y = true;
                var photoAddress = data.response[0];
                var photoInfo = {
                  defaultPhoto,
                  y,
                  photoAddress
                };
                let classPhotos = vm.data.classPhotos;
                classPhotos.push(photoInfo);
                classPhotos[0].y = false;
                console.log(classPhotos)
                if (classPhotos.length < 10) {
                  vm.setData({
                    classPhotos: classPhotos
                  })
                }
                if (classPhotos.length == 9) {
                  vm.setData({
                    uploadPic: false
                  })
                }
                if (i == (picLength - 1)) {
                  wx.hideLoading();
                  vm.setData({
                    uploading: false
                  })

                  if (vm.data.outOfSize.length > 0) {
                    wx.showToast({
                      title: '您刚上传的第' + vm.data.outOfSize.join(",") + '张图片大小超过限制(5M)',
                      icon: 'none',
                      duration: 3000
                    })
                    vm.setData({
                      outOfSize: []
                    })
                  }
                }
              }
            },
            fail: function (ree) {
              console.log(ree)
              wx.hideLoading();
            }
          });

        }


      }
    })
  },
  deleteClassImg: function (e) {
    var vm = this;
    console.log(e);
    let list = vm.data.classPhotos;
    let deleteIndex = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        // 用户点击了确定 可以调用删除方法了
        if (sm.confirm) {
          list.splice(deleteIndex, 1);
          vm.setData({
            classPhotos: list,
            uploadPic: true
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  addSport: function (e) {
    var vm = this;
    if (vm.data.classId) {
      vm.setData({
        editing: true
      });
    }
    wx.navigateTo({
      url: '../project-Editor/project-Editor',
    })
  },
  editeClass: function (e) {
    var vm = this;
    // console.log(e)
    if (vm.data.classId) {
      vm.setData({
        editing: true
      });
    }
    let classIndex = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../project-Editor/project-Editor?classIndex=' + classIndex,
    })
  },
  deleteClass: function (e) {
    var vm = this;
    // console.log(e)
    if (vm.data.classId) {
      vm.setData({
        editing: true
      });
    }
    let classIndex = e.currentTarget.dataset.index;
    let classList = vm.data.classArticleList;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        // 用户点击了确定 可以调用删除方法了
        if (sm.confirm) {
          classList.splice(classIndex, 1);
          vm.setData({
            classArticleList: classList
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  courseCount: function (e) {
    var vm = this;
    // console.log(e)
    let courseCount = e.detail.value;
    if (courseCount > 2000) {
      wx.showToast({
        title: '课时数量不能大于2000',
        icon: 'none',
        duration: 2000
      })
      vm.setData({
        courseCount: '',
      })
    } else {
      vm.setData({
        courseCount: courseCount,
      })
    }
    // var vm = this;
    // console.log(e)
    // let courseCountIndex = e.detail.value;
    // let courseCount = vm.data.courseCountList[courseCountIndex].value;
    // vm.setData({
    //   courseCountIndex: courseCountIndex,
    //   courseCount: courseCount
    // })
  },
  courseFee: function (e) {
    var vm = this;
    // console.log(e)
    let courseFee = e.detail.value;
    let courseFeeShow = courseFee;
    vm.setData({
      courseFee: courseFee,
      courseFeeShow: courseFeeShow
    })
  },
  addTutor: function (e) {
    wx.navigateTo({
      url: '../Teaching-Assistant/Teaching-Assistant',
    })
  },
  deletTutor: function (e) {
    var vm = this;
    console.log(e);
    let list = vm.data.tutorList;
    let deleteIndex = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        // 用户点击了确定 可以调用删除方法了
        if (sm.confirm) {
          list.splice(deleteIndex, 1);
          vm.setData({
            tutorList: list
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  tips: function (e) {
    var vm = this;
    let homeTf = vm.data.homeTf;
    let editeStatus = vm.data.editeStatus;
    if (homeTf && !editeStatus) {
      wx.showModal({
        title: '提示',
        content: '请先选择培训项目',
        showCancel: false
      })
    }
  },
  submintClass: function (e) {
    var vm = this;
    let tijiao = vm.data.tijiao;
    //判断所有时间是否ok
    let classSectionList = vm.data.classSectionList

    if (tijiao) {
      vm.setData({
        tijiao: false
      })
      subminClass(vm)
    } else {
      wx.showModal({
        title: '提示',
        content: '你提交的太快了，休息一下吧',
        showCancel: false
      })
    }

  },
  bindGetUserInfo: function (e) {
    var vm = this;
    console.log(e)
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    wx.login({
      success: res => {
        // console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // login(res.code, '2', that)
        vm.setData({
          resCode: res.code
        })
        // this.globalData.resCode = res.code;
      }
    })
    login(vm.data.resCode, '2', vm, encryptedData, iv);
  },
  toChooseCoach: function () {
    var vm = this;
    let editeStatus = vm.data.editeStatus;
    // if (!editeStatus) {
      wx.navigateTo({
        url: '../Addition-coach/Addition-coach?orgUserId=' + vm.data.orgUserId,
      })
    // }
  }
});
function getHomeList(vm) {
  let cityName = vm.data.cityName;
  let countyName = vm.data.countyName;
  let provinceName = vm.data.provinceName;
  wx.request({
    url: app.url + '/v1/home/get/homeIdAndHomeNameList',
    data: {
      "cityName": cityName,
      "countyName": countyName,
      "provinceName": provinceName
    },
    method: 'POST',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      // console.log(res)
      if (res.data.code == '10000') {
        // console.log(res.data.response);
        var data = res.data.response;
        // console.log(data);
        vm.setData({
          homeList: data
        })

      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
};
function CompareDate(t1, t2) {
  var date = new Date();
  var a = t1.split(":");
  var b = t2.split(":");
  return date.setHours(a[0], a[1]) < date.setHours(b[0], b[1]);
};
function checkTime(t1,t2,t3) {
  var date = new Date();
  var a = t1.split(":");
  var b = t2.split(":");
  var c = t3.split(":");
  if (date.setHours(a[0], a[1]) > date.setHours(b[0], b[1]) && date.setHours(a[0], a[1]) < date.setHours(c[0], c[1])){
    return false
  }else{
    return true
  }
};
function getHomeSingleList(vm, itemId) {
  let cityName = vm.data.cityName;
  // let itemId = vm.data.dataItem;
  wx.request({
    url: app.url + '/v1/home/getHomeSingleInfoList',
    data: {
      "cityName": cityName,
      "itemId": itemId
    },
    method: 'POST',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      console.log(res)
      if (res.data.code == '10000') {
        // console.log(res.data.response);
        var data = res.data.response;
        // console.log(data);
        vm.setData({
          homeList: data,
          homeTf: vm.data.editeStatus ? true : false
        });
        // console.log(vm.data.dataHome)

        // console.log(data.length)
        if (data.length < 1) {
          let isItemChange = vm.data.isItemChange;
          if (isItemChange) {
            wx.showModal({
              title: '提示',
              content: '该城市暂无支持该项目的场馆,请重新选择',
              showCancel: false
            })
          }
          vm.setData({
            itemIndex: '',
            dataItem: '',
            homeTf: true
          });
        } else {
          // console.log("zheli ???")
          if (!vm.data.dataHome || vm.data.isItemChange) {
            vm.setData({
              homeIndex: 0,
              dataHome: data[0].homeId,
            })
          }
        }
        if (vm.data.dataHome) {
          getHomeIndex(vm, vm.data.dataHome)
        }
      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
};
function subminClass(vm) {
  if (!vm.data.dataStatus) {
    wx.showModal({
      title: '提示',
      content: '请选择课程状态',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (!vm.data.dataExperience) {
    wx.showModal({
      title: '提示',
      content: '请选择是否支持体验',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (!vm.data.dataType) {
    wx.showModal({
      title: '提示',
      content: '请选择课程类型',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (!vm.data.studentNums) {
    wx.showModal({
      title: '提示',
      content: '请输入课程人数',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (vm.data.dataType == '1') {
    let maxMember = parseInt(vm.data.studentNums);
    if (!(2 <= maxMember && maxMember < 200)) {
      wx.showToast({
        title: '大班人数2-200,请准确输入',
        icon: 'none',
        duration: 2000
      })
      vm.setData({
        tijiao: true
      })
      return;
    }
  }
  if (!vm.data.dataItem) {
    wx.showModal({
      title: '提示',
      content: '请选择培训内容',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (!vm.data.dataGrade) {
    wx.showModal({
      title: '提示',
      content: '请选择适应能力级别',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (!vm.data.dataHome) {
    wx.showModal({
      title: '提示',
      content: '请选择培训场馆',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (!vm.data.dataCourse) {
    wx.showModal({
      title: '提示',
      content: '请选择课时时长',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (!vm.data.timeOk) {
    wx.showModal({
      title: '提示',
      content: '时间有冲突',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (vm.data.classSectionList.length < 1) {
    wx.showModal({
      title: '提示',
      content: '请添加课程时间',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (vm.data.classPhotos.length < 1) {
    wx.showModal({
      title: '提示',
      content: '请添加课程图片',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (!vm.data.className) {
    wx.showModal({
      title: '提示',
      content: '请输入课程名称',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (!vm.data.classDesc) {
    wx.showModal({
      title: '提示',
      content: '请输入课程简介',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (vm.data.classArticleList.length < 1) {
    wx.showModal({
      title: '提示',
      content: '请添加课程包含的项目',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (!vm.data.courseCount) {
    wx.showModal({
      title: '提示',
      content: '请输入培训周期',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (vm.data.courseCount == 0) {
    wx.showModal({
      title: '提示',
      content: '培训周期不能为0',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (!vm.data.courseFee) {
    wx.showModal({
      title: '提示',
      content: '请输入课时费用',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (vm.data.courseFee == 0) {
    wx.showModal({
      title: '提示',
      content: '课时费用不能为0',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  if (vm.data.isCompany && !vm.data.classCoach) {
    wx.showModal({
      title: '提示',
      content: '请选择授课教练',
      showCancel: false
    })
    vm.setData({
      tijiao: true
    })
    return;
  }
  timeRepeat(vm);
};
function getClassEditeInfo(vm) {
  var classId = vm.data.classId
  vm.setData({deitInfo:false})
  wx.request({
    url: app.url + '/v1/class/getClassEditInfo?classId=' + classId,
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      // console.log(res)
      if (res.data.code == '10000') {
        // console.log(res.data.response);
        var data = res.data.response;
        console.log(data);
        let classPhoto = data.classPhoto;
        for (let i = 0; i < classPhoto.length; i++) {
          if (classPhoto[i].defaultPhoto == '1') {
            classPhoto[i].y = false;
          } else {
            classPhoto[i].y = true;
          }
        }
        if (classPhoto.length == 9){
          vm.setData({ uploadPic: false})
        }else{
          vm.setData({ uploadPic: true})
        }
        vm.setData({
          statusIndex: parseInt(data.putawayStatus) - 1,
          dataStatus: data.putawayStatus,
          experienceIndex: data.classExperience,
          dataExperience: data.classExperience,
          typeIndex: parseInt(data.type) - 1,
          dataType: data.type,
          studentNums: data.maxMember,
          // itemIndex: getItemIndex(vm, data.itemId),
          dataItem: data.itemId,
          gradeWillShow: data.itemStudentGrade,
          dataGrade: data.itemStudentGrade,
          gradeShow: util.stringPrefixSet(data.itemStudentGrade, " L"),
          dataHome: data.homeId,
          dataCourse: data.courseTime,
          courseIndex: getCourseTimeIndex(vm, data.courseTime),
          // classSectionList: data.classSection,
          className: data.className,
          classDesc: data.classDescribe,
          classPhotos: classPhoto,
          // uploadPic: false,
          classArticleList: data.classArticle,
          courseCount: data.courseCount,
          courseFee: data.courseCost / 100,
          courseFeeShow: data.courseCost / 100,
          tutorList: data.classTutor,
          classId: data.classId,
          userId: data.userId,
          coachId: data.coachId,
          orgCoachId: data.coachId,
          orgUserId: data.userId,
          haveHomeFeeData:data.haveHomeFee,
          haveHomeFeeIndex: data.haveHomeFee,
          // editeStatus: true,
          // itemListEdite: true,
          homeTf: true,
          classCoach: data.coachSingleInfoVO
        })
        getEditeCoachCertificateSingleList(vm);
        getClassIsCanEditeByClassId(vm, classId, data.classSection);
        getHomeSingleList(vm, vm.data.dataItem);
        getOrgIndex(vm, vm.data.orgUserId);
        // console.log("这是第二个")
        
      }
      if (res.data.code == '30005') {
        wx.navigateTo({
          url: '../../Introduction/Introduction',
        })
      }
    },
    fail: (info) => {
      console.log("请求失败了")
    }
  })
};
function getOrgIndex(vm, orgUserId) {
  let list = vm.data.orgList;
  for (let i = 0; i < list.length; i++) {
    console.log(list[i].orgUserId)
    if (list[i].orgUserId == orgUserId) {
      vm.setData({
        orgIndex: i,
        orgUserId: list[i].orgUserId,
        orgCoachId: list[i].orgCoachId
      })
      break;
    }
  }
};
function getItemIndex(vm, itemId) {
  let list = vm.data.itemList;
  for (let i = 0; i < list.length; i++) {
    if (list[i].itemId == itemId) {
      // setTimeout(function(){
      // console.log("这是第三个")
      getHomeSingleList(vm, itemId)
      // },2000)
      vm.setData({
        itemIndex: i
      })
      break;
    }
  }
};
function getHomeIndex(vm, homeId) {
  // console.log(homeId)
  console.log("来了")
  let list = vm.data.homeList;
  // console.log(list)
  for (let i = 0; i < list.length; i++) {
    if (list[i].homeId == homeId) {
      vm.setData({
        homeIndex: i ? i : 0,
      });
    }
  }
};
function getCourseTimeIndex(vm, courseTime) {
  // console.log(homeId)
  let list = vm.data.courseTime;
  // console.log(list)
  for (let i = 0; i < list.length; i++) {
    if (list[i].value == courseTime) {
      return i;
    }
  }
};
function timeRepeat(vm) {
  var classSectionList = vm.data.classSectionList
  var arr1 = [], arr2 = [], arr3 = [], arr4 = [], arr5 = [], arr6 = [], arr7 = [];
  if (classSectionList.length > 1) {
    for (let i in classSectionList) {
      if (classSectionList[i].weekDay == 1) {
        arr1.push(classSectionList[i])
      } else if (classSectionList[i].weekDay == 2) {
        arr2.push(classSectionList[i])
      } else if (classSectionList[i].weekDay == 3) {
        arr3.push(classSectionList[i])
      } else if (classSectionList[i].weekDay == 4) {
        arr4.push(classSectionList[i])
      } else if (classSectionList[i].weekDay == 5) {
        arr5.push(classSectionList[i])
      } else if (classSectionList[i].weekDay == 6) {
        arr6.push(classSectionList[i])
      } else if (classSectionList[i].weekDay == 7) {
        arr7.push(classSectionList[i])
      }
    }
  } else {
    console.log("selected one date")
    if (Number(classSectionList[0].dayTimeEnd.replace(':', '')) < Number(classSectionList[0].dayTimeStart.replace(":", ''))) {
      wx.showModal({
        title: '提示',
        content: '课程结束时间不能小于开始时间',
        showCancel: false,
      })
      vm.setData({ tijiao: true })
      return false;
    } else {
      tijiao(vm)
      return;
    }
  }

  if (arr1.length > 1) {
    console.log(arr1)
    for (var i = 0; i < arr1.length; i++) {
      //判断结束时间是否大于开始时间
      if (Number(arr1[i].dayTimeEnd.replace(':', '')) < Number(arr1[i].dayTimeStart.replace(":", ''))) {
        wx.showModal({
          title: '提示',
          content: '课程结束时间不能小于开始时间',
          showCancel: false,
        })
        vm.setData({ tijiao: true })
        return false;
      } else {
        //前面的结束时间 
        // var oneStarTime = new Date('2018-06-01 ' + arr1[i].dayTimeStart + ':00');
        // var oneEndTime = new Date('2018-06-01 ' + arr1[i].dayTimeEnd + ':00');
        // for (var j = i + 1; j < arr1.length; j++) {
        //   var twoStarTime = new Date('2018-06-01 ' + arr1[j].dayTimeStart + ':00');
        //   var twoEndTime = new Date('2018-06-01 ' + arr1[j].dayTimeEnd + ':00');
        //   if (timeRepeatUtil(oneStarTime, oneEndTime, twoStarTime, twoEndTime)) {
        //     vm.setData({
        //       duiOr: '不对'
        //     })
        //     wx.showModal({
        //       title: '提示',
        //       content: '您的课程时间有冲突，请检查',
        //       showCancel: false,
        //     })
        //     vm.setData({
        //       tijiao: true
        //     })
        //     return false;
        //   } else {
            vm.setData({ duiOr: '对' })
          // }
        // }
      }
    }

  }
  if (arr2.length > 1) {
    console.log(arr2)
    for (var i = 0; i < arr2.length; i++) {
      //判断结束时间是否大于开始时间
      if (Number(arr2[i].dayTimeEnd.replace(':', '')) < Number(arr2[i].dayTimeStart.replace(":", ''))) {
        console.log("11111111")
        wx.showModal({
          title: '提示',
          content: '课程结束时间不能小于开始时间',
          showCancel: false,
        })
        vm.setData({ tijiao: true })
        return false;
      } else {
        console.log("2222222222")
        //前面的结束时间
        // var oneStarTime = new Date('2018-06-01 ' + arr2[i].dayTimeStart + ':00');
        // var oneEndTime = new Date('2018-06-01 ' + arr2[i].dayTimeEnd + ':00');
        // for (var j = i + 1; j < arr2.length; j++) {
        //   var twoStarTime = new Date('2018-06-01 ' + arr2[j].dayTimeStart + ':00');
        //   var twoEndTime = new Date('2018-06-01 ' + arr2[j].dayTimeEnd + ':00');
        //   if (timeRepeatUtil(oneStarTime, oneEndTime, twoStarTime, twoEndTime)) {
        //     vm.setData({ duiOr: '不对' })
        //     wx.showModal({
        //       title: '提示',
        //       content: '您的课程时间有冲突，请检查',
        //       showCancel: false,
        //     })
        //     vm.setData({
        //       tijiao: true
        //     })
        //     return false;
        //   } else {
            vm.setData({ duiOr: '对' })
          // }
        // }
      }
    }

  }
  if (arr3.length > 1) {
    console.log(arr3)
    for (var i = 0; i < arr3.length; i++) {
      //判断结束时间是否大于开始时间
      if (Number(arr3[i].dayTimeEnd.replace(':', '')) < Number(arr3[i].dayTimeStart.replace(":", ''))) {
        wx.showModal({
          title: '提示',
          content: '课程结束时间不能小于开始时间',
          showCancel: false,
        })
        vm.setData({ tijiao: true })
        return false;
      } else {
        //前面的结束时间
        // var oneStarTime = new Date('2018-06-01 ' + arr3[i].dayTimeStart + ':00');
        // var oneEndTime = new Date('2018-06-01 ' + arr3[i].dayTimeEnd + ':00');
        // for (var j = i + 1; j < arr3.length; j++) {
        //   var twoStarTime = new Date('2018-06-01 ' + arr3[j].dayTimeStart + ':00');
        //   var twoEndTime = new Date('2018-06-01 ' + arr3[j].dayTimeEnd + ':00');
        //   if (timeRepeatUtil(oneStarTime, oneEndTime, twoStarTime, twoEndTime)) {
        //     vm.setData({ duiOr: '不对' })
        //     wx.showModal({
        //       title: '提示',
        //       content: '您的课程时间有冲突，请检查',
        //       showCancel: false,
        //     })
        //     vm.setData({
        //       tijiao: true
        //     })
        //     return false;
        //   } else {
            vm.setData({ duiOr: '对' })
          // }
        // }
      }
    }

  }
  if (arr4.length > 1) {
    console.log(arr4)
    for (var i = 0; i < arr4.length; i++) {
      //判断结束时间是否大于开始时间
      if (Number(arr4[i].dayTimeEnd.replace(':', '')) < Number(arr4[i].dayTimeStart.replace(":", ''))) {
        wx.showModal({
          title: '提示',
          content: '课程结束时间不能小于开始时间',
          showCancel: false,
        })
        vm.setData({ tijiao: true })
        return false;
      } else {
        //前面的结束时间
        // var oneStarTime = new Date('2018-06-01 ' + arr4[i].dayTimeStart + ':00');
        // var oneEndTime = new Date('2018-06-01 ' + arr4[i].dayTimeEnd + ':00');
        // for (var j = i + 1; j < arr4.length; j++) {
        //   var twoStarTime = new Date('2018-06-01 ' + arr4[j].dayTimeStart + ':00');
        //   var twoEndTime = new Date('2018-06-01 ' + arr4[j].dayTimeEnd + ':00');
        //   if (timeRepeatUtil(oneStarTime, oneEndTime, twoStarTime, twoEndTime)) {
        //     vm.setData({ duiOr: '不对' })
        //     wx.showModal({
        //       title: '提示',
        //       content: '您的课程时间有冲突，请检查',
        //       showCancel: false,
        //     })
        //     vm.setData({
        //       tijiao: true
        //     })
        //     return false;
        //   } else {
            vm.setData({ duiOr: '对' })
          // }
        // }
      }
    }

  }
  if (arr5.length > 1) {
    console.log(arr5)
    for (var i = 0; i < arr5.length; i++) {
      //判断结束时间是否大于开始时间
      if (Number(arr5[i].dayTimeEnd.replace(':', '')) < Number(arr5[i].dayTimeStart.replace(":", ''))) {
        wx.showModal({
          title: '提示',
          content: '课程结束时间不能小于开始时间',
          showCancel: false,
        })
        vm.setData({ tijiao: true })
        return false;
      } else {
        //前面的结束时间
        // var oneStarTime = new Date('2018-06-01 ' + arr5[i].dayTimeStart + ':00');
        // var oneEndTime = new Date('2018-06-01 ' + arr5[i].dayTimeEnd + ':00');
        // for (var j = i + 1; j < arr5.length; j++) {
        //   var twoStarTime = new Date('2018-06-01 ' + arr5[j].dayTimeStart + ':00');
        //   var twoEndTime = new Date('2018-06-01 ' + arr5[j].dayTimeEnd + ':00');
        //   if (timeRepeatUtil(oneStarTime, oneEndTime, twoStarTime, twoEndTime)) {
        //     vm.setData({ duiOr: '不对' })
        //     wx.showModal({
        //       title: '提示',
        //       content: '您的课程时间有冲突，请检查',
        //       showCancel: false,
        //     })
        //     vm.setData({
        //       tijiao: true
        //     })
        //     return false;
        //   } else {
            vm.setData({ duiOr: '对' })
          // }
        // }
      }
    }

  }
  if (arr6.length > 1) {
    console.log(arr6)
    for (var i = 0; i < arr6.length; i++) {
      //判断结束时间是否大于开始时间
      if (Number(arr6[i].dayTimeEnd.replace(':', '')) < Number(arr6[i].dayTimeStart.replace(":", ''))) {
        wx.showModal({
          title: '提示',
          content: '课程结束时间不能小于开始时间',
          showCancel: false,
        })
        vm.setData({ tijiao: true })
        return false;
      } else {
        //前面的结束时间
        // var oneStarTime = new Date('2018-06-01 ' + arr6[i].dayTimeStart + ':00');
        // var oneEndTime = new Date('2018-06-01 ' + arr6[i].dayTimeEnd + ':00');
        // for (var j = i + 1; j < arr6.length; j++) {
        //   var twoStarTime = new Date('2018-06-01 ' + arr6[j].dayTimeStart + ':00');
        //   var twoEndTime = new Date('2018-06-01 ' + arr6[j].dayTimeEnd + ':00');
        //   if (timeRepeatUtil(oneStarTime, oneEndTime, twoStarTime, twoEndTime)) {
        //     vm.setData({ duiOr: '不对' })
        //     wx.showModal({
        //       title: '提示',
        //       content: '您的课程时间有冲突，请检查',
        //       showCancel: false,
        //     })
        //     vm.setData({
        //       tijiao: true
        //     })
        //     return false;
        //   } else {
            vm.setData({ duiOr: '对' })
          // }
        // }
      }
    }

  }
  if (arr7.length > 1) {
    console.log(arr7)
    for (var i = 0; i < arr7.length; i++) {
      //判断结束时间是否大于开始时间
      if (Number(arr7[i].dayTimeEnd.replace(':', '')) < Number(arr7[i].dayTimeStart.replace(":", ''))) {
        wx.showModal({
          title: '提示',
          content: '课程结束时间不能小于开始时间',
          showCancel: false,
        })
        vm.setData({ tijiao: true })
        return false;
      } else {
        //前面的结束时间
        // var oneStarTime = new Date('2018-06-01 ' + arr7[i].dayTimeStart + ':00');
        // var oneEndTime = new Date('2018-06-01 ' + arr7[i].dayTimeEnd + ':00');
        // for (var j = i + 1; j < arr7.length; j++) {
        //   var twoStarTime = new Date('2018-06-01 ' + arr7[j].dayTimeStart + ':00');
        //   var twoEndTime = new Date('2018-06-01 ' + arr7[j].dayTimeEnd + ':00');
        //   if (timeRepeatUtil(oneStarTime, oneEndTime, twoStarTime, twoEndTime)) {
        //     vm.setData({ duiOr: '不对' })
        //     wx.showModal({
        //       title: '提示',
        //       content: '您的课程时间有冲突，请检查',
        //       showCancel: false,
        //     })
        //     vm.setData({
        //       tijiao: true
        //     })
        //     return false;
        //   } else {
            vm.setData({ duiOr: '对' })
          // }
        // }
      }
    }

  }
  if (vm.data.duiOr === '对') {
    tijiao(vm);
    return;
  } else if (vm.data.duiOr === '不对') {
    wx.showModal({
      title: '提示',
      content: '您的课程时间有冲突，请检查',
      showCancel: false,
    })
    vm.setData({
      tijiao: true
    })
  }
  if (arr1.length < 2 && arr2.length < 2 && arr3.length < 2 && arr4.length < 2 && arr5.length < 2 && arr6.length < 2 && arr7.length < 2) {
    tijiao(vm);
  }
};
function tijiao(vm) {
  // let photos = vm.data.classPhotos;
  // let photo = photos[0];
  // photo.defaultPhoto = '1';
  // vm.setData({
  //   classPhotos: photos
  // })
  var classList = vm.data.classPhotos
  for (let x = 0; x < classList.length; x++) {
    if (!classList[x].y) {
      classList[x].defaultPhoto = '1'
      classList.unshift(classList.splice(x, 1)[0])
    } else {
      classList[x].defaultPhoto = "0"
    }
  }
  let len = classList.length;
  let lens = classList.length;
  console.log(len)
  let classArr = new Array();
  while ( len-- ) {
    if ( classList[len].defaultPhoto == '0' ){
      classArr.push( 1 )
    }
  }
  if( lens == classArr.length ){
    classList[0].defaultPhoto = '1'
  }
  
  vm.setData({ classPhotos: classList })
  console.log(vm.data.classPhotos)

  wx.request({
    url: app.url + '/v1/class/saveClassInfo',
    data: {
      "classArticle": vm.data.classArticleList,
      "classDescribe": vm.data.classDesc,
      "classExperience": vm.data.dataExperience,
      "classId": vm.data.classId,
      "className": vm.data.className,
      "classPhoto": vm.data.classPhotos,
      "classSection": vm.data.classSectionList,
      "classTutor": vm.data.tutorList,
      "courseCost": vm.data.courseFee * 100,
      "courseCount": vm.data.courseCount,
      "courseTime": vm.data.dataCourse,
      "homeId": vm.data.dataHome,
      "itemId": vm.data.dataItem,
      "itemStudentGrade": vm.data.dataGrade,
      "maxMember": vm.data.studentNums,
      "putawayStatus": vm.data.dataStatus,
      "type": vm.data.dataType,
      "coachId": vm.data.orgCoachId,
      "userId": vm.data.orgUserId,
      "haveHomeFee": vm.data.haveHomeFeeData+'',
      "publishUserId": wx.getStorageSync('userInfo').userId,
      "classType": vm.data.classCoach ? '1' : '0',
      "classCoachUserId": vm.data.classCoach ? vm.data.classCoach.userId : ''
    },
    method: 'POST',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      console.log(res)
      if (res.data.code == '10000') {
        wx.showModal({
          title: '提示',
          content: '保存成功',
          showCancel: false,
          success : (res)=>{
            if (res.confirm){
              wx.navigateBack({ changed: true });//返回上一页  
            }
          }
        })
        // setTimeout(function () {
        //   wx.navigateBack({ changed: true });//返回上一页  
        // }, 1000)
      } else if (res.data.code == '30005') {
        wx.navigateTo({
          url: '../../Introduction/Introduction',
        })
      } else if (res.data.code == '30003'){
        wx.showModal({
          title: '提示',
          content: '您暂时没有权限如此操作',
          showCancel: false
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '提交失败',
          showCancel: false
        })
        vm.setData({
          tijiao: true
        })
      }
    },
    fail: (info) => {
      console.log("请求失败了");
      vm.setData({
        tijiao: true
      })
    }
  })
};
function getTemplet(vm) {
  wx.request({
    url: app.url + '/v1/item/getItemArticleSingleList',
    data: {
      "gradeList": vm.data.dataGrade.split(","),
      "itemId": vm.data.dataItem
    },
    method: 'POST',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      if (res.data.code == '10000') {
        var data = res.data.response;
        // console.log(data)
        vm.setData({
          classArticleList: []
        })
        var classArticleList = vm.data.classArticleList;
        if (classArticleList.length < 1) {
          classArticleList = data;
        } else {
          classArticleList = classArticleList.concat(data);
        }
        vm.setData({
          classArticleList: classArticleList
        })
      }
    },
    fail: (info) => {
      console.log("请求失败了");
    }
  })
};
function getCoachCertificateSingleList(vm) {
  wx.request({
    url: app.url + '/v1/coach/getCoachCertificateSingleListByCoachId',
    data: {
      "coachId": vm.data.orgCoachId,
      "newOrOld": "new"
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      console.log(res)
      if (res.data.code == '10000') {
        var data = res.data.response;
        // console.log(data)
        vm.setData({
          itemList: data,
        })
        if (data.length > 0) {
          vm.setData({
            itemListEdite: false,
            itemList: data,
            itemIndex: 0,
            dataItem: data[0].itemId,
            homeTf: false
          })
          console.log("这是第四个")
          getHomeSingleList(vm, vm.data.dataItem);
          autoClassNameAndDesc(vm);
          // getItemIndex(vm, vm.data.dataItem)
        } else {
          vm.setData({
            itemListEdite: true,
            homeTf: true
          })
        }
      }
      if (res.data.code == '30005') {
        wx.navigateTo({
          url: '../../Introduction/Introduction',
        })
      }
    },
    fail: (info) => {
      console.log("请求失败了");
    }
  })
};
function getEditeCoachCertificateSingleList(vm) {
  wx.request({
    url: app.url + '/v1/coach/getCoachCertificateSingleListByCoachId',
    data: {
      "coachId": vm.data.orgCoachId,
      "newOrOld":"new"
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      // console.log(res)
      if (res.data.code == '10000') {
        var data = res.data.response;
        // console.log(data)
        vm.setData({
          itemList: data
        })
        // if (data.length > 0) {
        //   vm.setData({
        //     itemListEdite: true
        //   })
          getItemIndex(vm, vm.data.dataItem)
        // } else {
        //   vm.setData({
        //     itemListEdite: true,
        //     homeTf: true
        //   })
        // }
      }
      wx.hideLoading();
    },
    fail: (info) => {
      console.log("请求失败了");
    }
  })
};

/* 检查是否为图片 */
function isImage(filepath) {
  var extStart = filepath.lastIndexOf(".");
  var ext = filepath.substring(extStart, filepath.length).toUpperCase();
  if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
    alert("头像只能是bmp,png,gif,jpeg,jpg格式喔");
    return false;
  }
  return true;
}

/* 检查图片大小，不能超过3M,支持IE、filefox、chrome */
function checkFileSize(filepath) {
  var maxsize = 2 * 1024 * 1024;//2M
  var errMsg = "上传的头像文件不能超过2M喔！！！";
  var tipMsg = "您的浏览器暂不支持上传头像，确保上传文件不要超过2M，建议使用IE、FireFox、Chrome浏览器。";

  try {
    var filesize = 0;
    var ua = window.navigator.userAgent;
    if (ua.indexOf("MSIE") >= 1) {
      //IE
      var img = new Image();
      img.src = filepath;
      filesize = img.fileSize;
    } else {
      //file_size = document.getElementById("imageFile").files[0].size;
      filesize = $("#imageFile")[0].files[0].size; //byte
    }

    if (filesize > 0 && filesize > maxsize) {
      alert(errMsg);
      return false;
    } else if (filesize == -1) {
      alert(tipMsg);
      return false;
    }
  } catch (e) {
    alert("图片上传失败，请重试");
    return false;
  }
  return true;
}
//登录
function login(str, num, vm, encryptedData, iv) {
  // console.log(str)
  wx.request({

    url: app.url + '/v1/test/v1/wx/decodeUserInfo',
    data: {
      encryptedData: encryptedData,
      iv: iv,
      sessionId: ''
    },
    method: 'GET',
    ContentType: 'application/json;charset=UTF-8',
    success: (res) => {
      console.log(res)
      // setTimeout(function () {
      //   wx.setStorageSync('userInfo', res.data.response);
      // }, 0);
      if (res.data.code == '10000') {
        var result = res.data.response;
        // wx.setStorageSync('userInfo', result);
        // //判断是否是新用户
        // var isNewUser = result.userType.substr(1, 1);
        // //如果第二位数字等于1说明是学员用户，获取用户账号密码
        // isNewUser == '1' ? userPwd(result.userId, isNewUser, that) : console.log("这可能是新学员")
      }
    },
    fail: (info) => {
      console.log(info)
    }
  })
};
function checkBoxChoose(str, vm) {
  if (str) {
    var arr = str.split(',');
    let itemGrade = vm.data.itemGrade;
    for (let k = 0; k < itemGrade.length; k++) {
      itemGrade[k].checked = false;
    }
    for (let i = 0; i < arr.length; i++) {
      let level = arr[i];
      for (let j = 0; j < itemGrade.length; j++) {
        if (level == itemGrade[j].value) {
          itemGrade[j].checked = true;
        }
      }
    }
    vm.setData({
      itemGrade: itemGrade
    })
  } else {
    console.log("传入参数有误")
    console.log(str);
  }
}
Array.prototype.unique = function () {
  var res = [];
  var json = {};
  for (var i = 0; i < this.length; i++) {
    if (!json[this[i]]) {
      res.push(this[i]);
      json[this[i]] = 1;
    }
  }
  return res;
};
function getOrgInfoList(vm){
  wx.showLoading({
    title: '加载中...',
  })
  wx.request({
    url: app.url + '/v1/coach/getListByUserId',
    data: {
      "userId": wx.getStorageSync('userInfo').userId
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      wx.hideLoading();
      console.log(res)
      if (res.data.code == '10000') {
        let classId = vm.data.classId;
        let editing = vm.data.editing;

        vm.setData({
          orgList: res.data.response,
        })
        if (!vm.data.classId) {
          vm.setData({
            orgIndex:0,
            orgUserId: res.data.response[0].orgUserId,
            orgCoachId: res.data.response[0].orgCoachId
          })
        }

        if (classId && !editing) {
          if (!vm.data.classCoach) {
            getClassEditeInfo(vm);
            vm.setData({
              isCanediteOrg: false
            })
          }
        } else {
          if (wx.getStorageSync("coachBaseInfo").userType == '3'){
            vm.setData({
              isCanediteOrg: false
            })
          }
          getCoachCertificateSingleList(vm)
        };
      }
    },
    fail: (info) => {
      wx.hideLoading();
      console.log("请求失败了");
    }
  })
}



// 字符串转日期
function formatDate(value) {
  var date = new Date(value).Format("yyyy-MM-dd HH:mm");
  if (date == "1970-01-01 08:00")
    return "--";
  else
    return date;
}
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

function getClassIsCanEditeByClassId(vm, classId, classSectionList) {
  wx.request({
    url: app.url + '/v1/class/getClassIsCanEditeByClassId',
    data: {
      "classId": classId
    },
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    success: (res) => {
      console.log(res)
      let data = res.data.response;
      let editeStatus = false;
      let itemListEdite = false;
      if (data == '0') {
        editeStatus = true;
        itemListEdite = true;
      }else{
        // let classSectionList = vm.data.classSectionList;
        for (let i = 0; i < classSectionList.length;i++){
          classSectionList[i].sectionId='';
        }
      }
      vm.setData({
        classSectionList: classSectionList
      })
      vm.setData({
        editeStatus: editeStatus,
        itemListEdite: itemListEdite,
      })
    },
    fail: (info) => {
      console.log("请求失败了");
    }
  })
}
function timeRepeatUtil(leftStartDate, leftEndDate, rightStartDate, rightEndDate) {
  return (
    (leftStartDate.getTime() >= rightStartDate.getTime())
    && leftStartDate.getTime() < rightEndDate.getTime())
    ||
    ((leftStartDate.getTime() > rightStartDate.getTime())
      && leftStartDate.getTime() <= rightEndDate.getTime())
    ||
    ((rightStartDate.getTime() >= leftStartDate.getTime())
      && rightStartDate.getTime() < leftEndDate.getTime())
    ||
    ((rightStartDate.getTime() > leftStartDate.getTime())
      && rightStartDate.getTime() <= leftEndDate.getTime()
    )
};
function autoClassNameAndDesc(vm) {
  let itemId = vm.data.dataItem;
  if (itemId) {
    //羽毛球5，篮球1， 乒乒球8，游泳4
    if (itemId == 1) {
      vm.setData({
        className: '篮球培训',
        classDesc: '学习篮球规则、球性技能、个人战术。促进体格发育和神经肌肉发育。'
      })
    }
    if (itemId == 4) {
      vm.setData({
        className: '游泳培训',
        classDesc: '树立游泳信心，学习游泳理论知识和技术。有助大脑发育，提高肺活量，塑造好的体型。'
      })
    }
    if (itemId == 5) {
      vm.setData({
        className: '羽毛球培训',
        classDesc: '学习羽毛球规则、培养羽毛球球感与各项动作训练。促进骨骼生长发育，提高眼睛视力，锻炼颈椎。'
      })
    }
    if (itemId == 8) {
      vm.setData({
        className: '乒乓球培训',
        classDesc: '学习握拍、准备姿势和运球中的移动步法。塑造良好的心理素质，提高思维的敏捷性。'
      })
    }
  }

}