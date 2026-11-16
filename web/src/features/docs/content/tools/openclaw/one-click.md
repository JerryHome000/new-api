安装 OpenClaw，并同时接入 {{SITE_NAME}} 的 Claude 和 GPT。默认模型 `{{CLAUDE_MODEL}}`，备用 `{{GPT_MODEL}}`，推理强度 `medium`。

## 1. 运行脚本

> **待补充** · 一键配置命令：macOS / Linux 的 `curl -fsSL ... | bash` 与 Windows PowerShell 的 `irm ... | iex`，以及脚本菜单说明。

## 2. 前置条件

OpenClaw 要求 Node.js 24.16 以上（24.x）或 26.1 以上，Node 22 装不上。升级方式：到官网下载 24 LTS，或 `brew install node@24`。

OpenClaw 本体的安装命令：

```bash
npm i -g openclaw@latest
```

### 关于两个 Key

Claude 和 GPT 在不同分组时，需要准备两个 Key；只用其中一家也可以只配一个。

> **注意** · 如果报错 `Requests from the ... framework are not supported`，说明 Claude Key 所在分组只允许官方客户端。换一个允许第三方工具的分组重新创建 Key。

## 3. 配置文件

只需要修改 `~/.openclaw/openclaw.json`（Windows 为 `%USERPROFILE%\.openclaw\openclaw.json`）。推荐用 OpenClaw 自带的 `openclaw config patch` 写入，它会先校验格式。

```json5
{
  models: {
    mode: 'merge',
    providers: {
      '{{PROVIDER_ID}}-claude': {
        baseUrl: '{{BASE_URL}}', // Anthropic 协议，不带 /v1
        api: 'anthropic-messages',
        apiKey: 'YOUR_CLAUDE_KEY',
        models: [
          { id: '{{CLAUDE_MODEL}}', contextWindow: 1000000, maxTokens: 128000 },
        ],
      },
      '{{PROVIDER_ID}}-gpt': {
        baseUrl: '{{BASE_URL}}/v1', // OpenAI 协议，必须带 /v1
        api: 'openai-responses',
        apiKey: 'YOUR_GPT_KEY',
        models: [
          { id: '{{GPT_MODEL}}', contextWindow: 1050000, maxTokens: 128000 },
        ],
      },
    },
  },
  agents: {
    defaults: {
      model: {
        primary: '{{PROVIDER_ID}}-claude/{{CLAUDE_MODEL}}',
        fallbacks: ['{{PROVIDER_ID}}-gpt/{{GPT_MODEL}}'],
      },
      thinkingDefault: 'medium',
    },
  },
}
```

- 已有的其他 Provider 和 gateway 设置会保留（`mode: "merge"`）。
- OpenClaw 重写文件时会去掉原有注释，修改前请先备份。

## 4. 验证与使用

```bash
# 用默认模型（Claude）测试
openclaw agent --local -m "Reply with exactly: OK"

# 用 GPT 测试
openclaw agent --local --model {{PROVIDER_ID}}-gpt/{{GPT_MODEL}} -m "Reply with exactly: OK"
```

常用命令：

| 命令                                                    | 作用                         |
| ------------------------------------------------------- | ---------------------------- |
| `openclaw chat`                                         | 在终端里对话                 |
| `openclaw models list`                                  | 查看已配置的模型             |
| `openclaw models set {{PROVIDER_ID}}-gpt/{{GPT_MODEL}}` | 把默认模型改成 GPT           |
| `/model`、`/think`                                      | 会话中切换模型、调整推理强度 |

需要网关、聊天渠道、控制台等完整功能时，运行 `openclaw onboard --install-daemon`，在模型与认证步骤选择 Skip，以保留上面的配置。网关运行中会自动加载新配置，无需重启。

## 5. 回滚

把备份文件改回 `openclaw.json` 即可。
