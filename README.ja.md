<div align="center">

![Kirakira Header](https://capsule-render.vercel.app/api?type=waving&color=0:00FFFF,100:FF00FF&height=200&section=header&text=Kirakira&fontSize=80&fontColor=ffffff&fontAlignY=35&desc=インタラクティブ%203D%20ガンダムエフェクトビューア&descAlignY=65&descSize=24&animation=fadeIn)

**技術的な洗練とユーザーフレンドリーなデザインの融合**

言語: [🇰🇷 한국어](README.ko.md) | [🇺🇸 English](README.md) | [🇯🇵 日本語](README.ja.md)

---

## 📋 プロジェクト情報

**プロジェクト**: Kirakira - インタラクティブ3Dガンダムエフェクトビューア  
**タイプ**: Webアプリケーション  
**技術**: Vue.js 3 + Three.js + Webpack

</div>

---

## 🚀 概要

Three.jsを使用して、ガンダムシリーズの象徴的な視覚効果をリアルタイムで体験できるモダンなWebアプリケーションです。GN粒子、ニュータイプフラッシュ、ミノフスキー粒子などをインタラクティブな3D環境で体験してください。

---

## ✨ 主な機能

- **🎭 3Dエフェクトビューア**: ガンダムシリーズの伝説的な視覚効果をリアルタイムでレンダリング
- **🎮 インタラクティブコントロール**: パラメータをリアルタイムで調整し、変化を観察
- **📱 レスポンシブデザイン**: デスクトップとモバイルで最適化された体験
- **🎨 未来的UI**: ガンダム美学からインスピレーションを得た洗練されたクリーンなデザイン
- **⚡ 高性能**: Webpackコードスプリッティングによる最適化されたレンダリング
- **🌙 ダークテーマ**: ネオンアクセントカラーが適用された目に優しいダークテーマ
- **♿ アクセシビリティ**: キーボードナビゲーションをサポートするWCAG 2.1 AA準拠

---

## 🎯 プロジェクト目標

- ✅ Three.jsを使用したインタラクティブ3Dエフェクトの実装
- ✅ Vue.js 3 Composition APIの活用能力の実証
- ✅ MVCアーキテクチャパターンの適用
- ✅ 直感的でモダンなユーザーインターフェースの作成
- ✅ アクセシビリティ準拠の確保
- ✅ パフォーマンスとユーザー体験の最適化

---

## 🏃 クイックスタート

### 前提条件

- **Node.js** 16+ インストール済み
- **npm** 9+ または **yarn** 1.22+ インストール済み
- 依存関係インストールのための**インターネット接続**

### インストールとセットアップ

1. **リポジトリのクローン**  
```bash
git clone <repository-url>
cd GundamKiraKIra
```

2. **依存関係のインストール**  
```bash
npm install
```

3. **開発サーバーの起動**  
```bash
npm run dev
```

4. **アプリケーションへのアクセス**  
```
http://localhost:8080
```

### ビルドとプレビュー

```bash
# プロダクションビルド
npm run build

# プロダクションビルドのプレビュー
npm run preview
```

---

## 📁 プロジェクト構造

```
GundamKiraKIra/
├── src/
│   ├── components/          # Vueコンポーネント
│   │   ├── layout/         # レイアウトコンポーネント
│   │   ├── effects/        # 3Dエフェクトコンポーネント
│   │   ├── library/        # エフェクトライブラリコンポーネント
│   │   └── ui/             # UIコンポーネント
│   ├── effects/             # Three.jsエフェクトモジュール
│   ├── store/               # Piniaストア
│   ├── services/            # APIサービス
│   ├── router/              # Vue Router
│   ├── styles/              # グローバルスタイル
│   ├── mock/                # Mockデータ
│   └── utils/               # ユーティリティ関数
├── public/                  # 静的アセット
├── docs/                    # 開発ドキュメント
├── design-plan/             # デザイン仕様
└── webpack.config.js        # Webpack設定
```

---

## 🛠️ 技術スタック

### フロントエンド

- **Vue.js 3**: Composition API、リアクティブシステム
- **Vue Router**: クライアントサイドルーティング
- **Pinia**: 状態管理
- **Three.js**: 3DグラフィックスとWebGLレンダリング
- **Webpack**: モジュールバンドラーとビルドツール

### スタイリング

- **CSS3**: カスタムプロパティ、モダンスタイリング
- **PostCSS**: CSS処理と最適化
- **レスポンシブデザイン**: モバイルファーストアプローチ

### 開発ツール

- **ESLint**: コード品質
- **Prettier**: コードフォーマット
- **Webpack Dev Server**: Hot Module Replacement

---

## 🎨 実装されたエフェクト

### 🌌 GN粒子
- **シリーズ**: ガンダム00
- **説明**: GNドライブから放出される高エネルギー粒子
- **関連機体**: エクシア、ダブルオーガンダム、クアンタ

### ⚡ ニュータイプフラッシュ
- **シリーズ**: 宇宙世紀
- **説明**: ニュータイプ覚醒時に発生する強烈な金色のフラッシュ
- **関連機体**: νガンダム、ユニコーンガンダム

### 🔮 ミノフスキー粒子
- **シリーズ**: 宇宙世紀
- **説明**: ミノフスキー粒子の電磁干渉効果
- **関連機体**: すべてのモビルスーツ

---

## 📚 ドキュメント

| 言語 | ドキュメント | 説明 |
| ----- | ---- | ---- |
| 🇰🇷 | [한국어](README.ko.md) | 韓国語完全ドキュメント |
| 🇺🇸 | [English](README.md) | 英語完全ドキュメント |
| 🇯🇵 | [日本語](README.ja.md) | 日本語完全ドキュメント |

### 開発ガイド

- [開発環境セットアップ](docs/01_Development_Environment_Setup.md)
- [コンポーネント実装ガイド](docs/02_Component_Implementation_Guide.md)
- [状態管理ガイド](docs/03_State_Management_Guide.md)
- [3Dエフェクトシステムガイド](docs/04_3D_Effect_System_Guide.md)
- [APIサービスガイド](docs/05_API_Services_Guide.md)
- [スタイリング実装ガイド](docs/06_Styling_Implementation_Guide.md)
- [テスト設定ガイド](docs/07_Testing_Setup_Guide.md)
- [デプロイガイド](docs/08_Deployment_Guide.md)

---

## 🎮 使用方法

### キーボードショートカット

- `Ctrl/Cmd + I`: 情報パネルの切り替え
- `Ctrl/Cmd + L`: ライブラリパネルの切り替え
- `Ctrl/Cmd + Enter`: フルスクリーンの切り替え
- `Escape`: すべてのパネルを閉じる

### マウス/タッチコントロール

- **ドラッグ**: カメラ回転
- **スクロール**: ズームイン/アウト
- **タッチ**: モバイル最適化ジェスチャー

---

## 🧪 テスト

```bash
# テスト実行
npm run test

# テストカバレッジ
npm run test:coverage

# E2Eテスト
npm run test:e2e
```

---

## 🤝 貢献

1. リポジトリをフォーク
2. 機能ブランチを作成
3. 変更を加える
4. Pull Requestを提出

### コード標準

- Vue.jsスタイルガイドに従う
- ESLintとPrettierを使用
- 意味のあるコミットメッセージを書く
- 新機能にテストを追加

---

## 📄 ライセンス

このプロジェクトは**教育目的**で開発されました。すべてのコードとドキュメントは教育用途のみです。

---

![Footer](https://capsule-render.vercel.app/api?type=waving&color=0:00FFFF,100:FF00FF&height=150&section=footer&text=Kirakira&fontSize=60&fontColor=ffffff&fontAlignY=50&animation=fadeIn)

<div align="center">

**ガンダム愛好家のために ❤️ で制作されました**

⭐ このリポジトリが役に立ったら、スターを押してください！ ⭐

</div>

