<template>
  <div id="app">
    <div class="animated-background">
      <!-- 渐变线条元素 -->
      <div class="gradient-line line-1"></div>
      <div class="gradient-line line-2"></div>
      <div class="gradient-line line-3"></div>
      <div class="gradient-line line-4"></div>
      <div class="gradient-line line-5"></div>
      <div class="gradient-line line-6"></div>
      <div class="gradient-line line-7"></div>
      
      <!-- 渐变圆形元素 -->
      <div class="gradient-circle circle-1"></div>
      <div class="gradient-circle circle-2"></div>
      <div class="gradient-circle circle-3"></div>
      
      <!-- 水波纹效果 -->
      <div class="ripple-effect ripple-1"></div>
      <div class="ripple-effect ripple-2"></div>
    </div>
    <BackgroundEffect />
    <ColorReset />
    <HelloWorld msg="每日面板"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import ColorReset from './components/ColorReset.vue'
import BackgroundEffect from './components/BackgroundEffect.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    ColorReset,
    BackgroundEffect
  }
}
</script>

<style>
:root {
  --visionos-bg-color: rgb(240, 240, 244);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: "ss01", "ss02", "ss03"; /* 启用苹果字体的特殊字形变体 */
  width: 100%;
  height: 100vh;
  background-color: var(--visionos-bg-color);
  position: relative;
  overflow: hidden;
}

/* 禁用全局颜色覆盖 */
#app * {
  color: inherit;
}

/* 动画背景容器 */
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  opacity: 0.6;
  pointer-events: none;
}

/* 渐变线条基础样式 - 改为曲线形状 */
.gradient-line {
  position: absolute;
  border-radius: 100px; /* 增大边框圆角，使线条更柔和 */
  filter: blur(30px);
  opacity: 0.4;
  transform-origin: center;
  will-change: transform, opacity;
}

/* 渐变圆形元素 */
.gradient-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  will-change: transform;
}

