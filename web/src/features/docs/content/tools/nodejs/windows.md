Windows 上最快的方法是用系统自带的 `winget`。

## 方法一：winget（推荐）

打开 Windows Terminal 或 PowerShell，执行：

```powershell
winget install OpenJS.NodeJS.LTS
```

装完后**重新打开一个终端**，确认版本：

```powershell
node -v
npm -v
```

## 方法二：官网安装包

1. 打开 [nodejs.org](https://nodejs.org/)，下载 LTS 版本的 `.msi` 安装包。
2. 双击运行，保持默认选项一路下一步。
3. 安装完成后打开新的终端，执行 `node -v` 和 `npm -v` 确认。

## 方法三：包管理器

已经在用 Chocolatey 或 Scoop 的话：

```powershell
# Chocolatey
choco install nodejs-lts

# Scoop
scoop install nodejs-lts
```

## 常见问题

### 提示「不是内部或外部命令」

一般是 PATH 还没刷新。关掉所有终端窗口再重新打开；仍然不行就重启电脑。

### npm 下载很慢

国内网络可以切换到镜像源（随时可以改回）：

```powershell
npm config set registry https://registry.npmmirror.com
npm config get registry
```
