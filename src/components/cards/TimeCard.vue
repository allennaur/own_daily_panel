<template>
  <div class="card time-card" ref="timeCard">
    <div class="card-content">
      <div class="time">{{ time }}</div>
      <div class="date">{{ date }}</div>
      <div class="day">{{ day }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeCard',
  props: {
    time: String,
    date: String,
    day: String
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

.time {
  font-size: 60px;
  font-weight: 300;
  line-height: 1;
  margin-bottom: 12px;
  color: var(--visionos-text) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  letter-spacing: -0.02em;
}

.date {
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 4px;
  color: var(--visionos-text-secondary) !important;
  letter-spacing: -0.01em;
}

.day {
  font-size: 16px;
  font-weight: 300;
  opacity: 0.8;
  color: var(--visionos-text-secondary) !important;
}
</style>
