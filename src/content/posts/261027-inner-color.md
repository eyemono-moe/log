---
title: 【VRChat】インナーカラー改変覚書
createdAt: 2026-10-26T18:13:44.636Z
tags:
  - VRChat
category: tech
imageUrl: /public/media/261027-inner-color/VRChat_2026-10-26_22-34-27.065_1920x1080.png
---


先日行った↓のインナーカラー改変を行った際の手順メモ

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">やっと改変慣れてきた
今日はインナーカラーにしてみた
#VRChat始めました https://t.co/mBmV0urDgu</p>&mdash; eyemono.moe (あいもの) (@eyemono_moe) <a href="https://x.com/eyemono_moe/status/2114419336215773428?ref_src=twsrc%5Etfw">October 25, 2026</a></blockquote>
<script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

1. 対象の髪のメッシュを手に入れる。fbxが同梱されていたらそこから拝借
2. blenderに髪メッシュをimportする
3. 髪メッシュに、以下のようなマテリアルを設定する
  ![](/media/261027-inner-color/image.png)
  これは「特定の方向を向いている面を白色にする」マテリアル。
  DotProductノードで メッシュの法線と"特定の方向"の内積を取り、正の値を持つ面だけを白色にしている。
  ここでの"特定の方向"は、"頭部の中心位置ベクトル - メッシュの位置ベクトル"で、つまり頭の中心に向かう方向。
  これにより、髪の毛の内側の面だけが白色になる。
  ![](/media/261027-inner-color/image-1.png)
  この例では"頭部の中心位置ベクトル"を調整するために、Emptyオブジェクトを作成して頭部の中心に配置し、このEmptyオブジェクトの位置をドライバでノードに設定している。
4. ベイクする
5. 毛先などの細かい部分はベイクがうまくいかなかったり、ハネた毛先が意図しない色になっている可能性があるので、画像編集ソフト等で調整する
6. 完成した画像をマスクとして利用し、[TexStackEditor](https://booth.pm/ja/items/8026112)などを使って部分的に色を変更する
7. 完成

![](/media/261027-inner-color/VRChat_2026-10-26_22-34-27.065_1920x1080.png)

普通に内側のメッシュをポチポチ選択してもよいが、面倒だったので...
