{{SITE_NAME}} 完整兼容 Anthropic Messages API。已经在用 Anthropic 官方 SDK 的项目，只需要改一下 `base_url` 就能切换过来。

## 接口地址

```text
{{BASE_URL}}/v1/messages
```

> **注意** · 使用 Anthropic 官方 SDK 时，`base_url` 填 `{{BASE_URL}}`，**不要**带 `/v1`，SDK 会自己拼上 `/v1/messages`。

## 认证

两种写法都可以：

```http
x-api-key: YOUR_API_KEY
```

```http
Authorization: Bearer YOUR_API_KEY
```

## Messages API

Claude 的核心对话接口。

```http
POST /v1/messages
```

### 请求示例

```bash
curl {{BASE_URL}}/v1/messages \
  -H "content-type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "model": "{{CLAUDE_MODEL}}",
    "max_tokens": 1024,
    "messages": [
      { "role": "user", "content": "用 Python 写一个二分查找" }
    ]
  }'
```

### 请求参数

| 参数             | 类型    | 必填 | 说明                              |
| ---------------- | ------- | ---- | --------------------------------- |
| `model`          | string  | 是   | 模型名称，例如 `{{CLAUDE_MODEL}}` |
| `messages`       | array   | 是   | 对话消息列表                      |
| `max_tokens`     | integer | 是   | 最多生成的 Token 数               |
| `system`         | string  | 否   | 系统提示词                        |
| `temperature`    | number  | 否   | 采样温度，0–1                     |
| `top_p`          | number  | 否   | 核采样                            |
| `stream`         | boolean | 否   | 是否流式输出                      |
| `stop_sequences` | array   | 否   | 停止序列                          |

### 消息格式

和 OpenAI 格式不同，系统提示词是一个独立的 `system` 参数：

```json
{
  "model": "{{CLAUDE_MODEL}}",
  "max_tokens": 1024,
  "system": "你是一位 Python 专家",
  "messages": [
    { "role": "user", "content": "写一个快速排序" },
    { "role": "assistant", "content": "好的，下面是一个快速排序……" },
    { "role": "user", "content": "再加上详细注释" }
  ]
}
```

- `messages` 里只有 `user` 和 `assistant` 两种角色；
- 第一条必须是 `user`；
- `user` 与 `assistant` 交替出现。

### 响应格式

```json
{
  "id": "msg_123",
  "type": "message",
  "role": "assistant",
  "content": [{ "type": "text", "text": "Claude 的回复内容" }],
  "model": "{{CLAUDE_MODEL}}",
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 25, "output_tokens": 150 }
}
```

## 流式输出

设置 `"stream": true` 后，服务端按事件推送：

```text
event: message_start
data: {"type":"message_start","message":{"id":"msg_123", ...}}

event: content_block_delta
data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"你好"}}

event: message_stop
data: {"type":"message_stop"}
```

## 支持的模型

> **待补充** · 当前可用的 Claude 模型列表、上下文长度与最大输出。实时列表以 [模型广场](/pricing) 为准。

## 图片输入

Claude 支持在消息里直接传图片（JPEG、PNG、GIF、WebP）：

```json
{
  "model": "{{CLAUDE_MODEL}}",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": "/9j/4AAQSkZJRg..."
          }
        },
        { "type": "text", "text": "这张图里有什么？" }
      ]
    }
  ]
}
```

## SDK 示例

### Python

```python
from anthropic import Anthropic

client = Anthropic(
    api_key="YOUR_API_KEY",
    base_url="{{BASE_URL}}",
)

message = client.messages.create(
    model="{{CLAUDE_MODEL}}",
    max_tokens=1024,
    system="你是一位 Python 专家",
    messages=[{"role": "user", "content": "写一个 Python 装饰器"}],
)
print(message.content[0].text)
```

流式输出：

```python
with client.messages.stream(
    model="{{CLAUDE_MODEL}}",
    max_tokens=1024,
    messages=[{"role": "user", "content": "写一篇短文"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### Node.js

```javascript
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: 'YOUR_API_KEY',
  baseURL: '{{BASE_URL}}',
})

const message = await client.messages.create({
  model: '{{CLAUDE_MODEL}}',
  max_tokens: 1024,
  messages: [{ role: 'user', content: '写一个快速排序' }],
})

console.log(message.content[0].text)
```

## 错误处理

```json
{
  "type": "error",
  "error": { "type": "invalid_request_error", "message": "错误描述" }
}
```

| 错误类型                | 含义                 |
| ----------------------- | -------------------- |
| `invalid_request_error` | 请求参数有误         |
| `authentication_error`  | 认证失败，检查 Key   |
| `permission_error`      | 无权使用该模型或分组 |
| `not_found_error`       | 模型或资源不存在     |
| `rate_limit_error`      | 请求过于频繁         |
| `api_error`             | 服务端内部错误       |
| `overloaded_error`      | 上游繁忙，稍后重试   |

## 实践建议

- **按需设置 `max_tokens`**：它是必填项，设得过大不会多扣费，但会影响排队和超时判断。
- **角色设定放进 `system`**：不要把“你是某某专家”混在用户消息里。
- **长对话要瘦身**：定期总结历史、删掉无关轮次，必要时使用缓存。
- **失败重试**：对 `rate_limit_error`、`overloaded_error` 做有限次数的指数退避重试。

## 与 OpenAI 格式对比

| 特性         | Anthropic 格式       | OpenAI 格式                     |
| ------------ | -------------------- | ------------------------------- |
| 系统提示词   | 独立的 `system` 参数 | 放在 `messages` 里              |
| 角色         | `user` / `assistant` | `system` / `user` / `assistant` |
| `max_tokens` | 必填                 | 可选                            |
| 流式         | 按事件类型推送       | `data:` 数据流                  |

## 速率限制

> **待补充** · 每分钟请求数、并发数等限流规则。

## 下一步

- [OpenAI 格式](/docs/api/openai)：通用调用方式
- [分组与计价](/docs/guide/pricing)：了解费用计算
- [获取支持](/docs/help/support)：遇到问题联系我们
