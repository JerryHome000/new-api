WSL2 里的 Linux 子系统也按本页操作。

## 0. 安装 Node.js

先安装 Node.js 22 或以上：[Linux 安装 Node.js](/docs/tools/nodejs/linux)。

## 1. 安装 Claude Code

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

## 2. 写入配置

把 `YOUR_API_KEY` 换成你的 Key 后执行：

```bash
mkdir -p ~/.claude

cat > ~/.claude/settings.json <<'EOF'
{
  "env": {
    "ANTHROPIC_BASE_URL": "{{BASE_URL}}",
    "ANTHROPIC_AUTH_TOKEN": "YOUR_API_KEY",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "model": "{{CLAUDE_MODEL}}"
}
EOF

cat ~/.claude/settings.json
```

字段含义见 [Windows 教程](/docs/tools/claude-code/windows)。

## 3. 启动并验证

```bash
claude -p "Reply with exactly: OK"
cd /path/to/your/project
claude doctor
claude
```

## 常见问题

- **npm install -g 报权限错误**：推荐用 `nvm` 管理 Node.js，全局包会装到用户目录；不建议用 sudo。
- **找不到 claude 命令**：重开终端，或检查 `npm config get prefix` 对应的 `bin` 目录是否在 PATH 中。