/* 线条1 - 紫粉色渐变 - 更柔和的动画 */
.line-1 {
  top: -5%;
  left: 10%;
  width: 60%;
  height: 15%;
  background: linear-gradient(90deg, #6a11cb, #fc2570);
  animation: 
    floating-curve-1 35s cubic-bezier(0.21, 0.61, 0.35, 1) infinite alternate, 
    glow-soft 12s ease-in-out infinite alternate;
  border-radius: 60% 70% 60% 70%;
}

/* 线条2 - 蓝绿色渐变 - 波浪效果 */
.line-2 {
  top: 30%;
  left: -10%;
  width: 50%;
  height: 20%;
  background: linear-gradient(90deg, #00c6ff, #0072ff);
  animation: 
    floating-curve-2 40s cubic-bezier(0.34, 0.17, 0.65, 0.83) infinite alternate,
    wave-transform 25s ease-in-out infinite alternate,
    glow-soft 18s ease-in-out infinite alternate;
  border-radius: 40% 60% 70% 30%;
}

/* 线条3 - 绿色渐变 - 更柔和的曲线 */
.line-3 {
  bottom: 10%;
  right: 5%;
  width: 45%;
  height: 15%;
  background: linear-gradient(90deg, #11998e, #38ef7d);
  animation: 
    floating-curve-3 42s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate,
    morph-shape 20s ease-in-out infinite alternate,
    glow-soft 15s ease-in-out infinite alternate;
  border-radius: 50% 60% 40% 70%;
}

/* 线条4 - 粉色渐变 - 更缓慢柔和的动效 */
.line-4 {
  bottom: 30%;
  right: -15%;
  width: 60%;
  height: 10%;
  background: linear-gradient(90deg, #ff0084, #ff6a88);
  animation: 
    floating-curve-4 38s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate,
    morph-shape-reverse 22s ease-in-out infinite alternate,
    glow-soft 14s ease-in-out infinite alternate;
  border-radius: 60% 40% 60% 40%;
}

/* 线条5 - 蓝紫色渐变 - 更柔和的弧形 */
.line-5 {
  top: 60%;
  left: 20%;
  width: 50%;
  height: 12%;
  background: linear-gradient(90deg, #4e54c8, #8f94fb);
  animation: 
    floating-curve-5 45s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite alternate,
    wave-transform-reverse 30s ease-in-out infinite alternate,
    glow-soft 20s ease-in-out infinite alternate;
  border-radius: 40% 60% 50% 70%;
}

/* 线条6 - 紫粉色渐变 - 超级柔和 */
.line-6 {
  top: 10%;
  right: 20%;
  width: 40%;
  height: 8%;
  background: linear-gradient(90deg, #9733EE, #DA22FF);
  animation: 
    ultra-smooth-float 50s cubic-bezier(0.4, 0, 0.2, 1) infinite,
    glow-soft 18s ease-in-out infinite alternate;
  border-radius: 65% 35% 65% 35%;
}

/* 线条7 - 多彩渐变 - 反向超级柔和 */
.line-7 {
  bottom: 15%;
  left: 30%;
  width: 35%;
  height: 5%;
  background: linear-gradient(90deg, #1fa2ff, #12D8FA, #A6FFCB);
  animation: 
    ultra-smooth-float 45s cubic-bezier(0.4, 0, 0.6, 1) infinite reverse,
    glow-soft 15s ease-in-out infinite alternate;
  border-radius: 40% 60% 60% 40%;
}

/* 圆形背景元素 - 更柔和的变形效果 */
.circle-1 {
  top: 15%;
  right: 10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(106,17,203,0.5), rgba(37,117,252,0.2));
  animation: 
    circle-float-soft-1 50s cubic-bezier(0.34, 1.15, 0.64, 1) infinite alternate,
    morph-to-blob 25s ease-in-out infinite alternate;
  border-radius: 60% 40% 55% 45%;
}

.circle-2 {
  bottom: 10%;
  left: 5%;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(255,0,132,0.4), rgba(255,106,136,0.1));
  animation: 
    circle-float-soft-2 55s cubic-bezier(0.1, 0.9, 0.2, 1) infinite alternate,
    morph-to-blob-reverse 30s ease-in-out infinite alternate;
  border-radius: 45% 55% 50% 50%;
}

.circle-3 {
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0,198,255,0.3), rgba(0,114,255,0.1));
  animation: 
    circle-float-soft-3 60s cubic-bezier(0.65, 0.05, 0.36, 1) infinite alternate,
    morph-to-blob 28s ease-in-out infinite reverse;
  border-radius: 55% 45% 60% 40%;
  transform: translate(-50%, -50%);
}

/* 水波纹效果 */
.ripple-effect {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0));
  transform-origin: center;
  will-change: transform, opacity;
  z-index: 0;
  pointer-events: none;
}

.ripple-1 {
  top: 25%;
  left: 15%;
  width: 300px;
  height: 300px;
  animation: ripple 15s ease-in-out infinite;
}

.ripple-2 {
  bottom: 20%;
  right: 10%;
  width: 250px;
  height: 250px;
  animation: ripple 12s ease-in-out infinite 2s;
}

/* 线条浮动动画 */
@keyframes floating-1 {
  0% { transform: rotate(25deg) translateY(0) translateX(0) translateZ(0); }
  100% { transform: rotate(28deg) translateY(30px) translateX(50px) translateZ(0); }
}

@keyframes floating-2 {
  0% { transform: rotate(-35deg) translateY(0) translateX(0) translateZ(0); }
  100% { transform: rotate(-32deg) translateY(-50px) translateX(40px) translateZ(0); }
}

@keyframes floating-3 {
  0% { transform: rotate(15deg) translateY(0) translateX(0) translateZ(0); }
  100% { transform: rotate(20deg) translateY(-40px) translateX(-60px) translateZ(0); }
}

@keyframes floating-4 {
  0% { transform: rotate(-20deg) translateY(0) translateX(0) translateZ(0); }
  100% { transform: rotate(-15deg) translateY(60px) translateX(-30px) translateZ(0); }
}

@keyframes floating-5 {
  0% { transform: rotate(40deg) translateY(0) translateX(0) translateZ(0); }
  100% { transform: rotate(35deg) translateY(40px) translateX(40px) translateZ(0); }
}

/* 新的柔和曲线动画定义 */
@keyframes floating-curve-1 {
  0% { transform: rotate(5deg) translate(0, 0) scale(1); }
  20% { transform: rotate(8deg) translate(30px, 20px) scale(1.05); }
  40% { transform: rotate(2deg) translate(40px, -20px) scale(1.02); }
  60% { transform: rotate(10deg) translate(10px, 40px) scale(0.98); }
  80% { transform: rotate(3deg) translate(-20px, 30px) scale(1.03); }
  100% { transform: rotate(7deg) translate(-30px, 10px) scale(1.01); }
}

@keyframes floating-curve-2 {
  0% { transform: rotate(-5deg) translate(0, 0) scale(1); }
  25% { transform: rotate(-8deg) translate(-40px, -30px) scale(0.95); }
  50% { transform: rotate(-2deg) translate(-20px, 40px) scale(1.02); }
  75% { transform: rotate(-10deg) translate(30px, -20px) scale(0.97); }
  100% { transform: rotate(-6deg) translate(40px, 30px) scale(1.04); }
}

@keyframes floating-curve-3 {
  0% { transform: rotate(15deg) translate(0, 0) scale(1); }
  33% { transform: rotate(12deg) translate(-40px, -20px) scale(1.03); }
  66% { transform: rotate(18deg) translate(20px, -40px) scale(0.98); }
  100% { transform: rotate(10deg) translate(30px, 30px) scale(1.02); }
}

@keyframes floating-curve-4 {
  0% { transform: rotate(-15deg) translate(0, 0) scale(1); }
  33% { transform: rotate(-12deg) translate(50px, 30px) scale(1.05); }
  66% { transform: rotate(-18deg) translate(20px, -50px) scale(0.95); }
  100% { transform: rotate(-10deg) translate(-40px, 20px) scale(1.02); }
}

@keyframes floating-curve-5 {
  0% { transform: rotate(22deg) translate(0, 0) scale(1); }
  20% { transform: rotate(18deg) translate(30px, 20px) scale(0.96); }
  40% { transform: rotate(25deg) translate(-20px, 30px) scale(1.04); }
  60% { transform: rotate(20deg) translate(-30px, -20px) scale(0.98); }
  80% { transform: rotate(28deg) translate(10px, -40px) scale(1.02); }
  100% { transform: rotate(15deg) translate(20px, 20px) scale(1); }
}

/* 超级柔和的缓动动画 */
@keyframes ultra-smooth-float {
  0% { transform: translate(0, 0) rotate(0deg) scale(1); }
  10% { transform: translate(5px, 5px) rotate(1deg) scale(1.01); }
  20% { transform: translate(10px, -5px) rotate(0deg) scale(1.02); }
  30% { transform: translate(15px, -10px) rotate(-1deg) scale(1.01); }
  40% { transform: translate(10px, -15px) rotate(-2deg) scale(1); }
  50% { transform: translate(0, -10px) rotate(-1deg) scale(0.99); }
  60% { transform: translate(-10px, -5px) rotate(0deg) scale(0.98); }
  70% { transform: translate(-15px, 5px) rotate(1deg) scale(0.99); }
  80% { transform: translate(-10px, 10px) rotate(2deg) scale(1); }
  90% { transform: translate(-5px, 5px) rotate(1deg) scale(1.01); }
  100% { transform: translate(0, 0) rotate(0deg) scale(1); }
}

/* 圆形浮动动画 */
@keyframes circle-float-1 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-30px, 50px) scale(1.2); }
}

