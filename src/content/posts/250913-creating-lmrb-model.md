---
title: LittleMaidReBirth用のマルチモデルを自作するメモ
draft: false
createdAt: 2025-09-13T14:46:54.795Z
category: tech
tags:
  - game
---

Minecraftの有名Modである[Create](https://github.com/Creators-of-Create/Create)のバージョン6.0系がリリースされてたので(6か月前)最近久しぶりにMinecraftで遊んでました。自分がマイクラを起動するときはほぼ100%[LittleMaidReBirth(LMRB)](https://forum.civa.jp/viewtopic.php?t=119)を入れてメイドさんと一緒に遊んでいるのですが、そろそろメイドさんのモデルの自作に挑戦してみようと思い立ちました。

が、なかなか情報が見つからなかったのでここにまとめておきます。あくまで自分用メモです。後で清書する。
Mod開発/Javaの知識はゼロなので、間違っている可能性があります。

> [!WARNING]
> :construction_worker_man::construction:まだ執筆中:building_construction::construction_worker_woman:

## 環境

- Windows 11
- Minecraft Java Edition 1.20.1
- LMRB-1.20.1-8.9.2-Forge
- LMML-1.20.1-8.2.0-Forge

## Minecraftとは

<https://www.minecraft.net>

## LittleMaidReBirthとは

<https://forum.civa.jp/viewtopic.php?t=119>

<https://github.com/SistrScarlet/LittleMaidReBirth-Architectury>

[littleMaidMob](https://minecraftjapan.miraheze.org/wiki/MOD解説/littleMaidMob)のMinecraft v1.15.2以降対応版。

## コードリーディングメモ

<https://github.com/SistrScarlet/LittleMaidReBirth-Architectury>を読んでみる。

モデルファイルは`/LMMLResources`フォルダに入れる必要があるのでどっかでハードコードしてると予想して検索、発見。まず`/LMMLResources`内のフォルダ/Zipを読み込んでいる。

<iframe frameborder="0" scrolling="no" style="width:100%; height:205px;" allow="clipboard-write" src="https://emgithub.com/iframe.html?target=https%3A%2F%2Fgithub.com%2FSistrScarlet%2FLittleMaidModelLoader-Architectury%2Fblob%2Fd29aa506b8f9c4529ecaff9f669864e796ef80c1%2Fcommon%2Fsrc%2Fmain%2Fjava%2Fnet%2Fsistr%2Flittlemaidmodelloader%2FLMMLMod.java%23L80-L85&style=github-dark&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&maxHeight=500"></iframe>

`LMMultiModelLoader`と`MultiModelClassLoader`でマルチモデルを読み込んでいそう。

<iframe frameborder="0" scrolling="no" style="width:100%; height:352px;" allow="clipboard-write" src="https://emgithub.com/iframe.html?target=https%3A%2F%2Fgithub.com%2FSistrScarlet%2FLittleMaidModelLoader-Architectury%2Fblob%2F1.20%2Fcommon%2Fsrc%2Fmain%2Fjava%2Fnet%2Fsistr%2Flittlemaidmodelloader%2Fresource%2Floader%2FLMMultiModelLoader.java%23L10-L22&style=github-dark&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&maxHeight=500"></iframe>

`canLoad`なモデルを読み込んでいるらしい。どうやら`.class`ファイルを直接読み込んでいるようだ。クラスを動的読み込みしてるってこと？？java(マイクラのModに特有?)ってこういうこと日常茶飯事なの...?Webエンジニアで良かった......

<iframe frameborder="0" scrolling="no" style="width:100%; height:557px;" allow="clipboard-write" src="https://emgithub.com/iframe.html?target=https%3A%2F%2Fgithub.com%2FSistrScarlet%2FLittleMaidModelLoader-Architectury%2Fblob%2Fd29aa506b8f9c4529ecaff9f669864e796ef80c1%2Fcommon%2Fsrc%2Fmain%2Fjava%2Fnet%2Fsistr%2Flittlemaidmodelloader%2Fresource%2Fclassloader%2FMultiModelClassLoader.java&style=github-dark&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&maxHeight=500"></iframe>

`byte[] transBytes = transformer.transform(bytes);`←これなに、やばいことしてそう。`バイナリを解析して古いクラスを置き換える。`とか言ってる。

<iframe frameborder="0" scrolling="no" style="width:100%; height:557px;" allow="clipboard-write" src="https://emgithub.com/iframe.html?target=https%3A%2F%2Fgithub.com%2FSistrScarlet%2FLittleMaidModelLoader-Architectury%2Fblob%2F1.20%2Fcommon%2Fsrc%2Fmain%2Fjava%2Fnet%2Fsistr%2Flittlemaidmodelloader%2Fresource%2Fclassloader%2FMultiModelClassTransformer.java&style=github-dark&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&maxHeight=500"></iframe>

後方互換性のための処理らしい。シストラーさんに足向けて寝れん。とにかくここでは古いクラスを新しいクラス(`net.sistr.littlemaidmodelloader.maidmodel.*`)に置き換えているっぽい。

最後に、読み込んだクラスが`ModelMultiBase`を継承しているかチェックしていそう。

<iframe frameborder="0" scrolling="no" style="width:100%; height:557px;" allow="clipboard-write" src="https://emgithub.com/iframe.html?target=https%3A%2F%2Fgithub.com%2FSistrScarlet%2FLittleMaidModelLoader-Architectury%2Fblob%2Fd29aa506b8f9c4529ecaff9f669864e796ef80c1%2Fcommon%2Fsrc%2Fmain%2Fjava%2Fnet%2Fsistr%2Flittlemaidmodelloader%2Fresource%2Floader%2FLMMultiModelLoader.java%23L24-L52&style=github-dark&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&maxHeight=500"></iframe>

`マルチモデル用の基本クラス、これを継承していればマルチモデルとして使用できる`とのこと。

<iframe frameborder="0" scrolling="no" style="width:100%; height:557px;" allow="clipboard-write" src="https://emgithub.com/iframe.html?target=https%3A%2F%2Fgithub.com%2FSistrScarlet%2FLittleMaidModelLoader-Architectury%2Fblob%2Fd29aa506b8f9c4529ecaff9f669864e796ef80c1%2Fcommon%2Fsrc%2Fmain%2Fjava%2Fnet%2Fsistr%2Flittlemaidmodelloader%2Fmaidmodel%2FModelMultiBase.java&style=github-dark&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&maxHeight=500"></iframe>

`extends ModelMultiBase`で検索すると、デフォルトでLMMLに同梱されているモデルのコード例が見つかる。これじゃん。最初からこれ見れば終わりだったじゃん。

<iframe frameborder="0" scrolling="no" style="width:100%; height:557px;" allow="clipboard-write" src="https://emgithub.com/iframe.html?target=https%3A%2F%2Fgithub.com%2FSistrScarlet%2FLittleMaidModelLoader-Architectury%2Fblob%2Fd29aa506b8f9c4529ecaff9f669864e796ef80c1%2Fcommon%2Fsrc%2Fmain%2Fjava%2Fnet%2Fsistr%2Flittlemaidmodelloader%2Fmaidmodel%2FModelLittleMaid_Beverly7.java&style=github-dark&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&maxHeight=500"></iframe>

つまり、実際にマルチモデルを作成するにはおそらく以下が必要：

1. `ModelMultiBase`を継承したクラスを作成する。
   - この時`net.sistr.littlemaidmodelloader.maidmodel`パッケージを使う。
   - 他モデルのコードは <https://github.com/SistrScarlet/LittleMaidModelLoader-Architectury/tree/1.20/common/src/main/java/net/sistr/littlemaidmodelloader/maidmodel> にある。
     - `ModelLittleMaidBase`クラスを使った実装はLMM用に最適化されているモノっぽいので、基本的には`ModelMultiBase`を使う。`ModelMultiMMMBase`を使うのも様子見。
   - 各メソッドの実行タイミングなどは`ModelMultiBase`の実装を見る。
   - クラス名は`ModelLittleMaid_XXXX`または`ModelMulti_XXX`にする。
   - `addBox`とか`addChild`は面倒なので多分[Blockbench](https://blockbench.net/)で書き出したコードを編集する?
     - Blockbenchで"Modded Entity"フォーマットでファイルを作成すると`.java`でクラスを書きだせるっぽい。
2. そのクラスをコンパイルして`/LMMLResources`フォルダに入れる

## 実際にやってみる

to be continued...
