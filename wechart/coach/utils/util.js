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

function formatyearmonth(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-');
}
function stringPrefixSet(str, prefix) {

  var arr = str.split(',');
  var set = new Set(arr);
  var newArr = Array.from(set);

  newArr = newArr.map(function (e) { return prefix + e });

  return newArr.join('');
}

module.exports = {
  formatTime: formatTime,
  formatyearmonth: formatyearmonth,
  stringPrefixSet: stringPrefixSet
}
