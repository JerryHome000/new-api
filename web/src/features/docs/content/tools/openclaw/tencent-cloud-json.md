在腾讯云这类可视化 JSON 配置界面里使用 OpenClaw 时，不需要按终端教程安装和改文件，直接填下面的模板即可。

## 模板一：Claude（Anthropic 协议）

适用于 Claude 系列模型，例如 `{{CLAUDE_MODEL}}`。

```json
{
  "provider": "{{PROVIDER_ID}}",
  "base_url": "{{BASE_URL}}",
  "api": "anthropic-messages",
  "api_key": "YOUR_API_KEY",
  "model": {
    "id": "{{CLAUDE_MODEL}}",
    "name": "{{CLAUDE_MODEL}}"
  }
}
```

## 模板二：GPT（OpenAI Responses 协议）

适用于 GPT 系列模型，例如 `{{GPT_MODEL}}`。

```json
{
  "provider": "{{PROVIDER_ID}}",
  "base_url": "{{BASE_URL}}/v1",
  "api": "openai-responses",
  "api_key": "YOUR_API_KEY",
  "model": {
    "id": "{{GPT_MODEL}}",
    "name": "{{GPT_MODEL}}"
  }
}
```

## 两个模板的区别

|            | Claude 模板          | GPT 模板           |
| ---------- | -------------------- | ------------------ |
| `api`      | `anthropic-messages` | `openai-responses` |
| `base_url` | 不带 `/v1`           | 必须带 `/v1`       |

## 需要改哪些地方

通常只改两处：

- `api_key`：换成你的 Key；
- `model`：换成你要用的模型 ID，可在 [模型广场](/pricing) 查到。

## 不是腾讯云面板

在自己的电脑、云服务器或 WSL 里安装 OpenClaw，请看 [一键配置安装](/docs/tools/openclaw/one-click) 或 [OpenClaw 概览](/docs/tools/openclaw) 里的手动教程。
