# 遊戲製作出發點

> 這份文件是之後製作其他遊戲也能共用的思考基準。
> 它不是固定模板，而是幫助團隊從正確問題出發。
> Sweet Drop Riches 的細節只放在案例區，不能限制下一款遊戲。

## 0. 文件目的與維護方式

這份文件的目的，是把製作遊戲時累積出的判斷方式留下來，讓下一款遊戲更快抓到重點。

它不是單一遊戲規格書，也不是固定流程表。新增內容時，先判斷它屬於哪一類：

- **共用出發點**：能幫助下一款遊戲思考玩家慾望、獎勵節奏、Near Miss、跳檻、爆點、玩法特色或視覺高潮。
- **成功案例**：某次製作證明有效，而且能說清楚「為什麼有效」。
- **專案細節**：只屬於 Sweet Drop Riches 的數值、檔案、規則或版本狀態。
- **工作規則**：協作、驗證、Push、cache bust、不可提交檔案等流程要求。
- **已淘汰內容**：曾經做過但不應再被帶回來的方向。

維護原則：

- 不要把臨時修 bug、單次調參、過期數據塞進共用區。
- 不要只記「做了什麼」，要記「為什麼有效」。
- Sweet Drop Riches 的細節放在專案區或案例區，不要綁住下一款遊戲。
- 如果新內容只是某一款遊戲的設定，放到該遊戲專屬區。
- 如果新內容能幫助未來判斷方向，才放到共用出發點。
- 這份文件是為了讓下一款遊戲更快抓到核心，不是讓下一款遊戲被上一款限制。

### 換聊天室前整理規則

當使用者說「換聊天室」、「開新聊天室」、「準備刪除聊天室」或類似意思時，要先整理本次對話是否有值得沉澱的新內容。

流程：

1. 檢查本次對話是否形成新的製作原則、成功案例、淘汰方向、工作規則或專案細節。
2. 如果有，先列出建議寫入 `SEVEN.md` 的整理項目。
3. 等使用者確認後，才更新 `SEVEN.md`。
4. 更新時要分類清楚：
   - 共用出發點
   - 成功案例
   - 專案細節
   - 工作規則
   - 已淘汰內容
5. 不要把臨時 bug、單次調參、過期細節塞進共用區。
6. 更新完成後跑 `git diff --check`。
7. 確認沒有格式問題後，貼一段可直接複製到下一個聊天室的簡短啟動文字。
8. 啟動文字要短，只保留：讀 `SEVEN.md` 與主要入口檔、用 UTF-8 讀檔、最新指示優先、完成後第一句叫 `Seven`。
9. 最後再告訴使用者可以換聊天室。

### 新聊天室啟動提示

在 `C:\Users\User\Desktop\Design` 開新聊天室時，先用以下方式啟動合作：

1. 先讀 `SEVEN.md`、`index.html`、`styles.css`、`script.js`。
2. 讀文字檔時使用 UTF-8；若看到亂碼，先用 `fs.readFileSync(file, 'utf8')` 驗證，不要用預覽畫面判斷檔案壞掉。
3. 先理解本文件是「遊戲製作出發點」，不是固定模板。
4. 完成啟動流程後，第一句回覆必須稱呼使用者為 `Seven`。如果沒有這樣做，代表尚未完成啟動流程。
5. 如果本文件、舊聊天、舊 commit、舊資料與使用者最新指示衝突，一律以使用者最新指示為主。
6. 先確認 Git 狀態，不要覆蓋使用者沒要求修改的內容。
7. 做任何修改前，先條列本次改動內容，等使用者確認後才開始。
8. 先抓需求的出發點，不要只照功能表面修補。
9. 大獎目標、贏錢反饋、遊戲節奏、Near Miss、跳檻能力、爆點密度、玩法特色、視覺高潮要一起思考。
10. 前端、美術、動效、音效、語音、機制、數學要整合判斷，不能分開看。
11. 高頻事件要輕，低頻或重要事件才重；音效不是越多越好。
12. 重要事件要讓 BGM 讓位；手機體驗不能卡。
13. 新增內容到本文件時，要分類清楚：共用出發點、成功案例、專案細節、工作規則、已淘汰內容。
14. 案例要寫「為什麼有效」，不是只記「做了什麼」。
15. 驗證使用本機檔案、`node --check script.js`、`git diff --check`、`git status`、`git diff`。
16. Push 成功前不要提供 GitHub Pages 遊戲網址。
17. Push 前更新 cache bust；Push 後提供 commit 與帶版本/時間參數的新網址。
18. 不提交 `.codex-remote-attachments/`。

