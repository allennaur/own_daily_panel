<template>
  <div class="card weather-card" ref="weatherCard">
    <div class="card-header">
      <h3>天气</h3>
      <span class="location">{{ weatherData.location }}</span>
    </div>
    <div class="card-content weather-content">
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
  </div>
</template>

<script>
export default {
  name: 'WeatherCard',
  props: {
    weatherData: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.setupCardEffect(this.$refs.weatherCard);
  },
  methods: {
    setupCardEffect(card) {
      if (!card) return;
      
      card.addEventListener('mouseenter', this.handleCardMouseEnter);
      card.addEventListener('mousemove', this.handleCardMouseMove);
      card.addEventListener('mouseleave', this.handleCardMouseLeave);
    },
    
    handleCardMouseEnter(e) {
      const card = e.currentTarget;
      card.style.transition = 'transform 0.2s ease-out';
    },
    
    handleCardMouseMove(e) {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      
      const cardMoveX = (e.clientX - cardCenterX) / (rect.width / 2) * 5;
      const cardMoveY = (e.clientY - cardCenterY) / (rect.height / 2) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${-cardMoveY}deg) rotateY(${cardMoveX}deg)`;
    },
    
    handleCardMouseLeave(e) {
      const card = e.currentTarget;
      card.style.transition = 'transform 0.5s ease-out';
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
  },
  beforeUnmount() {
    const card = this.$refs.weatherCard;
    if (card) {
      card.removeEventListener('mouseenter', this.handleCardMouseEnter);
      card.removeEventListener('mousemove', this.handleCardMouseMove);
      card.removeEventListener('mouseleave', this.handleCardMouseLeave);
    }
  }
}
</script>

<style scoped>
.weather-card {
  background: linear-gradient(
    135deg,
    rgba(48, 209, 88, 0.1),
    rgba(52, 199, 89, 0.15)
  ) !important;
  color: var(--visionos-text) !important;
  position: relative;
  overflow: hidden;
}

.weather-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: radial-gradient(circle at top right, rgba(255,255,255,0.1), rgba(255,255,255,0) 70%);
}

.location {
  font-size: 14px;
  opacity: 0.7;
  color: var(--visionos-text-secondary) !important;
}

.card-header h3 {
  color: var(--visionos-text) !important;
}

.weather-content {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
}

.weather-icon {
  width: 70px;
  height: 70px;
  margin-right: 20px;
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

.weather-info {
  flex: 1;
  padding-top: 5px;
}

.temperature {
  font-size: 40px;
  font-weight: 300;
  line-height: 1;
  margin-bottom: 6px;
  color: var(--visionos-text) !important;
  letter-spacing: -0.02em;
}

.weather-desc {
  font-size: 16px;
  opacity: 0.8;
  color: var(--visionos-text-secondary) !important;
}

.weather-details {
  display: flex;
  width: 100%;
  margin-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 15px;
}

.weather-detail {
  flex: 1;
}

.detail-label {
  font-size: 13px;
  opacity: 0.6;
  margin-bottom: 4px;
  color: var(--visionos-text-secondary) !important;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.detail-value {
  font-size: 16px;
  font-weight: 500;
  color: var(--visionos-text) !important;
}
</style>
