// components/test-picker/test-picker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    myValue: {
      type: Boolean
    },
    myIndex: {
      type: Number
    },
    isChange: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: ["+","-"],
    value: [0],
    nowCount : 0
  },
  ready: function () {
    this.setData({
      nowCount: this.data.myValue == 0? 0 : 1,
      value: this.data.myValue == 0 ? [0]:[1]
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindChange : function(e){
      this.setData({
        nowCount: e.detail.value[0],
        isChange : true
      })
      this.triggerEvent('sign', { value: this.data.nowCount, index: this.data.myIndex,isChange: this.data.isChange})
    }
  }
})
