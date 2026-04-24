// pages/map/map.ts
import { mockPlaces, placeTypes, typeColorMap } from '../../utils/mock-data'
import type { Place } from '../../utils/mock-data'

const app = getApp<IAppOption>()

interface PlaceWithDistance extends Place {
  distance: number
  distanceText: string
  typeLabel: string
}

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

/** Haversine distance in meters */
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

const PANEL_PEEK = 120    // collapsed: just handle visible
const PANEL_HALF = 380   // half: horizontal card scroll
const PANEL_FULL = 1100  // full: vertical list (≈85vh)

Page({
  data: {
    latitude: 39.9042,
    longitude: 116.4074,
    scale: 14,
    markers: [] as MapMarker[],
    places: [] as PlaceWithDistance[],
    filteredPlaces: [] as PlaceWithDistance[],
    placeTypes: placeTypes,
    selectedType: 'all',
    searchValue: '',
    mapHeight: 0,
    activePlace: '',
    scrollToPlaceId: '',
    // Bottom sheet states
    panelState: 'half' as 'peek' | 'half' | 'full',
    panelHeight: PANEL_HALF,
  },

  _touchStartY: 0,
  _touchStartHeight: 0,

  onLoad() {
    const loc = app.globalData.location
    if (loc) {
      this.setData({
        latitude: loc.latitude,
        longitude: loc.longitude,
      })
    }

    const sysInfo = wx.getSystemInfoSync()
    const placesWithDist = this.computeDistances(mockPlaces)
    this.setData({
      mapHeight: sysInfo.windowHeight,
      places: placesWithDist,
      filteredPlaces: placesWithDist,
    })
    this.updateMarkers(placesWithDist)
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  /** Compute distance from user and sort by nearest */
  computeDistances(places: Place[]): PlaceWithDistance[] {
    const userLat = this.data.latitude
    const userLng = this.data.longitude
    return places
      .map(p => {
        const dist = getDistance(userLat, userLng, p.latitude, p.longitude)
        return {
          ...p,
          distance: dist,
          distanceText: formatDistance(dist),
          typeLabel: this.getTypeLabel(p.type),
        }
      })
      .sort((a, b) => a.distance - b.distance)
  },

  updateMarkers(places: PlaceWithDistance[]) {
    const markers: MapMarker[] = places.map((place, idx) => ({
      id: idx,
      latitude: place.latitude,
      longitude: place.longitude,
      title: place.name,
      iconPath: this.getMarkerIcon(place.type),
      width: 32,
      height: 32,
      callout: {
        content: `${place.name}\n⭐${place.rating} · ${place.typeLabel}`,
        color: '#333333',
        fontSize: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: typeColorMap[place.type] || '#3B82F6',
        bgColor: '#FFFFFF',
        padding: 8,
        display: 'BYCLICK',
        textAlign: 'left',
      },
    }))
    this.setData({ markers })
  },

  getMarkerIcon(_type: string): string {
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
    // Already sorted by distance from computeDistances
    this.setData({ filteredPlaces: filtered })
    this.updateMarkers(filtered)
  },

  // 点击 marker — 高亮底部面板卡片并滚动到该卡片
  onMarkerTap(e: WechatMiniprogram.MarkerTap) {
    const markerId = e.detail.markerId
    const place = this.data.filteredPlaces[markerId]
    if (place) {
      const update: Record<string, any> = {
        activePlace: place.id,
        scrollToPlaceId: `place-${place.id}`,
      }
      // Auto-expand to half if peeked
      if (this.data.panelState === 'peek') {
        update.panelState = 'half'
        update.panelHeight = PANEL_HALF
      }
      this.setData(update)
    }
  },

  // 点击底部面板卡片 — 移动地图到该地点并打开详情
  onPanelCardTap(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string
    const lat = e.currentTarget.dataset.lat as number
    const lng = e.currentTarget.dataset.lng as number

    this.setData({ activePlace: id })

    // 先移动地图居中到该地点
    const mapCtx = wx.createMapContext('petMap')
    mapCtx.moveToLocation({
      latitude: lat,
      longitude: lng,
    })

    // 导航到详情页
    wx.navigateTo({
      url: `/pages/place-detail/place-detail?id=${id}`,
    })
  },

  // 地图区域变化时重新计算距离（基于地图中心点）
  onRegionChange(e: any) {
    if (e.type === 'end' && e.causedBy === 'drag') {
      const mapCtx = wx.createMapContext('petMap')
      mapCtx.getCenterLocation({
        success: (res) => {
          this.setData({
            latitude: res.latitude,
            longitude: res.longitude,
          })
          const updated = this.computeDistances(
            this.data.places.map(p => p as Place)
          )
          this.setData({ places: updated })
          this.applyFilter(this.data.selectedType, this.data.searchValue)
        },
      })
    }
  },

  onPlaceTap(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string
    wx.navigateTo({
      url: `/pages/place-detail/place-detail?id=${id}`,
    })
  },

  moveToLocation() {
    const mapCtx = wx.createMapContext('petMap')
    mapCtx.moveToLocation()
  },

  goNearby() {
    wx.navigateTo({ url: '/pages/nearby/nearby' })
  },

  goAddPlace() {
    wx.navigateTo({ url: '/pages/add-place/add-place' })
  },

  // ===== Bottom Sheet Gestures =====
  onSheetTouchStart(e: WechatMiniprogram.TouchEvent) {
    this._touchStartY = e.touches[0].clientY
    this._touchStartHeight = this.data.panelHeight
  },

  onSheetTouchMove(e: WechatMiniprogram.TouchEvent) {
    const dy = this._touchStartY - e.touches[0].clientY // positive = swipe up
    const ratio = 2 // px → rpx approx
    let newHeight = this._touchStartHeight + dy * ratio
    newHeight = Math.max(PANEL_PEEK, Math.min(PANEL_FULL, newHeight))
    this.setData({ panelHeight: newHeight })
  },

  onSheetTouchEnd(_e: WechatMiniprogram.TouchEvent) {
    const h = this.data.panelHeight
    // Snap to nearest state
    const peekMid = (PANEL_PEEK + PANEL_HALF) / 2
    const halfMid = (PANEL_HALF + PANEL_FULL) / 2
    let state: 'peek' | 'half' | 'full'
    let height: number
    if (h < peekMid) {
      state = 'peek'; height = PANEL_PEEK
    } else if (h < halfMid) {
      state = 'half'; height = PANEL_HALF
    } else {
      state = 'full'; height = PANEL_FULL
    }
    this.setData({ panelState: state, panelHeight: height })
  },

  onSheetHandleTap() {
    // Cycle: peek → half → full → half
    const s = this.data.panelState
    if (s === 'peek') {
      this.setData({ panelState: 'half', panelHeight: PANEL_HALF })
    } else if (s === 'half') {
      this.setData({ panelState: 'full', panelHeight: PANEL_FULL })
    } else {
      this.setData({ panelState: 'half', panelHeight: PANEL_HALF })
    }
  },
})
