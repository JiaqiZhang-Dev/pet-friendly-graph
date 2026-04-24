// app.ts
App<IAppOption>({
  globalData: {
    location: null as { latitude: number; longitude: number } | null,
  },
  onLaunch() {
    // TODO: 初始化云开发
    // wx.cloud.init({ env: 'your-env-id' })

    wx.login({
      success: (res) => {
        console.log('login code:', res.code)
      },
    })

    this.getLocation()
  },
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.globalData.location = {
          latitude: res.latitude,
          longitude: res.longitude,
        }
      },
      fail: () => {
        // 默认位置：北京天安门
        this.globalData.location = {
          latitude: 39.9042,
          longitude: 116.4074,
        }
      },
    })
  },
})