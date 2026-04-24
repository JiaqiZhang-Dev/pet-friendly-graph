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

const PANEL_HALF = 380   // half: shows handle + 1 big card
const PANEL_FULL = 1100  // full: scrollable list

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
    navTop: 0,
    navHeight: 32,
    capsuleRight: 10,
    capsuleWidth: 88,
    searchTop: 0,
    filterTop: 0,
    activePlace: '',
    scrollToPlaceId: '',
    panelState: 'half' as 'half' | 'full',
    panelHeight: PANEL_HALF,
  },

  onLoad() {
    const loc = app.globalData.location
    if (loc) {
      this.setData({
        latitude: loc.latitude,
        longitude: loc.longitude,
      })
    }

    const sysInfo = wx.getSystemInfoSync()
    const menuBtn = wx.getMenuButtonBoundingClientRect()
    const navTop = menuBtn.top
    const navHeight = menuBtn.height
    const capsuleRight = sysInfo.windowWidth - menuBtn.right
    const capsuleWidth = menuBtn.width
    const rpxRatio = sysInfo.windowWidth / 750
    // Banner bottom = navTop + bannerHeight(navHeight+28) + 8px gap
    const bannerBottom = navTop + navHeight + 44 + 8
    // Search bar height ~76rpx
    const searchH = Math.round(76 * rpxRatio)
    const searchTop = bannerBottom
    const filterTop = bannerBottom + searchH + 6
    const placesWithDist = this.computeDistances(mockPlaces)
    this.setData({
      mapHeight: sysInfo.windowHeight,
      navTop: navTop,
      navHeight: navHeight,
      capsuleRight: capsuleRight,
      capsuleWidth: capsuleWidth,
      searchTop: searchTop,
      filterTop: filterTop,
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

  // 点击 marker — 高亮对应卡片
  onMarkerTap(e: WechatMiniprogram.MarkerTap) {
    const markerId = e.detail.markerId
    const place = this.data.filteredPlaces[markerId]
    if (place) {
      this.setData({
        activePlace: place.id,
      })
    }
  },

  // 点击列表卡片 — 跳转详情
  onPlaceTap(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string
    wx.navigateTo({
      url: `/pages/place-detail/place-detail?id=${id}`,
    })
  },

  // 地图区域变化时重新计算距离
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

  // ===== Bottom Sheet =====
  // Called by WXS after drag snap
  onSheetSnap(e: { state: 'half' | 'full'; height: number }) {
    this.setData({
      panelState: e.state,
      panelHeight: e.height,
    })
  },

  onSheetHandleTap() {
    if (this.data.panelState === 'half') {
      this.setData({ panelState: 'full', panelHeight: PANEL_FULL })
    } else {
      this.setData({ panelState: 'half', panelHeight: PANEL_HALF })
    }
  },
})
