本页同样适用于 WSL2。

## 0. 安装 Node.js

OpenClaw 要求 Node.js 24.16 及以上或 26.1 及以上：[Linux 安装 Node.js](/docs/tools/nodejs/linux)。

## 1. 安装 OpenClaw

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
openclaw --version
openclaw doctor
```

## 2. 初始化

```bash
openclaw onboard --install-daemon
```

依次选择 `Manual` → `Local gateway (this machine)` → 端口 `18789` → `Token`，模型与认证步骤选 `Skip for now`。

## 3. 写入配置

把 `YOUR_API_KEY` 换成你的 Key、`my-local-token` 换成自定义的网关 token 后执行：

```bash
mkdir -p ~/.openclaw

cat > ~/.openclaw/openclaw.json <<'EOF'
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
EOF
```

各项含义见 [macOS 教程](/docs/tools/openclaw/macos#3-写入配置)。

## 4. 重启网关并验证

```bash
openclaw gateway restart
openclaw status
openclaw agent --local -m "Reply with exactly: OK"
openclaw dashboard
```

在服务器上运行时，面板只监听本机。可以用 SSH 端口转发在自己电脑上打开：

```bash
ssh -L 18789:localhost:18789 user@your-server
```

## 常见问题

见 [macOS 教程的常见问题](/docs/tools/openclaw/macos#常见问题)。
