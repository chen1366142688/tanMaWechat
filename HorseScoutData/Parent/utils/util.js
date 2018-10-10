const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNot(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }
  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const maxNumber = (arr, key) => {
  var max = arr[0][key];
  var len = arr.length;
  for (var i = 1; i < len; i++) {
    if (arr[i][key] > max) {
      max = arr[i][key];
    }
  }
  return max;
}

module.exports = {
  formatTime: formatTime,
  maxNumber: maxNumber,
  formatNot: formatNot ,
  colorArr:['#A188D4','#FDC64B','#42C38A','#72B9E7','#F882B5']
}
