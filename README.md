# 🐾 Pet-Friendly Map

A WeChat Mini Program that helps pet owners discover pet-friendly places nearby.

[中文版本](#-宠物友好地图)

## ✨ Features

- **🗺️ Pet-Friendly Map** — Browse nearby pet-friendly restaurants, cafés, parks, malls, hotels, pet stores & hospitals on map
- **🤖 AI Smart Add** — Add places via text description or image recognition with auto-extracted pet-friendly tags
- **🐕 Pet Community** — Share moments, check-in walks, and join offline pet events
- **📍 Event Publishing** — Organize pet meetups with date, location, and participant limits
- **🐱 Pet Profiles** — Manage your pets' profiles (breed, gender, etc.) on your personal page
- **⭐ Paw Ratings** — Unique 🐾 five-paw rating system showing how pet-friendly a place is

## 🎨 Design

- **Claymorphism** style — soft, rounded, playful
- Blue theme palette, clean & friendly
- Custom tab bar navigation
- Smooth draggable bottom sheet (WXS gesture)

## 🛠️ Tech Stack

- **Framework**: WeChat Mini Program (Native)
- **Language**: TypeScript
- **UI Library**: [Vant Weapp](https://vant-ui.github.io/vant-weapp/)
- **Map**: Tencent Map SDK
- **Gestures**: WXS smooth drag

## 📁 Project Structure

```
miniprogram/
├── pages/
│   ├── map/              # Map home (bottom sheet + category filter)
│   ├── community/        # Pet community (feed + events)
│   ├── profile/          # Profile (pet management + settings)
│   ├── add-place/        # AI add place
│   ├── place-detail/     # Place detail
│   ├── nearby/           # Nearby places list
│   ├── post-create/      # Create post
│   └── activity-create/  # Create event
├── custom-tab-bar/       # Custom bottom navigation
├── images/               # SVG icon assets
├── utils/                # Utilities
├── app.ts                # App entry
├── app.json              # App config
└── app.wxss              # Global styles (CSS variables)
```

## 🚀 Quick Start

1. Clone the repo
   ```bash
   git clone https://github.com/JiaqiZhang-Dev/pet-friendly-graph.git
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Open the project in **WeChat DevTools**

4. Click **Tools → Build npm**

5. Compile and preview

---

# 🐾 宠物友好地图

一款帮助宠物主人发现身边宠物友好场所的微信小程序。

## ✨ 功能特性

- **🗺️ 宠物友好地图** — 在地图上浏览附近的宠物友好餐厅、咖啡馆、公园、商场、酒店、宠物店、宠物医院
- **🤖 AI 智能添加** — 通过文字描述或图片识别，AI 自动提取地点信息和宠物友好标签
- **🐕 宠物社区** — 发布动态、分享遛弯打卡，参与线下宠物活动
- **📍 活动发布** — 组织线下宠物聚会，设置时间、地点、人数限制
- **🐱 宠物管理** — 在个人主页管理你的宠物档案（品种、性别等）
- **⭐ 爪印评分** — 独特的 🐾 五爪评分系统，直观展示场所宠物友好程度

## 🎨 设计风格

- **Claymorphism** 粘土拟态设计，圆润可爱
- 蓝色主题配色，清新友好
- 自定义底部导航栏
- 可拖拽底部面板（WXS 平滑手势）

## 🛠️ 技术栈

- **框架**: 微信小程序原生开发
- **语言**: TypeScript
- **UI 组件库**: [Vant Weapp](https://vant-ui.github.io/vant-weapp/)
- **地图**: 腾讯地图 SDK
- **手势**: WXS 实现平滑拖拽

## 📄 License

MIT
