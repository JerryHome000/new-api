Seedance 支持文生视频，也支持用图片、视频、音频等参考素材驱动生成。请使用异步任务接口：创建后用任务 ID 查询进度。

## 调用前准备

视频按实际生成的秒数计费，测试时建议先生成 4 秒。

> **待补充** · Seedance 使用的分组、模型名与每秒参考价格。

下文示例使用 `seedance2.5`，请按模型广场上的实际名称替换。

## 异步调用流程

| 步骤        | 方法与路径            | 说明                           |
| ----------- | --------------------- | ------------------------------ |
| 1. 创建任务 | `POST /v1/videos`     | 返回任务 `id`，状态为 `queued` |
| 2. 查询任务 | `GET /v1/videos/{id}` | 建议每 10–15 秒查一次          |
| 3. 下载视频 | 响应里的 `video_url`  | 状态为 `completed` 后下载      |

> **注意** · 不要依赖同步等待。即使带上 `wait: true`，接口也会返回排队中的任务。请保存 `id` 并轮询，避免长连接超时，或者因为重复提交而被重复计费。

## 文生视频

```bash
curl {{BASE_URL}}/v1/videos \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "seedance2.5",
    "prompt": "a cute kitten playing with a ball of yarn, cinematic lighting",
    "size": "1280x720",
    "seconds": "4",
    "generate_audio": false
  }'
```

## 图生视频

参考图可以是公网可直接访问的 URL，也可以是 `data:` base64；多张图用 `images` 数组：

```bash
curl {{BASE_URL}}/v1/videos \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "seedance2.5",
    "prompt": "slow cinematic push-in, drifting clouds, golden hour",
    "size": "1280x720",
    "seconds": "4",
    "input_reference": "https://example.com/reference.jpg"
  }'
```

## 请求参数

| 参数              | 类型           | 必填     | 说明                                                                      |
| ----------------- | -------------- | -------- | ------------------------------------------------------------------------- |
| `model`           | string         | 是       | Seedance 模型名                                                           |
| `prompt`          | string         | 条件必填 | 画面内容、运镜和风格；没有 `content` 时必填                               |
| `seconds`         | string         | 否       | 时长，`"4"`–`"30"`，默认 `"4"`                                            |
| `duration`        | integer        | 否       | 整数时长，4–30，与 `seconds` 二选一                                       |
| `size`            | string         | 否       | `宽x高`，例如 `1280x720`                                                  |
| `ratio`           | string         | 否       | `auto`、`21:9`、`16:9`、`4:3`、`1:1`、`3:4`、`9:16`，会覆盖 `size` 的比例 |
| `resolution`      | string         | 否       | `480p` 或 `720p`                                                          |
| `generate_audio`  | boolean        | 否       | 是否生成音频，默认 `true`                                                 |
| `seed`            | integer        | 否       | 随机种子，`-1` 表示随机                                                   |
| `input_reference` | string / array | 否       | 参考素材 URL 或 `data:` base64                                            |
| `images`          | string / array | 否       | 参考图片，最多 30 张                                                      |
| `content`         | array          | 否       | 多模态内容，可以替代顶层的提示词和参考素材                                |

## 多模态参考素材

`content` 支持 `text`、`image_url`、`video_url`、`audio_url` 四种类型；图片最多 30 张，视频、音频各最多 10 个。

```json
{
  "model": "seedance2.5",
  "seconds": "4",
  "ratio": "16:9",
  "resolution": "720p",
  "content": [
    { "type": "text", "text": "gentle camera push-in, soft morning light" },
    {
      "type": "image_url",
      "image_url": { "url": "https://example.com/reference.jpg" }
    }
  ]
}
```

参考 URL 必须公网可访问，并允许服务端下载；不行的话改用 `data:` base64 或可直连的对象存储地址。

## 任务响应

创建后：

```json
{
  "id": "video_976521f793cf4d80a7b1a091",
  "object": "video",
  "model": "seedance2.5",
  "status": "queued",
  "progress": 0,
  "seconds": "4",
  "size": "1280x720"
}
```

查询：

```bash
curl {{BASE_URL}}/v1/videos/video_976521f793cf4d80a7b1a091 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

生成中会返回 `progress`；完成后带上 `video_url` 和用量：

```json
{
  "id": "video_976521f793cf4d80a7b1a091",
  "status": "completed",
  "progress": 100,
  "video_url": "https://example-cdn.com/generated-video.mp4",
  "usage": { "seconds": 4, "video_count": 1 }
}
```

失败时：

```json
{
  "id": "video_976521f793cf4d80a7b1a091",
  "status": "failed",
  "error": { "code": "generation_failed", "message": "content moderated" }
}
```

| 状态                         | 含义                          |
| ---------------------------- | ----------------------------- |
| `queued`                     | 排队中                        |
| `in_progress` / `processing` | 生成中，返回时可读 `progress` |
| `completed`                  | 已完成，可读取 `video_url`    |
| `failed`                     | 失败，查看 `error.message`    |

完整的轮询代码可以参考 [Veo 视频](/docs/api/veo-video#python-完整示例)，只需替换请求体；Seedance 的整体超时建议放宽到 20 分钟。

## 常见问题

| 现象                  | 处理                                                       |
| --------------------- | ---------------------------------------------------------- |
| 参考素材返回 HTTP 403 | 素材站点拦截了服务端下载，换成可直连 URL 或 `data:` base64 |
| `content moderated`   | 调整提示词或参考素材后重试                                 |
| 上游限流（429）       | 等一会儿再试，不要连续重复创建任务                         |
| 轮询时网络报错        | 继续用同一个任务 ID 查询，不要马上重建任务                 |

## 注意事项

- 每 10–15 秒轮询一次，整体超时不少于 20 分钟。
- 目前最高分辨率是 720p，传更高的值可能被降到 720p。
- 完成后直接用 `video_url`，暂不建议依赖 `/v1/videos/{id}/content`。
- 费用与请求的时长相关，测试时先用 4 秒。

## 下一步

- [Veo 视频](/docs/api/veo-video)
- [GPT Image](/docs/api/gpt-image-2)
- [API 概览](/docs/api)
