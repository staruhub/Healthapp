## Why

当前应用使用 Lavender Health Theme，但缺乏系统化的设计规范。用户提出了一套完整的"柔和新拟态（Soft Neomorphism）+ 卡片式布局"设计风格规范，包括莫兰迪色系、完整的排版系统、组件规范、间距系统和动效规范。实施这套设计系统将提升应用的视觉一致性和用户体验，营造清新、舒适、无压力的使用感受。

## What Changes

- **色彩系统重构**: 从当前 Lavender 紫色主题迁移到莫兰迪低饱和度色系（薄荷绿 `#C5DDD6`、淡紫色 `#E8DFF0`、米黄色 `#E8E4C8`、奶油白 `#FAF8F5`）
- **圆角系统升级**: 卡片圆角从当前 20px 升级到 24-28px，营造更柔和的视觉效果
- **排版规范**: 建立 5 级字体层级系统（H1 28px, H2 48px, H3 18px, Body 14px, Caption 12px）
- **阴影系统**: 统一为柔和扩散阴影 `0 4px 20px rgba(0, 0, 0, 0.05)`
- **间距系统**: 基于 4px 基础单位的间距令牌（xs/sm/md/lg/xl）
- **组件规范**: 新增环形进度图、成就徽章等组件样式规范
- **动效规范**: 统一过渡动画曲线和交互反馈效果
- **数据可视化**: 为图表定义专用配色方案

## Impact

- **Affected specs**: 新增 `ui-design` 能力规范
- **Affected code**:
  - `frontend/app/globals.css` - CSS 变量重构
  - `frontend/components/ui/*.tsx` - 组件样式更新
  - `frontend/components/dashboard/*.tsx` - Dashboard 卡片样式
  - `frontend/components/body/*.tsx` - 体重追踪页样式
  - `frontend/components/food/*.tsx` - 饮食记录页样式
  - `frontend/components/insights/*.tsx` - 洞察页样式
- **Breaking changes**: 无，仅为视觉样式更新
- **Migration**: 渐进式迁移，可分阶段实施

