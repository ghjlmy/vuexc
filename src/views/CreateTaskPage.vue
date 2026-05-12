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
        <div class="flex-1 overflow-y-auto p-4">
          <div class="space-y-4">
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
                  路径列表
                </span>
                <span class="text-xs text-gray-500">{{ pathList.length }}条</span>
              </h3>
              <div class="space-y-1 max-h-36 overflow-y-auto">
                <div
                  v-for="path in pathList"
                  :key="path.id"
                  @click="addPathToTask(path)"
                  class="flex items-center justify-between p-2 rounded border border-gray-200 text-xs cursor-pointer hover:bg-gray-50 transition"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: path.color }"></div>
                    <span>{{ path.name }}</span>
                  </div>
                  <button @click.stop="addPathToTask(path)" class="text-primary hover:text-primary/80">
                    <i class="fa fa-plus-circle"></i>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 class="font-bold text-gray-800 mb-2 flex items-center justify-between">
                <span class="flex items-center gap-1">
                  <i class="fa fa-train text-primary"></i>
                  轨道列表
                </span>
                <span class="text-xs text-gray-500">{{ trackList.length }}条</span>
              </h3>
              <div class="space-y-1 max-h-36 overflow-y-auto">
                <div
                  v-for="track in trackList"
                  :key="track.id"
                  @click="addTrackToTask(track)"
                  class="flex items-center justify-between p-2 rounded border border-gray-200 text-xs cursor-pointer hover:bg-gray-50 transition"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: track.color }"></div>
                    <span>{{ track.name }}</span>
                  </div>
                  <button @click.stop="addTrackToTask(track)" class="text-primary hover:text-primary/80">
                    <i class="fa fa-plus-circle"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <h3 class="font-bold text-gray-800 mb-2 flex items-center gap-1 mt-4">
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
                    <span :class="['text-xs px-1.5 py-0.5 rounded', step.type === 'point' ? 'bg-blue-100 text-blue-600' : (step.type === 'path' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600')]">
                      {{ step.type === 'point' ? '点位' : (step.type === 'path' ? '路径' : '轨道') }}
                    </span>
                  </div>
                  <button @click="removeStep(index)" class="text-gray-400 hover:text-danger transition">
                    <i class="fa fa-times"></i>
                  </button>
                </div>
                <div class="pl-8 space-y-2 text-xs">
                  <div v-if="step.type === 'point'" class="flex items-center gap-2">
                    <span class="text-gray-600">动作:</span>
                    <select v-model="step.action" class="border border-gray-200 rounded px-2 py-1 text-xs">
                      <option value="navigate">导航</option>
                      <option value="charge">自动充电</option>
                      <option value="wait">等待</option>
                    </select>
                  </div>
                  <div v-if="step.type === 'path' || step.type === 'track'" class="flex items-center gap-2">
                    <span class="text-gray-600">方向:</span>
                    <select v-model="step.direction" class="border border-gray-200 rounded px-2 py-1 text-xs">
                      <option value="forward">正向</option>
                      <option value="reverse">反向</option>
                    </select>
                  </div>
                  <div v-if="step.type === 'path' || step.type === 'track'" class="flex items-center gap-2">
                    <span class="text-gray-600">曲度:</span>
                    <input type="range" v-model.number="step.curveIntensity" min="-100" max="100" class="flex-1" />
                    <span class="w-8 text-right">{{ step.curveIntensity || 0 }}</span>
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
          <div class="grid grid-cols-2 gap-4 mb-4">
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
            <div class="w-40">
              <label class="text-sm text-gray-600 block mb-1">运行速度</label>
              <div class="flex items-center gap-1">
                <input
                  type="number"
                  v-model.number="newTaskConfig.speed"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="速度"
                />
                <span class="text-xs text-gray-500 whitespace-nowrap">mm/s</span>
              </div>
            </div>
            <button @click="clearSteps" class="px-3 py-2 border border-gray-200 text-gray-600 rounded-md text-sm hover:bg-gray-50 transition mt-5">
              <i class="fa fa-trash-o mr-1"></i>清空步骤
            </button>
          </div>
        </div>

        <div class="flex-1 m-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="h-full relative" 
               ref="mapContainer"
               @mousedown="startDrag"
               @mousemove="onDrag"
               @mouseup="stopDrag"
               @mouseleave="stopDrag"
               @wheel="onWheel"
          >
            <img src="/src/assets/image.png" alt="地图背景" class="w-full h-full object-cover pointer-events-none" :style="{ transform: `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`, transformOrigin: 'center center', transition: isDragging ? 'none' : 'transform 0.1s' }" />
            <svg class="absolute inset-0 w-full h-full" :style="{ transform: `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`, transformOrigin: 'center center', transition: isDragging ? 'none' : 'transform 0.1s' }">

              <g v-for="point in pointsList" :key="point.id">
                <circle
                  :cx="point.x"
                  :cy="point.y"
                  r="25"
                  fill="transparent"
                  :style="{ cursor: isDragging ? 'grabbing' : 'pointer' }"
                  @click.stop="!isDragging && addPointToTask(point)"
                />
                <circle
                  :cx="point.x"
                  :cy="point.y"
                  r="10"
                  fill="#409eff"
                  stroke="white"
                  stroke-width="2"
                />
                <text
                  :x="point.x"
                  :y="point.y + 25"
                  text-anchor="middle"
                  font-size="11"
                  fill="#333"
                  class="font-medium"
                >{{ point.name }}</text>
              </g>
            </svg>

            <div class="absolute top-4 left-4 bg-blue-50 p-3 rounded shadow text-xs text-blue-700">
              <i class="fa fa-info-circle mr-1"></i>
              点击地图上的点位添加到任务步骤，鼠标滚轮缩放，拖动平移
            </div>

            <div class="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
              <button @click="zoomIn" class="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded hover:border-primary transition shadow-sm">
                <i class="fa fa-plus"></i>
              </button>
              <button @click="resetZoom" class="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded hover:border-primary transition shadow-sm">
                <i class="fa fa-dot-circle-o"></i>
              </button>
              <button @click="zoomOut" class="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded hover:border-primary transition shadow-sm">
                <i class="fa fa-minus"></i>
              </button>
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
        trackMode: false,
        scheduled: false,
        scheduledTime: '',
        speed: 500
      },
      dragIndex: null,
      zoomLevel: 1,
      translateX: 0,
      translateY: 0,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      pointsList: [
        { id: 'P001', name: '入库口', x: 180, y: 380 },
        { id: 'P002', name: '分拣区', x: 220, y: 380 },
        { id: 'P003', name: '充电位', x: 220, y: 250 },
        { id: 'P004', name: '导航点1', x: 350, y: 250 },
        { id: 'P005', name: '导航点2', x: 350, y: 380 },
        { id: 'P006', name: '停车点', x: 480, y: 380 },
        { id: 'P007', name: '末端位置', x: 480, y: 250 }
      ],
      pathList: [
        { id: 'PA001', name: 'PA001-入库到分拣', color: '#409eff', direction: 'forward', curveIntensity: 0 },
        { id: 'PA002', name: 'PA002-分拣到充电', color: '#67c23a', direction: 'reverse', curveIntensity: -20 },
        { id: 'PA003', name: 'PA003-充电到导航', color: '#409eff', direction: 'forward', curveIntensity: 30 }
      ],
      trackList: [
        { id: 'T1', name: '轨道1-入库到分拣', color: '#409eff', curveIntensity: 0 },
        { id: 'T2', name: '轨道2-分拣到充电', color: '#67c23a', curveIntensity: -20 }
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
    addPathToTask(path) {
      this.newTaskSteps.push({
        type: 'path',
        id: path.id,
        name: path.name,
        direction: path.direction || 'forward',
        curveIntensity: path.curveIntensity || 0,
        color: path.color
      });
    },
    addTrackToTask(track) {
      this.newTaskSteps.push({
        type: 'track',
        id: track.id,
        name: track.name,
        direction: 'forward',
        curveIntensity: track.curveIntensity || 0,
        color: track.color
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
        trackMode: this.newTaskConfig.trackMode,
        speed: this.newTaskConfig.speed
      });

      localStorage.setItem('compositeTasks', JSON.stringify(tasks));

      this.goBack();
    },
    zoomIn() {
      this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2);
    },
    zoomOut() {
      this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
    },
    resetZoom() {
      this.zoomLevel = 1;
      this.translateX = 0;
      this.translateY = 0;
    },
    startDrag(e) {
      if (e.button !== 0) return;
      this.isDragging = true;
      this.dragStartX = e.clientX - this.translateX;
      this.dragStartY = e.clientY - this.translateY;
    },
    onDrag(e) {
      if (!this.isDragging) return;
      e.preventDefault();
      this.translateX = e.clientX - this.dragStartX;
      this.translateY = e.clientY - this.dragStartY;
    },
    stopDrag() {
      this.isDragging = false;
    },
    onWheel(e) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.min(Math.max(this.zoomLevel + delta, 0.5), 2);
      this.zoomLevel = newZoom;
    }
  }
};
</script>
