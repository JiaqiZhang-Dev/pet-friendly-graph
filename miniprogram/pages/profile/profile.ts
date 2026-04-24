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
      { iconName: 'location-o', label: '我添加的地点', key: 'my-places', bgColor: '#EFF6FF', iconColor: '#3B82F6' },
      { iconName: 'star-o', label: '我的收藏', key: 'favorites', bgColor: '#FFFBEB', iconColor: '#F59E0B' },
      { iconName: 'chat-o', label: '我的评价', key: 'my-reviews', bgColor: '#EFF6FF', iconColor: '#3B82F6' },
      { iconName: 'calendar-o', label: '我的活动', key: 'my-activities', bgColor: '#ECFDF5', iconColor: '#10B981' },
      { iconName: 'setting-o', label: '设置', key: 'settings', bgColor: '#F5F3FF', iconColor: '#8B5CF6' },
      { iconName: 'question-o', label: '帮助与反馈', key: 'help', bgColor: '#FDF2F8', iconColor: '#EC4899' },
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
