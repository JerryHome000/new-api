OpenClaw 更像一个可以自己托管的 Agent 网关：在本机跑一个后台服务，再通过终端或 Web 面板来使用和管理。

## 准备工作

- Node.js 24.16 及以上（或 26.1 及以上），Node 22 无法安装新版 OpenClaw：[安装 Node.js](/docs/tools/nodejs)
- {{SITE_NAME}} 的 API Key。Claude 和 GPT 如果在不同分组，需要各建一个：[注册并创建 Key](/docs/guide/account)

## 一键配置

推荐的顺序：先按 OpenClaw 官方流程安装，初始化时在模型配置一步选择 `Skip for now`，装好后再写入 {{SITE_NAME}} 的配置。详见 [一键配置安装](/docs/tools/openclaw/one-click)。

## 腾讯云可视化面板

用腾讯云的 JSON 配置界面时，不用走终端教程，直接填 [腾讯云 JSON 模板](/docs/tools/openclaw/tencent-cloud-json)。

## 配置写在哪里

配置文件是 `~/.openclaw/openclaw.json`（Windows 为 `%USERPROFILE%\.openclaw\openclaw.json`）。Claude 和 GPT 的写法不同：

| 模型   | `api`                | `baseUrl`                         |
| ------ | -------------------- | --------------------------------- |
| Claude | `anthropic-messages` | `{{BASE_URL}}`（不带 `/v1`）      |
| GPT    | `openai-responses`   | `{{BASE_URL}}/v1`（必须带 `/v1`） |

所以推荐配置两个 Provider：`{{PROVIDER_ID}}-claude` 和 `{{PROVIDER_ID}}-gpt`，完整示例见 [一键配置安装](/docs/tools/openclaw/one-click#3-配置文件)。

## 手动安装

- [Windows](/docs/tools/openclaw/windows)
- [macOS](/docs/tools/openclaw/macos)
- [Linux / WSL2](/docs/tools/openclaw/linux)
