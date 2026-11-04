## 0. 安装 Node.js

先安装 Node.js 22 或以上：[Windows 安装 Node.js](/docs/tools/nodejs/windows)，然后确认：

```powershell
node -v
npm -v
```

## 1. 安装 Claude Code

打开 PowerShell：

```powershell
npm install -g @anthropic-ai/claude-code
claude --version
```

## 2. 写入配置

Claude Code 的配置都放在 `%USERPROFILE%\.claude\settings.json`，不需要改系统环境变量。

### 创建配置目录

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude"
```

### 写入 settings.json

把 `YOUR_API_KEY` 换成你的 Key 后执行：

```powershell
@'
{
  "env": {
    "ANTHROPIC_BASE_URL": "{{BASE_URL}}",
    "ANTHROPIC_AUTH_TOKEN": "YOUR_API_KEY",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "model": "{{CLAUDE_MODEL}}"
}
'@ | Set-Content -Path "$env:USERPROFILE\.claude\settings.json" -Encoding UTF8
```

| 字段                                       | 说明                                 |
| ------------------------------------------ | ------------------------------------ |
| `ANTHROPIC_BASE_URL`                       | {{SITE_NAME}} 的地址，**不带** `/v1` |
| `ANTHROPIC_AUTH_TOKEN`                     | 你的 API Key                         |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | 关闭遥测等非必要请求                 |
| `model`                                    | 默认模型，可省略                     |

确认文件内容：

```powershell
Get-Content "$env:USERPROFILE\.claude\settings.json"
```

## 3. 启动并验证

```powershell
claude -p "Reply with exactly: OK"
cd C:\path\to\your\project
claude doctor
claude
```

## 常见问题

### npm install -g 报权限错误

用「以管理员身份运行」的 PowerShell 再试，或改用 nvm-windows 管理 Node.js。

### 找不到 claude 命令

关闭 PowerShell 重新打开；仍不行就重新安装 Claude Code。
