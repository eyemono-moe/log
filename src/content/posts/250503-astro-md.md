---
title: AstroでURL末尾に.mdを付けた時にMarkdownを表示させる
tags:
  - astro
createdAt: 2025-05-03T14:59:40.727Z
category: tech
lastModified: 2025-05-04T00:06:01+09:00
---
Twitterで見かけたやつを本ブログに実装しました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">関係ない (ちょっとある) けど、Qiitaが記事のURL末尾に .md をつけると Markdown を返してくれたり、GitHub の Pull Request の URL 末尾に .diff をつけると diff を返してくれるのめっちゃ好き</p>&mdash; Yuya Takeyama (@yuya_takeyama) <a href="https://twitter.com/yuya_takeyama/status/1918243540792230245?ref_src=twsrc%5Etfw">May 2, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

なるほど確かに、今後LLMに読んでもらうことを考えると、プレーンテキストを返すのは良いアイデアですね(Qiitaのこれは[AIとかよりも遥か昔からあった](https://blog.qiita.com/77994282605-2/)上に大抵のAIサービスはURLを与えると勝手にhtml-to-textしてくれると思いますが)。LLMに限らず普通にコピペするときとかも便利そうです。

ということで本ブログでも実装してみました。

## 実装方法

本ブログのコンテンツはMarkdwonで管理しており、ビルド時に生Markdownを取得可能なため、[Astroの静的ファイルエンドポイント](https://docs.astro.build/en/guides/endpoints/#params-and-dynamic-routing)として実装しました。

```ts
// src/pages/api/posts/[id].md.ts
import { join } from "node:path";
import type { APIRoute } from "astro";
import { stringify } from "yaml";
import type { AstroPostEntry } from "../../content.config";
import { getPosts } from "../../utils/getPost";

export async function getStaticPaths() {
  const blogEntries = await getPosts();
  return blogEntries.map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }));
}

export const GET: APIRoute<{ entry: AstroPostEntry }> = async ({
  props,
  url,
}) => {
  const md = props.entry.body ?? "";

  // ローカル画像参照箇所をフルパスに変換
  const localImagePaths =
    (props.entry.rendered?.metadata?.localImagePaths as string[] | undefined) ??
    [];
  const localPathsMap = new Map(
    localImagePaths.map((path) => {
      const localFullPath = join(props.entry.filePath ?? "", path).replace(
        "src/public",
        "",
      );
      const remoteUrl = new URL(localFullPath, url);
      return [path, remoteUrl.toString()];
    }),
  );
  const replaced = md.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, path) => {
      const replacedPath = localPathsMap.get(path);
      if (replacedPath) {
        return `![${alt}](${replacedPath})`;
      }
      return match;
    },
  );

  // frontmatterをyamlに変換して先頭に結合
  const frontmatter = stringify(props.entry.rendered?.metadata?.frontmatter);
  const joined = `---\n${frontmatter}---\n${replaced}`;

  return new Response(joined, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

```

やっていることは以下の通りです。

1. `getStaticPaths`で全てのブログ記事を取得
2. 生Markdownを取得
3. Markdown内のローカル画像参照をフルパスに変換
4. FrontmatterをYAMLに変換してMarkdownの先頭に結合
5. `text/markdown`としてレスポンスを返す
   - 参考元のQiitaでは`text/x-markdown`を返しているようですが、2016年3月に`text/markdwon`が[RFC 7763](https://datatracker.ietf.org/doc/html/rfc7763)として登録されています。

案外スッと実装できました。これでURL末尾に`.md`をつけるとMarkdownが返ってきます。
ローカル画像パスの変換処理周り見落としがありそうなのでちゃんとテストしないといけなさそうですが一旦動いているのでヨシ！
