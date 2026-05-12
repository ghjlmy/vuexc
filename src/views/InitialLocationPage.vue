<template>
  <div id="initial-location-page" class="bg-gray-50 min-h-screen flex flex-col">
    <header class="bg-white shadow-sm border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="$router.push('/main')" class="flex items-center gap-2 text-primary hover:text-primary/80 transition">
          <i class="fa fa-arrow-left"></i>
          <span>返回</span>
        </button>
        <h1 class="text-lg font-bold text-gray-800">初始定位</h1>
      </div>
      <div class="flex items-center gap-3">
        <label class="flex items-center gap-2 text-sm">
          <span class="text-gray-dark">定点启动</span>
          <input type="checkbox" v-model="fixedStartEnabled" class="accent-primary w-4 h-4" />
        </label>
      </div>
    </header>

    <main class="flex-1 flex overflow-hidden">
      <section class="flex-1 relative overflow-hidden bg-white border-r border-gray-200">
        <div class="absolute inset-0">
          <img src="/src/assets/image.png" alt="地图背景" class="w-full h-full object-cover" />
          <svg id="mapSvg" class="absolute inset-0 w-full h-full"
            @mousedown="handleMapMouseDown"
            @mousemove="handleMapMouseMove"
            @mouseup="handleMapMouseUp"
            @mouseleave="handleMapMouseUp"
          >

            <g id="pathsLayer">
              <path d="M 180 380 L 220 380 L 220 250 L 280 250 L 280 450 L 380 450" stroke="#4080FF" stroke-width="3" fill="none" stroke-dasharray="8,4" opacity="0.9"/>
            </g>

            <g id="pointsLayer">
              <g v-for="point in pointsList" :key="point.id" @click.stop="selectPoint(point)" class="cursor-pointer">
                <circle :cx="point.x" :cy="point.y" :r="point.type === 'parking' ? 10 : 8" :fill="point.type === 'charge' ? '#EE9A49' : (point.type === 'location' ? '#9b59b6' : (point.type === 'parking' ? '#3498db' : '#62C462'))" stroke="white" stroke-width="2"/>
                <circle :cx="point.x" :cy="point.y" r="3" fill="white"/>
                <text :x="point.x" :y="point.y + 22" text-anchor="middle" font-size="10" fill="#333">{{ point.name }}</text>
                <text v-if="point.type === 'charge'" :x="point.x" :y="point.y + 34" text-anchor="middle" font-size="8" fill="#333">⚡</text>
                <text v-if="point.type === 'parking'" :x="point.x" :y="point.y - 15" text-anchor="middle" font-size="10" fill="#3498db">P</text>
              </g>
            </g>

            <g v-if="selectedPoint" class="pointer-events-none">
              <circle :cx="selectedPoint.x" :cy="selectedPoint.y" r="15" fill="none" stroke="#4080FF" stroke-width="2" stroke-dasharray="5,5">
                <animate attributeName="r" values="15;20;15" dur="1.5s" repeatCount="indefinite"/>
              </circle>
            </g>

            <g v-if="carPosition">
              <circle :cx="carPosition.x" :cy="carPosition.y" r="14" fill="#4080FF" stroke="white" stroke-width="2" opacity="0.9"/>
              <circle :cx="carPosition.x" :cy="carPosition.y" r="5" fill="white"/>
              <line
                :x1="carPosition.x"
                :y1="carPosition.y"
                :x2="carPosition.x + Math.cos((carPosition.rotation - 90) * Math.PI / 180) * 30"
                :y2="carPosition.y + Math.sin((carPosition.rotation - 90) * Math.PI / 180) * 30"
                stroke="#4080FF"
                stroke-width="3"
                stroke-linecap="round"
              />
              <polygon
                :points="getCarArrowPoints()"
                fill="#4080FF"
                opacity="0.9"
              />
              <circle :cx="carPosition.x" :cy="carPosition.y" r="20" fill="none" stroke="#4080FF" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
            </g>
          </svg>
        </div>
        <div v-if="isPositioning" class="absolute bottom-4 left-4 bg-primary/90 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
          <i class="fa fa-hand-pointer-o mr-1"></i>
          按住鼠标左键确定小车位置，移动鼠标旋转方向，松手确认
        </div>
        <div v-else class="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-2 rounded-lg text-xs text-gray-500">
          <i class="fa fa-info-circle mr-1"></i>
          点击地图或选择点位进行定位
        </div>
      </section>

      <aside class="w-80 bg-white flex flex-col flex-shrink-0 overflow-y-auto">
        <div class="p-4 border-b border-gray-200">
          <h3 class="font-semibold text-gray-dark mb-3 flex items-center gap-2">
            <i class="fa fa-hand-pointer-o text-primary"></i>
            手动定位
          </h3>
          <div class="space-y-3">
            <button @click="startPositioning()" class="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition flex items-center justify-center gap-2">
              <i class="fa fa-map-marker"></i>
              初始化位置设置
            </button>
            <button @click="relocate()" class="w-full py-2 bg-success text-white rounded-md hover:bg-success/90 transition flex items-center justify-center gap-2">
              <i class="fa fa-refresh"></i>
              重定位
            </button>
          </div>
        </div>

        <div class="p-4 border-b border-gray-200">
          <h3 class="font-semibold text-gray-dark mb-3 flex items-center gap-2">
            <i class="fa fa-list text-primary"></i>
            选点定位
          </h3>
          <div class="space-y-3">
            <select v-model="selectedPointId" class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
              <option value="">请选择点位</option>
              <option v-for="point in pointsList" :key="point.id" :value="point.id">{{ point.name }}</option>
            </select>
            <button @click="confirmLocation()" class="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition flex items-center justify-center gap-2">
              <i class="fa fa-check"></i>
              确认定位
            </button>
            <div class="bg-gray-50 p-3 rounded-lg text-sm">
              <div class="flex items-center gap-2 mb-2">
                <i class="fa fa-info-circle text-primary"></i>
                <span class="font-medium">定位反馈</span>
              </div>
              <p class="text-gray-600">{{ locationFeedback }}</p>
            </div>
          </div>
        </div>

        <div class="p-4 border-b border-gray-200" :class="!fixedStartEnabled ? 'opacity-50 pointer-events-none' : ''">
          <h3 class="font-semibold text-gray-dark mb-3 flex items-center gap-2">
            <i class="fa fa-parking text-primary"></i>
            停车点定位
            <span v-if="!fixedStartEnabled" class="text-xs text-gray-400 ml-auto">需开启定点启动</span>
          </h3>
          <div class="space-y-3">
            <div class="text-sm text-gray-500">
              设置停车位（唯一点位），开机和关机时小车都要在这个点
            </div>
            <select v-model="parkingPointId" :disabled="!fixedStartEnabled" class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" :class="!fixedStartEnabled ? 'bg-gray-100' : ''">
              <option v-for="point in pointsList" :key="point.id" :value="point.id">{{ point.name }}</option>
            </select>
            <div v-if="fixedStartEnabled" class="flex items-center justify-between bg-success/10 p-2 rounded-lg text-sm">
              <span class="text-success">当前停车位: {{ getParkingPointName() }}</span>
              <i class="fa fa-check-circle text-success"></i>
            </div>
            <div v-else class="flex items-center justify-between bg-gray-100 p-2 rounded-lg text-sm">
              <span class="text-gray-400">请先开启定点启动</span>
              <i class="fa fa-lock text-gray-400"></i>
            </div>
          </div>
        </div>

        <div v-if="carPosition" class="p-4 flex-1">
          <h3 class="font-semibold text-gray-dark mb-3 flex items-center gap-2">
            <i class="fa fa-location-arrow text-primary"></i>
            当前位置
          </h3>
          <div class="bg-gray-50 p-3 rounded-lg text-sm space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-500">X坐标:</span>
              <span class="font-medium">{{ carPosition.x.toFixed(1) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Y坐标:</span>
              <span class="font-medium">{{ carPosition.y.toFixed(1) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">方向:</span>
              <span class="font-medium">{{ carPosition.rotation.toFixed(1) }}°</span>
            </div>
          </div>
        </div>
      </aside>
    </main>

    <div v-if="showInitDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-80 text-center">
        <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fa fa-check-circle text-3xl text-primary"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-dark mb-2">初始化完成</h3>
        <p class="text-gray-500 text-sm mb-4">已完成初始化位置设置</p>
        <button @click="showInitDialog = false" class="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition">
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InitialLocationPage',
  data() {
    return {
      fixedStartEnabled: false,
      selectedPointId: '',
      selectedPoint: null,
      parkingPointId: 'P008',
      locationFeedback: '等待定位...',
      showInitDialog: false,
      isPositioning: false,
      isDraggingDirection: false,
      carPosition: null,
      pointsList: [
        { id: 'P001', name: 'P001 - 入库口', x: 180, y: 380, type: 'nav' },
        { id: 'P002', name: 'P002 - 分拣区', x: 220, y: 380, type: 'nav' },
        { id: 'P003', name: 'P003 - 充电位', x: 380, y: 450, type: 'charge' },
        { id: 'P004', name: 'P004 - 导航1', x: 220, y: 250, type: 'nav' },
        { id: 'P005', name: 'P005 - 导航2', x: 280, y: 250, type: 'nav' },
        { id: 'P006', name: 'P006 - 导航3', x: 280, y: 450, type: 'nav' },
        { id: 'P007', name: 'P007 - 定位点1', x: 320, y: 320, type: 'location' },
        { id: 'P008', name: 'P008 - 停车点', x: 350, y: 380, type: 'parking' }
      ]
    };
  },
  watch: {
    selectedPointId(newVal) {
      if (newVal) {
        this.selectedPoint = this.pointsList.find(p => p.id === newVal);
      } else {
        this.selectedPoint = null;
      }
    }
  },
  methods: {
    startPositioning() {
      this.isPositioning = true;
      this.locationFeedback = '请在地图上按住鼠标左键确定小车位置';
      this.carPosition = null;
    },
    handleMapMouseDown(event) {
      if (!this.isPositioning) return;
      const svg = event.currentTarget;
      const rect = svg.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.carPosition = { x, y, rotation: 0 };
      this.isDraggingDirection = true;
      this.locationFeedback = '按住鼠标移动，旋转方向，松手确认';
    },
    handleMapMouseMove(event) {
      if (!this.isDraggingDirection || !this.carPosition) return;
      const svg = event.currentTarget;
      const rect = svg.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const angle = Math.atan2(y - this.carPosition.y, x - this.carPosition.x) * 180 / Math.PI + 90;
      this.carPosition.rotation = angle;
    },
    handleMapMouseUp() {
      if (this.isDraggingDirection && this.carPosition) {
        this.isDraggingDirection = false;
        this.isPositioning = false;
        this.locationFeedback = `位置已确定 (${this.carPosition.x.toFixed(0)}, ${this.carPosition.y.toFixed(0)})，方向 ${this.carPosition.rotation.toFixed(1)}°`;
      }
    },
    getCarArrowPoints() {
      if (!this.carPosition) return '';
      const angle = (this.carPosition.rotation - 90) * Math.PI / 180;
      const tipLen = 30;
      const tipX = this.carPosition.x + Math.cos(angle) * tipLen;
      const tipY = this.carPosition.y + Math.sin(angle) * tipLen;
      const base1X = tipX + Math.cos(angle + Math.PI * 0.8) * 10;
      const base1Y = tipY + Math.sin(angle + Math.PI * 0.8) * 10;
      const base2X = tipX + Math.cos(angle - Math.PI * 0.8) * 10;
      const base2Y = tipY + Math.sin(angle - Math.PI * 0.8) * 10;
      return `${tipX},${tipY} ${base1X},${base1Y} ${base2X},${base2Y}`;
    },
    selectPoint(point) {
      this.selectedPoint = point;
      this.selectedPointId = point.id;
    },
    initPosition() {
      this.locationFeedback = '正在初始化位置...';
      setTimeout(() => {
        this.locationFeedback = '初始化完成';
        this.showInitDialog = true;
      }, 1000);
    },
    relocate() {
      this.locationFeedback = '正在重新定位...';
      setTimeout(() => {
        this.locationFeedback = '重定位完成，匹配度 98%';
      }, 1000);
    },
    confirmLocation() {
      if (!this.selectedPoint) {
        alert('请先选择点位');
        return;
      }
      this.carPosition = {
        x: this.selectedPoint.x,
        y: this.selectedPoint.y,
        rotation: 0
      };
      this.locationFeedback = `已定位到 ${this.selectedPoint.name}`;
    },
    getParkingPointName() {
      const point = this.pointsList.find(p => p.id === this.parkingPointId);
      return point ? point.name : '';
    }
  }
};
</script>
