/**
 * 食品数据库 - 默认数据（已按2026年4月日常零售价格修正，含扩展品类）
 *
 * 格式说明：
 *   categories: 品类名称数组
 *   foods: 食品数组
 *     - name:    食品名称
 *     - cat:     所属品类（须在 categories 中）
 *     - protein: 每100g蛋白质含量(g)
 *     - carbs:   每100g碳水化合物含量(g)
 *     - fat:     每100g脂肪含量(g)
 *     - fiber:   每100g膳食纤维含量(g)
 *     - price:   每公斤价格(元/kg)，液体为每升
 *     - weight:  推荐权重 1-10，日常常吃的权重高（默认5）
 *     - note:    备注（含市场参考依据）
 *     - unit:    单位（可选，默认"g"，液体填"ml"）
 *     - serving: 食用量范围 [最小克数, 最大克数]（可选，默认 [50, 150]）
 *     - servingUnit: 实用单位 { unit: "个", g: 50, max: 2 }（可选，无则显示克数）
 *     - custom:  是否为用户自定义（true/false）
 *
 * 可直接编辑此文件，保存后刷新页面即可生效。
 * 也可通过页面内"导入/导出"功能管理数据。
 */
window.PROTEIN_DB = {
  "version": "2026-04-16",
  "categories": [
    "鲜肉",
    "成品肉",
    "蛋奶",
    "豆类",
    "蛋白粉",
    "干果",
    "主食",
    "蔬菜",
    "水果"
  ],
  "foods": [
    // --- 鲜肉类 ---
    { "name":"鸡胸肉(冷冻)",       "cat":"鲜肉",   "protein":24,  "carbs":0,    "fat":2,     "fiber":0,    "price":22,   "weight":9,  "note":"圣农/正大，日常约11元/斤" },
    { "name":"鸡腿肉(去皮)",       "cat":"鲜肉",   "protein":20,  "carbs":0,    "fat":5,     "fiber":0,    "price":18,   "weight":7,  "note":"去皮鸡腿肉，约9元/斤" },
    { "name":"猪瘦肉",             "cat":"鲜肉",   "protein":20,  "carbs":1,    "fat":6,     "fiber":0,    "price":26,   "weight":8,  "note":"精瘦肉，日常约13元/斤" },
    { "name":"猪里脊",             "cat":"鲜肉",   "protein":21,  "carbs":1,    "fat":4,     "fiber":0,    "price":32,   "weight":7,  "note":"猪里脊，嫩瘦，约16元/斤" },
    { "name":"牛腩",               "cat":"鲜肉",   "protein":19,  "carbs":1,    "fat":12,    "fiber":0,    "price":80,   "weight":4,  "note":"牛腩，炖煮用，约40元/斤" },
    { "name":"牛腱子",             "cat":"鲜肉",   "protein":22,  "carbs":1,    "fat":3,     "fiber":0,    "price":100,  "weight":3,  "note":"牛腱子，卤制用，约50元/斤" },
    { "name":"鱼肉(巴沙/草鱼)",     "cat":"鲜肉",   "protein":18,  "carbs":0,    "fat":3,     "fiber":0,    "price":24,   "weight":6,  "note":"冷冻巴沙鱼柳/鲜活草鱼，约12元/斤" },
    { "name":"鲈鱼(鲜活)",         "cat":"鲜肉",   "protein":19,  "carbs":0,    "fat":3,     "fiber":0,    "price":50,   "weight":4,  "note":"鲜活鲈鱼，清蒸，约25元/斤" },
    { "name":"虾仁(冷冻)",         "cat":"鲜肉",   "protein":19,  "carbs":0,    "fat":1,     "fiber":0,    "price":60,   "weight":5,  "note":"去壳冷冻虾仁，约30元/斤" },
    { "name":"金枪鱼罐头(水浸)",   "cat":"鲜肉",   "protein":25,  "carbs":0,    "fat":1,     "fiber":0,    "price":70,   "weight":3,  "note":"水浸金枪鱼，高蛋白低脂" },
    { "name":"沙丁鱼罐头",         "cat":"鲜肉",   "protein":22,  "carbs":0,    "fat":10,    "fiber":0,    "price":45,   "weight":2,  "note":"高蛋白高钙，即食" },
    { "name":"三文鱼(冷冻)",       "cat":"鲜肉",   "protein":20,  "carbs":0,    "fat":13,    "fiber":0,    "price":80,   "weight":2,  "note":"冷冻三文鱼，富含Omega-3" },
    { "name":"对虾(冷冻)",         "cat":"鲜肉",   "protein":18,  "carbs":1,    "fat":1,     "fiber":0,    "price":50,   "weight":3,  "note":"冷冻对虾，低脂高蛋白" },
    { "name":"扇贝肉(冷冻)",       "cat":"鲜肉",   "protein":11,  "carbs":2,    "fat":1,     "fiber":0,    "price":30,   "weight":2,  "note":"冷冻扇贝肉，低脂海鲜" },
    { "name":"鸭肉(冷冻)",         "cat":"鲜肉",   "protein":17,  "carbs":0,    "fat":8,     "fiber":0,    "price":20,   "weight":4,  "note":"白条鸭，常见禽肉" },
    { "name":"鸡翅中(冷冻)",       "cat":"鲜肉",   "protein":18,  "carbs":0,    "fat":12,    "fiber":0,    "price":30,   "weight":5,  "note":"冷冻鸡翅中，约15元/斤" },
    { "name":"牛肝",               "cat":"鲜肉",   "protein":20,  "carbs":4,    "fat":4,     "fiber":0,    "price":30,   "weight":2,  "note":"牛肝，富含铁和维A，约15元/斤" },
    // --- 成品肉类 ---
    { "name":"即食鸡胸肉",         "cat":"成品肉", "protein":22,  "carbs":2,    "fat":3,     "fiber":0,    "price":40,   "weight":7,  "note":"袋鼠先生/三只松鼠，约20元/斤" },
    { "name":"卤牛腱子(即食)",     "cat":"成品肉", "protein":28,  "carbs":1,    "fat":4,     "fiber":0,    "price":160,  "weight":3,  "note":"京东京造等，约80元/斤" },
    { "name":"牛肉干",             "cat":"成品肉", "protein":45,  "carbs":10,   "fat":8,     "fiber":0,    "price":200,  "weight":2,  "note":"风干牛肉干，高蛋白零食，约100元/斤", "serving": [20, 50] },
    { "name":"火腿肠(鸡肉)",       "cat":"成品肉", "protein":12,  "carbs":5,    "fat":10,    "fiber":0,    "price":24,   "weight":4,  "note":"鸡肉火腿肠，方便即食" },
    // --- 蛋奶类 ---
    { "name":"鸡蛋",               "cat":"蛋奶",   "protein":13,  "carbs":1,    "fat":10,    "fiber":0,    "price":9,    "weight":10, "note":"洋鸡蛋，日常约4.5元/斤", "serving": [1, 2], "servingUnit": { "unit": "个", "g": 50, "max": 2 } },
    { "name":"鹌鹑蛋",             "cat":"蛋奶",   "protein":13,  "carbs":1,    "fat":11,    "fiber":0,    "price":24,   "weight":3,  "note":"鹌鹑蛋，约12元/斤，营养丰富", "serving": [3, 6] },
    { "name":"纯牛奶(普通)",       "cat":"蛋奶",   "protein":3.2, "carbs":5,    "fat":3.5,   "fiber":0,    "price":11,   "weight":9,  "note":"伊利/蒙牛，日常约11元/L", "unit":"ml", "serving": [250, 300], "servingUnit": { "unit": "盒", "g": 250, "max": 1 } },
    { "name":"纯牛奶(高端)",       "cat":"蛋奶",   "protein":3.6, "carbs":5,    "fat":4,     "fiber":0,    "price":20,   "weight":4,  "note":"特仑苏/金典，日常约20元/L", "unit":"ml", "serving": [250, 300], "servingUnit": { "unit": "盒", "g": 250, "max": 1 } },
    { "name":"希腊酸奶",           "cat":"蛋奶",   "protein":8,   "carbs":5,    "fat":5,     "fiber":0,    "price":64,   "weight":3,  "note":"高蛋白浓缩酸奶，约64元/kg", "serving": [150, 200], "servingUnit": { "unit": "盒", "g": 150, "max": 1 } },
    { "name":"奶酪(硬质)",         "cat":"蛋奶",   "protein":25,  "carbs":1,    "fat":30,    "fiber":0,    "price":150,  "weight":2,  "note":"硬质奶酪，蛋白密度高但脂肪高", "serving": [30, 50], "servingUnit": { "unit": "片", "g": 30, "max": 2 } },
    // --- 豆类 ---
    { "name":"干黄豆",             "cat":"豆类",   "protein":35,  "carbs":20,   "fat":16,    "fiber":15,   "price":9,    "weight":3,  "note":"散装/袋装，日常约4.5元/斤", "serving": [30, 50], "servingUnit": { "unit": "把", "g": 30, "max": 1 } },
    { "name":"腐竹(干)",           "cat":"豆类",   "protein":45,  "carbs":15,   "fat":22,    "fiber":1,    "price":36,   "weight":5,  "note":"干腐竹，日常约18元/斤", "serving": [30, 50], "servingUnit": { "unit": "根", "g": 30, "max": 2 } },
    { "name":"北豆腐",             "cat":"豆类",   "protein":10,  "carbs":3,    "fat":5,     "fiber":0.5,  "price":7,    "weight":7,  "note":"老豆腐，日常约3.5元/斤", "serving": [100, 150], "servingUnit": { "unit": "块", "g": 150, "max": 1 } },
    { "name":"南豆腐",             "cat":"豆类",   "protein":6,   "carbs":3,    "fat":3,     "fiber":0.4,  "price":6,    "weight":4,  "note":"嫩豆腐，口感细嫩", "serving": [100, 200], "servingUnit": { "unit": "块", "g": 150, "max": 1 } },
    { "name":"豆腐干",             "cat":"豆类",   "protein":17,  "carbs":5,    "fat":8,     "fiber":1,    "price":14,   "weight":6,  "note":"香干/白豆干，约7元/斤", "serving": [50, 100], "servingUnit": { "unit": "块", "g": 50, "max": 2 } },
    { "name":"豆腐丝",             "cat":"豆类",   "protein":22,  "carbs":5,    "fat":10,    "fiber":1,    "price":16,   "weight":5,  "note":"干豆腐丝，凉拌炒菜均可", "serving": [30, 80], "servingUnit": { "unit": "把", "g": 50, "max": 1 } },
    { "name":"豆浆",               "cat":"豆类",   "protein":2.5, "carbs":2,    "fat":1.5,   "fiber":0.5,  "price":8,    "weight":7,  "note":"浓豆浆，约8元/L", "unit":"ml", "serving": [250, 300], "servingUnit": { "unit": "杯", "g": 300, "max": 1 } },
    { "name":"黑豆(干)",           "cat":"豆类",   "protein":36,  "carbs":20,   "fat":15,    "fiber":10,   "price":12,   "weight":2,  "note":"黑豆，蛋白质含量略高于黄豆", "serving": [30, 50], "servingUnit": { "unit": "把", "g": 30, "max": 1 } },
    { "name":"毛豆(鲜)",           "cat":"豆类",   "protein":13,  "carbs":7,    "fat":5,     "fiber":4,    "price":12,   "weight":4,  "note":"鲜毛豆，约6元/斤，高蛋白蔬菜", "serving": [50, 100] },
    { "name":"天贝",               "cat":"豆类",   "protein":19,  "carbs":5,    "fat":8,     "fiber":3,    "price":50,   "weight":1,  "note":"发酵大豆制品，易消化富含益生菌", "serving": [80, 120], "servingUnit": { "unit": "块", "g": 100, "max": 1 } },
    { "name":"藜麦(干)",           "cat":"豆类",   "protein":15,  "carbs":58,   "fat":6,     "fiber":7,    "price":30,   "weight":3,  "note":"完全蛋白谷物，可替代主食", "serving": [50, 80], "servingUnit": { "unit": "份", "g": 50, "max": 1 } },
    // --- 蛋白粉类 ---
    { "name":"大豆分离蛋白粉",     "cat":"蛋白粉", "protein":85,  "carbs":0,    "fat":1,     "fiber":0,    "price":140,  "weight":3,  "note":"零售装，日常约70元/斤", "serving": [25, 35], "servingUnit": { "unit": "勺", "g": 20, "max": 2 } },
    { "name":"乳清蛋白粉(浓缩)",   "cat":"蛋白粉", "protein":78,  "carbs":5,    "fat":5,     "fiber":0,    "price":240,  "weight":6,  "note":"Myprotein等，日常约120元/斤", "serving": [25, 35], "servingUnit": { "unit": "勺", "g": 20, "max": 2 } },
    { "name":"乳清蛋白粉(分离)",   "cat":"蛋白粉", "protein":88,  "carbs":1,    "fat":1,     "fiber":0,    "price":360,  "weight":5,  "note":"ON/康比特，日常约180元/斤", "serving": [25, 35], "servingUnit": { "unit": "勺", "g": 20, "max": 2 } },
    // --- 干果类 ---
    { "name":"花生(带壳生)",       "cat":"干果",   "protein":25,  "carbs":15,   "fat":45,    "fiber":8,    "price":16,   "weight":6,  "note":"带壳生花生，约8元/斤", "serving": [25, 40], "servingUnit": { "unit": "把", "g": 30, "max": 1 } },
    { "name":"南瓜子(带壳)",       "cat":"干果",   "protein":33,  "carbs":5,    "fat":45,    "fiber":6,    "price":30,   "weight":4,  "note":"带壳南瓜子，约15元/斤", "serving": [25, 40], "servingUnit": { "unit": "把", "g": 30, "max": 1 } },
    { "name":"杏仁(巴旦木)",       "cat":"干果",   "protein":21,  "carbs":20,   "fat":50,    "fiber":10,   "price":80,   "weight":4,  "note":"巴旦木仁，约40元/斤", "serving": [25, 40], "servingUnit": { "unit": "把", "g": 25, "max": 1 } },
    { "name":"混合坚果",           "cat":"干果",   "protein":20,  "carbs":18,   "fat":50,    "fiber":8,    "price":90,   "weight":5,  "note":"每日坚果类，约45元/斤", "serving": [25, 40], "servingUnit": { "unit": "包", "g": 25, "max": 1 } },
    { "name":"花生酱",             "cat":"干果",   "protein":25,  "carbs":15,   "fat":50,    "fiber":6,    "price":30,   "weight":4,  "note":"花生酱，涂抹方便但脂肪高", "serving": [20, 30], "servingUnit": { "unit": "勺", "g": 20, "max": 2 } },
    { "name":"核桃(干)",           "cat":"干果",   "protein":15,  "carbs":10,   "fat":60,    "fiber":7,    "price":50,   "weight":5,  "note":"核桃仁，约25元/斤，富含Omega-3", "serving": [20, 40], "servingUnit": { "unit": "把", "g": 25, "max": 1 } },
    { "name":"腰果",               "cat":"干果",   "protein":18,  "carbs":30,   "fat":45,    "fiber":3,    "price":80,   "weight":3,  "note":"腰果仁，约40元/斤", "serving": [20, 40], "servingUnit": { "unit": "把", "g": 25, "max": 1 } },
    { "name":"开心果",             "cat":"干果",   "protein":20,  "carbs":25,   "fat":45,    "fiber":8,    "price":100,  "weight":2,  "note":"开心果仁，约50元/斤", "serving": [20, 40], "servingUnit": { "unit": "把", "g": 25, "max": 1 } },
    // --- 主食类 ---
    { "name":"白米饭",             "cat":"主食",   "protein":2.6, "carbs":25,   "fat":0.3,   "fiber":0.4,  "price":6,    "weight":10, "note":"熟米饭，约3元/斤（含米成本）", "serving": [150, 300], "servingUnit": { "unit": "碗", "g": 200, "max": 2 } },
    { "name":"面条(熟)",           "cat":"主食",   "protein":3,   "carbs":25,   "fat":0.5,   "fiber":0.8,  "price":8,    "weight":9,  "note":"熟面条，约4元/斤", "serving": [150, 300], "servingUnit": { "unit": "碗", "g": 200, "max": 2 } },
    { "name":"红薯",               "cat":"主食",   "protein":1.1, "carbs":20,   "fat":0.2,   "fiber":3,    "price":6,    "weight":7,  "note":"红薯，约3元/斤，富含膳食纤维", "serving": [100, 250], "servingUnit": { "unit": "个", "g": 150, "max": 2 } },
    { "name":"土豆",               "cat":"主食",   "protein":2,   "carbs":17,   "fat":0.1,   "fiber":1.5,  "price":5,    "weight":8,  "note":"土豆，约2.5元/斤", "serving": [100, 200], "servingUnit": { "unit": "个", "g": 150, "max": 2 } },
    { "name":"燕麦(干)",           "cat":"主食",   "protein":13,  "carbs":62,   "fat":7,     "fiber":10,   "price":18,   "weight":7,  "note":"即食燕麦片，约9元/斤", "serving": [30, 60], "servingUnit": { "unit": "份", "g": 40, "max": 2 } },
    { "name":"全麦面包",           "cat":"主食",   "protein":10,  "carbs":42,   "fat":3,     "fiber":7,    "price":30,   "weight":6,  "note":"全麦面包，约15元/斤", "serving": [50, 100], "servingUnit": { "unit": "片", "g": 40, "max": 3 } },
    { "name":"馒头",               "cat":"主食",   "protein":7,   "carbs":45,   "fat":1,     "fiber":1.5,  "price":10,   "weight":8,  "note":"白面馒头，约5元/斤", "serving": [50, 150], "servingUnit": { "unit": "个", "g": 75, "max": 2 } },
    { "name":"玉米",               "cat":"主食",   "protein":4,   "carbs":19,   "fat":1.2,   "fiber":2.5,  "price":6,    "weight":7,  "note":"鲜玉米，约3元/根", "serving": [100, 200], "servingUnit": { "unit": "根", "g": 200, "max": 1 } },
    { "name":"小米粥(熟)",         "cat":"主食",   "protein":1.5, "carbs":8.4,  "fat":0.7,   "fiber":0.2,  "price":4,    "weight":5,  "note":"小米粥，约2元/斤", "serving": [200, 400], "servingUnit": { "unit": "碗", "g": 250, "max": 2 } },
    { "name":"南瓜",               "cat":"主食",   "protein":0.7, "carbs":5,    "fat":0.1,   "fiber":1.7,  "price":4,    "weight":4,  "note":"老南瓜，约2元/斤，β-胡萝卜素", "serving": [100, 250], "servingUnit": { "unit": "块", "g": 200, "max": 1 } },
    { "name":"山药",               "cat":"主食",   "protein":1.9, "carbs":12,   "fat":0.1,   "fiber":1,    "price":8,    "weight":4,  "note":"铁棍山药，约4元/斤，健脾养胃", "serving": [100, 200], "servingUnit": { "unit": "段", "g": 100, "max": 2 } },
    { "name":"芋头",               "cat":"主食",   "protein":2.2, "carbs":17,   "fat":0.2,   "fiber":1,    "price":7,    "weight":3,  "note":"芋头，约3.5元/斤", "serving": [100, 200], "servingUnit": { "unit": "个", "g": 100, "max": 2 } },
    { "name":"紫薯",               "cat":"主食",   "protein":1.5, "carbs":18,   "fat":0.2,   "fiber":2.5,  "price":8,    "weight":5,  "note":"紫薯，约4元/斤，花青素丰富", "serving": [100, 200], "servingUnit": { "unit": "个", "g": 100, "max": 2 } },
    // --- 蔬菜类 ---
    { "name":"西兰花",   "cat":"蔬菜", "protein":4.1, "carbs":4.3, "fat":0.6, "fiber":3.5, "price":10, "weight":8,  "note":"西兰花，约5元/斤，高纤维蔬菜之王", "serving": [100, 300], "servingUnit": { "unit": "份", "g": 150, "max": 2 } },
    { "name":"菠菜",     "cat":"蔬菜", "protein":2.9, "carbs":3.6, "fat":0.4, "fiber":2.2, "price":8,  "weight":7,  "note":"菠菜，约4元/斤，铁和叶酸丰富", "serving": [80, 200], "servingUnit": { "unit": "把", "g": 100, "max": 2 } },
    { "name":"西红柿",   "cat":"蔬菜", "protein":0.9, "carbs":3.9, "fat":0.2, "fiber":1.2, "price":6,  "weight":9,  "note":"西红柿，约3元/斤，番茄红素", "serving": [100, 250], "servingUnit": { "unit": "个", "g": 150, "max": 2 } },
    { "name":"胡萝卜",   "cat":"蔬菜", "protein":1.0, "carbs":8.8, "fat":0.2, "fiber":2.8, "price":4,  "weight":7,  "note":"胡萝卜，约2元/斤，β-胡萝卜素", "serving": [50, 150], "servingUnit": { "unit": "根", "g": 100, "max": 1 } },
    { "name":"青椒",     "cat":"蔬菜", "protein":1.0, "carbs":5.4, "fat":0.2, "fiber":1.8, "price":8,  "weight":7,  "note":"青椒，约4元/斤，维C丰富", "serving": [50, 150], "servingUnit": { "unit": "个", "g": 100, "max": 2 } },
    { "name":"黄瓜",     "cat":"蔬菜", "protein":0.7, "carbs":2.9, "fat":0.2, "fiber":0.9, "price":5,  "weight":8,  "note":"黄瓜，约2.5元/斤，低热量", "serving": [100, 250], "servingUnit": { "unit": "根", "g": 200, "max": 1 } },
    { "name":"大白菜",   "cat":"蔬菜", "protein":1.5, "carbs":3.2, "fat":0.2, "fiber":0.8, "price":3,  "weight":9,  "note":"大白菜，约1.5元/斤，国民蔬菜", "serving": [100, 300], "servingUnit": { "unit": "叶", "g": 100, "max": 3 } },
    { "name":"生菜",     "cat":"蔬菜", "protein":1.3, "carbs":2.1, "fat":0.3, "fiber":0.7, "price":6,  "weight":7,  "note":"生菜，约3元/斤，低热量沙拉首选", "serving": [50, 150], "servingUnit": { "unit": "把", "g": 80, "max": 2 } },
    { "name":"芹菜",     "cat":"蔬菜", "protein":1.2, "carbs":4.6, "fat":0.2, "fiber":2.6, "price":6,  "weight":5,  "note":"芹菜，约3元/斤，高纤维降压", "serving": [80, 200], "servingUnit": { "unit": "根", "g": 100, "max": 2 } },
    { "name":"洋葱",     "cat":"蔬菜", "protein":1.1, "carbs":9,   "fat":0.2, "fiber":1.7, "price":5,  "weight":7,  "note":"洋葱，约2.5元/斤，调味配菜", "serving": [50, 150], "servingUnit": { "unit": "个", "g": 100, "max": 1 } },
    { "name":"茄子",     "cat":"蔬菜", "protein":1.1, "carbs":4.9, "fat":0.2, "fiber":1.3, "price":5,  "weight":5,  "note":"茄子，约2.5元/斤", "serving": [100, 250], "servingUnit": { "unit": "根", "g": 150, "max": 1 } },
    { "name":"豆角",     "cat":"蔬菜", "protein":2.5, "carbs":6.7, "fat":0.2, "fiber":1.8, "price":7,  "weight":6,  "note":"四季豆/长豆角，约3.5元/斤", "serving": [80, 200], "servingUnit": { "unit": "把", "g": 100, "max": 2 } },
    { "name":"西葫芦",   "cat":"蔬菜", "protein":0.8, "carbs":3.8, "fat":0.2, "fiber":0.6, "price":4,  "weight":4,  "note":"西葫芦，约2元/斤，清淡低热量", "serving": [100, 250], "servingUnit": { "unit": "根", "g": 200, "max": 1 } },
    { "name":"木耳(水发)","cat":"蔬菜","protein":1.5, "carbs":6,   "fat":0.2, "fiber":2.6, "price":12, "weight":5,  "note":"水发黑木耳，约6元/斤，补铁清肠", "serving": [30, 100], "servingUnit": { "unit": "份", "g": 50, "max": 1 } },
    { "name":"蘑菇(鲜)", "cat":"蔬菜", "protein":2.7, "carbs":4.6, "fat":0.1, "fiber":2.1, "price":10, "weight":6,  "note":"鲜蘑菇/平菇，约5元/斤，鲜味足", "serving": [50, 200], "servingUnit": { "unit": "份", "g": 100, "max": 1 } },
    { "name":"海带(鲜)", "cat":"蔬菜", "protein":1.2, "carbs":3,   "fat":0.1, "fiber":0.5, "price":6,  "weight":4,  "note":"鲜海带，约3元/斤，碘和褐藻酸", "serving": [30, 100], "servingUnit": { "unit": "份", "g": 50, "max": 1 } },
    { "name":"紫菜(干)", "cat":"蔬菜", "protein":26,  "carbs":44,  "fat":1,   "fiber":4,   "price":40, "weight":5,  "note":"干紫菜，做汤方便，高蛋白蔬菜", "serving": [3, 10], "servingUnit": { "unit": "片", "g": 3, "max": 3 } },
    // --- 水果类 ---
    { "name":"香蕉",     "cat":"水果", "protein":1,   "carbs":22,   "fat":0.3, "fiber":1.7, "price":8,  "weight":9,  "note":"香蕉，约4元/斤，方便即食", "serving": [100, 200], "servingUnit": { "unit": "根", "g": 120, "max": 2 } },
    { "name":"苹果",     "cat":"水果", "protein":0.3, "carbs":14,   "fat":0.2, "fiber":2.4, "price":10, "weight":8,  "note":"苹果，约5元/斤", "serving": [150, 250], "servingUnit": { "unit": "个", "g": 200, "max": 1 } },
    { "name":"葡萄",     "cat":"水果", "protein":0.5, "carbs":17,   "fat":0.2, "fiber":0.9, "price":16, "weight":4,  "note":"葡萄，约8元/斤", "serving": [100, 200], "servingUnit": { "unit": "串", "g": 150, "max": 1 } },
    { "name":"橙子",     "cat":"水果", "protein":0.7, "carbs":11,   "fat":0.2, "fiber":2.4, "price":10, "weight":6,  "note":"橙子，约5元/斤，富含维C", "serving": [150, 250], "servingUnit": { "unit": "个", "g": 200, "max": 2 } },
    { "name":"猕猴桃",   "cat":"水果", "protein":0.8, "carbs":14,   "fat":0.6, "fiber":2.6, "price":14, "weight":4,  "note":"猕猴桃，约7元/斤，维C之王", "serving": [100, 200], "servingUnit": { "unit": "个", "g": 100, "max": 2 } },
    { "name":"草莓",     "cat":"水果", "protein":1,   "carbs":7,    "fat":0.2, "fiber":1.3, "price":30, "weight":3,  "note":"草莓，约15元/斤", "serving": [100, 200], "servingUnit": { "unit": "把", "g": 100, "max": 2 } },
    { "name":"蓝莓",     "cat":"水果", "protein":0.7, "carbs":14,   "fat":0.3, "fiber":2.4, "price":50, "weight":2,  "note":"蓝莓，约25元/斤，花青素丰富", "serving": [50, 150], "servingUnit": { "unit": "盒", "g": 125, "max": 1 } },
    { "name":"梨",       "cat":"水果", "protein":0.4, "carbs":13,   "fat":0.2, "fiber":3.1, "price":8,  "weight":5,  "note":"梨，约4元/斤，润肺生津", "serving": [150, 250], "servingUnit": { "unit": "个", "g": 200, "max": 1 } }
  ]
};
