# Sweet Drop Riches 開發紀錄

## 目前版本

- 遊戲入口：`http://localhost:5177/?v=symbol-rules-11`
- 目前資產版本：`symbol-rules-11`
- 主要方向：Match-3 盤面 + 倍數糖收集槽 + Slot 大獎字卡演出

## 已完成項目

### Symbol Catalog

- 已建立 `symbol-catalog.html`。
- 可集中檢查一般糖、特殊糖、倍數糖。
- 目前 catalog 共 33 張 symbol：
  - 一般糖 6 張。
  - 特殊糖 20 張。
  - 倍數糖 7 張。
- 已驗證 `symbol-rules-12` catalog 無破圖。

### 盤面與操作

- 7x7 盤面。
- 支援拖曳 / 滑動交換相鄰物件。
- 合法交換會扣 Bet 並進入消除流程。
- 非法交換會退回，不扣 Bet。
- 修正過 `point is not defined`，這個錯誤曾導致糖果無法消除。
- 加入無死局保護，盤面不應停在完全無可走步狀態。

### 消除與落牌

- 一般 Match-3 消除已接。
- 消除後會落牌補牌。
- 消除、連鎖、落牌目前已有基本動畫，但仍需加強演出品質。

### 一般 Symbol

- 六個一般糖已從 SVG 手刻改為透明 PNG。
- 目前檔案：
  - `assets/symbols/candy-blue.png`
  - `assets/symbols/candy-green.png`
  - `assets/symbols/candy-orange.png`
  - `assets/symbols/candy-purple.png`
  - `assets/symbols/candy-red.png`
  - `assets/symbols/candy-yellow.png`
- PNG 來源為生成圖切圖後去背。
- 綠糖因為原背景同為綠色，第一次去背失敗，後續改用洋紅背景單獨重生並替換。
- 目前盤面一般糖已確認載入 `.png?v=symbol-rules-11`。

### 倍數糖

- 倍數糖目前有 X5 / X10 / X20 / X30 / X50 / X100 / X200 對應圖檔。
- 倍數文字已改為 SVG path 美術字，不再使用 HTML 疊字或系統字。
- 盤面上的倍數糖可以進入下方收集槽。
- 相鄰同欄倍數糖可合併。

### 特殊糖

目前特殊糖規則：

- 直向一起消 4 個：生成橫向糖。
- 橫向一起消 4 個：生成直向糖。
- 直 / 橫一起消 5 個以上：生成巧顆粒糖。
- L 型或 T 型消除：生成炸彈糖。
- 魚糖：補牌時低機率出現。

目前特殊糖效果：

- 橫向糖：6 色，可被同色配對消除；觸發後清除整列。
- 直向糖：6 色，可被同色配對消除；觸發後清除整欄。
- 炸彈糖：6 色，可被同色配對消除；觸發後清除周圍 3x3。
- 魚糖：1 顆通用；移動到任意普通色糖後，清除當前盤面的同色普通糖，不清除特殊糖。
- 巧顆粒糖：1 顆通用；移動到任意普通色糖後，清除當前盤面的同色普通糖，不清除特殊糖。
- 特殊糖被其他特殊糖效果掃到時會觸發連鎖。

目前特殊糖 PNG 已完成：

- 橫向糖 6 色：
  - `assets/symbols/special-horizontal-blue.png`
  - `assets/symbols/special-horizontal-green.png`
  - `assets/symbols/special-horizontal-orange.png`
  - `assets/symbols/special-horizontal-purple.png`
  - `assets/symbols/special-horizontal-red.png`
  - `assets/symbols/special-horizontal-yellow.png`
- 直向糖 6 色：
  - `assets/symbols/special-vertical-blue.png`
  - `assets/symbols/special-vertical-green.png`
  - `assets/symbols/special-vertical-orange.png`
  - `assets/symbols/special-vertical-purple.png`
  - `assets/symbols/special-vertical-red.png`
  - `assets/symbols/special-vertical-yellow.png`
