Claude Code 是 Anthropic 官方的终端编程代理，适合在本地仓库里阅读代码、修改、重构、跑命令和做代码评审。

## 准备工作

- 已安装 Node.js 22 或以上：[安装 Node.js](/docs/tools/nodejs)
- 一个 {{SITE_NAME}} 的 API Key，且所在分组可以调用 Claude 模型：[注册并创建 Key](/docs/guide/account)

Claude Code 使用 Anthropic 协议，Base URL 填**不带** `/v1` 的 `{{BASE_URL}}`。

## 一键配置

想省掉手动安装和写配置，先看 [一键配置安装](/docs/tools/claude-code/one-click)。

## 手动安装

- [Windows](/docs/tools/claude-code/windows)
- [macOS](/docs/tools/claude-code/macos)
- [Linux](/docs/tools/claude-code/linux)

## 验证是否接入成功

装好并写完配置后，在项目目录执行：

```bash
claude --version
claude doctor
claude -p "Reply with exactly: OK"
```

最后一条输出 `OK` 就说明请求已经通过 {{SITE_NAME}}。之后直接运行 `claude` 开始使用。
