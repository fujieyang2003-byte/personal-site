# 个人网站 · 部署与域名指南

纯静态单页站点（HTML + CSS），零依赖、零构建。下面是从「本地预览」到「拥有专属网址 + 全球可访问」的完整步骤。

---

## 0. 本地预览（先看看效果）

```bash
cd personal-site
python -m http.server 8000
# 浏览器打开 http://localhost:8000
```

确认没问题后，把内容替换成你自己的（见 `index.html` 里的「修改点」注释）。

---

## 1. 把代码推到 GitHub（部署的前提）

1. 在 https://github.com 新建一个仓库，例如 `personal-site`。
2. 在 `personal-site/` 目录里：
   ```bash
   git init
   git add .
   git commit -m "init personal site"
   git branch -M main
   git remote add origin https://github.com/你的用户名/personal-site.git
   git push -u origin main
   ```

---

## 2. 注册一个专属域名（约 ¥55–70/年）

> 为什么不直接用免费子域名？免费域名（`.github.io`）不够专业；职业发展用途，专属域名值得。

**推荐在腾讯云 / 阿里云注册 `.com` 域名：**
- 腾讯云：https://dnspod.cloud.tencent.com → 域名注册
- 阿里云：https://wanwang.aliyun.com
- 搜索 `你的名字.com` / `.me` / `.dev`，选一个能买到的，年费约 ¥55–70。
- 购买时做**实名认证**（国内买域名必须，免费、几分钟），但**不需要 ICP 备案**——因为服务器在境外（下一步的 Cloudflare）。

> 想更简单也可在 Cloudflare Registrar 买 `.com`（价格透明、自带 DNS+CDN），但需信用卡 / PayPal，且不支持 `.cn`。

---

## 3. 部署到 Cloudflare Pages（免费、国内外都能访问、无需备案）

为什么选它：比 Vercel 国内访问更稳（Anycast + 国内节点），自带免费 SSL 和全球 CDN。

1. 注册 Cloudflare 账号：https://pages.cloudflare.com
2. 点 **Create a project → Connect to Git**，授权 GitHub，选择 `personal-site` 仓库。
3. 构建设置（因为是纯静态，几乎不用配）：
   - Framework preset: `None`
   - Build command: 留空
   - Build output directory: `/` （根目录，因为直接用 index.html）
4. 点 **Save and Deploy**，几十秒后会给一个 `xxx.pages.dev` 临时网址，先打开验证。
5. 以后每次 `git push`，网站会自动重新部署。

---

## 4. 绑定你的专属域名

**方式 A（推荐，最稳）：把域名交给 Cloudflare 托管**
1. 在 Cloudflare Pages 项目里 → **Custom domains → Set up a custom domain**，输入你买的域名（如 `ek.com`）。
2. Cloudflare 会提示你把域名的 Nameserver 改成它给的两组地址。
3. 回到腾讯云 / 阿里云的域名管理，把 DNS 解析服务器（NS）改成 Cloudflare 给的地址。
4. 等待 5–30 分钟生效，Cloudflare 自动签发 SSL 证书。之后 `ek.com` 就能全球访问了。

**方式 B（不改 NS，只加一条 CNAME）**
1. 在 Cloudflare Pages 的 Custom domains 添加域名，它会给你一个目标地址（形如 `xxx.pages.dev` 或 CNAME 值）。
2. 在域名注册商的 DNS 解析里，添加一条 `CNAME` 记录：主机 `www` / `@` → 目标地址。
3. 等几分钟生效即可。

> 建议同时配 `www.ek.com` 和 `ek.com`（在 Custom domains 都加上，Cloudflare 会处理跳转）。

---

## 5. 以后怎么更新

1. 修改 `index.html` / `styles.css`。
2. `git add . && git commit -m "更新" && git push`。
3. Cloudflare Pages 自动重新部署，刷新网址即可看到新内容。

---

## 可选增强（以后想做再加）

- **写博客**：升级成 [Astro](https://astro.build) 静态生成器，内容用 Markdown 写。
- **自定义 404**：加一个 `404.html`。
- **分析访问量**：Cloudflare 自带 Web Analytics（免费、隐私友好），在控制台开启即可。
- **表单联系**：用 [Formspree](https://formspree.io) 或 Cloudflare Turnstile 接一个免后端的联系表单。
- **国内更稳**：若主要面向国内且想用国内服务器，则需要把站点部署到国内平台并做 ICP 备案（流程更长）。当前境外方案对大多数人已足够。