- 炸彈糖 6 色：
  - `assets/symbols/special-bomb-blue.png`
  - `assets/symbols/special-bomb-green.png`
  - `assets/symbols/special-bomb-orange.png`
  - `assets/symbols/special-bomb-purple.png`
  - `assets/symbols/special-bomb-red.png`
  - `assets/symbols/special-bomb-yellow.png`
- 通用特殊糖：
  - `assets/symbols/special-colorbomb.png`
  - `assets/symbols/special-fish.png`

### 大獎字卡

- 大獎字卡只在本步贏分達到指定倍數門檻時跳出。
- 平常不顯示下方本步總贏分大字卡。
- 已接基本贏分音效與彈出流程。

## 踩坑紀錄

### 1. 美術不要用工程 SVG 硬撐

一般 Symbol 是玩家最常看的東西，手刻 SVG 很容易變成「可用但不好看」。  
後續一般糖、特殊糖、倍數糖都應優先走 PNG / 原畫 / 生成圖 / 正式素材流程。

### 2. 換圖一定要處理快取

之前多次發生「檔案已換，但畫面看起來沒換」的情況。  
原因是瀏覽器快取仍吃舊圖。

目前做法：

- `index.html` 的 CSS / JS 帶版本號。
- `script.js` 內有 `SYMBOL_VERSION`。
- 所有 symbol 圖片 URL 都帶 `?v=${SYMBOL_VERSION}`。

之後每次換圖都要升版本。

### 3. 綠色素材不要用綠幕去背

綠糖搭配綠色 chroma-key 會被一起吃掉。  
之後如果素材本體是綠色，背景要改用洋紅色或其他不衝突顏色。

### 4. 功能和美術不要同時大改

之前同時改拖曳、消除、特殊糖、倍數球、美術，導致問題來源難拆。  
之後應分批：

1. Gameplay
2. Symbol
3. Animation
4. UI / HUD
5. Sound

### 5. 盤面測試不能只看畫面

需要同時驗證：

- 49 格都有圖。
- 沒有破圖。
- 合法交換會消除。
- 非法交換會退回。
- 消除後會落牌。
- Console 沒有 error。

## 建議後續開發流程

### Symbol Catalog

建議新增一頁 symbol catalog，專門展示：

- 六顆一般糖。
- 所有倍數糖。
- 五顆特殊糖。
- 大小比例。
- 透明邊緣。
- 深色 / 淺色背景下的辨識度。

Symbol 通過 catalog 驗收後，再接回盤面。

### 美術資產規格

建議統一：

- 原始尺寸：512x512 PNG。
- 背景：透明。
- 物件需置中。
- 四周保留安全邊距。
- 小尺寸 48px 仍需看得出輪廓。
- 不要在盤面上再用 CSS 疊文字表示倍率，倍率應在圖裡完成。

### Gameplay 驗收清單

每次改 gameplay 後至少測：

- 可拖曳。
- 可點選交換。
- 合法交換扣 Bet。
- 非法交換不扣 Bet。
- 消除可觸發。
- 特殊糖可生成。
- 特殊糖可觸發效果。
- 倍數糖可收集。
- 倍數糖可合併。
- 不產生死局。

### Animation 後續重點

需要加強：

- 消除爆破感。
- 落牌重力感。
- 倍數糖收集飛行演出。
- 倍數合併演出。
- 大獎字卡彈出節奏。
- 贏錢音效與數字跳動同步。

## 目前待辦

- 暫緩數學 / RTP 精算，先優化畫面與玩法規則。
- 先討論並定稿遊戲規則，再進入大規模畫面調整。
- 重整主畫面 layout，讓畫面更像一台可營運的博奕機。
- 明確定義每一步移動、扣 Bet、派彩、倍數糖收集的規則。
- 明確定義一般糖、倍數糖、特殊糖在玩法中的定位。
- 特殊糖 PNG 已完成第一版，後續需在盤面實測大小與辨識度。
- 倍數糖再提升成更接近正式 slot 美術的 PNG。
- 消除特效重做。
- 落牌動畫加強。
- 大獎字卡動畫與音效節奏加強。
- 補一套固定測試盤面，方便驗證特殊糖生成規則。
