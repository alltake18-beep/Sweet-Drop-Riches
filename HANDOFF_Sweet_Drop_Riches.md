# Sweet Drop Riches 交接紀錄

最後更新：2026-06-04

## 專案位置

- 本機資料夾：`C:\Users\User\Desktop\Design\Sweet Drop Riches`
- GitHub Repo：`https://github.com/alltake18-beep/Sweet-Drop-Riches`
- GitHub Pages 預期網址：`https://alltake18-beep.github.io/Sweet-Drop-Riches/`
- 本機開發網址：`http://localhost:5177/`
- 目前前端版本參數：`symbol-rules-14`

## 目前檔案

- `index.html`
- `styles.css`
- `script.js`
- `symbol-catalog.html`
- `assets/symbols/`
- `tools/generate-symbols.mjs`
- `DEVELOPMENT_LOG.md`：舊紀錄檔目前有亂碼，不建議作為主要交接依據
- `HANDOFF_Sweet_Drop_Riches.md`：本交接紀錄

## Git 狀態

- 分支：`main`
- 遠端：`origin https://github.com/alltake18-beep/Sweet-Drop-Riches.git`
- 最近一次已成功推送 `main` 到 GitHub
- 若 Pages 打不開，需到 GitHub Repo 的 `Settings -> Pages` 設定：
  - Source：`Deploy from a branch`
  - Branch：`main`
  - Folder：`/root`

## 目前玩法方向

這是一款糖果消除結合 Slot 倍數收集的博弈遊戲原型。

核心流程：

1. 玩家下注。
2. 玩家拖曳或點擊相鄰糖果進行交換。
3. 只有形成有效消除才成立，無效交換不扣 Bet。
4. 一般糖果消除不直接算分。
5. 消除後播放消除特效。
6. 糖果落牌，不可突然生成，要有落下表演。
7. 補牌後繼續檢查連鎖。
8. 倍數糖落入下方收集槽後才結算獎金。
9. 本步總贏分與大獎字卡只在符合條件時跳出，平常不顯示。
10. 每消除任意 20 顆糖果，觸發上方特殊糖抽獎機制。

## 目前規則共識

### 一般糖果

一般 Symbol 共 6 種：

- Blue Candy
- Green Candy
- Orange Candy
- Purple Candy
- Red Candy
- Yellow Candy

要求：

- 美術風格參考 Candy Crush。
- 造型需要高度可辨識。
- 不要只有換色，要有不同輪廓與質感。
- 目前使用 PNG：`assets/symbols/candy-*.png`

### 倍數糖

倍數：

- X5
- X10
- X20
- X30
- X50
- X100
- X200

要求：

- 美術階層最高。
- 參考 PP 遊戲的倍數球／倍數徽章。
- 數字必須是美術字，不要像系統字。
- 倍數越高，造型層次越華麗，可稍微爆框。
- 倍數糖可以合併。
- 倍數糖落入下方槽位才結算。

### 特殊糖

特殊糖分為：

- 橫向糖
- 直向糖
- 巧顆粒糖
- 炸彈糖
- 魚糖

要求：

- 特殊糖階層高於一般糖，低於倍數糖。
- 出現在盤面時要有 Looping 動效。
- 背景可發光，凸顯特殊性。
- 美術需比一般 Symbol 搶眼。
- 魚糖要彩色。

#### 橫向糖

- 出現方式：直向一起消 4 顆。
- 做 6 色。
- 可以被同色配對消除。
- 消除效果：清除整列。
- 美術方向：參考一般物件加上橫向條紋，讓玩家容易理解。

#### 直向糖

- 出現方式：橫向一起消 4 顆。
- 做 6 色。
- 可以被同色配對消除。
- 消除效果：清除整欄。
- 美術方向：參考一般物件加上直向條紋，讓玩家容易理解。

#### 巧顆粒糖

- 出現方式：直向或橫向一起消 5 顆以上。
- 目前先做 1 顆通用。
- 移動到任意一般糖果時，清除當前盤面所有同色一般糖果。
- 不清除特殊糖。