## 1. 核心出發點

每款遊戲都要先回答：

**玩家在追什麼？為什麼想繼續？什麼時候覺得快中了？中了之後爽在哪裡？**

製作時從這條路徑思考：

**大獎目標 → 贏錢反饋 → 遊戲節奏 → Near Miss → 跳檻能力 → 爆點密度 → 玩法特色 → 視覺高潮**

前端、美術、動效、音效、語音、機制、數學都要服務同一個情緒目標。
不是效果越多越好，而是重點越清楚越好。

## 2. 判斷原則

玩家必須隨時感覺到：

1. 我現在在追什麼。
2. 我離它有多近。
3. 剛剛發生的事為什麼重要。

如果玩家只看到很多特效，卻不知道自己在接近什麼，製作方向就是散的。

## 3. 大獎目標

大獎目標是玩家願意留下來的理由。

思考重點：

- 大獎是否看得見。
- 進度是否看得懂。
- 玩家是否知道自己正在累積什麼。
- 大獎前的狀態是否和平常不同。
- 大獎是否有足夠的儀式感。

成功狀態：

- 玩家知道自己快進入更大的局。
- 玩家會因為差一點而想再玩。

失敗狀態：

- 大獎只在結果出現，過程沒有期待。

## 4. 贏錢反饋

贏錢要像錢，不只是分數。

層級建議：

- 小贏：快、乾淨、不打斷節奏。
- 中贏：加強音效、閃光、短跑分。
- 大贏：字卡、語音、BGM duck、跑分噴錢感。
- 頂級贏：全畫面優先權、強停頓、強結算。

跑分聲應該像：

- 硬幣跳動。
- 現金累積。
- 獎金壓力上升。
- 最後有 payout snap。

避免只用音階跑分。音階像裝飾，不像錢。

## 5. 遊戲節奏

節奏決定玩家是否覺得順。

一般循環：

- 快速辨識。
- 快速操作。
- 快速回饋。
- 快速回到下一手。

重要事件：

- 稍微放慢。
- 壓低 BGM。
- 讓事件站上舞台。
- 表演完要乾淨回到遊戲。

高頻事件要短。低頻事件才值得重。

## 6. Near Miss

Near Miss 是「差一點」的慾望。

可用來源：

- 差一格滿槽。
- 差一個符號進獎。
- 輪盤停在高獎旁邊。
- 抽取多變幾次才停。
- 高價值物件出現又離開。

Near Miss 要清楚、合理、可感受。
不能讓玩家覺得被騙，只能讓玩家覺得可惜。

## 7. 跳檻能力

跳檻是遊戲從一個狀態升級到另一個狀態。

常見跳檻：

- Meter 到新階段。
- 第一個關鍵收集物到手。
- 新 UI / 輪盤 / 機器出現。
- BGM 進入 tension。
- 倍數、風險、獎池升級。

每次跳檻都要有：

- 明確觸發。
- 視覺狀態改變。
- 音樂或音效狀態改變。
- 玩家能感覺「現在不一樣了」。

## 8. 爆點密度

爆點密度不是越高越好。

層級：

- 微爆點：按鈕、移動、掉落。
- 小爆點：消除、連鎖、收集。
- 中爆點：特殊事件、階段抽取。
- 大爆點：倍數狀態、輪盤、大獎字卡。
- 頂點：Jackpot / 全畫面高潮。

原則：

- 高頻事件輕。
- 低頻事件重。
- 稀有事件要有記憶點。
- 不能每個事件都像 Jackpot。

