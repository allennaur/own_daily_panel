<template>
  <BaseCard 
    :size="size" 
    type="readonly" 
    :showHeader="false"
    class="card-time"
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
    rgba(111, 66, 193, 0.95), 
    rgba(70, 26, 160, 0.9)
  ) !important;
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
  z-index: 5 !important; /* 修复语法错误 */
}

/* 明确强制所有文本为深色 */
.time, .small-date, .date, .day {
  color: white !important; 
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* 确保时间样式正确 */
.time {
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 8px;
  color: white !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
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

/* 所有文本元素强制使用白色 */
:deep(.card) *:not(textarea) {
  color: white !important;
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
  color: white !important;
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
  color: white;
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
  color: white;
}

.day {
  font-size: 13px;
  opacity: 1; /* 提高不透明度 */
  color: white;
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
  -webkit-text-fill-color: transparent !important;
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
  color: white; /* 完全不透明 */
  font-weight: 600; /* 加粗显示 */
}

.large-day {
  font-size: 16px;
  margin-bottom: 12px;
  color: white;
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

/* 时间卡片使用紫色系渐变文本，无背景 */
.time, .date, .day, .small-date {
  color: #6a11cb;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  position: relative;
}

/* 确保时间最突出 */
.time {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 10;
}

/* 小日期样式 */
.small-date {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
  background: linear-gradient(135deg, #6f42c1, #b854d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  background: rgba(106, 17, 203, 0.05);
  padding: 10px 16px;
  border-radius: 12px;
}

:deep(.card-content.medium) .time {
  font-size: 36px;
  font-weight: 700;
}

.seconds {
  font-size: 20px;
  opacity: 0.85;
  font-weight: 400;
  vertical-align: middle;
  margin-left: 2px;
  animation: pulse 1s infinite;
}

/* 日期和星期 */
.date {
  font-size: 14px;
  font-weight: 500;
  background: linear-gradient(90deg, #6a11cb, #8a3ab9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.day {
  font-size: 13px;
  opacity: 1;
  font-weight: 500;
  padding: 3px 10px;
  background: rgba(106, 17, 203, 0.07);
  border-radius: 10px;
  color: #6a11cb;
}

/* 农历日期 */
.lunar-date {
  font-size: 12px;
  font-weight: 600;
  margin-top: 6px;
  background: linear-gradient(90deg, #ff9f0a, #ff7a00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  padding: 3px 8px;
  position: relative;
  z-index: 5;
  border-radius: 8px;
  background-color: rgba(255, 159, 10, 0.07);
}

/* 大尺寸时间显示 */
.large-time {
  font-size: 60px;
  margin-bottom: 8px;
  font-weight: 800;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -2px;
  position: relative;
  z-index: 10;
}

/* 装饰元素 */
.time-decoration {
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(106, 17, 203, 0.1) 0%, rgba(106, 17, 203, 0) 70%);
  opacity: 0.7;
  z-index: 1;
}

/* 时间卡片 - VisionOS 风格 */
:deep(.card) {
  background: rgba(111, 66, 193, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 
    0 10px 30px rgba(111, 66, 193, 0.12),
    0 5px 15px rgba(111, 66, 193, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4) !important;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(25px) !important;
  -webkit-backdrop-filter: blur(25px) !important;
}

/* 发光背景效果 - VisionOS 内部光晕 */
:deep(.card)::after {
  content: '';
  position: absolute;
  width: 250%;
  height: 250%;
  top: -75%;
  left: -75%;
  background: radial-gradient(
    circle, 
    rgba(111, 66, 193, 0.15) 0%, 
    rgba(111, 66, 193, 0) 60%
  );
  animation: timeGlow 15s infinite alternate;
  z-index: 0 !important;
  pointer-events: none;
}

/* 确保内容在顶层 */
:deep(.card-content) {
  position: relative;
  z-index: 5 !important;
}

/* 时间文本 - VisionOS 风格深透明渐变与文字阴影 */
.time {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 10;
}

/* 大尺寸时间显示 */
.large-time {
  font-size: 60px !important;
  margin-bottom: 10px;
  font-weight: 700;
  background: linear-gradient(180deg, #ffffff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  letter-spacing: -2px;
  position: relative;
  z-index: 10;
}

/* 日期显示 - 更轻柔的白色 */
.date, .day, .small-date {
  color: rgba(255, 255, 255, 0.9) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-weight: 500;
}

/* 时间段显示 - VisionOS风格半透明容器 */
.time-section {
  background: rgba(255, 255, 255, 0.15);
  padding: 12px 16px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 农历日期 - 特殊视觉效果 */
.lunar-date {
  font-size: 14px;
  font-weight: 600;
  margin-top: 8px;
  background: linear-gradient(90deg, #ffe259, #ffa751);
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  display: inline-block;
  padding: 4px 10px;
  position: relative;
  z-index: 5;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 其余样式保持不变 */
</style>
