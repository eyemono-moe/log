# コードベース構造

## プロジェクトルート構成
```
/
├── .github/           # GitHub設定（dependabot.yml）
├── .vscode/           # VSCode設定
├── public/            # 静的ファイル
├── scripts/           # ユーティリティスクリプト
│   └── create-post/   # ブログ記事作成スクリプト
├── src/               # メインソースコード
└── [設定ファイル群]
```

## src/ ディレクトリ詳細
```
src/
├── components/
│   ├── *.astro           # Astroコンポーネント
│   └── solid/            # SolidJSコンポーネント
│       ├── RichLink.tsx  # リッチリンク表示
│       ├── Monologue.tsx # 独白機能
│       ├── Notes.tsx     # Nostr記事一覧
│       ├── TextNote.tsx  # Nostr記事表示
│       ├── EmbedUser.tsx # ユーザー埋め込み
│       └── TweetEmbed.tsx# ツイート埋め込み
├── content/
│   └── posts/            # ブログ記事（Markdown）
├── layouts/
│   ├── BaseLayout.astro  # 基本レイアウト
│   └── PostLayout.astro  # 記事レイアウト
├── pages/
│   ├── index.astro       # トップページ
│   ├── monologue.astro   # 独白ページ
│   ├── policy.astro      # ポリシーページ
│   ├── categories/       # カテゴリページ
│   ├── tags/             # タグページ
│   ├── posts/            # 記事ページ
│   └── og/               # OG画像生成
├── utils/
│   ├── getArticles/      # 外部記事取得
│   ├── nostr/            # Nostrユーティリティ
│   └── [その他ユーティリティ]
├── assets/               # SVGアセット
├── plugins/              # Astroプラグイン
└── provider/             # Nostrプロバイダー
```

## 設定ファイル
- `astro.config.ts`: Astro設定
- `uno.config.ts`: UnoCSS設定  
- `biome.json`: コードフォーマット/リント設定
- `tsconfig.json`: TypeScript設定
- `package.json`: 依存関係とスクリプト
- `frontmatter.json`: Markdownスキーマ設定