let idleSprite; // 儲存角色一的十格待機精靈圖
let walkSprite; // 儲存角色一的九格走路精靈圖
let magicSprite; // 儲存角色一的四格施法精靈圖
let effectSprite; // 儲存角色一的五格特效精靈圖
let characterX; // 儲存角色一在畫布上的水平中心位置
let facingDirection = 1; // 設定角色初始朝向右方
let isCasting = false; // 記錄角色是否正在播放施法動畫
let magicStartFrame = 0; // 記錄施法動畫開始時的畫格
let magicDirection = 1; // 記錄施法動畫開始時角色面向的方向
let effectActive = false; // 記錄畫面上是否存在移動中的特效
let effectX = 0; // 記錄特效在畫布上的水平中心位置
let effectY = 0; // 記錄特效發射時的固定垂直位置
let effectDirection = 1; // 記錄特效的移動方向
let effectStartFrame = 0; // 記錄特效動畫開始時的畫格
const idleFrameCount = 10; // 設定待機精靈圖的動畫格數
const idleSpriteWidth = 1395; // 設定待機精靈圖的總寬度
const idleSpriteHeight = 196; // 設定待機精靈圖的總高度
const walkFrameCount = 9; // 設定走路精靈圖的動畫格數
const walkSpriteWidth = 1246; // 設定走路精靈圖的總寬度
const walkSpriteHeight = 198; // 設定走路精靈圖的總高度
const magicFrameCount = 4; // 設定施法精靈圖的動畫格數
const magicSpriteWidth = 1039; // 設定施法精靈圖的總寬度
const magicSpriteHeight = 146; // 設定施法精靈圖的總高度
const effectFrameCount = 5; // 設定特效精靈圖的動畫格數
const effectSpriteWidth = 740; // 設定特效精靈圖的總寬度
const effectSpriteHeight = 19; // 設定特效精靈圖的總高度
const frameDuration = 6; // 設定每格動畫維持的畫格數
const movementSpeed = 420; // 設定角色每秒移動的畫布像素數
const effectSpeed = 700; // 設定特效每秒移動的畫布像素數

function preload() { // 在畫布建立前載入角色動畫圖片
  idleSprite = loadImage("角1/停/停.png"); // 載入包含十格角色待機動畫的精靈圖
  walkSprite = loadImage("角1/走路/走.png"); // 載入包含九格角色走路動畫的精靈圖
  magicSprite = loadImage("角1/magic/magic.png"); // 載入包含四格角色施法動畫的精靈圖
  effectSprite = loadImage("角1/特效/特效.png"); // 載入包含五格移動特效的精靈圖
} // 結束圖片載入函式

function setup() { // 初始化畫布與繪圖設定
  createCanvas(windowWidth, windowHeight); // 建立符合視窗大小的全螢幕畫布
  imageMode(CORNER); // 使用圖片左上角作為繪製座標
  characterX = width / 2; // 將角色初始位置設在畫布水平中央
  frameRate(60); // 設定動畫更新速率為每秒六十格
} // 結束初始化函式

