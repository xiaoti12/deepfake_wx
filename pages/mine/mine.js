var app = getApp();
Page({
  data: {
    isShowAuth: false,
    userInfo: {},
  },
  onShow() {
    
    var userInfo = app.globalData.userInfo;
    console.log("userInfo:" + userInfo);
    if (userInfo && userInfo.mobile) {
      this.setData({
        userInfo: userInfo
      });
      this.getCount();
    } else {
      wx.showToast({
        icon: "none",
         title: "请登录帐号",
        duration: 1000
      });
      this.setData({
        isShowAuth: true
      });
    }
  },
  getCount() {
    wx.showLoading({
      title: "数据加载中",
      mask: true
    });
    wx.cloud.callFunction({
      name: "user",
      data: {
        action: "getCount"
      },
      success: res => {
        console.log("[云函数] [getCount] : ", res);
        this.setData({
          count: res.result
        });
        console.log("count");
      },
      fail: err => {
        wx.showToast({
          icon: "none",
          title: "数据加载错误",
          duration: 3000
        });
        console.log(err);
      },
      complete: () => {
        wx.hideLoading();
      }
    });
    wx.hideLoading();
  },
  goRecord(e) {
    wx.navigateTo({
      url: "/pages/record/record"
    });
  },
  goHelp(e) {
    wx.navigateTo({
      url: "/pages/help/help"
    });
  },
  goRecharge(e) {
    var userInfo = app.globalData.userInfo;
    if (userInfo && userInfo.mobile) {
      wx.navigateTo({
        url: "/pages/recharge/recharge"
      });
    } else {
      wx.showToast({
        icon: "none",
        title: "请登录帐号",
        duration: 1000
      });
      this.setData({
        isShowAuth: true
      });
    }
  },
  CopyLink(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: res => {
        wx.showToast({
          title: "地址已复制",
          duration: 1000
        });
      }
    });
  },
  handleContact(e) {
    console.log(e.detail.path);
    console.log(e.detail.query);
  },
  onAuthEvent: function(e) {
    console.log("onAuthEvent", e);
    if (e.detail.mobile) {
      this.setData({
        userInfo: e.detail
      });
      this.getCount();
    }
  },
  onPullDownRefresh() {
    this.getCount();
    wx.stopPullDownRefresh();
    //reload
  },
  onShareAppMessage() {
    return {
      title: "臻相",
      path: "/pages/index/index"
    };
  }
});
