// pages/post-create/post-create.ts
Page({
  data: {
    content: '',
    images: [] as string[],
    petType: '',
    location: '',
    colorPrimary: '#3B82F6',
    isPublishing: false,
    topicOptions: [
      '宠物日常', '遛弯打卡', '宠物友好探店',
      '养宠经验', '宠物美食', '萌宠瞬间',
      '求助问答', '领养代替购买',
    ],
    selectedTopics: {} as Record<string, boolean>,
  },

  onLoad() {
    // 获取当前位置并反解地址
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({ location: '定位中...' })
        // 用腾讯地图 WebService API 反解地址
        var lat = res.latitude
        var lng = res.longitude
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            location: lat + ',' + lng,
            key: 'IXHBZ-BFNWU-JDVVJ-4FQBT-FXT2T-OABQS',
            get_poi: 0,
          },
          success: (apiRes: any) => {
            var data = apiRes.data
            if (data && data.status === 0 && data.result) {
              var addr = data.result.formatted_addresses
              var name = (addr && addr.recommend) || data.result.address || ''
              this.setData({ location: name })
            } else {
              this.setData({ location: '上海市' })
            }
          },
          fail: () => {
            this.setData({ location: '上海市' })
          },
        })
      },
      fail: () => {
        this.setData({ location: '点击选择位置' })
      },
    })
    // 从缓存读取宠物列表，自动选中第一个
    var pets = wx.getStorageSync('myPets') || []
    if (pets.length > 0) {
      this.setData({ petType: pets[0].emoji + ' ' + pets[0].name + '（' + pets[0].breed + '）' })
    }
    this._pets = pets
  },

  _pets: [] as any[],

  onChoosePetType() {
    var pets = this._pets
    if (!pets || pets.length === 0) {
      wx.showModal({
        title: '还没有添加宠物',
        content: '去"我的"页面添加你的毛孩子吧~',
        confirmText: '去添加',
        success: function(res) {
          if (res.confirm) {
            wx.switchTab({ url: '/pages/profile/profile' })
          }
        },
      })
      return
    }
    var names: string[] = []
    for (var i = 0; i < pets.length; i++) {
      names.push(pets[i].emoji + ' ' + pets[i].name + '（' + pets[i].breed + '）')
    }
    var self = this
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        self.setData({ petType: names[res.tapIndex] })
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
