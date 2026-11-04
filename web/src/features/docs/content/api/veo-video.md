Veo 系列支持文生视频和图生视频。视频任务需要较长时间才能完成，请统一走异步流程：创建任务后保存 `id`，再轮询任务状态。

## 调用前准备

视频按实际生成的秒数计费，可以用模型单价乘以 `seconds` 估算费用。

> **待补充** · Veo 使用的分组、可用模型（文生视频 / 快速版 / 图生视频）与每秒参考价格。

下文示例使用 `veo-3.1-fast`（文生视频）和 `veo-3.1-i2v`（图生视频），请按模型广场上的实际名称替换。

## 异步调用流程

| 步骤        | 方法与路径            | 说明                               |
| ----------- | --------------------- | ---------------------------------- |
| 1. 创建任务 | `POST /v1/videos`     | 立即返回任务 `id`，状态为 `queued` |
| 2. 查询任务 | `GET /v1/videos/{id}` | 建议每 10–15 秒查一次              |
| 3. 下载视频 | 响应里的 `video_url`  | 状态为 `completed` 后下载          |

`POST /v1/video/generations` 也能创建任务，返回结构一样；新项目建议统一用 `/v1/videos`。

> **注意** · 生成一段视频通常要几分钟。即使在创建请求里加了 `wait: true`，也可能立刻返回 `queued`，所以客户端一定要保存任务 ID 并轮询。

## 文生视频

```bash
curl {{BASE_URL}}/v1/videos \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "veo-3.1-fast",
    "prompt": "a tiny red ball rolling across a wooden table, cinematic light",
    "size": "1280x720",
    "seconds": "4",
    "generate_audio": false
  }'
```

## 图生视频

通过 `input_reference` 传一张公网可直接访问的图片 URL，或者 `data:` 开头的 base64：

```bash
curl {{BASE_URL}}/v1/videos \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "veo-3.1-i2v",
    "prompt": "slow zoom in, gentle movement, keep the original composition",
    "size": "1280x720",
    "seconds": "4",
    "input_reference": "https://example.com/reference.png"
  }'
```

## 请求参数

| 参数              | 类型    | 必填         | 说明                           |
| ----------------- | ------- | ------------ | ------------------------------ |
| `model`           | string  | 是           | Veo 模型名                     |
| `prompt`          | string  | 是           | 画面内容、运镜和风格           |
| `seconds`         | string  | 否           | 时长，测试时先用最短的 `"4"`   |
| `size`            | string  | 否           | 例如 `1280x720`                |
| `input_reference` | string  | 图生视频必填 | 公网图片 URL 或 `data:` base64 |
| `generate_audio`  | boolean | 否           | 是否同时生成音频，默认 `true`  |

## 创建任务的响应

创建成功会立刻返回任务信息。Veo 不保证回显 `seconds` 和 `size`，客户端只依赖 `id`、`model`、`status` 这些一定存在的字段：

```json
{
  "id": "task_fq3rMylJDGbVr0JmXJioKZoe",
  "model": "veo-3.1-fast",
  "status": "queued",
  "progress": 0,
  "created_at": 1786456082
}
```

## 查询任务

```bash
curl {{BASE_URL}}/v1/videos/task_fq3rMylJDGbVr0JmXJioKZoe \
  -H "Authorization: Bearer YOUR_API_KEY"
```

处理中可能只返回状态，不一定有 `progress`；完成后会带上 `video_url`：

```json
{
  "id": "task_fq3rMylJDGbVr0JmXJioKZoe",
  "model": "veo-3.1-fast",
  "status": "completed",
  "video_url": "https://example-cdn.com/generated-video.mp4"
}
```

| 状态                         | 含义                       |
| ---------------------------- | -------------------------- |
| `queued`                     | 排队中                     |
| `processing` / `in_progress` | 生成中                     |
| `completed`                  | 已完成，可读取 `video_url` |
| `failed`                     | 失败，查看 `error.message` |

## Python 完整示例

```python
import os
import time

import requests

base_url = "{{BASE_URL}}"
headers = {"Authorization": f"Bearer {os.environ['API_KEY']}"}

created = requests.post(
    f"{base_url}/v1/videos",
    headers=headers,
    json={
        "model": "veo-3.1-fast",
        "prompt": "a tiny red ball rolling across a wooden table",
        "size": "1280x720",
        "seconds": "4",
        "generate_audio": False,
    },
    timeout=60,
)
created.raise_for_status()
task_id = created.json()["id"]
deadline = time.monotonic() + 15 * 60

while time.monotonic() < deadline:
    try:
        r = requests.get(f"{base_url}/v1/videos/{task_id}", headers=headers, timeout=30)
        r.raise_for_status()
        task = r.json()
    except requests.RequestException:
        time.sleep(12)  # 网络抖动时继续用同一个 ID 查询
        continue

    if task["status"] == "completed":
        video = requests.get(task["video_url"], timeout=120)
        video.raise_for_status()
        with open(f"{task_id}.mp4", "wb") as f:
            f.write(video.content)
        break
    if task["status"] == "failed":
        raise RuntimeError(task.get("error", "视频生成失败"))
    time.sleep(12)
else:
    raise TimeoutError(f"任务 {task_id} 15 分钟内未完成，可以稍后继续查询")
```

## 注意事项

- 客户端整体超时建议不少于 15 分钟。
- 参考图必须能被服务端从公网直接下载；有防盗链的地址可能失败。
- 完成后直接用轮询结果里的 `video_url`，暂不建议依赖 `/v1/videos/{id}/content`。
- `video_url` 可能是短期有效的签名地址，拿到后请尽快下载或转存。

## 下一步

- [Seedance 视频](/docs/api/seedance-video)
- [Gemini 图片](/docs/api/gemini-image)
- [API 概览](/docs/api)
