# CLInerd Launcher
------------------

ターミナルから使えるシンプルなランチャーです。
読みは「クリナードランチャー」です。

- ターミナルから実行できる
- 選択項目はJSONで管理するのでシンプル
- 選択項目は階層を掘れる

これらを満たすことを目標にしました。

## 構成

- Node.js 22.x
- TypeScript
- Volta
- macOS

## セットアップ

```bash
$ npm install
```

### ビルド方法とセットアップ
pkgを導入しているので、下記コマンドを実行すればバイナリファイルが作成されます。

```bash
$ npm run package
```

出来上がった実行バイナリの`clinerd-launcher`ファイルをパスが通してあるところに放り込むなり、シンボリックリンクを張るなりしてください。

初回起動時に実行したユーザーのホームディレクトリに、メニュー定義ファイル`~/.clinerd-launcher/menu.json`が作られます。
階層（カテゴリ）や項目の設定の仕方はそちらを見ればなんとなくわかると思います。

