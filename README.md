# CLInerd Launcher
------------------

ターミナルから

## Setup
### ビルドを実行

```bash
$ npm run build
```

### アプリケーションの実行
ビルド済みのJavaScriptファイルを実行する場合。

```bash
npm start -- -m greet
npm start -- --mode farewell
npm start
```

TypeScriptを直接実行する場合。

```bash
npm run dev -- -m greet
npm run dev -- --mode farewell
npm run dev
```
