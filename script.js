const items = [
    { name: "剣", type: "weapon", attackPower: 15, element: "⚔️" },
    { name: "弓", type: "weapon", attackPower: 10, element: "🏹" },
    { name: "回復ポーション", type: "potion", healAmount: 20, element: "🍷" },
    { name: "ツール", type: "tool", effect: "useTool", element: "🔧" },
    { name: "ハンマー", type: "tool", effect: "build", element: "🔨" },
    { name: "つるはし", type: "tool", effect: "mine", element: "⛏️" },
    { name: "月石の剣", type: "weapon", attackPower: 30, element: "🌕⚔️" },
    { name: "月石の盾", type: "armor", defensePower: 20, element: "🌕🛡️" }
];

const ores = [
    { name: "鉄鉱石", hardness: 5, element: "⛏️" },
    { name: "金鉱石", hardness: 7, element: "⛏️" },
    { name: "ダイヤ鉱石", hardness: 10, element: "⛏️" },
    { name: "銅鉱石", hardness: 3, element: "⛏️" },
    { name: "銀鉱石", hardness: 6, element: "⛏️" },
    { name: "月石鉱石", hardness: 12, element: "🌕⛏️" }
];

const blocks = [
    { name: "石", hardness: 2, element: "🧱" },
    { name: "木材", hardness: 1, element: "🪵" },
    { name: "土", hardness: 1, element: "🌿" },
    { name: "砂", hardness: 1, element: "🏖️" },
    { name: "コンクリート", hardness: 4, element: "🪨" },
    { name: "なんでもブロック", hardness: 1, element: "🎁" },
    { name: "障壁", hardness: 100, element: "🧱" }
];

const enemies = [
    { name: "ゴブリン", health: 30, speed: 2, element: "👹", poison: false },
    { name: "ゴースト", health: 25, speed: 1.5, element: "👻", poison: false },
    { name: "スライム", health: 15, speed: 1, element: "🪲", poison: true },
    { name: "毒蛇", health: 20, speed: 1.2, element: "🐍", poison: true },
    { name: "ドラゴン", health: 50, speed: 3, element: "🐉", poison: false }
];

const potions = [
    { name: "回復ポーション", healAmount: 20, element: "🍷" },
    { name: "マナポーション", manaAmount: 10, element: "🍻" },
    { name: "力のポーション", strengthAmount: 5, element: "💪" },
    { name: "スピードポーション", speedAmount: 5, element: "🚀" },
    { name: "毒消し", poisonAmount: -10, element: "💊" }
];

const accessories = [
    { name: "リング", effect: "attackBoost", value: 5, element: "💍" },
    { name: "帽子", effect: "defenseBoost", value: 3, element: "🧢" },
    { name: "マント", effect: "speedBoost", value: 5, element: "🧥" }
];

const effects = [
    { name: "輝き", type: "buff", element: "✨" },
    { name: "竜巻", type: "debuff", element: "🌪️" },
    { name: "煙", type: "debuff", element: "🌫️" }
];

// プレイヤーの状態
let player = {
    hp: 100,
    attackPower: 10,
    defense: 5,
    speed: 2,
    x: 50,
    y: 50,
    invincible: false,
    inventory: [],
    invincibleTimer: null,
    attackSpeed: 1000, // 攻撃速度（ミリ秒）
    lastAttackTime: 0
};

// クラフトレシピの定義
const craftingRecipes = [
    { 
        name: "鉄の剣", 
        ingredients: [{ name: "鉄鉱石", quantity: 2 }, { name: "木材", quantity: 1 }], 
        result: { name: "鉄の剣", type: "weapon", attackPower: 20, element: "⚔️" } 
    },
    { 
        name: "金の弓", 
        ingredients: [{ name: "金鉱石", quantity: 2 }, { name: "木材", quantity: 1 }], 
        result: { name: "金の弓", type: "weapon", attackPower: 15, element: "🏹" } 
    },
    { 
        name: "月石の剣", 
        ingredients: [{ name: "月石鉱石", quantity: 2 }, { name: "木材", quantity: 1 }], 
        result: { name: "月石の剣", type: "weapon", attackPower: 30, element: "🌕⚔️" } 
    }
];

// 世界を生成する関数
function generateWorld() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = ''; // 既存のコンテンツをクリア

    // 地形を生成する関数
    function generateTerrain() {
        for (let x = 0; x < worldWidth; x += 50) {
            for (let y = 0; y < worldHeight; y += 50) {
                const block = document.createElement('div');
                block.className = 'block';
                block.style.width = '50px';
                block.style.height = '50px';
                block.style.position = 'absolute';
                block.style.left = `${x}px`;
                block.style.bottom = `${y}px`;

                const randomBlock = blocks[Math.floor(Math.random() * blocks.length)];
                block.textContent = randomBlock.element;
                block.dataset.name = randomBlock.name;
                block.dataset.hardness = randomBlock.hardness;
                gameContainer.appendChild(block);
            }
        }
    }

    // アイテムを生成する関数
    function generateItems() {
        for (let i = 0; i < 10; i++) {
            const item = document.createElement('div');
            item.className = 'item';
            item.dataset.name = items[Math.floor(Math.random() * items.length)].name;
            item.style.width = '30px';
            item.style.height = '30px';
            item.style.position = 'absolute';
            item.style.left = `${Math.random() * (worldWidth - 30)}px`;
            item.style.bottom = `${Math.random() * (worldHeight - 30)}px`;
            item.textContent = items.find(i => i.name === item.dataset.name).element;
            gameContainer.appendChild(item);
        }
    }

    // 敵を生成する関数
    function generateEnemies() {
        for (let i = 0; i < 5; i++) {
            const enemy = document.createElement('div');
            enemy.className = 'enemy';
            enemy.dataset.name = enemies[Math.floor(Math.random() * enemies.length)].name;
            enemy.style.width = '30px';
            enemy.style.height = '30px';
            enemy.style.position = 'absolute';
            enemy.style.left = `${Math.random() * (worldWidth - 30)}px`;
            enemy.style.bottom = `${Math.random() * (worldHeight - 30)}px`;
            enemy.dataset.health = enemies.find(e => e.name === enemy.dataset.name).health;
            enemy.textContent = enemies.find(e => e.name === enemy.dataset.name).element;
            gameContainer.appendChild(enemy);
        }
    }

    // 地形、アイテム、敵を生成
    generateTerrain();
    generateItems();
    generateEnemies();
}

// プレイヤーの初期設定
function initializePlayer() {
    player.x = worldWidth / 2;
    player.y = worldHeight / 2;
    updatePlayerPosition();
}

// ゲーム開始ボタンのイベントリスナー
document.getElementById('start-button').addEventListener('click', () => {
    generateWorld();
    initializePlayer();
    startGameLoop();
    loadGameState();
});

// ゲームループの開始
function startGameLoop() {
    setInterval(() => {
        // プレイヤーの移動処理
        handlePlayerMovement();

        // その他のゲームロジック処理
    }, 1000 / 60); // 60 FPS
}

// 初期設定
updateHpBar();
handlePlayerMovement();
