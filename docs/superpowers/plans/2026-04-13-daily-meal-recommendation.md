# 每日饮食推荐 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有蛋白质成本计算器基础上，新增一键生成每日四餐（早/午/晚/加餐）食材推荐功能。

**Architecture:** 新建独立页面 `recommend.html` + 逻辑文件 `recommend.js`，复用现有 `data.js` 食材数据库。算法为随机贪心，基于性价比权重 + 7天去重衰减。数据存 localStorage。

**Tech Stack:** Vanilla JavaScript, Tailwind CSS (CDN), Google Fonts (Fira Sans/Fira Code)

---

## File Structure

| 文件 | 职责 |
|------|------|
| `recommend.js` | 推荐算法 + 设置管理 + UI 渲染 + 交互逻辑 |
| `recommend.html` | 移动端页面结构（引入 data.js + recommend.js） |
| `data.js` | 不改动，现有食材数据库 |

---

### Task 1: 创建页面骨架和设置管理

**Files:**
- Create: `recommend.html`
- Create: `recommend.js`（初始版本，仅设置部分）

- [ ] **Step 1: 创建 recommend.html 页面骨架**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>每日饮食推荐</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300;400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="data.js"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: { sans: ['Fira Sans','sans-serif'], mono: ['Fira Code','monospace'] }
        }
      }
    }
  </script>
  <style>
    * { -webkit-tap-highlight-color: transparent; }
    body { font-family:'Fira Sans',sans-serif; background:#F8FAFC; overscroll-behavior:none; }
    .font-data { font-family:'Fira Code',monospace; }
    .bar-fill { transition:width 0.5s ease-out; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
    .meal-card { animation:fadeIn 0.15s ease-out; }
  </style>
</head>
<body class="min-h-screen pb-20">

  <!-- 顶栏 -->
  <div id="topBar" class="sticky top-0 z-30 bg-emerald-600 text-white px-4 py-3 flex justify-between items-center shadow">
    <div>
      <div class="font-bold text-lg">每日饮食推荐</div>
      <div class="text-xs opacity-80" id="dateDisplay"></div>
    </div>
    <button id="settingsBtn" class="bg-white/20 px-3 py-1.5 rounded-lg text-sm active:bg-white/30">设置</button>
  </div>

  <!-- 目标进度卡片 -->
  <div id="targetCard" class="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
    <div class="flex justify-between items-center mb-2">
      <span class="font-semibold text-emerald-800">今日蛋白质目标</span>
      <span class="text-xl font-bold text-emerald-600 font-data" id="targetDisplay">120g</span>
    </div>
    <div class="bg-emerald-100 rounded-full h-2 overflow-hidden">
      <div id="progressBar" class="bg-emerald-500 h-full rounded-full bar-fill" style="width:0%"></div>
    </div>
    <div class="flex justify-between text-xs text-slate-500 mt-1">
      <span id="progressText">已选 0g / 120g</span>
      <span id="totalCost">预估 ¥0</span>
    </div>
  </div>

  <!-- 四餐容器 -->
  <div id="mealsContainer" class="mx-4 mt-3 flex flex-col gap-3"></div>

  <!-- 底部按钮 -->
  <div class="mx-4 mt-4 pb-4">
    <button id="regenerateAllBtn" class="w-full bg-emerald-600 text-white py-3.5 rounded-xl text-base font-semibold active:bg-emerald-700">
      全部重新生成
    </button>
  </div>

  <!-- 设置弹窗 -->
  <div id="settingsModal" class="fixed inset-0 z-40 hidden">
    <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" id="settingsOverlay"></div>
    <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-lg">推荐设置</h3>
        <button id="settingsClose" class="text-slate-400 text-2xl leading-none">&times;</button>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-slate-700 mb-1">每日蛋白质目标 (g)</label>
        <input type="number" id="proteinInput" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-lg font-data" min="50" max="300" value="120">
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-slate-700 mb-2">餐次比例</label>
        <div id="ratioSliders" class="space-y-3"></div>
        <div class="text-xs text-slate-400 mt-1 text-right" id="ratioSum">合计 100%</div>
      </div>
      <button id="settingsSave" class="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold active:bg-emerald-700">保存</button>
    </div>
  </div>

  <script src="recommend.js"></script>
</body>
</html>
```

- [ ] **Step 2: 创建 recommend.js 的设置管理部分**

```javascript
(function() {
  'use strict';

  // ========== 常量 ==========
  var STORAGE_SETTINGS = 'recommendSettings';
  var STORAGE_HISTORY = 'recommendHistory';
  var STORAGE_TODAY = 'todayRecommend';
  var MAX_HISTORY_DAYS = 7;
  var MEAL_SLOTS = ['breakfast', 'lunch', 'dinner', 'snack'];
  var MEAL_LABELS = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' };
  var MEAL_ICONS = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍪' };
  var MEAL_COLORS = { breakfast: '#f59e0b', lunch: '#ef4444', dinner: '#6366f1', snack: '#8b5cf6' };
  var DEFAULT_SETTINGS = { proteinTarget: 120, ratios: [0.25, 0.35, 0.30, 0.10] };

  // ========== 设置管理 ==========
  function loadSettings() {
    try {
      var saved = localStorage.getItem(STORAGE_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  }

  function saveSettings(settings) {
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings));
  }

  // ========== 历史管理 ==========
  function loadHistory() {
    try {
      var saved = localStorage.getItem(STORAGE_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return [];
  }

  function saveHistory(history) {
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history));
  }

  function getTodayKey() {
    var d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth()+1).padStart(2,'0') + '-' +
      String(d.getDate()).padStart(2,'0');
  }

  function cleanupHistory(history) {
    var cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - MAX_HISTORY_DAYS);
    var cutoffKey = cutoff.getFullYear() + '-' +
      String(cutoff.getMonth()+1).padStart(2,'0') + '-' +
      String(cutoff.getDate()).padStart(2,'0');
    return history.filter(function(h) { return h.date >= cutoffKey; });
  }

  /** 统计近7天每种食材的使用次数 */
  function getUsageCounts(history) {
    var counts = {};
    history.forEach(function(day) {
      day.meals.forEach(function(meal) {
        meal.items.forEach(function(item) {
          counts[item.name] = (counts[item.name] || 0) + 1;
        });
      });
    });
    return counts;
  }

  // ========== 当日推荐存取 ==========
  function loadToday() {
    try {
      var saved = localStorage.getItem(STORAGE_TODAY);
      if (saved) {
        var data = JSON.parse(saved);
        if (data.date === getTodayKey()) return data;
      }
    } catch(e) {}
    return null;
  }

  function saveToday(plan) {
    plan.date = getTodayKey();
    localStorage.setItem(STORAGE_TODAY, JSON.stringify(plan));
  }

  // ========== 暴露到全局 ==========
  window.RecommendApp = {
    loadSettings: loadSettings,
    saveSettings: saveSettings,
    loadHistory: loadHistory,
    saveHistory: saveHistory,
    getTodayKey: getTodayKey,
    cleanupHistory: cleanupHistory,
    getUsageCounts: getUsageCounts,
    loadToday: loadToday,
    saveToday: saveToday,
    MEAL_SLOTS: MEAL_SLOTS,
    MEAL_LABELS: MEAL_LABELS,
    MEAL_ICONS: MEAL_ICONS,
    MEAL_COLORS: MEAL_COLORS,
    DEFAULT_SETTINGS: DEFAULT_SETTINGS
  };

})();
```

- [ ] **Step 3: 在浏览器打开验证页面加载无报错**

Run: 在浏览器打开 `recommend.html`
Expected: 页面显示顶栏、目标卡片（0g/120g）、空的餐次区域、设置按钮可点击

- [ ] **Step 4: Commit**

```bash
git add recommend.html recommend.js
git commit -m "feat: add recommend page skeleton and settings management"
```

---

### Task 2: 实现推荐算法

**Files:**
- Modify: `recommend.js`（在 IIFE 内添加算法代码）

- [ ] **Step 1: 在 recommend.js 中添加食用量映射和算法代码**

在 `window.RecommendApp` 赋值之前，添加以下代码：

```javascript
  // ========== 食用量映射 ==========
  var SERVING_MAP = {
    '鸡蛋':           [1, 2],        // 个数
    '纯牛奶(普通)':   [250, 300],    // ml
    '纯牛奶(高端)':   [250, 300],
    '豆浆':           [250, 300],
    '干黄豆':         [30, 50],
    '黑豆(干)':       [30, 50],
    '腐竹(干)':       [30, 50],
    '北豆腐':         [100, 150],
    '豆腐干':         [50, 100],
    '天贝':           [80, 120],
    '藜麦(干)':       [50, 80],
    '花生(带壳生)':   [25, 40],
    '南瓜子(带壳)':   [25, 40],
    '杏仁(巴旦木)':   [25, 40],
    '混合坚果':       [25, 40],
    '花生酱':         [20, 30],
    '希腊酸奶':       [150, 200],
    '奶酪(硬质)':     [30, 50],
    '大豆分离蛋白粉': [25, 35],
    '乳清蛋白粉(浓缩)': [25, 35],
    '乳清蛋白粉(分离)': [25, 35]
  };

  /** 获取某个食材的随机食用量(克/毫升) */
  function getRandomServing(food) {
    var range = SERVING_MAP[food.name];
    if (!range) {
      // 肉类默认 100-150g
      return Math.random() < 0.5 ? 100 : 150;
    }
    var options = [];
    for (var i = range[0]; i <= range[1]; i += 10) {
      options.push(i);
    }
    return options[Math.floor(Math.random() * options.length)];
  }

  /** 格式化食用量显示 */
  function formatAmount(food, grams) {
    if (food.name === '鸡蛋') {
      var count = Math.round(grams / 50);
      return '×' + Math.max(1, count);
    }
    if (food.unit === 'ml') return grams + 'ml';
    return grams + 'g';
  }

  // ========== 推荐算法 ==========
  /** 计算权重随机选择一个食材 */
  function weightedRandom(foods, weights) {
    var totalWeight = 0;
    for (var i = 0; i < weights.length; i++) totalWeight += weights[i];
    var r = Math.random() * totalWeight;
    var cumulative = 0;
    for (var j = 0; j < weights.length; j++) {
      cumulative += weights[j];
      if (r <= cumulative) return foods[j];
    }
    return foods[foods.length - 1];
  }

  /** 计算每种食材的选择权重 */
  function computeWeights(foods, usageCounts) {
    return foods.map(function(food) {
      // 性价比：每元获得的蛋白质越多，权重越高
      var proteinPerYuan = (food.protein / food.price) * 1000;
      var baseWeight = Math.max(proteinPerYuan, 0.1);
      // 重复衰减：用过越多越不容易再选
      var usedCount = usageCounts[food.name] || 0;
      var decay = Math.pow(0.3, usedCount);
      return baseWeight * decay;
    });
  }

  /** 计算蛋白质和花费 */
  function calcNutrition(food, grams) {
    var protein = +(food.protein * grams / 100).toFixed(1);
    var cost = +((food.price / 1000) * grams).toFixed(1);
    return { protein: protein, cost: cost };
  }

  /**
   * 为单个餐次生成推荐
   * @param {number} targetProtein - 目标蛋白质(g)
   * @param {Array} foods - 食材列表
   * @param {Object} usageCounts - 使用频率统计
   * @returns {Object} { items: [{name, amount, grams, protein, cost}], totalProtein, totalCost }
   */
  function selectMeal(targetProtein, foods, usageCounts) {
    var maxRetries = 10;

    for (var retry = 0; retry < maxRetries; retry++) {
      var weights = computeWeights(foods, usageCounts);
      var items = [];
      var totalProtein = 0;
      var totalCost = 0;

      // 第1步：选主蛋白源（提供 60-80% 目标蛋白质）
      var main = weightedRandom(foods, weights);
      var mainTargetMin = targetProtein * 0.6;
      var mainTargetMax = targetProtein * 0.8;

      // 计算需要多少克来达到目标范围
      var mainGramsEstimate = (mainTargetMin + mainTargetMax) / 2 / main.protein * 100;
      // 取最近的合理食用量
      var mainGrams = snapToServing(main, mainGramsEstimate);
      var mainNutrition = calcNutrition(main, mainGrams);
      items.push({
        name: main.name,
        amount: formatAmount(main, mainGrams),
        grams: mainGrams,
        protein: mainNutrition.protein,
        cost: mainNutrition.cost
      });
      totalProtein += mainNutrition.protein;
      totalCost += mainNutrition.cost;

      // 第2步：选1-2个辅助食材补足
      var remaining = targetProtein - totalProtein;
      var auxCount = remaining > 10 ? 2 : 1;
      // 排除已选食材
      var selectedNames = {};
      selectedNames[main.name] = true;

      for (var a = 0; a < auxCount && remaining > 2; a++) {
        var auxFoods = foods.filter(function(f) { return !selectedNames[f.name]; });
        if (auxFoods.length === 0) break;
        var auxWeights = computeWeights(auxFoods, usageCounts);
        var aux = weightedRandom(auxFoods, auxWeights);

        var auxGrams = getRandomServing(aux);
        // 如果辅助食材蛋白质太多，减半
        var auxProtein = aux.protein * auxGrams / 100;
        if (auxProtein > remaining * 1.5) {
          auxGrams = Math.round(auxGrams / 2);
          auxProtein = aux.protein * auxGrams / 100;
        }

        var auxNutrition = calcNutrition(aux, auxGrams);
        items.push({
          name: aux.name,
          amount: formatAmount(aux, auxGrams),
          grams: auxGrams,
          protein: auxNutrition.protein,
          cost: auxNutrition.cost
        });
        totalProtein += auxNutrition.protein;
        totalCost += auxNutrition.cost;
        remaining = targetProtein - totalProtein;
        selectedNames[aux.name] = true;
      }

      // 校验：蛋白质在目标 ±15% 内
      if (totalProtein >= targetProtein * 0.85 && totalProtein <= targetProtein * 1.15) {
        return {
          items: items,
          totalProtein: +totalProtein.toFixed(1),
          totalCost: +totalCost.toFixed(1)
        };
      }
    }

    // 重试用尽，返回最后一次结果（宁可差一点也不报错）
    return {
      items: items || [],
      totalProtein: +(totalProtein || 0).toFixed(1),
      totalCost: +(totalCost || 0).toFixed(1)
    };
  }

  /** 将克数对齐到合理的食用量 */
  function snapToServing(food, grams) {
    var range = SERVING_MAP[food.name];
    if (food.name === '鸡蛋') {
      var count = Math.round(grams / 50);
      return Math.max(1, count) * 50;
    }
    if (range) {
      // 向最近的边界靠拢
      if (grams <= range[0]) return range[0];
      if (grams >= range[1]) return range[1];
      // 在范围内取最近的10整数倍
      return Math.round(grams / 10) * 10;
    }
    // 肉类等：对齐到50的倍数，最少50g
    return Math.max(50, Math.round(grams / 50) * 50);
  }

  /** 生成全天推荐 */
  function generatePlan(foods, settings, history) {
    var usageCounts = getUsageCounts(history);
    var plan = { meals: {} };

    MEAL_SLOTS.forEach(function(slot, i) {
      var target = settings.proteinTarget * settings.ratios[i];
      plan.meals[slot] = selectMeal(target, foods, usageCounts);
    });

    return plan;
  }

  /** 只重新生成单个餐次 */
  function regenerateSlot(foods, settings, history, slot) {
    var idx = MEAL_SLOTS.indexOf(slot);
    var target = settings.proteinTarget * settings.ratios[idx];
    return selectMeal(target, foods, getUsageCounts(history));
  }
