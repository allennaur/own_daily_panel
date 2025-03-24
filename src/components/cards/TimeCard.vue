<template>
  <BaseCard 
    :size="size" 
    type="readonly" 
    :showHeader="false"
    ref="timeCard"
    @context-menu="$emit('context-menu', $event)">
    <template v-slot:default>
      <!-- 小尺寸布局 - 简洁时间 -->
      <template v-if="size === 'small'">
        <div class="time">{{ time.substring(0, 5) }}</div>
        <div class="small-date">{{ smallDateFormat }}</div>
      </template>
      
      <!-- 中尺寸布局 - 更多信息 -->
      <template v-else-if="size === 'medium'">
        <div class="time-section">
          <div class="time">{{ time.substring(0, 5) }}<span class="seconds">{{ time.substring(5) }}</span></div>
        </div>
        <div class="date-section">
          <div class="date-line">
            <div class="date">{{ date }}</div>
            <div class="day">{{ day }}</div>
          </div>
          <div class="lunar-date">{{ lunar }}</div>
        </div>
      </template>
      
      <!-- 大尺寸布局 - 全部信息，更大字体 -->
      <template v-else>
        <div class="time-section large">
          <div class="time large-time">{{ time.substring(0, 5) }}<span class="seconds">{{ time.substring(5) }}</span></div>
        </div>
        <div class="date-section large">
          <div class="date large-date">{{ date }}</div>
          <div class="day large-day">{{ day }}</div>
          <div class="lunar-date large-lunar">{{ lunar }}</div>
          <div class="time-decoration"></div>
        </div>
      </template>
    </template>
  </BaseCard>
</template>

<script>
import BaseCard from './BaseCard.vue';

export default {
  name: 'TimeCard',
  components: { BaseCard },
  props: {
    size: {
      type: String,
      default: 'small'
    },
    time: String,
    date: String,
    day: String,
    lunar: String,
  },
  computed: {
    smallDateFormat() {
      // 为小卡片简化日期，只显示月日
      try {
        const dateParts = this.date.split('年');
        if (dateParts.length > 1) {
          return dateParts[1];
        }
        return this.date;
      } catch (e) {
        return this.date;
      }
    }
  }
}
</script>

<style scoped>
/* 时间卡片使用深紫色主题 */
:deep(.card) {
  background: linear-gradient(135deg, 
    rgba(111, 66, 193, 1), 
    rgba(70, 26, 160, 0.95)
  ) !important;
  color: #333333 !important;
  position: relative;
  overflow: hidden;
}

/* 修改装饰元素，确保不挡住文字 */
:deep(.card)::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%);
  animation: timeGlow 15s infinite alternate;
  z-index: 0 !important;
  pointer-events: none;
}

/* 确保内容层叠顺序正确 */
:deep(.card-content) {
  position: relative;
  z-index: 5 !important;
}

/* 明确强制所有文本为深色 */
.time, .small-date, .date, .day {
  color: #333333 !important; 
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.2);
}

/* 确保时间样式正确 */
.time {
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 8px;
  color: #333333 !important;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 10;
}

/* 提高选择器权重并确保背景色直接应用 */
:deep(.card) {
  background: linear-gradient(135deg, 
    rgba(111, 66, 193, 0.95), 
    rgba(70, 26, 160, 0.9)
  ) !important;
  color: #333333 !important;
  position: relative;
  overflow: hidden;
}

/* 确保装饰层不会遮挡内容并正确定位 */
:deep(.card)::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%);
  animation: timeGlow 15s infinite alternate;
  z-index: 0 !important;
  pointer-events: none;
}

/* 确保卡片内容处于顶层 */
:deep(.card-content) {
  position: relative;
  z-index: 5 !important;
}

/* 所有文本元素强制使用深色 */
:deep(.card) * {
  color: #333333 !重要;
}

/* 修复装饰层覆盖文本问题 */
:deep(.card)::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%);
  animation: timeGlow 15s infinite alternate;
  z-index: 0;
  pointer-events: none; /* 确保不阻挡交互 */
}

