## 0. 安装 Node.js

OpenClaw 要求 Node.js 24.16 及以上或 26.1 及以上：[Windows 安装 Node.js](/docs/tools/nodejs/windows)。

## 1. 安装 OpenClaw

按 `Win + X` 打开「Windows PowerShell」或「终端」，执行官方安装脚本：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

确认安装成功：

```powershell
openclaw --version
openclaw doctor
```

## 2. 初始化

```powershell
openclaw onboard --install-daemon
```

按提示选择：

| 提示                        | 选择                           |
| --------------------------- | ------------------------------ |
| Onboarding mode             | `Manual`                       |
| What do you want to set up? | `Local gateway (this machine)` |
| Gateway port                | `18789`（直接回车用默认值）    |
| Gateway auth                | `Token`                        |
| 模型 / 认证                 | `Skip for now`，稍后手动配置   |

## 3. 写入配置

配置文件是 `%USERPROFILE%\.openclaw\openclaw.json`。把 `YOUR_API_KEY` 换成你的 Key、`my-local-token` 换成自定义的网关 token 后执行：

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.openclaw"

@'
{
  "models": {
    "mode": "merge",
    "providers": {
      "{{PROVIDER_ID}}-claude": {
        "baseUrl": "{{BASE_URL}}",
        "api": "anthropic-messages",
        "apiKey": "YOUR_API_KEY",
        "models": [{ "id": "{{CLAUDE_MODEL}}", "name": "{{CLAUDE_MODEL}}" }]
      },
      "{{PROVIDER_ID}}-gpt": {
        "baseUrl": "{{BASE_URL}}/v1",
        "api": "openai-responses",
        "apiKey": "YOUR_API_KEY",
        "models": [{ "id": "{{GPT_MODEL}}", "name": "{{GPT_MODEL}}" }]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "{{PROVIDER_ID}}-claude/{{CLAUDE_MODEL}}" }
    }
  },
  "gateway": {
    "mode": "local",
    "port": 18789,
    "auth": { "mode": "token", "token": "my-local-token" }
  }
}
'@ | Set-Content -Path "$env:USERPROFILE\.openclaw\openclaw.json" -Encoding UTF8
```

各项含义与 [macOS 教程](/docs/tools/openclaw/macos#3-写入配置) 相同。

## 4. 重启网关并验证

```powershell
openclaw gateway restart
openclaw doctor
openclaw agent --local -m "Reply with exactly: OK"
openclaw dashboard
```

浏览器打开 `openclaw dashboard` 输出的地址，需要 token 时填你设置的值。

## 常见问题

- **找不到 openclaw 命令**：关闭 PowerShell 重新打开，必要时重启电脑。
- **脚本被禁止运行**：以当前用户身份执行 `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` 后重试。
- **网关启动失败 / 调用失败**：见 [macOS 教程的常见问题](/docs/tools/openclaw/macos#常见问题)。