function draw() { // 每個畫格更新背景與角色動畫
  background(135, 206, 235); // 以天空藍清除並填滿畫布背景
  const movingRight = keyIsDown(RIGHT_ARROW); // 偵測是否持續按住鍵盤右方向鍵
  const movingLeft = keyIsDown(LEFT_ARROW); // 偵測是否持續按住鍵盤左方向鍵
  const isMoving = !isCasting && (movingRight || movingLeft); // 判斷施法以外是否正在按住方向鍵
  if (!isCasting && movingRight) { // 未施法且按住右方向鍵時執行向右移動
    characterX += movementSpeed * deltaTime / 1000; // 依經過時間向右更新角色位置
    facingDirection = 1; // 設定角色面向右方
  } else if (!isCasting && movingLeft) { // 未施法且按住左方向鍵時執行向左移動
    characterX -= movementSpeed * deltaTime / 1000; // 依經過時間向左更新角色位置
    facingDirection = -1; // 設定角色面向左方
  } // 結束方向鍵移動判斷
  let effectJustStarted = false; // 記錄特效是否在目前畫格剛開始
  if (isCasting && frameCount - magicStartFrame >= magicFrameCount * frameDuration) { // 判斷施法動畫是否已完整播放一次
    isCasting = false; // 結束施法狀態並切回一般角色動畫
    effectActive = true; // 啟動施法完成後產生的特效
    effectDirection = magicDirection; // 讓特效沿施法時角色面向的方向移動
    effectStartFrame = frameCount; // 記錄特效動畫的起始畫格
    effectJustStarted = true; // 標記目前需要設定特效的初始位置
  } // 結束施法動畫完成判斷
  const activeSprite = isCasting ? magicSprite : isMoving ? walkSprite : idleSprite; // 依施法、移動或待機狀態選擇角色圖片
  const activeFrameCount = isCasting ? magicFrameCount : isMoving ? walkFrameCount : idleFrameCount; // 取得目前角色動畫的總格數
  const activeSpriteWidth = isCasting ? magicSpriteWidth : isMoving ? walkSpriteWidth : idleSpriteWidth; // 取得目前角色精靈圖的總寬度
  const activeSpriteHeight = isCasting ? magicSpriteHeight : isMoving ? walkSpriteHeight : idleSpriteHeight; // 取得目前角色精靈圖的總高度
  const frameWidth = activeSpriteWidth / activeFrameCount; // 計算目前精靈圖中每一格的寬度
  const frameIndex = isCasting ? floor((frameCount - magicStartFrame) / frameDuration) : floor(frameCount / frameDuration) % activeFrameCount; // 計算目前要顯示的角色動畫格
  const scaleByHeight = (height * 0.35) / activeSpriteHeight; // 依畫布高度設定角色高度為畫布的百分之三十五
  const scaleByWidth = (width * 0.8) / frameWidth; // 限制角色寬度不超過畫布寬度的百分之八十
  const characterScale = min(scaleByHeight, scaleByWidth); // 取較小縮放值以確保角色完整顯示
  const displayWidth = frameWidth * characterScale; // 計算縮放後單格角色的顯示寬度
  const displayHeight = activeSpriteHeight * characterScale; // 計算縮放後角色的顯示高度
  characterX = constrain(characterX, displayWidth / 2, width - displayWidth / 2); // 限制角色不超出畫布左右邊界
  const destinationX = characterX - displayWidth / 2; // 將角色位置轉換為繪製圖片的左側座標
  const destinationY = height - displayHeight; // 將縮放後角色的底部貼齊畫布底端
  const effectFrameWidth = effectSpriteWidth / effectFrameCount; // 計算特效精靈圖中每一格的寬度
  const effectDisplayWidth = effectFrameWidth * characterScale; // 計算縮放後特效單格的顯示寬度
  const effectDisplayHeight = effectSpriteHeight * characterScale; // 計算縮放後特效單格的顯示高度
  if (effectJustStarted) { // 特效剛啟動時將它放在角色面前
    effectX = characterX + effectDirection * (displayWidth / 2 + effectDisplayWidth / 2); // 將特效起點設在角色朝向一側
    effectY = destinationY + displayHeight * 0.45 - effectDisplayHeight / 2; // 記錄特效發射時的垂直位置
  } // 結束特效初始位置設定
  push(); // 暫存畫布的座標轉換狀態
  translate(characterX, destinationY); // 將座標原點移至角色水平中心與畫布底端
  scale(isCasting ? magicDirection : facingDirection, 1); // 依角色朝向決定是否水平翻轉角色圖片
  image(activeSprite, -displayWidth / 2, 0, displayWidth, displayHeight, frameIndex * frameWidth, 0, frameWidth, activeSpriteHeight); // 裁切並繪製目前動畫格
  pop(); // 還原畫布的座標轉換狀態
  if (effectActive) { // 特效存在時更新並繪製移動動畫
    effectX += effectDirection * effectSpeed * deltaTime / 1000; // 依經過時間沿設定方向移動特效
    const effectFrameIndex = floor((frameCount - effectStartFrame) / frameDuration) % effectFrameCount; // 循環播放特效的五格動畫
    push(); // 暫存特效繪製前的畫布狀態
    translate(effectX, effectY); // 將座標原點移至特效中心
    scale(effectDirection, 1); // 依移動方向水平翻轉特效圖片
    image(effectSprite, -effectDisplayWidth / 2, 0, effectDisplayWidth, effectDisplayHeight, effectFrameIndex * effectFrameWidth, 0, effectFrameWidth, effectSpriteHeight); // 裁切並繪製目前的特效動畫格
    pop(); // 還原特效繪製前的畫布狀態
    const effectExitedCanvas = effectDirection > 0 ? effectX - effectDisplayWidth / 2 > width : effectX + effectDisplayWidth / 2 < 0; // 判斷特效是否已完全離開畫布
    if (effectExitedCanvas) { // 特效完全離開畫布時將它移除
      effectActive = false; // 停止繪製目前的特效
    } // 結束特效離開畫布判斷
  } // 結束特效更新與繪製
} // 結束每畫格繪製函式

function keyPressed() { // 處理方向鍵按下事件
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) { // 確認按下的是左右方向鍵
    return false; // 阻止方向鍵捲動瀏覽器頁面
  } // 結束方向鍵判斷
  if (keyCode === 32) { // 確認按下的是鍵盤空白鍵
    if (!isCasting && !effectActive) { // 只有施法與特效都結束時才開始新的施法
      isCasting = true; // 啟動施法動畫狀態
      magicStartFrame = frameCount; // 記錄本次施法動畫的起始畫格
      magicDirection = facingDirection; // 記錄施法當下角色面向的方向
    } // 結束新施法狀態判斷
    return false; // 阻止空白鍵捲動瀏覽器頁面
  } // 結束空白鍵處理
} // 結束鍵盤按下處理函式

function windowResized() { // 視窗尺寸改變時重新調整畫布
  resizeCanvas(windowWidth, windowHeight); // 讓畫布持續填滿整個視窗
} // 結束視窗縮放處理函式
