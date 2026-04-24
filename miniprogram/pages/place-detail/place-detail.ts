// pages/place-detail/place-detail.ts
import { mockPlaces, mockReviews, placeTypes } from '../../utils/mock-data'
import type { Place, Review } from '../../utils/mock-data'

Page({
  data: {
    place: null as Place | null,
    reviews: [] as Review[],
    levelStars: '' as string,
  },

  onLoad(options: Record<string, string>) {
    const id = options.id
    if (!id) return

    const place = mockPlaces.find(p => p.id === id)
    if (place) {
      const reviews = mockReviews.filter(r => r.placeId === id)
      const levelStars = '🐾'.repeat(place.petFriendlyLevel) + '○'.repeat(5 - place.petFriendlyLevel)
      this.setData({ place, reviews, levelStars })
      wx.setNavigationBarTitle({ title: place.name })
    }
  },

  getTypeLabel(type: string): string {
    const found = placeTypes.find(t => t.key === type)
    return found ? found.label : '其他'
  },

  // 拨打电话
  onCallPhone() {
    const phone = this.data.place?.phone
    if (phone) {
      wx.makePhoneCall({ phoneNumber: phone })
    }
  },

  // 导航
  onNavigate() {
    const place = this.data.place
    if (!place) return
    wx.openLocation({
      latitude: place.latitude,
      longitude: place.longitude,
      name: place.name,
      address: place.address,
      scale: 18,
    })
  },

  // 分享
  onShareAppMessage() {
    const place = this.data.place
    return {
      title: `${place?.name} - 宠物友好地点推荐`,
      path: `/pages/place-detail/place-detail?id=${place?.id}`,
    }
  },
})
