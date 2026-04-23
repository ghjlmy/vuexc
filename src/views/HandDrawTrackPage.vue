<template>
  <div class="bg-gray-50 min-h-screen flex flex-col">
    <header class="bg-white shadow-sm border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="$router.push('/main')" class="flex items-center gap-2 text-primary hover:text-primary/80 transition">
          <i class="fa fa-arrow-left"></i>
          <span>返回</span>
        </button>
        <h1 class="text-lg font-bold text-gray-800">手绘轨道</h1>
      </div>
      <div class="flex items-center gap-3">
        <button @click="saveTracks" class="bg-success hover:bg-success/90 text-white px-4 py-1.5 rounded flex items-center gap-1 transition">
          <i class="fa fa-save"></i>
          <span>保存轨道</span>
        </button>
      </div>
    </header>

    <main class="flex-1 flex overflow-hidden">
      <section class="flex-1 bg-white m-4 rounded shadow-sm overflow-hidden relative">
        <img src="/src/assets/image.png" alt="地图背景" class="w-full h-full object-cover" />
        <svg class="absolute inset-0 w-full h-full" @click="handleMapClick" @contextmenu.prevent="handleRightClick" @dblclick="finishCreate">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
          </defs>

          <g v-for="track in tracks" :key="track.id">
            <path
              :d="getTrackPath(track)"
              :stroke="track.color"
              stroke-width="5"
              fill="none"
              stroke-linecap="round"
              :marker-end="track.direction === 'single' ? 'url(#arrow)' : ''"
              class="cursor-pointer"
              @click.stop="selectTrack(track)"
            />
            <circle
              v-if="selectedTrackId === track.id"
              :cx="track.controlX || ((track.startPoint.x + track.endPoint.x) / 2)"
              :cy="track.controlY || ((track.startPoint.y + track.endPoint.y) / 2)"
              r="8"
              fill="#e6a23c"
              stroke="white"
              stroke-width="2"
              class="cursor-move"
              @mousedown.stop="startDragControl(track)"
            />
          </g>

          <g v-for="point in points" :key="point.id">
            <circle
              :cx="point.x"
              :cy="point.y"
              r="25"
              fill="transparent"
              class="cursor-pointer"
              @click.stop="handlePointClick(point)"
            />
            <circle
              :cx="point.x"
              :cy="point.y"
              :r="creatingTrackStartPoint === point || creatingTrackEndPoint === point ? 12 : 10"
              :fill="getPointColor(point.type)"
              stroke="white"
              stroke-width="2"
              class="pointer-events-none hover:opacity-80"
            />
            <polygon
              :points="getArrowPoints(point)"
              :fill="getPointColor(point.type)"
              class="pointer-events-none"
            />
            <text
              :x="point.x"
              :y="point.y + 25"
              text-anchor="middle"
              font-size="12"
              fill="#333"
              class="pointer-events-none"
            >{{ point.name }}</text>
          </g>

          <path
            v-if="creatingTrackStartPoint && mousePosition"
            :d="`M${creatingTrackStartPoint.x},${creatingTrackStartPoint.y} Q${(creatingTrackStartPoint.x + mousePosition.x)/2},${(creatingTrackStartPoint.y + mousePosition.y)/2} ${mousePosition.x},${mousePosition.y}`"
            stroke="#666"
            stroke-width="3"
            stroke-dasharray="8 4"
            fill="none"
          />
        </svg>

        <div class="absolute top-4 left-4 flex gap-2 bg-white p-2 rounded shadow">
          <button @click="mode = 'create'" :class="mode === 'create' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'" class="px-3 py-1.5 rounded text-sm flex items-center gap-1">
            <i class="fa fa-plus"></i>
            创建轨道
          </button>
          <button @click="mode = 'addPoint'" :class="mode === 'addPoint' ? 'bg-success text-white' : 'bg-gray-100 text-gray-700'" class="px-3 py-1.5 rounded text-sm flex items-center gap-1">
            <i class="fa fa-map-marker"></i>
            添加点位
          </button>
          <button @click="mode = 'edit'" :class="mode === 'edit' ? 'bg-warning text-white' : 'bg-gray-100 text-gray-700'" class="px-3 py-1.5 rounded text-sm flex items-center gap-1">
            <i class="fa fa-pencil"></i>
            编辑轨道
          </button>
          <button v-if="mode === 'addPoint'" @click="undoLastPoint" class="px-3 py-1.5 rounded text-sm bg-gray-100 text-gray-700 flex items-center gap-1">
            <i class="fa fa-undo"></i>
            撤销点位
          </button>
        </div>

        <div v-if="mode === 'create'" class="absolute top-4 right-4 bg-blue-50 p-3 rounded shadow text-xs text-blue-700">
          <i class="fa fa-info-circle mr-1"></i>
          点击两个点位来创建轨道
        </div>
        <div v-if="mode === 'addPoint'" class="absolute top-4 right-4 bg-green-50 p-3 rounded shadow text-xs text-green-700">
          <i class="fa fa-info-circle mr-1"></i>
          在地图上点击添加新点位，右键撤销最后一个
        </div>
      </section>

      <aside class="w-64 bg-white border-l border-gray-200 flex flex-col shrink-0 p-4 overflow-y-auto">
        <div v-if="selectedTrack" class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-gray-700 flex items-center gap-1">
              <i class="fa fa-sliders text-primary"></i>
              轨道属性
            </h3>
            <button @click="deleteSelectedTrack" class="text-danger hover:text-danger/80 text-sm">
              <i class="fa fa-trash"></i>
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs text-gray-500 mb-1">轨道名称</label>
              <input v-model="selectedTrack.name" type="text" class="w-full px-2 py-1 border border-gray-200 rounded text-sm" />
            </div>

            <div>
              <label class="block text-xs text-gray-500 mb-1">轨道方向</label>
              <div class="flex gap-2">
                <button @click="selectedTrack.direction = 'single'" :class="selectedTrack.direction === 'single' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'" class="flex-1 py-1.5 rounded text-xs transition">
                  单线
                </button>
                <button @click="selectedTrack.direction = 'bidirectional'" :class="selectedTrack.direction === 'bidirectional' ? 'bg-success text-white' : 'bg-gray-200 text-gray-700'" class="flex-1 py-1.5 rounded text-xs transition">
                  双向
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs text-gray-500 mb-1">轨道颜色</label>
              <div class="flex gap-2">
                <button @click="selectedTrack.color = '#409eff'" :class="selectedTrack.color === '#409eff' ? 'ring-2 ring-offset-1 ring-gray-400' : ''" class="w-8 h-8 rounded" style="background-color: #409eff"></button>
                <button @click="selectedTrack.color = '#67c23a'" :class="selectedTrack.color === '#67c23a' ? 'ring-2 ring-offset-1 ring-gray-400' : ''" class="w-8 h-8 rounded" style="background-color: #67c23a"></button>
                <button @click="selectedTrack.color = '#e6a23c'" :class="selectedTrack.color === '#e6a23c' ? 'ring-2 ring-offset-1 ring-gray-400' : ''" class="w-8 h-8 rounded" style="background-color: #e6a23c"></button>
                <button @click="selectedTrack.color = '#f56c6c'" :class="selectedTrack.color === '#f56c6c' ? 'ring-2 ring-offset-1 ring-gray-400' : ''" class="w-8 h-8 rounded" style="background-color: #f56c6c"></button>
              </div>
            </div>

            <div>
              <label class="block text-xs text-gray-500 mb-1">曲度调整 (-100 到 100)</label>
              <div class="flex items-center gap-2">
                <input type="range" v-model.number="curveIntensity" min="-100" max="100" class="flex-1" @input="updateTrackCurve" />
                <span class="text-xs w-12 text-right">{{ curveIntensity }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-1">负值向左上方弯曲，正值向右下方弯曲</p>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <h3 class="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
            <i class="fa fa-list text-primary"></i>
            可用点位
          </h3>
          <div class="space-y-1 max-h-48 overflow-y-auto">
            <div
              v-for="point in points"
              :key="point.id"
              class="flex items-center gap-2 p-2 rounded hover:bg-gray-50 text-xs"
            >
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: getPointColor(point.type) }"></div>
              <span>{{ point.name }}</span>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <h3 class="text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
            <span class="flex items-center gap-1">
              <i class="fa fa-road text-primary"></i>
              轨道列表
            </span>
            <span class="text-xs text-gray-500">{{ tracks.length }}条</span>
          </h3>
          <div class="space-y-1 max-h-36 overflow-y-auto">
            <div
              v-for="track in tracks"
              :key="track.id"
              @click="selectTrack(track)"
              :class="selectedTrackId === track.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50 border-gray-200'"
              class="flex items-center justify-between p-2 rounded border text-xs cursor-pointer"
            >
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: track.color }"></div>
                <span>{{ track.name }}</span>
              </div>
              <span class="text-gray-400">{{ track.direction === 'single' ? '单线' : '双向' }}</span>
            </div>
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<script>
export default {
  name: 'HandDrawTrackPage',
  data() {
    return {
      points: [
        { id: 'P101', name: 'P101-入库口', x: 180, y: 380, type: 'nav', rotation: 0 },
        { id: 'P102', name: 'P102-分拣区', x: 220, y: 380, type: 'nav', rotation: 90 },
        { id: 'P103', name: 'P103-充电位', x: 220, y: 250, type: 'charge', rotation: 180 },
        { id: 'P104', name: 'P104-导航点', x: 350, y: 250, type: 'nav', rotation: 270 },
        { id: 'P105', name: 'P105-导航点', x: 350, y: 380, type: 'nav', rotation: 0 },
        { id: 'P106', name: 'P106-停车点', x: 480, y: 380, type: 'parking', rotation: 180 },
      ],
      tracks: [
        {
          id: 'T1',
          name: '轨道1-入库到分拣',
          startPoint: { id: 'P101', x: 180, y: 380 },
          endPoint: { id: 'P102', x: 220, y: 380 },
          controlX: 200,
          controlY: 330,
          curveIntensity: -50,
          direction: 'single',
          color: '#409eff',
        },
        {
          id: 'T2',
          name: '轨道2-分拣到充电',
          startPoint: { id: 'P102', x: 220, y: 380 },
          endPoint: { id: 'P103', x: 220, y: 250 },
          controlX: 170,
          controlY: 315,
          curveIntensity: -50,
          direction: 'bidirectional',
          color: '#67c23a',
        },
      ],
      mode: 'create',
      selectedTrackId: null,
      creatingTrackStartPoint: null,
      creatingTrackEndPoint: null,
      mousePosition: null,
      curveIntensity: 0,
      isDraggingControl: false,
      dragTrackId: null,
      newPointCounter: 7
    };
  },
  computed: {
    selectedTrack() {
      return this.tracks.find(t => t.id === this.selectedTrackId);
    },
  },
  mounted() {
    this.setupMapEvents();
  },
  methods: {
    setupMapEvents() {
      const svg = document.querySelector('svg');
      if (!svg) return;

      svg.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      svg.addEventListener('mouseup', () => this.handleMouseUp());
      svg.addEventListener('mouseleave', () => this.handleMouseUp());
    },

    handleMouseMove(e) {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      this.mousePosition = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      if (this.isDraggingControl && this.dragTrackId) {
        const track = this.tracks.find(t => t.id === this.dragTrackId);
        if (track) {
          track.controlX = this.mousePosition.x;
          track.controlY = this.mousePosition.y;
          this.updateCurveIntensityFromControl(track);
        }
      }
    },

    handleMouseUp() {
      this.isDraggingControl = false;
      this.dragTrackId = null;
    },

    handleMapClick(e) {
      if (this.mode === 'addPoint') {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newPoint = {
          id: 'P' + String(this.newPointCounter).padStart(3, '0'),
          name: 'P' + String(this.newPointCounter).padStart(3, '0') + '-新点位',
          x: x,
          y: y,
          type: 'nav',
          rotation: 0
        };
        this.points.push(newPoint);
        this.newPointCounter++;
      } else if (!e.target.closest('path') && !e.target.closest('circle')) {
        this.selectedTrackId = null;
      }
    },

    handleRightClick() {
      if (this.mode === 'addPoint') {
        this.undoLastPoint();
      } else if (this.creatingTrackStartPoint) {
        this.creatingTrackStartPoint = null;
      }
    },

    undoLastPoint() {
      if (this.points.length > 0) {
        this.points.pop();
        if (this.newPointCounter > 7) {
          this.newPointCounter--;
        }
      }
    },

    finishCreate() {
      if (this.creatingTrackStartPoint && this.creatingTrackEndPoint) {
        this.creatingTrackStartPoint = null;
        this.creatingTrackEndPoint = null;
      }
    },

    handlePointClick(point) {
      if (this.mode === 'create') {
        if (!this.creatingTrackStartPoint) {
          this.creatingTrackStartPoint = point;
        } else if (point.id !== this.creatingTrackStartPoint.id) {
          const newId = 'T' + String(this.tracks.length + 1);
          const newTrack = {
            id: newId,
            name: `轨道${this.tracks.length + 1}`,
            startPoint: { ...this.creatingTrackStartPoint },
            endPoint: { ...point },
            controlX: (this.creatingTrackStartPoint.x + point.x) / 2,
            controlY: (this.creatingTrackStartPoint.y + point.y) / 2,
            curveIntensity: 0,
            direction: 'single',
            color: '#409eff',
          };
          this.tracks.push(newTrack);
          this.creatingTrackStartPoint = null;
          this.creatingTrackEndPoint = null;
        }
      }
    },

    getPointColor(type) {
      const colors = {
        nav: '#409eff',
        charge: '#e6a23c',
        location: '#9b59b6',
        parking: '#3498db',
      };
      return colors[type] || '#409eff';
    },

    getArrowPoints(point) {
      const angle = (point.rotation - 90) * Math.PI / 180;
      const arrowLength = 15;
      const arrowWidth = 8;
      const tipX = point.x + Math.cos(angle) * arrowLength;
      const tipY = point.y + Math.sin(angle) * arrowLength;
      const base1X = point.x + Math.cos(angle + Math.PI * 0.7) * arrowWidth;
      const base1Y = point.y + Math.sin(angle + Math.PI * 0.7) * arrowWidth;
      const base2X = point.x + Math.cos(angle - Math.PI * 0.7) * arrowWidth;
      const base2Y = point.y + Math.sin(angle - Math.PI * 0.7) * arrowWidth;
      return `${tipX},${tipY} ${base1X},${base1Y} ${base2X},${base2Y}`;
    },

    getTrackPath(track) {
      const controlX = track.controlX || ((track.startPoint.x + track.endPoint.x) / 2);
      const controlY = track.controlY || ((track.startPoint.y + track.endPoint.y) / 2);
      return `M${track.startPoint.x},${track.startPoint.y} Q${controlX},${controlY} ${track.endPoint.x},${track.endPoint.y}`;
    },

    selectTrack(track) {
      this.selectedTrackId = track.id;
      if (track.curveIntensity !== undefined) {
        this.curveIntensity = track.curveIntensity;
      } else if (track.controlX && track.controlY) {
        this.updateCurveIntensityFromControl(track);
      }
    },

    updateCurveIntensityFromControl(track) {
      const midX = (track.startPoint.x + track.endPoint.x) / 2;
      const midY = (track.startPoint.y + track.endPoint.y) / 2;
      const dx = track.endPoint.x - track.startPoint.x;
      const dy = track.endPoint.y - track.startPoint.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      if (length > 0) {
        const perpX = -dy / length;
        const perpY = dx / length;
        const deltaX = track.controlX - midX;
        const deltaY = track.controlY - midY;
        const dotProduct = deltaX * perpX + deltaY * perpY;
        track.curveIntensity = Math.round(dotProduct);
        this.curveIntensity = track.curveIntensity;
      }
    },

    startDragControl(track) {
      if (this.mode === 'edit' && this.selectedTrackId === track.id) {
        this.isDraggingControl = true;
        this.dragTrackId = track.id;
      }
    },

    updateTrackCurve() {
      if (!this.selectedTrack) return;
      const track = this.selectedTrack;
      const midX = (track.startPoint.x + track.endPoint.x) / 2;
      const midY = (track.startPoint.y + track.endPoint.y) / 2;
      const dx = track.endPoint.x - track.startPoint.x;
      const dy = track.endPoint.y - track.startPoint.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      if (length > 0) {
        const perpX = -dy / length;
        const perpY = dx / length;
        const offset = this.curveIntensity;
        track.controlX = midX + perpX * offset;
        track.controlY = midY + perpY * offset;
        track.curveIntensity = this.curveIntensity;
      }
    },

    deleteSelectedTrack() {
      if (!this.selectedTrackId) return;
      if (confirm('确定要删除这条轨道吗？')) {
        const index = this.tracks.findIndex(t => t.id === this.selectedTrackId);
        if (index !== -1) {
          this.tracks.splice(index, 1);
          this.selectedTrackId = null;
        }
      }
    },

    saveTracks() {
      alert('轨道已保存');
    },
  },
};
</script>
