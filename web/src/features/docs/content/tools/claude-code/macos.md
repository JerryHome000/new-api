## 0. 安装 Node.js

先安装 Node.js 22 或以上：[macOS 安装 Node.js](/docs/tools/nodejs/macos)，然后确认：

```bash
node -v
npm -v
```

## 1. 安装 Claude Code

打开「终端」（`Command + 空格`，输入 Terminal 回车）：

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

## 2. 写入配置

Claude Code 的配置都放在 `~/.claude/settings.json`，不需要改环境变量。

```bash
mkdir -p ~/.claude
```

把 `YOUR_API_KEY` 换成你的 Key 后执行：

```bash
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
```

字段含义见 [Windows 教程](/docs/tools/claude-code/windows)。最关键的一点：`ANTHROPIC_BASE_URL` **不带** `/v1`。

确认文件内容：

```bash
cat ~/.claude/settings.json
```

## 3. 启动并验证

```bash
claude -p "Reply with exactly: OK"
cd /path/to/your/project
claude doctor
claude
```

## 常见问题

### npm install -g 报权限错误

不要用 `sudo npm install -g` 强装。回到 [macOS 安装 Node.js](/docs/tools/nodejs/macos) 改用 Homebrew 安装的 Node.js，它不需要 sudo。

### 找不到 claude 命令

npm 全局目录不在 PATH 中。先用 `node -v` 确认 Node.js 正常，然后重开终端；仍不行就重新安装。
