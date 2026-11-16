用 OpenAI Images API 的格式调用 GPT Image 系列模型，完成文生图和图片编辑。

## 调用前准备

| 项目     | 内容                                 |
| -------- | ------------------------------------ |
| Base URL | `{{BASE_URL}}/v1`                    |
| 认证     | `Authorization: Bearer YOUR_API_KEY` |
| 计费     | 按次计费                             |

> **待补充** · GPT Image 使用的分组、可用的完整模型名与每次参考价格。下文示例中的 `gpt-image-2` 请替换为模型广场上显示的完整名称。

## 文生图

```http
POST /v1/images/generations
```

```bash
curl {{BASE_URL}}/v1/images/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "一只橘猫趴在窗台上，傍晚的暖光，电影感",
    "size": "1024x1024",
    "quality": "low",
    "n": 1
  }'
```

### 请求参数

| 参数      | 类型    | 必填 | 说明                                                                      |
| --------- | ------- | ---- | ------------------------------------------------------------------------- |
| `model`   | string  | 是   | 完整模型名                                                                |
| `prompt`  | string  | 是   | 画面描述                                                                  |
| `size`    | string  | 否   | `1024x1024`、`1024x1536`、`1536x1024`、`2048x2048`、`3840x2160` 或 `auto` |
| `quality` | string  | 否   | `low`、`medium` 或 `high`                                                 |
| `n`       | integer | 否   | 生成张数，默认 `1`                                                        |

### 响应格式

图片以 `b64_json` 的形式返回，解码后保存成文件即可：

```json
{
  "created": 1713772800,
  "data": [{ "b64_json": "iVBORw0KGgoAAAANSUhEUgAA..." }]
}
```

## 图片编辑

用 `multipart/form-data` 上传原图；如果只想改局部，再附一张 mask。

```http
POST /v1/images/edits
```

```bash
curl {{BASE_URL}}/v1/images/edits \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "model=gpt-image-2" \
  -F "prompt=把背景换成星空" \
  -F "size=1024x1024" \
  -F "image=@input.png"
```

局部编辑：

```bash
curl {{BASE_URL}}/v1/images/edits \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "model=gpt-image-2" \
  -F "prompt=在透明区域画一只橘猫" \
  -F "image=@input.png" \
  -F "mask=@mask.png"
```

| 参数      | 类型    | 必填 | 说明                                 |
| --------- | ------- | ---- | ------------------------------------ |
| `model`   | string  | 是   | 完整模型名                           |
| `image`   | file    | 是   | 原图，1 张                           |
| `prompt`  | string  | 是   | 想要的编辑效果                       |
| `mask`    | file    | 否   | 与原图同尺寸，透明区域是要修改的部分 |
| `size`    | string  | 否   | 输出尺寸                             |
| `quality` | string  | 否   | `low`、`medium` 或 `high`            |
| `n`       | integer | 否   | 输出张数，默认 `1`                   |

响应格式与文生图相同。

## Python 示例

```python
import base64
import os

import requests

response = requests.post(
    "{{BASE_URL}}/v1/images/generations",
    headers={"Authorization": f"Bearer {os.environ['API_KEY']}"},
    json={
        "model": "gpt-image-2",
        "prompt": "清晨的未来城市，建筑细节清晰",
        "size": "1024x1024",
        "quality": "low",
    },
    timeout=300,
)
response.raise_for_status()

with open("output.png", "wb") as f:
    f.write(base64.b64decode(response.json()["data"][0]["b64_json"]))
```

## 常见问题

| 现象                             | 处理                                         |
| -------------------------------- | -------------------------------------------- |
| `model_not_found` 或“无可用渠道” | 核对模型名是否完整，Key 的分组是否支持该模型 |
| 高分辨率请求超时                 | 把客户端超时调到 300 秒以上                  |
| mask 没生效                      | 确认 mask 与原图尺寸一致，要改的区域是透明的 |
| 返回 base64 而不是 URL           | 这是正常的，解码 `b64_json` 即可             |

## 下一步

- [Gemini 图片](/docs/api/gemini-image)
- [Veo 视频](/docs/api/veo-video)
- [API 概览](/docs/api)
