本页同样适用于 WSL2。

## 1. 安装 OpenCode

```bash
curl -fsSL https://opencode.ai/install | bash
```

或者用 npm（npm 11 及以上需要加 `--allow-scripts=opencode-ai`）：

```bash
npm i -g opencode-ai@latest
```

重新打开终端后确认：

```bash
opencode --version
```

## 2. 安装 SDK

```bash
mkdir -p ~/.config/opencode && cd ~/.config/opencode
npm install @ai-sdk/anthropic @ai-sdk/openai
```

## 3. 写入配置

```bash
nano ~/.config/opencode/opencode.json   # 也可以用 vim 等编辑器
```

内容与 [macOS 教程](/docs/tools/opencode/macos#3-写入配置) 完全相同，两个 `baseURL` 都带 `/v1`。

## 4. 启动并验证

```bash
opencode run -m {{PROVIDER_ID}}-claude/{{CLAUDE_MODEL}} "Reply with exactly: OK"
opencode run -m {{PROVIDER_ID}}-gpt/{{GPT_MODEL}} "Reply with exactly: OK"
```

## 常见问题

见 [macOS 教程的常见问题](/docs/tools/opencode/macos#常见问题)。