@keyframes circle-float-2 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(50px, -30px) scale(0.8); }
}

@keyframes circle-float-3 {
  0% { transform: translate(-50%, -50%) scale(1); }
  100% { transform: translate(-45%, -45%) scale(1.3); }
}

/* 柔和的圆形浮动动画 */
@keyframes circle-float-soft-1 {
  0% { transform: translate(0, 0) scale(1) rotate(0deg); }
  20% { transform: translate(-20px, 30px) scale(1.1) rotate(5deg); }
  40% { transform: translate(30px, 10px) scale(0.95) rotate(10deg); }
  60% { transform: translate(20px, -30px) scale(1.05) rotate(15deg); }
  80% { transform: translate(-30px, -20px) scale(1.15) rotate(8deg); }
  100% { transform: translate(-10px, 15px) scale(1.2) rotate(12deg); }
}

@keyframes circle-float-soft-2 {
  0% { transform: translate(0, 0) scale(1) rotate(0deg); }
  25% { transform: translate(30px, -20px) scale(0.9) rotate(-8deg); }
  50% { transform: translate(10px, 40px) scale(1.1) rotate(-15deg); }
  75% { transform: translate(-20px, 10px) scale(1.05) rotate(-5deg); }
  100% { transform: translate(20px, -30px) scale(0.85) rotate(-12deg); }
}

