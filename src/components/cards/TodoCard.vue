<template>
  <BaseCard 
    :size="size" 
    type="editable" 
    title="今日待办"
    class="card-todo"
    @context-menu="$emit('context-menu', $event)">
    
    <template v-slot:header-actions>
      <button class="add-btn" @click="addNewTodo">+</button>
    </template>
    
    <div class="todo-content" :class="size">
      <!-- 不同尺寸下显示不同数量的待办项 -->
      <div v-if="visibleTodos.length === 0" class="empty-state">暂无待办事项</div>
      <ul class="todo-list" v-else>
        <li v-for="(todo, index) in visibleTodos" :key="index" class="todo-item" :class="{ 'completed': todo.completed }">
          <input type="checkbox" :id="'todo-' + index" v-model="todo.completed" @change="updateTodo">
          <label :for="'todo-' + index">{{ todo.text }}</label>
          <button class="delete-btn" @click="deleteTodo(todos.indexOf(todo))">×</button>
        </li>
      </ul>
      
      <!-- 如果还有更多项目 -->
      <div v-if="hasMoreTodos" class="more-todos">
        还有 {{ todos.length - visibleTodos.length }} 项
      </div>
      
      <div v-if="isAddingTodo" class="add-todo-form">
        <input v-model="newTodoText" type="text" placeholder="输入新的待办事项" @keyup.enter="saveTodo">
        <div class="form-buttons">
          <button @click="cancelAddTodo">取消</button>
          <button @click="saveTodo" class="save-btn">保存</button>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from './BaseCard.vue';

export default {
  name: 'TodoCard',
  components: { BaseCard },
  props: {
    size: {
      type: String,
      default: 'small'
    },
    initialTodos: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      todos: this.initialTodos,
      isAddingTodo: false,
      newTodoText: ''
    };
  },
  computed: {
    visibleTodos() {
      // 根据卡片尺寸显示不同数量的待办项
      const maxItems = {
        small: 1,
        medium: 2,
        large: 5
      };
      
      return this.todos.slice(0, maxItems[this.size] || 2);
    },
    hasMoreTodos() {
      return this.todos.length > this.visibleTodos.length;
    }
  },
  methods: {
    addNewTodo() {
      this.isAddingTodo = true;
      this.$nextTick(() => {
        const input = document.querySelector('.add-todo-form input');
        if (input) input.focus();
      });
    },
    
    saveTodo() {
      if (this.newTodoText.trim()) {
        this.todos.push({
          text: this.newTodoText,
          completed: false
        });
        this.newTodoText = '';
        this.$emit('update:todos', [...this.todos]);
      }
      this.isAddingTodo = false;
    },
    
    cancelAddTodo() {
      this.newTodoText = '';
      this.isAddingTodo = false;
    },
    
    deleteTodo(index) {
      this.todos.splice(index, 1);
      this.$emit('update:todos', [...this.todos]);
    },
    
    updateTodo() {
      this.$emit('update:todos', [...this.todos]);
    }
  }
}
</script>

<style scoped>
/* 待办事项卡片使用绿色主题 */
:deep(.card) {
  background: linear-gradient(135deg,
    rgba(46, 176, 134, 1),
    rgba(26, 115, 96, 0.95)
  ) !important;
  position: relative;
  overflow: hidden;
}

/* 添加紧急覆盖，确保所有文本元素使用白色 */
:deep(.card) *:not(textarea) {
  color: white !important;
}

/* 确保装饰层不会遮挡内容 */
:deep(.card)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M15 7.5V22.5" stroke="white" stroke-opacity="0.08" stroke-width="2" stroke-linecap="round"/><path d="M7.5 15H22.5" stroke="white" stroke-opacity="0.08" stroke-width="2" stroke-linecap="round"/></svg>');
  background-size: 20px;
  opacity: 0.3;
  z-index: 0 !important;
}

