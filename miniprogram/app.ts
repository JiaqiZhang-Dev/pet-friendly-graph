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
        // 默认位置：上海人民广场
        this.globalData.location = {
          latitude: 31.2304,
          longitude: 121.4737,
        }
      },
    })
  },
})