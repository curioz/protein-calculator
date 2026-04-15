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
 *     - note:    备注（含市场参考依据）
 *     - unit:    单位（可选，默认"g"，液体填"ml"）
 *     - custom:  是否为用户自定义（true/false）
 *
 * 可直接编辑此文件，保存后刷新页面即可生效。
 * 也可通过页面内"导入/导出"功能管理数据。
 */
window.PROTEIN_DB = {
  "version": "2026-04-14",
  "categories": [
    "鲜肉",
    "成品肉",
    "蛋奶",
    "豆类",
    "蛋白粉",
    "干果",
    "主食",
    "水果"
  ],
  "foods": [
    // --- 鲜肉类 ---
    { "name":"鸡胸肉(冷冻)",       "cat":"鲜肉",   "protein":24,  "carbs":0,    "fat":2,     "fiber":0,    "price":22,   "note":"圣农/正大，日常约11元/斤" },
    { "name":"猪瘦肉",             "cat":"鲜肉",   "protein":20,  "carbs":1,    "fat":6,     "fiber":0,    "price":26,   "note":"精瘦肉，日常约13元/斤" },
    { "name":"鱼肉(巴沙/草鱼)",     "cat":"鲜肉",   "protein":18,  "carbs":0,    "fat":3,     "fiber":0,    "price":24,   "note":"冷冻巴沙鱼柳/鲜活草鱼，约12元/斤" },
    { "name":"牛肉(鲜)",           "cat":"鲜肉",   "protein":22,  "carbs":1,    "fat":5,     "fiber":0,    "price":90,   "note":"牛腩/牛腱，日常约45元/斤" },
    { "name":"虾仁(冷冻)",         "cat":"鲜肉",   "protein":19,  "carbs":0,    "fat":1,     "fiber":0,    "price":60,   "note":"去壳冷冻虾仁，约30元/斤" },
    { "name":"金枪鱼罐头(水浸)",   "cat":"鲜肉",   "protein":25,  "carbs":0,    "fat":1,     "fiber":0,    "price":70,   "note":"水浸金枪鱼，高蛋白低脂" },
    { "name":"火鸡胸肉",           "cat":"鲜肉",   "protein":28,  "carbs":0,    "fat":1,     "fiber":0,    "price":60,   "note":"超高蛋白，国内市场较贵" },
    { "name":"鸭肉(冷冻白条鸭)",   "cat":"鲜肉",   "protein":17,  "carbs":0,    "fat":8,     "fiber":0,    "price":20,   "note":"白条鸭，常见禽肉" },
    { "name":"三文鱼(冷冻)",       "cat":"鲜肉",   "protein":20,  "carbs":0,    "fat":13,    "fiber":0,    "price":80,   "note":"冷冻三文鱼，富含Omega-3" },
    { "name":"沙丁鱼罐头",         "cat":"鲜肉",   "protein":22,  "carbs":0,    "fat":10,    "fiber":0,    "price":45,   "note":"高蛋白高钙，即食" },
    { "name":"对虾(冷冻)",         "cat":"鲜肉",   "protein":18,  "carbs":1,    "fat":1,     "fiber":0,    "price":50,   "note":"冷冻对虾，低脂高蛋白" },
    { "name":"扇贝肉(冷冻)",       "cat":"鲜肉",   "protein":11,  "carbs":2,    "fat":1,     "fiber":0,    "price":30,   "note":"冷冻扇贝肉，低脂海鲜" },
    // --- 成品肉类 ---
    { "name":"即食鸡胸肉",         "cat":"成品肉", "protein":22,  "carbs":2,    "fat":3,     "fiber":0,    "price":40,   "note":"袋鼠先生/三只松鼠，约20元/斤" },
    { "name":"卤牛腱子(即食)",     "cat":"成品肉", "protein":28,  "carbs":1,    "fat":4,     "fiber":0,    "price":160,  "note":"京东京造等，约80元/斤" },
    // --- 蛋奶类 ---
    { "name":"鸡蛋",               "cat":"蛋奶",   "protein":13,  "carbs":1,    "fat":10,    "fiber":0,    "price":9,    "note":"洋鸡蛋，日常约4.5元/斤" },
    { "name":"纯牛奶(普通)",       "cat":"蛋奶",   "protein":3.2, "carbs":5,    "fat":3.5,   "fiber":0,    "price":11,   "note":"伊利/蒙牛，日常约11元/L", "unit":"ml" },
    { "name":"纯牛奶(高端)",       "cat":"蛋奶",   "protein":3.6, "carbs":5,    "fat":4,     "fiber":0,    "price":20,   "note":"特仑苏/金典，日常约20元/L", "unit":"ml" },
    { "name":"希腊酸奶",           "cat":"蛋奶",   "protein":8,   "carbs":5,    "fat":5,     "fiber":0,    "price":64,   "note":"高蛋白浓缩酸奶，约64元/kg" },
    { "name":"奶酪(硬质)",         "cat":"蛋奶",   "protein":25,  "carbs":1,    "fat":30,    "fiber":0,    "price":150,  "note":"硬质奶酪，蛋白密度高但脂肪高" },
    // --- 豆类 ---
    { "name":"干黄豆",             "cat":"豆类",   "protein":35,  "carbs":20,   "fat":16,    "fiber":15,   "price":9,    "note":"散装/袋装，日常约4.5元/斤" },
    { "name":"腐竹(干)",           "cat":"豆类",   "protein":45,  "carbs":15,   "fat":22,    "fiber":1,    "price":36,   "note":"干腐竹，日常约18元/斤" },
    { "name":"北豆腐",             "cat":"豆类",   "protein":10,  "carbs":3,    "fat":5,     "fiber":0.5,  "price":7,    "note":"老豆腐，日常约3.5元/斤" },
    { "name":"豆腐干",             "cat":"豆类",   "protein":17,  "carbs":5,    "fat":8,     "fiber":1,    "price":14,   "note":"香干/白豆干，约7元/斤" },
    { "name":"豆浆",               "cat":"豆类",   "protein":2.5, "carbs":2,    "fat":1.5,   "fiber":0.5,  "price":8,    "note":"浓豆浆，约8元/L", "unit":"ml" },
    { "name":"黑豆(干)",           "cat":"豆类",   "protein":36,  "carbs":20,   "fat":15,    "fiber":10,   "price":12,   "note":"黑豆，蛋白质含量略高于黄豆" },
    { "name":"天贝",               "cat":"豆类",   "protein":19,  "carbs":5,    "fat":8,     "fiber":3,    "price":50,   "note":"发酵大豆制品，易消化富含益生菌" },
    { "name":"藜麦(干)",           "cat":"豆类",   "protein":15,  "carbs":58,   "fat":6,     "fiber":7,    "price":30,   "note":"完全蛋白谷物，可替代主食" },
    // --- 蛋白粉类 ---
    { "name":"大豆分离蛋白粉",     "cat":"蛋白粉", "protein":85,  "carbs":0,    "fat":1,     "fiber":0,    "price":140,  "note":"零售装，日常约70元/斤" },
    { "name":"乳清蛋白粉(浓缩)",   "cat":"蛋白粉", "protein":78,  "carbs":5,    "fat":5,     "fiber":0,    "price":240,  "note":"Myprotein等，日常约120元/斤" },
    { "name":"乳清蛋白粉(分离)",   "cat":"蛋白粉", "protein":88,  "carbs":1,    "fat":1,     "fiber":0,    "price":360,  "note":"ON/康比特，日常约180元/斤" },
    // --- 干果类 ---
    { "name":"花生(带壳生)",       "cat":"干果",   "protein":25,  "carbs":15,   "fat":45,    "fiber":8,    "price":16,   "note":"带壳生花生，约8元/斤" },
    { "name":"南瓜子(带壳)",       "cat":"干果",   "protein":33,  "carbs":5,    "fat":45,    "fiber":6,    "price":30,   "note":"带壳南瓜子，约15元/斤" },
    { "name":"杏仁(巴旦木)",       "cat":"干果",   "protein":21,  "carbs":20,   "fat":50,    "fiber":10,   "price":80,   "note":"巴旦木仁，约40元/斤" },
    { "name":"混合坚果",           "cat":"干果",   "protein":20,  "carbs":18,   "fat":50,    "fiber":8,    "price":90,   "note":"每日坚果类，约45元/斤" },
    { "name":"花生酱",             "cat":"干果",   "protein":25,  "carbs":15,   "fat":50,    "fiber":6,    "price":30,   "note":"花生酱，涂抹方便但脂肪高" },
    // --- 主食类 ---
    { "name":"白米饭",             "cat":"主食",   "protein":2.6, "carbs":25,   "fat":0.3,   "fiber":0.4,  "price":6,    "note":"熟米饭，约3元/斤（含米成本）" },
    { "name":"面条(熟)",           "cat":"主食",   "protein":3,   "carbs":25,   "fat":0.5,   "fiber":0.8,  "price":8,    "note":"熟面条，约4元/斤" },
    { "name":"红薯",               "cat":"主食",   "protein":1.1, "carbs":20,   "fat":0.2,   "fiber":3,    "price":6,    "note":"红薯，约3元/斤，富含膳食纤维" },
    { "name":"土豆",               "cat":"主食",   "protein":2,   "carbs":17,   "fat":0.1,   "fiber":1.5,  "price":5,    "note":"土豆，约2.5元/斤" },
    { "name":"燕麦(干)",           "cat":"主食",   "protein":13,  "carbs":62,   "fat":7,     "fiber":10,   "price":18,   "note":"即食燕麦片，约9元/斤" },
    { "name":"全麦面包",           "cat":"主食",   "protein":10,  "carbs":42,   "fat":3,     "fiber":7,    "price":30,   "note":"全麦面包，约15元/斤" },
    { "name":"馒头",               "cat":"主食",   "protein":7,   "carbs":45,   "fat":1,     "fiber":1.5,  "price":10,   "note":"白面馒头，约5元/斤" },
    { "name":"玉米",               "cat":"主食",   "protein":4,   "carbs":19,   "fat":1.2,   "fiber":2.5,  "price":6,    "note":"鲜玉米，约3元/根" },
    // --- 水果类 ---
    { "name":"香蕉",               "cat":"水果",   "protein":1,   "carbs":22,   "fat":0.3,   "fiber":1.7,  "price":8,    "note":"香蕉，约4元/斤，方便即食" },
    { "name":"苹果",               "cat":"水果",   "protein":0.3, "carbs":14,   "fat":0.2,   "fiber":2.4,  "price":10,   "note":"苹果，约5元/斤" },
    { "name":"葡萄",               "cat":"水果",   "protein":0.5, "carbs":17,   "fat":0.2,   "fiber":0.9,  "price":16,   "note":"葡萄，约8元/斤" },
    { "name":"橙子",               "cat":"水果",   "protein":0.7, "carbs":11,   "fat":0.2,   "fiber":2.4,  "price":10,   "note":"橙子，约5元/斤，富含维C" }
  ]
};
