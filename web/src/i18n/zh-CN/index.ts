export default {
  // 应用标题
  app: {
    title: '像素艺术生成器'
  },

  // 导航菜单
  nav: {
    menu: '导航菜单',
    home: '首页',
    homeCaption: '项目介绍',
    pixelArt: '像素艺术生成',
    pixelArtCaption: '将图片转换为像素艺术',
    toolbox: '工具箱',
    toolboxCaption: '实用工具集合',
    novelAssistant: '小说助手',
    novelAssistantCaption: '让你的VSCode变成小说写作利器',
    checklist: '检查单助手',
    checklistCaption: '检查单管理工具',
    blog: '博客',
    blogCaption: '技术博客',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // 首页
  home: {
    subtitle: '将AI生成的伪像素画转换成真像素画',
    description: '使用先进的能量算法和边缘检测技术，智能识别图片中的像素网格，生成真正的像素艺术作品。支持多种算法和自定义参数。',
    startConversion: '开始转换',
    learnMore: '了解更多',
    features: {
      title: '功能特点',
      energyAlgorithm: {
        title: '能量算法',
        description: '基于梯度的能量图生成，自动检测像素网格边界，支持方向性增强和自定义参数调整。'
      },
      edgeDetection: {
        title: '边缘检测',
        description: '使用Sobel算子检测水平和垂直边缘，智能识别像素网格线，自动调整网格大小。'
      },
      gridSampling: {
        title: '网格采样',
        description: '通过峰值检测创建规律网格，支持多种采样模式，包括中心采样、平均采样和加权平均。'
      },
      colorQuantization: {
        title: '颜色量化',
        description: '智能颜色量化算法，支持相似颜色合并，可自定义颜色数量和相似度阈值。'
      },
      parameterAdjustment: {
        title: '参数调节',
        description: '丰富的参数选项，实时预览效果，支持调试模式显示检测到的网格线。'
      },
      oneClickExport: {
        title: '一键导出',
        description: '处理完成后可直接下载高质量的像素艺术图片，支持自定义放大倍数。'
      }
    },
    quickStart: {
      title: '快速开始',
      steps: {
        selectImage: {
          title: '选择图片',
          description: '上传您想要转换的图片，支持常见图片格式。'
        },
        selectAlgorithm: {
          title: '选择算法',
          description: '根据您的需求选择合适的算法，并调整参数。'
        },
        processImage: {
          title: '处理图片',
          description: '点击处理按钮，系统将自动将图片转换为像素艺术。'
        },
        downloadResult: {
          title: '下载结果',
          description: '预览结果并下载高质量的像素艺术图片。'
        }
      }
    }
  },

  // 标题和说明
  title: {
    pixelSettings: '像素化设置',
    originalImage: '原始图片',
    pureEnergyMap: '纯能量图',
    energyMapWithGrid: '能量图和网格线',
    pixelatedResult: '像素化结果'
  },

  // 文件上传
  fileUpload: {
    selectImage: '选择图片',
    selectImageHint: '请选择要处理的图片'
  },

  // 像素化参数
  pixelParams: {
    title: '像素化参数',
    energyAlgorithmParams: '能量算法参数',
    gaussianBlur: '高斯模糊 (σ)',
    gapTolerance: '间隙容忍度',
    minEnergyThreshold: '最小能量阈值',
    smoothWindowSize: '平滑窗口大小',
    enableEnergyEnhancement: '启用能量增强',
    directionalEnhancement: '方向性增强',
    horizontalEnhancement: '水平增强倍数',
    verticalEnhancement: '垂直增强倍数',
    pixelSize: '像素大小',
    manualSet: '手动设置',
    autoDetect: '自动检测',
    minPixelSize: '最小像素大小',
    maxPixelSize: '最大像素大小'
  },

  // 采样模式
  samplingMode: {
    title: '采样模式',
    generatePixelArt: '生成像素画',
    directProportionalSampling: '直接按比例采样（适用于普通图片）',
    energyMapSampling: '能量图采样模式',
    centerSampling: '中心采样',
    averageSampling: '平均采样',
    weightedAverage: '加权平均',
    nativeResolution: '原生分辨率 (1像素=1格)',
    upscaleFactor: '放大倍数',
    auto: '自动',
    weightedRatio: '加权比例',
    directSamplingParams: '直接采样参数',
    directSamplingDescription: '直接采样模式适用于普通图片转换为像素画。需要手动设置像素大小。'
  },

  // 操作按钮
  actions: {
    startProcessing: '开始处理',
    showEnergyMapAndGrid: '显示能量图和网格线',
    downloadPureEnergyMap: '下载纯能量图',
    downloadEnergyMapWithGrid: '下载能量图+网格',
    downloadPixelArt: '下载像素画',
    close: '关闭'
  },

  // 状态信息
  status: {
    detectedPixelSize: '检测到像素大小',
    detectedGridLines: '检测到网格线',
    outputSize: '输出尺寸',
    upscaleFactor: '放大倍数',
    processingComplete: '处理完成！',
    processingFailed: '处理失败：'
  },

  // 调试信息
  debug: {
    info: '提示'
  },

  // 语言切换
  language: {
    title: '语言',
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