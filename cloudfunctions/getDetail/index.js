// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

//引入request-promise包
var rp = require('request-promise');

// 云函数入口函数
exports.main = async (event, context) => {
  //请求目标，返回请求结果，可以是http的请求
  //考虑分页的情况，设置起始页和一次请求的条数
  // `...` es6的字符串模板写法，不用使用+号拼接
  //调用时传过来start和count
  return rp(`http://api.douban.com/v2/movie/subject/${event.movieid}?apikey=0df993c66c0c636e29ecbb5344252a4a`)
  .then(function (res) {
    console.log(res);
      return res;
  })
  .catch(function (err) {
      console.log(err);
  });
}