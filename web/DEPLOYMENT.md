# Cloudflare Workers 部署指南

本指南说明如何将 img2pic web 应用部署到 Cloudflare Workers。

## 前提条件

1. 安装 Wrangler CLI：
```bash
npm install -g wrangler
```

2. 登录 Cloudflare：
```bash
wrangler login
```

## 部署步骤

### 1. 构建应用

首先构建 Quasar 应用：

```bash
cd web
npm install
npm run build
```

构建完成后，静态文件将生成在 `dist` 目录中。

### 2. 安装 Workers 依赖

进入 workers-site 目录并安装依赖：

```bash
cd workers-site
npm install
```

### 3. 配置环境变量

编辑 `wrangler.toml` 文件，根据需要修改：

- 账户 ID（自动获取）
- 环境变量
- KV 命名空间
- D1 数据库（如需要）

### 4. 本地测试

在部署前，可以在本地测试 Workers：

```bash
cd workers-site
npm run dev
```

### 5. 部署到 Workers

部署到生产环境：

```bash
cd workers-site
npm run deploy:production
```

部署到测试环境：

```bash
cd workers-site
npm run deploy:staging
```

## 域名配置

### 自定义域名设置

1. 在 Cloudflare Dashboard 中添加域名 `i2p.sirrus.cc`
2. 确保域名 DNS 指向 Cloudflare
3. Workers 将自动配置路由

### DNS 记录

确保以下 DNS 记录已配置：

```
i2p.sirrus.cc A 192.0.2.1  # Cloudflare IP
*.i2p.sirrus.cc CNAME i2p.sirrus.cc
```

## 环境配置

### Production 环境

- 名称：`img2pic-web-prod`
- 域名：`i2p.sirrus.cc`
- 路由：自动配置

### Staging 环境

- 名称：`img2pic-web-staging`
- 域名：`staging.i2p.sirrus.cc`
- 路由：自动配置

## 缓存策略

Workers 配置了以下缓存策略：

- HTML 文件：2 小时
- CSS/JS 文件：30 天
- 图片文件：30 天
- 字体文件：30 天
- 其他文件：2 小时

## 安全配置

已配置以下安全头：

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 常见问题

### 1. 构建文件未找到

确保先运行 `npm run build` 生成 `dist` 目录。

### 2. 域名配置错误

检查 `wrangler.toml` 中的域名配置是否正确。

### 3. 权限错误

确保 Wrangler 已登录并有足够的权限。

## 监控和日志

查看 Workers 日志：

```bash
wrangler tail
```

查看特定环境的日志：

```bash
wrangler tail --env production
```

## 更新部署

更新应用时：

1. 重新构建应用：
```bash
npm run build
```

2. 重新部署 Workers：
```bash
cd workers-site
npm run deploy:production
```

## 清理资源

删除 Workers：

```bash
wrangler delete img2pic-web-prod
wrangler delete img2pic-web-staging
```

## 支持的功能

- ✅ 静态文件服务
- ✅ SPA 路由支持
- ✅ Gzip 压缩
- ✅ 缓存优化
- ✅ 安全头配置
- ✅ CORS 支持
- ✅ 自定义域名
- ⬜ API 路由（可扩展）
- ⬜ KV 存储（可选）
- ⬜ D1 数据库（可选）

## 扩展功能

如需添加 API 路由，编辑 `workers-site/index.js` 文件中的 `handleApiRequest` 函数。

如需使用 KV 存储、D1 数据库或其他 Cloudflare 服务，请在 `wrangler.toml` 中添加相应配置。