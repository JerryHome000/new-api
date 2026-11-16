这里回答新手最常问的问题。如果遇到的是报错、超时、连不上之类的技术问题，直接看 [疑难杂症](/docs/help/troubleshooting)。

## 账号与 API Key

### API Key 在哪里创建？

见 [注册并创建 Key](/docs/guide/account)。

### 请求报错，先查什么？

- 创建 Key 时**选对了分组**没有。不要用默认分组，要选模型所在的分组；
- 模型名是否正确，建议直接从 [模型广场](/pricing) 复制；
- Key 是否完整复制进了配置，没有多余空格；
- 请求地址是否已经换成 `{{BASE_URL}}`。

### 不同工具能共用一个 Key 吗？

不同分组对应不同的模型和计费方式。比如同时用 Codex 和 Claude Code 时，通常需要分别在对应分组下建 Key。

建议一个工具一个 Key，方便分别查看用量、单独停用。

## 充值与发票

### 余额会过期吗？

> **待补充** · 余额有效期说明。

### 怎么开发票？

> **待补充** · 开票门槛、发票类型与申请流程。详见 [充值与退款](/docs/guide/recharge#发票)。

### 可以退款吗？

> **待补充** · 退款条件、时限与手续费。详见 [充值与退款](/docs/guide/recharge#退款)。

## 环境与安装

### 为什么总让我先装 Node.js？

很多 CLI 工具是用 Node.js 写的，需要先有 Node 运行环境。按系统安装：[Windows](/docs/tools/nodejs/windows)、[macOS](/docs/tools/nodejs/macos)、[Linux](/docs/tools/nodejs/linux)。

### npm 安装很慢或失败？

国内网络可以临时切换到镜像源（随时可以改回）：

```bash
npm config set registry https://registry.npmmirror.com
npm config get registry
```

### 环境变量设置了却不生效？

- **Windows**：设置用户级环境变量后要重开终端；还不行就注销或重启。
- **macOS / Linux**：写进 `~/.zshrc` 或 `~/.bashrc` 后，要执行一次 `source` 或重开终端。

## 工具使用

### 新手先用哪个工具？

从 [Claude Code](/docs/tools/claude-code) 或 [Codex](/docs/tools/codex) 里挑一个就够了。

### Base URL 到底填哪个？

最常见的是这两个：

| 地址              | 用在哪里                                                   |
| ----------------- | ---------------------------------------------------------- |
| `{{BASE_URL}}`    | Claude Code 等走 Anthropic 协议、要求**不带** `/v1` 的工具 |
| `{{BASE_URL}}/v1` | OpenAI 兼容接口，Codex、OpenCode、OpenClaw 等              |

每个工具的教程里都写明了该填哪一个，照着填即可。

## 还没解决？

先看 [疑难杂症](/docs/help/troubleshooting)，再到 [获取支持](/docs/help/support) 联系我们。
