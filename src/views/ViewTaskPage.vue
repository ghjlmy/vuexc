<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between z-20 flex-shrink-0">
      <div class="flex items-center gap-2">
        <button @click="$router.push('/composite-task')" class="flex items-center gap-2 text-primary hover:text-primary/80 transition">
          <i class="fa fa-arrow-left"></i>
          <span>返回</span>
        </button>
      </div>
      <h1 class="text-lg font-bold text-gray-800">{{ task.name }}</h1>
      <div class="flex items-center gap-2">
        <button @click="executeTask" class="px-6 py-2 bg-success text-white rounded-md hover:bg-success/90 transition flex items-center gap-1">
          <i class="fa fa-play"></i>
          开始任务
        </button>
      </div>
    </header>

    <main class="flex-1 overflow-hidden p-6">
      <div class="max-w-3xl mx-auto">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 class="text-xl font-bold text-gray-800 mb-2">{{ task.name }}</h2>
              <div class="flex items-center gap-4 text-sm text-gray-600">
                <div class="flex items-center gap-1">
                  <span>循环执行:</span>
                  <span :class="task.loop ? 'text-success' : 'text-gray-400'">
                    <i :class="task.loop ? 'fa-check-circle' : 'fa-times-circle'"></i>
                  </span>
                </div>
                <div class="flex items-center gap-1">
                  <i class="fa fa-list-ol"></i>
                  <span>{{ task.steps.length }} 个步骤</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="font-semibold text-gray-dark mb-4 flex items-center gap-1">
              <i class="fa fa-tasks text-primary"></i>
              任务步骤
            </h3>
            <div class="space-y-3">
              <div 
                v-for="(step, index) in task.steps" 
                :key="index"
                class="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div class="flex items-center gap-3 mb-2">
                  <span class="inline-flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-bold">
                    {{ index + 1 }}
                  </span>
                  <div class="flex-1">
                    <div class="font-medium text-gray-dark">
                      {{ step.type === 'point' ? '点位导航' : '路径行驶' }}: {{ step.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      动作: {{ step.action === 'navigate' ? '导航' : (step.action === 'charge' ? '自动充电' : '等待') }}
                    </div>
                    <div v-if="step.action === 'wait'" class="text-sm text-gray-500">
                      等待时间: {{ step.waitTime }} 秒
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'ViewTaskPage',
  data() {
    return {
      task: {
        id: '',
        name: '',
        steps: [],
        loop: false
      }
    };
  },
  mounted() {
    this.loadTask();
  },
  methods: {
    loadTask() {
      const taskId = this.$route.params.id;
      const savedTasks = localStorage.getItem('compositeTasks');
      
      if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        const foundTask = tasks.find(t => t.id === taskId);
        if (foundTask) {
          this.task = foundTask;
          return;
        }
      }
      
      const defaultTasks = [
        { id: '1', name: 'A1层', steps: [{ name: '导航点1' }, { name: '导航点2' }, { name: '导航点3' }], loop: false },
        { id: '2', name: 'A2层', steps: [{ name: '导航点1' }, { name: '导航点2' }, { name: '导航点3' }], loop: false },
        { id: '3', name: 'B1层', steps: [{ name: '导航点1' }, { name: '导航点2' }, { name: '导航点3' }], loop: false },
        { id: '4', name: 'B2层', steps: [{ name: '导航点1' }, { name: '导航点2' }, { name: '导航点3' }], loop: false },
        { id: '5', name: '地图切换', steps: [{ name: '起始点 origin' }, { name: '导航点 start' }, { name: '导航点 end' }], loop: false },
        { id: '6', name: '测试任务1', steps: [{ name: '导航点1' }, { name: '导航点2' }, { name: '导航点3' }], loop: false },
        { id: '7', name: '测试任务2', steps: [{ name: '导航点1' }, { name: '导航点2' }, { name: '导航点3' }], loop: false },
        { id: '8', name: '任务任务3', steps: [{ name: '导航点 start' }, { name: '导航点 end' }], loop: false }
      ];
      
      const foundTask = defaultTasks.find(t => t.id === taskId);
      if (foundTask) {
        this.task = foundTask;
      }
    },
    executeTask() {
      alert(`任务 "${this.task.name}" 开始执行`);
      this.$router.push('/main');
    }
  }
};
</script>