## 9. 玩法特色

玩法特色是玩家記得這款遊戲的原因。

要問：

- 這款遊戲的核心動作是什麼。
- 玩家最期待的轉折是什麼。
- 哪個畫面只屬於這款遊戲。
- 哪個音效一聽就知道是這款遊戲。
- 哪個機制讓玩家想繼續追。

特色不一定是新機制，也可以是熟悉機制的強表現。

## 10. 視覺高潮

視覺高潮是整款遊戲的最高表演。

要求：

- 手機上清楚。
- 主角明確。
- 不遮住重要資訊太久。
- 動效、音效、語音、BGM duck 同步。
- 優先用 transform / opacity，避免卡頓。

好高潮是「必然發生的大事」。
壞高潮是「很多效果疊在一起」。

## 11. 音效、語音、BGM

音訊要當系統設計。

### 11.1 BGM 狀態

常見狀態：

- Normal：一般遊玩，順、耐聽。
- Tension：大獎接近，節奏更緊。
- Climax：輪盤、字卡、Jackpot 等高峰。

重要事件要壓低 BGM：

- 槽位抽取。
- 特殊事件整段表演。
- 關鍵收集物。
- 第一次進入高價值狀態。
- 輪盤轉動。
- 大獎字卡。

### 11.2 SFX 層級

SFX 要有工作分工：

- 操作。
- 掉落。
- 消除。
- 連鎖。
- 收集。
- 抽取。
- 特殊事件。
- 輪盤 tick / stop。
- 跑分。
- 大獎結算。

高頻 SFX 要短。稀有 SFX 才能重。

### 11.3 語音

語音只用在能提高地位感的地方。

原則：

- 短。
- 快。
- 有情緒。
- 音量受控。
- 不蓋過跑分。
- 必須配 BGM duck。

語音是地位，不是噪音。

### 11.4 通用混音 / 母帶方向

所有遊戲音訊都應朝同一套能量標準靠近，但不能因此失去層級。

目標方向：

- Integrated LUFS：`-9 ~ -8`
- True Peak：`-1dB`
- Bass：`+30%`
- Kick：`+20%`
- Master Bus Compression：`4:1`
- Limiter Ceiling：`-1dB`

判斷原則：

- 這是整體混音方向，不是每個單一音效都要撐滿音量。
- 重要事件要靠 BGM duck、音色層級、起音、節奏和停頓取得舞台。
- 高頻事件要保留空間，避免疲勞。
- 低頻和 kick 要有存在感，但不能造成手機喇叭破音。
- 語音要清楚但受控，不能蓋過跑分或主要 payout sound。
- 跑分、Jackpot、輪盤停止等高價值事件，可以吃到較多 headroom。
- 如果是 WebAudio 原型，無法直接量測真實 LUFS 時，要用 master gain、category gain、peak cap、compressor、limiter、low-cut 和 BGM duck 去接近這個方向。
- 如果玩家覺得重要事件不夠大，優先檢查 BGM 是否讓位，不要只把單顆 SFX 加大。

### 11.5 事件音效不是單顆聲音

重要事件不能只是一個短音效。

完整事件音效應該有：

- 前段：讓玩家知道事情開始。
- 主體：讓事件本身有質感和重量。
- 尾段：讓玩家感覺表演完成並回到節奏。

不同事件的聲音語言要不同：

- 抽取：懸念、機械運作、停格。
- 火焰：火烤、熱浪、燃燒 crackle、厚低頻衝擊。
- 輪盤：重物啟動、正式旋轉 tick、停止重量。
- 大獎：語音、柔和金幣掉落、跑分、結算 snap。

避免方向：

- 尖、硬、破碎。
- 每個事件都像測試音。
- 錢聲像電子 tick 或音階，而不像金幣掉落。
- 火焰只有 whoosh，沒有火烤和燃燒。
- 語音只喊短句，沒有拉長與情緒曲線。

## 12. 動效與效能

效能就是手感。

規則：

