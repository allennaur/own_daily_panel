<template>
  <div class="theme-provider"></div>
</template>

<script>
export default {
  name: 'ThemeProvider'
}
</script>

<style>
/* 主题色定义 */
:root {
  /* 时间卡片主题色 - 紫色系 */
  --time-gradient-start: #6a11cb;
  --time-gradient-end: #2575fc;
  --time-text-color: #6a11cb;
  --time-bg-light: rgba(106, 17, 203, 0.05);
  
  /* 天气卡片主题色 - 蓝色系 */
  --weather-gradient-start: #1976d2;
  --weather-gradient-end: #64b5f6;
  --weather-text-color: #1976d2;
  --weather-bg-light: rgba(25, 118, 210, 0.07);
  
  /* 待办卡片主题色 - 绿色系 */
  --todo-gradient-start: #2eb086;
  --todo-gradient-end: #60dd8e;
  --todo-text-color: #2a7561;
  --todo-bg-light: rgba(46, 176, 134, 0.07);
  
  /* 笔记卡片主题色 - 橙色系 */
  --note-gradient-start: #ff9f0a;
  --note-gradient-end: #ff7a00;
  --note-text-color: #cc6600;
  --note-bg-light: rgba(255, 159, 10, 0.05);
}

/* 基础卡片样式 */
.card {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(15px);
}

/* 时间卡片 */
.card-time h3,
.card-time .time,
.card-time .date,
.card-time .day {
  color: var(--time-text-color) !important;
}

/* 天气卡片 */
.card-weather h3,
.card-weather .temperature,
.card-weather .weather-desc,
.card-weather .detail-value {
  color: var(--weather-text-color) !important;
}

/* 待办卡片 */
.card-todo h3,
.card-todo .todo-item label,
.card-todo .more-todos {
  color: var(--todo-text-color) !important;
}

/* 笔记卡片 */
.card-note h3,
.card-note textarea {
  color: var(--note-text-color) !important;
}

/* 增强文本可读性 */
.card-time .time {
  text-shadow: 0 1px 3px rgba(106, 17, 203, 0.1);
}

.card-weather .temperature {
  text-shadow: 0 1px 3px rgba(25, 118, 210, 0.1);
}
</style>