/* 强制控制标题文字颜色 */
:deep(.card-header) h3 {
  color: white !important;
  font-weight: 600 !important;
  letter-spacing: -0.01em;
  z-index: 5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 确保卡片内容处于顶层 */
:deep(.card-content) {
  position: relative;
  z-index: 5 !important;
}

.add-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3); /* 增加背景对比度 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: rgba(255, 255, 255, 0.4); /* 增加悬停对比度 */
  transform: scale(1.05);
}

.todo-content {
  padding: 0;
  position: relative;
  z-index: 2;
}

.todo-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;
}

.todo-item:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.todo-item.completed {
  background-color: rgba(255, 255, 255, 0.1);
}

.todo-item.completed label {
  text-decoration: line-through;
  opacity: 0.6;
  color: rgba(255, 255, 255, 0.7) !important;
}

.todo-item input[type="checkbox"] {
  margin-right: 12px;
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.6); /* 增加边框可见度 */
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.todo-item input[type="checkbox"]:checked {
  background-color: rgba(255, 255, 255, 0.95); /* 增加对比度 */
  border-color: transparent;
}

.todo-item input[type="checkbox"]:checked::after {
  content: "✓";
  color: rgba(46, 176, 134, 1); /* 增加勾选标记可见度 */
  font-size: 12px;
  font-weight: 700; /* 增加勾选标记粗细 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.todo-item input[type="checkbox"]:not(:checked):hover {
  border-color: rgba(255, 255, 255, 0.8); /* 增加悬停对比度 */
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.todo-item label {
  flex: 1;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: opacity 0.2s;
  letter-spacing: -0.01em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.delete-btn {
  opacity: 0;
  width: 20px;
  height: 20px;
  font-size: 16px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7); /* 增加按钮可见度 */
  cursor: pointer;
  transition: all 0.2s;
}

.todo-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  color: rgba(255, 255, 255, 0.95); /* 增加悬停可见度 */
  transform: scale(1.1);
}

/* 确保提示文本可读 */
.empty-state {
  text-align: center;
  padding: 30px 20px;
  font-size: 14px;
  font-style: italic;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.15); /* 稍微亮一点的背景 */
  border-radius: 12px;
  margin: 10px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.add-todo-form {
  padding: 12px 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.05);
}

/* 确保表单元素可读 */
.add-todo-form input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.25);
  transition: all 0.2s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.add-todo-form input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.add-todo-form input::placeholder {
  color: rgba(255, 255, 255, 0.7) !important;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-buttons button {
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500; /* 适度加粗按钮文字 */
  color: white !重要;
  background: rgba(0, 0, 0, 0.1);
}

.form-buttons button.save-btn {
  background: rgba(255, 255, 255, 0.25);
  color: white !重要;
  font-weight: 600; /* 加粗保存按钮 */
}

.form-buttons button:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.3);
}

.form-buttons button.save-btn:hover {
  background: rgba(255, 255, 255, 0.45);
}

/* 尺寸特定样式 */
.todo-content {
  max-height: calc(100% - 45px);
  overflow-y: auto;
}

.more-todos {
  text-align: center;
  padding: 8px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.2);
  margin: 10px;
  border-radius: 8px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 特定尺寸下的样式调整 */
.todo-content.small .todo-item {
  padding: 8px 10px;
}

.todo-content.small .todo-item label {
  font-size: 13px;
}

.todo-content.small .empty-state {
  padding: 15px;
}

.todo-content.large .todo-item {
  padding: 12px 18px;
}

