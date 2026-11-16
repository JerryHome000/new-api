Gemini 图片模型同时支持两种调用方式：Gemini 原生格式和 OpenAI 聊天格式。两种方式用的是同一批模型，都按 Token 计费，图片生成会同时消耗输入和输出 Token。

## 调用前准备

> **待补充** · Gemini 图片模型使用的分组、可用模型列表与每 1M Token 的输入 / 输出价格。实时模型名以 `GET /v1/models` 和 [模型广场](/pricing) 为准。

下文示例使用 `gemini-3.1-flash-image`，请按实际可用的模型替换。

## Gemini 原生格式

适合已经在用 Gemini SDK 或 Google 接口结构的项目。

| 项目         | 内容                                     |
| ------------ | ---------------------------------------- |
| 方法         | `POST`                                   |
| 路径         | `/v1beta/models/{model}:generateContent` |
| 认证         | `x-goog-api-key: YOUR_API_KEY`           |
| Content-Type | `application/json`                       |

```bash
curl "{{BASE_URL}}/v1beta/models/gemini-3.1-flash-image:generateContent" \
  -H "x-goog-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{ "parts": [{ "text": "一只橘猫，纯白背景" }] }],
    "generationConfig": {
      "responseModalities": ["image"],
      "imageConfig": { "aspectRatio": "1:1", "imageSize": "1K" }
    }
  }'
```

| 参数                      | 说明                                 |
| ------------------------- | ------------------------------------ |
| `model`                   | 写在 URL 里的完整模型名              |
| `contents[].parts[].text` | 画面描述                             |
| `aspectRatio`             | 画面比例，例如 `1:1`、`9:16`、`16:9` |
| `imageSize`               | 分辨率，例如 `1K`、`2K`、`4K`        |

图片以 base64 字符串放在 `inlineData.data` 里返回：

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          { "inlineData": { "mimeType": "image/jpeg", "data": "<base64>" } }
        ]
      }
    }
  ]
}
```

Python 示例：

```python
import base64
import os

import requests

model = "gemini-3.1-flash-image"
response = requests.post(
    f"{{BASE_URL}}/v1beta/models/{model}:generateContent",
    headers={"x-goog-api-key": os.environ["API_KEY"]},
    json={
        "contents": [{"parts": [{"text": "一只橘猫，纯白背景"}]}],
        "generationConfig": {
            "responseModalities": ["image"],
            "imageConfig": {"aspectRatio": "1:1", "imageSize": "1K"},
        },
    },
    timeout=180,
)
response.raise_for_status()

parts = response.json()["candidates"][0]["content"]["parts"]
image = next(p["inlineData"] for p in parts if "inlineData" in p)
suffix = ".png" if image["mimeType"] == "image/png" else ".jpg"
with open(f"gemini{suffix}", "wb") as f:
    f.write(base64.b64decode(image["data"]))
```

## OpenAI 聊天格式

适合已经在用 OpenAI SDK、`chat.completions` 或其他兼容客户端的项目。

| 项目 | 内容                                 |
| ---- | ------------------------------------ |
| 方法 | `POST`                               |
| 路径 | `/v1/chat/completions`               |
| 认证 | `Authorization: Bearer YOUR_API_KEY` |

```bash
curl {{BASE_URL}}/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3.1-flash-image",
    "messages": [
      { "role": "user", "content": [{ "type": "text", "text": "一只橘猫，纯白背景" }] }
    ],
    "extra_body": { "imageConfig": { "aspectRatio": "1:1", "imageSize": "1K" } },
    "max_tokens": 4096
  }'
```

图片会以 Markdown 图片语法嵌在 `choices[0].message.content` 里：

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "![image](data:image/jpeg;base64,<base64>)"
      }
    }
  ]
}
```

用正则取出 data URL 里的 base64 再解码即可；解码报 padding 错误时，在末尾补 `=` 直到长度是 4 的倍数。

## 两种格式怎么选

| 维度     | Gemini 原生格式                          | OpenAI 聊天格式          |
| -------- | ---------------------------------------- | ------------------------ |
| 认证     | `x-goog-api-key`                         | `Authorization: Bearer`  |
| 路径     | `/v1beta/models/{model}:generateContent` | `/v1/chat/completions`   |
| 图片参数 | `generationConfig.imageConfig`           | `extra_body.imageConfig` |
| 图片返回 | `inlineData.data`                        | Markdown data URL        |
| 适合     | Gemini 生态的项目                        | OpenAI 兼容的项目        |

## 常见问题

| 现象                             | 处理                                        |
| -------------------------------- | ------------------------------------------- |
| `model_not_found` 或“无可用渠道” | 使用完整模型名，并确认 Key 的分组支持该模型 |
| base64 解码报 padding 错误       | 末尾补 `=` 直到长度能被 4 整除              |
| 请求超时                         | 先用 `1K` 测试，客户端超时设到 180 秒以上   |
| 收不到流式图片                   | 图片接口不走流式，等待完整响应即可          |

## 下一步

- [GPT Image](/docs/api/gpt-image-2)
- [Veo 视频](/docs/api/veo-video)
- [API 概览](/docs/api)
