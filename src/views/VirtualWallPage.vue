<template>
  <div id="virtual-wall-page" class="bg-gray-50 min-h-screen flex flex-col">
    <header class="bg-white border-b border-gray-200 shadow-sm px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="$router.push('/main')" class="flex items-center gap-2 text-primary hover:text-primary/80 transition">
          <i class="fa fa-arrow-left"></i>
          <span>返回</span>
        </button>
        <h1 class="text-lg font-bold">虚拟墙设置</h1>
      </div>
      <div class="w-20"></div>
    </header>

    <main class="flex-1 flex overflow-hidden p-4">
      <div class="flex-1 flex gap-4 h-full">
        <div class="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col min-w-0">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-700 flex items-center gap-2">
              <i class="fa fa-paint-brush text-primary"></i>
              绘制区域
            </h3>
            <div class="flex gap-2">
              <button @click="currentTab = 'wall'" :class="currentTab === 'wall' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'" class="px-3 py-1 rounded text-sm">虚拟墙</button>
              <button @click="currentTab = 'narrow'" :class="currentTab === 'narrow' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'" class="px-3 py-1 rounded text-sm">狭窄通道</button>
              <button @click="currentTab = 'slope'" :class="currentTab === 'slope' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'" class="px-3 py-1 rounded text-sm">斜坡区域</button>
            </div>
          </div>
          
          <div class="mb-3 flex items-center gap-2" v-if="currentTab === 'wall'">
            <button @click="currentShapeTool = 'line'" :class="currentShapeTool === 'line' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'" class="px-3 py-1 rounded text-sm">
              <i class="fa fa-minus mr-1"></i>直线
            </button>
            <button @click="currentShapeTool = 'polygon'" :class="currentShapeTool === 'polygon' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'" class="px-3 py-1 rounded text-sm">
              <i class="fa fa-draw-polygon mr-1"></i>多边形
            </button>
          </div>
          
          <div class="flex-1 bg-gray-50 rounded-lg border border-gray-200 relative overflow-hidden">
            <canvas id="virtual-wall-canvas" class="w-full h-full cursor-crosshair"></canvas>
          </div>
          <div class="mt-3 text-xs text-gray-500 space-y-1 bg-blue-50 p-3 rounded-lg">
            <p><i class="fa fa-info-circle text-primary mr-1"></i> 左键点击绘制 / 双击完成绘制</p>
            <p><i class="fa fa-info-circle text-primary mr-1"></i> 右键点击可撤销上一步绘制</p>
          </div>
        </div>

        <div class="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-shrink-0 overflow-y-auto">
          <div v-if="currentTab === 'wall'">
            <h3 class="font-semibold text-gray-700 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
              <i class="fa fa-ban text-red-500"></i>
              虚拟墙配置
            </h3>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">虚拟墙名称</label>
              <input type="text" v-model="wallConfig.name" class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" placeholder="请输入名称" />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">墙体类型</label>
              <select v-model="wallConfig.type" class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white">
                <option value="solid">实心阻挡墙</option>
                <option value="slow">减速提醒墙</option>
                <option value="boundary">区域边界墙</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">线条宽度 (px)</label>
              <input type="number" v-model.number="wallConfig.width" class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" min="1" max="20" />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">线条颜色</label>
              <div class="flex items-center gap-3">
                <input type="color" v-model="wallConfig.color" class="flex-1 h-10 rounded cursor-pointer" />
                <span class="text-sm text-gray-500">{{ wallConfig.color }}</span>
              </div>
            </div>

            <div class="mb-4 flex items-center justify-between">
              <label class="text-sm font-medium text-gray-600">启用虚拟墙</label>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="wallConfig.enabled" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          <div v-if="currentTab === 'narrow'">
            <h3 class="font-semibold text-gray-700 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
              <i class="fa fa-arrows-h text-yellow-500"></i>
              狭窄通道配置
            </h3>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">通道名称</label>
              <input type="text" v-model="narrowConfig.name" class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" placeholder="请输入名称" />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">通过模式</label>
              <select v-model="narrowConfig.mode" class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white">
                <option value="single">单向通过</option>
                <option value="bi">双向通过</option>
                <option value="slow">减速通过</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">通过速度 (m/s)</label>
              <input type="number" v-model.number="narrowConfig.speed" class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" min="0.1" max="1" step="0.1" />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">通道宽度 (m)</label>
              <input type="number" v-model.number="narrowConfig.width" class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" min="0.5" max="3" step="0.1" />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">显示颜色</label>
              <div class="flex items-center gap-3">
                <input type="color" v-model="narrowConfig.color" class="flex-1 h-10 rounded cursor-pointer" />
                <span class="text-sm text-gray-500">{{ narrowConfig.color }}</span>
              </div>
            </div>

            <div class="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-700">
              <i class="fa fa-info-circle mr-1"></i>
              狭窄通道需要绘制为多边形区域，小车通过时会自动减速
            </div>
          </div>

          <div v-if="currentTab === 'slope'">
            <h3 class="font-semibold text-gray-700 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
              <i class="fa fa-arrow-up text-orange-500"></i>
              斜坡区域配置
            </h3>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">斜坡名称</label>
              <input type="text" v-model="slopeConfig.name" class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" placeholder="请输入名称" />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">斜坡类型</label>
              <select v-model="slopeConfig.type" class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white">
                <option value="up">上坡</option>
                <option value="down">下坡</option>
                <option value="both">上下坡</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">斜坡角度 (°)</label>
              <input type="number" v-model.number="slopeConfig.angle" class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" min="5" max="45" />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">爬坡速度 (m/s)</label>
              <input type="number" v-model.number="slopeConfig.speed" class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" min="0.1" max="0.8" step="0.1" />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">显示颜色</label>
              <div class="flex items-center gap-3">
                <input type="color" v-model="slopeConfig.color" class="flex-1 h-10 rounded cursor-pointer" />
                <span class="text-sm text-gray-500">{{ slopeConfig.color }}</span>
              </div>
            </div>

            <div class="bg-orange-50 p-3 rounded-lg text-xs text-orange-700">
              <i class="fa fa-info-circle mr-1"></i>
              斜坡区域需要绘制为多边形，小车进入时会自动调整功率
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4">
            <div class="flex gap-2">
              <button @click="saveCurrentConfig()" class="flex-1 bg-primary text-white py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2">
                <i class="fa fa-save"></i>
                保存
              </button>
              <button @click="clearDrawing()" class="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                <i class="fa fa-trash-o"></i>
                清空
              </button>
            </div>
          </div>

          <div class="mt-4 border-t border-gray-100 pt-4">
            <h4 class="font-medium text-gray-700 mb-3 text-sm">已配置区域</h4>
            <div class="space-y-2 max-h-40 overflow-y-auto">
              <div v-for="(item, index) in savedItems" :key="index" class="p-2 bg-gray-50 rounded-lg flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full" :style="{backgroundColor: item.color}"></span>
                  <span class="text-gray-700">{{ item.name }}</span>
                </div>
                <button @click="deleteItem(index)" class="text-gray-400 hover:text-red-500">
                  <i class="fa fa-times"></i>
                </button>
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
  name: 'VirtualWallPage',
  data() {
    return {
      currentTab: 'wall',
      currentShapeTool: 'polygon',
      currentPoints: [],
      isDrawing: false,
      ctx: null,
      canvas: null,
      savedShapes: [],
      wallConfig: {
        name: '禁区虚拟墙',
        type: 'solid',
        width: 5,
        color: '#ef4444',
        enabled: true
      },
      narrowConfig: {
        name: '狭窄通道A',
        mode: 'slow',
        speed: 0.3,
        width: 1.2,
        color: '#f59e0b'
      },
      slopeConfig: {
        name: '斜坡区域1',
        type: 'up',
        angle: 15,
        speed: 0.4,
        color: '#f97316'
      },
      savedItems: [
        { name: '禁区1', color: '#ef4444', type: 'wall' },
        { name: '通道A', color: '#f59e0b', type: 'narrow' },
        { name: '斜坡1', color: '#f97316', type: 'slope' }
      ]
    };
  },
  mounted() {
    setTimeout(() => {
      this.initCanvas();
      this.setupEvents();
    }, 100);
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    initCanvas() {
      this.canvas = document.getElementById('virtual-wall-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      const container = this.canvas.parentElement;
      this.canvas.width = container.clientWidth;
      this.canvas.height = container.clientHeight;
      this.drawAll();
    },
    handleResize() {
      if (!this.canvas) return;
      const container = this.canvas.parentElement;
      this.canvas.width = container.clientWidth;
      this.canvas.height = container.clientHeight;
      this.drawAll();
    },
    drawGrid() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.strokeStyle = '#e4e7ed';
      this.ctx.lineWidth = 0.5;
      for (let x = 0; x < this.canvas.width; x += 20) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvas.height);
        this.ctx.stroke();
      }
      for (let y = 0; y < this.canvas.height; y += 20) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.canvas.width, y);
        this.ctx.stroke();
      }
    },
    getCurrentConfig() {
      switch(this.currentTab) {
        case 'wall': return this.wallConfig;
        case 'narrow': return this.narrowConfig;
        case 'slope': return this.slopeConfig;
        default: return this.wallConfig;
      }
    },
    getCurrentShapeTool() {
      if (this.currentTab === 'wall') {
        return this.currentShapeTool;
      }
      return 'polygon';
    },
    drawShape(shape) {
      if (!this.ctx) return;
      
      this.ctx.beginPath();
      this.ctx.fillStyle = shape.color + '40';
      this.ctx.strokeStyle = shape.color;
      this.ctx.lineWidth = shape.width || 5;

      if (shape.tool === 'polygon' && shape.points.length >= 3) {
        this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
      } else if (shape.tool === 'line' && shape.points.length >= 2) {
        this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        this.ctx.stroke();
      }
    },
    drawCurrent(points) {
      if (!this.ctx || points.length === 0) return;
      
      const config = this.getCurrentConfig();
      const tool = this.getCurrentShapeTool();
      
      this.ctx.beginPath();
      this.ctx.fillStyle = config.color + '40';
      this.ctx.strokeStyle = config.color;
      this.ctx.lineWidth = config.width || 5;
      
      if (tool === 'polygon') {
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          this.ctx.lineTo(points[i].x, points[i].y);
        }
        if (points.length >= 3) {
          this.ctx.closePath();
          this.ctx.fill();
        }
        this.ctx.stroke();
      } else {
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.stroke();
      }
    },
    drawPoints(points, color) {
      if (!this.ctx) return;
      
      points.forEach(point => {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      });
    },
    drawPreview(previewPoint) {
      if (!this.ctx || this.currentPoints.length === 0) return;
      
      const config = this.getCurrentConfig();
      const lastPoint = this.currentPoints[this.currentPoints.length - 1];
      
      this.ctx.beginPath();
      this.ctx.strokeStyle = config.color;
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([5, 5]);
      this.ctx.moveTo(lastPoint.x, lastPoint.y);
      this.ctx.lineTo(previewPoint.x, previewPoint.y);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    },
    drawAll() {
      if (!this.ctx || !this.canvas) return;
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawGrid();
      
      this.savedShapes.forEach(shape => {
        this.drawShape(shape);
      });
      
      if (this.currentPoints.length > 0) {
        this.drawCurrent(this.currentPoints);
        const config = this.getCurrentConfig();
        this.drawPoints(this.currentPoints, config.color);
      }
    },
    setupEvents() {
      if (!this.canvas) return;
      
      this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
      this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
      this.canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.undoPoint();
      });
      this.canvas.addEventListener('dblclick', () => this.finishDrawing());
    },
    getCanvasCoords(e) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    },
    handleMouseDown(e) {
      const coords = this.getCanvasCoords(e);
      this.currentPoints.push(coords);
      this.isDrawing = true;
      this.drawAll();
    },
    handleMouseMove(e) {
      if (!this.isDrawing || this.currentPoints.length === 0) return;
      
      const coords = this.getCanvasCoords(e);
      this.drawAll();
      this.drawPreview(coords);
    },
    handleMouseUp() {
      this.isDrawing = false;
    },
    undoPoint() {
      if (this.currentPoints.length > 0) {
        this.currentPoints.pop();
        this.drawAll();
      }
    },
    finishDrawing() {
      const tool = this.getCurrentShapeTool();
      const minPoints = tool === 'polygon' ? 3 : 2;
      
      if (this.currentPoints.length < minPoints) return;
      
      const config = this.getCurrentConfig();
      const newShape = {
        tool: tool,
        points: [...this.currentPoints],
        color: config.color,
        width: config.width || 5,
        type: this.currentTab
      };
      
      this.savedShapes.push(newShape);
      this.currentPoints = [];
      this.drawAll();
    },
    saveCurrentConfig() {
      let newItem;
      switch(this.currentTab) {
        case 'wall':
          newItem = { name: this.wallConfig.name, color: this.wallConfig.color, type: 'wall' };
          break;
        case 'narrow':
          newItem = { name: this.narrowConfig.name, color: this.narrowConfig.color, type: 'narrow' };
          break;
        case 'slope':
          newItem = { name: this.slopeConfig.name, color: this.slopeConfig.color, type: 'slope' };
          break;
      }
      if (newItem) {
        this.savedItems.push(newItem);
      }
      alert('配置已保存!');
    },
    clearDrawing() {
      if (confirm('确定要清空所有绘制吗?')) {
        this.currentPoints = [];
        this.savedShapes = [];
        this.drawAll();
      }
    },
    deleteItem(index) {
      if (confirm('确定要删除此配置吗?')) {
        this.savedItems.splice(index, 1);
      }
    }
  },
};
</script>
