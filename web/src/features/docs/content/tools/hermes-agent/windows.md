## 1. 安装 Hermes Agent

打开 PowerShell，执行官方安装命令：

```powershell
irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1 | iex
```

安装器会自己准备 Python 和依赖，命令装在 `%LOCALAPPDATA%\hermes\bin`。**重新打开 PowerShell** 后确认：

```powershell
hermes --version
```

## 2. 写入配置

配置文件是 `%LOCALAPPDATA%\hermes\config.yaml`（设置了 `HERMES_HOME` 时以它为准）：

```powershell
New-Item -ItemType Directory -Force "$env:LOCALAPPDATA\hermes" | Out-Null
notepad "$env:LOCALAPPDATA\hermes\config.yaml"
```

在记事本里写入以下内容并保存：

```yaml
model:
  default: "{{CLAUDE_MODEL}}"
  provider: "{{PROVIDER_ID}}-claude"

providers:
  {{PROVIDER_ID}}-claude:
    name: "{{SITE_NAME}} Claude"
    base_url: "{{BASE_URL}}"
    api_mode: anthropic_messages
    api_key: "YOUR_CLAUDE_KEY"
    default_model: "{{CLAUDE_MODEL}}"
    models:
      "{{CLAUDE_MODEL}}":
        context_length: 1000000
  {{PROVIDER_ID}}-gpt:
    name: "{{SITE_NAME}} GPT"
    base_url: "{{BASE_URL}}/v1"
    api_mode: codex_responses
    api_key: "YOUR_GPT_KEY"
    default_model: "{{GPT_MODEL}}"
    models:
      "{{GPT_MODEL}}":
        context_length: 1050000

agent:
  reasoning_effort: "medium"
```

注意事项与 [macOS 教程](/docs/tools/hermes-agent/macos#2-写入配置) 相同：Claude 地址不带 `/v1`，GPT 地址必须带 `/v1`，字段名用小写加下划线。

## 3. 启动并验证

```powershell
hermes -z "Reply with exactly: OK"
hermes -z "Reply with exactly: OK" --provider {{PROVIDER_ID}}-gpt -m {{GPT_MODEL}}
```

## 常见问题

- **找不到 hermes 命令**：安装器已把 `%LOCALAPPDATA%\hermes\bin` 加入 PATH，重开 PowerShell 后生效。
- **其他问题**：见 [macOS 教程的常见问题](/docs/tools/hermes-agent/macos#常见问题)。
