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
  var CARB_CATEGORIES = ['主食', '水果', '蔬菜'];
  // 餐次默认权重 [早餐, 午餐, 晚餐, 加餐]，按品类
  var MEAL_WEIGHT_DEFAULTS = {
    '鲜肉':   [2, 8, 8, 3],
    '成品肉': [4, 5, 4, 8],
    '蛋奶':   [9, 4, 3, 7],
    '豆类':   [3, 6, 6, 3],
    '蛋白粉': [5, 2, 2, 7],
    '干果':   [3, 3, 2, 7],
    '主食':   [6, 7, 6, 4],
    '蔬菜':   [3, 8, 8, 4],
    '水果':   [5, 5, 4, 7]
  };
  // 个别食材覆盖（与品类默认差异大的）
  var MEAL_WEIGHT_OVERRIDES = {
    '白米饭':           [2, 10, 9, 1],
    '面条(熟)':         [4, 10, 8, 2],
    '红薯':             [6, 6, 5, 8],
    '燕麦(干)':         [10, 3, 2, 7],
    '全麦面包':         [9, 4, 3, 8],
    '馒头':             [9, 6, 5, 3],
    '玉米':             [5, 5, 5, 7],
    '小米粥(熟)':       [9, 3, 4, 5],
    '紫薯':             [5, 5, 5, 7],
    '鸡蛋':             [10, 7, 4, 5],
    '希腊酸奶':         [7, 3, 2, 9],
    '豆浆':             [10, 2, 1, 5],
    '豆腐干':           [3, 7, 6, 6],
    '金枪鱼罐头(水浸)': [4, 4, 3, 6],
    '鸡翅中(冷冻)':     [1, 5, 5, 6],
    '牛肉干':           [3, 3, 2, 8],
    '黄瓜':             [3, 7, 7, 7],
    '紫菜(干)':         [5, 4, 4, 4],
    '香蕉':             [8, 6, 4, 9]
  };
  /** 获取食材在某餐的综合权重 = 基础偏好 × 餐次适配 */
  function getMealWeight(food, slot) {
    var idx = MEAL_SLOTS.indexOf(slot);
    var catDefault = MEAL_WEIGHT_DEFAULTS[food.cat] || [5, 5, 5, 5];
    var mealW = (MEAL_WEIGHT_OVERRIDES[food.name] || catDefault)[idx];
    return (food.weight || 5) * (mealW || 5);
  }
  // 活动系数（TDEE = BMR × 活动系数）
  var ACTIVITY_FACTORS = {
    sedentary: { label: '久坐', factor: 1.2 },
    light:     { label: '轻度运动', factor: 1.375 },
    moderate:  { label: '中度运动', factor: 1.55 },
    active:    { label: '高强度运动', factor: 1.725 },
    extreme:   { label: '极高强度', factor: 1.9 }
  };
  // 预设：蛋白按体重 → 脂肪按体重 → 碳水填剩余热量
  // 依据：ISSN protein 1.6-2.2g/kg; ACSM fat 0.7-1.0g/kg; Henselmans 2026 meta-analysis
  var PRESETS = {
    muscle:  { label: '增肌', proteinPerKg: 2.0, fatPerKg: 1.0, calOffset: 300 },
    cut:     { label: '减脂', proteinPerKg: 1.8, fatPerKg: 0.7, calOffset: -500 },
    balance: { label: '均衡', proteinPerKg: 1.4, fatPerKg: 0.8, calOffset: 0 }
  };
  var DEFAULT_SETTINGS = {
    proteinTarget: 120,
    carbsTarget: 250,
    caloriesTarget: 2000,
    bodyWeight: 70,
    bodyHeight: 170,
    bodyAge: 30,
    gender: 'male',
    activity: 'moderate',
    proteinRatios: [0.25, 0.35, 0.30, 0.10],
    carbsRatios:  [0.30, 0.35, 0.25, 0.10],
    slotExcludes: {
      breakfast: ['鲜肉', '蛋白粉'],
      lunch: ['蛋白粉'],
      dinner: ['蛋奶', '蛋白粉'],
      snack: ['鲜肉', '主食', '豆类', '成品肉']
    },
    cookingOil: { breakfast: 0, lunch: 10, dinner: 10, snack: 0 },
    veggieSlots: ['breakfast', 'lunch', 'dinner']
  };

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
      var mealSlots = day.meals;
      var slots = Array.isArray(mealSlots) ? mealSlots : Object.keys(mealSlots).map(function(k) { return mealSlots[k]; });
      slots.forEach(function(meal) {
        if (meal && meal.items) {
          meal.items.forEach(function(item) {
            counts[item.name] = (counts[item.name] || 0) + 1;
          });
        }
      });
    });
    return counts;
  }

  // ========== 食用量映射（从 data.js 食物记录的 serving/servingUnit 字段读取） ==========

  // 肉类默认限制
  var MEAT_DEFAULT_MAX = 200; // 克，单次最多200g

  function getRandomServing(food) {
    var range = food.serving;
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
    var pu = food.servingUnit;
    if (pu) {
      var count = Math.round(grams / pu.g);
      count = Math.max(1, count);
      var actual = count * pu.g;
      return count + pu.unit + '(' + actual + (food.unit === 'ml' ? 'ml' : 'g') + ')';
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

  function computeWeights(foods, usageCounts, mode, slot) {
    return foods.map(function(food) {
      var key = mode === 'carbs' ? food.carbs : food.protein;
      var perYuan = (key / food.price) * 1000;
      var baseWeight = Math.max(perYuan, 0.1);
      var mw = slot ? getMealWeight(food, slot) : (food.weight || 5);
      var usedCount = usageCounts[food.name] || 0;
      var decay = Math.pow(0.3, usedCount);
      return baseWeight * mw * decay;
    });
  }

  function calcNutrition(food, grams) {
    var protein = +(food.protein * grams / 100).toFixed(1);
    var carbs = +(food.carbs * grams / 100).toFixed(1);
    var fat = +((food.fat || 0) * grams / 100).toFixed(1);
    var fiber = +((food.fiber || 0) * grams / 100).toFixed(1);
    var calories = Math.round(protein * 4 + carbs * 4 + fat * 9);
    var cost = +((food.price / 1000) * grams).toFixed(1);
    return { protein: protein, carbs: carbs, fat: fat, fiber: fiber, calories: calories, cost: cost };
  }

  /**
   * 将克数对齐到实用单位
   * @param {number} grams - 目标克数
   * @param {boolean} allowBelow - 是否允许低于1个单位（避免小目标超标）
   */
  function snapToServing(food, grams, allowBelow) {
    var pu = food.servingUnit;
    if (pu) {
      var count = Math.round(grams / pu.g);
      if (allowBelow && count < 1) count = 1;
      count = Math.max(1, Math.min(count, pu.max));
      return count * pu.g;
    }
    var range = food.serving;
    if (range) {
      if (grams <= range[0]) return range[0];
      if (grams >= range[1]) return range[1];
      return Math.round(grams / 10) * 10;
    }
    return Math.min(MEAT_DEFAULT_MAX, Math.max(50, Math.round(grams / 50) * 50));
  }

  /** 判断食物是否属于碳水品类 */
  function isCarbFood(food) {
    return CARB_CATEGORIES.indexOf(food.cat) !== -1;
  }

  /** 按名称查找食物并判断是否碳水品类 */
  function isCarbFoodByName(name) {
    var foods = window.PROTEIN_DB.foods;
    for (var i = 0; i < foods.length; i++) {
      if (foods[i].name === name) return isCarbFood(foods[i]);
    }
    return false;
  }

  /**
   * 计算偏差分数——超标惩罚加倍
   * 返回值越小越好
   */
  function deviationScore(actual, target) {
    if (actual <= target) return (target - actual) / target;
    return (actual - target) / target * 2.5; // 超标惩罚 2.5 倍
  }

  /** 选蛋白质食材（非碳水品类） */
  function selectProteinItems(targetProtein, foods, usageCounts, slot) {
    var proteinFoods = foods.filter(function(f) { return !isCarbFood(f); });
    if (proteinFoods.length === 0) return { items: [], totalProtein: 0, totalCarbs: 0, totalFat: 0, totalFiber: 0, totalCalories: 0, totalCost: 0 };

    var maxItems = targetProtein < 20 ? 1 : 3;
    var tolerance = targetProtein < 20 ? 1.20 : 1.10;

    var maxRetries = 30;
    var bestResult = null;
    var bestScore = Infinity;

    for (var retry = 0; retry < maxRetries; retry++) {
      var weights = computeWeights(proteinFoods, usageCounts, 'protein', slot);
      var totalProtein = 0, totalCarbs = 0, totalFat = 0, totalFiber = 0, totalCalories = 0, totalCost = 0;
      var selectedNames = {};

      // 主食：目标 40-60% 的蛋白质
      var main = weightedRandom(proteinFoods, weights);
      var mainTarget = targetProtein * (0.4 + Math.random() * 0.2);
      var mainGramsEstimate = mainTarget / main.protein * 100;
      var mainGrams = snapToServing(main, mainGramsEstimate);

      // 主食物超标 tolerance 就跳过本轮
      if (main.protein * mainGrams / 100 > targetProtein * tolerance) continue;

      var mainNutrition = calcNutrition(main, mainGrams);
      items.push({
        name: main.name, amount: formatAmount(main, mainGrams), grams: mainGrams,
        protein: mainNutrition.protein, carbs: mainNutrition.carbs, fat: mainNutrition.fat, fiber: mainNutrition.fiber, calories: mainNutrition.calories, cost: mainNutrition.cost
      });
      totalProtein += mainNutrition.protein;
      totalCarbs += mainNutrition.carbs;
      totalFat += mainNutrition.fat;
      totalFiber += mainNutrition.fiber;
      totalCalories += mainNutrition.calories;
      totalCost += mainNutrition.cost;
      selectedNames[main.name] = true;

      // 辅食
      for (var a = 0; a < maxItems - 1; a++) {
        var remaining = targetProtein - totalProtein;
        if (remaining < targetProtein * 0.08) break;
        if (totalProtein > targetProtein * 1.02) break;

        var auxFoods = proteinFoods.filter(function(f) { return !selectedNames[f.name]; });
        if (auxFoods.length === 0) break;

        // 过滤掉加入后会超标的食物
        var validAux = auxFoods.filter(function(f) {
          var minGrams = getMinServing(f);
          return totalProtein + f.protein * minGrams / 100 <= targetProtein * tolerance;
        });
        if (validAux.length === 0) break;

        var auxWeights = computeWeights(validAux, usageCounts, 'protein', slot);
        var aux = weightedRandom(validAux, auxWeights);

        var auxTarget = remaining * (0.7 + Math.random() * 0.2);
        var auxGramsEstimate = auxTarget / aux.protein * 100;
        var auxGrams = snapToServing(aux, auxGramsEstimate);
        var auxProtein = aux.protein * auxGrams / 100;

        if (totalProtein + auxProtein > targetProtein * tolerance) continue;

        var auxNutrition = calcNutrition(aux, auxGrams);
        items.push({
          name: aux.name, amount: formatAmount(aux, auxGrams), grams: auxGrams,
          protein: auxNutrition.protein, carbs: auxNutrition.carbs, fat: auxNutrition.fat, fiber: auxNutrition.fiber, calories: auxNutrition.calories, cost: auxNutrition.cost
        });
        totalProtein += auxNutrition.protein;
        totalCarbs += auxNutrition.carbs;
        totalFat += auxNutrition.fat;
        totalFiber += auxNutrition.fiber;
        totalCalories += auxNutrition.calories;
        totalCost += auxNutrition.cost;
        selectedNames[aux.name] = true;
      }

      var score = deviationScore(totalProtein, targetProtein);
      if (score < bestScore) {
        bestScore = score;
        bestResult = {
          items: items.slice(),
          totalProtein: +totalProtein.toFixed(1),
          totalCarbs: +totalCarbs.toFixed(1),
          totalFat: +totalFat.toFixed(1),
          totalFiber: +totalFiber.toFixed(1),
          totalCalories: totalCalories,
          totalCost: +totalCost.toFixed(1)
        };
      }

      if (totalProtein >= targetProtein * 0.85 && totalProtein <= targetProtein * tolerance) {
        return bestResult;
      }
    }

    // 兜底裁剪
    if (bestResult && bestResult.totalProtein > targetProtein * tolerance && bestResult.items.length > 1) {
      for (var ri = bestResult.items.length - 1; ri >= 1; ri--) {
        if (!isCarbFoodByName(bestResult.items[ri].name)) {
          var removed = bestResult.items.splice(ri, 1)[0];
          bestResult.totalProtein = +(bestResult.totalProtein - removed.protein).toFixed(1);
          bestResult.totalCarbs = +(bestResult.totalCarbs - removed.carbs).toFixed(1);
          bestResult.totalFat = +(bestResult.totalFat - removed.fat).toFixed(1);
          bestResult.totalFiber = +(bestResult.totalFiber - removed.fiber).toFixed(1);
          bestResult.totalCalories = bestResult.totalCalories - removed.calories;
          bestResult.totalCost = +(bestResult.totalCost - removed.cost).toFixed(1);
          break;
        }
      }
    }

    // 兜底：所有重试失败时，选最小份量的蛋白食物
    if (!bestResult && proteinFoods.length > 0) {
      var fbFood = proteinFoods[0];
      var fbGrams = getMinServing(fbFood);
      var fbNutrition = calcNutrition(fbFood, fbGrams);
      return {
        items: [{ name: fbFood.name, amount: formatAmount(fbFood, fbGrams), grams: fbGrams,
          protein: fbNutrition.protein, carbs: fbNutrition.carbs, fat: fbNutrition.fat, fiber: fbNutrition.fiber, calories: fbNutrition.calories, cost: fbNutrition.cost }],
        totalProtein: fbNutrition.protein, totalCarbs: fbNutrition.carbs,
        totalFat: fbNutrition.fat, totalFiber: fbNutrition.fiber,
        totalCalories: fbNutrition.calories, totalCost: fbNutrition.cost
      };
    }

    return bestResult;
  }

  /** 获取食物的最小实用份量（克） */
  function getMinServing(food) {
    var pu = food.servingUnit;
    if (pu) return pu.g;
    var range = food.serving;
    if (range) return range[0];
    return 50;
  }

  /** 选碳水食材（主食/水果） */
  function selectCarbItems(targetCarbs, foods, usageCounts, slot) {
    var carbFoods = foods.filter(function(f) { return isCarbFood(f); });
    if (carbFoods.length === 0) return { items: [], totalProtein: 0, totalCarbs: 0, totalFat: 0, totalFiber: 0, totalCalories: 0, totalCost: 0 };

    // 小目标（<30g碳水）只用1种食物
    var maxItems = targetCarbs < 30 ? 1 : 2;
    var tolerance = targetCarbs < 30 ? 1.25 : 1.10;

    var maxRetries = 15;
    var bestResult = null;
    var bestScore = Infinity;

    for (var retry = 0; retry < maxRetries; retry++) {
      var weights = computeWeights(carbFoods, usageCounts, 'carbs', slot);
      var items = [];
      var totalProtein = 0, totalCarbs = 0, totalFat = 0, totalFiber = 0, totalCalories = 0, totalCost = 0;

      // 主碳水：目标60-80%
      var mainCarb = weightedRandom(carbFoods, weights);
      var mainTarget = targetCarbs * (0.6 + Math.random() * 0.2);
      var mainGramsEstimate = mainTarget / mainCarb.carbs * 100;
      var mainGrams = snapToServing(mainCarb, mainGramsEstimate);

      // 主碳水超标 tolerance 就跳过
      if (mainCarb.carbs * mainGrams / 100 > targetCarbs * tolerance) continue;
      var mainNutrition = calcNutrition(mainCarb, mainGrams);
      items.push({
        name: mainCarb.name, amount: formatAmount(mainCarb, mainGrams), grams: mainGrams,
        protein: mainNutrition.protein, carbs: mainNutrition.carbs, fat: mainNutrition.fat, fiber: mainNutrition.fiber, calories: mainNutrition.calories, cost: mainNutrition.cost
      });
      totalProtein += mainNutrition.protein;
      totalCarbs += mainNutrition.carbs;
      totalFat += mainNutrition.fat;
      totalFiber += mainNutrition.fiber;
      totalCalories += mainNutrition.calories;
      totalCost += mainNutrition.cost;

      // 补充第二种碳水（如果允许且需要）
      if (maxItems >= 2) {
        var remaining = targetCarbs - totalCarbs;
        if (remaining > targetCarbs * 0.1 && totalCarbs < targetCarbs * 0.95) {
          var auxCarbFoods = carbFoods.filter(function(f) { return f.name !== mainCarb.name; });
          if (auxCarbFoods.length > 0) {
            var auxWeights = computeWeights(auxCarbFoods, usageCounts, 'carbs', slot);
            var auxCarb = weightedRandom(auxCarbFoods, auxWeights);
            var auxGramsEstimate = remaining / auxCarb.carbs * 100;
            var auxGrams = snapToServing(auxCarb, auxGramsEstimate);
            var auxCarbsVal = auxCarb.carbs * auxGrams / 100;

            if (totalCarbs + auxCarbsVal <= targetCarbs * tolerance) {
              var auxNutrition = calcNutrition(auxCarb, auxGrams);
              items.push({
                name: auxCarb.name, amount: formatAmount(auxCarb, auxGrams), grams: auxGrams,
                protein: auxNutrition.protein, carbs: auxNutrition.carbs, fat: auxNutrition.fat, fiber: auxNutrition.fiber, calories: auxNutrition.calories, cost: auxNutrition.cost
              });
              totalProtein += auxNutrition.protein;
              totalCarbs += auxNutrition.carbs;
              totalFat += auxNutrition.fat;
              totalFiber += auxNutrition.fiber;
              totalCalories += auxNutrition.calories;
              totalCost += auxNutrition.cost;
            }
          }
        }
      }

      var score = deviationScore(totalCarbs, targetCarbs);
      if (score < bestScore) {
        bestScore = score;
        bestResult = {
          items: items.slice(),
          totalProtein: +totalProtein.toFixed(1),
          totalCarbs: +totalCarbs.toFixed(1),
          totalFat: +totalFat.toFixed(1),
          totalFiber: +totalFiber.toFixed(1),
          totalCalories: totalCalories,
          totalCost: +totalCost.toFixed(1)
        };
      }

      if (totalCarbs >= targetCarbs * 0.85 && totalCarbs <= targetCarbs * tolerance) {
        return bestResult;
      }
    }

    // 兜底：所有重试失败时，选最小份量的碳水食物
    if (!bestResult && carbFoods.length > 0) {
      var fallbackFood = carbFoods[0];
      var fallbackGrams = getMinServing(fallbackFood);
      var fallbackNutrition = calcNutrition(fallbackFood, fallbackGrams);
      return {
        items: [{ name: fallbackFood.name, amount: formatAmount(fallbackFood, fallbackGrams), grams: fallbackGrams,
          protein: fallbackNutrition.protein, carbs: fallbackNutrition.carbs, fat: fallbackNutrition.fat, fiber: fallbackNutrition.fiber, calories: fallbackNutrition.calories, cost: fallbackNutrition.cost }],
        totalProtein: fallbackNutrition.protein, totalCarbs: fallbackNutrition.carbs,
        totalFat: fallbackNutrition.fat, totalFiber: fallbackNutrition.fiber,
        totalCalories: fallbackNutrition.calories, totalCost: fallbackNutrition.cost
      };
    }

    return bestResult;
  }

  /** 根据品类排除列表过滤食材 */
  function filterByExcludes(foods, excludes) {
    if (!excludes || excludes.length === 0) return foods;
    return foods.filter(function(f) { return excludes.indexOf(f.cat) === -1; });
  }

  var EMPTY_RESULT = { items: [], totalProtein: 0, totalCarbs: 0, totalFat: 0, totalFiber: 0, totalCalories: 0, totalCost: 0 };

  /** 热量超标时从碳水食物中削减份量 */
  function trimCalories(meal, calorieBudget) {
    if (!calorieBudget || meal.totalCalories <= calorieBudget) return meal;
    var excess = meal.totalCalories - calorieBudget;
    // 从后往前找碳水食物削减
    for (var i = meal.items.length - 1; i >= 0 && excess > 0; i--) {
      var item = meal.items[i];
      if (!isCarbFoodByName(item.name)) continue;
      // 该碳水食物能削减的最大热量（保留至少一半）
      var maxCut = Math.floor(item.calories * 0.3);
      if (maxCut <= 0) continue;
      var cut = Math.min(excess, maxCut);
      // 按热量比例削减克数
      var ratio = (item.calories - cut) / item.calories;
      var newGrams = Math.max(10, Math.round(item.grams * ratio));
      // 重算该食物营养
      var food = findFoodByName(item.name);
      if (!food) continue;
      var newNut = calcNutrition(food, newGrams);
      // 更新差值
      var dCal = item.calories - newNut.calories;
      meal.totalCalories -= dCal;
      meal.totalProtein = +(meal.totalProtein - (item.protein - newNut.protein)).toFixed(1);
      meal.totalCarbs = +(meal.totalCarbs - (item.carbs - newNut.carbs)).toFixed(1);
      meal.totalFat = +(meal.totalFat - (item.fat - newNut.fat)).toFixed(1);
      meal.totalFiber = +(meal.totalFiber - (item.fiber - newNut.fiber)).toFixed(1);
      // 更新 item
      item.grams = newGrams;
      item.amount = formatAmount(food, newGrams);
      item.protein = newNut.protein;
      item.carbs = newNut.carbs;
      item.fat = newNut.fat;
      item.fiber = newNut.fiber;
      item.calories = newNut.calories;
      item.cost = newNut.cost;
      excess -= dCal;
    }
    return meal;
  }

  /** 按名称查找食物数据 */
  function findFoodByName(name) {
    var foods = window.PROTEIN_DB.foods;
    for (var i = 0; i < foods.length; i++) {
      if (foods[i].name === name) return foods[i];
    }
    return null;
  }

  /** 为含蛋白菜品的餐附加烹调油 */
  function addCookingOil(meal, oilGrams) {
    if (!oilGrams || oilGrams <= 0) return meal;
    // 无蛋白菜品则不加
    var hasProteinItem = meal.items.some(function(item) { return !isCarbFoodByName(item.name); });
    if (!hasProteinItem) return meal;
    var oilFat = +(oilGrams).toFixed(1);
    var oilCal = Math.round(oilGrams * 9);
    meal.items.push({
      name: '烹调油', amount: oilGrams + 'g', grams: oilGrams,
      protein: 0, carbs: 0, fat: oilFat, fiber: 0, calories: oilCal, cost: 0
    });
    meal.totalFat = +(meal.totalFat + oilFat).toFixed(1);
    meal.totalCalories = meal.totalCalories + oilCal;
    return meal;
  }

  var VEGGIE_CAT = '蔬菜';

  /** 判断食物是否为蔬菜 */
  function isVeggie(food) {
    return food.cat === VEGGIE_CAT;
  }

  /** 为缺少蔬菜的餐补一个蔬菜 */
  function ensureVeggie(meal, foods, usageCounts, needVeggie, slot) {
    if (!needVeggie) return meal;
    var hasVeggie = meal.items.some(function(item) {
      var f = findFoodByName(item.name);
      return f && isVeggie(f);
    });
    if (hasVeggie) return meal;
    var vegFoods = foods.filter(function(f) { return isVeggie(f); });
    if (vegFoods.length === 0) return meal;
    // 按性价比×餐次权重随机选一个蔬菜
    var weights = vegFoods.map(function(f) {
      var perYuan = (f.fiber / f.price) * 1000;
      var mw = slot ? getMealWeight(f, slot) : (f.weight || 5);
      var usedCount = usageCounts[f.name] || 0;
      return Math.max(perYuan, 0.1) * mw * Math.pow(0.3, usedCount);
    });
    var veg = weightedRandom(vegFoods, weights);
    var grams = snapToServing(veg, getRandomServing(veg));
    var nut = calcNutrition(veg, grams);
    meal.items.push({
      name: veg.name, amount: formatAmount(veg, grams), grams: grams,
      protein: nut.protein, carbs: nut.carbs, fat: nut.fat, fiber: nut.fiber,
      calories: nut.calories, cost: nut.cost
    });
    meal.totalProtein = +(meal.totalProtein + nut.protein).toFixed(1);
    meal.totalCarbs = +(meal.totalCarbs + nut.carbs).toFixed(1);
    meal.totalFat = +(meal.totalFat + nut.fat).toFixed(1);
    meal.totalFiber = +(meal.totalFiber + nut.fiber).toFixed(1);
    meal.totalCalories = meal.totalCalories + nut.calories;
    meal.totalCost = +(meal.totalCost + nut.cost).toFixed(1);
    return meal;
  }

  function selectMeal(targetProtein, targetCarbs, foods, usageCounts, oilGrams, calorieBudget, needVeggie, slot) {
    // 预留蔬菜碳水（ensureVeggie 在选碳水之后添加，需提前扣除以免超标）
    var veggieCarbEst = needVeggie ? 5 : 0;
    var effectiveCarbsTarget = Math.max(10, targetCarbs - veggieCarbEst);
    // 先选碳水，以便知道碳水食物贡献了多少蛋白质
    var carbResult = selectCarbItems(effectiveCarbsTarget, foods, usageCounts, slot) || EMPTY_RESULT;
    // 从蛋白目标中扣除碳水食物的蛋白贡献（不低于目标的40%）
    var carbProtein = carbResult.totalProtein;
    var adjustedProteinTarget = Math.max(targetProtein * 0.4, targetProtein - carbProtein);
    var proteinResult = selectProteinItems(adjustedProteinTarget, foods, usageCounts, slot) || EMPTY_RESULT;

    var allItems = proteinResult.items.concat(carbResult.items);
    var meal = {
      items: allItems,
      totalProtein: +(proteinResult.totalProtein + carbResult.totalProtein).toFixed(1),
      totalCarbs: +(proteinResult.totalCarbs + carbResult.totalCarbs).toFixed(1),
      totalFat: +((proteinResult.totalFat || 0) + (carbResult.totalFat || 0)).toFixed(1),
      totalFiber: +((proteinResult.totalFiber || 0) + (carbResult.totalFiber || 0)).toFixed(1),
      totalCalories: (proteinResult.totalCalories || 0) + (carbResult.totalCalories || 0),
      totalCost: +(proteinResult.totalCost + carbResult.totalCost).toFixed(1)
    };
    ensureVeggie(meal, foods, usageCounts, needVeggie, slot);
    addCookingOil(meal, oilGrams || 0);
    // 碳水是热量平衡器，不应被热量预算二次削减
    // 仅在严重超标（>15%）时作为安全网削减碳水
    var safetyBudget = Math.round((calorieBudget || 0) * 1.15);
    trimCalories(meal, safetyBudget);
    return meal;
  }

  function generatePlan(foods, settings, history) {
    var usageCounts = getUsageCounts(history);
    var plan = { meals: {} };
    var excludes = settings.slotExcludes || {};
    var pRatios = settings.proteinRatios || settings.ratios || DEFAULT_SETTINGS.proteinRatios;
    var cRatios = settings.carbsRatios || DEFAULT_SETTINGS.carbsRatios;
    var oil = settings.cookingOil || DEFAULT_SETTINGS.cookingOil;
    var calTarget = settings.caloriesTarget || DEFAULT_SETTINGS.caloriesTarget;
    var vegSlots = settings.veggieSlots || DEFAULT_SETTINGS.veggieSlots;
    // 热量按蛋白+碳水的餐次比例加权平均分配
    var calRatios = pRatios.map(function(p, i) { return (p + cRatios[i]) / 2; });

    MEAL_SLOTS.forEach(function(slot, i) {
      var proteinTarget = settings.proteinTarget * pRatios[i];
      var carbsTarget = (settings.carbsTarget || 250) * cRatios[i];
      var calBudget = Math.round(calTarget * calRatios[i]);
      var needVeggie = vegSlots.indexOf(slot) !== -1;
      var filtered = filterByExcludes(foods, excludes[slot]);
      plan.meals[slot] = selectMeal(proteinTarget, carbsTarget, filtered, usageCounts, oil[slot] || 0, calBudget, needVeggie, slot);
    });

    return plan;
  }

  function regenerateSlot(foods, settings, history, slot) {
    var idx = MEAL_SLOTS.indexOf(slot);
    var pRatios = settings.proteinRatios || settings.ratios || DEFAULT_SETTINGS.proteinRatios;
    var cRatios = settings.carbsRatios || DEFAULT_SETTINGS.carbsRatios;
    var proteinTarget = settings.proteinTarget * pRatios[idx];
    var carbsTarget = (settings.carbsTarget || 250) * cRatios[idx];
    var calTarget = settings.caloriesTarget || DEFAULT_SETTINGS.caloriesTarget;
    var calRatio = (pRatios[idx] + cRatios[idx]) / 2;
    var calBudget = Math.round(calTarget * calRatio);
    var vegSlots = settings.veggieSlots || DEFAULT_SETTINGS.veggieSlots;
    var needVeggie = vegSlots.indexOf(slot) !== -1;
    var excludes = settings.slotExcludes || {};
    var oil = settings.cookingOil || DEFAULT_SETTINGS.cookingOil;
    var filtered = filterByExcludes(foods, excludes[slot]);
    return selectMeal(proteinTarget, carbsTarget, filtered, getUsageCounts(history), oil[slot] || 0, calBudget, needVeggie, slot);
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

  function renderProfileBar(settings) {
    var w = settings.bodyWeight || 70;
    var h = settings.bodyHeight || 170;
    var age = settings.bodyAge || 30;
    var gender = settings.gender === 'female' ? '女' : '男';
    var act = (ACTIVITY_FACTORS[settings.activity || 'moderate'] || ACTIVITY_FACTORS.moderate).label;
    var bmr = Math.round(calcBMR(w, h, age, settings.gender === 'female'));
    var tdee = Math.round(bmr * ((ACTIVITY_FACTORS[settings.activity || 'moderate'] || ACTIVITY_FACTORS.moderate).factor));
    var presetTag = '';
    if (settings.activePreset && PRESETS[settings.activePreset]) {
      var presetColors = { muscle: 'bg-orange-100 text-orange-700', cut: 'bg-blue-100 text-blue-700', balance: 'bg-emerald-100 text-emerald-700' };
      presetTag = ' <span class="inline-block px-1.5 py-0.5 rounded text-xs font-semibold ' +
        (presetColors[settings.activePreset] || 'bg-slate-100 text-slate-600') + '">' +
        PRESETS[settings.activePreset].label + '</span>';
    }
    $('profileBar').innerHTML =
      presetTag + ' <b>' + w + 'kg</b> · ' + h + 'cm · ' + age + '岁 · ' + gender + ' · ' + act +
      ' <span class="text-slate-400">| BMR ' + bmr + ' · TDEE ' + tdee + ' kcal</span>';
  }

  function renderTargetCard(plan, settings) {
    var totalProtein = 0, totalCarbs = 0, totalFat = 0, totalFiber = 0, totalCalories = 0, totalCost = 0;
    MEAL_SLOTS.forEach(function(slot) {
      var meal = plan.meals[slot];
      if (meal) {
        totalProtein += meal.totalProtein;
        totalCarbs += meal.totalCarbs;
        totalFat += meal.totalFat || 0;
        totalFiber += meal.totalFiber || 0;
        totalCalories += meal.totalCalories || 0;
        totalCost += meal.totalCost;
      }
    });
    totalProtein = +totalProtein.toFixed(1);
    totalCarbs = +totalCarbs.toFixed(1);
    totalFat = +totalFat.toFixed(1);
    totalFiber = +totalFiber.toFixed(1);
    totalCalories = Math.round(totalCalories);
    totalCost = +totalCost.toFixed(1);

    $('targetDisplay').textContent = settings.proteinTarget + 'g';
    var pct = Math.min(100, Math.round(totalProtein / settings.proteinTarget * 100));
    $('progressBar').style.width = pct + '%';
    $('progressText').textContent = '已选 ' + totalProtein + 'g / ' + settings.proteinTarget + 'g';

    var carbsTarget = settings.carbsTarget || 250;
    $('carbsTargetDisplay').textContent = carbsTarget + 'g';
    var carbsPct = Math.min(100, Math.round(totalCarbs / carbsTarget * 100));
    $('carbsProgressBar').style.width = carbsPct + '%';
    $('carbsProgressText').textContent = '已选 ' + totalCarbs + 'g / ' + carbsTarget + 'g';

    var caloriesTarget = settings.caloriesTarget || 2000;
    $('caloriesTargetDisplay').textContent = caloriesTarget + 'kcal';
    var calPct = Math.min(100, Math.round(totalCalories / caloriesTarget * 100));
    $('caloriesProgressBar').style.width = calPct + '%';
    $('caloriesProgressText').textContent = '已选 ' + totalCalories + 'kcal / ' + caloriesTarget + 'kcal';

    var fatRef = getFatRef(settings);
    $('fatFiberDisplay').innerHTML = '脂肪 <b>' + totalFat + 'g</b> <span class="text-slate-300">(参考≤' + fatRef + 'g)</span> · 纤维 ' + totalFiber + 'g <span class="text-slate-300">(参考≥25g)</span>';
    $('totalCost').textContent = '预估 ¥' + totalCost;
  }

  function renderMealCard(slot, mealData, settings) {
    var idx = MEAL_SLOTS.indexOf(slot);
    var pRatios = settings.proteinRatios || settings.ratios || DEFAULT_SETTINGS.proteinRatios;
    var cRatios = settings.carbsRatios || DEFAULT_SETTINGS.carbsRatios;
    var proteinTarget = +(settings.proteinTarget * pRatios[idx]).toFixed(0);
    var carbsTarget = +((settings.carbsTarget || 250) * cRatios[idx]).toFixed(0);
    var color = MEAL_COLORS[slot];
    var icon = MEAL_ICONS[slot];
    var label = MEAL_LABELS[slot];

    var itemsHtml = mealData.items.map(function(item) {
      var nutrientParts = [];
      if (item.protein > 0) nutrientParts.push(item.protein + 'g蛋白');
      if (item.carbs > 0) nutrientParts.push(item.carbs + 'g碳水');
      if (item.fat > 0) nutrientParts.push(item.fat + 'g脂');
      if (item.fiber > 0.1) nutrientParts.push(item.fiber + 'g纤');
      if (item.calories > 0 && item.protein === 0 && item.carbs === 0) nutrientParts.push(item.calories + 'kcal');
      return '<div class="flex justify-between text-sm items-center">' +
        '<span class="text-slate-700">' + item.name + ' <span class="text-xs text-slate-400">' + item.amount + '</span></span>' +
        '<span class="text-slate-400 font-data text-xs">' + nutrientParts.join(' ') + '</span>' +
      '</div>';
    }).join('');

    return '<div class="meal-card bg-white border border-slate-200 rounded-xl overflow-hidden" style="border-left:4px solid ' + color + '">' +
      '<div class="p-3">' +
        '<div class="flex justify-between items-center mb-2">' +
          '<div>' +
            '<span class="font-semibold">' + icon + ' ' + label + '</span>' +
            '<span class="text-xs text-slate-400 ml-1.5">蛋白' + proteinTarget + 'g / 碳水' + carbsTarget + 'g</span>' +
          '</div>' +
          '<button class="regenerate-slot text-xs bg-slate-100 px-2.5 py-1 rounded-md active:bg-slate-200" data-slot="' + slot + '">换一套</button>' +
        '</div>' +
        '<div class="space-y-1.5">' + itemsHtml + '</div>' +
        '<div class="border-t border-slate-100 mt-2 pt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 text-xs font-semibold">' +
          '<span class="text-emerald-600">蛋白 ' + mealData.totalProtein + 'g</span>' +
          '<span class="text-amber-600">碳水 ' + mealData.totalCarbs + 'g</span>' +
          '<span class="text-rose-500">脂肪 ' + (mealData.totalFat || 0).toFixed(1) + 'g</span>' +
          '<span class="text-lime-600">纤维 ' + (mealData.totalFiber || 0).toFixed(1) + 'g</span>' +
          '<span class="text-slate-500">¥' + mealData.totalCost + '</span>' +
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

  /** Mifflin-St Jeor BMR 计算 */
  function calcBMR(weight, height, age, isFemale) {
    // 男: 10×体重 + 6.25×身高 - 5×年龄 + 5
    // 女: 10×体重 + 6.25×身高 - 5×年龄 - 161
    return 10 * weight + 6.25 * height - 5 * age + (isFemale ? -161 : 5);
  }

  /** 从设置中提取身体参数 */
  function getBodyParams() {
    var weight = parseFloat($('weightInput').value) || 70;
    var height = parseFloat($('heightInput').value) || 170;
    var age = parseInt($('ageInput').value) || 30;
    var isFemale = $('genderFemale').checked;
    var activity = $('activitySelect').value || 'moderate';
    return { weight: weight, height: height, age: age, isFemale: isFemale, activity: activity };
  }

  /** 根据当前设置匹配最接近的预设，返回脂肪参考值 */
  function getFatRef(settings) {
    var caloriesTarget = settings.caloriesTarget || 2000;
    // 找最接近的预设
    var body = {
      weight: settings.bodyWeight || 70,
      height: settings.bodyHeight || 170,
      age: settings.bodyAge || 30,
      isFemale: settings.gender === 'female',
      activity: settings.activity || 'moderate'
    };
    var bestKey = null, bestDiff = Infinity;
    Object.keys(PRESETS).forEach(function(k) {
      var vals = calcPresetValues(k, body);
      if (!vals) return;
      var diff = Math.abs(vals.caloriesTarget - caloriesTarget);
      if (diff < bestDiff) { bestDiff = diff; bestKey = k; }
    });
    if (bestKey && bestDiff <= 300) {
      return calcPresetValues(bestKey, body).fatRef;
    }
    // 没匹配到预设时按热量估算：脂肪供能占比25-30%
    return Math.round(caloriesTarget * 0.27 / 9);
  }

  // ========== 事件绑定与初始化 ==========
  var currentPlan = null;
  var currentSettings = null;

  function init() {
    currentSettings = loadSettings();
    // 兼容旧设置
    if (!currentSettings.carbsTarget) currentSettings.carbsTarget = DEFAULT_SETTINGS.carbsTarget;
    if (!currentSettings.caloriesTarget) currentSettings.caloriesTarget = DEFAULT_SETTINGS.caloriesTarget;
    if (!currentSettings.bodyWeight) currentSettings.bodyWeight = DEFAULT_SETTINGS.bodyWeight;
    if (!currentSettings.bodyHeight) currentSettings.bodyHeight = DEFAULT_SETTINGS.bodyHeight;
    if (!currentSettings.bodyAge) currentSettings.bodyAge = DEFAULT_SETTINGS.bodyAge;
    if (!currentSettings.gender) currentSettings.gender = DEFAULT_SETTINGS.gender;
    if (!currentSettings.activity) currentSettings.activity = DEFAULT_SETTINGS.activity;
    if (!currentSettings.cookingOil) currentSettings.cookingOil = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.cookingOil));
    if (!currentSettings.veggieSlots) currentSettings.veggieSlots = DEFAULT_SETTINGS.veggieSlots.slice();
    if (!currentSettings.carbsRatios) currentSettings.carbsRatios = DEFAULT_SETTINGS.carbsRatios.slice();
    if (!currentSettings.proteinRatios) {
      // 旧版用 ratios 字段，迁移到 proteinRatios
      currentSettings.proteinRatios = currentSettings.ratios || DEFAULT_SETTINGS.proteinRatios.slice();
    }
    renderDate();
    renderProfileBar(currentSettings);

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
      btn.textContent = '...';
      regenerateSlotAndRender(slot);
    });

    // 设置弹窗
    $('settingsBtn').addEventListener('click', openSettings);
    $('settingsClose').addEventListener('click', closeSettings);
    $('settingsOverlay').addEventListener('click', closeSettings);
    $('settingsSave').addEventListener('click', saveSettingsAndRegenerate);

    // 预设按钮
    document.querySelectorAll('.preset-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        applyPreset(this.getAttribute('data-preset'));
      });
    });
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
    $('carbsInput').value = currentSettings.carbsTarget || 250;
    $('caloriesInput').value = currentSettings.caloriesTarget || 2000;
    $('weightInput').value = currentSettings.bodyWeight || 70;
    $('heightInput').value = currentSettings.bodyHeight || 170;
    $('ageInput').value = currentSettings.bodyAge || 30;
    if (currentSettings.gender === 'female') {
      $('genderFemale').checked = true;
    } else {
      $('genderMale').checked = true;
    }
    $('activitySelect').value = currentSettings.activity || 'moderate';
    highlightPreset();
    renderRatioSliders('protein', currentSettings.proteinRatios);
    renderRatioSliders('carbs', currentSettings.carbsRatios);
    renderExcludeChips();
    renderCookingOil();
    $('settingsModal').classList.remove('hidden');
  }

  function closeSettings() {
    $('settingsModal').classList.add('hidden');
  }

  function highlightPreset() {
    var body = getBodyParams();
    var btns = document.querySelectorAll('.preset-btn');
    btns.forEach(function(btn) {
      var key = btn.getAttribute('data-preset');
      var vals = calcPresetValues(key, body);
      var active = vals &&
        parseInt($('proteinInput').value) === vals.proteinTarget &&
        parseInt($('carbsInput').value) === vals.carbsTarget &&
        parseInt($('caloriesInput').value) === vals.caloriesTarget;
      btn.className = 'preset-btn text-sm px-4 py-2 rounded-lg border-2 font-medium transition-colors ' +
        (active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 active:bg-slate-50');
    });
  }

  function calcPresetValues(key, body) {
    var p = PRESETS[key];
    if (!p) return null;
    var bmr = calcBMR(body.weight, body.height, body.age, body.isFemale);
    var actFactor = (ACTIVITY_FACTORS[body.activity] || ACTIVITY_FACTORS.moderate).factor;
    var tdee = Math.round(bmr * actFactor / 50) * 50;
    var caloriesTarget = Math.max(1200, tdee + p.calOffset);
    caloriesTarget = Math.round(caloriesTarget / 50) * 50;
    // 1. 蛋白 = 体重 × g/kg
    var proteinTarget = Math.round(body.weight * p.proteinPerKg / 5) * 5;
    // 2. 脂肪 = 体重 × g/kg
    var fatTarget = Math.round(body.weight * p.fatPerKg);
    // 3. 碳水 = (总热量 - 蛋白热量 - 脂肪热量) / 4
    var carbsTarget = Math.max(50, Math.round((caloriesTarget - proteinTarget * 4 - fatTarget * 9) / 4 / 10) * 10);
    return { proteinTarget: proteinTarget, carbsTarget: carbsTarget, caloriesTarget: caloriesTarget, fatRef: fatTarget };
  }

  function applyPreset(key) {
    var body = getBodyParams();
    var vals = calcPresetValues(key, body);
    if (!vals) return;
    $('proteinInput').value = vals.proteinTarget;
    $('carbsInput').value = vals.carbsTarget;
    $('caloriesInput').value = vals.caloriesTarget;
    // 直接保存并重新生成
    currentSettings.proteinTarget = vals.proteinTarget;
    currentSettings.carbsTarget = vals.carbsTarget;
    currentSettings.caloriesTarget = vals.caloriesTarget;
    currentSettings.bodyWeight = body.weight;
    currentSettings.bodyHeight = body.height;
    currentSettings.bodyAge = body.age;
    currentSettings.gender = body.isFemale ? 'female' : 'male';
    currentSettings.activity = body.activity;
    currentSettings.activePreset = key;
    saveSettings(currentSettings);
    closeSettings();
    renderProfileBar(currentSettings);
    generateAndRender();
  }

  function renderRatioSliders(group, ratios) {
    var container = group === 'protein' ? $('proteinRatioSliders') : $('carbsRatioSliders');
    var sumEl = group === 'protein' ? $('proteinRatioSum') : $('carbsRatioSum');
    var labels = ['早餐', '午餐', '晚餐', '加餐'];
    var html = '';
    ratios.forEach(function(r, i) {
      var pct = Math.round(r * 100);
      html += '<div class="flex items-center gap-3">' +
        '<span class="text-sm text-slate-600 w-10">' + labels[i] + '</span>' +
        '<input type="range" class="flex-1 ratio-slider" min="5" max="60" value="' + pct + '" data-index="' + i + '" data-group="' + group + '">' +
        '<span class="text-sm font-data text-slate-700 w-10 text-right ratio-display">' + pct + '%</span>' +
      '</div>';
    });
    container.innerHTML = html;

    var sliders = container.querySelectorAll('.ratio-slider');
    sliders.forEach(function(slider) {
      slider.addEventListener('input', handleRatioChange);
    });
    updateRatioSum(group, ratios);
  }

  function handleRatioChange(e) {
    var idx = parseInt(e.target.getAttribute('data-index'));
    var group = e.target.getAttribute('data-group');
    var newVal = parseInt(e.target.value) / 100;
    var ratiosKey = group === 'protein' ? 'proteinRatios' : 'carbsRatios';
    var ratios = currentSettings[ratiosKey].slice();

    var remaining = 1 - newVal;
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

    var container = group === 'protein' ? $('proteinRatioSliders') : $('carbsRatioSliders');
    var sliders = container.querySelectorAll('.ratio-slider');
    var displays = container.querySelectorAll('.ratio-display');
    ratios.forEach(function(r, i) {
      var pct = Math.round(r * 100);
      sliders[i].value = pct;
      displays[i].textContent = pct + '%';
    });

    currentSettings[ratiosKey] = ratios;
    updateRatioSum(group, ratios);
  }

  function updateRatioSum(group, ratios) {
    var sumEl = group === 'protein' ? $('proteinRatioSum') : $('carbsRatioSum');
    var sum = ratios.reduce(function(a, b) { return a + b; }, 0);
    var pct = Math.round(sum * 100);
    sumEl.textContent = '合计 ' + pct + '%';
    sumEl.className = 'text-xs mt-1 text-right ' +
      (pct === 100 ? 'text-slate-400' : 'text-red-500 font-semibold');
  }

  function renderExcludeChips() {
    var categories = window.PROTEIN_DB.categories;
    var excludes = currentSettings.slotExcludes || {};
    var labels = { breakfast: '🌅 早餐', lunch: '☀️ 午餐', dinner: '🌙 晚餐', snack: '🍪 加餐' };
    var html = '<p class="text-sm font-medium text-slate-700 mb-2">品类限制 <span class="text-xs text-slate-400 font-normal">点击排除/恢复</span></p>';

    MEAL_SLOTS.forEach(function(slot) {
      var slotEx = excludes[slot] || [];
      html += '<div class="flex items-center gap-2 mb-2"><span class="text-xs text-slate-500 w-14 shrink-0">' + labels[slot] + '</span><div class="flex flex-wrap gap-1.5">';
      categories.forEach(function(cat) {
        var excluded = slotEx.indexOf(cat) !== -1;
        html += '<button type="button" class="exclude-chip text-xs px-2 py-0.5 rounded-full border ' +
          (excluded ? 'bg-red-50 border-red-200 text-red-500 line-through' : 'bg-slate-50 border-slate-200 text-slate-600') +
          '" data-slot="' + slot + '" data-cat="' + cat + '">' + cat + '</button>';
      });
      html += '</div></div>';
    });

    $('excludeSection').innerHTML = html;

    var chips = document.querySelectorAll('.exclude-chip');
    chips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        var slot = this.getAttribute('data-slot');
        var cat = this.getAttribute('data-cat');
        if (!currentSettings.slotExcludes) currentSettings.slotExcludes = {};
        if (!currentSettings.slotExcludes[slot]) currentSettings.slotExcludes[slot] = [];
        var arr = currentSettings.slotExcludes[slot];
        var idx = arr.indexOf(cat);
        if (idx === -1) { arr.push(cat); } else { arr.splice(idx, 1); }
        renderExcludeChips();
      });
    });
  }

  function renderCookingOil() {
    var oil = currentSettings.cookingOil || DEFAULT_SETTINGS.cookingOil;
    var labels = { breakfast: '🌅 早餐', lunch: '☀️ 午餐', dinner: '🌙 晚餐', snack: '🍪 加餐' };
    var html = '<p class="text-sm font-medium text-slate-700 mb-2">烹调油 <span class="text-xs text-slate-400 font-normal">每餐附加克数</span></p>';

    MEAL_SLOTS.forEach(function(slot) {
      var val = oil[slot] || 0;
      html += '<div class="flex items-center gap-2 mb-1.5">' +
        '<span class="text-xs text-slate-500 w-14 shrink-0">' + labels[slot] + '</span>' +
        '<input type="range" class="flex-1 oil-slider" min="0" max="20" step="1" value="' + val + '" data-slot="' + slot + '">' +
        '<span class="text-sm font-data text-slate-700 w-10 text-right oil-display">' + val + 'g</span>' +
      '</div>';
    });

    $('oilSection').innerHTML = html;

    document.querySelectorAll('.oil-slider').forEach(function(slider) {
      slider.addEventListener('input', function() {
        var slot = this.getAttribute('data-slot');
        var val = parseInt(this.value);
        if (!currentSettings.cookingOil) currentSettings.cookingOil = {};
        currentSettings.cookingOil[slot] = val;
        this.nextElementSibling.textContent = val + 'g';
      });
    });
  }

  function saveSettingsAndRegenerate() {
    var target = parseInt($('proteinInput').value);
    if (target >= 50 && target <= 300) {
      currentSettings.proteinTarget = target;
    }
    var carbsTarget = parseInt($('carbsInput').value);
    if (carbsTarget >= 50 && carbsTarget <= 500) {
      currentSettings.carbsTarget = carbsTarget;
    }
    var caloriesTarget = parseInt($('caloriesInput').value);
    if (caloriesTarget >= 1000 && caloriesTarget <= 5000) {
      currentSettings.caloriesTarget = caloriesTarget;
    }
    var bodyWeight = parseFloat($('weightInput').value);
    if (bodyWeight >= 30 && bodyWeight <= 200) {
      currentSettings.bodyWeight = bodyWeight;
    }
    currentSettings.bodyHeight = parseFloat($('heightInput').value) || 170;
    currentSettings.bodyAge = parseInt($('ageInput').value) || 30;
    currentSettings.gender = $('genderFemale').checked ? 'female' : 'male';
    currentSettings.activity = $('activitySelect').value || 'moderate';
    // 检测是否仍匹配某预设
    var body = { weight: currentSettings.bodyWeight, height: currentSettings.bodyHeight, age: currentSettings.bodyAge, isFemale: currentSettings.gender === 'female', activity: currentSettings.activity };
    var matched = null;
    Object.keys(PRESETS).forEach(function(k) {
      var v = calcPresetValues(k, body);
      if (v && v.proteinTarget === currentSettings.proteinTarget && v.carbsTarget === currentSettings.carbsTarget && v.caloriesTarget === currentSettings.caloriesTarget) {
        matched = k;
      }
    });
    currentSettings.activePreset = matched;
    saveSettings(currentSettings);
    closeSettings();
    renderProfileBar(currentSettings);
    generateAndRender();
  }

  // ========== 启动 ==========
  init();

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
    selectProteinItems: selectProteinItems,
    selectCarbItems: selectCarbItems,
    generatePlan: generatePlan,
    regenerateSlot: regenerateSlot,
    renderDate: renderDate,
    renderAllMeals: renderAllMeals,
    renderTargetCard: renderTargetCard,
    MEAL_SLOTS: MEAL_SLOTS,
    MEAL_LABELS: MEAL_LABELS,
    MEAL_ICONS: MEAL_ICONS,
    MEAL_COLORS: MEAL_COLORS,
    CARB_CATEGORIES: CARB_CATEGORIES,
    DEFAULT_SETTINGS: DEFAULT_SETTINGS
  };

})();
