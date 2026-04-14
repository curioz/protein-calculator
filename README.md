# 蛋白质成本计算器 & 每日饮食推荐

> 对比食材蛋白质性价比，一键生成每日四餐方案

**在线访问**：[curioz.github.io/protein-calculator](https://curioz.github.io/protein-calculator/)

## 功能

### 蛋白质成本对比

- 35 种常见食材，6 大品类（鲜肉/成品肉/蛋奶/豆类/蛋白粉/干果）
- 按「每 500g 蛋白质的购买成本」排序，一目了然谁最划算
- 可排序、可筛选、可自定义食材
- 可视化图表（柱状图 + 饼图）

### 每日饮食推荐

- 一键生成早餐、午餐、晚餐、加餐的完整方案
- 基于性价比的加权随机算法，优先选高性价比食材
- 7 天去重：近期用过的食材会被降权，保证饮食多样性
- 实用计量单位：显示「1 个鸡蛋(50g)」「1 盒牛奶(250ml)」等日常表述
- 每餐可单独「换一套」，也可全部重新生成
- 自定义蛋白质目标（50-300g）和餐次比例

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
- 蛋白质含量：《中国食物成分表》标准值

## License

MIT
