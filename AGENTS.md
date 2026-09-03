# AGENTS.md

## 1. 项目定位

本项目是「模数师数字平台驾驶舱」，面向人社局、政府管理人员及领导用户。

核心目标：

> 一屏看总体、点击看明细、需要可导出。

产品不是单纯的数据大屏，而是一个围绕「培训规模 → 培训过程 → 培训质量 → 培训成果 → 就业成果」构建的政府数据决策系统。

---

## 2. 开发前必须阅读

开始任何开发任务前，必须先阅读：

```text
/design.md
/AGENTS.md
```

`design.md` 是视觉与产品设计基准。

`AGENTS.md` 是工程实现规范。

如果用户的新需求与 `design.md` 冲突：

1. 先判断是否属于明确的新需求；
2. 明确的新需求优先；
3. 只修改受影响的设计，不要无理由推翻整个设计体系；
4. 修改后保持整体视觉、交互和组件体系一致。

---

## 3. 核心产品原则

### 3.1 数据优先

所有视觉效果必须服务于数据理解。

优先级：

```text
数据准确性
>
信息层级
>
可读性
>
交互效率
>
视觉表现
>
装饰效果
```

禁止为了“科技感”牺牲数据可读性。

### 3.2 一屏看总体

首页必须让用户快速获得：

- 培训总体规模
- 培训进行状态
- 培训质量
- 师资情况
- 就业成果

核心 KPI 必须位于首屏最重要视觉区域。

### 3.3 点击看明细

以下内容必须支持下钻：

- KPI
- 图表数据
- 排名
- 分类数据
- 就业成果
- 学员数据

点击后必须携带当前筛选上下文。

### 3.4 需要可导出

所有业务明细列表必须支持 Excel 导出。

导出内容必须与当前筛选条件保持一致。

---

# 4. 技术实现原则

如果项目已有技术栈，优先遵循现有项目，不要无理由重构。

如果从零开始：

推荐：

```text
React
TypeScript
Vite
Ant Design
ECharts
Tailwind CSS
```

推荐架构：

```text
React
 ├── Layout
 ├── Pages
 ├── Components
 ├── Charts
 ├── Hooks
 ├── Services
 ├── Types
 ├── Mock
 └── Utils
```

如果项目已经使用其他成熟技术栈，不得为了个人偏好更换。

---

# 5. 推荐目录结构

```text
src/
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx
│   │   ├── GlobalFilter.tsx
│   │   ├── KPIGrid.tsx
│   │   ├── KPICard.tsx
│   │   ├── ChartCard.tsx
│   │   ├── ResultFlow.tsx
│   │   ├── RankingList.tsx
│   │   └── StatusIndicator.tsx
│   │
│   ├── charts/
│   │   ├── TrendChart.tsx
│   │   ├── RingChart.tsx
│   │   ├── FunnelChart.tsx
│   │   └── BarChart.tsx
│   │
│   ├── common/
│   │   ├── EmptyState.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ErrorState.tsx
│   │   └── ExportButton.tsx
│   │
│   └── detail/
│       ├── DetailDrawer.tsx
│       └── DataTable.tsx
│
├── pages/
│   ├── dashboard/
│   ├── students/
│   ├── courses/
│   ├── teachers/
│   └── employment/
│
├── hooks/
├── services/
├── types/
├── mock/
├── utils/
├── constants/
└── router/
```

---

# 6. 页面路由

必须保持以下核心路由语义：

```text
/dashboard
/dashboard/training
/dashboard/quality
/dashboard/teachers
/dashboard/employment

/students
/students/:id

/courses
/courses/:id

/teachers
/teachers/:id

/employment
/employment/:id
```

如果实际项目不需要全部二级页面，可以暂时隐藏入口，但不要破坏路由结构。

---

# 7. 首页实现规范

首页：

```text
1920 × 1080
```

主要区域：

```text
Header
 ↓
Global Filter
 ↓
KPI
 ↓
培训规模 + 培训完成
 ↓
学员分析 + 课程质量
 ↓
师资 + 就业
 ↓
成果链路 / Status
```

不要在首页加入与核心业务无关的大型装饰区域。

---

# 8. 首页 KPI

默认 KPI：

```text
报名人数
在训人数
班级数
师资数
课程数

平均出勤率
完课率
通过率
课程评价
作品数量
```

