// custom-tab-bar/index.ts
Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: '/pages/map/map',
        text: '地图',
        icon: '🗺',
        activeIcon: '🗺️',
      },
      {
        pagePath: '/pages/community/community',
        text: '宠物圈',
        icon: '🐾',
        activeIcon: '🐕',
      },
      {
        pagePath: '/pages/profile/profile',
        text: '我的',
        icon: '😊',
        activeIcon: '🧡',
      },
    ],
  },
  methods: {
    switchTab(e: WechatMiniprogram.TouchEvent) {
      const idx = e.currentTarget.dataset.index as number
      const item = this.data.list[idx]
      wx.switchTab({ url: item.pagePath })
    },
  },
})
