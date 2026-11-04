OpenCode 是开源的终端 AI 编程助手（TUI）。它支持的 Provider 很多、配置项也很自由，适合喜欢按自己习惯定制工作流的用户。

## 准备工作

- Node.js（用 npm 安装时需要）：[Node.js 安装](/docs/tools/nodejs)
- {{SITE_NAME}} 的 API Key：[注册并创建 Key](/docs/guide/account)
- 接口地址：`{{BASE_URL}}/v1`（OpenCode 里 Claude 和 GPT 都带 `/v1`）

## 一键配置

见 [一键配置安装](/docs/tools/opencode/one-click)。

## 手动安装

- [Windows](/docs/tools/opencode/windows)
- [macOS](/docs/tools/opencode/macos)
- [Linux](/docs/tools/opencode/linux)

## 整体思路

1. 安装 `opencode` 命令；
2. 在配置目录装好对应的 SDK（Claude 用 `@ai-sdk/anthropic`，GPT 用 `@ai-sdk/openai`）；
3. 写一份 `opencode.json`，把 Provider 指向 {{SITE_NAME}}；
4. 运行 `opencode`。
