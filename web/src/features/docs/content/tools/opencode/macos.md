## 1. 安装 OpenCode

任选一种方式。官方脚本不依赖 Node.js：

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

只用 Claude 时可以只装 `@ai-sdk/anthropic`。

## 3. 写入配置

```bash
open -e ~/.config/opencode/opencode.json   # 文件不存在时先 touch 一下
```

写入以下内容：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "{{PROVIDER_ID}}-claude/{{CLAUDE_MODEL}}",
  "provider": {
    "{{PROVIDER_ID}}-claude": {
      "npm": "@ai-sdk/anthropic",
      "name": "{{SITE_NAME}} Claude",
      "options": { "baseURL": "{{BASE_URL}}/v1", "apiKey": "YOUR_CLAUDE_KEY" },
      "models": {
        "{{CLAUDE_MODEL}}": {
          "name": "{{CLAUDE_MODEL}}",
          "limit": { "context": 1000000, "output": 128000 },
          "options": {
            "thinking": { "type": "adaptive", "display": "summarized" },
            "effort": "medium"
          }
        }
      }
    },
    "{{PROVIDER_ID}}-gpt": {
      "npm": "@ai-sdk/openai",
      "name": "{{SITE_NAME}} GPT",
      "options": { "baseURL": "{{BASE_URL}}/v1", "apiKey": "YOUR_GPT_KEY" },
      "models": {
        "{{GPT_MODEL}}": {
          "name": "{{GPT_MODEL}}",
          "limit": { "context": 1050000, "output": 128000 },
          "options": { "reasoningEffort": "medium", "reasoningSummary": "auto" }
        }
      }
    }
  }
}
```

- 两个 Key 分别换成你的 Claude、GPT 分组 Key；只用一家时删掉另一家的条目，并让 `model` 指向保留的那一家。
- 两个 `baseURL` 都**带** `/v1`。

## 4. 启动并验证

```bash
opencode run -m {{PROVIDER_ID}}-claude/{{CLAUDE_MODEL}} "Reply with exactly: OK"
opencode run -m {{PROVIDER_ID}}-gpt/{{GPT_MODEL}} "Reply with exactly: OK"
```

都回复 `OK` 后运行 `opencode` 进入交互，`/models` 切换模型。

## 常见问题

### 找不到 opencode 命令

官方脚本装在 `~/.opencode/bin`，重开终端让 PATH 生效；npm 安装的话检查 `npm prefix -g` 下的 `bin` 是否在 PATH 中。

### 提示找不到 Provider 或 SDK

确认 SDK 装在 `~/.config/opencode` 目录里，而不是当前项目目录。

### 调用失败 / 401

- Key 是否完整、是否配在了对应的 Provider 下；
- `baseURL` 是否带了 `/v1`；
- 项目目录的 `opencode.json` 是否覆盖了全局配置。
