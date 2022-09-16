# ibuki-Glitch
- Glitchで動作中のbot  
**伊吹ch**と**かずなみ36**の２人で開発中

# ファイル説明
- **main.js**  
botのメインコード

- **test.js**  
botのテスト用コード

- **in.js**  
GitHubとGlitchで別々のコードを書く。  
Glitchには`POST`を受信するコードを書いている。

- **data.json**  
様々な文や名前、値などを記録

- **package.json**  
`npm install`等でインストールしたパッケージのバージョンを記る(または記される

- **package-lock.json**  
node_moduleフォルダのパッケージ状態が記されているらしい  
`npm ci`で`node_modules`フォルダを構成することができる。

- **.gitignore**  
リポジトリに乗せる必要のないファイル等を記す  
`.env`や`node_modules`等

- **.env**  
DiscordのBotに使用するトークンを記す必要がある。  
例:`IBUKI_BOT_TOKEN=tokentoken`  
  - 変数`IBUKI_BOT_TOKEN`以外を使用する場合、`in.js`の表記と`main.js`または`test.js`の内容を変更する必要があります。  
  - `.gitignore`の影響でこのファイルはリポジトリ内に存在しません。各自作成してください。

- **node_modules**  
パッケージが保管されているフォルダ。  
  - `.gitignore`の影響でこのフォルダはリポジトリ内に存在しません。`npm ci`を使用するなりして各自作成してください。
  
# 注意
- リポジトリ変更時に注意してほしい事
  - 変更内容をしっかり記述すること。
  - 直接アップロードする場合、すべてのコードをコピペなどで上書きすること。
