## 1. 安装

推荐用 Homebrew：

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

也可以去 CC-Switch 的 GitHub Releases 页面下载 macOS 安装包。安装后从「应用程序」启动。

## 2. 添加 {{SITE_NAME}}

在 CC-Switch 里新增一个 Provider，按工具填写：

| 工具        | Base URL          |
| ----------- | ----------------- |
| Claude Code | `{{BASE_URL}}`    |
| Codex       | `{{BASE_URL}}/v1` |
| OpenCode    | `{{BASE_URL}}/v1` |

- 名称：随意，例如 `{{SITE_NAME}}`
- API Key：你的 {{SITE_NAME}} Key

保存后在列表里选中它即可切换。

## 3. 验证

回到对应工具的教程，用其中的验证命令测试：

- [Claude Code macOS](/docs/tools/claude-code/macos)
- [Codex macOS](/docs/tools/codex/macos)
- [OpenCode macOS](/docs/tools/opencode/macos)
