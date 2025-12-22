export default {
  // Titre de l'application
  app: {
    title: 'Générateur d\'Art Pixel'
  },

  // Menu de navigation
  nav: {
    menu: 'Menu de Navigation',
    home: 'Accueil',
    homeCaption: 'Introduction du Projet',
    pixelArt: 'Génération d\'Art Pixel',
    pixelArtCaption: 'Convertir les images en art pixel',
    toolbox: 'Boîte à Outils',
    toolboxCaption: 'Collection d\'outils utiles',
    novelAssistant: 'Aide Roman',
    novelAssistantCaption: 'Transformez votre VSCode en outil d\'écriture de roman',
    checklist: 'Assistant Liste de Vérification',
    checklistCaption: 'Outil de gestion de liste de vérification',
    blog: 'Blog',
    blogCaption: 'Blog Technique',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // Page d'accueil
  home: {
    subtitle: 'Convertir les pseudo-pixellisations générées par IA en vrai pixel art',
    description: 'Utilisez des algorithmes d\'énergie avancés et des techniques de détection de contours pour identifier intelligemment les grilles de pixels dans les images, générant des œuvres d\'art pixel authentiques. Prend en charge plusieurs algorithmes et paramètres personnalisés.',
    startConversion: 'Commencer la Conversion',
    learnMore: 'En Savoir Plus',
    features: {
      title: 'Caractéristiques',
      energyAlgorithm: {
        title: 'Algorithme d\'Énergie',
        description: 'Génération de carte d\'énergie basée sur les gradients avec détection automatique des limites de grille de pixels, supportant l\'amélioration directionnelle et les ajustements de paramètres personnalisés.'
      },
      edgeDetection: {
        title: 'Détection de Contours',
        description: 'Utilise l\'opérateur Sobel pour détecter les contours horizontaux et verticaux, identifiant intelligemment les lignes de grille de pixels avec ajustement automatique de la taille de grille.'
      },
      gridSampling: {
        title: 'Échantillonnage de Grille',
        description: 'Crée des grilles régulières par détection de pics, supportant plusieurs modes d\'échantillonnage incluant l\'échantillonnage central, moyen et pondéré.'
      },
      colorQuantization: {
        title: 'Quantification des Couleurs',
        description: 'Algorithme intelligent de quantification des couleurs supportant la fusion de couleurs similaires avec un nombre de couleurs personnalisable et des seuils de similarité.'
      },
      parameterAdjustment: {
        title: 'Ajustement des Paramètres',
        description: 'Options de paramètres riches avec effets de prévisualisation en temps réel, supportant le mode débogage pour afficher les lignes de grille détectées.'
      },
      oneClickExport: {
        title: 'Export en Un Clic',
        description: 'Téléchargez directement des images de pixel art de haute qualité après le traitement, avec support pour des facteurs d\'échelle personnalisés.'
      }
    },
    quickStart: {
      title: 'Démarrage Rapide',
      steps: {
        selectImage: {
          title: 'Sélectionner une Image',
          description: 'Téléchargez l\'image que vous souhaitez convertir, supportant les formats d\'image courants.'
        },
        selectAlgorithm: {
          title: 'Sélectionner l\'Algorithme',
          description: 'Choisissez l\'algorithme approprié basé sur vos besoins et ajustez les paramètres.'
        },
        processImage: {
          title: 'Traiter l\'Image',
          description: 'Cliquez sur le bouton de traitement, et le système convertira automatiquement l\'image en pixel art.'
        },
        downloadResult: {
          title: 'Télécharger le Résultat',
          description: 'Prévisualisez le résultat et téléchargez des images de pixel art de haute qualité.'
        }
      }
    }
  },

  // Titres et descriptions
  title: {
    pixelSettings: 'Paramètres de pixelisation',
    originalImage: 'Image originale',
    pureEnergyMap: 'Carte d\'énergie pure',
    energyMapWithGrid: 'Carte d\'énergie et grille',
    pixelatedResult: 'Résultat pixelisé'
  },

  // Téléchargement de fichier
  fileUpload: {
    selectImage: 'Sélectionner une image',
    selectImageHint: 'Veuillez sélectionner une image à traiter'
  },

  // Paramètres de pixelisation
  pixelParams: {
    title: 'Paramètres de pixelisation',
    energyAlgorithmParams: 'Paramètres de l\'algorithme d\'énergie',
    gaussianBlur: 'Flou gaussien (σ)',
    gapTolerance: 'Tolérance d\'espacement',
    minEnergyThreshold: 'Seuil d\'énergie minimum',
    smoothWindowSize: 'Taille de la fenêtre de lissage',
    enableEnergyEnhancement: 'Activer l\'amélioration d\'énergie',
    directionalEnhancement: 'Amélioration directionnelle',
    horizontalEnhancement: 'Facteur d\'amélioration horizontal',
    verticalEnhancement: 'Facteur d\'amélioration vertical',
    pixelSize: 'Taille de pixel',
    manualSet: 'Réglage manuel',
    autoDetect: 'Détection automatique',
    minPixelSize: 'Taille de pixel minimum',
    maxPixelSize: 'Taille de pixel maximum'
  },

  // Mode d'échantillonnage
  samplingMode: {
    title: 'Mode d\'échantillonnage',
    generatePixelArt: 'Générer du pixel art',
    directProportionalSampling: 'Échantillonnage proportionnel direct (pour images normales)',
    energyMapSampling: 'Mode d\'échantillonnage de carte d\'énergie',
    centerSampling: 'Échantillonnage central',
    averageSampling: 'Échantillonnage moyen',
    weightedAverage: 'Moyenne pondérée',
    nativeResolution: 'Résolution native (1 pixel = 1 case)',
    upscaleFactor: 'Facteur d\'agrandissement',
    auto: 'Auto',
    weightedRatio: 'Ratio de pondération',
    directSamplingParams: 'Paramètres d\'échantillonnage direct',
    directSamplingDescription: 'Le mode d\'échantillonnage direct convient pour convertir des images normales en pixel art. La taille des pixels doit être définie manuellement.'
  },

  // Boutons d'action
  actions: {
    startProcessing: 'Commencer le traitement',
    showEnergyMapAndGrid: 'Afficher la carte d\'énergie et la grille',
    downloadPureEnergyMap: 'Télécharger la carte d\'énergie pure',
    downloadEnergyMapWithGrid: 'Télécharger énergie+grille',
    downloadPixelArt: 'Télécharger le pixel art',
    close: 'Fermer'
  },

  // Informations de statut
  status: {
    detectedPixelSize: 'Taille de pixel détectée',
    detectedGridLines: 'Lignes de grille détectées',
    outputSize: 'Taille de sortie',
    upscaleFactor: 'Facteur d\'agrandissement',
    processingComplete: 'Traitement terminé !',
    processingFailed: 'Échec du traitement : '
  },

  // Informations de débogage
  debug: {
    info: 'Information'
  },

  // Changement de langue
  language: {
    title: 'Langue',
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