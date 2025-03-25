<template>
  <div class="background-effect">
    <canvas ref="canvas" class="effect-canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'BackgroundEffect',
  data() {
    return {
      canvas: null,
      ctx: null,
      curveLines: [], // 曲线元素
      particles: [], // 改为圆形粒子
      raf: null,
      lastTimestamp: 0,
      colors: [
        '#6a11cb', // 深紫色
        '#2575fc', // 蓝色
        '#fc2570', // 粉色
        '#00c6ff', // 青色
        '#38ef7d', // 绿色
        '#ff0084', // 品红色
        '#4e54c8'  // 靛蓝色
      ]
    }
  },
  mounted() {
    this.initCanvas();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext('2d');
      this.handleResize();
      
      // 创建背景曲线
      this.createCurveLines(8);
      
      // 创建圆形粒子（替换原来的方块）
      this.createCircleParticles(20);
      
      // 开始动画
      this.lastTimestamp = performance.now();
      this.animate();
    },
    
    handleResize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      
      // 重新创建曲线和圆形粒子
      this.createCurveLines(8);
      this.createCircleParticles(20);
    },
    
    // 创建曲线（替代直线）
    createCurveLines(count) {
      this.curveLines = [];
      const { width, height } = this.canvas;
      
      for (let i = 0; i < count; i++) {
        const startX = Math.random() * width;
        const startY = Math.random() * height;
        const length = Math.random() * width * 0.5 + 100;
        const thickness = Math.random() * 8 + 2;
        const colorIndex = Math.floor(Math.random() * this.colors.length);
        const color = this.colors[colorIndex];
        const alpha = Math.random() * 0.4 + 0.1;
        const speed = Math.random() * 0.02 + 0.005;
        
        // 为每条曲线生成随机控制点
        const controlPoints = [];
        const pointCount = Math.floor(Math.random() * 3) + 2; // 2-4个控制点
        
        for (let j = 0; j < pointCount; j++) {
          controlPoints.push({
            x: startX + Math.random() * length * 0.8,
            y: startY + (Math.random() - 0.5) * 200,
            // 为每个控制点添加动画参数
            amplitude: Math.random() * 50 + 10,
            period: Math.random() * 5 + 3,
            phase: Math.random() * Math.PI * 2
          });
        }
        
        this.curveLines.push({
          startX, 
          startY, 
          length,
          thickness,
          color,
          alpha,
          speed,
          angle: Math.random() * Math.PI * 2,
          controlPoints,
          time: 0
        });
      }
    },
    
    // 新的创建圆形粒子函数（替换方块粒子）
    createCircleParticles(count) {
      this.particles = [];
      const { width, height } = this.canvas;
      
      for (let i = 0; i < count; i++) {
        // 使用不同的尺寸创建更多样化的圆形
        const size = Math.random() * 180 + 60; // 增加尺寸范围
        const x = Math.random() * width;
        const y = Math.random() * height;
        const colorIndex = Math.floor(Math.random() * this.colors.length);
        const color = this.colors[colorIndex];
        const alpha = Math.random() * 0.12 + 0.02; // 降低不透明度，更柔和
        
        // 添加高斯模糊效果
        const blur = Math.random() * 50 + 30; // 30-80px 的模糊半径
        
        // 添加更柔和的动画参数
        const amplitudeX = Math.random() * 80 + 30; // 减小移动幅度
        const amplitudeY = Math.random() * 80 + 30;
        const periodX = Math.random() * 10 + 8; // 增加周期，减慢移动
        const periodY = Math.random() * 10 + 8;
        const phaseX = Math.random() * Math.PI * 2;
        const phaseY = Math.random() * Math.PI * 2;
        
        // 添加渐变效果参数
        const useGradient = Math.random() > 0.5;
        const gradientColors = [
          this.colors[Math.floor(Math.random() * this.colors.length)],
          this.colors[Math.floor(Math.random() * this.colors.length)]
        ];
        
        this.particles.push({
          baseX: x,
          baseY: y,
          x, y, size,
          color, 
          alpha,
          blur,
          amplitudeX, amplitudeY,
          periodX, periodY,
          phaseX, phaseY,
          useGradient,
          gradientColors,
          // 添加轻微形变效果
          deform: Math.random() * 0.3 + 0.7, // 椭圆率 0.7-1.0
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.001
        });
      }
    },
    
    animate(timestamp) {
      const deltaTime = timestamp - this.lastTimestamp;
      this.lastTimestamp = timestamp;
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // 绘制和更新曲线
      this.drawAndUpdateCurves(deltaTime);
      
      // 绘制和更新圆形粒子（替换方块粒子）
      this.drawAndUpdateCircles(deltaTime);
      
      // 可选：绘制粒子之间的连接线
      this.drawParticleConnections();
      
      this.raf = requestAnimationFrame(this.animate);
    },
    
    drawAndUpdateCurves(deltaTime) {
      const { width, height } = this.canvas;
      
      this.curveLines.forEach(curve => {
        curve.time += deltaTime * 0.001; // 时间增量
        
        this.ctx.beginPath();
        this.ctx.moveTo(curve.startX, curve.startY);
        
        // 更新控制点位置（使用正弦波生成有机运动）
        curve.controlPoints.forEach(point => {
          point.y = curve.startY + 
            Math.sin(curve.time / point.period + point.phase) * point.amplitude;
        });
        
        // 绘制贝塞尔曲线
        if (curve.controlPoints.length === 2) {
          // 二次贝塞尔曲线
          const cp = curve.controlPoints[0];
          const endX = curve.startX + curve.length;
          const endY = curve.startY;
          this.ctx.quadraticCurveTo(cp.x, cp.y, endX, endY);
        } else {
          // 三次或更多控制点，使用多段贝塞尔曲线
          for (let i = 0; i < curve.controlPoints.length - 1; i++) {
            const cp1 = curve.controlPoints[i];
            const cp2 = curve.controlPoints[i + 1];
            const endX = i === curve.controlPoints.length - 2 ? 
                        curve.startX + curve.length : 
                        (cp1.x + cp2.x) / 2;
            const endY = i === curve.controlPoints.length - 2 ? 
                        curve.startY : 
                        (cp1.y + cp2.y) / 2;
                        
            this.ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, endX, endY);
          }
        }
        
        // 设置线条样式
        this.ctx.lineWidth = curve.thickness;
        this.ctx.strokeStyle = `${curve.color}${Math.floor(curve.alpha * 255).toString(16).padStart(2, '0')}`;
        this.ctx.stroke();
        
        // 缓慢移动整条曲线
        curve.startX += Math.cos(curve.angle) * curve.speed * deltaTime;
        curve.startY += Math.sin(curve.angle) * curve.speed * deltaTime;
        curve.controlPoints.forEach(point => {
          point.x += Math.cos(curve.angle) * curve.speed * deltaTime;
        });
        
        // 边界检查和重置
        const maxX = Math.max(curve.startX, ...curve.controlPoints.map(p => p.x));
        if (maxX > width + curve.length) {
          curve.startX = -curve.length;
          curve.startY = Math.random() * height;
          curve.controlPoints.forEach((point, index) => {
            point.x = curve.startX + (index + 1) * (curve.length / (curve.controlPoints.length + 1));
            point.phase = Math.random() * Math.PI * 2; // 重置相位
          });
        } else if (curve.startX + curve.length < 0) {
          curve.startX = width;
          curve.startY = Math.random() * height;
          curve.controlPoints.forEach((point, index) => {
            point.x = curve.startX + (index + 1) * (curve.length / (curve.controlPoints.length + 1));
            point.phase = Math.random() * Math.PI * 2; // 重置相位
          });
        }
      });
    },
    
    // 新的绘制和更新圆形粒子函数
    drawAndUpdateCircles(deltaTime) {
      const { width, height } = this.canvas;
      
      this.particles.forEach(particle => {
        // 更新位置（柔和的缓动移动）
        const time = performance.now() * 0.001; // 以秒为单位的时间
        particle.x = particle.baseX + Math.sin(time / particle.periodX + particle.phaseX) * particle.amplitudeX;
        particle.y = particle.baseY + Math.sin(time / particle.periodY + particle.phaseY) * particle.amplitudeY;
        
        // 更新旋转角度
        particle.rotation += particle.rotationSpeed * deltaTime;
        
        // 保存当前上下文状态
        this.ctx.save();
        
        // 创建一个临时画布来实现模糊效果（比使用filter效率更高）
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // 设置临时画布尺寸为粒子尺寸加上模糊半径
        const extraSize = particle.blur * 2;
        tempCanvas.width = particle.size + extraSize;
        tempCanvas.height = particle.size + extraSize;
        
        // 在临时画布上绘制圆形
        tempCtx.save();
        tempCtx.translate(tempCanvas.width/2, tempCanvas.height/2);
        tempCtx.rotate(particle.rotation);
        tempCtx.scale(1, particle.deform); // 应用椭圆变形
        
        // 填充颜色或渐变
        if (particle.useGradient) {
          const gradient = tempCtx.createRadialGradient(
            0, 0, 0,
            0, 0, particle.size/2
          );
          gradient.addColorStop(0, `${particle.gradientColors[0]}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`);
          gradient.addColorStop(1, `${particle.gradientColors[1]}00`); // 边缘完全透明
          tempCtx.fillStyle = gradient;
        } else {
          tempCtx.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`;
        }
        
        // 绘制圆形
        tempCtx.beginPath();
        tempCtx.arc(0, 0, particle.size/2, 0, Math.PI * 2);
        tempCtx.fill();
        tempCtx.restore();
        
        // 应用高斯模糊 (简易实现)
        this.applySimpleGaussianBlur(tempCtx, tempCanvas.width, tempCanvas.height, particle.blur/3);
        
        // 绘制到主画布
        this.ctx.drawImage(
          tempCanvas, 
          particle.x - tempCanvas.width/2, 
          particle.y - tempCanvas.height/2
        );
        
        // 恢复上下文状态
        this.ctx.restore();
        
        // 边界检查与位置调整
        if (particle.x < -particle.size || 
            particle.x > width + particle.size || 
            particle.y < -particle.size || 
            particle.y > height + particle.size) {
          // 当粒子移出屏幕太远时，将其移到画布另一侧
          if (Math.abs(particle.x - particle.baseX) > width/2 || 
              Math.abs(particle.y - particle.baseY) > height/2) {
            particle.baseX = Math.random() * width;
            particle.baseY = Math.random() * height;
            particle.phaseX = Math.random() * Math.PI * 2;
            particle.phaseY = Math.random() * Math.PI * 2;
          }
        }
      });
    },
    
    // 简易高斯模糊实现
    applySimpleGaussianBlur(ctx, width, height, radius) {
      if (radius < 1) return;
      
      // 使用多次盒式模糊近似高斯模糊
      const iterations = 3; // 迭代次数越多，越接近高斯
      
      for (let i = 0; i < iterations; i++) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = width;
        tempCanvas.height = height;
        
        // 水平方向模糊
        tempCtx.drawImage(ctx.canvas, 0, 0);
        ctx.save();
        ctx.clearRect(0, 0, width, height);
        ctx.filter = `blur(${radius/iterations}px)`;
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.restore();
      }
    },
    
    drawAndUpdateParticles(deltaTime) {
      const { width, height } = this.canvas;
      
      this.particles.forEach(particle => {
        // 增加时间
        particle.morphTime += particle.morphSpeed * deltaTime;
        
        try {
          // 使用正弦波函数生成有机的运动，并确保值是有限的
          particle.x = particle.baseX + Math.sin(particle.morphTime * particle.periodX + particle.phaseX) * particle.amplitudeX;
          particle.y = particle.baseY + Math.sin(particle.morphTime * particle.periodY + particle.phaseY) * particle.amplitudeY;
          
          // 检查并修复无效值
          if (!isFinite(particle.x)) particle.x = particle.baseX;
          if (!isFinite(particle.y)) particle.y = particle.baseY;
          
          // 更新形状变形
          particle.currentRadius.topLeft = particle.initialRadius.topLeft + 
            Math.sin(particle.morphTime * 0.7) * 15;
          particle.currentRadius.topRight = particle.initialRadius.topRight + 
            Math.sin(particle.morphTime * 0.8 + 1) * 15;
          particle.currentRadius.bottomRight = particle.initialRadius.bottomRight + 
            Math.sin(particle.morphTime * 0.9 + 2) * 15;
          particle.currentRadius.bottomLeft = particle.initialRadius.bottomLeft + 
            Math.sin(particle.morphTime * 0.75 + 3) * 15;
          
          // 确保所有半径值都有效
          this.fixInvalidRadius(particle.currentRadius);
          
          // 确保粒子尺寸是有限的正数
          const safeSize = isFinite(particle.size) && particle.size > 0 ? particle.size : 50;
          
          // 创建径向渐变 - 确保所有参数值有效
          const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, safeSize
          );
          
          // 根据透明度设置颜色
          const alphaHex = Math.floor((isFinite(particle.alpha) ? particle.alpha : 0.1) * 255)
              .toString(16).padStart(2, '0');
          
          gradient.addColorStop(0, `${particle.color}${alphaHex}`);
          gradient.addColorStop(1, `${particle.color}00`);
          
          this.ctx.fillStyle = gradient;
          
          // 绘制更柔和的形状
          this.drawRoundedRect(
            particle.x - safeSize/2, 
            particle.y - safeSize/2, 
            safeSize, 
            safeSize, 
            particle.currentRadius
          );
          
        } catch (error) {
          console.warn('Error drawing particle:', error);
          // 重置问题粒子
          particle.baseX = Math.random() * width;
          particle.baseY = Math.random() * height;
          particle.x = particle.baseX;
          particle.y = particle.baseY;
          particle.size = Math.random() * 120 + 40;
          particle.morphTime = 0;
        }
        
        // 边界检查和柔和回弹效果
        this.handleParticleBoundaries(particle, width, height);
      });
    },

    // 确保半径值有效
    fixInvalidRadius(radius) {
      const minRadius = 5; // 最小半径
      const maxRadius = 100; // 最大半径
      
      for (let key in radius) {
        if (!isFinite(radius[key]) || radius[key] < minRadius) {
          radius[key] = minRadius;
        } else if (radius[key] > maxRadius) {
          radius[key] = maxRadius;
        }
      }
    },
    
    // 处理粒子边界，实现柔和回弹
    handleParticleBoundaries(particle, width, height) {
      const margin = particle.size || 50;
      const edgeFriction = 0.05; // 边缘摩擦力 - 使回弹更柔和
      
      // X轴边界处理
      if (particle.x < -margin) {
        // 柔和回弹
        particle.baseX += (margin - particle.x) * edgeFriction;
        particle.phaseX = Math.random() * Math.PI * 2; // 随机化相位
      } else if (particle.x > width + margin) {
        particle.baseX -= (particle.x - width - margin) * edgeFriction;
        particle.phaseX = Math.random() * Math.PI * 2;
      }
      
      // Y轴边界处理
      if (particle.y < -margin) {
        particle.baseY += (margin - particle.y) * edgeFriction;
        particle.phaseY = Math.random() * Math.PI * 2;
      } else if (particle.y > height + margin) {
        particle.baseY -= (particle.y - height - margin) * edgeFriction;
        particle.phaseY = Math.random() * Math.PI * 2;
      }
    },
    
    // 绘制圆角矩形 - 增加错误处理
    drawRoundedRect(x, y, width, height, radius) {
      try {
        const { topLeft, topRight, bottomRight, bottomLeft } = radius;
        
        // 确保所有值是有限的
        if (!isFinite(x) || !isFinite(y) || 
            !isFinite(width) || !isFinite(height) ||
            !isFinite(topLeft) || !isFinite(topRight) || 
            !isFinite(bottomRight) || !isFinite(bottomLeft)) {
          return; // 如果有无效值，不绘制
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(x + topLeft, y);
        this.ctx.lineTo(x + width - topRight, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + topRight);
        this.ctx.lineTo(x + width, y + height - bottomRight);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - bottomRight, y + height);
        this.ctx.lineTo(x + bottomLeft, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - bottomLeft);
        this.ctx.lineTo(x, y + topLeft);
        this.ctx.quadraticCurveTo(x, y, x + topLeft, y);
        this.ctx.closePath();
        this.ctx.fill();
      } catch (error) {
        console.warn('Error in drawRoundedRect:', error);
      }
    },
    
    // 绘制粒子连接线 - 优化为更柔和的曲线
    drawParticleConnections() {
      const maxDistance = 300; // 最大连接距离
      
      try {
        for (let i = 0; i < this.particles.length; i++) {
          const p1 = this.particles[i];
          
          // 确保当前粒子坐标有效
          if (!isFinite(p1.x) || !isFinite(p1.y)) continue;
          
          for (let j = i + 1; j < this.particles.length; j++) {
            const p2 = this.particles[j];
            
            // 确保目标粒子坐标有效
            if (!isFinite(p2.x) || !isFinite(p2.y)) continue;
            
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
              // 距离越近线越粗、越不透明
              const opacity = (1 - distance / maxDistance) * 0.2;
              const lineWidth = (1 - distance / maxDistance) * 1.5; // 降低线条粗细
              
              // 防止计算出非法值
              const safeOpacity = isFinite(opacity) ? opacity : 0.1;
              const safeWidth = isFinite(lineWidth) ? lineWidth : 0.5;
              
              // 确保颜色格式正确
              const alphaHex = Math.floor(safeOpacity * 255)
                  .toString(16).padStart(2, '0');
              
              this.ctx.strokeStyle = `${p1.color}${alphaHex}`;
              this.ctx.lineWidth = safeWidth;
              
              // 应用更柔和的连接线效果
              this.drawSoftConnection(p1, p2, distance / maxDistance);
            }
          }
        }
      } catch (error) {
        console.warn('Error in drawParticleConnections:', error);
      }
    },
    
    // 绘制更柔和的连接线
    drawSoftConnection(p1, p2, distanceRatio) {
      // 计算控制点 - 使曲线更加自然
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      
      // 波动效果，随时间变化
      const waveOffset = Math.sin(p1.morphTime / 2 + p2.morphTime / 3) * 15;
      
      // 距离控制波动幅度 - 距离越远波动越小
      const waveAmplitude = waveOffset * (1 - distanceRatio * 0.8);
      
      // 控制点偏移 - 制造自然的弯曲效果
      const controlOffsetX = -waveAmplitude * (p1.y - p2.y) / 100;
      const controlOffsetY = waveAmplitude * (p1.x - p2.x) / 100;
      
      const controlX = midX + controlOffsetX;
      const controlY = midY + controlOffsetY;
      
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.quadraticCurveTo(controlX, controlY, p2.x, p2.y);
      this.ctx.stroke();
    }
  }
}
</script>

<style scoped>
.background-effect {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.effect-canvas {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0.8; /* 稍微提高透明度，使背景更加柔和 */
}
</style>
