// custom-tab-bar/index.ts
interface TabItem {
  pagePath: string
  text: string
  iconName: string
  activeIconName: string
}

interface TabBarData {
  selected: number
  list: TabItem[]
}

Component<TabBarData>({
  data: {
    selected: 0,
    list: [
      {
        pagePath: '/pages/map/map',
        text: '地图',
        iconName: 'location-o',
        activeIconName: 'location',
      },
      {
        pagePath: '/pages/community/community',
        text: '宠物圈',
        iconName: 'friends-o',
        activeIconName: 'friends',
      },
      {
        pagePath: '/pages/profile/profile',
        text: '我的',
        iconName: 'contact',
        activeIconName: 'manager',
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
