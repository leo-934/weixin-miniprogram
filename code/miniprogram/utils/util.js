const getTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const xingqi = date.getDay()
  var xqArray = ['日','一','二','三','四','五','六']
  return year.toString() + ' ' + month.toString() + '月' + day.toString() + '日' + ' 星期'+xqArray[xingqi]
}

module.exports = {
  getTime: getTime
}