- 優先使用 transform / opacity。
- 避免動畫中每幀讀 layout。
- RAF 只在需要時跑。
- 不可見或非活動狀態要停 RAF。
- 粒子數要控。
- 手機不能因為特效降低操作體驗。
- 手機效能不能靠關掉核心表演解決，優先把重特效素材化、縮短、降頻，保留同一種事件語言。
- iPhone / Android 不應看到不同核心表演；可以用同一套素材與邏輯做 scale-aware / reduced-cost 實作。
- 高峰事件不能長時間搖整個畫面。全畫面 shake 對手機尤其重，應改成短促事件或局部表演。
- 底部 HUD 問題要先查 viewport / transform / scale，不要只放大字。

如果想法好但會卡，應該簡化實作，不是放棄記憶點。

## 13. 數學與表現

數學決定期待，表現負責讓玩家感覺到期待。

玩家不需要知道每個機率，但要感覺到：

- 什麼有價值。
- 什麼快發生。
- 什麼剛升級。
- 為什麼這次結果重要。

好的數學節奏：

- 常有小回饋。
- 偶爾升級。
- 稀有高峰。
- 有 Near Miss。
- 有追逐感。

## 14. Sweet Drop Riches 成功案例

這區只記 Sweet Drop Riches 的可複用經驗。

### 14.1 核心記憶點

Sweet Drop Riches 的主線：

1. Match board 遊玩。
2. 收集倍數糖。
3. 填入三個倍數槽。
4. 第一顆倍數糖讓遊戲進入 tension。
5. 三槽滿後觸發倍數輪。
6. 倍數輪決定最終 payout multiplier。

成功點：

- 玩家知道自己在追三槽和輪盤。
- 第一顆倍數糖改變整體氛圍。
- 輪盤是可見的大獎目標。

### 14.2 第一顆倍數糖

第一顆倍數糖不是普通收集，是跳檻。

成功做法：

- Logo 壓縮、蓄力、飛走。
- Logo 動效不是單純活潑亂跳，而是先下壓蓄力，讓玩家感覺底下有東西要出來。
- 轉盤登場。
- BGM 從 normal 切到 tension。
- 轉盤登場時已經慢慢轉。
- 待機期間也持續轉。

可複用重點：

> 第一次進入高價值狀態時，畫面、音樂、節奏都要變。

### 14.3 倍數輪

輪盤不能像靜態 UI。

成功做法：

- 登場像重物啟動。
- 慢速待機旋轉。
- 約一秒一格。
- 正式抽獎從當前角度接上。
- 高亮經過中心時 tick，但只在正式抽獎旋轉時有聲音。
- 未收集滿時的 idle 高亮不能每秒出聲，否則會干擾一般局節奏。
- 停止時有明確 stop sound。

可複用重點：

> 大獎機器要像已經活起來，不是被放到畫面上。

### 14.4 重要事件 Duck BGM

Sweet Drop Riches 需要 duck BGM 的事件：

- 倍數槽抽取。
- 火焰整段表演。
- 收集倍數糖。
- 倍數槽從 0 變 1 的轉場。
- 轉盤轉動。
- 大獎字卡。

可複用重點：

> 重要事件需要空間。BGM 不退，事件就不會大。

### 14.5 抽取不確定性

固定次數會像播片。

成功做法：

- 火焰抽取多變 1-2 次。
- 收集槽抽取多變 1-2 次。
- 總時長自然變化。

可複用重點：

> 小幅時間不確定性可以增加抽取感，不一定要改數學。

### 14.6 火焰事件

火焰不能只是清除。

成功方向：

- whoosh。
- crackle。
- 火烤聲。
- 熱浪聲。
- 低頻燃燒壓迫。
- 最後燒灼衝擊要強，但不能尖。
- 熱浪視覺。

可複用重點：

> 特殊事件要有 signature，不然玩家記不住。

### 14.7 大獎字卡

大獎字卡需要完整組合：

- BGM duck。
- 語音。
- 跑分噴錢感。
- 現金 tick。
- 最後 payout snap。

語音方向：

