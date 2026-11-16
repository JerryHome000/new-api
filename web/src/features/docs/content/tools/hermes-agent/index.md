Hermes Agent 是基于 Python 的终端 AI 代理，同时支持 Anthropic 和 OpenAI 两套接口，所有配置集中在一个 `config.yaml` 里。

## 准备工作

- 不需要提前安装 Python，Hermes 官方安装器会自己准备；安装过程需要访问 GitHub。
- {{SITE_NAME}} 的 API Key。Claude 和 GPT 如果在不同分组，需要各建一个：[注册并创建 Key](/docs/guide/account)

## 一键配置

见 [一键配置安装](/docs/tools/hermes-agent/one-click)。

## 手动安装

- [Windows](/docs/tools/hermes-agent/windows)
- [macOS](/docs/tools/hermes-agent/macos)
- [Linux / WSL2](/docs/tools/hermes-agent/linux)

## 接口规则

| 模型   | `api_mode`           | `base_url`                        |
| ------ | -------------------- | --------------------------------- |
| Claude | `anthropic_messages` | `{{BASE_URL}}`（不带 `/v1`）      |
| GPT    | `codex_responses`    | `{{BASE_URL}}/v1`（必须带 `/v1`） |

## 配置完成后的样子

在任意目录运行 `hermes` 就能进入交互，请求走的是 {{SITE_NAME}}。
