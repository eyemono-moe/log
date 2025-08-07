# 推奨コマンド

## 開発コマンド
```bash
# 開発サーバー起動
pnpm dev

# プロダクションビルド
pnpm build

# ビルド結果のプレビュー
pnpm preview

# 新しいブログ記事作成
pnpm new
```

## コード品質管理
```bash
# フォーマット（安全な修正のみ）
pnpm fmt

# フォーマット（安全でない修正も含む）
pnpm fmt:force

# 手動でBiome実行
npx biome check --write
```

## 基本的なシステムコマンド
```bash
# ファイル一覧
ls -la

# ディレクトリ移動
cd [path]

# ファイル検索
find . -name "*.ts" -o -name "*.tsx" -o -name "*.astro"

# 文字列検索
grep -r "pattern" src/

# Git操作
git status
git add .
git commit -m "message"
git push
```

## プロジェクト固有のパス
- **記事ディレクトリ**: `src/content/posts/`
- **コンポーネント**: `src/components/`
- **ページ**: `src/pages/`
- **スタイル設定**: `uno.config.ts`
- **Astro設定**: `astro.config.ts`
- **TypeScript設定**: `tsconfig.json`