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

var speciesConfig: Record<string, { breeds: string[], emoji: string, color: string, label: string }> = {
  '狗': {
    label: '狗狗',
    breeds: ['柯基', '金毛', '拉布拉多', '泰迪', '哈士奇', '萨摩耶', '柴犬', '边牧', '博美', '法斗', '中华田园犬', '其他'],
    emoji: '🐕',
    color: '#F97316',
  },
  '猫': {
    label: '猫咪',
    breeds: ['布偶猫', '英短', '美短', '橘猫', '暹罗猫', '加菲猫', '缅因猫', '中华田园猫', '其他'],
    emoji: '🐱',
    color: '#A855F7',
  },
  '其他': {
    label: '其他',
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
    showAddPet: false,
    petForm: {
      name: '',
      species: '',
      breed: '',
      gender: '公' as '公' | '母',
    },
    speciesList: [
      { key: '狗', label: '狗狗', emoji: '🐕' },
      { key: '猫', label: '猫咪', emoji: '🐱' },
      { key: '其他', label: '其他', emoji: '🐾' },
    ],
    breedOptions: [] as string[],
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
    var pets = wx.getStorageSync('myPets')
    if (pets) {
      this.setData({ pets: pets })
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ selected: 2 })
    }
    var pets = wx.getStorageSync('myPets')
    if (pets) {
      this.setData({ pets: pets })
    }
  },

  // === 添加宠物 ===
  onAddPet() {
    this.setData({
      showAddPet: true,
      petForm: { name: '', species: '', breed: '', gender: '公' },
      breedOptions: [],
    })
  },

  onCloseAddPet() {
    this.setData({ showAddPet: false })
  },

  onPetNameInput(e: WechatMiniprogram.Input) {
    this.setData({ 'petForm.name': e.detail.value })
  },

  onSelectSpecies(e: WechatMiniprogram.TouchEvent) {
    var key = e.currentTarget.dataset.key as string
    var config = speciesConfig[key]
    this.setData({
      'petForm.species': key,
      'petForm.breed': '',
      breedOptions: config ? config.breeds : [],
    })
  },

  onSelectBreed(e: WechatMiniprogram.TouchEvent) {
    var breed = e.currentTarget.dataset.breed as string
    this.setData({ 'petForm.breed': breed })
  },

  onSelectGender(e: WechatMiniprogram.TouchEvent) {
    var gender = e.currentTarget.dataset.gender as '公' | '母'
    this.setData({ 'petForm.gender': gender })
  },

  onConfirmAddPet() {
    var form = this.data.petForm
    if (!form.name || !form.breed) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    var config = speciesConfig[form.species]
    var pet: Pet = {
      id: 'pet_' + Date.now(),
      name: form.name,
      breed: form.breed,
      emoji: config ? config.emoji : '🐾',
      color: config ? config.color : '#3B82F6',
      gender: form.gender,
      birthday: '',
    }
    var pets = this.data.pets.slice()
    pets.push(pet)
    this.setData({ pets: pets, showAddPet: false })
    wx.setStorageSync('myPets', pets)
    wx.showToast({ title: '添加成功', icon: 'success' })
  },

  // === 编辑/删除宠物 ===
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
    wx.showToast({ title: key + ' 功能开发中', icon: 'none' })
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
