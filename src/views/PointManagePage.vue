<template>
  <div class="bg-gray-50 min-h-screen flex flex-col">
    <header class="bg-white shadow-sm border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="$router.push('/main')" class="flex items-center gap-2 text-primary hover:text-primary/80 transition">
          <i class="fa fa-arrow-left"></i>
          <span>返回</span>
        </button>
        <h1 class="text-lg font-bold text-gray-800">点管理</h1>
      </div>
      <div class="flex items-center gap-3">
        <button @click="showAddPointDialog = true" class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded flex items-center gap-1 transition">
          <i class="fa fa-plus"></i>
          <span>添加点位</span>
        </button>
        <button @click="showSaveConfirm = true" class="bg-warning hover:bg-warning/90 text-white px-4 py-2 rounded flex items-center gap-1 transition">
          <i class="fa fa-save"></i>
          <span>保存配置</span>
        </button>
      </div>
    </header>

    <main class="flex-1 flex">
      <section class="flex-1 bg-white m-4 rounded shadow-sm overflow-hidden relative">
        <div class="w-full h-full relative overflow-hidden">
          <img src="/src/assets/image.png" alt="地图背景" class="w-full h-full object-cover" />
          <svg class="absolute inset-0 w-full h-full" @click="handleMapClick">

            <g v-for="point in points" :key="point.id">
              <circle
                :cx="point.x"
                :cy="point.y"
                :r="selectedPointId === point.id ? 12 : 10"
                :fill="getPointColor(point.type)"
                stroke="white"
                stroke-width="2"
                :class="selectedPointId === point.id ? 'cursor-pointer' : 'cursor-pointer hover:opacity-80'"
                @click.stop="selectPoint(point)"
              />
              <polygon
                :points="getArrowPoints(point)"
                :fill="getPointColor(point.type)"
              />
              <text
                :x="point.x"
                :y="point.y + 25"
                text-anchor="middle"
                font-size="12"
                fill="#333"
              >{{ point.name }}</text>
            </g>

            <g v-if="creatingPoint">
              <circle
                :cx="creatingPoint.x"
                :cy="creatingPoint.y"
                r="10"
                :fill="getPointColor(creatingPoint.type)"
                stroke="white"
                stroke-width="2"
                opacity="0.7"
              />
              <polygon
                :points="getArrowPoints(creatingPoint)"
                :fill="getPointColor(creatingPoint.type)"
                opacity="0.7"
              />
            </g>
          </svg>
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
      </section>

      <aside class="w-64 bg-white border-l border-gray-200 flex flex-col shrink-0 p-4 overflow-y-auto">
        <div v-if="selectedPoint" class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-gray-700 flex items-center gap-1">
              <i class="fa fa-info-circle text-primary"></i>
              点位信息
            </h3>
            <button @click="showDeletePointConfirm" class="text-danger hover:text-danger/80 text-sm">
              <i class="fa fa-trash"></i>
            </button>
          </div>
          <div class="space-y-1 text-xs">
            <div class="flex justify-between"><span class="text-gray-500">名称:</span><span class="font-medium">{{ selectedPoint.name }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">类型:</span><span class="font-medium">{{ getPointTypeName(selectedPoint.type) }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">X坐标:</span><span class="font-medium">{{ selectedPoint.x.toFixed(1) }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Y坐标:</span><span class="font-medium">{{ selectedPoint.y.toFixed(1) }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">方向:</span><span class="font-medium">{{ selectedPoint.rotation.toFixed(1) }}°</span></div>
          </div>
          <div class="mt-3">
            <button @click="startAdjustDirection" class="w-full py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90 transition">
              <i class="fa fa-arrows-alt mr-1"></i>调整方向
            </button>
          </div>
        </div>

        <div class="mb-4">
          <h3 class="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
            <i class="fa fa-list text-primary"></i>
            点位列表
          </h3>
          <div class="space-y-1 max-h-48 overflow-y-auto">
            <div
              v-for="point in points"
              :key="point.id"
              @click="selectPoint(point)"
              :class="selectedPointId === point.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50 border-gray-200'"
              class="flex items-center justify-between p-2 rounded border cursor-pointer transition text-xs"
            >
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: getPointColor(point.type) }"></div>
                <span>{{ point.name }}</span>
              </div>
              <button @click.stop="showDeletePointConfirmById(point.id)" class="text-gray-400 hover:text-danger">
                <i class="fa fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h3 class="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
            <i class="fa fa-bar-chart text-primary"></i>
            点位统计
          </h3>
          <div class="space-y-1 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-500">总点位</span>
              <span class="text-primary font-medium">{{ points.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">导航点</span>
              <span>{{ points.filter(p => p.type === 'nav').length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">充电点</span>
              <span>{{ points.filter(p => p.type === 'charge').length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">定位点</span>
              <span>{{ points.filter(p => p.type === 'location').length }}</span>
            </div>
          </div>
        </div>
      </aside>
    </main>

    <div v-if="showAddPointDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-96">
        <div class="p-4 border-b border-gray-200">
          <h3 class="font-bold text-gray-800">添加点位</h3>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">点位来源</label>
            <div class="flex gap-2">
              <button @click="newPoint.source = 'hand'" :class="newPoint.source === 'hand' ? 'bg-primary text-white border-primary' : 'bg-gray-100 text-gray-600 border-gray-200'" class="flex-1 py-2 text-sm rounded border transition">
                手绘点
              </button>
              <button @click="newPoint.source = 'record'" :class="newPoint.source === 'record' ? 'bg-primary text-white border-primary' : 'bg-gray-100 text-gray-600 border-gray-200'" class="flex-1 py-2 text-sm rounded border transition">
                录制点
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">点位名称</label>
            <input v-model="newPoint.name" type="text" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm" :class="nameDuplicate ? 'border-danger focus:ring-danger' : 'border-gray-200 focus:ring-primary'" placeholder="请输入点位名称" />
            <div v-if="nameDuplicate" class="text-xs text-danger mt-1">
              <i class="fa fa-exclamation-circle mr-1"></i>点位名称已存在，请使用其他名称
            </div>
            <div class="text-xs text-gray-400 mt-1">
              命名规则：P + 三位数字，如 P101、P102
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">点位类型</label>
            <select v-model="newPoint.type" class="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm bg-white">
              <option value="nav">导航点</option>
              <option value="charge">充电点</option>
              <option value="location">定位点</option>
              <option value="parking">停车点</option>
            </select>
          </div>

          <div class="bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
            <i class="fa fa-info-circle mr-1"></i>
            填写完信息后点击下一步，然后在地图上点击位置创建点位。
          </div>
        </div>
        <div class="p-4 border-t border-gray-200 flex items-center justify-end gap-2">
          <button @click="cancelAddPoint" class="px-4 py-2 border border-gray-200 text-gray-700 rounded hover:bg-gray-50 transition text-sm">
            取消
          </button>
          <button @click="startCreatingPoint" :disabled="!newPoint.name || nameDuplicate" class="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            下一步
          </button>
        </div>
      </div>
    </div>

    <div v-if="isCreatingPoint" class="absolute top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-2 rounded shadow-lg z-20">
      <i class="fa fa-info-circle mr-1"></i>
      点击地图选择点位位置，拖动鼠标可以调整方向
      <button @click="cancelCreatingPoint" class="ml-2 text-white/80 hover:text-white">
        <i class="fa fa-times"></i>
      </button>
    </div>

    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-80 text-center">
        <div class="w-16 h-16 bg-danger/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fa fa-exclamation-triangle text-3xl text-danger"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">确认删除</h3>
        <p class="text-gray-500 text-sm mb-4">确定要删除点位 "{{ deleteTargetName }}" 吗？此操作不可撤销。</p>
        <div class="flex gap-2">
          <button @click="showDeleteConfirm = false" class="flex-1 py-2 border border-gray-200 rounded text-gray-700 hover:bg-gray-50 transition">
            取消
          </button>
          <button @click="confirmDeletePoint" class="flex-1 py-2 bg-danger text-white rounded hover:bg-danger/90 transition">
            确认删除
          </button>
        </div>
      </div>
    </div>

    <div v-if="showSaveConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-80 text-center">
        <div class="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fa fa-save text-3xl text-warning"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">确认保存</h3>
        <p class="text-gray-500 text-sm mb-4">确定要保存当前点位配置吗？这将覆盖之前的配置。</p>
        <div class="flex gap-2">
          <button @click="showSaveConfirm = false" class="flex-1 py-2 border border-gray-200 rounded text-gray-700 hover:bg-gray-50 transition">
            取消
          </button>
          <button @click="confirmSave" class="flex-1 py-2 bg-warning text-white rounded hover:bg-warning/90 transition">
            确认保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PointManagePage',
  data() {
    return {
      points: [
        { id: 'P101', name: 'P101-入库口', x: 180, y: 300, type: 'nav', rotation: 0 },
        { id: 'P102', name: 'P102-分拣区', x: 220, y: 300, type: 'nav', rotation: 90 },
        { id: 'P103', name: 'P103-充电位', x: 220, y: 180, type: 'charge', rotation: 180 },
        { id: 'P104', name: 'P104-导航点', x: 350, y: 180, type: 'nav', rotation: 270 },
        { id: 'P105', name: 'P105-导航点', x: 350, y: 380, type: 'nav', rotation: 0 },
        { id: 'P106', name: 'P106-停车点', x: 480, y: 380, type: 'parking', rotation: 180 },
      ],
      selectedPointId: null,
      showAddPointDialog: false,
      isCreatingPoint: false,
      newPoint: {
        name: '',
        type: 'nav',
        source: 'hand',
      },
      creatingPoint: null,
      isAdjustingDirection: false,
      adjustPointId: null,
      showDeleteConfirm: false,
      showSaveConfirm: false,
      deleteTargetId: null,
      zoomLevel: 1,
    };
  },
  computed: {
    selectedPoint() {
      return this.points.find(p => p.id === this.selectedPointId);
    },
    nameDuplicate() {
      if (!this.newPoint.name) return false;
      return this.points.some(p => p.name === this.newPoint.name.trim());
    },
    deleteTargetName() {
      if (!this.deleteTargetId) return '';
      const point = this.points.find(p => p.id === this.deleteTargetId);
      return point ? point.name : '';
    }
  },
  mounted() {
    this.setupMapEvents();
  },
  methods: {
    setupMapEvents() {
      const svg = document.querySelector('svg');
      if (!svg) return;

      svg.addEventListener('mousedown', (e) => this.handleMouseDown(e));
      svg.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      svg.addEventListener('mouseup', () => this.handleMouseUp());
      svg.addEventListener('mouseleave', () => this.handleMouseUp());
    },

    handleMapClick(e) {
      if (!this.isCreatingPoint) return;
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (!this.creatingPoint) {
        this.creatingPoint = {
          id: 'TEMP',
          x: x,
          y: y,
          type: this.newPoint.type,
          rotation: 0,
        };
      } else {
        const newId = 'P' + String(this.points.length + 101).padStart(3, '0');
        this.points.push({
          id: newId,
          name: this.newPoint.name,
          x: this.creatingPoint.x,
          y: this.creatingPoint.y,
          type: this.newPoint.type,
          rotation: this.creatingPoint.rotation,
        });
        this.isCreatingPoint = false;
        this.creatingPoint = null;
        this.newPoint = { name: '', type: 'nav', source: 'hand' };
      }
    },

    handleMouseDown(e) {
      if (this.isAdjustingDirection && this.selectedPoint) {
        this.startDragRotate(e);
      }
    },

    handleMouseMove(e) {
      if (this.isAdjustingDirection && this.adjustPointId) {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const point = this.points.find(p => p.id === this.adjustPointId);
        if (point) {
          const angle = Math.atan2(y - point.y, x - point.x) * 180 / Math.PI + 90;
          point.rotation = angle;
        }
      } else if (this.creatingPoint) {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const angle = Math.atan2(y - this.creatingPoint.y, x - this.creatingPoint.x) * 180 / Math.PI + 90;
        this.creatingPoint.rotation = angle;
      }
    },

    handleMouseUp() {
      if (this.isAdjustingDirection) {
        this.isAdjustingDirection = false;
        this.adjustPointId = null;
      }
    },

    startDragRotate(e) {
      this.isAdjustingDirection = true;
      this.adjustPointId = this.selectedPointId;
    },

    startAdjustDirection() {
      this.isAdjustingDirection = true;
      this.adjustPointId = this.selectedPointId;
    },

    selectPoint(point) {
      this.selectedPointId = point.id;
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

    getPointTypeName(type) {
      const names = {
        nav: '导航点',
        charge: '充电点',
        location: '定位点',
        parking: '停车点',
      };
      return names[type] || '导航点';
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

    cancelAddPoint() {
      this.showAddPointDialog = false;
      this.isCreatingPoint = false;
      this.creatingPoint = null;
      this.newPoint = { name: '', type: 'nav', source: 'hand' };
    },

    startCreatingPoint() {
      if (!this.newPoint.name || this.nameDuplicate) return;
      this.showAddPointDialog = false;
      this.isCreatingPoint = true;
      this.creatingPoint = null;
    },

    cancelCreatingPoint() {
      this.isCreatingPoint = false;
      this.creatingPoint = null;
      this.newPoint = { name: '', type: 'nav', source: 'hand' };
    },

    showDeletePointConfirm() {
      if (!this.selectedPointId) return;
      this.deleteTargetId = this.selectedPointId;
      this.showDeleteConfirm = true;
    },

    showDeletePointConfirmById(id) {
      this.deleteTargetId = id;
      this.showDeleteConfirm = true;
    },

    confirmDeletePoint() {
      const index = this.points.findIndex(p => p.id === this.deleteTargetId);
      if (index !== -1) {
        this.points.splice(index, 1);
        if (this.selectedPointId === this.deleteTargetId) {
          this.selectedPointId = null;
        }
      }
      this.showDeleteConfirm = false;
      this.deleteTargetId = null;
    },

    confirmSave() {
      localStorage.setItem('robot_points', JSON.stringify(this.points));
      this.showSaveConfirm = false;
      alert('点位配置已保存！');
    },

    zoomIn() {
      this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2);
      this.applyZoom();
    },

    zoomOut() {
      this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
      this.applyZoom();
    },

    resetZoom() {
      this.zoomLevel = 1;
      this.applyZoom();
    },

    applyZoom() {
      const svg = document.querySelector('svg');
      if (svg) {
        svg.style.transform = `scale(${this.zoomLevel})`;
        svg.style.transformOrigin = 'center center';
      }
    }
  },
};
</script>
