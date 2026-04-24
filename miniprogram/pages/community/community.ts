// pages/community/community.ts
interface Post {
  id: string
  userId: string
  userName: string
  avatar: string
  content: string
  images: string[]
  petType: string
  likes: number
  comments: number
  isLiked: boolean
  createTime: string
  type: 'photo' | 'video' | 'activity'
}

interface Activity {
  id: string
  title: string
  date: string
  location: string
  participants: number
  maxParticipants: number
  description: string
  isJoined: boolean
}

Page({
  data: {
    activeTab: 'feed',
    activeTabIndex: 0,
    tabs: [
      { key: 'feed', label: '动态' },
      { key: 'activity', label: '线下活动' },
    ],
    posts: [
      {
        id: 'p1',
        userId: 'u1',
        userName: '柯基妈妈',
        avatar: '',
        content: '今天带小柯去了新天地，好多人围着拍照，小柯成了明星狗了！🌟',
        images: [],
        petType: '柯基',
        likes: 42,
        comments: 8,
        isLiked: false,
        createTime: '2小时前',
        type: 'photo',
      },
      {
        id: 'p2',
        userId: 'u2',
        userName: '布偶猫主人',
        avatar: '',
        content: '我家布偶第一次出门，在世纪公园的大草坪上玩得很开心~',
        images: [],
        petType: '布偶猫',
        likes: 88,
        comments: 15,
        isLiked: true,
        createTime: '5小时前',
        type: 'photo',
      },
      {
        id: 'p3',
        userId: 'u3',
        userName: '金毛爸爸',
        avatar: '',
        content: '分享一家超棒的宠物友好餐厅，老板还给了狗狗小零食！地址在徐汇区安福路旁边~',
        images: [],
        petType: '金毛',
        likes: 156,
        comments: 23,
        isLiked: false,
        createTime: '昨天',
        type: 'photo',
      },
    ] as Post[],
    activities: [
      {
        id: 'a1',
        title: '🐕 周末宠物社交趴',
        date: '2026年4月26日 14:00',
        location: '世纪公园南门',
        participants: 18,
        maxParticipants: 30,
        description: '带上你的毛孩子，一起来公园玩耍、交朋友！我们准备了小零食和玩具~',
        isJoined: false,
      },
      {
        id: 'a2',
        title: '🐱 猫咪下午茶聚会',
        date: '2026年4月27日 15:00',
        location: 'Manner Coffee 望京店',
        participants: 8,
        maxParticipants: 12,
        description: '猫奴们带着主子来喝咖啡聊天，店里有专门的猫咪区域~',
        isJoined: true,
      },
    ] as Activity[],
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ selected: 1 })
    }
  },

  onSwitchTab(e: WechatMiniprogram.TouchEvent) {
    this.setData({ activeTab: e.currentTarget.dataset.tab as string })
  },

  onTabChange(e: any) {
    const index = e.detail.index as number
    const tabKeys = ['feed', 'activity']
    this.setData({ activeTabIndex: index, activeTab: tabKeys[index] })
  },

  onLikePost(e: WechatMiniprogram.TouchEvent) {
    const idx = e.currentTarget.dataset.index as number
    const post = this.data.posts[idx]
    const newLikes = post.isLiked ? post.likes - 1 : post.likes + 1
    this.setData({
      [`posts[${idx}].isLiked`]: !post.isLiked,
      [`posts[${idx}].likes`]: newLikes,
    })
  },

  onJoinActivity(e: WechatMiniprogram.TouchEvent) {
    const idx = e.currentTarget.dataset.index as number
    const activity = this.data.activities[idx]
    if (activity.isJoined) {
      this.setData({
        [`activities[${idx}].isJoined`]: false,
        [`activities[${idx}].participants`]: activity.participants - 1,
      })
      wx.showToast({ title: '已取消报名', icon: 'none' })
    } else {
      if (activity.participants >= activity.maxParticipants) {
        wx.showToast({ title: '名额已满', icon: 'none' })
        return
      }
      this.setData({
        [`activities[${idx}].isJoined`]: true,
        [`activities[${idx}].participants`]: activity.participants + 1,
      })
      wx.showToast({ title: '报名成功！', icon: 'success' })
    }
  },

  onShareAppMessage() {
    return {
      title: '来宠物圈看看可爱的毛孩子们~',
      path: '/pages/community/community',
    }
  },

  onPublish() {
    wx.navigateTo({ url: '/pages/post-create/post-create' })
  },
})
