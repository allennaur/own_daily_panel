<template>
  <BaseCard 
    :size="size" 
    type="editable" 
    title="今日待办"
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
/* 提高选择器权重并设置文字颜色 */
:deep(.card) {
  background: linear-gradient(135deg,
    rgba(46, 176, 134, 1),
    rgba(26, 115, 96, 0.95)
  ) !important;
  color: #ffffff !important;
  position: relative;
  overflow: hidden;
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
  color: #333333 !important;
  font-weight: 600 !important;
  letter-spacing: -0.01em;
  z-index: 5;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
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
  background: rgba(0, 0, 0, 0.1);
  color: #333333 !important;
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
  color: rgba(51, 51, 51, 0.7) !important;
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
  color: #333333 !important; /* 使用深色文本 */
  font-weight: 400;
  cursor: pointer;
  transition: opacity 0.2s;
  letter-spacing: -0.01em;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
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
  color: #333333 !important;
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
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.5);
  color: #333333 !important;
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
  color: rgba(51, 51, 51, 0.7) !important;
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
  color: #333333 !important;
  background: rgba(255, 255, 255, 0.25);
}

.form-buttons button.save-btn {
  background: rgba(255, 255, 255, 0.25);
  color: white !important;
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
  color: #333333 !important;
  background: rgba(255, 255, 255, 0.3);
  margin: 10px;
  border-radius: 8px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
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
</style>
