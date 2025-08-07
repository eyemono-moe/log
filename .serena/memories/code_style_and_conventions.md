# コードスタイルと規約

## Biome設定
- **フォーマッタ**: Biome
- **インデント**: Tab
- **クォートスタイル**: ダブルクォート（"）
- **リント**: Biomeの推奨ルールを使用

## TypeScript設定
- **設定**: Astro strict設定を継承
- **JSX**: preserve
- **JSXインポートソース**: solid-js

## ファイル命名規約
- **ブログ記事**: `YYMMdd-{random}.md` 形式（例: 250503-6nwla5.md）
- **Astroコンポーネント**: PascalCase.astro
- **SolidJSコンポーネント**: PascalCase.tsx
- **ユーティリティファイル**: camelCase.ts

## ディレクトリ構造
```
src/
├── components/        # Astroコンポーネント
│   └── solid/        # SolidJSコンポーネント
├── content/
│   └── posts/        # ブログ記事（Markdown）
├── layouts/          # レイアウトコンポーネント
├── pages/            # ページルーティング
├── utils/            # ユーティリティ関数
├── assets/           # 静的アセット
├── plugins/          # Astroプラグイン
└── provider/         # プロバイダー（Nostr等）
```

## スタイリング規約
- **CSS フレームワーク**: UnoCSS
- **カスタムカラー**: accentカラーパレット（oklch形式）
- **フォント**: Noto Sans JP
- **ダークモード**: サポート済み
- **レスポンシブ**: モバイルファースト

## マークダウン設定
- **プラグイン**: 
  - remark-link-card（リンクカード）
  - rehype-slug（見出しID）
  - rehype-autolink-headings（見出しリンク）
  - rehype-external-links（外部リンク）
- **シンタックスハイライト**: astro-expressive-code