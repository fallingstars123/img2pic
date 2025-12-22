# img2pic PWA 安装指南

## 什么是PWA？

PWA（Progressive Web App）是一种现代Web技术，可以让你的网站像原生应用一样被安装到设备上，提供类似原生应用的体验。

## img2pic PWA功能特性

### ✅ 已实现的PWA功能

1. **离线支持** - 所有功能都可以在没有网络连接的情况下正常工作
2. **安装到设备** - 可以将应用安装到桌面和移动设备主屏幕
3. **应用图标** - 自定义的PWA图标，支持各种尺寸
4. **启动画面** - 自定义启动画面和主题色
5. **全屏模式** - 安装后以全屏模式运行，提供沉浸式体验
6. **缓存策略** - 智能缓存应用资源，提高加载速度
7. **更新通知** - 自动检测应用更新并提示用户
8. **推送通知** - 支持未来的推送通知功能

### 🚀 PWA优势

- **无需下载应用商店** - 直接通过浏览器安装
- **本地计算** - 所有图片处理都在本地完成，保护隐私
- **快速启动** - 比网页版本启动更快
- **离线使用** - 无需网络连接即可使用所有功能
- **自动更新** - 自动获取最新版本
- **跨平台** - 支持Windows、macOS、Linux、iOS和Android

## 如何使用PWA版本

### 开发环境测试

```bash
# 启用开发模式的PWA
DEV_PWA=true quasar dev
```

### 构建PWA版本

```bash
# 使用我们的构建脚本
node scripts/build-pwa.js

# 或者使用Quasar命令
quasar build -m pwa
```

### 部署

构建完成后，`dist/pwa`目录包含了所有PWA文件，可以部署到任何静态文件服务器。

### 安装到设备

1. 在支持的浏览器中打开应用
2. 浏览器会显示"安装"按钮（通常在地址栏附近）
3. 点击"安装"按钮将应用添加到设备

## 文件结构

```
src-pwa/
├── manifest.json              # PWA应用清单文件
├── custom-service-worker.js   # 自定义Service Worker
├── register-service-worker.js # Service Worker注册脚本
└── icons/                     # PWA图标文件夹
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    ├── icon-512x512.png
    └── badge-72x72.png
```

## 配置说明

### Manifest配置

- **应用名称**: img2pic - 像素画转换器
- **显示模式**: standalone (独立应用)
- **主题色**: #027be3
- **背景色**: #ffffff
- **方向**: any (支持所有方向)

### 缓存策略

- **应用资源** (CSS, JS, 字体等): Stale-While-Revalidate
- **HTML页面**: Network-First
- **外部资源**: Cache-First
- **用户上传文件**: 不缓存 (保护隐私)

## 浏览器兼容性

PWA功能在以下浏览器中完全支持：

- ✅ Chrome (桌面/移动)
- ✅ Edge (桌面/移动)
- ✅ Firefox (桌面/移动)
- ✅ Safari (需要iOS 11.3+)
- ✅ Samsung Internet

## 故障排除

### 如果Service Worker未加载

1. 检查浏览器控制台是否有错误
2. 确保在HTTPS或localhost环境下运行
3. 尝试清除浏览器缓存

### 如果安装按钮未出现

1. 确保访问的是HTTPS或localhost
2. 检查浏览器是否支持PWA
3. 尝试刷新页面
4. 检查manifest.json是否正确加载

### 离线功能不工作

1. 检查Service Worker是否成功注册
2. 打开开发者工具查看缓存状态
3. 确保所有必需资源都被缓存

## 未来计划

- [ ] 添加更多推送通知功能
- [ ] 实现背景同步
- [ ] 添加文件系统访问API支持
- [ ] 优化缓存策略
- [ ] 添加更多设备集成功能

## 技术栈

- **Quasar Framework**: 提供PWA支持
- **Workbox**: Service Worker工具库
- **Vue 3**: 前端框架
- **TypeScript**: 类型安全

## 贡献

如果你发现PWA功能的问题或想要改进，欢迎提交Issue或Pull Request！

---

**注意**: 由于所有图片处理都在本地进行，你的图片数据永远不会离开你的设备，确保了完全的隐私安全。