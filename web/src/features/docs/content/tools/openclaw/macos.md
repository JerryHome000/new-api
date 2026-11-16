## 0. 安装 Node.js

OpenClaw 要求 Node.js 24.16 及以上或 26.1 及以上：[macOS 安装 Node.js](/docs/tools/nodejs/macos)。

## 1. 安装 OpenClaw

打开「终端」，执行官方安装脚本：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

确认安装成功：

```bash
openclaw --version
openclaw doctor
```

## 2. 初始化

初始化会在本机创建一个后台网关服务，之后可以通过网页或命令行使用。

```bash
openclaw onboard --install-daemon
```

按提示选择（方向键选择，回车确认）：

| 提示                        | 选择                           |
| --------------------------- | ------------------------------ |
| Onboarding mode             | `Manual`                       |
| What do you want to set up? | `Local gateway (this machine)` |
| Gateway port                | `18789`（直接回车用默认值）    |
| Gateway auth                | `Token`                        |
| 模型 / 认证                 | `Skip for now`，稍后手动配置   |

## 3. 写入配置

配置文件是 `~/.openclaw/openclaw.json`。写入前准备两样东西：

- 你的 {{SITE_NAME}} API Key；
- 一个自定义的网关 token，用于访问本地面板，例如 `my-local-token`。

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

需要替换：

- 两处 `YOUR_API_KEY` 换成你的 Key（Claude、GPT 在不同分组时分别填）；
- `my-local-token` 换成你自己设定的 token。

想默认用 GPT，把 `primary` 改成 `{{PROVIDER_ID}}-gpt/{{GPT_MODEL}}`。

## 4. 重启网关并验证

```bash
openclaw gateway restart
openclaw doctor
openclaw status
openclaw agent --local -m "Reply with exactly: OK"
```

打开网页控制面板：

```bash
openclaw dashboard
```

浏览器打开它输出的地址（例如 `http://localhost:18789`），需要 token 时填上一步设置的值。

## 5. 切换模型

- **面板里切换**：在模型选择器中选择；
- **命令行切换**：`openclaw models set {{PROVIDER_ID}}-gpt/{{GPT_MODEL}}`；
- **改配置**：修改 `primary` 后执行 `openclaw gateway restart`。

## 常见问题

### 找不到 openclaw 命令

重开终端；仍不行就重启电脑，并用 `node -v` 确认 Node.js 版本满足要求。

### 网关启动失败

- 检查 JSON 是否有语法错误（引号、逗号）；
- 确认 Key 和 token 都已替换；
- 端口被占用时换一个，例如 `18790`。

### 调用失败

- Key 是否完整、没有多余空格；
- GPT 的 `baseUrl` 是否带了 `/v1`，Claude 的是否**没有**带；
- 到 [钱包](/wallet) 检查余额。
