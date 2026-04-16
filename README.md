# 蛋白质成本计算器 & 每日饮食推荐

> 对比食材蛋白质性价比，一键生成每日四餐方案

**在线访问**：[curioz.github.io/protein-calculator](https://curioz.github.io/protein-calculator/)

## 功能

### 蛋白质成本对比

- 47 种常见食材，8 大品类（鲜肉/成品肉/蛋奶/豆类/蛋白粉/干果/主食/水果）
- 按「每 500g 蛋白质的购买成本」排序，一目了然谁最划算
- 可排序、可筛选、可自定义食材
- 可视化图表（柱状图 + 饼图）

### 每日饮食推荐

- 一键生成早餐、午餐、晚餐、加餐的完整方案
- 基于性价比的加权随机算法，优先选高性价比食材
- 7 天去重：近期用过的食材会被降权，保证饮食多样性
- 实用计量单位：显示「1 个鸡蛋(50g)」「1 盒牛奶(250ml)」等日常表述
- 每餐可单独「换一套」，也可全部重新生成
- 自定义蛋白质、碳水、热量目标和餐次比例

### 全营养追踪

- 蛋白质、碳水、脂肪、膳食纤维、热量五维营养数据
- 热量自动计算（蛋白质×4 + 碳水×4 + 脂肪×9）
- 脂肪/纤维参考值提示
- 三套快捷场景预设（增肌 / 减脂 / 均衡）
- 页面顶部显示用户身体参数与 BMR/TDEE 摘要

### 个性化热量计算

基于 Mifflin-St Jeor 公式，根据用户体重、身高、年龄、性别和活动量动态计算 TDEE：

- **BMR** = 10×体重(kg) + 6.25×身高(cm) − 5×年龄 + 5(男) / −161(女)
- **TDEE** = BMR × 活动系数

| 活动量 | 系数 |
|--------|------|
| 久坐 | 1.2 |
| 轻度运动 | 1.375 |
| 中度运动 | 1.55 |
| 高强度运动 | 1.725 |
| 极高强度 | 1.9 |

预设方案（蛋白→脂肪→碳水填充）：

| 场景 | 蛋白(g/kg) | 脂肪(g/kg) | 热量偏移 | 碳水 |
|------|-----------|-----------|---------|------|
| 增肌 | 2.0 | 1.0 | TDEE + 300 | 填剩余热量 |
| 减脂 | 1.8 | 0.7 | TDEE − 500 | 填剩余热量 |
| 均衡 | 1.4 | 0.8 | TDEE + 0 | 填剩余热量 |

计算顺序：`碳水 = (总热量 − 蛋白×4 − 脂肪×9) / 4`

## 参考

- **碳水与增肌**：Henselmans M, Vårvik FT, Izquierdo M. The Effect of Carbohydrate Intake on Muscle Hypertrophy: A Systematic Review and Meta-analysis. *Sports Medicine*. 2026;56:691-702. [DOI](https://doi.org/10.1007/s40279-025-02341-z)
  — 等氮条件下碳水摄入对肌肉肥大无显著影响（SMD=0.15, p=0.23）
- **蛋白推荐量**：Jäger R et al. International Society of Sports Nutrition Position Stand: protein and exercise. *JISSN*. 2017;14:20. [DOI](https://doi.org/10.1186/s12970-017-0177-8)
  — 1.6-2.2g/kg/day
- **脂肪推荐量**：ACSM 运动员营养指南建议脂肪供能占比 20-35%，约合 0.7-1.0g/kg/day
- **BMR 公式**：Mifflin-St Jeor (1990)，临床营养广泛使用的静息代谢率估算公式

## 页面

| 页面 | 说明 |
|------|------|
| [index.html](https://curioz.github.io/protein-calculator/) | 桌面版对比工具 |
| [mobile.html](https://curioz.github.io/protein-calculator/mobile.html) | 移动版对比工具 |
| [recommend.html](https://curioz.github.io/protein-calculator/recommend.html) | 每日饮食推荐（移动端优先） |

## 技术栈

纯前端，无构建依赖：

- Vanilla JavaScript
- Tailwind CSS (CDN)
- Chart.js (CDN)
- Google Fonts (Fira Sans / Fira Code)
- localStorage 数据持久化

## 数据来源

- 价格：中国大陆线上电商（京东/淘宝/拼多多），2026 年 4 月
- 营养成分：《中国食物成分表》标准值

## License

MIT
