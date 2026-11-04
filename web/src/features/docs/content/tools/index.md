这一部分教你把 {{SITE_NAME}} 接入常见的 AI 编程工具。每个工具都有「一键配置」和按系统区分的手动教程，任选其一。

## 一键配置

> **待补充** · 一键配置脚本：各工具在 macOS / Linux（`curl ... | bash`）和 Windows PowerShell（`irm ... | iex`）下的安装命令。

两类命令不能混用：`curl ... | bash` 只能在 macOS、Linux、WSL 或 Git Bash 中运行；`irm ... | iex` 只能在 PowerShell 中运行。把前者粘到 PowerShell 里会直接报错。

## 接入信息

所有工具填的都是同一组信息：

| 项目             | 值                 |
| ---------------- | ------------------ |
| 服务名称         | {{SITE_NAME}}      |
| Base URL         | `{{BASE_URL}}`     |
| 默认 Claude 模型 | `{{CLAUDE_MODEL}}` |
| 默认 GPT 模型    | `{{GPT_MODEL}}`    |
| 推理强度         | `medium`（中档）   |

工具里的「API Base URL」通常有两种写法：

- **OpenAI / Codex 协议**必须带 `/v1`：`{{BASE_URL}}/v1`
- **Anthropic / Claude 协议**一般不带 `/v1`：`{{BASE_URL}}`（OpenCode 例外，它要求带 `/v1`）

## API Key 与分组

- Claude 和 GPT 模型可能在不同的分组里，需要分别创建 Key。OpenClaw、Hermes Agent、OpenCode、Pi 这类同时支持两家模型的工具，可以各填一个 Key，只用其中一家也没问题。
- 如果在第三方工具里调用 Claude 时出现 `Requests from the ... framework are not supported`，说明这个 Key 所在的分组只允许 Claude 官方客户端。换一个允许第三方工具的分组重新创建 Key 即可。

> **待补充** · 本站哪些分组允许第三方工具。

## 选哪个工具

| 工具                                     | 适合谁                                                         |
| ---------------------------------------- | -------------------------------------------------------------- |
| [Claude Code](/docs/tools/claude-code)   | 在终端里直接改代码、跑命令、做代码评审；也能配置 Claude 桌面版 |
| [Codex](/docs/tools/codex)               | OpenAI 官方的终端编程代理，适合习惯 OpenAI 工作流的人          |
| [OpenClaw](/docs/tools/openclaw)         | 偏网关和面板管理，适合把 Agent 跑成常驻服务                    |
| [Hermes Agent](/docs/tools/hermes-agent) | 终端代理，同时支持 Claude 和 GPT，用 YAML 管理配置             |
| [OpenCode](/docs/tools/opencode)         | 开源 TUI，支持多个 Provider，配置灵活                          |
| [Pi](/docs/tools/pi)                     | 轻量的终端编程代理，Claude 和 GPT 随时切换                     |
| [CC-Switch](/docs/tools/cc-switch)       | 图形界面管理多个工具的配置，不想手改配置文件时用               |

## 手动配置的顺序

1. 先 [安装 Node.js](/docs/tools/nodejs)，大多数工具都依赖它。
2. 打开要用的工具页，选择你的系统（Windows / macOS / Linux）。
3. 按教程填好 Base URL 和 API Key，再用页面里的「验证」命令测试一次。
