这一页专门处理连不上、超时、报错、工具启动异常这类问题。请按顺序排查，一次只改一处配置。

## 0. 先确认三件事

1. Key 没有写错，前后没有多余空格；
2. Base URL 写对了：OpenAI 兼容接口用 `{{BASE_URL}}/v1`，Claude Code 这类工具用不带 `/v1` 的 `{{BASE_URL}}`；
3. 网络能访问 `{{BASE_URL}}`。

## 1. Claude Code

### 一直弹登录，或者还在走官方服务

确认 `~/.claude/settings.json`（Windows 为 `%USERPROFILE%\.claude\settings.json`）的 `env` 里有这两项：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "{{BASE_URL}}",
    "ANTHROPIC_AUTH_TOKEN": "YOUR_API_KEY"
  }
}
```

如果是通过环境变量配置的，可以这样检查：

```bash
echo "$ANTHROPIC_BASE_URL"
echo "$ANTHROPIC_AUTH_TOKEN"
```

```powershell
echo $env:ANTHROPIC_BASE_URL
echo $env:ANTHROPIC_AUTH_TOKEN
```

输出为空说明没有生效，回到对应系统的教程重新配置：[Windows](/docs/tools/claude-code/windows)、[macOS](/docs/tools/claude-code/macos)、[Linux](/docs/tools/claude-code/linux)。

### 400 或会话异常

多半是会话状态出了问题：在工具里执行 `/clear` 清空会话，或者直接退出重开。

## 2. Codex

### 配置写了但没生效

先确认两个配置文件都在：

- macOS / Linux：`~/.codex/config.toml`、`~/.codex/auth.json`
- Windows：`%USERPROFILE%\.codex\config.toml`、`%USERPROFILE%\.codex\auth.json`

再确认 `config.toml` 里的 `base_url` 是 `{{BASE_URL}}/v1`，`auth.json` 里 Key 的字段名是 `OPENAI_API_KEY`。

## 3. OpenCode

### 启动时报找不到 SDK

SDK 要装在 OpenCode 的配置目录里，而不是项目目录：

```bash
mkdir -p ~/.config/opencode && cd ~/.config/opencode
npm install @ai-sdk/anthropic @ai-sdk/openai
```

```powershell
cd "$env:USERPROFILE\.config\opencode"
npm install @ai-sdk/anthropic @ai-sdk/openai
```

### 配置文件 JSON 格式错误

检查是否漏了逗号或引号、最后一项后面是否多了逗号；也可以把内容粘贴到 JSON 校验工具里定位。

## 4. OpenClaw

### doctor 提示 provider / api 配置不对

GPT 模型的 `api` 用 `openai-responses`，`baseUrl` 指向 `{{BASE_URL}}/v1`。完整配置见 [OpenClaw 教程](/docs/tools/openclaw)。

## 5. 通用错误码

| 现象                           | 常见原因                         | 处理                                   |
| ------------------------------ | -------------------------------- | -------------------------------------- |
| 401                            | Key 错误、已删除或已禁用         | 在 [API Keys](/keys) 里核对并重新复制  |
| 403 / 无权限                   | Key 所在分组不支持该模型         | 换到正确的分组重新建 Key               |
| `model_not_found` / 无可用渠道 | 模型名写错，或分组里没有这个模型 | 从 [模型广场](/pricing) 复制完整模型名 |
| 余额不足                       | 账户额度用完                     | 到 [钱包](/wallet) 充值                |
| 429                            | 请求过于频繁                     | 降低并发，稍后重试                     |
| 超时                           | 网络不稳定，或任务本身耗时长     | 检查网络，适当调大客户端超时           |

## 6. 还是没解决？

联系支持前准备好下面这些信息，处理会快很多：

- 工具名和版本（例如 `claude --version`）；
- 操作系统（Windows / macOS / Linux）和终端（PowerShell / zsh / bash）；
- 你填写的 Base URL（**不要**发 Key）；
- 报错截图或完整的报错文本。

联系方式见 [获取支持](/docs/help/support)。
