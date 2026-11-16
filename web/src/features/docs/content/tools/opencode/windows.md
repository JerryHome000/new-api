## 1. 安装 OpenCode

OpenCode 官方没有提供 PowerShell 安装器，Windows 上用 npm 安装（需要先装好 [Node.js](/docs/tools/nodejs/windows)）：

```powershell
npm i -g opencode-ai@latest
```

npm 11 及以上需要加 `--allow-scripts=opencode-ai`。习惯 scoop 的话也可以用 scoop 安装。

重新打开 PowerShell 后确认：

```powershell
opencode --version
```

## 2. 安装 SDK

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.config\opencode" | Out-Null
cd "$env:USERPROFILE\.config\opencode"
npm install @ai-sdk/anthropic @ai-sdk/openai
```

## 3. 写入配置

用下面的命令直接写入 `%USERPROFILE%\.config\opencode\opencode.json`（会覆盖原文件，请先备份）：

```powershell
@'
{
  "$schema": "https://opencode.ai/config.json",
  "model": "{{PROVIDER_ID}}-claude/{{CLAUDE_MODEL}}",
  "provider": {
    "{{PROVIDER_ID}}-claude": {
      "npm": "@ai-sdk/anthropic",
      "name": "{{SITE_NAME}} Claude",
      "options": { "baseURL": "{{BASE_URL}}/v1", "apiKey": "YOUR_CLAUDE_KEY" },
      "models": {
        "{{CLAUDE_MODEL}}": {
          "name": "{{CLAUDE_MODEL}}",
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
      "options": { "baseURL": "{{BASE_URL}}/v1", "apiKey": "YOUR_GPT_KEY" },
      "models": {
        "{{GPT_MODEL}}": {
          "name": "{{GPT_MODEL}}",
          "limit": { "context": 1050000, "output": 128000 },
          "options": { "reasoningEffort": "medium", "reasoningSummary": "auto" }
        }
      }
    }
  }
}
'@ | Set-Content -Path "$env:USERPROFILE\.config\opencode\opencode.json" -Encoding UTF8
```

注意事项与 [macOS 教程](/docs/tools/opencode/macos#3-写入配置) 相同：两个 `baseURL` 都带 `/v1`。

## 4. 启动并验证

```powershell
opencode run -m {{PROVIDER_ID}}-claude/{{CLAUDE_MODEL}} "Reply with exactly: OK"
opencode run -m {{PROVIDER_ID}}-gpt/{{GPT_MODEL}} "Reply with exactly: OK"
```

## 常见问题

- **找不到 opencode 命令**：重开 PowerShell；仍然不行时检查 `npm prefix -g` 是否在 PATH 中。
- **其他问题**：见 [macOS 教程的常见问题](/docs/tools/opencode/macos#常见问题)。
