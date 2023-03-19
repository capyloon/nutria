# 通用操作
button-ok = 确定
button-cancel = 取消

# 电源键菜单操作
action-shutdown = 关机
action-reboot = 重新启动
action-screenshot = 截屏

# 空旋转木马屏幕的内容
empty-carousel = 没有打开任何内容 :(
learn-something-text = 让我们学习一些东西！
learn-something-url = https://en.wikipedia.org/wiki/Special:Random

# 网站崩溃时显示的消息。
content-crashed = 此页面发生了一些问题！
content-reload = 重新加载

# 上下文菜单
image-section-title = 图片
image-set-wallpaper = 设为壁纸
image-download = 下载
image-share = 分享…
image-new-tab = 在新选项卡中打开
link-section-title = 链接
link-copy = 复制
link-copied = 链接已成功复制到剪贴板
link-new-tab = 在新选项卡中打开
link-share = 分享…
link-download = 保存链接
page-section-title = 页面
page-save-as-pdf = 另存为 PDF
selection-section-title = 选定的文本
selection-copy = 复制
selection-share = 分享…
selection-search = 搜索“{$query}”

# 网站信息面板
site-info-add-home = 添加到主屏幕
site-info-split-screen = 分屏
site-info-choose-ua = 用户代理
site-info-b2g-ua = 默认
site-info-android-ua = 安卓
site-info-desktop-ua = 桌面
success-add-to-home = 成功将网站添加到主屏幕
error-add-to-home = 添加网站到主屏幕时出错
site-info-search = 在“{$query}”上搜索...

# 锁屏
lockscreen-emergency-call = 紧急呼叫
lockscreen-wrong-pin = 错误的 PIN

# 耳机状态
headset-plugged = 现在正在使用耳机

# 更换壁纸
wallpaper-changed = 壁纸已更改

# 截图结果
screenshot-saved-success = 截图已保存在{$filename}中
screenshot-saved-error = 保存截图失败：{$error}

# 快速设置面板
emergency-calls-only = 仅限紧急呼叫
connect-peer = 连接
peer-paired = 已配对
launch-peer-app = 启动应用程序

# 下载通知
download-notification-title-downloading = 正在下载
download-notification-title-stopped = 下载已停止
download-notification-title-succeeded = 下载完成
download-notification-title-finalized = 下载完成

# Tor
tor-enabling = 启用 Tor...
tor-enabled = Tor 已启用
tor-disabled = Tor 已禁用

# IPFS发布
ipfs-publish-dialog-title =
    .label = 发布到IPFS
ipfs-publish-title = 发布到IPFS
ipfs-publish-error = 发布{$name}时发生错误
ipfs-publish-success = {$name}成功发布到IPFS
ipfs-publish-share = 分享…
ipfs-button-publish = 发布
ipfs-confirm-publish-public = 名为“{$name}”的文件将公开发布到IPFS网络。
ipfs-confirm-publish-private = 名为“{$name}”的文件将私密发布到IPFS网络。
ipfs-publish-password =
    .label = 输入保护此文件的密码：
ipfs-estuary-missing-token = 无法发布：缺少Estuary API令牌

#<text-share>元素
text-share-copy =
    .label = 复制到剪贴板
text-share-share =
    .label = 分享…
text-share-copied = 文本已成功复制到剪贴板

# 保存为PDF
save-as-pdf-title = 保存为PDF
save-as-pdf-processing = 正在处理“{$filename}”
save-as-pdf-done = “{$filename}”已成功保存
save-as-pdf-error = 无法保存“{$filename}”

# UCAN能力对话框
ucan-dialog-title =
    .label = 权限
ucan-select-url = 选择要授予<span>{$url}</span>的权限：
ucan-select-did =
    .label = 身份
ucan-select-duration =
    .label = 过期时间
ucan-duration-10min = 10分钟
ucan-duration-1hour = 1小时
ucan-duration-1day = 1天
ucan-duration-1week = 1周
ucan-duration-1month = 1个月
ucan-permission-vfs-read = 读取{$scope}文件夹及其子文件夹中的内容
ucan-permission-vfs-write = 写入{$scope}文件夹及其子文件夹中的内容
ucan-permission-vfs-visit = 更新资源的访问
ucan-permission-vfs-search = 在资源数据库上运行查询
ucan-permission-history-read = 访问您的导航历史记录
ucan-permission-history-write = 修改您的导航历史记录
ucan-button-grant = 授予

# 应用程序列表上下文菜单
apps-list-add-home = 添加到主屏幕
apps-list-uninstall = 卸载

# DRM通知
drm-success-title = DRM支持已成功启用
drm-content-disabled-title = DRM支持
drm-content-disabled-text = 您必须启用DRM才能在此页面上播放某些音频或视频
drm-button-title = 启用
drm-content-cdm-installing-title = DRM正在安装
drm-content-cdm-installing-text = Capyloon正在安装播放此页面上的音频或视频所需的组件。请稍后再试。


# P2P 发现和配对
p2p-enable-discovery-success = 节点发现已启用
p2p-enable-discovery-failure = 无法启用节点发现
p2p-disable-discovery-success = 节点发现已禁用
p2p-disable-discovery-failure = 无法禁用节点发现
p2p-peer-found = 发现了新节点：{$name}
p2p-connect-error-not-connected = 无法连接 {$desc} ：未连接
p2p-connect-error-not-paired = 无法连接 {$desc} ：未配对
p2p-connect-error-denied = {$desc} 连接已拒绝
p2p-connect-error-other = 连接 {$desc} 时出错
p2p-connect-success = 已连接到 {$desc}
p2p-connect-request-title = 节点连接请求
p2p-connect-request-text = 您是否接受来自 {$source} 的连接请求？
p2p-connect-request-accept = 接受
p2p-connect-request-reject = 拒绝
p2p-open-url-title = 您是否要在 {$device} 上打开由 {$source} 发送的链接？
p2p-open-url-accept = 打开
p2p-open-url-reject = 取消
p2p-copy-text-title = 您是否要在 {$device} 上复制由 {$source} 发送的文本？
p2p-copy-text-accept = 复制
p2p-copy-text-reject = 取消
p2p-download-title = 您是否要在 {$device} 上下载由 {$source} 提供的此文件？
p2p-download-text = {$name}：{$size} 字节
p2p-download-accept = 下载
p2p-download-reject = 取消
p2p-launch-title = 您是否要在 {$device} 上启动由 {$source} 发送的此应用？
p2p-launch-accept = 启动
p2p-launch-reject = 取消
p2p-activity-title = 您是否要在 {$device} 上启动由 {$source} 触发的此活动？
p2p-activity-accept = 启动
p2p-activity-reject = 取消
p2p-tile-title = 您是否要在 {$device} 上启动由 {$source} 发送的图块？
p2p-tile-accept = 启动
p2p-tile-reject = 取消

# Activities names displayed in the activity chooser.
activity-pick = 在...中选择文件
activity-share = 分享给...
activity-add-to-home = 添加到主屏幕
activity-p2p-tile-start = 选择图块
activity-scan-qr-code = 扫描二维码
activity-view-resource = 查看文件
activity-publish-resource = 发布文件
activity-install-wasm-plugin = 安装WASM插件