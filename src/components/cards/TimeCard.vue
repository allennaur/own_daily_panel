<template>
  <div :class="['card', 'time-card', cardSizeClass]" ref="timeCard" @contextmenu="handleContextMenu">
    <div class="card-content" :class="{ 'small': size === 'small', 'medium': size === 'medium', 'large': size === 'large' }">
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
    </div>
  </div>
</template>

<script>
import { CardEffectMixin } from './CardBase.js';

export default {
  name: 'TimeCard',
  mixins: [CardEffectMixin],
  props: {
    time: String,
    date: String,
    day: String,
    lunar: String,
    cardType: {
      type: String,
      default: 'readonly'
    }
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
  },
  mounted() {
    this.setupCardEffect(this.$refs.timeCard);
  },
  methods: {
    // 添加handleContextMenu方法
    handleContextMenu(e) {
      e.preventDefault();
      this.$emit('context-menu', e);
    }
  },
  beforeUnmount() {
    const card = this.$refs.timeCard;
    if (card) {
      card.removeEventListener('mouseenter', this.handleCardMouseEnter);
      card.removeEventListener('mousemove', this.handleCardMouseMove);
      card.removeEventListener('mouseleave', this.handleCardMouseLeave);
      card.removeEventListener('contextmenu', this.handleContextMenu);
    }
  }
}
</script>

<style scoped>
.time-card {
  background: linear-gradient(
    135deg, 
    rgba(10, 132, 255, 0.1), 
    rgba(94, 92, 230, 0.15)
  ) !important;
  color: var(--visionos-text) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: context-menu; /* 表示有右键菜单可用 */
}

/* 卡片尺寸过渡动画 */
.card {
  transition: grid-row 0.3s ease-out, grid-column 0.3s ease-out, height 0.3s ease-out;
}

/* 通用样式... */
.time-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%);
  opacity: 0;
  transform: scale(1);
  animation: pulse 8s infinite alternate;
}

@keyframes pulse {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 0.3; transform: scale(1.2); }
}

/* 小尺寸样式 - 紧凑型正方形 */
.card-content.small {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 6px; /* 减小内边距 (10px → 6px) */
}

.card-content.small .time {
  font-size: 20px; /* 减小字体大小 (32px → 20px) */
  font-weight: 300;
  line-height: 1;
  margin-bottom: 8px;
}

.card-content.small .small-date {
  font-size: 10px; /* 减小字体大小 (14px → 10px) */
  opacity: 0.7;
}

/* 中尺寸样式 - 横向布局 */
.card-content.medium {
  display: flex;
  flex-direction: row;  /* 改为横向布局 */
  align-items: center;  /* 垂直居中对齐 */
  justify-content: space-between; /* 两侧对齐 */
  width: 100%;
  padding: 10px; /* 减小内边距 (16px → 10px) */
  height: 100%;
}

.card-content.medium .time-section {
  flex: 1;
  text-align: left; /* 左对齐 */
}

.card-content.medium .time {
  font-size: 32px; /* 减小字体大小 (48px → 32px) */
}

.card-content.medium .seconds {
  font-size: 18px; /* 减小字体大小 (24px → 18px) */
}

.card-content.medium .date-section {
  flex: 1;
  text-align: right; /* 右对齐 */
  padding-left: 20px;
  border-left: 1px solid rgba(0, 0, 0, 0.05);
}

/* 大尺寸样式 */
.card-content.large {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 14px; /* 减小内边距 (20px → 14px) */
}

.time-section.large {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.large-time {
  font-size: 48px !important; /* 调整字体大小 (80px → 48px) */
  margin-bottom: 12px; /* 减小间距 (20px → 12px) */
}

.large-time .seconds {
  font-size: 24px; /* 减小字体大小 (36px → 24px) */
}

.date-section.large {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.date-section.large::before {
  content: '';
  width: 60px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0;
}

.large-date {
  font-size: 16px; /* 减小字体大小 (22px → 16px) */
  margin-bottom: 6px;
}

.large-day {
  font-size: 14px; /* 减小字体大小 (18px → 14px) */
  margin-bottom: 6px;
}

.large-lunar {
  font-size: 14px; /* 减小字体大小 (18px → 14px) */
  margin-top: 4px;
  background: linear-gradient(90deg, 
    rgba(191, 90, 242, 0.9),
    rgba(94, 92, 230, 0.9));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 4px 12px;
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
  background: rgba(191, 90, 242, 0.1);
  border-radius: 20px;
  z-index: -1;
}

.time-decoration {
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(94, 92, 230, 0.1) 0%, rgba(94, 92, 230, 0) 70%);
  opacity: 0.5;
}
</style>
