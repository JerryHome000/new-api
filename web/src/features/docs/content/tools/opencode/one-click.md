安装 OpenCode，并同时接入 {{SITE_NAME}} 的 Claude 和 GPT。默认模型 `{{CLAUDE_MODEL}}`，推理强度 `medium`。

## 1. 运行脚本

> **待补充** · 一键配置命令：macOS / Linux 的 `curl -fsSL ... | bash` 与 Windows PowerShell 的 `irm ... | iex`，以及脚本菜单说明。

## 2. 安装方式

| 系统          | 方式                          | 说明                                              |
| ------------- | ----------------------------- | ------------------------------------------------- |
| macOS / Linux | 官方安装脚本                  | 二进制放在 `~/.opencode/bin`，不依赖 Node.js      |
| 任意系统      | `npm i -g opencode-ai@latest` | npm 11 及以上需要加 `--allow-scripts=opencode-ai` |
| Windows       | npm 或 scoop                  | 官方没有提供 PowerShell 安装器                    |

## 3. 安装 SDK

OpenCode 通过 AI SDK 连接接口，需要在配置目录里装好对应的包：

```bash
mkdir -p ~/.config/opencode && cd ~/.config/opencode
npm install @ai-sdk/anthropic @ai-sdk/openai
```

## 4. 配置文件

默认路径是 `~/.config/opencode/opencode.json`（Windows 为 `%USERPROFILE%\.config\opencode\opencode.json`）。已有 `opencode.jsonc` 时会优先使用它；也可以用 `OPENCODE_CONFIG` 或 `OPENCODE_CONFIG_DIR` 指定位置。

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "{{PROVIDER_ID}}-claude/{{CLAUDE_MODEL}}",
  "provider": {
    "{{PROVIDER_ID}}-claude": {
      "npm": "@ai-sdk/anthropic",
      "name": "{{SITE_NAME}} Claude",
      "options": {
        "baseURL": "{{BASE_URL}}/v1",
        "apiKey": "YOUR_CLAUDE_KEY"
      },
      "models": {
        "{{CLAUDE_MODEL}}": {
          "name": "{{CLAUDE_MODEL}}",
          "attachment": true,
          "limit": { "context": 1000000, "output": 128000 },
          "options": {
            "thinking": { "type": "adaptive", "display": "summarized" },
            "effort": "medium"
          }
        }
      }
    },
    "{{PROVIDER_ID}}-gpt": {
      "npm": "@ai-sdk/openai",
      "name": "{{SITE_NAME}} GPT",
      "options": {
        "baseURL": "{{BASE_URL}}/v1",
        "apiKey": "YOUR_GPT_KEY"
      },
      "models": {
        "{{GPT_MODEL}}": {
          "name": "{{GPT_MODEL}}",
          "attachment": true,
          "limit": { "context": 1050000, "output": 128000 },
          "options": { "reasoningEffort": "medium", "reasoningSummary": "auto" }
        }
      }
    }
  }
}
```

- 和其他工具不同，OpenCode 里 Claude 的 `baseURL` **也要带** `/v1`。
- `"attachment": true` 允许在会话中上传文件和图片。
- 推理强度按模型单独设置；会话中可以按 `Ctrl+T` 切换，或启动时加 `--variant high`。
- 修改前请先备份原文件。

## 5. 验证与使用

```bash
opencode run -m {{PROVIDER_ID}}-claude/{{CLAUDE_MODEL}} "Reply with exactly: OK"
opencode run -m {{PROVIDER_ID}}-gpt/{{GPT_MODEL}} "Reply with exactly: OK"
```

两条都回复 `OK` 即配置成功。之后运行 `opencode` 进入交互，用 `/models` 切换模型。

> **注意** · 项目目录里如果也有 `opencode.json`，它的 `model` 会覆盖全局默认模型。

## 6. 回滚

把备份复制回 `opencode.json` 即可。
