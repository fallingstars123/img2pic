export default {
  // Application title
  app: {
    title: 'Pixel Art Generator'
  },

  // Navigation menu
  nav: {
    menu: 'Navigation Menu',
    home: 'Home',
    homeCaption: 'Project Introduction',
    pixelArt: 'Pixel Art Generation',
    pixelArtCaption: 'Convert images to pixel art',
    toolbox: 'Toolbox',
    toolboxCaption: 'Collection of useful tools',
    novelAssistant: 'Novel Helper',
    novelAssistantCaption: 'Turn your VSCode into a novel writing tool',
    checklist: 'Checklist Assistant',
    checklistCaption: 'Checklist management tool',
    blog: 'Blog',
    blogCaption: 'Technical Blog',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // Titles and descriptions
  title: {
    pixelSettings: 'Pixelization Settings',
    originalImage: 'Original Image',
    pureEnergyMap: 'Pure Energy Map',
    energyMapWithGrid: 'Energy Map and Grid',
    pixelatedResult: 'Pixelated Result'
  },

  // File upload
  fileUpload: {
    selectImage: 'Select Image',
    selectImageHint: 'Please select an image to process'
  },

  // Pixelization parameters
  pixelParams: {
    title: 'Pixelization Parameters',
    energyAlgorithmParams: 'Energy Algorithm Parameters',
    gaussianBlur: 'Gaussian Blur (σ)',
    gapTolerance: 'Gap Tolerance',
    minEnergyThreshold: 'Minimum Energy Threshold',
    smoothWindowSize: 'Smooth Window Size',
    enableEnergyEnhancement: 'Enable Energy Enhancement',
    directionalEnhancement: 'Directional Enhancement',
    horizontalEnhancement: 'Horizontal Enhancement Factor',
    verticalEnhancement: 'Vertical Enhancement Factor',
    pixelSize: 'Pixel Size',
    manualSet: 'Manual Set',
    autoDetect: 'Auto Detect',
    minPixelSize: 'Minimum Pixel Size',
    maxPixelSize: 'Maximum Pixel Size'
  },

  // Sampling mode
  samplingMode: {
    title: 'Sampling Mode',
    generatePixelArt: 'Generate Pixel Art',
    directProportionalSampling: 'Direct Proportional Sampling (for normal images)',
    energyMapSampling: 'Energy Map Sampling Mode',
    centerSampling: 'Center Sampling',
    averageSampling: 'Average Sampling',
    weightedAverage: 'Weighted Average',
    nativeResolution: 'Native Resolution (1 pixel = 1 grid)',
    upscaleFactor: 'Upscale Factor',
    auto: 'Auto',
    weightedRatio: 'Weighted Ratio',
    directSamplingParams: 'Direct Sampling Parameters',
    directSamplingDescription: 'Direct sampling mode is suitable for converting normal images to pixel art. Pixel size needs to be set manually.'
  },

  // Action buttons
  actions: {
    startProcessing: 'Start Processing',
    showEnergyMapAndGrid: 'Show Energy Map and Grid',
    downloadPureEnergyMap: 'Download Pure Energy Map',
    downloadEnergyMapWithGrid: 'Download Energy Map+Grid',
    downloadPixelArt: 'Download Pixel Art',
    close: 'Close'
  },

  // Status information
  status: {
    detectedPixelSize: 'Detected Pixel Size',
    detectedGridLines: 'Detected Grid Lines',
    outputSize: 'Output Size',
    upscaleFactor: 'Upscale Factor',
    processingComplete: 'Processing Complete!',
    processingFailed: 'Processing Failed: '
  },

  // Debug information
  debug: {
    info: 'Info'
  },

  // Home page
  home: {
    subtitle: 'Convert AI-generated pseudo pixel art into real pixel art',
    description: 'Use advanced energy algorithms and edge detection technology to intelligently identify pixel grids in images, generating authentic pixel art. Supports multiple algorithms and custom parameters.',
    startConversion: 'Start Conversion',
    learnMore: 'Learn More',
    features: {
      title: 'Features',
      energyAlgorithm: {
        title: 'Energy Algorithm',
        description: 'Gradient-based energy map generation with automatic pixel grid boundary detection, supporting directional enhancement and custom parameter adjustments.'
      },
      edgeDetection: {
        title: 'Edge Detection',
        description: 'Uses Sobel operator to detect horizontal and vertical edges, intelligently identifying pixel grid lines with automatic grid size adjustment.'
      },
      gridSampling: {
        title: 'Grid Sampling',
        description: 'Creates regular grids through peak detection, supporting multiple sampling modes including center sampling, average sampling, and weighted average.'
      },
      colorQuantization: {
        title: 'Color Quantization',
        description: 'Intelligent color quantization algorithm supporting similar color merging with customizable color count and similarity thresholds.'
      },
      parameterAdjustment: {
        title: 'Parameter Adjustment',
        description: 'Rich parameter options with real-time preview effects, supporting debug mode to display detected grid lines.'
      },
      oneClickExport: {
        title: 'One-Click Export',
        description: 'Directly download high-quality pixel art images after processing, with support for custom scaling factors.'
      }
    },
    quickStart: {
      title: 'Quick Start',
      steps: {
        selectImage: {
          title: 'Select Image',
          description: 'Upload the image you want to convert, supporting common image formats.'
        },
        selectAlgorithm: {
          title: 'Select Algorithm',
          description: 'Choose the appropriate algorithm based on your needs and adjust parameters.'
        },
        processImage: {
          title: 'Process Image',
          description: 'Click the process button, and the system will automatically convert the image to pixel art.'
        },
        downloadResult: {
          title: 'Download Result',
          description: 'Preview the result and download high-quality pixel art images.'
        }
      }
    }
  },

  // Language switching
  language: {
    title: 'Language',
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
