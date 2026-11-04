安装 Hermes Agent，并同时接入 {{SITE_NAME}} 的 Claude 和 GPT。默认模型 `{{CLAUDE_MODEL}}`，推理强度 `medium`。

## 1. 运行脚本

> **待补充** · 一键配置命令：macOS / Linux 的 `curl -fsSL ... | bash` 与 Windows PowerShell 的 `irm ... | iex`，以及脚本菜单说明。

## 2. 安装方式

使用 Hermes 官方安装器，它会自己准备 Python 和依赖，不需要 pip 或系统 Python：

| 系统          | 安装命令                                                                                                 | 命令位置                    |
| ------------- | -------------------------------------------------------------------------------------------------------- | --------------------------- |
| macOS / Linux | `curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh \| bash` | `~/.local/bin/hermes`       |
| Windows       | `irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1 \| iex`        | `%LOCALAPPDATA%\hermes\bin` |

装完后重新打开终端，PATH 才会生效。

> **注意** · Claude 调用报 `Requests from the ... framework are not supported` 时，说明 Key 所在分组只允许官方客户端，请换一个允许第三方工具的分组重新创建 Key。

## 3. 配置文件

配置文件是 Hermes 主目录下的 `config.yaml`：设置了 `HERMES_HOME` 时以它为准；否则 macOS / Linux 为 `~/.hermes`，Windows 为 `%LOCALAPPDATA%\hermes`。

```yaml
model:
  default: "{{CLAUDE_MODEL}}"
  provider: "{{PROVIDER_ID}}-claude"

providers:
  {{PROVIDER_ID}}-claude:
    name: "{{SITE_NAME}} Claude"
    base_url: "{{BASE_URL}}"        # Anthropic 协议，不带 /v1
    api_mode: anthropic_messages
    api_key: "YOUR_CLAUDE_KEY"
    default_model: "{{CLAUDE_MODEL}}"
    models:
      "{{CLAUDE_MODEL}}":
        context_length: 1000000
  {{PROVIDER_ID}}-gpt:
    name: "{{SITE_NAME}} GPT"
    base_url: "{{BASE_URL}}/v1"     # OpenAI 协议，必须带 /v1
    api_mode: codex_responses
    api_key: "YOUR_GPT_KEY"
    default_model: "{{GPT_MODEL}}"
    models:
      "{{GPT_MODEL}}":
        context_length: 1050000

agent:
  reasoning_effort: "medium"
```

- 这是 Hermes 当前版本的 `providers:` 写法，旧文档中的其他写法已不再读取。
- 字段名一律是小写加下划线（`base_url`、`api_key`），驼峰写法不生效。
- 修改前请先备份原文件。

## 4. 验证与使用

```bash
# 默认模型（Claude）
hermes -z "Reply with exactly: OK"

# GPT
hermes -z "Reply with exactly: OK" --provider {{PROVIDER_ID}}-gpt -m {{GPT_MODEL}}
```

| 操作               | 命令                                                                            |
| ------------------ | ------------------------------------------------------------------------------- |
| 进入交互           | `hermes`                                                                        |
| 会话中切换模型     | `/model {{GPT_MODEL}} --provider {{PROVIDER_ID}}-gpt`（加 `--global` 设为默认） |
| 交互式选择默认模型 | `hermes model`                                                                  |
| 调整推理强度       | 会话中 `/reasoning high`，或 `hermes config set agent.reasoning_effort high`    |

`hermes doctor` 里的「Anthropic API」检查的是 Anthropic 官方地址，与本配置无关，显示 ✗ 可以忽略。

## 5. 回滚

把备份复制回 `config.yaml`。Hermes 启动时可能会把同目录的备份移到 `<主目录>/backups/config/`，去那里找即可。
