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

  // ========== 食用量映射 ==========
  var SERVING_MAP = {
    '鸡蛋':           [1, 2],
    '纯牛奶(普通)':   [250, 300],
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

  function getRandomServing(food) {
    var range = SERVING_MAP[food.name];
    if (!range) {
      return Math.random() < 0.5 ? 100 : 150;
    }
    var options = [];
    for (var i = range[0]; i <= range[1]; i += 10) {
      options.push(i);
    }
    return options[Math.floor(Math.random() * options.length)];
  }

  function formatAmount(food, grams) {
    if (food.name === '鸡蛋') {
      var count = Math.round(grams / 50);
      return '×' + Math.max(1, count);
    }
    if (food.unit === 'ml') return grams + 'ml';
    return grams + 'g';
  }

  // ========== 推荐算法 ==========
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

  function computeWeights(foods, usageCounts) {
    return foods.map(function(food) {
      var proteinPerYuan = (food.protein / food.price) * 1000;
      var baseWeight = Math.max(proteinPerYuan, 0.1);
      var usedCount = usageCounts[food.name] || 0;
      var decay = Math.pow(0.3, usedCount);
      return baseWeight * decay;
    });
  }

  function calcNutrition(food, grams) {
    var protein = +(food.protein * grams / 100).toFixed(1);
    var cost = +((food.price / 1000) * grams).toFixed(1);
    return { protein: protein, cost: cost };
  }

  function snapToServing(food, grams) {
    var range = SERVING_MAP[food.name];
    if (food.name === '鸡蛋') {
      var count = Math.round(grams / 50);
      return Math.max(1, count) * 50;
    }
    if (range) {
      if (grams <= range[0]) return range[0];
      if (grams >= range[1]) return range[1];
      return Math.round(grams / 10) * 10;
    }
    return Math.max(50, Math.round(grams / 50) * 50);
  }

  function selectMeal(targetProtein, foods, usageCounts) {
    var maxRetries = 10;

    for (var retry = 0; retry < maxRetries; retry++) {
      var weights = computeWeights(foods, usageCounts);
      var items = [];
      var totalProtein = 0;
      var totalCost = 0;

      var main = weightedRandom(foods, weights);
      var mainTargetMin = targetProtein * 0.6;
      var mainTargetMax = targetProtein * 0.8;
      var mainGramsEstimate = (mainTargetMin + mainTargetMax) / 2 / main.protein * 100;
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

      var remaining = targetProtein - totalProtein;
      var auxCount = remaining > 10 ? 2 : 1;
      var selectedNames = {};
      selectedNames[main.name] = true;

      for (var a = 0; a < auxCount && remaining > 2; a++) {
        var auxFoods = foods.filter(function(f) { return !selectedNames[f.name]; });
        if (auxFoods.length === 0) break;
        var auxWeights = computeWeights(auxFoods, usageCounts);
        var aux = weightedRandom(auxFoods, auxWeights);

        var auxGrams = getRandomServing(aux);
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

      if (totalProtein >= targetProtein * 0.85 && totalProtein <= targetProtein * 1.15) {
        return {
          items: items,
          totalProtein: +totalProtein.toFixed(1),
          totalCost: +totalCost.toFixed(1)
        };
      }
    }

    return {
      items: items || [],
      totalProtein: +(totalProtein || 0).toFixed(1),
      totalCost: +(totalCost || 0).toFixed(1)
    };
  }

  function generatePlan(foods, settings, history) {
    var usageCounts = getUsageCounts(history);
    var plan = { meals: {} };

    MEAL_SLOTS.forEach(function(slot, i) {
      var target = settings.proteinTarget * settings.ratios[i];
      plan.meals[slot] = selectMeal(target, foods, usageCounts);
    });

    return plan;
  }

  function regenerateSlot(foods, settings, history, slot) {
    var idx = MEAL_SLOTS.indexOf(slot);
    var target = settings.proteinTarget * settings.ratios[idx];
    return selectMeal(target, foods, getUsageCounts(history));
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
    getRandomServing: getRandomServing,
    formatAmount: formatAmount,
    computeWeights: computeWeights,
    calcNutrition: calcNutrition,
    selectMeal: selectMeal,
    generatePlan: generatePlan,
    regenerateSlot: regenerateSlot,
    renderDate: renderDate,
    renderAllMeals: renderAllMeals,
    renderTargetCard: renderTargetCard,
    MEAL_SLOTS: MEAL_SLOTS,
    MEAL_LABELS: MEAL_LABELS,
    MEAL_ICONS: MEAL_ICONS,
    MEAL_COLORS: MEAL_COLORS,
    DEFAULT_SETTINGS: DEFAULT_SETTINGS
  };

})();
