App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请升级微信开发者工具到2.2.3以上版本');
    } else {
      wx.cloud.init({
        env: "你的云环境ID", // 替换为你的云环境ID！！！
        traceUser: true,
      });
    }

    // 获取用户OpenID（全局可用）
    this.getOpenId();

    // 全局数据
    this.globalData = {
      userInfo: null,
      openId: '',
      userScore: 0 // 用户积分
    };
  },

  // 获取用户OpenID
  getOpenId() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.globalData.openId = res.result.openid;
      }
    });
  },

  // 获取用户积分
  getUserScore(callback) {
    const db = wx.cloud.database();
    db.collection('users').where({
      _openid: this.globalData.openId
    }).get().then(res => {
      if (res.data.length > 0) {
        this.globalData.userScore = res.data[0].score || 0;
      } else {
        // 初始化用户积分
        db.collection('users').add({
          data: {
            score: 0,
            lastSignDate: '',
            createTime: db.serverDate()
          }
        }).then(() => {
          this.globalData.userScore = 0;
        });
      }
      callback && callback(this.globalData.userScore);
    });
  }
});