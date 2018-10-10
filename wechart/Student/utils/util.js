const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function stringPrefixSet(str,prefix){
  
  var arr = str.split(',');
  var set = new Set(arr);
  var newArr = Array.from(set);
  
  newArr = newArr.map(function (e) { return prefix + e });
  
  return newArr.join('');
}

function buttonClicked(self) {
  self.setData({
    buttonClicked: true
  })
  setTimeout(function () {
    self.setData({
      buttonClicked: false
    })
  }, 2000)
}
/**
* 获取上一个月
 ** @date 格式为yyyy-mm-dd的日期，如：2014-01-25
*/
function getPreMonth(date) {
  if (date.indexOf('-') == -1) { throw new Error('需要yyyy-mm-dd格式！');}
  var arr = date.split('-');
  var year = arr[0]; //获取当前日期的年份
  var month = arr[1]; //获取当前日期的月份
  var day = arr[2]; //获取当前日期的日
  var days = new Date(year, month, 0);
  days = days.getDate(); //获取当前日期中月的天数
  var year2 = year;
  var month2 = parseInt(month) - 1;
  if (month2 == 0) {
    year2 = parseInt(year2) - 1;
    month2 = 12;
  }
  var day2 = day;
  var days2 = new Date(year2, month2, 0);
  days2 = days2.getDate();
  if (day2 > days2) {
    day2 = days2;
  }
  if (month2 < 10) {
    month2 = '0' + month2;
  }
  // var t2 = year2 + '-' + month2 + '-' + day2;
  var t2 = year2 + '-' + month2;
  return t2;
}

/**
* 获取下一个月
** @date 格式为yyyy-mm-dd的日期，如：2014-01-25
*/
function getNextMonth(date) {
  if (date.indexOf('-') == -1) { throw new Error('需要yyyy-mm-dd格式！'); }
  var arr = date.split('-');
  var year = arr[0]; //获取当前日期的年份
  var month = arr[1]; //获取当前日期的月份
  var day = arr[2]; //获取当前日期的日
  var days = new Date(year, month, 0);
  days = days.getDate(); //获取当前日期中的月的天数
  var year2 = year;
  var month2 = parseInt(month) + 1;
  if (month2 == 13) {
    year2 = parseInt(year2) + 1;
    month2 = 1;
  }
  var day2 = day;
  var days2 = new Date(year2, month2, 0);
  days2 = days2.getDate();
  if (day2 > days2) {
    day2 = days2;
  }
  if (month2 < 10) {
    month2 = '0' + month2;
  }

  // var t2 = year2 + '-' + month2 + '-' + day2;
  var t2 = year2 + '-' + month2;
  return t2;
}

module.exports = {
  buttonClicked: buttonClicked,
  formatTime: formatTime,
  stringPrefixSet: stringPrefixSet,
  getPreMonth:getPreMonth,
  getNextMonth: getNextMonth
}
