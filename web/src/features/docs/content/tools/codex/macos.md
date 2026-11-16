## 0. 安装 Node.js

先安装 Node.js 22 或以上：[macOS 安装 Node.js](/docs/tools/nodejs/macos)。

## 1. 安装 Codex

打开「终端」（`Command + 空格`，输入 Terminal 回车），任选一种方式安装：

```bash
# npm（推荐）
npm install -g @openai/codex

# 或者 Homebrew
brew install --cask codex
```

确认安装成功：

```bash
codex --version
```

## 2. 写入配置

Codex 的配置目录是 `~/.codex/`（即 `/Users/<你的用户名>/.codex/`），需要两个文件：

- `config.toml`：模型和 Provider；
- `auth.json`：API Key。

### 创建目录

```bash
mkdir -p ~/.codex
```

### config.toml

```bash
cat > ~/.codex/config.toml <<'EOF'
model_provider = "{{PROVIDER_ID}}"
model = "{{GPT_MODEL}}"
review_model = "{{GPT_MODEL}}"
model_reasoning_effort = "medium"
disable_response_storage = true
network_access = "enabled"
model_context_window = 272000
model_auto_compact_token_limit = 272000
effective_context_window_percent = 95

[model_providers.{{PROVIDER_ID}}]
name = "{{PROVIDER_ID}}"
base_url = "{{BASE_URL}}/v1"
wire_api = "responses"
requires_openai_auth = true
EOF
```

字段含义见 [Windows 教程里的字段说明](/docs/tools/codex/windows)。最容易出错的两项：`base_url` 必须带 `/v1`，`requires_openai_auth` 必须为 `true`。

### auth.json

把 `YOUR_API_KEY` 换成你的 Key 后再执行：

```bash
cat > ~/.codex/auth.json <<'EOF'
{
  "OPENAI_API_KEY": "YOUR_API_KEY"
}
EOF
```

确认两个文件都在：

```bash
ls -la ~/.codex
```

## 3. 启动并验证

```bash
codex exec --skip-git-repo-check "Reply with exactly: OK"
cd /path/to/your/project
codex
```

## 常见问题

### 找不到 codex 命令

npm 的全局目录不在 PATH 里。先用 `node -v` 确认 Node.js 正常，重开终端；仍不行就重新安装 Codex。

### 配置文件写不进去

多半是目录不存在。先执行 `mkdir -p ~/.codex`，再重新写入。

### 调用失败

- 用 `cat ~/.codex/auth.json` 检查 Key 是否完整、没有多余空格；
- 确认 Key 所在分组能调用 `{{GPT_MODEL}}`；
- 到 [钱包](/wallet) 检查余额。
