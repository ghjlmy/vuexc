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
        <button @click="rebuildTrack" class="bg-warning hover:bg-warning/90 text-white px-4 py-1.5 rounded flex items-center gap-1 transition">
          <i class="fa fa-refresh"></i>
          <span>重新建轨</span>
        </button>
        <button @click="saveTracks" class="bg-success hover:bg-success/90 text-white px-4 py-1.5 rounded flex items-center gap-1 transition">
          <i class="fa fa-save"></i>
          <span>保存轨道</span>
        </button>
      </div>
    </header>

    <main class="flex-1 flex overflow-hidden">
      <section class="flex-1 bg-white m-4 rounded shadow-sm overflow-hidden relative">
        <img src="/src/assets/image.png" alt="地图背景" class="w-full h-full object-cover" />
        <svg class="absolute inset-0 w-full h-full" @click="handleMapClick" @contextmenu.prevent @dblclick="finishCreate">
          <defs>
            <marker id="arrow-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#409eff" />
            </marker>
            <marker id="arrow-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#67c23a" />
            </marker>
            <marker id="arrow-orange" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#e6a23c" />
            </marker>
            <marker id="arrow-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#f56c6c" />
            </marker>
          </defs>

          <g v-for="track in tracks" :key="track.id">
            <path
              :d="getTrackPath(track)"
              :stroke="track.direction === 'oneway' ? '#409eff' : track.color"
              stroke-width="3"
              fill="none"
              stroke-linecap="round"
              :marker-end="track.direction === 'oneway' ? 'url(#arrow-blue)' : ''"
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
              :r="drawingStartPoint === point ? 12 : 10"
              :fill="getPointColor(point.type)"
              stroke="white"
              stroke-width="2"
              class="pointer-events-none"
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
            v-if="drawingStartPoint && mousePosition"
            :d="`M${drawingStartPoint.x},${drawingStartPoint.y} Q${(drawingStartPoint.x + mousePosition.x)/2},${(drawingStartPoint.y + mousePosition.y)/2} ${mousePosition.x},${mousePosition.y}`"
            stroke="#666"
            stroke-width="3"
            stroke-dasharray="8 4"
            fill="none"
          />
        </svg>

        <div class="absolute top-4 left-4 flex gap-2 bg-white p-2 rounded shadow">
          <button @click="mode = 'draw'" :class="mode === 'draw' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'" class="px-3 py-1.5 rounded text-sm flex items-center gap-1">
            <i class="fa fa-pencil"></i>
            手绘路径
          </button>
          <button @click="mode = 'edit'" :class="mode === 'edit' ? 'bg-warning text-white' : 'bg-gray-100 text-gray-700'" class="px-3 py-1.5 rounded text-sm flex items-center gap-1">
            <i class="fa fa-sliders"></i>
            编辑轨道
          </button>
        </div>

        <div v-if="mode === 'draw'" class="absolute top-4 right-4 bg-blue-50 p-3 rounded shadow text-xs text-blue-700">
          <i class="fa fa-info-circle mr-1"></i>
          点击两个点位创建路径，再次点击链接上一条线的终点，形成连续路径
        </div>
        <div v-if="mode === 'edit'" class="absolute top-4 right-4 bg-yellow-50 p-3 rounded shadow text-xs text-yellow-700">
          <i class="fa fa-info-circle mr-1"></i>
          点击轨道选中，可调整曲度、重命名、删除
        </div>
      </section>

      <aside class="w-64 bg-white border-l border-gray-200 flex flex-col shrink-0 p-4 overflow-y-auto">
        <div class="mb-4">
          <h3 class="text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
            <span class="flex items-center gap-1">
              <i class="fa fa-map-marker text-primary"></i>
              可用点位
            </span>
            <span class="text-xs text-gray-500">{{ points.length }}个</span>
          </h3>
          <div class="space-y-1 max-h-48 overflow-y-auto">
            <div
              v-for="point in points"
              :key="point.id"
              :class="['p-2 rounded border text-xs cursor-pointer', drawingStartPoint?.id === point.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50 border-gray-200']"
              @click="handlePointClick(point)"
            >
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: getPointColor(point.type) }"></div>
                <span>{{ point.name }}</span>
              </div>
              <div class="text-gray-500 text-xs mt-1">{{ point.x }}, {{ point.y }}</div>
            </div>
          </div>
        </div>

        <div v-if="selectedTrack" class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-gray-700 flex items-center gap-1">
              <i class="fa fa-sliders text-primary"></i>
              轨道属性
            </h3>
            <button @click="showDeleteTrackConfirm" class="text-danger hover:text-danger/80 text-sm">
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
                <button 
                  @click="selectedTrack.direction = 'oneway'" 
                  :class="selectedTrack.direction === 'oneway' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'" 
                  class="flex-1 px-3 py-1 rounded text-sm"
                >
                  单向
                </button>
                <button 
                  @click="selectedTrack.direction = 'twoway'" 
                  :class="selectedTrack.direction === 'twoway' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'" 
                  class="flex-1 px-3 py-1 rounded text-sm"
                >
                  双向
                </button>
              </div>
            </div>
            <div v-if="selectedTrack.direction === 'twoway'">
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
          <h3 class="text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
            <span class="flex items-center gap-1">
              <i class="fa fa-road text-primary"></i>
              轨道列表
            </span>
            <span class="text-xs text-gray-500">{{ tracks.length }}条</span>
          </h3>
          <div class="space-y-1 max-h-64 overflow-y-auto">
            <div
              v-for="track in tracks"
              :key="track.id"
              @click="selectTrack(track)"
              :class="selectedTrackId === track.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50 border-gray-200'"
              class="p-2 rounded border text-xs cursor-pointer"
            >
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: track.direction === 'oneway' ? '#409eff' : track.color }"></div>
                  <span class="font-medium">{{ track.name }}</span>
                </div>
                <span :class="['text-xs px-1.5 py-0.5 rounded', track.direction === 'oneway' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700']">
                  {{ track.direction === 'oneway' ? '单向' : '双向' }}
                </span>
              </div>
              <div class="text-gray-500 pl-5">
                启动点: {{ track.startPoint.name || '-' }} → 停止点: {{ track.endPoint.name || '-' }}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>

    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-80 text-center">
        <div class="w-16 h-16 bg-danger/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fa fa-exclamation-triangle text-3xl text-danger"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">确认删除</h3>
        <p class="text-gray-500 text-sm mb-4">确定要删除轨道 "{{ selectedTrack?.name }}" 吗？此操作不可撤销。</p>
        <div class="flex gap-2">
          <button @click="showDeleteConfirm = false" class="flex-1 py-2 border border-gray-200 rounded text-gray-700 hover:bg-gray-50 transition">
            取消
          </button>
          <button @click="confirmDeleteTrack" class="flex-1 py-2 bg-danger text-white rounded hover:bg-danger/90 transition">
            确认删除
          </button>
        </div>
      </div>
    </div>

    <div v-if="showRebuildConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-80 text-center">
        <div class="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fa fa-refresh text-3xl text-warning"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">重新建轨</h3>
        <p class="text-gray-500 text-sm mb-4">确定要重新建设整段轨道吗？当前所有轨道将被清除。</p>
        <div class="flex gap-2">
          <button @click="showRebuildConfirm = false" class="flex-1 py-2 border border-gray-200 rounded text-gray-700 hover:bg-gray-50 transition">
            取消
          </button>
          <button @click="confirmRebuild" class="flex-1 py-2 bg-warning text-white rounded hover:bg-warning/90 transition">
            确认重建
          </button>
        </div>
      </div>
    </div>
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
          startPoint: { id: 'P101', x: 180, y: 380, name: 'P101-入库口' },
          endPoint: { id: 'P102', x: 220, y: 380, name: 'P102-分拣区' },
          controlX: 200,
          controlY: 330,
          curveIntensity: -50,
          color: '#409eff',
          direction: 'oneway', // oneway or twoway
        },
        {
          id: 'T2',
          name: '轨道2-分拣到充电',
          startPoint: { id: 'P102', x: 220, y: 380, name: 'P102-分拣区' },
          endPoint: { id: 'P103', x: 220, y: 250, name: 'P103-充电位' },
          controlX: 170,
          controlY: 315,
          curveIntensity: -50,
          color: '#67c23a',
          direction: 'twoway', // oneway or twoway
        },
      ],
      mode: 'draw',
      selectedTrackId: null,
      drawingStartPoint: null,
      mousePosition: null,
      curveIntensity: 0,
      isDraggingControl: false,
      dragTrackId: null,
      showDeleteConfirm: false,
      showRebuildConfirm: false
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
    getArrowMarker(color) {
      const colorMap = {
        '#409eff': 'arrow-blue',
        '#67c23a': 'arrow-green',
        '#e6a23c': 'arrow-orange',
        '#f56c6c': 'arrow-red'
      };
      return `url(#${colorMap[color] || 'arrow-blue'})`;
    },
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
      if (!e.target.closest('path') && !e.target.closest('circle')) {
        this.selectedTrackId = null;
      }
    },

    handlePointClick(point) {
      if (this.mode === 'draw') {
        if (!this.drawingStartPoint) {
          this.drawingStartPoint = point;
        } else if (point.id !== this.drawingStartPoint.id) {
          const newId = 'T' + String(this.tracks.length + 1);
          const newTrack = {
            id: newId,
            name: `轨道${this.tracks.length + 1}`,
            startPoint: { ...this.drawingStartPoint },
            endPoint: { ...point },
            controlX: (this.drawingStartPoint.x + point.x) / 2,
            controlY: (this.drawingStartPoint.y + point.y) / 2,
            curveIntensity: 0,
            color: '#409eff',
            direction: 'oneway', // oneway or twoway
          };
          this.tracks.push(newTrack);
          this.drawingStartPoint = point;
        }
      }
    },

    finishCreate() {
      this.drawingStartPoint = null;
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

    showDeleteTrackConfirm() {
      if (!this.selectedTrackId) return;
      this.showDeleteConfirm = true;
    },

    confirmDeleteTrack() {
      const index = this.tracks.findIndex(t => t.id === this.selectedTrackId);
      if (index !== -1) {
        this.tracks.splice(index, 1);
        this.selectedTrackId = null;
      }
      this.showDeleteConfirm = false;
    },

    rebuildTrack() {
      this.showRebuildConfirm = true;
    },

    confirmRebuild() {
      this.tracks = [];
      this.selectedTrackId = null;
      this.drawingStartPoint = null;
      this.showRebuildConfirm = false;
    },

    saveTracks() {
      alert('轨道已保存');
    },
  },
};
</script>
