[![npm version](https://badge.fury.io/js/%40gui-chat-plugin%2Ftictactoe.svg)](https://badge.fury.io/js/%40gui-chat-plugin%2Ftictactoe)
# GUIChatPluginTicTacToe

Tic-Tac-Toe game plugin for GUI Chat.

## Development

### 1. Plugin単体でデバッグ

```bash
yarn install
yarn run dev
```

ブラウザで http://localhost:5173/ を開く

### 2. MulmoChatでデバッグ

**初回セットアップ（MulmoChat側）:**

1. `MulmoChat/package.json` に依存関係を追加:
```json
"@gui-chat-plugin/tictactoe": "file:../GUIChatPluginTicTacToe",
```

2. `MulmoChat/src/main.ts` にCSS importを追加:
```typescript
import "@gui-chat-plugin/tictactoe/style.css";
```

3. `MulmoChat/src/tools/index.ts` にプラグインを登録:
```typescript
import TicTacToePlugin from "@gui-chat-plugin/tictactoe/vue";
// pluginList に TicTacToePlugin を追加
```

**デバッグ実行:**
```bash
# プラグインをビルドしてMulmoChatに反映
./refresh-in-mulmochat.sh

# MulmoChatを起動
cd ../MulmoChat
yarn run dev
```

### 3. チェックスクリプト

```bash
# プラグインファイル構成チェック
./check-plugin-structure.sh

# MulmoChat統合チェック（CSS, 依存関係, 登録）
./check-mulmochat-integration.sh
```

## Required Files (24 files)

```
【ルート設定ファイル (7)】
  .gitignore
  package.json
  tsconfig.json
  tsconfig.build.json
  vite.config.ts
  eslint.config.js
  index.html

【ソースエントリ (2)】
  src/index.ts
  src/style.css

【Coreモジュール (6)】
  src/core/index.ts
  src/core/types.ts
  src/core/definition.ts
  src/core/logic.ts
  src/core/plugin.ts
  src/core/samples.ts

【Vueモジュール (3)】
  src/vue/index.ts
  src/vue/View.vue
  src/vue/Preview.vue

【デモファイル (2)】
  demo/main.ts
  demo/App.vue
```

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | 開発サーバー起動 |
| `yarn build` | プロダクションビルド |
| `yarn typecheck` | TypeScriptチェック |
| `yarn lint` | ESLintチェック |
| `./check-plugin-structure.sh` | ファイル構成チェック |
| `./check-mulmochat-integration.sh` | MulmoChat統合チェック |
| `./refresh-in-mulmochat.sh` | MulmoChatに反映 |