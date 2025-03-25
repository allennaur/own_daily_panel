<template>
  <BaseCard 
    :size="size" 
    type="readonly" 
    :showHeader="size !== 'small'"
    class="card-weather"
    :title="size === 'medium' ? '天气' : '天气预报'"
    @context-menu="$emit('context-menu', $event)">
    
    <template v-if="size === 'medium' || size === 'large'" v-slot:header-actions>
      <span class="location">{{ weatherData.location }}</span>
    </template>
    
    <!-- 小尺寸布局 - 简洁版 -->
    <template v-if="size === 'small'">
      <div class="weather-content small">
        <div class="weather-icon small" :class="weatherData.icon"></div>
        <div class="temperature small">{{ weatherData.temperature }}°</div>
        <div class="location small">{{ weatherData.location }}</div>
      </div>
    </template>
    
    <!-- 中尺寸布局 - 标准版 -->
    <template v-else-if="size === 'medium'">
      <div class="weather-content medium">
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
      <div class="weather-content large">
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
  </BaseCard>
</template>

<script>
import BaseCard from './BaseCard.vue';

export default {
  name: 'WeatherCard',
  components: { BaseCard },
  props: {
    size: {
      type: String,
      default: 'small'
    },
    weatherData: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
/* 天气卡片 - VisionOS 风格 */
:deep(.card) {
  background: rgba(25, 118, 210, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 
    0 10px 30px rgba(25, 118, 210, 0.12),
    0 5px 15px rgba(25, 118, 210, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4) !important;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(25px) !important;
  -webkit-backdrop-filter: blur(25px) !important;
}

/* 天气图案背景 */
:deep(.card)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none"><path d="M70 55C70 62.732 63.732 69 56 69C48.268 69 42 62.732 42 55C42 47.268 48.268 41 56 41C63.732 41 70 47.268 70 55Z" fill="white" fill-opacity="0.08"/><path d="M50 30C50 35.523 45.523 40 40 40C34.477 40 30 35.523 30 30C30 24.477 34.477 20 40 20C45.523 20 50 24.477 50 30Z" fill="white" fill-opacity="0.05"/></svg>');
  background-size: 150px;
  background-position: center;
  opacity: 0.25;
  z-index: 0;
}

/* 文本颜色 - 明亮白色 */
:deep(.card-header) h3,
.temperature,
.weather-desc,
.location,
.detail-label,
.detail-value,
.forecast-day,
.forecast-temp {
  color: rgba(255, 255, 255, 0.95) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 温度显示 - VisionOS 字体风格 */
.temperature {
  font-size: 38px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 6px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  letter-spacing: -0.5px;
}

/* 天气描述 - 背景亚克力效果 */
.weather-desc {
  font-size: 14px;
  font-weight: 500;
  padding: 5px 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: inline-block;
}

/* 大尺寸布局 */
.weather-content.large {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
  position: relative;
  z-index: 2;
}

.current-weather {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 16px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.forecast-item {
  flex: 1;
  text-align: center;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 12px;
  margin: 0 4px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.forecast-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

/* 降水和风速显示 */
.weather-detail.large {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 14px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  margin: 0 4px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
}

/* 其余样式保持不变 */
:deep(.card) {
  background: linear-gradient(135deg,
    rgba(25, 118, 210, 1),
    rgba(13, 71, 161, 0.95)
  ) !important;
  position: relative;
  overflow: hidden;
}

:deep(.card)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none"><path d="M70 55C70 62.732 63.732 69 56 69C48.268 69 42 62.732 42 55C42 47.268 48.268 41 56 41C63.732 41 70 47.268 70 55Z" fill="white" fill-opacity="0.1"/><path d="M50 30C50 35.523 45.523 40 40 40C34.477 40 30 35.523 30 30C30 24.477 34.477 20 40 20C45.523 20 50 24.477 50 30Z" fill="white" fill-opacity="0.08"/><path d="M90 40C90 42.761 87.761 45 85 45C82.239 45 80 42.761 80 40C80 37.239 82.239 35 85 35C87.761 35 90 37.239 90 40Z" fill="white" fill-opacity="0.05"/><path d="M30 75C30 77.761 27.761 80 25 80C22.239 80 20 77.761 20 75C20 72.239 22.239 70 25 70C27.761 70 30 72.239 30 75Z" fill="white" fill-opacity="0.05"/><path d="M85 70C85 72.761 82.761 75 80 75C77.239 75 75 72.761 75 70C75 67.239 77.239 65 80 65C82.761 65 85 67.239 85 70Z" fill="white" fill-opacity="0.05"/><path d="M40 55C40 56.657 38.657 58 37 58C35.343 58 34 56.657 34 55C34 53.343 35.343 52 37 52C38.657 52 40 53.343 40 55Z" fill="white" fill-opacity="0.08"/></svg>');
  background-size: 200px;
  background-position: center;
  opacity: 0.3;
  z-index: 0;
}

/* 强制所有天气卡片文本为白色 */
:deep(.card),
:deep(.card) * {
  color: white !important;
}

/* 强制设置所有文本为白色 */
:deep(.card-header) h3,
.temperature,
.weather-desc,
.location,
.detail-label,
.detail-value,
.forecast-day,
.forecast-temp {
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 强调温度显示 */
.temperature {
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 6px;
  background: linear-gradient(135deg, #1976d2, #64b5f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 大尺寸温度渐变效果 */
.temperature.large {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #0d47a1, #42a5f5);
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  text-shadow: none; /* 去除阴影，因为是文字裁剪 */
}

/* 提高选择器权重 */
:deep(.card-content) {
  position: relative;
  z-index: 5 !important;
}

/* 小尺寸样式 */
.weather-content.small {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  position: relative;
  z-index: 2;
}

.weather-icon.small {
  width: 32px;
  height: 32px;
  margin-bottom: 6px;
}

.temperature.small {
  font-size: 24px;
  margin-bottom: 4px;
  font-weight: 600; /* 加粗温度 */
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); /* 增强阴影 */
}

.location.small {
  font-size: 10px;
  color: #1976d2; /* 完全不透明 */
  font-weight: 500; /* 适度加粗 */
  background: rgba(25, 118, 210, 0.07); /* 增加背景对比度 */
  padding: 3px 8px;
  border-radius: 10px;
}

/* 中尺寸样式 */
.weather-content.medium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 8px;
  height: 100%;
  position: relative;
  z-index: 2;
}

.weather-icon {
  width: 55px;
  height: 55px;
  margin-right: 14px;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.1));
}

.weather-info {
  flex: 1;
}

.weather-desc {
  font-size: 14px;
  font-weight: 500; /* 适度加粗 */
  color: #1976d2;
  background: rgba(25, 118, 210, 0.07); /* 增加背景对比度 */
  display: inline-block;
  padding: 4px 12px;
  border-radius: 10px;
}

.weather-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  padding-left: 20px;
  height: 100%;
  gap: 8px;
}

/* 大尺寸样式 */
.weather-content.large {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
  position: relative;
  z-index: 2;
}

.current-weather {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  padding: 12px 15px;
}

.weather-icon.large {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15));
}

