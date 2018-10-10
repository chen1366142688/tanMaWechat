// components/test-picker/test-picker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    myIndex : {
      type : Number
    },
    myValue : {
      type : Number
    },
    isChange : {
      type : Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    value: [10],
    nowCount : 0
  },
  ready: function () {
    this.setData({
      value: this.data.myValue ? [this.data.myValue + 10] : [10],
      nowCount: this.data.myValue ? this.data.myValue : 0
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindChange : function(e){
      this.setData({
        nowCount: e.detail.value[0] >= 10 ? e.detail.value[0] - 10 : e.detail.value[0],
        isChange : true
      })
      this.triggerEvent('myValue', { value: this.data.nowCount, index: this.data.myIndex, isChange: this.data.isChange})
    }
  }
})