#### 魚糖

- 出現方式：目前先由補牌或特殊糖抽獎機制產生。
- 目前先做 1 顆通用。
- 移動到任意一般糖果時，清除當前盤面所有同色一般糖果。
- 不清除特殊糖。
- 美術要彩色。

#### 炸彈糖

- 出現方式：消除 L 型或 T 型。
- 建議做 6 色。
- 可以被同色配對消除。
- 消除效果：清除周圍範圍，暫定 3x3。
- 後續可再討論是否支援與其他特殊糖交換觸發組合效果。

## 特殊糖抽獎機制

位置：

- 放在盤面上方原本 `7糖收集獎 ?/7` 那一行。

UI 方向：

- 有一條消除數量進度條。
- 進度條右邊放一個 1x1 小拉霸機。
- 小拉霸機造型要獨特。
- 平時慢速滾動展示可能出現的特殊糖。

規則：

- 消除任意 20 顆糖果後觸發。
- 小拉霸機表演抽出一個特殊糖。
- 特殊糖隨機飛到盤面上。
- 不可飛到倍數糖位置。
- 不可飛到已有特殊糖位置。

## 已實作狀態

- 7x7 盤面。
- 物件可拖曳／滑動／點擊相鄰交換。
- 有效交換才扣 Bet。
- 一般消除不算分。
- 消除後有基礎特效。
- 落牌已有表演，但仍需加強流暢度。
- 補牌已有表演，但仍需加強質感。
- 上方特殊糖收集進度已加入。
- 每 20 顆消除觸發特殊糖抽獎。
- 小拉霸機已有基礎滾動與抽獎。
- 特殊糖可以產生並放到盤面。
- 特殊糖圖片已建立。
- 倍數糖可落槽結算。
- 倍數糖可合併。

## 目前主要問題

### 1. 線上圖片讀取問題

使用者回報：上傳後打開遊戲，Symbol 圖不見，讀取不到。

優先檢查：

- GitHub Pages 是否已啟用。
- `assets/symbols/` 是否完整推到 GitHub。
- 線上網址是否大小寫完全一致。
- `script.js` 內圖片路徑是否為相對路徑。
- Pages 是否還在部署舊版本。
- 是否需要加版本參數清快取。

目前圖片路徑格式：

- `assets/symbols/candy-blue.png?v=symbol-rules-14`
- `assets/symbols/special-colorbomb.png?v=symbol-rules-14`
- `assets/symbols/multiplier-x5.svg?v=symbol-rules-14`

### 2. 美術仍不及格

使用者明確表示目前畫面不及格。

優先改善：

- 一般糖果辨識度。
- 倍數糖美術字。
- 特殊糖動效與發光。
- 盤面密度。
- 整體 UI 不要廉價感。

### 3. 發布流程需要固定化

建議流程：

1. 本機確認。
2. 檢查所有圖片存在。
3. 檢查圖片大小寫與路徑。
4. 檢查 `index.html`、`script.js`、`styles.css` 版本參數。
5. 推送 GitHub。
6. 等 Pages 部署。
7. 開 GitHub Pages 實際驗收。
8. 若有壞圖，直接看 Network/Console 404 路徑。

## 下一步建議

優先順序：

1. 先修 GitHub Pages 線上 Symbol 圖讀不到。
2. 建立一個發布前檢查清單或自動檢查工具。
3. 再優化盤面與 Symbol 美術。
4. 完成特殊糖所有規則與觸發表演。
5. 完成大獎字卡、音效、Win 動畫。
6. 最後才討論數學與 RTP。

## 下一個對話窗開場建議

可以直接貼這句：

「請讀取 `C:\Users\User\Desktop\Design\HANDOFF_Sweet_Drop_Riches.md`，接續 Sweet Drop Riches 專案。第一優先先修 GitHub Pages 上 Symbol 圖讀不到的問題，然後建立發布檢查流程。」

