// pages/profile/profile.ts

interface Pet {
  id: string
  name: string
  breed: string
  emoji: string
  color: string
  gender: '公' | '母'
  birthday: string
}

const petBreedOptions: Record<string, { breeds: string[], emoji: string, color: string }> = {
  '狗': {
    breeds: ['柯基', '金毛', '拉布拉多', '泰迪', '哈士奇', '萨摩耶', '柴犬', '边牧', '博美', '法斗', '中华田园犬', '其他'],
    emoji: '🐕',
    color: '#F97316',
  },
  '猫': {
    breeds: ['布偶猫', '英短', '美短', '橘猫', '暹罗猫', '加菲猫', '缅因猫', '中华田园猫', '其他'],
    emoji: '🐱',
    color: '#A855F7',
  },
  '其他': {
    breeds: ['兔子', '仓鼠', '鹦鹉', '乌龟', '其他'],
    emoji: '🐾',
    color: '#3B82F6',
  },
}

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
    pets: [] as Pet[],
    menuItems: [
      { iconName: 'location-o', label: '我添加的地点', key: 'my-places', bgColor: '#EFF6FF', iconColor: '#3B82F6' },
      { iconName: 'star-o', label: '我的收藏', key: 'favorites', bgColor: '#FFFBEB', iconColor: '#F59E0B' },
      { iconName: 'chat-o', label: '我的评价', key: 'my-reviews', bgColor: '#EFF6FF', iconColor: '#3B82F6' },
      { iconName: 'calendar-o', label: '我的活动', key: 'my-activities', bgColor: '#ECFDF5', iconColor: '#10B981' },
      { iconName: 'setting-o', label: '设置', key: 'settings', bgColor: '#F5F3FF', iconColor: '#8B5CF6' },
      { iconName: 'question-o', label: '帮助与反馈', key: 'help', bgColor: '#FDF2F8', iconColor: '#EC4899' },
    ],
  },

  onLoad() {
    // 从本地缓存读取宠物列表
    var pets = wx.getStorageSync('myPets')
    if (pets) {
      this.setData({ pets: pets })
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ selected: 2 })
    }
    // 刷新宠物列表（从其他页面返回时）
    var pets = wx.getStorageSync('myPets')
    if (pets) {
      this.setData({ pets: pets })
    }
  },

  onAddPet() {
    var speciesKeys = Object.keys(petBreedOptions)
    wx.showActionSheet({
      itemList: speciesKeys,
      success: (res) => {
        var species = speciesKeys[res.tapIndex]
        var info = petBreedOptions[species]
        this._selectBreed(species, info)
      },
    })
  },

  _selectBreed(species: string, info: { breeds: string[], emoji: string, color: string }) {
    wx.showActionSheet({
      itemList: info.breeds,
      success: (res) => {
        var breed = info.breeds[res.tapIndex]
        this._inputPetName(breed, info.emoji, info.color)
      },
    })
  },

  _inputPetName(breed: string, emoji: string, color: string) {
    var self = this
    wx.showModal({
      title: '给你的' + breed + '取个名字',
      editable: true,
      placeholderText: '宠物昵称',
      success: function(res) {
        if (res.confirm && res.content) {
          var pet: Pet = {
            id: 'pet_' + Date.now(),
            name: res.content,
            breed: breed,
            emoji: emoji,
            color: color,
            gender: '公',
            birthday: '',
          }
          var pets = self.data.pets.slice()
          pets.push(pet)
          self.setData({ pets: pets })
          wx.setStorageSync('myPets', pets)
          wx.showToast({ title: '添加成功', icon: 'success' })
        }
      },
    })
  },

  onEditPet(e: WechatMiniprogram.TouchEvent) {
    var idx = e.currentTarget.dataset.index as number
    var pet = this.data.pets[idx]
    wx.showActionSheet({
      itemList: ['修改昵称', '删除宠物'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this._renamePet(idx, pet)
        } else if (res.tapIndex === 1) {
          this._removePet(idx, pet)
        }
      },
    })
  },

  _renamePet(idx: number, pet: Pet) {
    var self = this
    wx.showModal({
      title: '修改' + pet.name + '的昵称',
      editable: true,
      placeholderText: pet.name,
      success: function(res) {
        if (res.confirm && res.content) {
          self.setData({ ['pets[' + idx + '].name']: res.content })
          wx.setStorageSync('myPets', self.data.pets)
        }
      },
    })
  },

  _removePet(idx: number, pet: Pet) {
    var self = this
    wx.showModal({
      title: '确认删除',
      content: '确定要删除 ' + pet.name + ' 吗？',
      success: function(res) {
        if (res.confirm) {
          var pets = self.data.pets.slice()
          pets.splice(idx, 1)
          self.setData({ pets: pets })
          wx.setStorageSync('myPets', pets)
          wx.showToast({ title: '已删除', icon: 'success' })
        }
      },
    })
  },

  onMenuTap(e: WechatMiniprogram.TouchEvent) {
    var key = e.currentTarget.dataset.key as string
    wx.showToast({
      title: key + ' 功能开发中',
      icon: 'none',
    })
  },

  onChooseAvatar(e: any) {
    var avatarUrl = e.detail.avatarUrl
    this.setData({ 'userInfo.avatarUrl': avatarUrl })
  },

  onShareAppMessage() {
    return {
      title: '毛孩友好地图 - 发现宠物友好的世界',
      path: '/pages/map/map',
    }
  },
})
