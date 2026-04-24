// pages/map/map.ts
import { mockPlaces, placeTypes, typeColorMap } from '../../utils/mock-data'
import type { Place } from '../../utils/mock-data'

const app = getApp<IAppOption>()

interface MapMarker {
  id: number
  latitude: number
  longitude: number
  title: string
  iconPath: string
  width: number
  height: number
  callout: {
    content: string
    color: string
    fontSize: number
    borderRadius: number
    borderWidth: number
    borderColor: string
    bgColor: string
    padding: number
    display: string
    textAlign: string
  }
}

Page({
  data: {
    latitude: 39.9042,
    longitude: 116.4074,
    scale: 14,
    markers: [] as MapMarker[],
    places: [] as Place[],
    filteredPlaces: [] as Place[],
    placeTypes: placeTypes,
    selectedType: 'all',
    searchValue: '',
    showList: false,
    mapHeight: 0,
  },

  onLoad() {
    const loc = app.globalData.location
    if (loc) {
      this.setData({
        latitude: loc.latitude,
        longitude: loc.longitude,
      })
    }

    const sysInfo = wx.getWindowInfo()
    this.setData({
      mapHeight: sysInfo.windowHeight,
      places: mockPlaces,
      filteredPlaces: mockPlaces,
    })
    this.updateMarkers(mockPlaces)
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  // 更新地图标记点
  updateMarkers(places: Place[]) {
    const markers: MapMarker[] = places.map((place, idx) => ({
      id: idx,
      latitude: place.latitude,
      longitude: place.longitude,
      title: place.name,
      iconPath: this.getMarkerIcon(place.type),
      width: 32,
      height: 32,
      callout: {
        content: `${place.name}\n⭐${place.rating} · ${this.getTypeLabel(place.type)}`,
        color: '#333333',
        fontSize: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: typeColorMap[place.type] || '#FF6B35',
        bgColor: '#FFFFFF',
        padding: 8,
        display: 'BYCLICK',
        textAlign: 'left',
      },
    }))
    this.setData({ markers })
  },

  getMarkerIcon(_type: string): string {
    // 默认使用一个占位 marker，后续可替换为自定义图标
    return '/images/marker-default.png'
  },

  getTypeLabel(type: string): string {
    const found = placeTypes.find(t => t.key === type)
    return found ? found.label : '其他'
  },

  // 分类筛选
  onFilterType(e: WechatMiniprogram.TouchEvent) {
    const type = e.currentTarget.dataset.type as string
    this.setData({ selectedType: type })
    this.applyFilter(type, this.data.searchValue)
  },

  // 搜索
  onSearchInput(e: WechatMiniprogram.Input) {
    const value = e.detail.value
    this.setData({ searchValue: value })
    this.applyFilter(this.data.selectedType, value)
  },

  onSearchClear() {
    this.setData({ searchValue: '' })
    this.applyFilter(this.data.selectedType, '')
  },

  applyFilter(type: string, keyword: string) {
    let filtered = this.data.places
    if (type !== 'all') {
      filtered = filtered.filter(p => p.type === type)
    }
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase()
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(kw) || p.address.toLowerCase().includes(kw)
      )
    }
    this.setData({ filteredPlaces: filtered })
    this.updateMarkers(filtered)
  },

  // 切换列表/地图视图
  toggleListView() {
    this.setData({ showList: !this.data.showList })
  },

  // 点击 marker
  onMarkerTap(e: WechatMiniprogram.MarkerTap) {
    const markerId = e.detail.markerId
    const place = this.data.filteredPlaces[markerId]
    if (place) {
      wx.navigateTo({
        url: `/pages/place-detail/place-detail?id=${place.id}`,
      })
    }
  },

  // 点击列表项
  onPlaceTap(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string
    wx.navigateTo({
      url: `/pages/place-detail/place-detail?id=${id}`,
    })
  },

  // 回到当前位置
  moveToLocation() {
    const mapCtx = wx.createMapContext('petMap')
    mapCtx.moveToLocation()
  },

  // 查看附近设施
  goNearby() {
    wx.navigateTo({ url: '/pages/nearby/nearby' })
  },

  // 添加地点
  goAddPlace() {
    wx.navigateTo({ url: '/pages/add-place/add-place' })
  },
})