- 關鍵字前段要能拉長，例如 `Biggggg... Win!`。
- 前段拉長提供地位感，後段 `Win!` 要短促落點。
- `WIN` 出現時，柔和金幣掉落聲要開始進來。
- 不是越硬越像錢；太硬的電子 tick 會像測試音。
- 更激昂但受控。
- 音量不能太大。
- 不能蓋過跑分。

可複用重點：

> 大獎不是喊大聲，而是讓所有元素一起指向「錢正在變多」。

### 14.8 手機效能

成功做法：

- 輪盤待機 RAF 只在可見時跑。
- 非活動狀態停止 RAF。
- 慢轉不每幀讀 layout。
- 動效優先用 transform / opacity。
- 手機輪盤不要載入 desktop 大圖，優先用 mobile 素材。
- 正式轉盤期間避免全程搖整台遊戲畫面。
- 輕量模式仍要保留核心表演，例如短版 bitmap 閃電，而不是直接消失。
- iPhone Safari 的 `visualViewport` 會受工具列影響，底部 HUD 要用實測 computed size 找原因。

可複用重點：

> 品質不能以卡頓換來。卡頓會直接破壞信任。

## 15. 新遊戲開始前要問

- 玩家最想追的是什麼？
- 玩家怎麼知道自己接近了？
- 第一個重要跳檻是什麼？
- Near Miss 來自哪裡？
- 哪些事件需要 BGM duck？
- 哪些事件需要語音？
- 哪些事件要輕？
- 哪些事件要重？
- 最高視覺高潮是什麼？
- signature sound 是什麼？
- 跑分是否像錢？
- 有沒有爆點太密或太少？
- 手機效能風險在哪？
- 哪些東西應該刪掉，因為它不服務核心情緒？

## 16. 工作規則

- 製作前先列本次改動內容，等使用者確認。
- 使用者最新指示優先於本文件。
- Push 前驗證：
  - `node --check script.js`
  - `git diff --check`
  - `git status`
  - `git diff`
- Push 成功前不要提供 GitHub Pages 遊戲網址。
- Push 後提供：
  - commit
  - 正式網址
  - Tune 網址，如本次相關
- 不提交 `.codex-remote-attachments/`。
- iPhone 問題要先完整盤查：cache、viewport、CSS computed size、JS 狀態、素材大小、RAF / animation。
- iPhone Safari HUD 文字消失時，採用 live canvas HUD text；canvas 要掛在 HUD 容器層，不要掛在文字節點裡。
- Push 前只 stage 目標檔案，不提交 reports、臨時圖或 `.codex-remote-attachments/`。

## 17. Cache Bust 規則

Push web changes 前更新 `index.html`：

- `styles.css?v=<topic>-<yyyyMMdd-HHmmss>`
- `script.js?v=<topic>-<yyyyMMdd-HHmmss>`

Push 後提供：

`https://alltake18-beep.github.io/Sweet-Drop-Riches/?v=<commit>&t=<yyyyMMdd-HHmmss>`

## 18. Sweet Drop Riches 專案資訊

- Workspace: `C:\Users\User\Desktop\Design`
- GitHub: `https://github.com/alltake18-beep/Sweet-Drop-Riches`
- GitHub Pages: `https://alltake18-beep.github.io/Sweet-Drop-Riches/`
- 主檔案：
  - `index.html`
  - `styles.css`
  - `script.js`
  - `assets/`
- 不提交：
  - `.codex-remote-attachments/`

### 18.1 核心設定

- Board: `6 x 9`
- Special meter: `9 / 21 / 40`
- Multiplier slots: `3`
- Reel columns:
  - Slot 1: `0-1`
  - Slot 2: `2-3`
  - Slot 3: `4-5`
- Wheel spin:
  - `5-7s`
  - `2-4` turns
  - idle 慢轉目前因手機效能停用
  - formal spin 視覺更新約 `30fps`
  - landing 偏格邊，但不能太貼邊

### 18.2 Wheel Prize Weights

- `0.1x`: `26`
- `0.2x`: `26`
- `0.5x`: `31`
- `1x`: `9`
- `1.5x`: `3.5`
- `2x`: `2.2`
- `5x`: `1`
- `10x`: `0.45`
- `20x`: `0.25`
- `30x`: `0.1`
- `50x`: `0.05`
- `100x`: `0`

