<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between z-20 flex-shrink-0">
      <div class="flex items-center gap-2">
        <button @click="$router.push('/main')" class="flex items-center gap-2 text-primary hover:text-primary/80 transition">
          <i class="fa fa-arrow-left"></i>
          <span>返回</span>
        </button>
      </div>
      <h1 class="text-lg font-bold text-gray-800">组合任务</h1>
      <div class="flex items-center gap-2">
        <button @click="$router.push('/temp-task')" class="px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition text-sm">
          临时任务
        </button>
        <button @click="$router.push('/create-task')" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition text-sm">
          新建任务
        </button>
      </div>
    </header>

    <main class="flex-1 overflow-hidden p-6">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="(task, index) in taskList" 
          :key="task.id"
          :draggable="true"
          @dragstart="onDragStart($event, index)"
          @dragover.prevent="onDragOver($event, index)"
          @drop="onDrop($event, index)"
          class="bg-white rounded-lg overflow-hidden border border-gray-200 relative group hover:shadow-md transition cursor-move"
        >
          <div 
            class="absolute top-0 right-0 bg-gradient-to-bl from-primary to-primary/80 px-3 py-1 text-xs text-white rounded-bl cursor-pointer hover:opacity-80 transition"
            @click.stop="viewTask(task)"
          >
            <i class="fa fa-eye mr-1"></i>查看
          </div>
          
          <div class="p-4">
            <div class="flex items-center justify-start mb-3">
              <i class="fa fa-grip-vertical text-gray-400 mr-2"></i>
              <h3 class="text-center font-bold text-gray-800 flex-1">{{ task.name }}</h3>
            </div>
            
            <div class="space-y-2 bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto mb-4">
              <div v-for="(step, stepIndex) in task.steps" :key="stepIndex" class="flex items-center gap-2 text-xs">
                <span class="text-primary"><i class="fa fa-location-arrow"></i></span>
                <span class="text-gray-600">{{ step.name }}</span>
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">无限循环</span>
                <div class="w-3 h-3 rounded-full border-2 border-gray-400" :class="task.loop ? 'bg-success border-success' : 'bg-gray-300'"></div>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <button class="w-6 h-6 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center">
                  <i class="fa fa-minus"></i>
                </button>
                <span class="text-gray-600 w-6 text-center">1</span>
                <button class="w-6 h-6 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center">
                  <i class="fa fa-plus"></i>
                </button>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button 
                @click="executeTask(task)"
                class="flex-1 py-2 bg-success text-white rounded hover:bg-success/90 transition text-sm flex items-center justify-center gap-1"
              >
                <i class="fa fa-play-circle-o"></i>
                开始任务
              </button>
              <button 
                @click="deleteTask(index)"
                class="py-2 px-3 bg-gray-100 text-gray-600 rounded hover:bg-red-50 hover:text-red-500 transition text-sm"
              >
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="taskList.length === 0" class="flex items-center justify-center h-full">
        <div class="text-center text-gray-400">
          <i class="fa fa-tasks text-5xl mb-4"></i>
          <p class="text-lg mb-4">暂无任务</p>
          <button @click="$router.push('/create-task')" class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition">
            创建第一个任务
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'CompositeTaskPage',
  data() {
    return {
      dragIndex: null,
      taskList: []
    };
  },
  mounted() {
    this.loadTasks();
  },
  methods: {
    loadTasks() {
      const savedTasks = localStorage.getItem('compositeTasks');
      if (savedTasks) {
        this.taskList = JSON.parse(savedTasks);
      } else {
        this.taskList = [
          {
            id: '1',
            name: 'A1层',
            steps: [
              { name: '导航点1' },
              { name: '导航点2' },
              { name: '导航点3' }
            ],
            loop: false
          },
          {
            id: '2',
            name: 'A2层',
            steps: [
              { name: '导航点1' },
              { name: '导航点2' },
              { name: '导航点3' }
            ],
            loop: false
          },
          {
            id: '3',
            name: 'B1层',
            steps: [
              { name: '导航点1' },
              { name: '导航点2' },
              { name: '导航点3' }
            ],
            loop: false
          },
          {
            id: '4',
            name: 'B2层',
            steps: [
              { name: '导航点1' },
              { name: '导航点2' },
              { name: '导航点3' }
            ],
            loop: false
          },
          {
            id: '5',
            name: '地图切换',
            steps: [
              { name: '起始点 origin' },
              { name: '导航点 start' },
              { name: '导航点 end' }
            ],
            loop: false
          },
          {
            id: '6',
            name: '测试任务1',
            steps: [
              { name: '导航点1' },
              { name: '导航点2' },
              { name: '导航点3' }
            ],
            loop: false
          },
          {
            id: '7',
            name: '测试任务2',
            steps: [
              { name: '导航点1' },
              { name: '导航点2' },
              { name: '导航点3' }
            ],
            loop: false
          },
          {
            id: '8',
            name: '任务任务3',
            steps: [
              { name: '导航点 start' },
              { name: '导航点 end' }
            ],
            loop: false
          }
        ];
        localStorage.setItem('compositeTasks', JSON.stringify(this.taskList));
      }
    },
    onDragStart(e, index) {
      this.dragIndex = index;
      e.dataTransfer.effectAllowed = 'move';
    },
    onDragOver(e, index) {
      if (this.dragIndex !== index) {
        e.dataTransfer.dropEffect = 'move';
      }
    },
    onDrop(e, index) {
      e.preventDefault();
      if (this.dragIndex !== index) {
        const item = this.taskList[this.dragIndex];
        this.taskList.splice(this.dragIndex, 1);
        this.taskList.splice(index, 0, item);
        localStorage.setItem('compositeTasks', JSON.stringify(this.taskList));
      }
      this.dragIndex = null;
    },
    viewTask(task) {
      this.$router.push(`/view-task/${task.id}`);
    },
    executeTask(task) {
      alert(`任务 "${task.name}" 开始执行`);
      this.$router.push('/main');
    },
    deleteTask(index) {
      if (confirm('确定要删除这个任务吗？')) {
        this.taskList.splice(index, 1);
        localStorage.setItem('compositeTasks', JSON.stringify(this.taskList));
      }
    }
  }
};
</script>
