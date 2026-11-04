WSL2 里的 Linux 子系统也按本页操作。

## 0. 安装 Node.js

先安装 Node.js 22 或以上：[Linux 安装 Node.js](/docs/tools/nodejs/linux)。

## 1. 安装 Codex

```bash
npm install -g @openai/codex
codex --version
```

## 2. 写入配置

配置目录是 `~/.codex/`（即 `/home/<你的用户名>/.codex/`）。

```bash
mkdir -p ~/.codex

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

把 `YOUR_API_KEY` 换成你的 Key：

```bash
cat > ~/.codex/auth.json <<'EOF'
{
  "OPENAI_API_KEY": "YOUR_API_KEY"
}
EOF

ls -la ~/.codex
```

字段含义见 [Windows 教程里的字段说明](/docs/tools/codex/windows)。

## 3. 启动并验证

```bash
codex exec --skip-git-repo-check "Reply with exactly: OK"
cd /path/to/your/project
codex
```

## 常见问题

- **找不到 codex 命令**：npm 全局目录不在 PATH 中。重开终端，或用 `nvm` 管理 Node 后重新安装。
- **401 / 调用失败**：检查 `auth.json` 里的 Key 是否完整，分组是否能调用 GPT 模型，余额是否充足。
- **`auth.json` 里有官方登录信息**：Codex 会优先使用官方凭据，导致请求失败。删除官方凭据（先备份），只保留 `OPENAI_API_KEY`。
