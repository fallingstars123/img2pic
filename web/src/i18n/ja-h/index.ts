export default {
  // アプリケーションタイトル
  app: {
    title: '画素芸術生成器'
  },

  // ナビゲーションメニュー
  nav: {
    menu: '案内選択肢',
    home: '家',
    homeCaption: '項目紹介',
    pixelArt: '画素芸術生成',
    pixelArtCaption: '画像を画素芸術に変換',
    toolbox: '道具箱',
    toolboxCaption: '実用的道具集合',
    novelAssistant: '小説補助',
    novelAssistantCaption: 'VSCodeを小説執筆道具に',
    checklist: '確認表補助',
    checklistCaption: '確認表管理道具',
    blog: '日誌',
    blogCaption: '技術日誌',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // ホームページ
  home: {
    subtitle: 'AI生成疑似画素芸術を真正画素芸術に変換',
    description: '先進的能量演算法と縁検出技術を使用し、画像内画素格子を知的検出し、真正画素芸術作品を生成。複数演算法と定制参数対応。',
    startConversion: '変換開始',
    learnMore: '詳細確認',
    features: {
      title: '機能',
      energyAlgorithm: {
        title: '能量演算法',
        description: '勾配基盤能量地図生成により画素格子境界を自動検出し、方向性強化と定制参数調整対応。'
      },
      edgeDetection: {
        title: '縁検出',
        description: 'Sobel演算子使用水平垂直縁を検出し、画素格子線を知的識別し、格子寸法自動調整。'
      },
      gridSampling: {
        title: '格子抽出',
        description: '頂点検出通じ規則格子作成し、中心抽出、平均抽出、加重平均等多重抽出模式対応。'
      },
      colorQuantization: {
        title: '色彩量子化',
        description: '類似色彩結合対応知的色彩量子化演算法、定制可能色彩数と類似度閾値対応。'
      },
      parameterAdjustment: {
        title: '参数調整',
        description: '豊富参数選択と即時予覈効果、検出格子線表示调试模式対応。'
      },
      oneClickExport: {
        title: '一鍵輸出',
        description: '処理完了後、高品質画素芸術画像直接下载可能、定制拡大倍率対応。'
      }
    },
    quickStart: {
      title: '迅速開始',
      steps: {
        selectImage: {
          title: '画像選択',
          description: '変換希望画像上伝、一般画像形式対応。'
        },
        selectAlgorithm: {
          title: '演算法選択',
          description: '需要基適切演算法選択、参数調整。'
        },
        processImage: {
          title: '画像処理',
          description: '処理按鈕押下、系統自動画像画素芸術変換。'
        },
        downloadResult: {
          title: '結果下载',
          description: '結果予覈、高品質画素芸術画像下载。'
        }
      }
    }
  },

  // タイトルと説明
  title: {
    pixelSettings: '画素化設定',
    originalImage: '元画像',
    pureEnergyMap: '純粋能量地図',
    energyMapWithGrid: '能量地図与格子線',
    pixelatedResult: '画素化結果'
  },

  // ファイルアップロード
  fileUpload: {
    selectImage: '画像選択',
    selectImageHint: '処理対象画像選択願'
  },

  // ピクセル化パラメータ
  pixelParams: {
    title: '画素化参数',
    energyAlgorithmParams: '能量演算法参数',
    gaussianBlur: '高斯朦朧 (σ)',
    gapTolerance: '間隙許容度',
    minEnergyThreshold: '最小能量閾値',
    smoothWindowSize: '平滑化窓寸法',
    enableEnergyEnhancement: '能量強化有効',
    directionalEnhancement: '方向性強化',
    horizontalEnhancement: '水平強化倍率',
    verticalEnhancement: '垂直強化倍率',
    pixelSize: '画素寸法',
    manualSet: '手動設定',
    autoDetect: '自動検出',
    minPixelSize: '最小画素寸法',
    maxPixelSize: '最大画素寸法'
  },

  // サンプリングモード
  samplingMode: {
    title: '抽出模式',
    generatePixelArt: '画素芸術生成',
    directProportionalSampling: '直接比例抽出（通常画像用）',
    energyMapSampling: '能量地図抽出模式',
    centerSampling: '中心抽出',
    averageSampling: '平均抽出',
    weightedAverage: '加重平均',
    nativeResolution: '原來解像度 (1画素=1格子)',
    upscaleFactor: '拡大倍率',
    auto: '自動',
    weightedRatio: '加重比率',
    directSamplingParams: '直接抽出参数',
    directSamplingDescription: '直接抽出模式通常画像画素芸術変換適合。画素寸法手動設定必要。'
  },

  // 操作ボタン
  actions: {
    startProcessing: '処理開始',
    showEnergyMapAndGrid: '能量地図与格子線表示',
    downloadPureEnergyMap: '純粋能量地図下载',
    downloadEnergyMapWithGrid: '能量地図+格子下载',
    downloadPixelArt: '画素芸術下载',
    close: '閉鎖'
  },

  // ステータス情報
  status: {
    detectedPixelSize: '検出画素寸法',
    detectedGridLines: '検出格子線',
    outputSize: '出力寸法',
    upscaleFactor: '拡大倍率',
    processingComplete: '処理完了！',
    processingFailed: '処理失敗：'
  },

  // デバッグ情報
  debug: {
    info: '情報'
  },

  // 言語切り替え
  language: {
    title: '言語',
    options: {
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      'ja': '日本語',
      'ja-h': '日本語漢字',
      'en': 'English',
      'fr': 'Français',
      'ru': 'Русский'
    }
  }
};
