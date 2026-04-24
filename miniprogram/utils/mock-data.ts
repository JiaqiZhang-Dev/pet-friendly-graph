// utils/mock-data.ts

export interface Place {
  id: string
  name: string
  type: 'mall' | 'restaurant' | 'cafe' | 'park' | 'hotel' | 'pet-store' | 'pet-hospital'
  address: string
  latitude: number
  longitude: number
  petFriendlyLevel: number // 1-5
  tags: string[]
  phone: string
  images: string[]
  rating: number
  reviewCount: number
  description: string
  openTime: string
}

export interface Review {
  id: string
  placeId: string
  userId: string
  userName: string
  avatar: string
  rating: number
  content: string
  images: string[]
  createTime: string
}

export const placeTypes = [
  { key: 'all', label: '全部', iconName: 'apps-o' },
  { key: 'mall', label: '商场', iconName: 'shop-o' },
  { key: 'restaurant', label: '餐厅', iconName: 'coupon-o' },
  { key: 'cafe', label: '咖啡厅', iconName: 'hot-o' },
  { key: 'park', label: '公园', iconName: 'flower-o' },
  { key: 'hotel', label: '酒店', iconName: 'hotel-o' },
  { key: 'pet-store', label: '宠物店', iconName: 'shopping-cart-o' },
  { key: 'pet-hospital', label: '宠物医院', iconName: 'shield-o' },
]

export const mockPlaces: Place[] = [
  {
    id: '1',
    name: '上海环球港',
    type: 'mall',
    address: '上海市普陀区中山北路3300号',
    latitude: 31.2398,
    longitude: 121.4215,
    petFriendlyLevel: 4,
    tags: ['可带宠物', '有宠物推车', '部分区域限制'],
    phone: '021-60708888',
    images: [],
    rating: 4.5,
    reviewCount: 128,
    description: '环球港允许携带小型宠物进入，需使用宠物推车或宠物包。多个楼层有宠物友好区域。',
    openTime: '10:00-22:00',
  },
  {
    id: '2',
    name: '新天地',
    type: 'mall',
    address: '上海市黄浦区太仓路181弄',
    latitude: 31.2198,
    longitude: 121.4748,
    petFriendlyLevel: 5,
    tags: ['宠物友好', '户外区域', '无限制'],
    phone: '021-63111155',
    images: [],
    rating: 4.8,
    reviewCount: 256,
    description: '新天地户外步行街区域对宠物非常友好，多家餐厅和酒吧欢迎宠物进入露台区域。',
    openTime: '10:00-22:00',
  },
  {
    id: '3',
    name: 'Wagas 沃歌斯 (淮海路店)',
    type: 'restaurant',
    address: '上海市黄浦区淮海中路333号',
    latitude: 31.2253,
    longitude: 121.4687,
    petFriendlyLevel: 3,
    tags: ['宠物可入内', '需牵绳', '有水碗'],
    phone: '021-54660178',
    images: [],
    rating: 4.2,
    reviewCount: 67,
    description: '室外露台区域欢迎携带宠物就餐，提供宠物水碗。室内需宠物包。',
    openTime: '08:00-21:00',
  },
  {
    id: '4',
    name: 'Manner Coffee 安福路店',
    type: 'cafe',
    address: '上海市徐汇区安福路322号',
    latitude: 31.2168,
    longitude: 121.4438,
    petFriendlyLevel: 4,
    tags: ['宠物友好', '有宠物零食', '可拍照'],
    phone: '',
    images: [],
    rating: 4.6,
    reviewCount: 89,
    description: '安福路上最火的宠物友好咖啡厅，提供宠物专用零食和水碗，门口有专门的拴狗绳挂钩。',
    openTime: '07:30-20:00',
  },
  {
    id: '5',
    name: '世纪公园',
    type: 'park',
    address: '上海市浦东新区锦绣路1001号',
    latitude: 31.2105,
    longitude: 121.5464,
    petFriendlyLevel: 5,
    tags: ['宠物天堂', '大草坪', '可放绳'],
    phone: '021-58955520',
    images: [],
    rating: 4.9,
    reviewCount: 520,
    description: '上海最受欢迎的宠物友好公园之一，大草坪区域可以放绳奔跑，周末有宠物社交活动。',
    openTime: '05:00-21:00',
  },
  {
    id: '6',
    name: '上海申普宠物医院',
    type: 'pet-hospital',
    address: '上海市长宁区天山路310号',
    latitude: 31.2155,
    longitude: 121.4098,
    petFriendlyLevel: 5,
    tags: ['24小时', '急诊', '全科'],
    phone: '021-52655636',
    images: [],
    rating: 4.3,
    reviewCount: 342,
    description: '24小时营业的综合性宠物医院，提供内科、外科、骨科、眼科等全科诊疗服务。',
    openTime: '24小时',
  },
  {
    id: '7',
    name: 'ZOO宠物生活馆',
    type: 'pet-store',
    address: '上海市静安区南京西路1788号',
    latitude: 31.2318,
    longitude: 121.4428,
    petFriendlyLevel: 5,
    tags: ['进口粮', '美容', '寄养'],
    phone: '021-62580088',
    images: [],
    rating: 4.4,
    reviewCount: 178,
    description: '综合性宠物生活馆，提供宠物用品、美容洗护、寄养等一站式服务。',
    openTime: '09:00-21:00',
  },
  {
    id: '8',
    name: '上海瑞鹏宠物医院',
    type: 'pet-hospital',
    address: '上海市徐汇区肇嘉浜路1065号',
    latitude: 31.1955,
    longitude: 121.4490,
    petFriendlyLevel: 5,
    tags: ['连锁品牌', '体检', '疫苗'],
    phone: '021-64078900',
    images: [],
    rating: 4.1,
    reviewCount: 215,
    description: '全国连锁宠物医院，提供健康体检、疫苗接种、绝育手术等服务。',
    openTime: '09:00-21:00',
  },
]

export const mockReviews: Review[] = [
  {
    id: 'r1',
    placeId: '1',
    userId: 'u1',
    userName: '柯基妈妈',
    avatar: '',
    rating: 5,
    content: '带我家柯基去了，商场对宠物很友好！多个楼层都有宠物友好区域，还碰到了好多狗狗朋友。',
    images: [],
    createTime: '2026-04-20',
  },
  {
    id: 'r2',
    placeId: '1',
    userId: 'u2',
    userName: '布偶猫主人',
    avatar: '',
    rating: 4,
    content: '需要把猫放在猫包里才能进去，不过服务人员态度很好。',
    images: [],
    createTime: '2026-04-18',
  },
  {
    id: 'r3',
    placeId: '5',
    userId: 'u3',
    userName: '金毛爸爸',
    avatar: '',
    rating: 5,
    content: '太棒了！大草坪上满满都是狗子，我家金毛玩得不想回家。强烈推荐周末来！',
    images: [],
    createTime: '2026-04-15',
  },
  {
    id: 'r4',
    placeId: '2',
    userId: 'u4',
    userName: '泰迪妈咪',
    avatar: '',
    rating: 5,
    content: '新天地户外区完全开放，很多餐厅的露天座位都可以带狗子。拍照也超级好看！',
    images: [],
    createTime: '2026-04-12',
  },
]

// 地图 Marker 的 callout 和 icon 配色
export const typeColorMap: Record<string, string> = {
  mall: '#6B9E7A',
  restaurant: '#D97B6A',
  cafe: '#8B6F5E',
  park: '#4E7D5B',
  hotel: '#9AD5CA',
  'pet-store': '#B5A8D5',
  'pet-hospital': '#E8A0BF',
}
