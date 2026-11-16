Codex 是 OpenAI 官方的终端编程代理，可以在本地仓库里问答、改代码、跑命令，和你一起迭代。

## 准备工作

- 已安装 Node.js 22 或以上：[安装 Node.js](/docs/tools/nodejs)
- 一个 {{SITE_NAME}} 的 API Key，且所在分组可以调用 GPT 模型：[注册并创建 Key](/docs/guide/account)

## 一键配置

想省掉手动安装和写配置，先看 [一键配置安装](/docs/tools/codex/one-click)。Windows 上要用桌面版，可以先 [下载 ChatGPT 桌面端](/docs/tools/codex/chatgpt-desktop)。

## 手动安装

按系统一步一步配置：

- [Windows](/docs/tools/codex/windows)
- [macOS](/docs/tools/codex/macos)
- [Linux](/docs/tools/codex/linux)

## 配置完成后的样子

在任意项目目录执行：

```bash
codex --version
codex
```

Codex 能正常启动，并且请求走的是 `{{BASE_URL}}/v1`。

## 关键配置一览

| 文件                   | 作用                       |
| ---------------------- | -------------------------- |
| `~/.codex/config.toml` | 模型、Provider 和 Base URL |
| `~/.codex/auth.json`   | 存放 `OPENAI_API_KEY`      |

Windows 下目录是 `%USERPROFILE%\.codex\`；设置了 `CODEX_HOME` 环境变量时以它为准。
