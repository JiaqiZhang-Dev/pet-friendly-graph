// pages/post-create/post-create.ts
Page({
  data: {
    content: '',
    images: [] as string[],
    petType: '',
    location: '',
    colorPrimary: '#3B82F6',
    isPublishing: false,
    petTypeOptions: ['柯基', '金毛', '拉布拉多', '泰迪', '哈士奇', '萨摩耶', '柴犬', '边牧',
      '布偶猫', '英短', '美短', '橘猫', '暹罗猫', '中华田园犬', '中华田园猫', '其他'],
    topicOptions: [
      '宠物日常', '遛弯打卡', '宠物友好探店',
      '养宠经验', '宠物美食', '萌宠瞬间',
      '求助问答', '领养代替购买',
    ],
    selectedTopics: {} as Record<string, boolean>,
  },

  onLoad() {
    // 默认获取当前位置
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        // 逆地理编码获取地名（需要腾讯地图 API，先用经纬度占位）
        this.setData({ location: '当前位置 (' + res.latitude.toFixed(4) + ', ' + res.longitude.toFixed(4) + ')' })
      },
    })
  },

  onContentInput(e: WechatMiniprogram.Input) {
    this.setData({ content: e.detail.value })
  },

  onAddImages() {
    var remaining = 9 - this.data.images.length
    if (remaining <= 0) return
    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var newImages = this.data.images.slice()
        for (var i = 0; i < res.tempFiles.length; i++) {
          newImages.push(res.tempFiles[i].tempFilePath)
        }
        this.setData({ images: newImages })
      },
    })
  },

  onRemoveImage(e: WechatMiniprogram.TouchEvent) {
    var idx = e.currentTarget.dataset.index as number
    var images = this.data.images.slice()
    images.splice(idx, 1)
    this.setData({ images: images })
  },

  onChoosePetType() {
    wx.showActionSheet({
      itemList: this.data.petTypeOptions,
      success: (res) => {
        this.setData({ petType: this.data.petTypeOptions[res.tapIndex] })
      },
    })
  },

  onChooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({ location: res.name || res.address })
      },
    })
  },

  onToggleTopic(e: WechatMiniprogram.TouchEvent) {
    var topic = e.currentTarget.dataset.topic as string
    var selected = this.data.selectedTopics
    selected[topic] = !selected[topic]
    this.setData({ selectedTopics: selected })
  },

  onPublish() {
    if (!this.data.content) {
      wx.showToast({ title: '请输入内容', icon: 'none' })
      return
    }
    this.setData({ isPublishing: true })

    // TODO: 实际提交到云数据库
    setTimeout(() => {
      this.setData({ isPublishing: false })
      wx.showToast({ title: '发布成功', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 1500)
    }, 1000)
  },
})
