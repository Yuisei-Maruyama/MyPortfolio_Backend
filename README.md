# MyPortfolio_Backend

## パッケージ

- ts-node-dev : tsファイルをjsファイルにコンパイルすることなく、ファイルやフォルダの変更を監視
  - `--respawn` : 本来実行して即終了のプログラムも終了せず監視状態になる

- winston : ログ出力

- dotenv : `.env`を読み込み、process.env に設定

- openapi-types : OpenAPIの型情報

- deepmerge : 配列やオブジェクトの中にある要素のマージを簡単に行うことが可能

- terminal-link : ターミナルでリンクを作成することが可能

- prettier : ソースコードを整形してくれるツール

- eslint : 構文チェックツール

- eslint-config-prettier : ESLint のフォーマット関連のルールを全て無効にして、Prettier が整形した箇所に関してエラーを出さなくする
