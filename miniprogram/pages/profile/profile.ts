// pages/profile/profile.ts
Page({
  data: {
    userInfo: {
      nickName: '宠物爱好者',
      avatarUrl: '',
    },
    stats: {
      places: 3,
      reviews: 8,
      activities: 2,
    },
    menuItems: [
      { icon: '📍', label: '我添加的地点', key: 'my-places' },
      { icon: '⭐', label: '我的收藏', key: 'favorites' },
      { icon: '💬', label: '我的评价', key: 'my-reviews' },
      { icon: '📅', label: '我的活动', key: 'my-activities' },
      { icon: '⚙️', label: '设置', key: 'settings' },
      { icon: '❓', label: '帮助与反馈', key: 'help' },
    ],
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  onMenuTap(e: WechatMiniprogram.TouchEvent) {
    const key = e.currentTarget.dataset.key as string
    wx.showToast({
      title: `${key} 功能开发中`,
      icon: 'none',
    })
  },

  onChooseAvatar(e: any) {
    const { avatarUrl } = e.detail
    this.setData({ 'userInfo.avatarUrl': avatarUrl })
  },

  onShareAppMessage() {
    return {
      title: '毛孩友好地图 - 发现宠物友好的世界',
      path: '/pages/map/map',
    }
  },
})
