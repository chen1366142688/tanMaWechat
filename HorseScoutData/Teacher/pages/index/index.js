Page({ 
  data: {
    content: '',
    KeyboardKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, '·', 0, '<'],
    keyShow: true
  }, 
  //点击界面键盘消失 
  hindKeyboard(){ this.setData({ keyShow: false }); }, 
  //点击输入框，键盘显示 
  showKeyboard(){ this.setData({ keyShow:true }); }, 
  keyTap(e){ 
    let keys=e.currentTarget.dataset.keys, content=this.data.content, len=content.length; 
    switch(keys){ case '·':
  //点击小数点，（注意输入字符串里的是小数点，但是我界面显示的点不是小数点，是居中的点，在中文输入法下按键盘最左边从上往下数的第二个键，也就是数字键1左边的键可以打出居中的点） 
    if (len < 11 && content.indexOf('.') == -1) {
      //如果字符串里有小数点了，则不能继续输入小数点，且控制最多可输入10个字符串 
      if (content.length < 1) {
        //如果小数点是第一个输入，那么在字符串前面补上一个0，让其变成0. 
        content = '0.'; 
      } else {
          //如果不是第一个输入小数点，那么直接在字符串里加上小数点 
          content += '.'; 
      } 
    } 
      break; 
      case '<':
          //如果点击删除键就删除字符串里的最后一个 
          content=content.substr(0,content.length-1); break; default: let Index = content.indexOf('.');
          //小数点在字符串中的位置 
          if (Index==-1||len-Index!=3){
            //这里控制小数点只保留两位 
            if (len < 11) {
              //控制最多可输入10个字符串 
              content += keys; 
            } 
          } 
          break 
        } 
        this.setData({ content }); 
      },
  /** * 生命周期函数--监听页面加载 */ 
  onLoad: function (options) { }, 
  /** * 生命周期函数--监听页面初次渲染完成 */ 
  onReady: function () { }, 
  /** * 生命周期函数--监听页面显示 */ 
  onShow: function () { }, 
  /** * 生命周期函数--监听页面隐藏 */
  onHide: function () { }, 
  /** * 生命周期函数--监听页面卸载 */ 
  onUnload: function () { }, 
  /** * 页面相关事件处理函数--监听用户下拉动作 */ 
  onPullDownRefresh: function () { }, 
  /** * 页面上拉触底事件的处理函数 */ 
  onReachBottom: function () { }, 
  /** * 用户点击右上角分享 */ 
  onShareAppMessage: function () { } 
})