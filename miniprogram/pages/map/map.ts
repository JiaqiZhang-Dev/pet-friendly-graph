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
    activePlaceData: null as PlaceWithDistance | null,
    polyline: [] as any[],
    scrollToPlaceId: '',
    panelState: 'half' as 'half' | 'full',
    panelHeight: PANEL_HALF,
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync()
    const menuBtn = wx.getMenuButtonBoundingClientRect()
    const navTop = menuBtn.top
    const navHeight = menuBtn.height
    const capsuleRight = sysInfo.windowWidth - menuBtn.right
    const capsuleWidth = menuBtn.width
    const rpxRatio = sysInfo.windowWidth / 750
    const bannerBottom = navTop + navHeight + 44 + 8
    const searchH = Math.round(76 * rpxRatio)
    const searchTop = bannerBottom
    const filterTop = bannerBottom + searchH + 6
    this.setData({
      mapHeight: sysInfo.windowHeight,
      navTop: navTop,
      navHeight: navHeight,
      capsuleRight: capsuleRight,
      capsuleWidth: capsuleWidth,
      searchTop: searchTop,
      filterTop: filterTop,
    })

    // 获取用户位置，定位到最近宠物友好地点
    this.locateAndZoom()
  },

  /** 获取位置 → 计算距离 → 移到最近地点 */
  locateAndZoom() {
    const initWithLocation = (lat: number, lng: number) => {
      this.setData({ latitude: lat, longitude: lng })
      const placesWithDist = this.computeDistances(mockPlaces)
      this.setData({
        places: placesWithDist,
        filteredPlaces: placesWithDist,
      })
      this.updateMarkers(placesWithDist)
      // 自动移动到最近的地点
      if (placesWithDist.length > 0) {
        const nearest = placesWithDist[0]
        const mapCtx = wx.createMapContext('petMap')
        mapCtx.moveToLocation({
          latitude: nearest.latitude,
          longitude: nearest.longitude,
        })
        this.setData({
          latitude: nearest.latitude,
          longitude: nearest.longitude,
          activePlace: nearest.id,
          scale: 16,
        })
      }
    }

    // 先检查 app.globalData 是否已有位置
    const loc = app.globalData.location
    if (loc) {
      initWithLocation(loc.latitude, loc.longitude)
      return
    }

    // 主动获取位置
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        app.globalData.location = {
          latitude: res.latitude,
          longitude: res.longitude,
        }
        initWithLocation(res.latitude, res.longitude)
      },
      fail: () => {
        // 用户拒绝授权，使用默认位置
        initWithLocation(this.data.latitude, this.data.longitude)
      },
    })
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

  // 点击 marker — 选中地点并显示路线
  onMarkerTap(e: WechatMiniprogram.MarkerTap) {
    const markerId = e.detail.markerId
    const place = this.data.filteredPlaces[markerId]
    if (place) {
      this.selectPlace(place)
    }
  },

  // 点击列表卡片 — 选中地点，地图定位并显示路线
  onPlaceTap(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string
    const place = this.data.filteredPlaces.find(function(p) { return p.id === id })
    if (place) {
      this.selectPlace(place)
    }
  },

  /** 选中地点：地图居中、画路线、高亮卡片 */
  selectPlace(place: PlaceWithDistance) {
    const userLat = app.globalData.location ? app.globalData.location.latitude : this.data.latitude
    const userLng = app.globalData.location ? app.globalData.location.longitude : this.data.longitude

    // 画从用户位置到目标地点的路线（直线）
    const polyline = [{
      points: [
        { latitude: userLat, longitude: userLng },
        { latitude: place.latitude, longitude: place.longitude },
      ],
      color: '#3B82F6',
      width: 6,
      dottedLine: true,
      arrowLine: true,
      borderColor: '#2563EB',
      borderWidth: 2,
    }]

    this.setData({
      activePlace: place.id,
      activePlaceData: place,
      polyline: polyline,
    })

    // 地图包含用户和目标两个点
    const mapCtx = wx.createMapContext('petMap')
    mapCtx.includePoints({
      points: [
        { latitude: userLat, longitude: userLng },
        { latitude: place.latitude, longitude: place.longitude },
      ],
      padding: [160, 60, 400, 60],
    })
  },

  /** 打开微信导航 */
  onNavigate() {
    const place = this.data.activePlaceData
    if (!place) return
    wx.openLocation({
      latitude: place.latitude,
      longitude: place.longitude,
      name: place.name,
      address: place.address,
      scale: 16,
    })
  },

  /** 清除路线和选中状态 */
  onClearRoute() {
    this.setData({
      activePlace: '',
      activePlaceData: null,
      polyline: [],
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
