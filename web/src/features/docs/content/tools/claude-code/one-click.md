一键脚本可以同时安装和配置 Claude Code CLI 与 Claude 桌面版。默认模型 `{{CLAUDE_MODEL}}`，推理强度 `medium`。

## 1. 运行脚本

> **待补充** · 一键配置命令：macOS / Linux 的 `curl -fsSL ... | bash` 与 Windows PowerShell 的 `irm ... | iex`，以及脚本菜单说明。

## 2. 安装方式

| 安装对象        | macOS / Linux                                             | Windows                           |
| --------------- | --------------------------------------------------------- | --------------------------------- |
| Claude Code CLI | 官方安装器，或 `npm install -g @anthropic-ai/claude-code` | 官方安装器，或 npm                |
| Claude 桌面版   | macOS：`brew install --cask claude`；Linux 暂无官方桌面版 | `winget install Anthropic.Claude` |

- 用 npm 安装需要 Node.js，见 [安装 Node.js](/docs/tools/nodejs)。
- 没有 Homebrew 或 winget 时，可以到 [claude.ai/download](https://claude.ai/download) 手动下载桌面版。
- Windows 上 Git for Windows 是可选的；没有安装时 Claude Code 会用 PowerShell 执行命令。

## 3. 会写入哪些文件

**Claude Code CLI**：`~/.claude/settings.json`（Windows 为 `%USERPROFILE%\.claude\settings.json`）

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "{{BASE_URL}}",
    "ANTHROPIC_AUTH_TOKEN": "YOUR_API_KEY",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "model": "{{CLAUDE_MODEL}}",
  "effortLevel": "medium"
}
```

另外在 `~/.claude.json` 中设置 `"hasCompletedOnboarding": true`，可以跳过首次启动的官方登录引导。

**Claude 桌面版**：开启「第三方推理（gateway）」模式。配置目录如下：

| 系统    | 位置                                                    |
| ------- | ------------------------------------------------------- |
| macOS   | `~/Library/Application Support/Claude/` 与 `Claude-3p/` |
| Windows | `%LOCALAPPDATA%\Claude\` 与 `Claude-3p\`                |
| Linux   | `~/.config/Claude/` 与 `Claude-3p/`                     |

两个 `claude_desktop_config.json` 中的 `deploymentMode` 设为 `3p`，再在 `Claude-3p/configLibrary/` 下添加一个指向 {{SITE_NAME}} 的 gateway 配置（地址、Key 和可用模型列表）。

修改前请先备份；已有的权限、MCP 等配置应当保留。

## 4. 验证

```bash
claude -p "Reply with exactly: OK"
```

输出 `OK` 即配置成功。桌面版需要彻底退出（包括托盘或菜单栏图标）后重新打开，再发一条消息试试。

## 5. 常见问题

- **改了配置不生效**：CLI 重开终端再运行；桌面版必须彻底退出后重开。
- **401 / Key 无效**：确认 Key 复制完整，并且所在分组能调用 Claude 模型。
- **换 Key 或换地址**：直接修改 `settings.json` 中的两个值即可。
- **回滚**：把备份文件改回原文件名。
