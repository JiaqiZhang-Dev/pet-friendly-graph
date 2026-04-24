// pages/activity-create/activity-create.ts
Page({
  data: {
    title: '',
    description: '',
    date: '',
    time: '',
    dateDisplay: '',
    location: '',
    maxParticipants: 20,
    isPublishing: false,
    petTypeOptions: [
      { key: 'all', label: '不限', emoji: '🐾' },
      { key: 'dog', label: '狗狗', emoji: '🐕' },
      { key: 'cat', label: '猫咪', emoji: '🐱' },
      { key: 'small', label: '小型犬', emoji: '🐩' },
      { key: 'large', label: '大型犬', emoji: '🦮' },
    ],
    selectedPetTypes: { all: true } as Record<string, boolean>,
  },

  onTitleInput(e: WechatMiniprogram.Input) {
    this.setData({ title: e.detail.value })
  },

  onDescInput(e: WechatMiniprogram.Input) {
    this.setData({ description: e.detail.value })
  },

  onPickDate() {
    var self = this
    wx.showActionSheet({
      itemList: ['选择日期'],
      success: function() {
        // 先选日期
        var now = new Date()
        var y = now.getFullYear()
        var m = String(now.getMonth() + 1).padStart(2, '0')
        var d = String(now.getDate()).padStart(2, '0')
        var today = y + '-' + m + '-' + d

        // WeChat doesn't have native datetime picker, use date + time separately
        self._pickDateThen(today)
      },
    })
  },

  _pickDateThen(today: string) {
    // Use a simple approach: show date picker via wx API workaround
    // For now just set a mock date (real app would use a date picker component)
    var self = this
    var dates = []
    var dateValues = []
    var now = new Date()
    for (var i = 1; i <= 14; i++) {
      var d = new Date(now.getTime() + i * 86400000)
      var month = d.getMonth() + 1
      var day = d.getDate()
      var weekDay = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
      dates.push(month + '月' + day + '日 周' + weekDay)
      dateValues.push(d.getFullYear() + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0'))
    }
    wx.showActionSheet({
      itemList: dates.slice(0, 6),
      success: function(res) {
        var chosenDate = dates[res.tapIndex]
        var chosenValue = dateValues[res.tapIndex]
        self.setData({ date: chosenValue })
        self._pickTime(chosenDate)
      },
    })
  },

  _pickTime(dateStr: string) {
    var self = this
    var times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '19:00']
    wx.showActionSheet({
      itemList: times,
      success: function(res) {
        var time = times[res.tapIndex]
        self.setData({
          time: time,
          dateDisplay: dateStr + ' ' + time,
        })
      },
    })
  },

  onPickLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({ location: res.name || res.address })
      },
    })
  },

  onMaxChange(e: any) {
    this.setData({ maxParticipants: e.detail })
  },

  onTogglePetType(e: WechatMiniprogram.TouchEvent) {
    var key = e.currentTarget.dataset.key as string
    var selected = this.data.selectedPetTypes
    if (key === 'all') {
      // 选不限则清空其他
      this.setData({ selectedPetTypes: { all: true } })
      return
    }
    selected[key] = !selected[key]
    selected['all'] = false
    // 如果全都取消了，回到不限
    var hasAny = false
    var keys = Object.keys(selected)
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] !== 'all' && selected[keys[i]]) hasAny = true
    }
    if (!hasAny) selected['all'] = true
    this.setData({ selectedPetTypes: selected })
  },

  onPublish() {
    if (!this.data.title) {
      wx.showToast({ title: '请输入活动标题', icon: 'none' })
      return
    }
    if (!this.data.dateDisplay) {
      wx.showToast({ title: '请选择活动时间', icon: 'none' })
      return
    }
    if (!this.data.location) {
      wx.showToast({ title: '请选择活动地点', icon: 'none' })
      return
    }

    this.setData({ isPublishing: true })

    // TODO: 提交到云数据库
    setTimeout(() => {
      this.setData({ isPublishing: false })
      wx.showToast({ title: '发布成功', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 1500)
    }, 1000)
  },
})
