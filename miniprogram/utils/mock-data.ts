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
    name: '朝阳大悦城',
    type: 'mall',
    address: '北京市朝阳区朝阳北路101号',
    latitude: 39.9219,
    longitude: 116.4966,
    petFriendlyLevel: 4,
    tags: ['可带宠物', '有宠物推车', '部分区域限制'],
    phone: '010-85520000',
    images: [],
    rating: 4.5,
    reviewCount: 128,
    description: '朝阳大悦城允许携带小型宠物进入，需使用宠物推车或宠物包。B1层有宠物友好区域。',
    openTime: '10:00-22:00',
  },
  {
    id: '2',
    name: '三里屯太古里',
    type: 'mall',
    address: '北京市朝阳区三里屯路19号',
    latitude: 39.9334,
    longitude: 116.4543,
    petFriendlyLevel: 5,
    tags: ['宠物友好', '户外区域', '无限制'],
    phone: '010-64176110',
    images: [],
    rating: 4.8,
    reviewCount: 256,
    description: '太古里室外步行街区域对宠物非常友好，多家店铺欢迎宠物进入。',
    openTime: '10:00-22:00',
  },
  {
    id: '3',
    name: 'Wagas 沃歌斯',
    type: 'restaurant',
    address: '北京市朝阳区建国路87号SKP-S 1层',
    latitude: 39.9151,
    longitude: 116.4609,
    petFriendlyLevel: 3,
    tags: ['宠物可入内', '需牵绳', '有水碗'],
    phone: '010-65330088',
    images: [],
    rating: 4.2,
    reviewCount: 67,
    description: '室外露台区域欢迎携带宠物就餐，提供宠物水碗。室内需宠物包。',
    openTime: '08:00-21:00',
  },
  {
    id: '4',
    name: 'Manner Coffee 望京店',
    type: 'cafe',
    address: '北京市朝阳区望京街9号',
    latitude: 39.9889,
    longitude: 116.4744,
    petFriendlyLevel: 4,
    tags: ['宠物友好', '有宠物零食', '可拍照'],
    phone: '',
    images: [],
    rating: 4.6,
    reviewCount: 89,
    description: '非常宠物友好的咖啡厅，提供宠物专用零食和水碗，店内有专门的宠物拍照区域。',
    openTime: '07:30-20:00',
  },
  {
    id: '5',
    name: '奥林匹克森林公园',
    type: 'park',
    address: '北京市朝阳区北辰东路15号',
    latitude: 40.0159,
    longitude: 116.3953,
    petFriendlyLevel: 5,
    tags: ['宠物天堂', '大草坪', '可放绳'],
    phone: '010-64529060',
    images: [],
    rating: 4.9,
    reviewCount: 520,
    description: '北京最受欢迎的宠物友好公园之一，大草坪区域可以放绳奔跑，周末有宠物社交活动。',
    openTime: '全天开放',
  },
  {
    id: '6',
    name: '北京宠颐生动物医院',
    type: 'pet-hospital',
    address: '北京市朝阳区望京西路50号',
    latitude: 39.9850,
    longitude: 116.4680,
    petFriendlyLevel: 5,
    tags: ['24小时', '急诊', '全科'],
    phone: '010-84726611',
    images: [],
    rating: 4.3,
    reviewCount: 342,
    description: '24小时营业的综合性宠物医院，提供内科、外科、骨科、眼科等全科诊疗。',
    openTime: '24小时',
  },
  {
    id: '7',
    name: 'ZOO宠物生活馆',
    type: 'pet-store',
    address: '北京市朝阳区建外SOHO东区B座',
    latitude: 39.9080,
    longitude: 116.4556,
    petFriendlyLevel: 5,
    tags: ['进口粮', '美容', '寄养'],
    phone: '010-58695800',
    images: [],
    rating: 4.4,
    reviewCount: 178,
    description: '综合性宠物生活馆，提供宠物用品、美容洗护、寄养等一站式服务。',
    openTime: '09:00-21:00',
  },
  {
    id: '8',
    name: '北京瑞鹏宠物医院',
    type: 'pet-hospital',
    address: '北京市海淀区中关村南大街2号',
    latitude: 39.9563,
    longitude: 116.3242,
    petFriendlyLevel: 5,
    tags: ['连锁品牌', '体检', '疫苗'],
    phone: '010-62527890',
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
    content: '带我家柯基去了，商场对宠物很友好！B1有专门的宠物区域，还碰到了好多狗狗朋友。',
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
    content: '公园太棒了！大草坪上满满都是狗子，我家金毛玩得不想回家。强烈推荐周末来！',
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
    content: '太古里户外区完全开放，很多餐厅的露天座位都可以带狗子。拍照也超级好看！',
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
