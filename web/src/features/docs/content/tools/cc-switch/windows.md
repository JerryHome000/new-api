## 1. 安装

1. 打开 CC-Switch 的 GitHub Releases 页面，下载 Windows 的 `.msi` 安装包；
2. 双击安装；
3. 安装完成后从开始菜单启动。

## 2. 添加 {{SITE_NAME}}

在 CC-Switch 里新增一个 Provider，按工具填写：

| 工具        | Base URL          |
| ----------- | ----------------- |
| Claude Code | `{{BASE_URL}}`    |
| Codex       | `{{BASE_URL}}/v1` |
| OpenCode    | `{{BASE_URL}}/v1` |

- 名称：随意，例如 `{{SITE_NAME}}`
- API Key：你的 {{SITE_NAME}} Key

## 3. 验证

回到对应工具的教程，用其中的验证命令测试：

- [Claude Code Windows](/docs/tools/claude-code/windows)
- [Codex Windows](/docs/tools/codex/windows)
- [OpenCode Windows](/docs/tools/opencode/windows)
