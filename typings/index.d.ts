/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    location: { latitude: number; longitude: number } | null
  }
  getLocation: () => void
}