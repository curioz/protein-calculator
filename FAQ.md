# 常见问题（FAQ）

## 这个项目是什么

一个纯前端营养工具，帮你回答两个问题：

1. **哪些食物补蛋白最划算？** — 对比 87 种常见食材的蛋白质性价比
2. **每天怎么吃才能达标？** — 一键生成完整的四餐饮食方案

无需注册、无需安装，打开浏览器即可使用。

## 有哪些页面

| 页面 | 用途 | 适合设备 |
|------|------|---------|
| 桌面版对比工具 | 蛋白质成本排行、组合搭配、图表 | 电脑 |
| 移动版对比工具 | 同上，触屏优化 | 手机 |
| 每日饮食推荐 | 生成/调整每日四餐方案 | 手机优先 |
| 食材信息表 | 全部食材的营养数据参考 | 通用 |

## 蛋白质性价比怎么算的

**每 500g 蛋白质的购买成本 = 500 × 单价(元/kg) ÷ 每 100g 蛋白含量**

例如鸡胸肉：500 × 22 ÷ 24 = ¥45.8，意思是花 ¥45.8 就能摄入 500g 蛋白质。

价格来源为中国大陆线上电商（京东/淘宝/拼多多），营养数据来自《中国食物成分表》标准值。

## 推荐方案的算法是什么

四个维度加权随机选择：

| 维度 | 作用 |
|------|------|
| 蛋白性价比 | 优先选便宜的蛋白来源 |
| 推荐权重 | 日常常吃的食物优先（可在数据中调整） |
| 餐次适配 | 米饭→午晚餐、燕麦/鸡蛋→早餐、坚果→加餐 |
| 历史衰减 | 近 7 天用过的食材降权，保证多样性 |

## 三种预设怎么选

| 预设 | 适合谁 | 蛋白 | 脂肪 | 热量 |
|------|--------|------|------|------|
| 增肌 | 想增肌增力的人群 | 2.0 g/kg | 1.0 g/kg | TDEE + 300 |
| 减脂 | 想减脂控体重的人群 | 1.8 g/kg | 0.7 g/kg | TDEE − 500 |
| 均衡 | 日常维持健康饮食 | 1.4 g/kg | 0.8 g/kg | TDEE |

## 为什么减脂的蛋白比均衡还高

这是运动营养学界的基本共识——**热量缺口越大，蛋白质需求越高**，原因有三：

**1. 抗分解**

热量缺口下，身体会分解肌肉蛋白来供能。提高蛋白质摄入可以抵消这个分解效应，保护瘦体重。Phillips & Van Loon (2011) 明确指出：

> "Elevated protein consumption, as high as **1.8-2.0 g/kg/day** depending on the caloric deficit, may be advantageous in preventing lean mass losses during periods of energy restriction."
>
> — *J Sports Sciences*, 29(S1):S29-S38. [DOI](https://doi.org/10.1080/02640414.201.619204)

**2. 饱腹感**

蛋白质的饱腹感显著高于碳水和脂肪。减脂期需要控制总热量，高蛋白饮食让你「不容易饿」，更容易坚持。

**3. 热效应**

蛋白质的食物热效应（TEF）约为 20-30%，碳水和脂肪仅 5-10%。这意味着吃 100 kcal 的蛋白质，身体实际净吸收约 70-80 kcal；吃 100 kcal 的脂肪，净吸收约 95 kcal。

**而无压力状态不需要额外蛋白**。Hudson et al. (2020) 的 Meta-analysis 发现：在无热量限制、无训练的日常状态下，高于 RDA 的蛋白摄入对瘦体重**无显著收益** (+0.08 kg, p>0.05)：

> — *Advances in Nutrition*, 11(3):590-603. [PubMed](https://pubmed.ncbi.nlm.nih.gov/31794597/)

**总结**：蛋白需求 ≠ 训练强度，而是与「身体面临的分解压力」正相关。减脂期的热量缺口是最大的分解压力，因此需要最多蛋白。

## 热量和营养目标怎么算的

基于 Mifflin-St Jeor 公式（1990），是目前公认最准确的静息代谢估算公式：

- **BMR**（基础代谢）= 10×体重(kg) + 6.25×身高(cm) − 5×年龄 + 5(男) / −161(女)
- **TDEE**（总消耗）= BMR × 活动系数

| 活动量 | 系数 |
|--------|------|
| 久坐 | 1.2 |
| 轻度运动 | 1.375 |
| 中度运动 | 1.55 |
| 高强度运动 | 1.725 |
| 极高强度 | 1.9 |

碳水不是手动设定的，而是 **总热量 − 蛋白热量 − 脂肪热量** 后的剩余热量 ÷ 4。这样确保三大营养素热量之和不超标。

## 可以自定义食材吗

可以。两种方式：

1. **页面内编辑**：在对比工具页面点击任意食物进行编辑，或添加自定义食物
2. **编辑 data.js**：直接修改数据文件，保存后刷新即生效

数据通过浏览器 localStorage 持久化，也可导出为 JSON 备份。

## 为什么没有后端/注册

这个工具定位是「打开就用」的个人参考工具。所有数据存在你自己的浏览器里，不传到任何服务器。缺点是换设备数据不互通，可以通过导出/导入 JSON 来手动迁移。

## 数据准确吗

- **营养数据**：采用《中国食物成分表》标准值，是大样本平均值，与具体品牌/批次会有偏差
- **价格**：来自 2026 年 4 月线上电商日常零售价，不同地区和时间会有差异
- **推荐方案**：是基于算法的辅助参考，不构成医疗或营养诊疗建议

## 参考文献

1. Morton RW et al. A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength. *Br J Sports Med*. 2018;52(6):376-384. [DOI](https://doi.org/10.1136/bjsports-2017-097608)
2. Phillips SM, Van Loon LJC. Dietary protein for athletes: From requirements to optimum adaptation. *J Sports Sciences*. 2011;29(S1):S29-S38. [DOI](https://doi.org/10.1080/02640414.2011.619204)
3. Hudson JL et al. Protein intake greater than the RDA differentially influences whole-body lean mass responses to purposeful catabolic and anabolic stressors. *Adv Nutr*. 2020;11(3):590-603. [PubMed](https://pubmed.ncbi.nlm.nih.gov/31794597/)
4. Jäger R et al. International Society of Sports Nutrition Position Stand: protein and exercise. *JISSN*. 2017;14:20. [DOI](https://doi.org/10.1186/s12970-017-0177-8)
5. Mifflin MD et al. A new predictive equation for resting energy expenditure in healthy individuals. *Am J Clin Nutr*. 1990;51(2):241-247.
6. Henselmans M et al. Sports Medicine. 2026;56:691-702. [DOI](https://doi.org/10.1007/s40279-025-02341-z)
