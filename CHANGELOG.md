# 更新日志

## 2026-04-21 — 安全与稳定性修复

### 严重问题修复
- **推荐引擎崩溃修复**：`recommend.js` 中 `selectProteinItems` 函数缺少 `var items = []` 声明，导致蛋白质选择算法运行时抛出 ReferenceError，推荐功能实际不可用
- **XSS 漏洞修复**：`foods.html` 和 `recommend.js` 中 innerHTML 直接拼接用户可控数据（食物名称、分类名），导入恶意 JSON 可触发存储型 XSS。已统一使用 `esc()` 转义函数
- **localStorage 写入安全**：所有 `localStorage.setItem` 调用添加 try-catch，防止存储满或隐私模式下应用崩溃

### 功能修复
- **预设方案食物名修正**：方案 A 中 `鸭肉(冷冻白条鸭)` 改为数据库中实际存在的 `鸭肉(冷冻)`；方案 C 中 `牛肉(鲜)` 改为 `牛腱子`
- **跨页面数据同步**：推荐页现在优先读取用户在计算器页修改过的食物数据（从 localStorage），而非仅读静态 `data.js`
- **除零保护**：`recalcCosts`、`computeWeights`、`ensureVeggie` 中对 `price`/`protein` 为 0 的情况添加防护
