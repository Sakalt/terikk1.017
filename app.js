// アイテム、敵、鉱石、ブロックなどの定義
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

// ローカルストレージにゲーム状態を保存
function saveGameState() {
    const gameState = {
        player: player,
        items: Array.from(document.querySelectorAll('.item')).map(item => ({
            name: item.dataset.name,
            x: parseFloat(item.style.left),
            y: parseFloat(item.style.bottom)
        })),
        enemies: Array.from(document.querySelectorAll('.enemy')).map(enemy => ({
            name: enemy.dataset.name,
            x: parseFloat(enemy.style.left),
            y: parseFloat(enemy.style.bottom),
            health: parseFloat(enemy.dataset.health)
        }))
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

// ローカルストレージからゲーム状態をロード
function loadGameState() {
    const gameState = JSON.parse(localStorage.getItem('gameState'));
    if (gameState) {
        player = gameState.player;
        gameState.items.forEach(item => {
            const element = document.createElement('div');
            element.classList.add('item');
            element.dataset.name = item.name;
            element.style.left = item.x + 'px';
            element.style.bottom = item.y + 'px';
            element.textContent = items.find(i => i.name === item.name).element;
            document.getElementById('game-container').appendChild(element);
        });
        gameState.enemies.forEach(enemy => {
            const element = document.createElement('div');
            element.classList.add('enemy');
            element.dataset.name = enemy.name;
            element.dataset.health = enemy.health;
            element.style.left = enemy.x + 'px';
            element.style.bottom = enemy.y + 'px';
            element.textContent = enemies.find(e => e.name === enemy.name).element;
            document.getElementById('game-container').appendChild(element);
        });
        updateHpBar();
        updateInventory();
    }
}

// HPバーを更新
function updateHpBar() {
    const hpBar = document.querySelector('#hp-bar div');
    hpBar.style.width = (player.hp / 100) * 100 + '%';
}

// インベントリを更新
function updateInventory() {
    const inventory = document.getElementById('inventory');
    inventory.innerHTML = '';
    player.inventory.forEach(item => {
        const element = document.createElement('div');
        element.classList.add('inventory-item');
        element.textContent = item.element;
        inventory.appendChild(element);
    });
}

// アイテムをランダムにインベントリに追加
function addRandomItemToInventory() {
    const randomItem = items[Math.floor(Math.random() * items.length)];
    player.inventory.push(randomItem);
    updateInventory();
}

// 全てのアイテムを手に入れる
function giveAllItems() {
    player.inventory = items.slice();
    updateInventory();
}

// 敵をスポーン
function spawnEnemies() {
    const container = document.getElementById('game-container');
    enemies.forEach(enemy => {
        const element = document.createElement('div');
        element.classList.add('enemy');
        element.dataset.name = enemy.name;
        element.dataset.health = enemy.health;
        element.style.left = Math.random() * (container.clientWidth - 40) + 'px';
        element.style.bottom = Math.random() * (container.clientHeight - 40) + 'px';
        element.textContent = enemy.element;
        container.appendChild(element);
    });
}

// プレイヤーの移動
function movePlayer(dx, dy) {
    const container = document.getElementById('game-container');
    player.x = Math.max(0, Math.min(container.clientWidth - 50, player.x + dx));
    player.y = Math.max(0, Math.min(container.clientHeight - 50, player.y + dy));
    const playerElement = document.getElementById('player');
    playerElement.style.left = player.x + 'px';
    playerElement.style.bottom = player.y + 'px';
}

// プレイヤーの攻撃
function attack() {
    const now = Date.now();
    if (now - player.lastAttackTime < player.attackSpeed) return; // 攻撃速度の制御
    player.lastAttackTime = now;

    const playerElement = document.getElementById('player');
    const playerRect = playerElement.getBoundingClientRect();

    document.querySelectorAll('.enemy').forEach(enemyElement => {
        const enemyRect = enemyElement.getBoundingClientRect();
        if (
            enemyRect.left < playerRect.right &&
            enemyRect.right > playerRect.left &&
            enemyRect.top < playerRect.bottom &&
            enemyRect.bottom > playerRect.top
        ) {
            const enemyName = enemyElement.dataset.name;
            const enemyData = enemies.find(e => e.name === enemyName);
            enemyElement.dataset.health -= player.attackPower;

            // エフェクトを追加
            const effectElement = document.createElement('div');
            effectElement.classList.add('effect');
            effectElement.textContent = '✨';
            effectElement.style.left = enemyElement.style.left;
            effectElement.style.bottom = enemyElement.style.bottom;
            document.getElementById('game-container').appendChild(effectElement);
            setTimeout(() => effectElement.remove(), 500);

            if (enemyElement.dataset.health <= 0) {
                enemyElement.remove();
            }
        }
    });
}

// プレイヤーがダメージを受ける
function takeDamage(amount) {
    if (player.invincible) return; // 無敵時間中はダメージを受けない
    player.hp -= amount;
    if (player.hp <= 0) {
        alert('ゲームオーバー');
        player.hp = 100;
        player.x = 50;
        player.y = 50;
    }
    updateHpBar();
    activateInvincibility(0.6); // 攻撃後の無敵時間
}

// 無敵時間を有効化
function activateInvincibility(duration) {
    player.invincible = true;
    clearTimeout(player.invincibleTimer);
    player.invincibleTimer = setTimeout(() => player.invincible = false, duration * 1000);
}

// ゲームの初期化
function initGame() {
    document.getElementById('player').style.left = player.x + 'px';
    document.getElementById('player').style.bottom = player.y + 'px';
    updateHpBar();
    updateInventory();
    spawnEnemies();
}

// 初期化関数の呼び出し
initGame();

// ゲーム状態の保存
window.addEventListener('beforeunload', saveGameState);

// プレイヤーの移動と攻撃の処理
document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer(0, player.speed);
            break;
        case 'ArrowDown':
            movePlayer(0, -player.speed);
            break;
        case 'ArrowLeft':
            movePlayer(-player.speed, 0);
            break;
        case 'ArrowRight':
            movePlayer(player.speed, 0);
            break;
        case ' ':
            attack();
            break;
    }
});

