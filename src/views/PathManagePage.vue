<template>
  <div id="path-manage-page" class="bg-map-bg min-h-screen flex flex-col">
    <header class="bg-white border-b border-gray-light px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button @click="$router.push('/main')" class="flex items-center gap-1 text-primary hover:text-primary/80 transition text-sm">
          <i class="fa fa-arrow-left"></i>
          <span>返回</span>
        </button>
        <i class="fa fa-robot text-primary text-xl"></i>
        <h1 class="text-lg font-bold">路径管理</h1>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="togglePathRecording()"
          :class="isRecording ? 'bg-danger' : 'bg-primary'"
          class="hover:opacity-90 text-white px-4 py-1.5 rounded flex items-center gap-1 transition"
        >
          <!-- <i :class="isRecording ? 'fa-stop' : 'fa-circle'"></i> -->
          <span>{{ isRecording ? '停止录制' : '开始录制' }}</span>
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button @click="showAddDialog = true" class="bg-primary text-white px-3 py-1 rounded text-sm flex items-center gap-1">
          <i class="fa fa-plus"></i>添加路径
        </button>
        <button @click="saveAllPaths" class="bg-success text-white px-3 py-1 rounded text-sm flex items-center gap-1">
          <i class="fa fa-save"></i>保存配置
        </button>
      </div>
    </header>

    <main class="flex-1 flex overflow-hidden">
      <section 
        class="flex-1 relative grid-bg overflow-auto"
        :style="{cursor: isRecording ? 'crosshair' : 'default'}"
        @click="handleMapClick"
        @dblclick="finishRecording"
        @contextmenu.prevent="undoRecordingPoint"
      >
        <div v-for="point in allPoints" :key="point.id" 
          class="map-point"
          :class="{
            'map-point-start': point.type === 'start',
            'map-point-normal': point.type === 'normal',
            'map-point-end': point.type === 'end'
          }"
          :style="{left: point.x + 'px', top: point.y + 'px'}"
        ></div>
        <div v-for="point in allPoints" :key="'text-' + point.id" 
          class="map-point-text"
          :style="{left: point.x + 'px', top: point.y + 'px'}"
        >
          {{ point.name }}
        </div>

        <svg id="path-svg" class="absolute inset-0 w-full h-full">
          <defs>
            <marker id="path-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#409eff" />
            </marker>
            <marker id="path-arrow-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#67c23a" />
            </marker>
          </defs>
          <path
            v-for="path in paths"
            :key="path.id"
            :d="path.svgPath"
            :stroke="path.color"
            stroke-width="3"
            fill="none"
            :stroke-dasharray="path.direction === 'bidirectional' ? '8,4' : ''"
            :marker-end="path.direction === 'single' ? 'url(#path-arrow)' : ''"
            :class="['cursor-pointer', {'opacity-50': selectedPathId && selectedPathId !== path.id, 'stroke-4': selectedPathId === path.id}]"
            @click.stop="selectPath(path.id)"
          />
          <path
            v-if="recordingPoints.length > 1"
            :d="recordingSvgPath"
            stroke="#f56c6c"
            stroke-width="4"
            stroke-dasharray="10,5"
            fill="none"
            opacity="0.8"
          />
        </svg>

        <div class="absolute top-4 right-80 flex items-center gap-2 bg-white p-2 rounded border border-gray-light shadow-lg">
          <span class="text-xs text-gray-deep mr-2">路径编辑</span>
          <!-- <button @click="addPathMode = !addPathMode" :class="addPathMode ? 'bg-primary' : 'bg-gray-200'" class="w-7 h-7 rounded text-white flex items-center justify-center text-sm" title="添加路径">
            <i class="fa fa-plus"></i>
          </button>
          <button @click="editPathMode = !editPathMode" :class="editPathMode ? 'bg-warning' : 'bg-gray-200'" class="w-7 h-7 rounded text-white flex items-center justify-center text-sm" title="编辑路径">
            <i class="fa fa-pencil"></i>
          </button> -->
          <button @click="deleteSelectedPath" class="w-7 h-7 rounded bg-danger text-white flex items-center justify-center text-sm" title="删除路径">
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <div v-if="isRecording" class="absolute top-20 left-1/2 -translate-x-1/2 bg-danger/90 text-white px-4 py-2 rounded shadow-lg text-sm">
          <i class="fa fa-circle text-xs animate-pulse mr-2"></i>正在录制路径... 点击添加点，双击结束，右键撤销
        </div>
      </section>

      <aside class="right-panel">
        <div class="panel-card">
          <div class="panel-title">
            <i class="fa fa-road text-primary"></i>
            路径列表
          </div>
          <div class="max-h-48 overflow-y-auto space-y-2">
            <div 
              v-for="path in paths" 
              :key="path.id"
              @click="selectPath(path.id)"
              :class="['p-2 rounded cursor-pointer text-sm', selectedPathId === path.id ? 'bg-primary/10 border border-primary' : 'bg-gray-50 hover:bg-gray-100']"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full" :style="{backgroundColor: path.color}"></span>
                  <span class="font-medium">{{ path.name }}</span>
                </div>
                <span :class="['text-xs px-1.5 py-0.5 rounded', path.direction === 'single' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600']">
                  {{ path.direction === 'single' ? '单线' : '双向' }}
                </span>
              </div>
              <div class="text-xs text-gray-500 mt-1">{{ path.points.length }} 个节点</div>
            </div>
          </div>
        </div>

        <div class="panel-card" v-if="selectedPathId">
          <div class="panel-title">
            <i class="fa fa-sliders text-primary"></i>
            路径属性设置
          </div>
          <div class="space-y-3">
            <div class="space-y-1">
              <label class="text-xs text-gray-deep">路径名称</label>
              <input
                type="text"
                v-model="selectedPath.name"
                class="w-full border border-gray-light rounded px-2 py-1.5 text-xs"
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs text-gray-deep">路径方向</label>
              <div class="flex gap-2">
                <button
                  @click="selectedPath.direction = 'single'"
                  :class="selectedPath.direction === 'single' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'"
                  class="flex-1 px-2 py-1 rounded text-xs"
                >
                  单线
                </button>
                <button
                  @click="selectedPath.direction = 'bidirectional'"
                  :class="selectedPath.direction === 'bidirectional' ? 'bg-success text-white' : 'bg-gray-200 text-gray-700'"
                  class="flex-1 px-2 py-1 rounded text-xs"
                >
                  双向
                </button>
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-xs text-gray-deep">路径颜色</label>
              <div class="flex gap-2">
                <button 
                  v-for="color in pathColors" 
                  :key="color"
                  @click="selectedPath.color = color"
                  class="w-7 h-7 rounded"
                  :class="{'ring-2 ring-offset-2 ring-gray-400': selectedPath.color === color}"
                  :style="{backgroundColor: color}"
                ></button>
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-xs text-gray-deep">曲度调整 (-100 到 100)</label>
              <div class="flex items-center gap-2">
                <input
                  type="range"
                  v-model.number="selectedPath.curveIntensity"
                  min="-100"
                  max="100"
                  class="flex-1"
                />
                <span class="text-xs w-12 text-right">{{ selectedPath.curveIntensity || 0 }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-1">负值向左上方弯曲，正值向右下方弯曲</p>
            </div>
          </div>
        </div>

        <div class="panel-card" v-if="selectedPathId">
          <div class="panel-title">
            <i class="fa fa-info-circle text-primary"></i>
            路径状态
          </div>
          <div class="space-y-1">
            <div class="stats-item">
              <span>路径名称</span>
              <span class="stats-value">{{ selectedPath.name }}</span>
            </div>
            <div class="stats-item">
              <span>节点数</span>
              <span class="stats-value">{{ selectedPath.points.length }} 个</span>
            </div>
            <div class="stats-item">
              <span>路径类型</span>
              <span class="stats-value" :class="selectedPath.direction === 'single' ? 'text-primary' : 'text-success'">
                {{ selectedPath.direction === 'single' ? '单线' : '双向' }}
              </span>
            </div>
            <div class="stats-item">
              <span>路径长度</span>
              <span class="stats-value">{{ getPathLength(selectedPath) }} m</span>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-title">
            <i class="fa fa-bar-chart text-primary"></i>
            路径统计
          </div>
          <div class="space-y-1">
            <div class="stats-item">
              <span>总路径</span>
              <span class="stats-value">{{ paths.length }}</span>
            </div>
            <div class="stats-item">
              <span>单线路径</span>
              <span class="stats-value text-primary">{{ paths.filter(p => p.direction === 'single').length }}</span>
            </div>
            <div class="stats-item">
              <span>双向路径</span>
              <span class="stats-value text-success">{{ paths.filter(p => p.direction === 'bidirectional').length }}</span>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-title">
            <i class="fa fa-cogs text-primary"></i>
            路径操作
          </div>
          <div class="space-y-2 mt-2">
            <button @click="testPath" class="btn-sm-primary w-full">
              <i class="fa fa-play"></i>测试路径
            </button>
            <button @click="exportPaths" class="btn-sm-primary w-full">
              <i class="fa fa-download"></i>导出路径数据
            </button>
            <button @click="importPaths" class="btn-sm-primary w-full">
              <i class="fa fa-upload"></i>导入路径数据
            </button>
          </div>
        </div>
      </aside>
    </main>

    <div v-if="showAddDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">添加路径</h3>
          <button @click="showAddDialog = false" class="text-gray-400 hover:text-gray-600">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">路径名称</label>
            <input v-model="newPathName" type="text" class="w-full border border-gray-200 rounded px-3 py-2" placeholder="如: PA001">
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">路径方向</label>
            <div class="flex gap-2">
              <button @click="newPathDirection = 'single'" :class="newPathDirection === 'single' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'" class="flex-1 py-2 rounded">
                单线
              </button>
              <button @click="newPathDirection = 'bidirectional'" :class="newPathDirection === 'bidirectional' ? 'bg-success text-white' : 'bg-gray-200 text-gray-700'" class="flex-1 py-2 rounded">
                双向
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">路径颜色</label>
            <div class="flex gap-2">
              <button 
                v-for="color in pathColors" 
                :key="color"
                @click="newPathColor = color"
                class="w-8 h-8 rounded"
                :class="{'ring-2 ring-offset-2 ring-gray-400': newPathColor === color}"
                :style="{backgroundColor: color}"
              ></button>
            </div>
          </div>
          <p class="text-sm text-gray-500">提示: 点击确认后，在地图上点击添加路径节点</p>
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="showAddDialog = false" class="flex-1 py-2 border border-gray-200 rounded">取消</button>
          <button @click="startAddingPath" :disabled="!newPathName" class="flex-1 py-2 bg-primary text-white rounded disabled:opacity-50">
            开始绘制
          </button>
        </div>
      </div>
    </div>

    <footer class="bg-white border-t border-gray-light px-4 py-1 text-xs text-gray-deep flex justify-between">
      <div class="flex items-center gap-2">
        <i class="fa fa-circle text-success text-xs"></i>
        <span>路径管理状态：正常 | 已选择路径: {{ selectedPathId ? 1 : 0 }}个 | 模式：{{ isRecording ? '录制中' : '查看' }}</span>
      </div>
      <div>
        <span>当前地图: 主地图 v2.1 | 最后更新: {{ currentTime }}</span>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'PathManagePage',
  data() {
    return {
      isRecording: false,
      recordingPoints: [],
      addPathMode: false,
      editPathMode: false,
      selectedPathId: null,
      showAddDialog: false,
      newPathName: '',
      newPathDirection: 'single',
      newPathColor: '#409eff',
      isAddingNewPath: false,
      pathColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399'],
      allPoints: [
        { id: 'P101', name: 'P101(起点)', x: 100, y: 200, type: 'start' },
        { id: 'P102', name: 'P102', x: 180, y: 200, type: 'normal' },
        { id: 'P103', name: 'P103', x: 180, y: 130, type: 'normal' },
        { id: 'P104', name: 'P104', x: 280, y: 130, type: 'normal' },
        { id: 'P105', name: 'P105', x: 280, y: 260, type: 'normal' },
        { id: 'P106', name: 'P106(终点)', x: 380, y: 260, type: 'end' }
      ],
      paths: [
        {
          id: 'path-1',
          name: 'PA001',
          direction: 'single',
          color: '#409eff',
          curveIntensity: 0,
          points: [
            { x: 100, y: 200 },
            { x: 180, y: 200 }
          ]
        },
        {
          id: 'path-2',
          name: 'PA002',
          direction: 'bidirectional',
          color: '#67c23a',
          curveIntensity: -20,
          points: [
            { x: 180, y: 200 },
            { x: 180, y: 130 }
          ]
        },
        {
          id: 'path-3',
          name: 'PA003',
          direction: 'single',
          color: '#409eff',
          curveIntensity: 30,
          points: [
            { x: 180, y: 130 },
            { x: 280, y: 130 }
          ]
        },
        {
          id: 'path-4',
          name: 'PA004',
          direction: 'bidirectional',
          color: '#67c23a',
          curveIntensity: -30,
          points: [
            { x: 280, y: 130 },
            { x: 280, y: 260 }
          ]
        },
        {
          id: 'path-5',
          name: 'PA005',
          direction: 'single',
          color: '#409eff',
          curveIntensity: 10,
          points: [
            { x: 280, y: 260 },
            { x: 380, y: 260 }
          ]
        }
      ],
      isDraggingControl: false,
      draggedPathId: null,
      isRecording: false,
      isAddingNewPath: false
    };
  },
  computed: {
    selectedPath() {
      return this.paths.find(p => p.id === this.selectedPathId) || {};
    },
    recordingSvgPath() {
      if (this.recordingPoints.length < 2) return '';
      return this.generateSvgPath(this.recordingPoints, 0);
    },
    currentTime() {
      return new Date().toLocaleString('zh-CN');
    }
  },
  methods: {
    generateSvgPath(points, curveIntensity = 0) {
      if (points.length < 2) return '';
      let d = `M${points[0].x},${points[0].y}`;
      
      const start = points[0];
      const end = points[1];
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      if (length > 0) {
        const perpX = -dy / length;
        const perpY = dx / length;
        const offset = curveIntensity;
        const controlX = midX + perpX * offset;
        const controlY = midY + perpY * offset;
        d += ` Q${controlX},${controlY} ${end.x},${end.y}`;
      } else {
        d += ` L${end.x},${end.y}`;
      }
      
      return d;
    },
    togglePathRecording() {
      if (this.isRecording) {
        if (this.recordingPoints.length >= 2) {
          this.finishRecording();
        } else {
          this.isRecording = false;
          this.recordingPoints = [];
        }
      } else {
        this.isRecording = true;
        this.recordingPoints = [];
        this.isAddingNewPath = false;
      }
    },
    handleMapClick(event) {
      if (!this.isRecording && !this.isAddingNewPath) return;
      const mapArea = event.currentTarget;
      const rect = mapArea.getBoundingClientRect();
      const x = event.clientX - rect.left + mapArea.scrollLeft;
      const y = event.clientY - rect.top + mapArea.scrollTop;
      this.recordingPoints.push({ x, y });
    },
    undoRecordingPoint() {
      if (this.recordingPoints.length > 0) {
        this.recordingPoints.pop();
      }
    },
    finishRecording() {
      if (this.recordingPoints.length < 2) {
        if (this.recordingPoints.length > 0) {
          alert('至少需要2个点才能创建路径！');
        }
        return;
      }
      const newPath = {
        id: 'path-' + Date.now(),
        name: this.isAddingNewPath ? this.newPathName : 'PA' + (this.paths.length + 1).toString().padStart(3, '0'),
        direction: this.isAddingNewPath ? this.newPathDirection : 'single',
        color: this.isAddingNewPath ? this.newPathColor : '#409eff',
        curveIntensity: 0,
        points: [this.recordingPoints[0], this.recordingPoints[this.recordingPoints.length - 1]]
      };
      this.paths.push(newPath);
      this.isRecording = false;
      this.isAddingNewPath = false;
      this.recordingPoints = [];
      this.showAddDialog = false;
      this.newPathName = '';
    },
    startAddingPath() {
      if (!this.newPathName) return;
      this.showAddDialog = false;
      this.isAddingNewPath = true;
      this.isRecording = true;
      this.recordingPoints = [];
    },
    selectPath(pathId) {
      if (this.editPathMode) {
        this.selectedPathId = pathId;
      } else {
        this.selectedPathId = this.selectedPathId === pathId ? null : pathId;
      }
    },
    deleteSelectedPath() {
      if (!this.selectedPathId) {
        alert('请先选择要删除的路径！');
        return;
      }
      if (confirm('确定要删除此路径吗？')) {
        this.paths = this.paths.filter(p => p.id !== this.selectedPathId);
        this.selectedPathId = null;
      }
    },
    getPathLength(path) {
      if (!path.points || path.points.length < 2) return '0';
      let total = 0;
      for (let i = 1; i < path.points.length; i++) {
        const dx = path.points[i].x - path.points[i - 1].x;
        const dy = path.points[i].y - path.points[i - 1].y;
        total += Math.sqrt(dx * dx + dy * dy);
      }
      return (total * 0.5).toFixed(1);
    },
    saveAllPaths() {
      localStorage.setItem('robot_paths', JSON.stringify(this.paths));
      alert('路径配置已保存！');
    },
    testPath() {
      if (!this.selectedPathId) {
        alert('请先选择要测试的路径！');
        return;
      }
      alert('正在测试路径: ' + this.selectedPath.name);
    },
    exportPaths() {
      const data = JSON.stringify(this.paths, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'robot_paths.json';
      a.click();
      URL.revokeObjectURL(url);
    },
    importPaths() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = JSON.parse(e.target.result);
              if (Array.isArray(data)) {
                this.paths = data;
                alert('路径数据导入成功！');
              }
            } catch (err) {
              alert('导入失败，请检查文件格式！');
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    }
  },
  watch: {
    paths: {
      deep: true,
      handler() {
        this.paths.forEach(path => {
          path.svgPath = this.generateSvgPath(path.points, path.curveIntensity || 0);
        });
      },
      immediate: true
    }
  },
  mounted() {
    const saved = localStorage.getItem('robot_paths');
    if (saved) {
      try {
        this.paths = JSON.parse(saved);
      } catch (e) {}
    }
  }
};
</script>
