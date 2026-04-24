// pages/add-place/add-place.ts
Page({
  data: {
    inputMode: 'text' as 'text' | 'image',
    textContent: '',
    imageUrl: '',
    extractedInfo: null as {
      name: string
      address: string
      type: string
      tags: string[]
    } | null,
    isAnalyzing: false,
    isSubmitting: false,
    colorPrimary: '#3B82F6',
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
    presetTags: [
      '可带宠物', '有宠物推车', '有水碗', '有宠物零食',
      '需牵绳', '可放绳', '户外座位', '宠物友好',
      '有停车场', '可拍照', '无限制', '部分区域限制',
      '宠物美容', '宠物寄养', '24小时', '有宠物厕所',
    ],
    selectedTags: {} as Record<string, boolean>,
    selectedTagList: [] as string[],
    customTagInput: '',
  },

  onSwitchMode(e: WechatMiniprogram.TouchEvent) {
    const mode = e.currentTarget.dataset.mode as 'text' | 'image'
    this.setData({ inputMode: mode })
  },

  onTextInput(e: WechatMiniprogram.Input) {
    this.setData({ textContent: e.detail.value })
  },

  onAnalyzeText() {
    if (!this.data.textContent) return
    this.setData({ isAnalyzing: true })

    // TODO: 接入大模型 API，传入文字内容
    setTimeout(() => {
      this.setData({
        isAnalyzing: false,
        extractedInfo: {
          name: '示例宠物友好餐厅',
          address: '上海市徐汇区某某路123号',
          type: 'restaurant',
          tags: ['宠物友好', '户外座位'],
        },
      })
      // 自动勾选 AI 提取的标签
      this._syncAITags()
      wx.showToast({ title: 'AI识别完成', icon: 'success' })
    }, 2000)
  },

  onChooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({ imageUrl: tempFilePath })
        this._analyzeImage(tempFilePath)
      },
    })
  },

  _analyzeImage(_imagePath: string) {
    this.setData({ isAnalyzing: true })

    // TODO: 接入大模型 API，传入图片
    setTimeout(() => {
      this.setData({
        isAnalyzing: false,
        extractedInfo: {
          name: '示例宠物友好餐厅',
          address: '上海市徐汇区某某路123号',
          type: 'restaurant',
          tags: ['宠物友好', '户外座位'],
        },
      })
      this._syncAITags()
      wx.showToast({ title: 'AI识别完成', icon: 'success' })
    }, 2000)
  },

  // 把 AI 提取的标签同步到选中状态
  _syncAITags() {
    var info = this.data.extractedInfo
    if (!info) return
    var tags = info.tags
    var selected: Record<string, boolean> = {}
    var list: string[] = []
    for (var i = 0; i < tags.length; i++) {
      selected[tags[i]] = true
      list.push(tags[i])
    }
    this.setData({ selectedTags: selected, selectedTagList: list })
  },

  // 切换预设标签
  onToggleTag(e: WechatMiniprogram.TouchEvent) {
    var tag = e.currentTarget.dataset.tag as string
    var selected = this.data.selectedTags
    var list = this.data.selectedTagList.slice()

    if (selected[tag]) {
      selected[tag] = false
      var idx = list.indexOf(tag)
      if (idx > -1) list.splice(idx, 1)
    } else {
      selected[tag] = true
      list.push(tag)
    }
    this.setData({ selectedTags: selected, selectedTagList: list })
  },

  onCustomTagInput(e: WechatMiniprogram.Input) {
    this.setData({ customTagInput: e.detail.value })
  },

  onAddCustomTag() {
    var tag = this.data.customTagInput.trim()
    if (!tag) return
    if (this.data.selectedTags[tag]) {
      wx.showToast({ title: '标签已存在', icon: 'none' })
      return
    }
    var selected = this.data.selectedTags
    var list = this.data.selectedTagList.slice()
    selected[tag] = true
    list.push(tag)
    this.setData({
      selectedTags: selected,
      selectedTagList: list,
      customTagInput: '',
    })
  },

  onRemoveTag(e: WechatMiniprogram.TouchEvent) {
    var tag = e.currentTarget.dataset.tag as string
    var selected = this.data.selectedTags
    var list = this.data.selectedTagList.slice()
    selected[tag] = false
    var idx = list.indexOf(tag)
    if (idx > -1) list.splice(idx, 1)
    this.setData({ selectedTags: selected, selectedTagList: list })
  },

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
    var idx = Number(e.detail.value)
    this.setData({ selectedTypeIndex: idx })
    if (this.data.extractedInfo) {
      this.setData({ 'extractedInfo.type': this.data.placeTypes[idx].key })
    }
  },

  onSubmit() {
    var info = this.data.extractedInfo
    if (!info || !info.name || !info.address) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    // 把选中的标签写入 extractedInfo
    info.tags = this.data.selectedTagList

    this.setData({ isSubmitting: true })

    // TODO: 实际提交到云数据库
    setTimeout(() => {
      this.setData({ isSubmitting: false })
      wx.showToast({ title: '提交成功，审核中', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 1500)
    }, 1000)
  },
})