/* 确保所有内容元素在装饰层上方 */
:deep(.card-content) {
  position: relative;
  z-index: 2; /* 确保内容在装饰层上方 */
}

@keyframes timeGlow {
  0% { transform: translateY(10%) rotate(0deg); opacity: 0.3; }
  100% { transform: translateY(-10%) rotate(20deg); opacity: 0.6; }
}

/* 更新小尺寸样式 */
:deep(.card-content.small) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
  z-index: 2;
}

.time {
  font-size: 24px;
  font-weight: 600; /* 加粗时间显示 */
  line-height: 1;
  margin-bottom: 8px;
  color: #333333 !important;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); /* 增强阴影提高可读性 */
  position: relative;
  z-index: 10;
}

.time::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -4px;
  transform: translateX(-50%);
  width: 30px;
  height: 1px;
  background: rgba(255, 255, 255, 0.5);
}

.small-date {
  font-size: 12px;
  opacity: 1; /* 提高不透明度 */
  color: #333333;
  font-weight: 500; /* 适度加粗 */
}

/* 中等尺寸样式更新 */
:deep(.card-content.medium) {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
}

.time-section {
  flex: 1;
  text-align: left;
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 14px;
  border-radius: 12px;
}

:deep(.card-content.medium) .time {
  font-size: 36px;
  font-weight: 600; /* 加粗显示 */
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.seconds {
  font-size: 20px;
  opacity: 0.85; /* 增加不透明度 */
  font-weight: 400; /* 调整字重 */
  vertical-align: middle;
  margin-left: 2px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.date-section {
  flex: 1;
  text-align: right;
  padding-left: 20px;
  margin-left: 10px;
}

.date-line {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

.date {
  font-size: 14px;
  font-weight: 500; /* 适度加粗 */
  color: #333333;
}

.day {
  font-size: 13px;
  opacity: 1; /* 提高不透明度 */
  color: #333333;
  font-weight: 500; /* 适度加粗 */
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.25); /* 增加背景对比度 */
  border-radius: 10px;
}

/* 农历日期使用金色渐变，保证可读性 */
.lunar-date {
  font-size: 12px;
  font-weight: 600;
  margin-top: 6px;
  background: linear-gradient(90deg, #ffe259, #ffa751);
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !重要;
  background-clip: text !important;
  display: inline-block;
  padding: 3px 8px;
  position: relative;
  z-index: 5;
}

.lunar-date::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  z-index: -1;
}

/* 大尺寸样式更新 */
:deep(.card-content.large) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 2;
}

.time-section.large {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 大尺寸时间显示 */
.large-time {
  font-size: 60px !important;
  margin-bottom: 8px;
  font-weight: 700;
  background: linear-gradient(180deg, #ffffff, rgba(255, 255, 255, 0.9));
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  letter-spacing: -2px;
  position: relative;
  z-index: 10;
  text-shadow: none; /* 去除阴影，因为是文字裁剪 */
}

.large-time .seconds {
  font-size: 24px;
  animation: pulse 1s infinite;
}

.date-section.large {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: 10px;
}

.date-section.large::before {
  content: '';
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  position: absolute;
  top: 0;
}

.large-date {
  font-size: 18px;
  margin-bottom: 4px;
  color: rgba(255, 255, 255, 1); /* 完全不透明 */
  font-weight: 600; /* 加粗显示 */
}

.large-day {
  font-size: 16px;
  margin-bottom: 12px;
  color: #333333;
  font-weight: 600; /* 加粗显示 */
  padding: 4px 14px;
  background: rgba(255, 255, 255, 0.25); /* 增加背景对比度 */
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.large-lunar {
  font-size: 16px;
  margin-top: 6px;
  padding: 5px 15px;
  font-weight: 600; /* 加粗显示 */
  background: linear-gradient(90deg, #ffe259, #ffa751); /* 更鲜明的渐变色 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  border-radius: 20px;
  position: relative;
}

.large-lunar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  z-index: -1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.time-decoration {
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
  opacity: 0.7;
  z-index: 1;
}
</style>
