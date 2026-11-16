{{SITE_NAME}} 完整兼容 OpenAI 的接口格式，GPT 系列以及其他兼容 OpenAI 格式的模型都可以通过它调用。

## 接口地址

```text
{{BASE_URL}}/v1
```

## 认证

在请求头里带上 API Key：

```http
Authorization: Bearer YOUR_API_KEY
```

## Chat Completions

文本对话的核心接口，单轮、多轮都用它。

```http
POST /v1/chat/completions
```

所有文本模型都同时支持流式和非流式输出。短请求、一次性的结构化结果用 `"stream": false`；长回答和需要边生成边展示的界面用 `"stream": true`。

### 请求示例

```bash
curl {{BASE_URL}}/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "{{GPT_MODEL}}",
    "messages": [
      { "role": "system", "content": "你是一个乐于助人的助手" },
      { "role": "user", "content": "用 Python 写一个快速排序" }
    ],
    "stream": false,
    "temperature": 0.7,
    "max_tokens": 2000
  }'
```

Claude 模型同样可以走这个接口，把 `model` 换成 `{{CLAUDE_MODEL}}` 即可。

### 请求参数

| 参数             | 类型           | 必填 | 说明                                          |
| ---------------- | -------------- | ---- | --------------------------------------------- |
| `model`          | string         | 是   | 模型名称，例如 `{{GPT_MODEL}}`                |
| `messages`       | array          | 是   | 对话消息列表                                  |
| `stream`         | boolean        | 否   | `true` 返回 SSE 数据流，`false` 返回完整 JSON |
| `temperature`    | number         | 否   | 采样温度，0–2，默认 1                         |
| `max_tokens`     | integer        | 否   | 最多生成的 Token 数                           |
| `top_p`          | number         | 否   | 核采样，0–1                                   |
| `stop`           | string / array | 否   | 停止序列                                      |
| `stream_options` | object         | 否   | 流式选项，例如 `{"include_usage": true}`      |

### 消息格式

```json
{
  "messages": [
    { "role": "system", "content": "系统提示词" },
    { "role": "user", "content": "用户消息" },
    { "role": "assistant", "content": "助手回复" }
  ]
}
```

- `system`：系统提示词，设定模型的行为；
- `user`：用户的输入；
- `assistant`：模型此前的回复，用于多轮对话。

### 响应格式

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "{{GPT_MODEL}}",
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "模型的回复内容" },
      "finish_reason": "stop"
    }
  ],
  "usage": { "prompt_tokens": 56, "completion_tokens": 31, "total_tokens": 87 }
}
```

## 流式输出

把 `stream` 设为 `true`，服务端会持续推送 SSE 事件；加上 `stream_options.include_usage` 后，最后一个事件会带上用量统计。

```bash
curl {{BASE_URL}}/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "{{GPT_MODEL}}",
    "messages": [{ "role": "user", "content": "你好" }],
    "stream": true,
    "stream_options": { "include_usage": true }
  }'
```

返回的数据流形如：

```text
data: {"id":"chatcmpl-123","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"你好"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","choices":[{"index":0,"delta":{},"finish_reason":"stop"}],"usage":{"prompt_tokens":9,"completion_tokens":2,"total_tokens":11}}

data: [DONE]
```

## 支持的模型

> **待补充** · 当前可用的 GPT / Claude / Gemini 模型列表、上下文长度与推荐用途。实时列表也可以通过 `GET /v1/models` 获取。

## SDK 示例

### Python

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="{{BASE_URL}}/v1",
)

stream = client.chat.completions.create(
    model="{{GPT_MODEL}}",
    messages=[
        {"role": "system", "content": "你是一个编程助手"},
        {"role": "user", "content": "写一个计算斐波那契数列的函数"},
    ],
    stream=True,
    stream_options={"include_usage": True},
)

for chunk in stream:
    if chunk.choices and chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
    if chunk.usage:
        print(f"\n\n本次消耗 {chunk.usage.total_tokens} tokens")
```

非流式调用：

```python
response = client.chat.completions.create(
    model="{{CLAUDE_MODEL}}",
    messages=[{"role": "user", "content": "写一个快速排序"}],
)
print(response.choices[0].message.content)
```

### Node.js

```javascript
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: '{{BASE_URL}}/v1',
})

const stream = await client.chat.completions.create({
  model: '{{GPT_MODEL}}',
  messages: [{ role: 'user', content: '写一个快速排序' }],
  stream: true,
  stream_options: { include_usage: true },
})

for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content
  if (text) process.stdout.write(text)
  if (chunk.usage)
    console.log(`\n\n本次消耗 ${chunk.usage.total_tokens} tokens`)
}
```

## 错误处理

错误响应的结构：

```json
{
  "error": {
    "message": "错误描述",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

| 状态码 | 含义             | 建议                          |
| ------ | ---------------- | ----------------------------- |
| 401    | Key 无效或已失效 | 检查 Key 是否完整、是否被禁用 |
| 429    | 请求过于频繁     | 降低并发，按指数退避重试      |
| 500    | 服务端错误       | 稍后重试，持续出现请联系支持  |
| 503    | 服务暂不可用     | 稍后重试或换一个模型          |

```python
from openai import OpenAI, APIError

try:
    response = client.chat.completions.create(
        model="{{GPT_MODEL}}",
        messages=[{"role": "user", "content": "Hello"}],
    )
except APIError as e:
    print(f"调用失败：{e.message}")
```

## 实践建议

- **设置超时**：创建客户端时传 `timeout`，避免请求无限挂起。
- **失败重试**：对 429、5xx 做有限次数的指数退避重试，例如最多 3 次。
- **按场景选输出方式**：长回答用流式，短请求和结构化结果用非流式。
- **控制消耗**：用 `max_tokens` 限制输出长度，并通过响应里的 `usage` 关注实际用量。

## 速率限制

> **待补充** · 每分钟请求数、并发数等限流规则。超过限制会返回 429。

## 下一步

- [Anthropic 格式](/docs/api/anthropic)：Claude 原生调用方式
- [分组与计价](/docs/guide/pricing)：了解费用计算
- [获取支持](/docs/help/support)：遇到问题联系我们
