var app = getApp();
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    pptHidden: false,
    portHidden: true,
    bigPreImg: '',
    loopPreImgs: [],
    bottomDisplay: 'block',
    intervalOver: true,
    bottomHidden: false,
    shareAlbumId: '',
    shareUserAlbumId: '',
    refresh: true,
    refreshtip: ''
  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      winWidth: app.globalData.windowWidth,
      winHeight: app.globalData.windowHeight,
      shareAlbumId: options.albumId,
      shareUserAlbumId: options.userAlbumId
    })
    that.from = options.from;
    that.albumId = options.albumId;
    that.userAlbumId = options.userAlbumId;
    that.init()
  },
  init: function (e) {
    let that = this;
    that.setData({
      refreshtip: ''
    })
    let from = that.from;
    let albumId = that.albumId;
    let userAlbumId = that.userAlbumId;
    if (userAlbumId != undefined && from == 1) {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 5000
      })
      setTimeout(function () {
        that.requestData()
      }, 5000)
    } else {
      that.requestData()
    }

  },
  requestData: function (e) {
    let that = this
    let albumId = that.albumId;
    let userAlbumId = that.userAlbumId;
    wx.request({
      url: app.globalData.serverHost + 'dream/album/common/getpreview.json?',
      data: {
        albumId: albumId == undefined ? '' : albumId,
        userAlbumId: userAlbumId == undefined ? '' : userAlbumId
      },
      method: 'GET',
      success: function (res) {
        if (res.data.makeComplete) {
          wx.hideToast()
          that.setData({
            refresh: false,
            loopPreImgs: res.data.loopPreImgs,
            bigPreImg: res.data.bigPreImg
          })
          setTimeout(function () {
            that.setData({
              bottomDisplay: 'none',
              winHeight: that.data.winHeight + 50,
              intervalOver: false,
              bottomHidden: true
            })
          }, 3000)
        } else {
          that.setData({
            refreshtip: '点击页面刷新'
          })
        }
      }
    })
  },
  swichNav: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.id,
      pptHidden: e.currentTarget.dataset.id == 1 ? true : false,
      portHidden: e.currentTarget.dataset.id == 0 ? true : false
    })
    wx.setNavigationBarTitle({
      title: e.currentTarget.dataset.title
    })
  },
  saveImg: function (e) {
    wx.showActionSheet({
      itemList: ['保存到本地'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            wx.showToast({
              title: '下载中...',
              duration: 50000,
              icon: 'loading'
            })
            wx.downloadFile({
              url: e.currentTarget.dataset.src,
              type: 'image', // 下载资源的类型，用于客户端识别处理，有效值：image/audio/video
              // header: {}, // 设置请求的 header
              success: function (ress) {
                wx.saveFile({
                  tempFilePath: ress.tempFilePath,
                  success: function (resl) {
                    console.log(resl);
                    wx.hideToast();
                    wx.showToast({
                      title: '保存成功',
                      icon: 'success',
                      duration: 1000
                    })
                  },
                  fail: function (resx) {
                    console.log("失败");
                    console.log(res);
                  }
                })
              },
              fail: function (nn) {
                console.log("出错了");
                console.log(nn);
              }
            })
          }
        }
      }
    })
  },
  showBottom: function () {
    let that = this;
    if (that.data.intervalOver) {
      return;
    }
    this.setData({
      bottomDisplay: 'block',
      winHeight: that.data.winHeight - 50,
      intervalOver: true,
      bottomHidden: false
    })
    setTimeout(function () {
      that.setData({
        bottomDisplay: 'none',
        winHeight: that.data.winHeight + 50,
        intervalOver: false,
        bottomHidden: true
      })
    }, 2000)
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    if (app.globalData.finishCreateFlag) {
      wx.navigateBack({
        delta: 6
      })
    }
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '分享我的相册',
      desc: '欢迎来参观我的相册，这里有我给你最好的时光！',
      path: '/pages/viewswiper/viewswiper?albumId=' + that.data.shareAlbumId + '&userAlbumId=' + that.data.shareUserAlbumId
    }
  }
})