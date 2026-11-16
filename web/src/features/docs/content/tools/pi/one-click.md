安装 Pi，并同时接入 {{SITE_NAME}} 的 Claude 和 GPT。默认模型 `{{CLAUDE_MODEL}}`，推理强度 `medium`。

## 1. 运行脚本

> **待补充** · 一键配置命令：macOS / Linux 的 `curl -fsSL ... | bash` 与 Windows PowerShell 的 `irm ... | iex`，以及脚本菜单说明。

## 2. 手动安装

```bash
npm i -g @earendil-works/pi-coding-agent@latest
```

需要 Node.js 22.19 或更高版本。

## 3. 配置文件

配置目录是 `~/.pi/agent/`（Windows 为 `%USERPROFILE%\.pi\agent\`；设置了 `PI_CODING_AGENT_DIR` 时以它为准）。只需要写两个文件，Pi 自己的 `auth.json` 不用动。

### models.json

```json
{
  "providers": {
    "{{PROVIDER_ID}}-claude": {
      "baseUrl": "{{BASE_URL}}",
      "api": "anthropic-messages",
      "apiKey": "YOUR_CLAUDE_KEY",
      "models": [
        {
          "id": "{{CLAUDE_MODEL}}",
          "name": "{{CLAUDE_MODEL}}",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 1000000,
          "maxTokens": 128000
        }
      ]
    },
    "{{PROVIDER_ID}}-gpt": {
      "baseUrl": "{{BASE_URL}}/v1",
      "api": "openai-responses",
      "apiKey": "YOUR_GPT_KEY",
      "models": [
        {
          "id": "{{GPT_MODEL}}",
          "name": "{{GPT_MODEL}}",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 1050000,
          "maxTokens": 128000
        }
      ]
    }
  }
}
```

### settings.json

```json
{
  "defaultProvider": "{{PROVIDER_ID}}-claude",
  "defaultModel": "{{CLAUDE_MODEL}}",
  "defaultThinkingLevel": "medium"
}
```

- Claude 的 `baseUrl` **不带** `/v1`，GPT 的 `baseUrl` **必须带** `/v1`。
- 已有 `settings.json` 时只修改这三个字段，其他设置保留。
- 修改前请先备份原文件。

## 4. 验证与使用

```bash
# 默认模型（Claude）
pi -p "Reply with exactly: OK"

# GPT
pi -p --provider {{PROVIDER_ID}}-gpt --model {{GPT_MODEL}} "Reply with exactly: OK"
```

| 操作           | 命令                             |
| -------------- | -------------------------------- |
| 进入交互       | `pi`                             |
| 会话中切换模型 | `/model`（按 `Ctrl+S` 设为默认） |
| 调整推理强度   | `/thinking`                      |

## 5. 回滚

把备份复制回 `models.json` 和 `settings.json` 即可。