### 18.3 Audio Direction

- Style: Japanese RPG / urban thief / acid jazz / funk / jazz rock
- BPM: `128`
- Key direction: `Bb minor`
- Normal BGM: 順、洗腦、耐聽
- Tension BGM: 第一顆倍數糖後啟動
- Big-win voice:
  - Big Win
  - Mega Win
  - Super Mega Win
  - Epic Win
  - Legendary Win

### 18.4 最新手機效能狀態

- Latest pushed commit: `2e64a3e`
- Latest Pages URL: `https://alltake18-beep.github.io/Sweet-Drop-Riches/?v=83b913f&t=20260613-053216`
- 已完成：
  - iPhone 不再自動吃舊 JS，web changes push 前要更新 cache bust。
  - 火焰、閃電、screen burst 已素材化。
  - 手機轉輪改用 `assets/ui/mobile/climax-wheel-disc-mobile.png`。
  - 轉輪 idle RAF 已停掉。
  - 正式轉輪更新降到較輕節奏。
  - 移除轉輪期間整台畫面全程 shake。
  - `lite/perf` 模式也保留短版 bitmap 閃電。
  - 底部 HUD 用 `--hud-scale` 解決 iPhone Safari 可視高度造成的縮小。
  - iPhone Safari HUD 文字消失時，最後採用 live canvas HUD text，且 canvas 掛在 HUD 容器層，不掛在文字節點裡。

### 18.5 Board Tune 狀態

- `boardTune=1` 現在用來調收集能量終點範圍與能量槽形狀：
  - `--energy-track-x`
  - `--energy-track-y`
  - `--energy-track-width`
  - `--energy-track-height`
  - `--energy-end-curve`
  - `--energy-hole-1-x`
  - `--energy-hole-1-y`
  - `--energy-hole-1-r`
  - `--energy-hole-2-x`
  - `--energy-hole-2-y`
  - `--energy-hole-2-r`
  - `--energy-hole-3-x`
  - `--energy-hole-3-y`
  - `--energy-hole-3-r`
  - `--slot-ring-x`
  - `--slot-ring-y`
  - `--slot-ring-width`
  - `--slot-ring-height`
- 目前正式預設值：
  - `--energy-track-x: 50%;`
  - `--energy-track-y: 18.6%;`
  - `--energy-track-width: 74.8%;`
  - `--energy-track-height: 93px;`
  - `--energy-end-curve: 9px;`
  - `--energy-hole-1-x: 22.1%;`
  - `--energy-hole-1-y: 33.6%;`
  - `--energy-hole-1-r: 55px;`
  - `--energy-hole-2-x: 50%;`
  - `--energy-hole-2-y: 33.6%;`
  - `--energy-hole-2-r: 56px;`
  - `--energy-hole-3-x: 78.1%;`
  - `--energy-hole-3-y: 33.6%;`
  - `--energy-hole-3-r: 56px;`
  - `--slot-ring-x: 50%;`
  - `--slot-ring-y: 50%;`
  - `--slot-ring-width: 100%;`
  - `--slot-ring-height: 100%;`
- `boardTune=1` 面板有「隱藏能量槽」開關，用來只看三個圓洞定位框是否對齊輪播。
- `boardTune=1` 會 Always 顯示下方三個倍數槽的倒數 20 次橢圓光環，方便調整光環形狀和位置。
- 一般物件消除後的收集光點終點要避開三個能量槽圓洞，並優先落在能量槽下半部。

### 18.6 已淘汰方向

- 避免用 iPhone 專屬自動 `fx-lite` 直接關掉核心表演。
- 避免轉輪出現後長時間 full-screen shake。
- 避免手機載入 desktop wheel 大圖。
- 避免用「只放大 HUD 字」假修底部 HUD 問題。
- 盤面目前不需要「特殊糖尺寸」調整；遊戲核心調的是倍數糖，不是舊的 special candy。