每个 KPI 必须具备：

```text
label
value
unit
trend
trendLabel
click handler
```

示例：

```ts
{
  label: '报名人数',
  value: 12856,
  unit: '人',
  trend: 12.6,
  trendLabel: '较上期',
  clickable: true
}
```

---

# 9. 全局筛选器

筛选器：

```text
培训期次
培训班级
课程
培训机构
时间范围
```

状态必须由统一的数据源管理。

不要让每个图表自己维护一套筛选状态。

推荐：

```text
GlobalFilterState
      ↓
Dashboard Context / Store
      ↓
KPI
Chart
Ranking
Table
```

筛选变化后所有模块同步更新。

---

# 10. 下钻规范

所有下钻操作必须保留上下文。

例如：

```text
当前：
期次 = 2026年第3期
课程 = AI应用
班级 = 全部
```

点击：

```text
完课率 87.6%
```

跳转明细后仍然保持：

```text
期次 = 2026年第3期
课程 = AI应用
```

不要把用户已经选择的条件丢失。

---

# 11. 下钻方式

根据数据复杂度选择：

### 简单数据

使用右侧 Drawer。

例如：

```text
点击 KPI
 ↓
DetailDrawer
```

### 复杂数据

跳转完整列表页面。

例如：

```text
点击“在训人数”
 ↓
/students?status=training
```

### 深层业务

进入详情页。

例如：

```text
课程
 ↓
课程详情
 ↓
课程学习情况
 ↓
学员
```

---

# 12. URL 状态

重要筛选条件推荐同步到 URL。

例如：

```text
/students?
period=2026-03
&course=ai
&status=training
```

这样可以支持：

- 刷新保持筛选
- 浏览器返回
- 分享页面
- 深链接访问

---

# 13. 图表规范

统一使用 ECharts 或项目现有图表库。

禁止每个页面引入不同图表库。

推荐：

```text
折线图
柱状图
横向条形图
环形图
漏斗图
```

避免：

```text
3D饼图
3D柱状图
复杂雷达图
无业务意义的地图
```

---

# 14. 图表必须支持交互

至少支持：

```text
Hover
Tooltip
Legend
Click
```

点击图表数据后：

```text
获取当前维度
+
获取当前全局筛选
+
生成明细条件
```

例如：

```text
点击：
26-35岁

转换为：

ageMin = 26
ageMax = 35
```

---

# 15. Tooltip

Tooltip 必须提供业务信息。

错误：

```text
42%
```

正确：

```text
2026年08月

报名人数
2,186 人

较上月
↑ 8.6%
```

不要使用只包含数字的无意义 Tooltip。

---

# 16. 表格规范

统一 DataTable。

必须支持：

- 分页
- 排序
- 筛选
- 空数据
- Loading
- Error
- 导出
- 查看详情

推荐字段：

```text
姓名
性别
年龄
班级
课程
培训机构
出勤率
完课率
考试成绩
就业状态
```

不要一次展示过多字段。

---

# 17. 导出规范

统一使用：

```text
ExportButton
```

导出前允许：

```text
当前筛选结果
全部数据
```

导出的数据必须包括当前筛选条件。

文件命名：

```text
业务名称_期次_日期.xlsx
```

例如：

```text
学员培训明细_2026年第3期_20260903.xlsx
```

---

# 18. Mock 数据

开发初期必须提供完整 Mock 数据。

Mock 数据不能全部使用随机数字。

数据必须具备业务关联关系。

例如：

```text
报名人数
>
在训人数
>
完课人数
>
通过人数
>
就业人数
```

课程、班级、教师、学员之间也必须存在关联。

推荐：

```text
mock/
├── dashboard.ts
├── students.ts
├── courses.ts
├── teachers.ts
└── employment.ts
```

---

# 19. 数据计算规则

核心指标必须定义清楚。

### 报名人数

```text
符合筛选条件的报名学员去重人数
```

### 在训人数

```text
当前状态 = 培训中的学员去重人数
```

### 完课率

```text
完成课程要求人数 / 应完成课程要求人数 × 100%
```

### 通过率

```text
考试通过人数 / 实际参加考试人数 × 100%
```

### 就业率

```text
实现就业人数 / 符合就业统计口径的结业人数 × 100%
```

