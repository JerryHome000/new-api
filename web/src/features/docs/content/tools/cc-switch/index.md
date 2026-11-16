CC-Switch 是一款跨平台的桌面配置管理器，可以在一个界面里统一管理 Claude Code、Codex、OpenCode 等多个 CLI 工具的 Provider，并一键切换。

## 适合谁

- 同时使用多个 CLI 工具，不想逐个改配置文件；
- 需要在多个 Key 或多个服务之间来回切换。

## 安装

- [Windows](/docs/tools/cc-switch/windows)
- [macOS](/docs/tools/cc-switch/macos)
- [Linux](/docs/tools/cc-switch/linux)

## 填写规则

| 工具        | 字段         | 填写                   |
| ----------- | ------------ | ---------------------- |
| Claude Code | API Base URL | `{{BASE_URL}}`         |
| Codex       | Base URL     | `{{BASE_URL}}/v1`      |
| OpenCode    | API Base URL | `{{BASE_URL}}/v1`      |
| 所有工具    | API Key      | 你的 {{SITE_NAME}} Key |

## 建议

先按各工具自己的教程把手动配置跑通，确认能正常调用后，再迁移到 CC-Switch 里管理。出问题时更容易判断是工具本身还是切换器的配置。
