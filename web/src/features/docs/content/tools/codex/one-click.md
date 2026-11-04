一键脚本会装好 Codex CLI，并为 CLI 和桌面版写入 {{SITE_NAME}} 的配置。默认模型 `{{GPT_MODEL}}`，推理强度 `medium`。

## 1. 运行脚本

> **待补充** · 一键配置命令：macOS / Linux 的 `curl -fsSL ... | bash` 与 Windows PowerShell 的 `irm ... | iex`，以及脚本菜单说明。

## 2. 前置条件

Codex CLI 通过 npm 安装（包名 `@openai/codex`），需要 Node.js 22 或以上：[安装 Node.js](/docs/tools/nodejs)。只用桌面版的话可以不装 CLI，只写配置。

## 3. 会写入哪些文件

配置目录是 `~/.codex/`（Windows 为 `%USERPROFILE%\.codex\`，设置了 `CODEX_HOME` 时以它为准）。

`config.toml` 的关键部分：

```toml
model_provider = "{{PROVIDER_ID}}"
model = "{{GPT_MODEL}}"
review_model = "{{GPT_MODEL}}"
model_reasoning_effort = "medium"

[model_providers.{{PROVIDER_ID}}]
name = "{{PROVIDER_ID}}"
base_url = "{{BASE_URL}}/v1"
wire_api = "responses"
requires_openai_auth = true
```

`auth.json` 写入 `OPENAI_API_KEY`。

- `config.toml` 里你自己的其他配置（MCP 服务、profiles 等）应当保留。
- `auth.json` 里如果有 ChatGPT 官方登录凭据，Codex 会优先使用它，导致请求 {{SITE_NAME}} 时返回 401。需要先移除（记得备份）；想切回官方登录时恢复备份，或重新执行 `codex login`。

## 4. 验证

```bash
codex exec --skip-git-repo-check "Reply with exactly: OK"
```

输出 `OK` 就说明配置成功。桌面版需要彻底退出后重新打开才会读取新配置。

## 5. 常见问题

- **401 Unauthorized**：确认 Key 所在分组能调用 GPT 模型，并且 `auth.json` 里的 Key 没有多余空格。
- **切换推理强度**：在 Codex 中输入 `/model` 选择，或修改 `config.toml` 的 `model_reasoning_effort`，可选 `low` / `medium` / `high` / `xhigh`。
- **回滚**：把备份的 `config.toml`、`auth.json` 改回原文件名。