```

然后把这些函数也暴露到 `window.RecommendApp`：

```javascript
  window.RecommendApp = {
    // ... 之前的设置/历史管理函数 ...
    getRandomServing: getRandomServing,
    formatAmount: formatAmount,
    computeWeights: computeWeights,
    calcNutrition: calcNutrition,
    selectMeal: selectMeal,
    generatePlan: generatePlan,
    regenerateSlot: regenerateSlot
  };
```

- [ ] **Step 2: 在浏览器控制台验证算法**

打开 `recommend.html`，在控制台执行：

```javascript
var foods = window.PROTEIN_DB.foods;
var plan = RecommendApp.generatePlan(foods, RecommendApp.loadSettings(), []);
console.log(JSON.stringify(plan, null, 2));
```

Expected: 输出包含 breakfast/lunch/dinner/snack 四个餐次，每餐有 items 数组，蛋白质合计接近 120g

- [ ] **Step 3: Commit**

```bash
git add recommend.js
git commit -m "feat: implement meal recommendation algorithm"
```

---

### Task 3: 实现 UI 渲染

**Files:**
- Modify: `recommend.js`（添加渲染函数和事件绑定）

- [ ] **Step 1: 在 recommend.js 中添加渲染代码**

在 `window.RecommendApp` 之前添加渲染函数：

```javascript
  // ========== UI 渲染 ==========
  function $(id) { return document.getElementById(id); }

  function renderDate() {
    var now = new Date();
    var weekDays = ['日','一','二','三','四','五','六'];
    $('dateDisplay').textContent =
      now.getFullYear() + '/' + (now.getMonth()+1) + '/' + now.getDate() + ' 周' + weekDays[now.getDay()];
  }

  function renderTargetCard(plan, settings) {
    var totalProtein = 0, totalCost = 0;
    MEAL_SLOTS.forEach(function(slot) {
      var meal = plan.meals[slot];
      if (meal) {
        totalProtein += meal.totalProtein;
        totalCost += meal.totalCost;
      }
    });
    totalProtein = +totalProtein.toFixed(1);
    totalCost = +totalCost.toFixed(1);

    $('targetDisplay').textContent = settings.proteinTarget + 'g';
    var pct = Math.min(100, Math.round(totalProtein / settings.proteinTarget * 100));
    $('progressBar').style.width = pct + '%';
    $('progressText').textContent = '已选 ' + totalProtein + 'g / ' + settings.proteinTarget + 'g';
    $('totalCost').textContent = '预估 ¥' + totalCost;
  }

  function renderMealCard(slot, mealData, settings) {
    var idx = MEAL_SLOTS.indexOf(slot);
    var target = +(settings.proteinTarget * settings.ratios[idx]).toFixed(0);
    var color = MEAL_COLORS[slot];
    var icon = MEAL_ICONS[slot];
    var label = MEAL_LABELS[slot];

    var itemsHtml = mealData.items.map(function(item) {
      return '<div class="flex justify-between text-sm">' +
        '<span class="text-slate-700">' + item.name + '</span>' +
        '<span class="text-slate-400 font-data text-xs">' + item.protein + 'g</span>' +
      '</div>';
    }).join('');

    return '<div class="meal-card bg-white border border-slate-200 rounded-xl overflow-hidden" style="border-left:4px solid ' + color + '">' +
      '<div class="p-3">' +
        '<div class="flex justify-between items-center mb-2">' +
          '<div>' +
            '<span class="font-semibold">' + icon + ' ' + label + '</span>' +
            '<span class="text-xs text-slate-400 ml-1.5">目标 ' + target + 'g</span>' +
          '</div>' +
          '<button class="regenerate-slot text-xs bg-slate-100 px-2.5 py-1 rounded-md active:bg-slate-200" data-slot="' + slot + '">换一套</button>' +
        '</div>' +
        '<div class="space-y-1.5">' + itemsHtml + '</div>' +
        '<div class="border-t border-slate-100 mt-2 pt-1.5 flex justify-between text-xs font-semibold text-emerald-600">' +
          '<span>蛋白质 ' + mealData.totalProtein + 'g</span>' +
          '<span>¥' + mealData.totalCost + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderAllMeals(plan, settings) {
    var html = '';
    MEAL_SLOTS.forEach(function(slot) {
      if (plan.meals[slot]) {
        html += renderMealCard(slot, plan.meals[slot], settings);
      }
    });
    $('mealsContainer').innerHTML = html;
    renderTargetCard(plan, settings);
  }
```

然后在 `window.RecommendApp` 中添加：

```javascript
    renderDate: renderDate,
    renderAllMeals: renderAllMeals,
    renderTargetCard: renderTargetCard
```

- [ ] **Step 2: 在浏览器控制台验证渲染**

```javascript
var settings = RecommendApp.loadSettings();
var plan = RecommendApp.generatePlan(window.PROTEIN_DB.foods, settings, []);
RecommendApp.renderAllMeals(plan, settings);
```

Expected: 页面显示四张餐次卡片，每张有食材列表和蛋白质/花费

- [ ] **Step 3: Commit**

```bash
git add recommend.js
git commit -m "feat: add UI rendering for meal recommendation"
```

---

### Task 4: 实现交互逻辑和初始化

**Files:**
- Modify: `recommend.js`（添加事件绑定和初始化）

- [ ] **Step 1: 在 recommend.js 中添加事件绑定和初始化代码**

在 `window.RecommendApp` 之前添加：

```javascript
  // ========== 事件绑定与初始化 ==========
  var currentPlan = null;
  var currentSettings = null;

  function init() {
    currentSettings = loadSettings();
    renderDate();

    // 尝试加载今日已有推荐
    currentPlan = loadToday();
    if (!currentPlan) {
      generateAndRender();
    } else {
      renderAllMeals(currentPlan, currentSettings);
    }

    // 绑定事件
    $('regenerateAllBtn').addEventListener('click', function() {
      generateAndRender();
    });

    $('mealsContainer').addEventListener('click', function(e) {
      var btn = e.target.closest('.regenerate-slot');
      if (!btn) return;
      var slot = btn.getAttribute('data-slot');
      regenerateSlotAndRender(slot);
    });

    // 设置弹窗
    $('settingsBtn').addEventListener('click', openSettings);
    $('settingsClose').addEventListener('click', closeSettings);
    $('settingsOverlay').addEventListener('click', closeSettings);
    $('settingsSave').addEventListener('click', saveSettingsAndRegenerate);
  }

  function generateAndRender() {
    var foods = window.PROTEIN_DB.foods;
    var history = loadHistory();
    currentPlan = generatePlan(foods, currentSettings, history);
    saveToday(currentPlan);
    recordToHistory(currentPlan);
    renderAllMeals(currentPlan, currentSettings);
  }

  function regenerateSlotAndRender(slot) {
    var foods = window.PROTEIN_DB.foods;
    var history = loadHistory();
    var newMeal = regenerateSlot(foods, currentSettings, history, slot);
    currentPlan.meals[slot] = newMeal;
    saveToday(currentPlan);
    renderAllMeals(currentPlan, currentSettings);
  }

  function recordToHistory(plan) {
    var history = loadHistory();
    var todayKey = getTodayKey();
    // 如果今天已有记录，更新它；否则新增
    var found = false;
    for (var i = 0; i < history.length; i++) {
      if (history[i].date === todayKey) {
        history[i].meals = plan.meals;
        found = true;
        break;
      }
    }
    if (!found) {
      history.push({ date: todayKey, meals: plan.meals });
    }
    history = cleanupHistory(history);
    saveHistory(history);
  }

  // ========== 设置弹窗 ==========
  function openSettings() {
    $('proteinInput').value = currentSettings.proteinTarget;
    renderRatioSliders(currentSettings.ratios);
    $('settingsModal').classList.remove('hidden');
  }

  function closeSettings() {
    $('settingsModal').classList.add('hidden');
  }

  function renderRatioSliders(ratios) {
    var labels = ['早餐', '午餐', '晚餐', '加餐'];
    var html = '';
    ratios.forEach(function(r, i) {
      var pct = Math.round(r * 100);
      html += '<div class="flex items-center gap-3">' +
        '<span class="text-sm text-slate-600 w-10">' + labels[i] + '</span>' +
        '<input type="range" class="flex-1 ratio-slider" min="5" max="60" value="' + pct + '" data-index="' + i + '">' +
        '<span class="text-sm font-data text-slate-700 w-10 text-right ratio-display">' + pct + '%</span>' +
      '</div>';
    });
    $('ratioSliders').innerHTML = html;

    // 绑定 slider 事件
    var sliders = document.querySelectorAll('.ratio-slider');
    sliders.forEach(function(slider) {
      slider.addEventListener('input', handleRatioChange);
    });
    updateRatioSum(ratios);
  }

  function handleRatioChange(e) {
    var idx = parseInt(e.target.getAttribute('data-index'));
    var newVal = parseInt(e.target.value) / 100;
    var ratios = currentSettings.ratios.slice();

    // 计算剩余份额
    var oldVal = ratios[idx];
    var diff = newVal - oldVal;
    var remaining = 1 - newVal;

    // 其他 slot 按原有比例分配剩余
    var otherSum = 0;
    ratios.forEach(function(r, i) { if (i !== idx) otherSum += r; });

    ratios[idx] = newVal;
    if (otherSum > 0) {
      for (var i = 0; i < ratios.length; i++) {
        if (i !== idx) {
          ratios[i] = +(ratios[i] / otherSum * remaining).toFixed(3);
        }
      }
    }

    // 更新 slider 显示值
    var sliders = document.querySelectorAll('.ratio-slider');
    var displays = document.querySelectorAll('.ratio-display');
    ratios.forEach(function(r, i) {
      var pct = Math.round(r * 100);
      sliders[i].value = pct;
      displays[i].textContent = pct + '%';
    });

    currentSettings.ratios = ratios;
    updateRatioSum(ratios);
  }

  function updateRatioSum(ratios) {
    var sum = ratios.reduce(function(a, b) { return a + b; }, 0);
    var pct = Math.round(sum * 100);
    $('ratioSum').textContent = '合计 ' + pct + '%';
    $('ratioSum').className = 'text-xs mt-1 text-right ' +
      (pct === 100 ? 'text-slate-400' : 'text-red-500 font-semibold');
  }

  function saveSettingsAndRegenerate() {
    var target = parseInt($('proteinInput').value);
    if (target >= 50 && target <= 300) {
      currentSettings.proteinTarget = target;
    }
    saveSettings(currentSettings);
    closeSettings();
    generateAndRender();
  }

  // ========== 启动 ==========
  document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 2: 在浏览器打开页面做端到端验证**

打开 `recommend.html`

Expected:
- 页面自动生成四餐推荐
- 点击"换一套"只刷新对应餐次
- 点击"全部重新生成"刷新所有
- 点击"设置"弹出设置面板
- 修改蛋白质目标后保存，重新生成
- 刷新页面后推荐结果保持（localStorage）

- [ ] **Step 3: Commit**

```bash
git add recommend.js
git commit -m "feat: add interaction logic and initialization"
```

---

### Task 5: 从现有页面添加入口链接

**Files:**
- Modify: `mobile.html`（添加一个链接按钮）
- Modify: `index.html`（添加一个链接按钮）

- [ ] **Step 1: 在 mobile.html 中添加入口**

在 mobile.html 的底部导航栏中添加一个"推荐"tab（或在一个合适的位置添加链接按钮）。需要先读取 mobile.html 找到导航栏的位置。

具体位置：找到底部 tab 导航区域，添加一个新的 tab 项：

```html
<a href="recommend.html" class="flex flex-col items-center gap-0.5 text-slate-400 active:text-blue-600">
  <span class="text-lg">🍽️</span>
  <span class="text-[10px]">推荐</span>
</a>
```

- [ ] **Step 2: 在 index.html 中添加入口**

在 index.html 的适当位置添加一个按钮/链接指向 `recommend.html`。需要先读取 index.html 找到合适位置。

```html
<a href="recommend.html" class="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
  🍽️ 每日饮食推荐
</a>
```

- [ ] **Step 3: 在两个页面中点击链接验证跳转正常**

- [ ] **Step 4: Commit**

```bash
git add mobile.html index.html
git commit -m "feat: add navigation links to meal recommendation page"
```

---

### Task 6: 端到端测试与完善

**Files:**
- 可能微调 `recommend.js` 或 `recommend.html`

- [ ] **Step 1: 功能验证清单**

在浏览器中逐一验证：

- [ ] 首次打开自动生成推荐，四餐都有内容
- [ ] 蛋白质总量接近目标（±15%）
- [ ] "换一套"只刷新对应餐次
- [ ] "全部重新生成"刷新所有
- [ ] 设置中修改蛋白质目标后重新生成
- [ ] 设置中拖动比例 slider 正常工作
- [ ] 刷新页面后推荐结果保持
- [ ] 多次生成后食材有变化（去重生效）

- [ ] **Step 2: 修复发现的问题（如有）**

- [ ] **Step 3: 最终 Commit**

```bash
git add -A
git commit -m "fix: polish meal recommendation feature based on testing"
```
