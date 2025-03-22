export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
    // 添加视差效果，增强VisionOS的空间感
    document.addEventListener('mousemove', this.handleMouseMove);
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
  },
  methods: {
    handleMouseMove(e) {
      // 获取鼠标位置相对于窗口中心的偏移量
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (e.clientX - centerX) / centerX * 5;
      const moveY = (e.clientY - centerY) / centerY * 5;
      
      // 应用轻微的视差效果到标题容器
      const headerContainer = document.querySelector('.header-container');
      if (headerContainer) {
        headerContainer.style.transform = `translateZ(20px) rotateX(${-moveY}deg) rotateY(${moveX}deg)`;
      }
    }
  }
}
