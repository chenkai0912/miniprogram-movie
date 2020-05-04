// miniprogram/pages/comment/comment.js
const db = wx.cloud.database();//初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //定义返回到页面的电影详情数据对象
      detail: {},
      // 评价的内容，字符串
      content: '',
      //评价的默认分数,页面显示时会读取这个值，5颗星
      score: 5,
      //上传的图片,页面获取当做缩略图，页面显示
      images:[],
      //云存储上图片的路径
      fileIDs:[],
      //该电影的id
      movieID: -1
  },
  //内容改变触发的函数,改变的内容会通过event传递过来
  //设置到data的content中，以便提交
  onContentChange: function (event) {
    this.setData({
      content: event.detail
    })
  },
  //改变评分触发的函数,当评分改变，通过event可以获取到
  onScoreChange: function (event) {
    this.setData({
      score: event.detail
    })
  },
  //上传图片
  uploadImg:function() {
    //选择图片
    wx.chooseImage({
      //选择图片的个数
      count: 3,
      //原图，压缩
      sizeType: ['original', 'compressed'],
      //相册，拍照
      sourceType: ['album', 'camera'],
      success: res=> {
        // 图片临时路径
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        this.setData({
          //每次执行拼接图片数组的内容
          images: this.data.images.concat(tempFilePaths)
        })
      }
    })

  },
  //提交评价
  submit: function () {
    wx.showLoading({
      title: '评论中...'
    })
    console.log(this.data.content,this.data.score)

    //上传图片到云存储
    let promiseArr = [];
    //遍历images数组，取每一张图片
    for(let i=0;i<this.data.images.length;i++) {
      //每次遍历都创建promise对象
        promiseArr.push(new Promise((resolve,reject)=>{
          let item = this.data.images[i];
          //上传文件的后缀
          let suffix = /\.\w+$/.exec(item)[0]; //正则，返回文件扩展名
          //调用云函数的上传方法
          wx.cloud.uploadFile({
            cloudPath: new Date().getTime()+suffix,
            filePath: item, // 遍历出的图片的临时路径
            success: res => {
              // get resource ID
              console.log(res.fileID)
              this.setData({
                fileIDs: this.data.fileIDs.concat(res.fileID)
              });
              resolve();
            },
            fail: err => {
              // handle error
            }
          })
        }));
    }
    //当循环完，所有图片都插入云存储并返回了路径后，再将图片路径插入数据库
    Promise.all(promiseArr).then(res=>{
      //插入数据
      db.collection('comment').add({
        data: {
          //数据包含：文字评价、评分、哪个电影id、图片地址
          content: this.data.content,
          score: this.data.score,
          movieID:this.data.movieID,
          fileIDs: this.data.fileIDs
        }
      }).then(res=>{
        wx.hideLoading();
        wx.showToast({
          title: '评价成功',
        })
      }).catch(err=>{
        wx.hideLoading();
        wx.showToast({
          title: '评价失败',
        })
      })
    });
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieID: options.movieid
    })
      console.log(options);
      //调用电影详情云函数
      wx.cloud.callFunction({
        name: 'getDetail',
        //携带电影的id参数
        data: {
          movieid: options.movieid
        }
      }).then(
        res=>{
          console.log(res);
          this.setData({
            detail: JSON.parse(res.result)
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