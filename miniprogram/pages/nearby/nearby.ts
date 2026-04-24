// pages/nearby/nearby.ts
import { mockPlaces, placeTypes } from '../../utils/mock-data'
import type { Place } from '../../utils/mock-data'

const app = getApp<IAppOption>()

Page({
  data: {
    facilityTypes: [
      { key: 'pet-hospital', label: '宠物医院', icon: '🏥' },
      { key: 'pet-store', label: '宠物用品', icon: '🛒' },
    ],
    selectedType: 'pet-hospital',
    facilities: [] as Place[],
    latitude: 39.9042,
    longitude: 116.4074,
    markers: [] as any[],
    showMap: true,
  },

  onLoad() {
    const loc = app.globalData.location
    if (loc) {
      this.setData({
        latitude: loc.latitude,
        longitude: loc.longitude,
      })
    }
    this.loadFacilities('pet-hospital')
  },

  onSwitchType(e: WechatMiniprogram.TouchEvent) {
    const type = e.currentTarget.dataset.type as string
    this.setData({ selectedType: type })
    this.loadFacilities(type)
  },

  loadFacilities(type: string) {
    // Mock: 从本地数据筛选，实际会调用腾讯地图 POI 搜索 API
    const facilities = mockPlaces.filter(p => p.type === type)
    const markers = facilities.map((f, idx) => ({
      id: idx,
      latitude: f.latitude,
      longitude: f.longitude,
      title: f.name,
      callout: {
        content: f.name,
        color: '#333',
        fontSize: 12,
        borderRadius: 8,
        bgColor: '#fff',
        padding: 6,
        display: 'ALWAYS',
      },
      width: 28,
      height: 28,
    }))
    this.setData({ facilities, markers })
  },

  toggleView() {
    this.setData({ showMap: !this.data.showMap })
  },

  onFacilityTap(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string
    wx.navigateTo({
      url: `/pages/place-detail/place-detail?id=${id}`,
    })
  },

  getTypeLabel(type: string): string {
    const found = placeTypes.find(t => t.key === type)
    return found ? found.label : '其他'
  },
})