/* 添加新按钮特效 */
.todo-content.large .add-btn {
  width: 28px;
  height: 28px;
  font-size: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 待办事项卡片使用绿色系渐变文本 */
:deep(.card-header) h3 {
  background: linear-gradient(135deg, #2eb086, #60dd8e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* 添加按钮 */
.add-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(46, 176, 134, 0.15);
  color: #2eb086;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: rgba(46, 176, 134, 0.25);
  transform: scale(1.05);
}

/* 待办项目 */
.todo-item {
  border-bottom: 1px solid rgba(46, 176, 134, 0.1);
}

.todo-item:hover {
  background-color: rgba(46, 176, 134, 0.05);
}

.todo-item.completed {
  background-color: rgba(46, 176, 134, 0.03);
}

.todo-item label {
  color: #2a7561;
}

.todo-item.completed label {
  text-decoration: line-through;
  opacity: 0.6;
  color: rgba(46, 176, 134, 0.7);
}

/* 复选框 */
.todo-item input[type="checkbox"] {
  border: 2px solid rgba(46, 176, 134, 0.4);
}

.todo-item input[type="checkbox"]:checked {
  background-color: rgba(46, 176, 134, 0.9);
  border-color: transparent;
}

/* 删除按钮 */
.delete-btn {
  color: rgba(46, 176, 134, 0.6);
}

.delete-btn:hover {
  color: rgba(46, 176, 134, 1);
}

/* 空状态提示 */
.empty-state {
  color: rgba(46, 176, 134, 0.6);
  background: rgba(46, 176, 134, 0.05);
}

/* 更多待办提示 */
.more-todos {
  color: #2eb086;
  background: rgba(46, 176, 134, 0.07);
}

/* 添加表单 */
.add-todo-form input {
  border: 1px solid rgba(46, 176, 134, 0.2);
  background: rgba(46, 176, 134, 0.03);
  color: #2a7561;
}

.add-todo-form input::placeholder {
  color: rgba(46, 176, 134, 0.5);
}

/* 表单按钮 */
.form-buttons button {
  color: #2a7561;
  background: rgba(46, 176, 134, 0.1);
}

.form-buttons button.save-btn {
  background: rgba(46, 176, 134, 0.2);
  color: #2a7561;
}

/* 待办卡片 - VisionOS 风格 */
:deep(.card) {
  background: rgba(46, 176, 134, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 
    0 10px 30px rgba(46, 176, 134, 0.12),
    0 5px 15px rgba(46, 176, 134, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4) !important;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(25px) !important;
  -webkit-backdrop-filter: blur(25px) !important;
}

/* 格子背景图案 */
:deep(.card)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M15 7.5V22.5" stroke="white" stroke-opacity="0.08" stroke-width="2" stroke-linecap="round"/><path d="M7.5 15H22.5" stroke="white" stroke-opacity="0.08" stroke-width="2" stroke-linecap="round"/></svg>');
  background-size: 20px;
  opacity: 0.25;
  z-index: 0;
}

/* 白色文本 */
:deep(.card-header) h3 {
  color: rgba(255, 255, 255, 0.95) !important;
  font-weight: 600 !important;
  letter-spacing: -0.01em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  z-index: 5;
}

/* 添加按钮 - VisionOS 样式圆形按钮 */
.add-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  color: white !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.add-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
}

/* 列表项 - VisionOS 风格 */
.todo-item {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.12);
  margin-bottom: 6px;
  border-radius: 14px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.todo-item:hover {
  background: rgba(255, 255, 255, 0.17);
}

.todo-item.completed {
  background: rgba(255, 255, 255, 0.08);
}

/* 复选框 - VisionOS 风格 */
.todo-item input[type="checkbox"] {
  margin-right: 12px;
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.todo-item input[type="checkbox"]:checked {
  background-color: rgba(255, 255, 255, 0.95);
  border-color: transparent;
}

/* 任务文本 */
.todo-item label {
  color: white !important;
  font-weight: 500;
}

/* 空状态 - VisionOS 风格半透明面板 */
.empty-state {
  text-align: center;
  padding: 30px 20px;
  color: white !important;
  font-size: 14px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  margin: 10px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 添加任务表单 - VisionOS 风格 */
.add-todo-form {
  padding: 14px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  margin-top: 8px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.add-todo-form input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  color: white !important;
  margin-bottom: 12px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

/* 按钮 - VisionOS 风格 */
.form-buttons button {
  padding: 8px 16px;
  border-radius: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: white !important;
  font-weight: 500;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.form-buttons button.save-btn {
  background: rgba(255, 255, 255, 0.3);
}

/* 其余样式保持不变 */
</style>
