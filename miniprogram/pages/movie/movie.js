// miniprogram/pages/movie/movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //定义数组接受电影数据
    movieList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //执行云函数发起请求
    wx.cloud.callFunction({
      name: 'movielist',
      //请求云函数携带的参数，起始页和每页记录数
      data: {
        start: this.data.movieList.length,
        count: 10
      }
    }).then(
      res=>{
        console.log(res);
        this.setData({
          //每次请求追加到movielist中
          movieList: this.data.movieList.concat(JSON.parse(res.result).subjects)
        })
      }
    ).catch(
      err=>{
        console.log(err);
      }
    )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})