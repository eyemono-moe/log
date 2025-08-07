# プロジェクト概要

## プロジェクトの目的
eyemono.log - 個人ブログサイト
Astroを使用した静的サイトジェネレーター（SSG）ベースのブログサイト。NostrプロトコルのNostrと連携した独白機能も持つ。

## 技術スタック
- **フレームワーク**: Astro 5.12.8
- **フロントエンド**: SolidJS
- **スタイリング**: UnoCSS
- **TypeScript**: strict設定で使用
- **パッケージマネージャー**: pnpm
- **コードフォーマッタ/リンタ**: Biome
- **記事管理**: Markdown形式（src/content/posts/）

## 主要な機能
- ブログ記事の表示とカテゴリ/タグ機能
- OGP画像の自動生成
- Nostrプロトコルを利用した独白（monologue）機能
- 外部サービス記事の取得（Zenn、traP）
- リンクカード表示
- 自動リンクヘッダー生成

## サイト情報
- URL: https://log.eyemono.moe
- デプロイ方法: 静的サイトビルド（astro build）

## 開発環境
- Linux WSL2環境での開発
- Git管理
- pnpm 9.15.2を使用