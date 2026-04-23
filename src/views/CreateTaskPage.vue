<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between z-20 flex-shrink-0">
      <div class="flex items-center gap-2">
        <button @click="goBack" class="flex items-center gap-2 text-primary hover:text-primary/80 transition">
          <i class="fa fa-arrow-left"></i>
          <span>返回</span>
        </button>
      </div>
      <h1 class="text-lg font-bold text-gray-800">新建任务</h1>
      <div class="flex items-center gap-2">
        <button @click="goBack" class="px-6 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition">
          取消
        </button>
        <button @click="createTask" :disabled="!newTaskName.trim() || nameDuplicate" class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed">
          创建任务
        </button>
      </div>
    </header>

    <main class="flex-1 flex overflow-hidden">
      <aside class="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <!-- <div class="flex border-b border-gray-200">
         <div
          
          
            class="flex-1 py-3 text-sm font-medium transition"
          >
            <i class="fa fa-list mr-1"></i>资源列表
          </div>
          
        </div> -->

        <div class="flex-1 overflow-y-auto p-4">
          <div  class="space-y-4">
            <div>
              <h3 class="font-bold text-gray-800 mb-2 flex items-center gap-1">
                <i class="fa fa-map-marker text-primary"></i>
                可用点位
              </h3>
              <div class="space-y-1 max-h-48 overflow-y-auto">
                <div
                  v-for="point in pointsList"
                  :key="point.id"
                  @click="addPointToTask(point)"
                  class="flex items-center gap-2 p-2 rounded hover:bg-gray-50 text-xs cursor-pointer transition"
                >
                  <div class="w-3 h-3 rounded-full bg-primary"></div>
                  <span>{{ point.name }}</span>
                  <button @click.stop="addPointToTask(point)" class="ml-auto text-primary hover:text-primary/80">
                    <i class="fa fa-plus-circle"></i>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 class="font-bold text-gray-800 mb-2 flex items-center justify-between">
                <span class="flex items-center gap-1">
                  <i class="fa fa-road text-primary"></i>
                  轨道列表
                </span>
                <span class="text-xs text-gray-500">{{ tracksList.length }}条</span>
              </h3>
              <div class="space-y-1 max-h-36 overflow-y-auto">
                <div
                  v-for="track in tracksList"
                  :key="track.id"
                  class="flex items-center justify-between p-2 rounded border border-gray-200 text-xs"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: track.color }"></div>
                    <span>{{ track.name }}</span>
                  </div>
                  <span class="text-gray-400">{{ track.direction === 'single' ? '单线' : '双向' }}</span>
                </div>
              </div>
            </div>
          </div>

          <h3 class="font-bold text-gray-800 mb-2 flex items-center gap-1">
                 <i class="fa fa-list mr-1 text-primary"></i>任务步骤
              </h3>
          <div class="space-y-2">
            <div class="flex items-center gap-2 mb-3 text-sm">
              <span class="text-gray-600">共</span>
              <span class="font-bold text-primary">{{ newTaskSteps.length }}</span>
              <span class="text-gray-600">步</span>
            </div>

            <div v-if="newTaskSteps.length === 0" class="h-40 flex flex-col items-center justify-center text-gray-400">
              <i class="fa fa-list-ul text-4xl mb-3"></i>
              <p class="text-sm text-center">从资源列表或地图选择点位添加</p>
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="(step, index) in newTaskSteps"
                :key="index"
                :draggable="true"
                @dragstart="onDragStart($event, index)"
                @dragover.prevent="onDragOver($event, index)"
                @drop="onDrop($event, index)"
                class="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition cursor-move"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <i class="fa fa-grip-vertical text-gray-400"></i>
                    <span class="inline-flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold mr-2">
                      {{ index + 1 }}
                    </span>
                    <span class="text-sm font-medium text-gray-800">{{ step.name }}</span>
                  </div>
                  <button @click="removeStep(index)" class="text-gray-400 hover:text-danger transition">
                    <i class="fa fa-times"></i>
                  </button>
                </div>
                <div class="pl-8 space-y-2 text-xs">
                  <div class="flex items-center gap-2">
                    <span class="text-gray-600">动作:</span>
                    <select v-model="step.action" class="border border-gray-200 rounded px-2 py-1 text-xs">
                      <option value="navigate">导航</option>
                      <option value="charge">自动充电</option>
                      <option value="wait">等待</option>
                    </select>
                  </div>
                  <div v-if="step.action === 'wait'" class="flex items-center gap-2">
                    <span class="text-gray-600">等待时间:</span>
                    <input type="number" v-model.number="step.waitTime" min="0" class="w-20 border border-gray-200 rounded px-2 py-1 text-xs" placeholder="秒" />
                    <span class="text-gray-500">秒</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <section class="flex-1 bg-gray-50 flex flex-col overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <div class="grid grid-cols-3 gap-4 mb-4">
            <label class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span class="text-sm text-gray-800">循环执行</span>
              <input type="checkbox" v-model="newTaskConfig.loop" class="w-4 h-4 accent-primary" />
            </label>
            <label class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span class="text-sm text-gray-800">轨道模式</span>
              <input type="checkbox" v-model="newTaskConfig.trackMode" class="w-4 h-4 accent-primary" />
            </label>
            <label class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span class="text-sm text-gray-800">定时任务</span>
              <input type="checkbox" v-model="newTaskConfig.scheduled" class="w-4 h-4 accent-primary" />
            </label>
          </div>

          <div v-if="newTaskConfig.scheduled" class="mb-4">
            <label class="text-sm text-gray-600 block mb-1">定时时间</label>
            <input type="datetime-local" v-model="newTaskConfig.scheduledTime" class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>

          <div class="flex items-center gap-4">
            <div class="flex-1">
              <label class="text-sm text-gray-600 block mb-1">任务名称</label>
              <input
                v-model="newTaskName"
                type="text"
                :class="nameDuplicate ? 'border-danger focus:ring-danger' : 'border-gray-200 focus:ring-primary'"
                class="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1"
                placeholder="请输入任务名称"
              />
              <div v-if="nameDuplicate" class="text-xs text-danger mt-1">
                <i class="fa fa-exclamation-circle mr-1"></i>任务名称已存在
              </div>
            </div>
            <button @click="clearSteps" class="px-3 py-2 border border-gray-200 text-gray-600 rounded-md text-sm hover:bg-gray-50 transition">
              <i class="fa fa-trash-o mr-1"></i>清空步骤
            </button>
          </div>
        </div>

        <div class="flex-1 m-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="h-full relative">
            <img src="/src/assets/image.png" alt="地图背景" class="w-full h-full object-cover" />
            <svg class="absolute inset-0 w-full h-full" @click="handleMapAddStep">
              
              <g v-for="point in pointsList" :key="point.id">
                <circle
                  :cx="point.x"
                  :cy="point.y"
                  r="25"
                  fill="transparent"
                  class="cursor-pointer hover:bg-blue-50 hover:opacity-50"
                  @click.stop="addPointToTask(point)"
                />
                <circle
                  :cx="point.x"
                  :cy="point.y"
                  r="10"
                  fill="#409eff"
                  stroke="white"
                  stroke-width="2"
                  class="pointer-events-none"
                />
                <text
                  :x="point.x"
                  :y="point.y + 25"
                  text-anchor="middle"
                  font-size="11"
                  fill="#333"
                  class="pointer-events-none font-medium"
                >{{ point.name }}</text>
              </g>
            </svg>

            <div class="absolute top-4 left-4 bg-blue-50 p-3 rounded shadow text-xs text-blue-700">
              <i class="fa fa-info-circle mr-1"></i>
              点击地图上的点位添加到任务步骤
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'CreateTaskPage',
  data() {
    return {
      activeLeftTab: 'resources',
      newTaskName: '',
      newTaskSteps: [],
      newTaskConfig: {
        loop: false,
        trackMode: false,
        scheduled: false,
        scheduledTime: ''
      },
      dragIndex: null,
      pointsList: [
        { id: 'P001', name: '入库口', x: 180, y: 380 },
        { id: 'P002', name: '分拣区', x: 220, y: 380 },
        { id: 'P003', name: '充电位', x: 220, y: 250 },
        { id: 'P004', name: '导航点1', x: 350, y: 250 },
        { id: 'P005', name: '导航点2', x: 350, y: 380 },
        { id: 'P006', name: '停车点', x: 480, y: 380 },
        { id: 'P007', name: '末端位置', x: 480, y: 250 }
      ],
      tracksList: [
        {
          id: 'T1',
          name: '轨道1-入库到分拣',
          direction: 'single',
          color: '#409eff'
        },
        {
          id: 'T2',
          name: '轨道2-分拣到充电',
          direction: 'bidirectional',
          color: '#67c23a'
        }
      ],
      taskList: []
    };
  },
  computed: {
    nameDuplicate() {
      return this.taskList.some(task => task.name === this.newTaskName.trim());
    }
  },
  mounted() {
    const savedTasks = localStorage.getItem('compositeTasks');
    if (savedTasks) {
      this.taskList = JSON.parse(savedTasks);
    }
  },
  methods: {
    goBack() {
      this.$router.push('/composite-task');
    },
    handleMapAddStep() {},
    addPointToTask(point) {
      this.newTaskSteps.push({
        type: 'point',
        id: point.id,
        name: point.name,
        action: 'navigate',
        waitTime: 0
      });
    },
    removeStep(index) {
      this.newTaskSteps.splice(index, 1);
    },
    clearSteps() {
      if (confirm('确定要清空所有任务步骤吗？')) {
        this.newTaskSteps = [];
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
        const item = this.newTaskSteps[this.dragIndex];
        this.newTaskSteps.splice(this.dragIndex, 1);
        this.newTaskSteps.splice(index, 0, item);
      }
      this.dragIndex = null;
    },
    createTask() {
      if (!this.newTaskName.trim()) {
        alert('请输入任务名称');
        return;
      }
      
      if (this.nameDuplicate) {
        alert('任务名称已存在，请使用其他名称');
        return;
      }

      const savedTasks = localStorage.getItem('compositeTasks');
      let tasks = savedTasks ? JSON.parse(savedTasks) : [];
      
      const newId = (tasks.length + 1).toString();
      tasks.unshift({
        id: newId,
        name: this.newTaskName.trim(),
        steps: [...this.newTaskSteps],
        loop: this.newTaskConfig.loop
      });

      localStorage.setItem('compositeTasks', JSON.stringify(tasks));

      this.goBack();
    }
  }
};
</script>