// ゲームの読み込み
window.addEventListener('load', loadGameState);

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

// クラフトメニューの表示
function toggleCraftingMenu() {
    const menu = document.getElementById('crafting-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    updateCraftingRecipes();
}

// クラフトレシピの更新
function updateCraftingRecipes() {
    const recipeList = document.getElementById('crafting-recipes');
    recipeList.innerHTML = '';
    craftingRecipes.forEach(recipe => {
        const listItem = document.createElement('li');
        listItem.textContent = recipe.name;
        listItem.onclick = () => craftItem(recipe);
        recipeList.appendChild(listItem);
    });
}

// アイテムのクラフト
function craftItem(recipe) {
    const canCraft = recipe.ingredients.every(ingredient => {
        const inventoryItem = player.inventory.find(item => item.name === ingredient.name);
        return inventoryItem && inventoryItem.quantity >= ingredient.quantity;
    });
    if (canCraft) {
        recipe.ingredients.forEach(ingredient => {
            const inventoryItem = player.inventory.find(item => item.name === ingredient.name);
            inventoryItem.quantity -= ingredient.quantity;
            if (inventoryItem.quantity <= 0) {
                player.inventory = player.inventory.filter(item => item.name !== ingredient.name);
            }
        });
        player.inventory.push(recipe.result);
        updateInventory();
        alert(`${recipe.name}をクラフトしました！`);
    } else {
        alert('材料が不足しています');
    }
}

// 攻撃処理の追加
function attack() {
    if (Date.now() - player.lastAttackTime >= player.attackSpeed) {
        console.log('攻撃！');
        player.lastAttackTime = Date.now();
        // 攻撃処理をここに実装
        const enemies = document.querySelectorAll('.enemy');
        enemies.forEach(enemy => {
            const enemyRect = enemy.getBoundingClientRect();
            const playerRect = document.getElementById('player').getBoundingClientRect();
            if (
                playerRect.left < enemyRect.right &&
                playerRect.right > enemyRect.left &&
                playerRect.top < enemyRect.bottom &&
                playerRect.bottom > enemyRect.top
            ) {
                enemy.dataset.health -= player.attackPower;
                if (enemy.dataset.health <= 0) {
                    enemy.remove();
                }
            }
        });
    }
}

// アイテムの追加ボタン機能
function addRandomItemToInventory() {
    const allItems = [...items, ...ores, ...blocks, ...potions, ...accessories];
    const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
    const existingItem = player.inventory.find(item => item.name === randomItem.name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        player.inventory.push({ ...randomItem, quantity: 1 });
    }
    updateInventory();
}

function giveAllItems() {
    const allItems = [...items, ...ores, ...blocks, ...potions, ...accessories];
    allItems.forEach(item => {
        const existingItem = player.inventory.find(invItem => invItem.name === item.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            player.inventory.push({ ...item, quantity: 1 });
        }
    });
    updateInventory();
}

// 初期化関数でクラフトレシピの更新を呼び出す
function initGame() {
    loadGameState();
    resetJoysticks();
    updateCraftingRecipes(); // クラフトレシピの更新
}
