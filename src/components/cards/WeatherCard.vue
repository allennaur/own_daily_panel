<template>
  <div :class="['card', 'weather-card', cardSizeClass]" ref="weatherCard" @contextmenu="handleContextMenu">
    <!-- 小尺寸布局 - 简洁版 -->
    <template v-if="size === 'small'">
      <div class="card-content small">
        <div class="weather-icon small" :class="weatherData.icon"></div>
        <div class="temperature small">{{ weatherData.temperature }}°</div>
        <div class="location small">{{ weatherData.location }}</div>
      </div>
    </template>
    
    <!-- 中尺寸布局 - 标准版 -->
    <template v-else-if="size === 'medium'">
      <div class="card-header">
        <h3>天气</h3>
        <span class="location">{{ weatherData.location }}</span>
      </div>
      <div class="card-content weather-content medium">
        <div class="weather-icon" :class="weatherData.icon"></div>
        <div class="weather-info">
          <div class="temperature">{{ weatherData.temperature }}°</div>
          <div class="weather-desc">{{ weatherData.description }}</div>
        </div>
        <div class="weather-details">
          <div class="weather-detail">
            <div class="detail-label">湿度</div>
            <div class="detail-value">{{ weatherData.humidity }}%</div>
          </div>
          <div class="weather-detail">
            <div class="detail-label">风速</div>
            <div class="detail-value">{{ weatherData.windSpeed }} km/h</div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- 大尺寸布局 - 详细版 -->
    <template v-else>
      <div class="card-header large">
        <h3>天气预报</h3>
        <span class="location">{{ weatherData.location }}</span>
      </div>
      <div class="card-content weather-content large">
        <div class="current-weather">
          <div class="weather-icon large" :class="weatherData.icon"></div>
          <div class="weather-main">
            <div class="temperature large">{{ weatherData.temperature }}°</div>
            <div class="weather-desc large">{{ weatherData.description }}</div>
          </div>
        </div>
        
        <div class="weather-details large">
          <div class="weather-detail large">
            <div class="detail-icon humidity"></div>
            <div class="detail-info">
              <div class="detail-label">湿度</div>
              <div class="detail-value">{{ weatherData.humidity }}%</div>
            </div>
          </div>
          <div class="weather-detail large">
            <div class="detail-icon wind"></div>
            <div class="detail-info">
              <div class="detail-label">风速</div>
              <div class="detail-value">{{ weatherData.windSpeed }} km/h</div>
            </div>
          </div>
        </div>
        
        <!-- 大尺寸专属：天气预测部分 -->
        <div class="forecast-section">
          <h4>未来天气</h4>
          <div class="forecast-items">
            <!-- 模拟未来天气数据 -->
            <div class="forecast-item">
              <div class="forecast-day">明天</div>
              <div class="forecast-icon cloudy small"></div>
              <div class="forecast-temp">20°/25°</div>
            </div>
            <div class="forecast-item">
              <div class="forecast-day">后天</div>
              <div class="forecast-icon sunny small"></div>
              <div class="forecast-temp">22°/28°</div>
            </div>
            <div class="forecast-item">
              <div class="forecast-day">周五</div>
              <div class="forecast-icon cloudy small"></div>
              <div class="forecast-temp">21°/26°</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { CardEffectMixin } from './CardBase.js';

export default {
  name: 'WeatherCard',
  mixins: [CardEffectMixin],
  props: {
    weatherData: {
      type: Object,
      required: true
    },
    cardType: {
      type: String,
      default: 'readonly'
    }
  },
  mounted() {
    this.setupCardEffect(this.$refs.weatherCard);
  },
  methods: {
    // 添加handleContextMenu方法
    handleContextMenu(e) {
      e.preventDefault();
      this.$emit('context-menu', e);
    }
  },
  beforeUnmount() {
    const card = this.$refs.weatherCard;
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
/* 基础样式 */
.weather-card {
  background: linear-gradient(
    135deg,
    rgba(48, 209, 88, 0.1),
    rgba(52, 199, 89, 0.15)
  ) !important;
  color: var(--visionos-text) !important;
  position: relative;
  overflow: hidden;
  cursor: context-menu; /* 表示有右键菜单可用 */
}

/* 小尺寸样式 */
.card-content.small {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px; /* 减小内边距 (12px → 8px) */
}

.weather-icon.small {
  width: 26px; /* 减小图标尺寸 (40px → 26px) */
  height: 26px;
  margin-bottom: 4px; /* 减小间距 (8px → 4px) */
}

.temperature.small {
  font-size: 18px; /* 减小字体大小 (24px → 18px) */
  margin-bottom: 2px; /* 减小间距 (4px → 2px) */
}

.location.small {
  font-size: 9px; /* 减小字体大小 (12px → 9px) */
}

/* 中尺寸样式 */
.weather-content.medium {
  display: flex;
  justify-content: space-between; /* 内容横向分布 */
  align-items: center;
  padding: 10px 8px; /* 减小内边距 (15px 10px → 10px 8px) */
  height: 100%;
}

.weather-info {
  flex: 1;
}

.weather-details.medium {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  padding-left: 20px;
  height: 100%;
}

/* 大尺寸样式 */
.card-header.large {
  padding: 14px; /* 减小内边距 (20px → 14px) */
}

.weather-content.large {
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px);
  padding: 0 20px 20px;
}

.current-weather {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.weather-icon.large {
  width: 80px;
  height: 80px;
}

.weather-main {
  flex: 1;
}

.temperature.large {
  font-size: 48px;
  font-weight: 300;
}

.weather-desc.large {
  font-size: 18px;
  opacity: 0.8;
}

.weather-details.large {
  display: flex;
  margin-bottom: 20px;
}

.weather-detail.large {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  margin: 0 5px;
}

.detail-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
  background-size: 20px;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 50%;
  background-color: rgba(48, 209, 88, 0.2);
}

.detail-icon.humidity {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2330D158"><path d="M12 2.5l5.5 5.5c3.1 3.1 3.1 8.2 0 11.3-3.1 3.1-8.2 3.1-11.3 0-3.1-3.1-3.1-8.2 0-11.3L12 2.5zm0 2.1L7.4 9.2c-2.3 2.3-2.3 6.1 0 8.5 2.3 2.3 6.1 2.3 8.5 0 2.3-2.3 2.3-6.1 0-8.5L12 4.6z"/></svg>');
}

.detail-icon.wind {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2330D158"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-5h18V6H3v2z"/></svg>');
}

.detail-info {
  flex: 1;
}

.forecast-section {
  margin-top: auto;
}

.forecast-section h4 {
  font-size: 16px;
  margin-bottom: 10px;
  opacity: 0.7;
}

.forecast-items {
  display: flex;
  justify-content: space-between;
}

.forecast-item {
  flex: 1;
  text-align: center;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 10px;
  margin: 0 5px;
}

.forecast-day {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 5px;
}

.forecast-icon.small {
  width: 30px;
  height: 30px;
  margin: 0 auto 5px;
}

.forecast-temp {
  font-size: 12px;
}

/* 现有样式保持不变 */
.weather-icon {
  width: 50px; /* 减小图标尺寸 (70px → 50px) */
  height: 50px;
  margin-right: 14px; /* 减小间距 (20px → 14px) */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.8;
}

.weather-icon.sunny {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF9F0A"><circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>');
}

.weather-icon.cloudy {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230A84FF"><path d="M19 18H6a4 4 0 1 1 0-8h.71A5.5 5.5 0 0 1 18 7.5v.5a4 4 0 0 1 1 7.89z"/></svg>');
}

/* ...existing styles... */
</style>