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
  //将加载电影列表的函数提取出来
  getMovieList: function () {
    wx.showLoading({
      title: '精彩马上呈现...',
    })
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
        //加载成功后，隐藏进度框
        wx.hideLoading();
      }).catch(
      err=>{
        console.log(err);
        wx.hideLoading();

      }
    )
  },
  //获取电影详情
  gotoCommet: function (event) {
    //跳转到comment详情页，保留当前页，又返回按钮
    //传入movieid
    wx.navigateTo({
      url: `../comment/comment?movieid=${event.target.dataset.movieid}`
    })
  },
  onLoad: function (options) {
    //执行云函数发起请求
    this.getMovieList();
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
    //执行云函数发起请求
    this.getMovieList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})