@keyframes circle-float-soft-3 {
  0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
  20% { transform: translate(-48%, -45%) scale(1.15) rotate(10deg); }
  40% { transform: translate(-53%, -53%) scale(0.9) rotate(5deg); }
  60% { transform: translate(-47%, -52%) scale(1.25) rotate(-5deg); }
  80% { transform: translate(-52%, -48%) scale(1.1) rotate(-10deg); }
  100% { transform: translate(-45%, -55%) scale(1.3) rotate(8deg); }
}

/* 形状变形动画 */
@keyframes morph-shape {
  0% { border-radius: 50% 60% 40% 70%; }
  33% { border-radius: 40% 50% 60% 50%; }
  66% { border-radius: 60% 40% 50% 65%; }
  100% { border-radius: 45% 55% 55% 45%; }
}

@keyframes morph-shape-reverse {
  0% { border-radius: 60% 40% 60% 40%; }
  33% { border-radius: 50% 60% 50% 60%; }
  66% { border-radius: 40% 50% 60% 40%; }
  100% { border-radius: 55% 45% 45% 55%; }
}

@keyframes morph-to-blob {
  0% { border-radius: 60% 40% 55% 45%; }
  25% { border-radius: 50% 60% 40% 70%; }
  50% { border-radius: 40% 50% 70% 40%; }
  75% { border-radius: 65% 55% 50% 60%; }
  100% { border-radius: 45% 65% 60% 50%; }
}

@keyframes morph-to-blob-reverse {
  0% { border-radius: 45% 55% 50% 50%; }
  25% { border-radius: 60% 40% 55% 65%; }
  50% { border-radius: 50% 60% 45% 55%; }
  75% { border-radius: 40% 50% 60% 40%; }
  100% { border-radius: 55% 45% 50% 60%; }
}

@keyframes wave-transform {
  0% { transform: rotate(-35deg) translate(0, 0) scale(1) skew(0deg); }
  33% { transform: rotate(-32deg) translate(-30px, 30px) scale(1.05) skew(2deg); }
  66% { transform: rotate(-38deg) translate(20px, -20px) scale(0.95) skew(-2deg); }
  100% { transform: rotate(-30deg) translate(40px, 10px) scale(1.03) skew(3deg); }
}

@keyframes wave-transform-reverse {
  0% { transform: rotate(40deg) translate(0, 0) scale(1) skew(0deg); }
  33% { transform: rotate(36deg) translate(30px, -20px) scale(0.98) skew(-3deg); }
  66% { transform: rotate(42deg) translate(-20px, 30px) scale(1.02) skew(2deg); }
  100% { transform: rotate(38deg) translate(10px, 20px) scale(1.04) skew(-2deg); }
}

/* 水波纹效果动画 */
@keyframes ripple {
  0% { transform: scale(0.8); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.5; }
  100% { transform: scale(0.9); opacity: 0.3; }
}

/* 光晕变化动画 */
@keyframes glow-1 {
  0% { opacity: 0.4; filter: blur(30px); }
  100% { opacity: 0.5; filter: blur(40px); }
}

@keyframes glow-2 {
  0% { opacity: 0.4; filter: blur(35px); }
  100% { opacity: 0.6; filter: blur(45px); }
}

@keyframes glow-3 {
  0% { opacity: 0.35; filter: blur(30px); }
  100% { opacity: 0.5; filter: blur(35px); }
}

@keyframes glow-4 {
  0% { opacity: 0.3; filter: blur(25px); }
  100% { opacity: 0.45; filter: blur(35px); }
}

@keyframes glow-5 {
  0% { opacity: 0.35; filter: blur(28px); }
  100% { opacity: 0.55; filter: blur(38px); }
}

/* 柔和的发光动画 */
@keyframes glow-soft {
  0% { opacity: 0.2; filter: blur(30px); }
  50% { opacity: 0.4; filter: blur(35px); }
  100% { opacity: 0.3; filter: blur(40px); }
}
</style>