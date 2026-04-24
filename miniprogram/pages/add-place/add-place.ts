// pages/add-place/add-place.ts
Page({
  data: {
    imageUrl: '',
    extractedInfo: null as {
      name: string
      address: string
      type: string
      tags: string[]
    } | null,
    isAnalyzing: false,
    isSubmitting: false,
    placeTypes: [
      { key: 'mall', label: '商场' },
      { key: 'restaurant', label: '餐厅' },
      { key: 'cafe', label: '咖啡厅' },
      { key: 'park', label: '公园' },
      { key: 'hotel', label: '酒店' },
      { key: 'pet-store', label: '宠物店' },
      { key: 'pet-hospital', label: '宠物医院' },
    ],
    selectedTypeIndex: 0,
  },

  // 选择或拍照
  onChooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({ imageUrl: tempFilePath })
        this.analyzeImage(tempFilePath)
      },
    })
  },

  // AI 分析截图
  analyzeImage(_imagePath: string) {
    this.setData({ isAnalyzing: true })

    // TODO: 实际接入大模型 API
    // 这里模拟 AI 分析结果
    setTimeout(() => {
      this.setData({
        isAnalyzing: false,
        extractedInfo: {
          name: '示例宠物友好餐厅',
          address: '北京市朝阳区某某路123号',
          type: 'restaurant',
          tags: ['宠物友好', '户外座位'],
        },
      })
      wx.showToast({ title: 'AI识别完成', icon: 'success' })
    }, 2000)
  },

  // 修改提取的信息
  onNameInput(e: WechatMiniprogram.Input) {
    if (this.data.extractedInfo) {
      this.setData({ 'extractedInfo.name': e.detail.value })
    }
  },

  onAddressInput(e: WechatMiniprogram.Input) {
    if (this.data.extractedInfo) {
      this.setData({ 'extractedInfo.address': e.detail.value })
    }
  },

  onTypeChange(e: WechatMiniprogram.PickerChange) {
    const idx = Number(e.detail.value)
    this.setData({ selectedTypeIndex: idx })
    if (this.data.extractedInfo) {
      this.setData({ 'extractedInfo.type': this.data.placeTypes[idx].key })
    }
  },

  // 提交
  onSubmit() {
    const info = this.data.extractedInfo
    if (!info || !info.name || !info.address) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    this.setData({ isSubmitting: true })

    // TODO: 实际提交到云数据库
    setTimeout(() => {
      this.setData({ isSubmitting: false })
      wx.showToast({ title: '提交成功，审核中', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 1500)
    }, 1000)
  },
})