.weather-main {
  flex: 1;
}

.weather-desc.large {
  font-size: 18px;
  color: rgba(255, 255, 255, 1);
  font-weight: 600; /* 加粗显示 */
  background: rgba(255, 255, 255, 0.25); /* 增加背景对比度 */
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  margin-top: 4px;
}

.weather-details.large {
  display: flex;
  margin-bottom: 20px;
}

.weather-detail.large {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(25, 118, 210, 0.05);
  border-radius: 12px;
  margin: 0 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.detail-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
  background-size: 20px;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
  color: #1976d2;
  font-weight: 600; /* 加粗标题 */
  position: relative;
  display: inline-block;
  padding-bottom: 5px;
}

.forecast-section h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
}

.forecast-items {
  display: flex;
  justify-content: space-between;
}

.forecast-item {
  flex: 1;
  text-align: center;
  background: rgba(25, 118, 210, 0.05);
  border-radius: 12px;
  padding: 12px 8px;
  margin: 0 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.forecast-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.2);
}

.forecast-day {
  font-size: 12px;
  color: #1976d2 !important;
  font-weight: 500; /* 适度加粗 */
  margin-bottom: 5px;
}

.forecast-icon.small {
  width: 30px;
  height: 30px;
  margin: 0 auto 5px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.forecast-temp {
  font-size: 13px;
  font-weight: 600; /* 加粗温度 */
  color: #1976d2 !important;
}

/* 通用图标样式 */
.weather-icon {
  width: 50px;
  height: 50px;
  margin-right: 14px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.9;
}

.weather-icon.sunny {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FFFFFF"><circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>');
  filter: drop-shadow(0 2px 5px rgba(255, 183, 77, 0.2));
  color: #ff9800;
}

.weather-icon.cloudy {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FFFFFF"><path d="M19 18H6a4 4 0 1 1 0-8h.71A5.5 5.5 0 0 1 18 7.5v.5a4 4 0 0 1 1 7.89z"/></svg>');
  filter: drop-shadow(0 2px 5px rgba(100, 181, 246, 0.2));
  color: #64b5f6;
}

/* 顶部位置显示 */
.location {
  font-size: 12px;
  color: #1976d2;
  font-weight: 500; /* 适度加粗 */
}

.detail-label {
  font-size: 12px;
  color: rgba(25, 118, 210, 0.7); /* 增加不透明度 */
  font-weight: 400; /* 保持常规字重 */
}

.detail-value {
  font-size: 14px;
  font-weight: 600; /* 加粗数值 */
  color: #1976d2;
}

:deep(.card-header h3) {
  background: linear-gradient(135deg, #1976d2, #64b5f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600 !important;
  letter-spacing: -0.01em;
  z-index: 5;
}

/* 确保所有文本元素使用白色 */
:deep(.card) * {
  color: white !important;
}

:deep(.card-header h3) {
  color: white !important;
  font-weight: 600 !important;
  letter-spacing: -0.01em;
  z-index: 5;
}

/* 添加紧急覆盖，确保所有天气卡片中的文本使用白色 */
:deep(.card) *:not(textarea) {
  color: white !important;
}
</style>