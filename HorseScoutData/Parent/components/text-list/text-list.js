// components/text-list/text-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    paramsFather : {
      type : Object
    },
    paramsList :{
      type : Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    startTest : function(){
      // console.log(this.data.paramsList.testId)
      wx:wx.navigateTo({
        url: '../../../pages/Patriarch/Testing/Testing?childrenid=' + this.data.paramsFather.childId + "&testId=" + this.data.paramsList.testId
      })
    }
  }
})
