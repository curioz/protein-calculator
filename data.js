/**
 * 蛋白质食品数据库 - 默认数据（已按2026年4月日常零售价格修正，含扩展品类）
 *
 * 格式说明：
 *   categories: 品类名称数组
 *   foods: 食品数组
 *     - name:    食品名称
 *     - cat:     所属品类（须在 categories 中）
 *     - protein: 每100g蛋白质含量(g)
 *     - price:   每公斤价格(元/kg)，液体为每升
 *     - note:    备注（含市场参考依据）
 *     - unit:    单位（可选，默认"g"，液体填"ml"）
 *     - custom:  是否为用户自定义（true/false）
 *
 * 可直接编辑此文件，保存后刷新页面即可生效。
 * 也可通过页面内"导入/导出"功能管理数据。
 */
window.PROTEIN_DB = {
  "version": "2026-04-12",
  "categories": [
    "鲜肉",
    "成品肉",
    "蛋奶",
    "豆类",
    "蛋白粉",
    "干果"
  ],
  "foods": [
    // --- 鲜肉类 ---
    { "name":"鸡胸肉(冷冻)",       "cat":"鲜肉",   "protein":24,  "price":22,   "note":"圣农/正大，日常约11元/斤" },
    { "name":"猪瘦肉",             "cat":"鲜肉",   "protein":20,  "price":26,   "note":"精瘦肉，日常约13元/斤" },
    { "name":"鱼肉(巴沙/草鱼)",     "cat":"鲜肉",   "protein":18,  "price":24,   "note":"冷冻巴沙鱼柳/鲜活草鱼，约12元/斤" },
    { "name":"牛肉(鲜)",           "cat":"鲜肉",   "protein":22,  "price":90,   "note":"牛腩/牛腱，日常约45元/斤" },
    { "name":"虾仁(冷冻)",         "cat":"鲜肉",   "protein":19,  "price":60,   "note":"去壳冷冻虾仁，约30元/斤" },
    { "name":"金枪鱼罐头(水浸)",   "cat":"鲜肉",   "protein":25,  "price":70,   "note":"水浸金枪鱼，高蛋白低脂" },
    { "name":"火鸡胸肉",           "cat":"鲜肉",   "protein":28,  "price":60,   "note":"超高蛋白，国内市场较贵" },
    { "name":"鸭肉(冷冻白条鸭)",   "cat":"鲜肉",   "protein":17,  "price":20,   "note":"白条鸭，常见禽肉" },
    { "name":"三文鱼(冷冻)",       "cat":"鲜肉",   "protein":20,  "price":80,   "note":"冷冻三文鱼，富含Omega-3" },
    { "name":"沙丁鱼罐头",         "cat":"鲜肉",   "protein":22,  "price":45,   "note":"高蛋白高钙，即食" },
    { "name":"对虾(冷冻)",         "cat":"鲜肉",   "protein":18,  "price":50,   "note":"冷冻对虾，低脂高蛋白" },
    { "name":"扇贝肉(冷冻)",       "cat":"鲜肉",   "protein":11,  "price":30,   "note":"冷冻扇贝肉，低脂海鲜" },
    // --- 成品肉类 ---
    { "name":"即食鸡胸肉",         "cat":"成品肉", "protein":22,  "price":40,   "note":"袋鼠先生/三只松鼠，约20元/斤" },
    { "name":"卤牛腱子(即食)",     "cat":"成品肉", "protein":28,  "price":160,  "note":"京东京造等，约80元/斤" },
    // --- 蛋奶类 ---
    { "name":"鸡蛋",               "cat":"蛋奶",   "protein":13,  "price":9,    "note":"洋鸡蛋，日常约4.5元/斤" },
    { "name":"纯牛奶(普通)",       "cat":"蛋奶",   "protein":3.2, "price":11,   "note":"伊利/蒙牛，日常约11元/L", "unit":"ml" },
    { "name":"纯牛奶(高端)",       "cat":"蛋奶",   "protein":3.6, "price":20,   "note":"特仑苏/金典，日常约20元/L", "unit":"ml" },
    { "name":"希腊酸奶",           "cat":"蛋奶",   "protein":8,   "price":64,   "note":"高蛋白浓缩酸奶，约64元/kg" },
    { "name":"奶酪(硬质)",         "cat":"蛋奶",   "protein":25,  "price":150,  "note":"硬质奶酪，蛋白密度高但脂肪高" },
    // --- 豆类 ---
    { "name":"干黄豆",             "cat":"豆类",   "protein":35,  "price":9,    "note":"散装/袋装，日常约4.5元/斤" },
    { "name":"腐竹(干)",           "cat":"豆类",   "protein":45,  "price":36,   "note":"干腐竹，日常约18元/斤" },
    { "name":"北豆腐",             "cat":"豆类",   "protein":10,  "price":7,    "note":"老豆腐，日常约3.5元/斤" },
    { "name":"豆腐干",             "cat":"豆类",   "protein":17,  "price":14,   "note":"香干/白豆干，约7元/斤" },
    { "name":"豆浆",               "cat":"豆类",   "protein":2.5, "price":8,    "note":"浓豆浆，约8元/L", "unit":"ml" },
    { "name":"黑豆(干)",           "cat":"豆类",   "protein":36,  "price":12,   "note":"黑豆，蛋白质含量略高于黄豆" },
    { "name":"天贝",               "cat":"豆类",   "protein":19,  "price":50,   "note":"发酵大豆制品，易消化富含益生菌" },
    { "name":"藜麦(干)",           "cat":"豆类",   "protein":15,  "price":30,   "note":"完全蛋白谷物，可替代主食" },
    // --- 蛋白粉类 ---
    { "name":"大豆分离蛋白粉",     "cat":"蛋白粉", "protein":85,  "price":140,  "note":"零售装，日常约70元/斤" },
    { "name":"乳清蛋白粉(浓缩)",   "cat":"蛋白粉", "protein":78,  "price":240,  "note":"Myprotein等，日常约120元/斤" },
    { "name":"乳清蛋白粉(分离)",   "cat":"蛋白粉", "protein":88,  "price":360,  "note":"ON/康比特，日常约180元/斤" },
    // --- 干果类 ---
    { "name":"花生(带壳生)",       "cat":"干果",   "protein":25,  "price":16,   "note":"带壳生花生，约8元/斤" },
    { "name":"南瓜子(带壳)",       "cat":"干果",   "protein":33,  "price":30,   "note":"带壳南瓜子，约15元/斤" },
    { "name":"杏仁(巴旦木)",       "cat":"干果",   "protein":21,  "price":80,   "note":"巴旦木仁，约40元/斤" },
    { "name":"混合坚果",           "cat":"干果",   "protein":20,  "price":90,   "note":"每日坚果类，约45元/斤" },
    { "name":"花生酱",             "cat":"干果",   "protein":25,  "price":30,   "note":"花生酱，涂抹方便但脂肪高" }
  ]
};
