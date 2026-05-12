# Android 安装包与构建说明

本目录用于存放从 EAS 或本机构建得到的 **APK / AAB** 说明与下载位置；实际产物请放到 `output/`（大文件已被 `.gitignore` 忽略，不会提交到仓库）。

## 应用标识（可自行修改）

- **显示名称**：`app.json` → `expo.name`（当前示例：小游戏合集）
- **包名**：`app.json` → `expo.android.package`（当前示例：`com.local.minigames`）。发布到应用商店前请改为你在 Google Play 注册的唯一包名。

## 首次使用 EAS（云端构建）

1. 安装依赖后本仓库已包含 `eas-cli`（也可全局安装或使用 `npx eas-cli`）。
2. 登录 Expo 账号：
   ```bash
   npx eas-cli login
   ```
3. 若项目尚未关联 EAS，在项目根目录执行：
   ```bash
   npx eas-cli init
   ```
   按提示关联或创建 Expo 项目（需与 `app.json` 中的 `slug` 等一致）。

## 构建命令（项目根目录）

| 产物 | npm 脚本 | 说明 |
|------|-----------|------|
| **APK**（内测 / 侧载） | `npm run build:android:apk` | 使用 `eas.json` 中 `preview` 配置，`android.buildType` 为 `apk` |
| **AAB**（上架 Google Play） | `npm run build:android:aab` | 使用 `production` 配置，默认 **App Bundle**（`app-bundle`） |

等价命令：

```bash
npx eas-cli build -p android --profile preview
npx eas-cli build -p android --profile production
```

构建完成后，在 [Expo 控制台](https://expo.dev) 对应项目的 **Builds** 页面下载 **.apk** 或 **.aab**，保存到本仓库的 **`android-install/output/`** 便于本地安装或备份（该目录下的 apk/aab 不会被 git 跟踪）。

## 本机构建替代方案（无需 EAS）

适合离线或完全本地控制构建链的场景：

1. 生成原生工程：
   ```bash
   npx expo prebuild --platform android
   ```
2. 进入 `android` 目录，使用 Gradle 打 **release APK**（侧载）：
   ```bash
   cd android
   .\gradlew.bat assembleRelease
   ```
   生成的 APK 通常在 `android/app/build/outputs/apk/release/`。  
   打 **AAB**（上架）可使用 `bundleRelease`（具体任务以 Gradle 输出为准）。

本路径需自行配置 **签名密钥（keystore）**：在 `android/app` 或通过 `gradle.properties` / 环境变量配置 `release` 签名，切勿把私钥提交到公开仓库。

## 签名与密钥

- EAS 首次构建时可按向导由 Expo **托管凭据**，或上传你自己的 keystore。
- 本地 `gradlew` 构建必须在 Android 工程中配置 **release 签名**，否则无法得到可上架或稳定升级的正式包。

## 关于「纯离线应用」

本项目小游戏逻辑在客户端运行，**不依赖联网即可游玩**；但 **EAS 构建、登录 Expo、下载构建产物** 仍需要网络。若需完全离线出包，请使用上面的 **expo prebuild + Gradle** 路径，并在已缓存依赖的环境中操作。
