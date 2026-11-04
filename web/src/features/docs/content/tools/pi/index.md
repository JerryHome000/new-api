Pi 是一款轻量的终端编程代理，用一个 `models.json` 声明自定义 Provider，同时支持 Anthropic 和 OpenAI 两套接口。

## 准备工作

- Node.js 22.19 或更高版本：[Node.js 安装](/docs/tools/nodejs)
- {{SITE_NAME}} 的 API Key：[注册并创建 Key](/docs/guide/account)

## 安装

```bash
npm i -g @earendil-works/pi-coding-agent@latest
```

## 配置

推荐直接看 [一键配置安装](/docs/tools/pi/one-click)，页面里也列出了手动写入的完整配置。

## 接口规则

| 模型   | `api`                | `baseUrl`                         |
| ------ | -------------------- | --------------------------------- |
| Claude | `anthropic-messages` | `{{BASE_URL}}`（不带 `/v1`）      |
| GPT    | `openai-responses`   | `{{BASE_URL}}/v1`（必须带 `/v1`） |
