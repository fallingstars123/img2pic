export default {
  // 應用標題
  app: {
    title: '像素藝術生成器'
  },

  // 導覽菜單
  nav: {
    menu: '導覽菜單',
    home: '首頁',
    homeCaption: '項目介紹',
    pixelArt: '像素藝術生成',
    pixelArtCaption: '將圖片轉換為像素藝術',
    toolbox: '工具箱',
    toolboxCaption: '實用工具集合',
    novelAssistant: '小說助手',
    novelAssistantCaption: '讓你的VSCode變成小說寫作利器',
    checklist: '檢查單助手',
    checklistCaption: '檢查單管理工具',
    blog: '部落格',
    blogCaption: '技術部落格',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // 首頁
  home: {
    subtitle: '將AI生成的偽像素畫轉換成真像素畫',
    description: '使用先進的能量演算法和邊緣檢測技術，智能識別圖片中的像素網格，生成真正的像素藝術作品。支援多種演算法和自定義參數。',
    startConversion: '開始轉換',
    learnMore: '了解更多',
    features: {
      title: '功能特點',
      energyAlgorithm: {
        title: '能量演算法',
        description: '基於梯度的能量圖生成，自動檢測像素網格邊界，支援方向性增強和自定義參數調整。'
      },
      edgeDetection: {
        title: '邊緣檢測',
        description: '使用Sobel算子檢測水平和垂直邊緣，智能識別像素網格線，自動調整網格大小。'
      },
      gridSampling: {
        title: '網格採樣',
        description: '通過峰值檢測創建規律網格，支援多種採樣模式，包括中心採樣、平均採樣和加權平均。'
      },
      colorQuantization: {
        title: '顏色量化',
        description: '智能顏色量化演算法，支援相似顏色合併，可自定義顏色數量和相似度閾值。'
      },
      parameterAdjustment: {
        title: '參數調節',
        description: '豐富的參數選項，即時預覽效果，支援除錯模式顯示檢測到的網格線。'
      },
      oneClickExport: {
        title: '一鍵匯出',
        description: '處理完成後可直接下載高品質的像素藝術圖片，支援自定義放大倍數。'
      }
    },
    quickStart: {
      title: '快速開始',
      steps: {
        selectImage: {
          title: '選擇圖片',
          description: '上傳您想要轉換的圖片，支援常見圖片格式。'
        },
        selectAlgorithm: {
          title: '選擇演算法',
          description: '根據您的需求選擇合適的演算法，並調整參數。'
        },
        processImage: {
          title: '處理圖片',
          description: '點擊處理按鈕，系統將自動將圖片轉換為像素藝術。'
        },
        downloadResult: {
          title: '下載結果',
          description: '預覽結果並下載高品質的像素藝術圖片。'
        }
      }
    }
  },

  // 標題和說明
  title: {
    pixelSettings: '像素化設定',
    originalImage: '原始圖片',
    pureEnergyMap: '純能量圖',
    energyMapWithGrid: '能量圖和網格線',
    pixelatedResult: '像素化結果'
  },

  // 檔案上傳
  fileUpload: {
    selectImage: '選擇圖片',
    selectImageHint: '請選擇要處理的圖片'
  },

  // 像素化參數
  pixelParams: {
    title: '像素化參數',
    energyAlgorithmParams: '能量演算法參數',
    gaussianBlur: '高斯模糊 (σ)',
    gapTolerance: '間隙容忍度',
    minEnergyThreshold: '最小能量閾值',
    smoothWindowSize: '平滑視窗大小',
    enableEnergyEnhancement: '啟用能量增強',
    directionalEnhancement: '方向性增強',
    horizontalEnhancement: '水平增強倍數',
    verticalEnhancement: '垂直增強倍數',
    pixelSize: '像素大小',
    manualSet: '手動設定',
    autoDetect: '自動偵測',
    minPixelSize: '最小像素大小',
    maxPixelSize: '最大像素大小'
  },

  // 採樣模式
  samplingMode: {
    title: '採樣模式',
    generatePixelArt: '生成像素畫',
    directProportionalSampling: '直接按比例採樣（適用於普通圖片）',
    energyMapSampling: '能量圖採樣模式',
    centerSampling: '中心採樣',
    averageSampling: '平均採樣',
    weightedAverage: '加權平均',
    nativeResolution: '原生解析度 (1像素=1格)',
    upscaleFactor: '放大倍數',
    auto: '自動',
    weightedRatio: '加權比例',
    directSamplingParams: '直接採樣參數',
    directSamplingDescription: '直接採樣模式適用於普通圖片轉換為像素畫。需要手動設定像素大小。'
  },

  // 操作按鈕
  actions: {
    startProcessing: '開始處理',
    showEnergyMapAndGrid: '顯示能量圖和網格線',
    downloadPureEnergyMap: '下載純能量圖',
    downloadEnergyMapWithGrid: '下載能量圖+網格',
    downloadPixelArt: '下載像素畫',
    close: '關閉'
  },

  // 狀態資訊
  status: {
    detectedPixelSize: '偵測到像素大小',
    detectedGridLines: '偵測到網格線',
    outputSize: '輸出尺寸',
    upscaleFactor: '放大倍數',
    processingComplete: '處理完成！',
    processingFailed: '處理失敗：'
  },

  // 除錯資訊
  debug: {
    info: '提示'
  },

  // 語言切換
  language: {
    title: '語言',
    options: {
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      'ja': '日本語',
      'en': 'English',
      'fr': 'Français',
      'ru': 'Русский'
    }
  }
};