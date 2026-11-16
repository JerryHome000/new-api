## 1. 安装 Hermes Agent

打开「终端」，执行官方安装命令：

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

安装器会自己准备 Python 和依赖，命令装在 `~/.local/bin`。**重新打开终端**后确认：

```bash
hermes --version
```

## 2. 写入配置

配置文件是 `~/.hermes/config.yaml`（设置了 `HERMES_HOME` 时以它为准）：

```bash
mkdir -p ~/.hermes
open -e ~/.hermes/config.yaml   # 也可以用你习惯的编辑器
```

写入以下内容；已有配置时只添加或替换对应段落：

```yaml
model:
  default: "{{CLAUDE_MODEL}}"
  provider: "{{PROVIDER_ID}}-claude"

providers:
  {{PROVIDER_ID}}-claude:
    name: "{{SITE_NAME}} Claude"
    base_url: "{{BASE_URL}}"
    api_mode: anthropic_messages
    api_key: "YOUR_CLAUDE_KEY"
    default_model: "{{CLAUDE_MODEL}}"
    models:
      "{{CLAUDE_MODEL}}":
        context_length: 1000000
  {{PROVIDER_ID}}-gpt:
    name: "{{SITE_NAME}} GPT"
    base_url: "{{BASE_URL}}/v1"
    api_mode: codex_responses
    api_key: "YOUR_GPT_KEY"
    default_model: "{{GPT_MODEL}}"
    models:
      "{{GPT_MODEL}}":
        context_length: 1050000

agent:
  reasoning_effort: "medium"
```

- 两个 Key 分别换成你的 Claude、GPT 分组 Key。只用一家时删掉另一家的条目，并让 `model` 指向保留的那一家。
- Claude 地址**不带** `/v1`，GPT 地址**必须带** `/v1`。
- 字段名用小写加下划线，驼峰写法不生效。

## 3. 启动并验证

```bash
hermes -z "Reply with exactly: OK"
hermes -z "Reply with exactly: OK" --provider {{PROVIDER_ID}}-gpt -m {{GPT_MODEL}}
```

两条都回复 `OK` 即配置成功。之后运行 `hermes` 进入交互，用 `/model` 切换模型、`/reasoning` 调整推理强度。

## 常见问题

### 找不到 hermes 命令

安装器已经把 `~/.local/bin` 加进 PATH，重开终端后才生效。

### Claude 报 `Requests from the ... framework are not supported`

Key 所在分组只允许 Claude 官方客户端，请换一个允许第三方工具的分组重新创建 Key。

### 调用失败 / 401

- Key 是否完整，是否配在了对应的 Provider 下（Claude Key 配给 `{{PROVIDER_ID}}-claude`，GPT Key 配给 `{{PROVIDER_ID}}-gpt`）；
- `base_url` 的 `/v1` 是否写对；
- `hermes doctor` 中「Anthropic API」显示 ✗ 可以忽略。
