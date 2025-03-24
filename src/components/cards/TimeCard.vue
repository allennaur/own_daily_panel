<template>
  <div class="card time-card" ref="timeCard">
    <div class="card-content">
      <div class="time-section">
        <div class="time">
          {{ time.substring(0, 5) }}<span class="seconds">{{ time.substring(5) }}</span>
        </div>
      </div>
      <div class="date-section">
        <div class="date">{{ date }}</div>
        <div class="day">{{ day }}</div>
        <div class="lunar-date">{{ lunar }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeCard',
  props: {
    time: String,
    date: String,
    day: String,
    lunar: String // 添加农历日期属性
  },
  mounted() {
    this.setupCardEffect(this.$refs.timeCard);
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
    const card = this.$refs.timeCard;
    if (card) {
      card.removeEventListener('mouseenter', this.handleCardMouseEnter);
      card.removeEventListener('mousemove', this.handleCardMouseMove);
      card.removeEventListener('mouseleave', this.handleCardMouseLeave);
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
}

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

.card-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  z-index: 2;
}

.time-section {
  margin-bottom: 10px;
}

.time {
  font-size: 64px;
  font-weight: 300;
  line-height: 1;
  color: var(--visionos-text) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  letter-spacing: -0.02em;
  margin-bottom: 5px;
}

.seconds {
  font-size: 32px;
  opacity: 0.6;
  font-weight: 200;
  vertical-align: middle;
  margin-left: 2px;
}

.date-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 0;
  position: relative;
}

.date-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
}

.date {
  font-size: 18px;
  font-weight: 400;
  color: var(--visionos-text-secondary) !important;
  letter-spacing: -0.01em;
}

.day {
  font-size: 16px;
  font-weight: 400;
  color: var(--visionos-text-secondary) !important;
}

.lunar-date {
  font-size: 16px;
  font-weight: 400;
  margin-top: 2px;
  color: var(--visionos-text-secondary) !important;
  opacity: 0.8;
  letter-spacing: -0.01em;
  background: linear-gradient(90deg, 
    rgba(191, 90, 242, 0.8),
    rgba(94, 92, 230, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
