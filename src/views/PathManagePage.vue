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
          v-if="!isRecording"
          @click="startRecording()"
          class="bg-primary hover:opacity-90 text-white px-4 py-1.5 rounded flex items-center gap-1 transition"
        >
          <i class="fa fa-circle"></i>
          <span>开始录制</span>
        </button>
        <template v-else>
          <button
            v-if="recordingStep === 1"
            @click="confirmStartPoint()"
            class="bg-success hover:opacity-90 text-white px-4 py-1.5 rounded flex items-center gap-1 transition"
          >
            <i class="fa fa-check"></i>
            <span>确定起点</span>
          </button>
          <button
            v-if="recordingStep === 2"
            @click="confirmEndPoint()"
            class="bg-danger hover:opacity-90 text-white px-4 py-1.5 rounded flex items-center gap-1 transition"
          >
            <i class="fa fa-stop"></i>
            <span>确定终点</span>
          </button>
          <button
            v-if="recordingStep === 3"
            @click="saveRecording()"
            class="bg-success hover:opacity-90 text-white px-4 py-1.5 rounded flex items-center gap-1 transition"
          >
            <i class="fa fa-save"></i>
            <span>保存录制</span>
          </button>
          <button
            @click="cancelRecording()"
            class="bg-gray-500 hover:opacity-90 text-white px-4 py-1.5 rounded flex items-center gap-1 transition"
          >
            <i class="fa fa-times"></i>
            <span>取消</span>
          </button>
        </template>
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
        class="flex-1 relative overflow-auto"
        :style="{cursor: isRecording ? 'crosshair' : 'default'}"
        @click="handleMapClick"
      >
        <img src="/src/assets/image.png" alt="地图背景" class="absolute inset-0 w-full h-full object-cover" />
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
            :marker-end="path.direction === 'forward' ? 'url(#path-arrow)' : (path.direction === 'reverse' ? 'url(#path-arrow-green)' : '')"
            :class="['cursor-pointer', {'opacity-50': selectedPathId && selectedPathId !== path.id, 'stroke-4': selectedPathId === path.id}]"
            @click.stop="selectPath(path.id)"
          />
          <path
            v-if="isRecording && tempPath"
            :d="tempPath"
            stroke="#f56c6c"
            stroke-width="4"
            stroke-dasharray="10,5"
            fill="none"
            opacity="0.8"
          />
          <circle
            v-if="recordingStartPoint"
            :cx="recordingStartPoint.x"
            :cy="recordingStartPoint.y"
            r="12"
            fill="#67c23a"
            stroke="white"
            stroke-width="3"
            class="animate-pulse"
          />
          <text
            v-if="recordingStartPoint"
            :x="recordingStartPoint.x"
            :y="recordingStartPoint.y + 25"
            text-anchor="middle"
            fill="#67c23a"
            font-size="12"
            font-weight="bold"
          >起点</text>
          <circle
            v-if="recordingEndPoint"
            :cx="recordingEndPoint.x"
            :cy="recordingEndPoint.y"
            r="12"
            fill="#f56c6c"
            stroke="white"
            stroke-width="3"
            class="animate-pulse"
          />
          <text
            v-if="recordingEndPoint"
            :x="recordingEndPoint.x"
            :y="recordingEndPoint.y + 25"
            text-anchor="middle"
            fill="#f56c6c"
            font-size="12"
            font-weight="bold"
          >终点</text>
        </svg>

        <div v-if="isRecording" class="absolute top-20 left-1/2 -translate-x-1/2 bg-primary/90 text-white px-4 py-2 rounded shadow-lg text-sm">
          <i class="fa fa-circle text-xs animate-pulse mr-2"></i>
          <span v-if="recordingStep === 1">请在地图上点击确定起点</span>
          <span v-if="recordingStep === 2">请在地图上点击确定终点</span>
          <span v-if="recordingStep === 3">已生成路径，点击保存录制</span>
        </div>
      </section>

      <aside class="right-panel">
        <div class="panel-card">
          <div class="flex border-b border-gray-200 mb-3">
            <button
              @click="pathTab = 'path'"
              :class="pathTab === 'path' ? 'text-primary border-b-2 border-primary font-semibold' : 'text-gray-500'"
              class="flex-1 py-2 text-sm text-center transition"
            >
              路径
            </button>
            <button
              @click="pathTab = 'pathLine'"
              :class="pathTab === 'pathLine' ? 'text-primary border-b-2 border-primary font-semibold' : 'text-gray-500'"
              class="flex-1 py-2 text-sm text-center transition"
            >
              路径线
            </button>
          </div>

          <div v-if="pathTab === 'path'">
            <div class="max-h-48 overflow-y-auto space-y-2">
              <div
                v-for="path in pathsWithEndpoints"
                :key="path.id"
                @click="selectPath(path.id)"
                :class="['p-2 rounded cursor-pointer text-sm', selectedPathId === path.id ? 'bg-primary/10 border border-primary' : 'bg-gray-50 hover:bg-gray-100']"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full" :style="{backgroundColor: path.color}"></span>
                    <span class="font-medium">{{ path.name }}</span>
                  </div>
                  <span :class="['text-xs px-1.5 py-0.5 rounded', path.direction === 'forward' ? 'bg-blue-100 text-blue-600' : (path.direction === 'reverse' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600')]">
                    {{ path.direction === 'forward' ? '正向' : (path.direction === 'reverse' ? '反向' : '双向') }}
                  </span>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  起点: {{ path.startName || '-' }} → 终点: {{ path.endName || '-' }}
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="max-h-48 overflow-y-auto space-y-2">
              <div
                v-for="path in pathLinesWithoutEndpoints"
                :key="path.id"
                @click="selectPath(path.id)"
                :class="['p-2 rounded cursor-pointer text-sm', selectedPathId === path.id ? 'bg-primary/10 border border-primary' : 'bg-gray-50 hover:bg-gray-100']"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full" :style="{backgroundColor: path.color}"></span>
                    <span class="font-medium">{{ path.name }}</span>
                  </div>
                  <span :class="['text-xs px-1.5 py-0.5 rounded', path.direction === 'forward' ? 'bg-blue-100 text-blue-600' : (path.direction === 'reverse' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600')]">
                    {{ path.direction === 'forward' ? '正向' : (path.direction === 'reverse' ? '反向' : '双向') }}
                  </span>
                </div>
                <div class="text-xs text-gray-500 mt-1">{{ path.points.length }} 个节点</div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-title">
            <i class="fa fa-map-marker text-primary"></i>
            点列表
          </div>
          <div class="max-h-40 overflow-y-auto space-y-1">
            <div
              v-for="point in allPoints"
              :key="point.id"
              @click="selectPointForConnect(point)"
              :class="['flex items-center justify-between p-2 rounded text-xs cursor-pointer', selectedConnectPointId === point.id ? 'bg-primary/10 border border-primary' : 'hover:bg-gray-50']"
            >
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full" :class="point.type === 'start' ? 'bg-success' : (point.type === 'end' ? 'bg-danger' : 'bg-primary')"></div>
                <span>{{ point.name }}</span>
              </div>
              <span class="text-gray-400">{{ point.x }}, {{ point.y }}</span>
            </div>
          </div>
          <div v-if="selectedConnectPointId" class="mt-2 text-xs text-primary">
            <i class="fa fa-info-circle mr-1"></i>已选择 {{ getSelectedConnectPointName() }}，再选一个点连线
          </div>
          <button
            v-if="connectPointFirst && selectedConnectPointId && connectPointFirst !== selectedConnectPointId"
            @click="createPathLineFromPoints"
            class="mt-2 w-full py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90 transition"
          >
            <i class="fa fa-link mr-1"></i>创建路径线
          </button>
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
              <label class="text-xs text-gray-deep">行驶方向</label>
              <div class="flex gap-2">
                <button
                  @click="selectedPath.direction = 'forward'"
                  :class="selectedPath.direction === 'forward' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'"
                  class="flex-1 px-2 py-1 rounded text-xs"
                >
                  正向
                </button>
                <button
                  @click="selectedPath.direction = 'reverse'"
                  :class="selectedPath.direction === 'reverse' ? 'bg-success text-white' : 'bg-gray-200 text-gray-700'"
                  class="flex-1 px-2 py-1 rounded text-xs"
                >
                  反向
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
              <span>行驶方向</span>
              <span class="stats-value" :class="selectedPath.direction === 'forward' ? 'text-primary' : 'text-success'">
                {{ selectedPath.direction === 'forward' ? '正向' : (selectedPath.direction === 'reverse' ? '反向' : '双向') }}
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
              <span>正向路径</span>
              <span class="stats-value text-primary">{{ paths.filter(p => p.direction === 'forward').length }}</span>
            </div>
            <div class="stats-item">
              <span>反向路径</span>
              <span class="stats-value text-success">{{ paths.filter(p => p.direction === 'reverse').length }}</span>
            </div>
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
            <label class="block text-sm text-gray-600 mb-1">路径类型</label>
            <div class="flex gap-2">
              <button @click="newPathType = 'path'" :class="newPathType === 'path' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'" class="flex-1 py-2 rounded">
                路径（有起终点）
              </button>
              <button @click="newPathType = 'pathLine'" :class="newPathType === 'pathLine' ? 'bg-success text-white' : 'bg-gray-200 text-gray-700'" class="flex-1 py-2 rounded">
                路径线（无起终点）
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">行驶方向</label>
            <div class="flex gap-2">
              <button @click="newPathDirection = 'forward'" :class="newPathDirection === 'forward' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'" class="flex-1 py-2 rounded">
                正向
              </button>
              <button @click="newPathDirection = 'reverse'" :class="newPathDirection === 'reverse' ? 'bg-success text-white' : 'bg-gray-200 text-gray-700'" class="flex-1 py-2 rounded">
                反向
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
      pathTab: 'path',
      isRecording: false,
      recordingStep: 1,
      recordingStartPoint: null,
      recordingEndPoint: null,
      recordingPoints: [],
      tempPath: null,
      selectedPathId: null,
      showAddDialog: false,
      newPathName: '',
      newPathDirection: 'forward',
      newPathColor: '#409eff',
      newPathType: 'path',
      isAddingNewPath: false,
      pathColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399'],
      selectedConnectPointId: null,
      connectPointFirst: null,
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
          direction: 'forward',
          color: '#409eff',
          curveIntensity: 0,
          type: 'path',
          startName: 'P101',
          endName: 'P102',
          points: [
            { x: 100, y: 200 },
            { x: 180, y: 200 }
          ]
        },
        {
          id: 'path-2',
          name: 'PA002',
          direction: 'reverse',
          color: '#67c23a',
          curveIntensity: -20,
          type: 'path',
          startName: 'P102',
          endName: 'P103',
          points: [
            { x: 180, y: 200 },
            { x: 180, y: 130 }
          ]
        },
        {
          id: 'path-3',
          name: 'PA003',
          direction: 'forward',
          color: '#409eff',
          curveIntensity: 30,
          type: 'path',
          startName: 'P103',
          endName: 'P104',
          points: [
            { x: 180, y: 130 },
            { x: 280, y: 130 }
          ]
        },
        {
          id: 'pathline-1',
          name: 'PL001',
          direction: 'forward',
          color: '#e6a23c',
          curveIntensity: 0,
          type: 'pathLine',
          startName: '',
          endName: '',
          points: [
            { x: 280, y: 130 },
            { x: 280, y: 260 }
          ]
        },
        {
          id: 'path-4',
          name: 'PA004',
          direction: 'reverse',
          color: '#67c23a',
          curveIntensity: -30,
          type: 'path',
          startName: 'P105',
          endName: 'P106',
          points: [
            { x: 280, y: 260 },
            { x: 380, y: 260 }
          ]
        }
      ]
    };
  },
  computed: {
    selectedPath() {
      return this.paths.find(p => p.id === this.selectedPathId) || {};
    },
    currentTime() {
      return new Date().toLocaleString('zh-CN');
    },
    pathsWithEndpoints() {
      return this.paths.filter(p => p.type === 'path');
    },
    pathLinesWithoutEndpoints() {
      return this.paths.filter(p => p.type === 'pathLine');
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
    startRecording() {
      this.isRecording = true;
      this.recordingStep = 1;
      this.recordingStartPoint = null;
      this.recordingEndPoint = null;
      this.tempPath = null;
      this.recordingPoints = [];
      this.isAddingNewPath = false;
    },
    confirmStartPoint() {
      if (!this.recordingStartPoint) {
        alert('请先在地图上点击确定起点！');
        return;
      }
      this.recordingStep = 2;
    },
    confirmEndPoint() {
      if (!this.recordingEndPoint) {
        alert('请先在地图上点击确定终点！');
        return;
      }
      this.recordingStep = 3;
      this.recordingPoints = [this.recordingStartPoint, this.recordingEndPoint];
      this.tempPath = this.generateSvgPath(this.recordingPoints, 0);
    },
    saveRecording() {
      if (!this.recordingStartPoint || !this.recordingEndPoint) {
        alert('请先确定起点和终点！');
        return;
      }
      const newPath = {
        id: 'path-' + Date.now(),
        name: 'PA' + (this.paths.length + 1).toString().padStart(3, '0'),
        direction: 'forward',
        color: '#409eff',
        curveIntensity: 0,
        type: 'path',
        startName: '起点',
        endName: '终点',
        points: [this.recordingStartPoint, this.recordingEndPoint]
      };
      this.paths.push(newPath);
      this.isRecording = false;
      this.recordingStep = 1;
      this.recordingStartPoint = null;
      this.recordingEndPoint = null;
      this.tempPath = null;
      this.recordingPoints = [];
    },
    cancelRecording() {
      this.isRecording = false;
      this.recordingStep = 1;
      this.recordingStartPoint = null;
      this.recordingEndPoint = null;
      this.tempPath = null;
      this.recordingPoints = [];
    },
    handleMapClick(event) {
      if (!this.isRecording && !this.isAddingNewPath) return;
      
      const mapArea = event.currentTarget;
      const rect = mapArea.getBoundingClientRect();
      const x = event.clientX - rect.left + mapArea.scrollLeft;
      const y = event.clientY - rect.top + mapArea.scrollTop;
      
      if (this.isRecording) {
        if (this.recordingStep === 1) {
          this.recordingStartPoint = { x, y };
        } else if (this.recordingStep === 2) {
          this.recordingEndPoint = { x, y };
        }
      } else {
        this.recordingPoints.push({ x, y });
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
        direction: this.isAddingNewPath ? this.newPathDirection : 'forward',
        color: this.isAddingNewPath ? this.newPathColor : '#409eff',
        curveIntensity: 0,
        type: this.isAddingNewPath ? this.newPathType : 'path',
        startName: this.isAddingNewPath && this.newPathType === 'path' ? '起点' : '',
        endName: this.isAddingNewPath && this.newPathType === 'path' ? '终点' : '',
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
      this.selectedPathId = this.selectedPathId === pathId ? null : pathId;
    },
    selectPointForConnect(point) {
      if (!this.connectPointFirst) {
        this.connectPointFirst = point.id;
        this.selectedConnectPointId = point.id;
      } else {
        this.selectedConnectPointId = point.id;
      }
    },
    getSelectedConnectPointName() {
      const point = this.allPoints.find(p => p.id === this.selectedConnectPointId);
      return point ? point.name : '';
    },
    createPathLineFromPoints() {
      const firstPoint = this.allPoints.find(p => p.id === this.connectPointFirst);
      const secondPoint = this.allPoints.find(p => p.id === this.selectedConnectPointId);
      if (!firstPoint || !secondPoint) return;

      const newPathLine = {
        id: 'pathline-' + Date.now(),
        name: 'PL' + (this.paths.filter(p => p.type === 'pathLine').length + 1).toString().padStart(3, '0'),
        direction: 'forward',
        color: '#e6a23c',
        curveIntensity: 0,
        type: 'pathLine',
        startName: '',
        endName: '',
        points: [
          { x: firstPoint.x, y: firstPoint.y },
          { x: secondPoint.x, y: secondPoint.y }
        ]
      };
      this.paths.push(newPathLine);
      this.connectPointFirst = null;
      this.selectedConnectPointId = null;
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
