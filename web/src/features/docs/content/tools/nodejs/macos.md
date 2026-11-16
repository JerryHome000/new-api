macOS 上推荐用 Homebrew 安装。

## 方法一：Homebrew（推荐）

先确认是否已装 Homebrew：

```bash
brew -v
```

没有的话先安装 Homebrew：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

然后安装 Node.js 并确认版本：

```bash
brew update
brew install node
node -v
npm -v
```

## 方法二：官网安装包

1. 打开 [nodejs.org](https://nodejs.org/)，下载 LTS 版本的 `.pkg`。
2. 双击安装。
3. 打开终端执行 `node -v` 和 `npm -v` 确认。

## 常见问题

### npm 全局安装报权限错误

不建议用 `sudo npm install -g` 硬装。改用 Homebrew 安装的 Node，或用 `nvm` 管理 Node 版本，都能避免权限问题。

### npm 下载很慢

国内网络可以切换到镜像源（随时可以改回）：

```bash
npm config set registry https://registry.npmmirror.com
npm config get registry
```