如果真实业务口径不同，必须以业务方定义为准。

---

# 20. 视觉规范

默认主题：

```text
Primary      #1677FF
Primary Dark #0B3B8F
Background   #071426
Card         #0B1D35
Border       #183A61
Text         #F3F7FF
Text Second  #8FA6C2
Success      #20C997
Warning      #F5B942
Danger       #FF5C70
```

如果项目已有品牌色，优先品牌色。

---

# 21. 禁止事项

### 禁止 1：过度赛博朋克

不要：

```text
大面积霓虹
大量粒子
强烈扫描线
高频闪烁
```

### 禁止 2：为了视觉堆图表

每一个图表必须回答一个明确业务问题。

### 禁止 3：重复组件

如果已有：

```text
KPICard
ChartCard
DataTable
```

不得重新写一套相似组件。

### 禁止 4：硬编码业务数据

不要在 JSX：

```tsx
<span>12856</span>
```

应该：

```tsx
<span>{dashboard.registered}</span>
```

### 禁止 5：组件内部请求所有数据

数据请求统一放在：

```text
services/
hooks/
```

组件负责展示和交互。

### 禁止 6：修改用户未要求修改的区域

实现需求时保持最小改动原则。

---

# 22. 响应式

主要设计目标：

```text
1920 × 1080
```

同时兼容：

```text
1440+
1600+
1920+
2560+
```

优先保证：

```text
1920 × 1080
```

下的完整视觉效果。

---

# 23. 性能

首页图表较多，需要避免：

- 重复请求
- 重复初始化 ECharts
- 无意义 re-render
- 大量 DOM 动画
- 过多定时器

自动刷新：

```text
默认 60 秒
```

刷新时：

```text
保留筛选条件
保留当前页面
保留打开的详情
```

不要整个页面闪烁重新加载。

---

# 24. Loading / Empty / Error

每个模块必须实现：

```text
Loading
Empty
Error
Normal
```

Loading：

使用局部 Skeleton。

Empty：

```text
暂无数据
请调整筛选条件后重试
```

Error：

```text
数据加载失败
[重新加载]
```

---

# 25. 无障碍与可用性

虽然项目是驾驶舱，但仍然需要：

- 文字与背景保持足够对比
- 不只通过颜色表达状态
- Hover 不作为唯一交互入口
- 按钮有明确文字
- Tooltip 不覆盖关键数据
- 表格支持键盘基本操作

---

# 26. 动效规范

允许：

```text
300~500ms
```

用于：

- 图表进入
- 卡片 Hover
- Drawer
- Tab 切换

KPI 数字动画：

```text
首次加载允许
```

不要：

```text
无限循环数字动画
无限循环背景动画
高频闪烁
```

---

# 27. 代码质量

TypeScript 项目必须尽量避免：

```ts
any
```

优先使用：

```ts
interface
type
enum
```

API 数据必须有类型。

例如：

```ts
interface DashboardSummary {
  registered: number
  training: number
  classes: number
  teachers: number
  courses: number
  attendanceRate: number
  completionRate: number
  passRate: number
  courseRating: number
  works: number
}
```

---

# 28. API 层

推荐：

```text
services/
├── dashboard.ts
├── students.ts
├── courses.ts
├── teachers.ts
└── employment.ts
```

页面不要直接写：

```ts
fetch('/api/...')
```

统一通过 service：

```ts
dashboardService.getSummary()
studentService.getList()
courseService.getList()
```

---

# 29. 错误处理

API 请求必须处理：

```text
成功
Loading
空数据
请求失败
权限不足
网络错误
```

错误不能直接：

```ts
console.error(error)
```

然后页面空白。

必须提供用户可理解的反馈。

---

# 30. 权限

数据展示必须支持权限范围。

例如：

```text
市级：
全市 → 区县 → 机构 → 班级

区县：
本区县 → 机构 → 班级

机构：
本机构 → 班级 → 课程 → 学员
```

前端不能通过隐藏按钮代替真正的数据权限控制。

后端 API 仍然必须校验权限。

---

# 31. 安全

禁止：

- 在前端硬编码真实敏感数据
- 在日志输出敏感个人信息
- 将 Token 写死在代码中
- 将生产 API Key 提交 Git
- 将真实身份证号、手机号写入 Mock

