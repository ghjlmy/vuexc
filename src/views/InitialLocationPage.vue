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
          <svg id="mapSvg" class="absolute inset-0 w-full h-full" @click="handleMapClick">

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
          </svg>
        </div>
        <div class="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-2 rounded-lg text-xs text-gray-500">
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
            <button @click="initPosition()" class="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition flex items-center justify-center gap-2">
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

        <div class="p-4 border-b border-gray-200">
          <h3 class="font-semibold text-gray-dark mb-3 flex items-center gap-2">
            <i class="fa fa-parking text-primary"></i>
            停车点定位
          </h3>
          <div class="space-y-3">
            <div class="text-sm text-gray-500">
              设置停车位（唯一点位），开机和关机时小车都要在这个点
            </div>
            <select v-model="parkingPointId" class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
              <option v-for="point in pointsList" :key="point.id" :value="point.id">{{ point.name }}</option>
            </select>
            <div class="flex items-center justify-between bg-success/10 p-2 rounded-lg text-sm">
              <span class="text-success">当前停车位: {{ getParkingPointName() }}</span>
              <i class="fa fa-check-circle text-success"></i>
            </div>
          </div>
        </div>

        <div class="p-4 flex-1">
          <h3 class="font-semibold text-gray-dark mb-3 flex items-center gap-2">
            <i class="fa fa-th-list text-primary"></i>
            点面板
          </h3>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div v-for="point in pointsList" :key="point.id" @click="selectPoint(point)" :class="selectedPoint?.id === point.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'" class="p-2 border rounded-lg cursor-pointer">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">{{ point.name }}</span>
                <span v-if="point.type" class="text-xs px-2 py-0.5 rounded" :class="point.type === 'charge' ? 'bg-orange-100 text-orange-600' : (point.type === 'location' ? 'bg-purple-100 text-purple-600' : (point.type === 'parking' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'))">
                  {{ point.type === 'charge' ? '充电' : (point.type === 'location' ? '定位' : (point.type === 'parking' ? '停车' : '导航')) }}
                </span>
              </div>
              <div class="text-xs text-gray-500 mt-1">X: {{ point.x }}, Y: {{ point.y }}</div>
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
    handleMapClick(event) {
      const svg = event.currentTarget;
      const rect = svg.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      console.log('Map clicked at:', x, y);
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
      this.locationFeedback = `已定位到 ${this.selectedPoint.name}`;
    },
    getParkingPointName() {
      const point = this.pointsList.find(p => p.id === this.parkingPointId);
      return point ? point.name : '';
    }
  }
};
</script>
