export default {
  // アプリケーションタイトル
  app: {
    title: 'ピクセルアート生成器'
  },

  // ナビゲーションメニュー
  nav: {
    menu: 'ナビゲーションメニュー',
    home: 'ホーム',
    homeCaption: 'プロジェクト紹介',
    pixelArt: 'ピクセルアート生成',
    pixelArtCaption: '画像をピクセルアートに変換',
    toolbox: 'ツールボックス',
    toolboxCaption: '実用的なツールコレクション',
    novelAssistant: '小説ヘルパー',
    novelAssistantCaption: 'VSCodeを小説執筆ツールに',
    checklist: 'チェックリストアシスタント',
    checklistCaption: 'チェックリスト管理ツール',
    blog: 'ブログ',
    blogCaption: '技術ブログ',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // ホームページ
  home: {
    subtitle: 'AI生成された疑似ピクセルアートを本物のピクセルアートに変換',
    description: '先進的なエネルギーアルゴリズムとエッジ検出技術を使用して、画像内のピクセルグリッドをインテリジェントに検出し、本物のピクセルアート作品を生成します。複数のアルゴリズムとカスタムパラメータをサポートします。',
    startConversion: '変換開始',
    learnMore: '詳細を見る',
    features: {
      title: '機能',
      energyAlgorithm: {
        title: 'エネルギーアルゴリズム',
        description: '勾配ベースのエネルギーマップ生成により、ピクセルグリッド境界を自動検出し、方向性強化とカスタムパラメータ調整をサポートします。'
      },
      edgeDetection: {
        title: 'エッジ検出',
        description: 'Sobel演算子を使用して水平・垂直エッジを検出し、ピクセルグリッドラインをインテリジェントに識別し、グリッドサイズを自動調整します。'
      },
      gridSampling: {
        title: 'グリッドサンプリング',
        description: 'ピーク検出を通じて規則的なグリッドを作成し、中心サンプリング、平均サンプリング、加重平均など複数のサンプリングモードをサポートします。'
      },
      colorQuantization: {
        title: 'カラー量子化',
        description: '類似色マージングをサポートするインテリジェントカラー量子化アルゴリズムで、カスタマイズ可能なカラー数と類似度しきい値をサポートします。'
      },
      parameterAdjustment: {
        title: 'パラメータ調整',
        description: '豊富なパラメータオプションとリアルタイムプレビュー効果で、検出されたグリッドラインを表示するデバッグモードをサポートします。'
      },
      oneClickExport: {
        title: 'ワンクリックエクスポート',
        description: '処理完了後、高品質のピクセルアート画像を直接ダウンロードでき、カスタム拡大倍率をサポートします。'
      }
    },
    quickStart: {
      title: 'クイックスタート',
      steps: {
        selectImage: {
          title: '画像を選択',
          description: '変換したい画像をアップロードし、一般的な画像フォーマットをサポートします。'
        },
        selectAlgorithm: {
          title: 'アルゴリズムを選択',
          description: 'ニーズに基づいて適切なアルゴリズムを選択し、パラメータを調整します。'
        },
        processImage: {
          title: '画像を処理',
          description: '処理ボタンをクリックすると、システムが自動的に画像をピクセルアートに変換します。'
        },
        downloadResult: {
          title: '結果をダウンロード',
          description: '結果をプレビューし、高品質のピクセルアート画像をダウンロードします。'
        }
      }
    }
  },

  // タイトルと説明
  title: {
    pixelSettings: 'ピクセル化設定',
    originalImage: '元画像',
    pureEnergyMap: '純粋エネルギーマップ',
    energyMapWithGrid: 'エネルギーマップとグリッド線',
    pixelatedResult: 'ピクセル化結果'
  },

  // ファイルアップロード
  fileUpload: {
    selectImage: '画像を選択',
    selectImageHint: '処理する画像を選択してください'
  },

  // ピクセル化パラメータ
  pixelParams: {
    title: 'ピクセル化パラメータ',
    energyAlgorithmParams: 'エネルギーアルゴリズムパラメータ',
    gaussianBlur: 'ガウスぼかし (σ)',
    gapTolerance: 'ギャップ許容度',
    minEnergyThreshold: '最小エネルギー閾値',
    smoothWindowSize: '平滑化ウィンドウサイズ',
    enableEnergyEnhancement: 'エネルギー強化を有効にする',
    directionalEnhancement: '方向性強化',
    horizontalEnhancement: '水平強化倍率',
    verticalEnhancement: '垂直強化倍率',
    pixelSize: 'ピクセルサイズ',
    manualSet: '手動設定',
    autoDetect: '自動検出',
    minPixelSize: '最小ピクセルサイズ',
    maxPixelSize: '最大ピクセルサイズ'
  },

  // サンプリングモード
  samplingMode: {
    title: 'サンプリングモード',
    generatePixelArt: 'ピクセルアートを生成',
    directProportionalSampling: '直接比例サンプリング（通常の画像用）',
    energyMapSampling: 'エネルギーマップサンプリングモード',
    centerSampling: '中心サンプリング',
    averageSampling: '平均サンプリング',
    weightedAverage: '加重平均',
    nativeResolution: 'ネイティブ解像度 (1ピクセル=1マス)',
    upscaleFactor: '拡大倍率',
    auto: '自動',
    weightedRatio: '加重比率',
    directSamplingParams: '直接サンプリングパラメータ',
    directSamplingDescription: '直接サンプリングモードは、通常の画像をピクセルアートに変換する場合に適しています。ピクセルサイズを手動で設定する必要があります。'
  },

  // 操作ボタン
  actions: {
    startProcessing: '処理開始',
    showEnergyMapAndGrid: 'エネルギーマップとグリッド線を表示',
    downloadPureEnergyMap: '純粋エネルギーマップをダウンロード',
    downloadEnergyMapWithGrid: 'エネルギーマップ+グリッドをダウンロード',
    downloadPixelArt: 'ピクセルアートをダウンロード',
    close: '閉じる'
  },

  // ステータス情報
  status: {
    detectedPixelSize: '検出されたピクセルサイズ',
    detectedGridLines: '検出されたグリッド線',
    outputSize: '出力サイズ',
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
      'en': 'English',
      'fr': 'Français',
      'ru': 'Русский'
    }
  }
};