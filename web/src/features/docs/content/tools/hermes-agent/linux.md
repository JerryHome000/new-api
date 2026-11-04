本页同样适用于 WSL2。

## 1. 安装 Hermes Agent

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

命令装在 `~/.local/bin`，重新打开终端后确认：

```bash
hermes --version
```

## 2. 写入配置

```bash
mkdir -p ~/.hermes
nano ~/.hermes/config.yaml   # 也可以用 vim 等编辑器
```

写入以下内容：

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

注意事项见 [macOS 教程](/docs/tools/hermes-agent/macos#2-写入配置)。

## 3. 启动并验证

```bash
hermes -z "Reply with exactly: OK"
hermes -z "Reply with exactly: OK" --provider {{PROVIDER_ID}}-gpt -m {{GPT_MODEL}}
```

## 常见问题

见 [macOS 教程的常见问题](/docs/tools/hermes-agent/macos#常见问题)。
