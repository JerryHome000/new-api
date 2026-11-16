下面是三类常见发行版的安装方式。

## Ubuntu / Debian

推荐用 NodeSource 的 LTS 源：

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get update
sudo apt-get install -y nodejs
```

## Fedora / RHEL

```bash
sudo dnf install -y nodejs npm
```

## Arch Linux

```bash
sudo pacman -S --noconfirm nodejs npm
```

装完后执行 `node -v` 和 `npm -v` 确认版本。发行版仓库里的版本偏旧时，建议改用 NodeSource 或 `nvm`。

## 常见问题

### npm 全局安装报权限错误

不要靠 `sudo npm install -g` 解决。用 `nvm` 管理 Node 版本，全局包会装在你的用户目录里。

### npm 下载很慢

国内网络可以切换到镜像源（随时可以改回）：

```bash
npm config set registry https://registry.npmmirror.com
npm config get registry
```
