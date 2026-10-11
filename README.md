# 安馨个人作品集

基于 React、Vite 与 Framer Motion 的个人作品集网站，计划发布到：

```text
https://xinan-annie.github.io/
```

## 本地运行

```bash
pnpm install
pnpm dev
```

## 构建检查

```bash
pnpm build
```

## 内容边界

- 当前作品文字来自 `D:\Portfolio\Anxin_Portfolio_Structure_v2\portfolio-content`。
- 项目图片、时间、角色、团队分工与联系方式尚未最终核对，因此首版使用程序化视觉封面和明确的待补充说明。
- 原始资料目录不会被网站构建过程修改。

## 发布到 GitHub Pages

1. 将本目录提交并推送到 `XinAn-Annie/XinAn-Annie.github.io` 仓库的 `main` 分支。
2. 在仓库 `Settings → Pages` 中将 Source 选择为 `GitHub Actions`。
3. 推送后，`.github/workflows/deploy.yml` 会自动安装依赖、构建并发布网站。