Mock 数据使用虚拟信息。

---

# 32. 开发流程

每次开始新功能：

```text
1. 阅读 design.md
2. 阅读 AGENTS.md
3. 查看现有代码
4. 找到可复用组件
5. 确定数据结构
6. 实现 UI
7. 实现交互
8. 实现 Loading / Empty / Error
9. 实现下钻
10. 实现导出
11. 自测
12. 再提交修改
```

---

# 33. 不要过度重构

如果用户要求：

> “增加一个就业图表”

不要：

```text
重写 Dashboard
重构整个组件体系
更换 UI 框架
修改所有路由
```

只修改：

```text
EmploymentAnalysis
相关数据
相关 API
相关类型
```

---

# 34. UI 验收标准

开发完成后必须检查：

### 1920×1080

- [ ] 页面没有横向滚动
- [ ] 核心 KPI 首屏可见
- [ ] 信息层级清晰
- [ ] 卡片高度统一
- [ ] 图表不变形
- [ ] 表格不溢出
- [ ] 文本不截断关键内容

### 交互

- [ ] KPI 可以点击
- [ ] 图表可以点击
- [ ] 筛选可以联动
- [ ] 下钻保留筛选
- [ ] 返回可以恢复状态
- [ ] 导出正常
- [ ] Loading 正常
- [ ] Empty 正常
- [ ] Error 正常

---

# 35. 数据验收

必须验证：

```text
报名人数
在训人数
班级数
师资数
课程数
平均出勤率
完课率
通过率
课程评价
作品数量
就业人数
就业率
```

并验证：

```text
全量数据
+
筛选数据
+
下钻数据
```

三者逻辑一致。

---

# 36. 浏览器测试

至少检查：

```text
Chrome
Edge
Safari
```

重点检查：

- ECharts
- CSS Grid
- Flex
- Sticky
- Drawer
- Table
- Export

---

# 37. Git 提交

提交信息使用：

```text
feat: 新功能
fix: 修复问题
refactor: 重构
style: 样式调整
perf: 性能优化
docs: 文档
test: 测试
```

示例：

```text
feat: add employment analysis dashboard
fix: preserve dashboard filters when drilling down
feat: add student data export
style: refine dashboard KPI cards
```

---

# 38. 完成标准

一个功能只有同时满足以下条件才算完成：

```text
视觉完成
+
数据完成
+
交互完成
+
异常状态完成
+
下钻完成
+
导出完成
+
响应式完成
+
无明显控制台错误
```

不要只完成“看起来像完成”的 UI。

---

# 39. 第一阶段实现顺序

Codex 第一次开发建议严格按照以下顺序：

```text
Step 1
项目基础 Layout

↓

Step 2
Dashboard Header

↓

Step 3
Global Filter

↓

Step 4
KPI Grid

↓

Step 5
培训规模趋势

↓

Step 6
培训完成情况

↓

Step 7
学员分析

↓

Step 8
课程质量

↓

Step 9
师资分析

↓

Step 10
就业分析

↓

Step 11
成果链路

↓

Step 12
DetailDrawer

↓

Step 13
DataTable

↓

Step 14
Export

↓

Step 15
Loading / Empty / Error

↓

Step 16
统一视觉优化

↓

Step 17
1920×1080 验收
```

---

# 40. Codex 执行原则

当收到模糊需求时：

1. 先检查现有代码；
2. 优先复用现有组件；
3. 优先实现真实交互；
4. 不要只做静态视觉；
5. 不要凭空创建重复数据；
6. 不要删除已有功能；
7. 不要改变已有 API 契约，除非需求明确要求；
8. 不要为了局部效果重构整个项目；
9. 保持 `design.md` 与实际实现一致；
10. 完成后检查 1920×1080 首页。

---

# 41. 最终产品判断标准

最终看到页面时，应该能够一眼理解：

```text
现在有多少人培训？
        ↓
培训进行得怎么样？
        ↓
课程质量怎么样？
        ↓
师资是否充足？
        ↓
最终有多少人就业？
```

如果用户点击：

```text
KPI
 ↓
图表
 ↓
排名
```

都能够自然进入：

```text
明细
 ↓
详情
 ↓
导出
```

则说明产品完整实现：

> **一屏看总体、点击看明细、需要可导出。**
