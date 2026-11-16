Windows 上有两种用法：直接在 PowerShell 里运行，或在 WSL2 里运行。按你的环境选一种。

## 0. 安装 Node.js

先安装 Node.js 22 或以上：[Windows 安装 Node.js](/docs/tools/nodejs/windows)，然后确认：

```powershell
node -v
npm -v
```

## 方式一：PowerShell

### 1. 安装 Codex

```powershell
npm install -g @openai/codex
codex --version
```

### 2. 创建配置目录

配置目录是 `%USERPROFILE%\.codex`，也就是 `C:\Users\<你的用户名>\.codex\`。

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.codex"
```

### 3. 写入 config.toml

```powershell
@'
model_provider = "{{PROVIDER_ID}}"
model = "{{GPT_MODEL}}"
review_model = "{{GPT_MODEL}}"
model_reasoning_effort = "medium"
disable_response_storage = true
network_access = "enabled"
windows_wsl_setup_acknowledged = true
model_context_window = 272000
model_auto_compact_token_limit = 272000
effective_context_window_percent = 95

[model_providers.{{PROVIDER_ID}}]
name = "{{PROVIDER_ID}}"
base_url = "{{BASE_URL}}/v1"
wire_api = "responses"
requires_openai_auth = true
'@ | Set-Content -Path "$env:USERPROFILE\.codex\config.toml" -Encoding UTF8
```

各字段的含义：

| 字段                     | 说明                                                    |
| ------------------------ | ------------------------------------------------------- |
| `model_provider`         | 使用下面定义的 `{{PROVIDER_ID}}` 这个 Provider          |
| `model` / `review_model` | 日常对话和代码评审使用的模型                            |
| `model_reasoning_effort` | 推理强度：`low` / `medium` / `high` / `xhigh`           |
| `model_context_window`   | 上下文窗口，按 272K 配置                                |
| `base_url`               | {{SITE_NAME}} 的 OpenAI 协议地址，必须带 `/v1`          |
| `wire_api`               | 使用 Responses 接口                                     |
| `requires_openai_auth`   | 必须为 `true`，否则 Codex 不会读取 `auth.json` 里的 Key |

### 4. 写入 auth.json

把 `YOUR_API_KEY` 换成你在控制台复制的 Key：

```powershell
@'
{
  "OPENAI_API_KEY": "YOUR_API_KEY"
}
'@ | Set-Content -Path "$env:USERPROFILE\.codex\auth.json" -Encoding UTF8
```

### 5. 启动并验证

```powershell
codex exec --skip-git-repo-check "Reply with exactly: OK"
cd C:\path\to\your\project
codex
```

## 方式二：WSL2

先安装 WSL2 并进入 Linux 子系统，然后按 [Codex Linux 教程](/docs/tools/codex/linux) 操作即可。
