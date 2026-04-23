<template>
      <div
        id="temp-task-page"
        class="bg-map-bg min-h-screen flex flex-col"
      >
        <!-- 顶部导航 -->
        <header
          class="bg-white shadow-sm px-6 py-3 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <button
              @click="$router.push('/main')"
              class="flex items-center gap-2 text-primary hover:text-primary/80 transition"
            >
              <i class="fa fa-arrow-left"></i>
              <span>返回</span>
            </button>
            <h1 class="text-xl font-bold text-gray-800">临时任务</h1>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="startTempTask()"
              class="bg-success hover:bg-success/90 text-white px-4 py-2 rounded flex items-center gap-1 transition"
            >
              <i class="fa fa-play"></i>
              <span>开始</span>
            </button>
            <button
              @click="pauseTempTask()"
              class="bg-warning hover:bg-warning/90 text-white px-4 py-2 rounded flex items-center gap-1 transition"
            >
              <i class="fa fa-pause"></i>
              <span>暂停</span>
            </button>
            <button
              @click="stopTempTask()"
              class="bg-danger hover:bg-danger/90 text-white px-4 py-2 rounded flex items-center gap-1 transition"
            >
              <i class="fa fa-stop"></i>
              <span>停止</span>
            </button>
          </div>
        </header>

        <!-- 临时任务页面主内容 -->
        <main class="flex-1 flex">
          <!-- 中心主地图区域 -->
          <section
            class="flex-1 bg-white m-4 rounded shadow-sm overflow-hidden relative"
          >
            <!-- 网格背景地图 -->
            <div
              id="temp-task-map-container"
              class="w-full h-full relative overflow-hidden"
            >
              <div
                id="temp-task-map-content"
                class="w-full h-full grid-bg relative map-zoom-container"
                style="transform: scale(1)"
              >
                <!-- 路径线 -->
                <svg class="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M150,300 L220,300 L220,180 L350,180 L350,380 L480,380"
                    stroke="#409eff"
                    stroke-width="2"
                    stroke-dasharray="4 4"
                    fill="none"
                  />
                </svg>

                <!-- 点位标记 -->
                <div
                  class="absolute w-4 h-4 bg-success rounded-full left-[150px] top-[300px] -translate-x-1/2 -translate-y-1/2"
                  title="起点 P101"
                >
                  <div
                    class="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap"
                  >
                    P101 (起点)
                  </div>
                </div>
                <div
                  class="absolute w-4 h-4 bg-primary rounded-full left-[220px] top-[300px] -translate-x-1/2 -translate-y-1/2"
                  title="P102"
                >
                  <div
                    class="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap"
                  >
                    P102
                  </div>
                </div>
                <div
                  class="absolute w-4 h-4 bg-primary rounded-full left-[220px] top-[180px] -translate-x-1/2 -translate-y-1/2"
                  title="P103"
                >
                  <div
                    class="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap"
                  >
                    P103
                  </div>
                </div>
                <div
                  class="absolute w-4 h-4 bg-primary rounded-full left-[350px] top-[180px] -translate-x-1/2 -translate-y-1/2"
                  title="P104"
                >
                  <div
                    class="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap"
                  >
                    P104
                  </div>
                </div>
                <div
                  class="absolute w-4 h-4 bg-primary rounded-full left-[350px] top-[380px] -translate-x-1/2 -translate-y-1/2"
                  title="P105"
                >
                  <div
                    class="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap"
                  >
                    P105
                  </div>
                </div>
                <div
                  class="absolute w-4 h-4 bg-warning rounded-full left-[480px] top-[380px] -translate-x-1/2 -translate-y-1/2"
                  title="终点 P106"
                >
                  <div
                    class="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap"
                  >
                    P106 (终点)
                  </div>
                </div>

                <!-- 机器人图标 -->
                <div
                  class="absolute left-[350px] top-[180px] -translate-x-1/2 -translate-y-1/2 bg-primary text-white p-1.5 rounded shadow-lg"
                >
                  <i class="fa fa-truck text-lg"></i>
                </div>

                <!-- 临时任务标识 -->
                <div
                  class="absolute bottom-8 right-16 text-gray-deep font-medium"
                >
                  临时任务 - 主地图
                </div>

                <!-- 地图缩放控制 -->
                <div class="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                  <button
                    id="temp-task-map-zoom-in"
                    class="w-8 h-8 flex items-center justify-center bg-white border border-gray-light rounded hover:border-primary transition shadow-sm"
                  >
                    <i class="fa fa-plus"></i>
                  </button>
                  <button
                    id="temp-task-map-zoom-reset"
                    class="w-8 h-8 flex items-center justify-center bg-white border border-gray-light rounded hover:border-primary transition shadow-sm"
                  >
                    <i class="fa fa-dot-circle-o"></i>
                  </button>
                  <button
                    id="temp-task-map-zoom-out"
                    class="w-8 h-8 flex items-center justify-center bg-white border border-gray-light rounded hover:border-primary transition shadow-sm"
                  >
                    <i class="fa fa-minus"></i>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- 右侧任务点列表栏 -->
          <aside
            class="w-64 bg-white shadow-sm flex flex-col shrink-0 p-4 overflow-y-auto"
          >
            <!-- 任务点列表标题 -->
            <div class="bg-gray-50 rounded border border-gray-light p-3 mb-4">
              <h3 class="font-bold text-gray-700 mb-3 flex items-center gap-2">
                <i class="fa fa-list text-primary"></i>
                任务点列表
              </h3>

              <!-- 表头 -->
              <div
                class="flex border-b border-gray-200 pb-2 mb-2 text-sm font-medium text-gray-600"
              >
                <div class="flex-1">名称</div>
                <div class="flex-1">类型</div>
              </div>

              <!-- 列表内容 -->
              <div class="space-y-1">
                <div
                  class="flex py-2 px-2 rounded hover:bg-gray-50 cursor-pointer transition"
                  @click="selectTaskPoint(this, 'end')"
                >
                  <div class="flex-1 text-sm">end</div>
                  <div class="flex-1 text-sm text-gray-500">导航点</div>
                </div>
                <div
                  class="flex py-2 px-2 rounded hover:bg-gray-50 cursor-pointer transition"
                  @click="selectTaskPoint(this, 'origin')"
                >
                  <div class="flex-1 text-sm">origin</div>
                  <div class="flex-1 text-sm text-gray-500">初始点</div>
                </div>
                <div
                  class="flex py-2 px-2 rounded bg-primary/10 cursor-pointer transition"
                  @click="selectTaskPoint(this, 'p1')"
                >
                  <div class="flex-1 text-sm font-medium text-primary">p1</div>
                  <div class="flex-1 text-sm text-primary">导航点</div>
                </div>
                <div
                  class="flex py-2 px-2 rounded hover:bg-gray-50 cursor-pointer transition"
                  @click="selectTaskPoint(this, 'p2')"
                >
                  <div class="flex-1 text-sm">p2</div>
                  <div class="flex-1 text-sm text-gray-500">导航点</div>
                </div>
                <div
                  class="flex py-2 px-2 rounded hover:bg-gray-50 cursor-pointer transition"
                  @click="selectTaskPoint(this, 'p3')"
                >
                  <div class="flex-1 text-sm">p3</div>
                  <div class="flex-1 text-sm text-gray-500">导航点</div>
                </div>
                <div
                  class="flex py-2 px-2 rounded hover:bg-gray-50 cursor-pointer transition"
                  @click="selectTaskPoint(this, 'p4')"
                >
                  <div class="flex-1 text-sm">p4</div>
                  <div class="flex-1 text-sm text-gray-500">导航点</div>
                </div>
                <div
                  class="flex py-2 px-2 rounded hover:bg-gray-50 cursor-pointer transition"
                  @click="selectTaskPoint(this, 'p5')"
                >
                  <div class="flex-1 text-sm">p5</div>
                  <div class="flex-1 text-sm text-gray-500">导航点</div>
                </div>
                <div
                  class="flex py-2 px-2 rounded hover:bg-gray-50 cursor-pointer transition"
                  @click="selectTaskPoint(this, 'start')"
                >
                  <div class="flex-1 text-sm">start</div>
                  <div class="flex-1 text-sm text-gray-500">导航点</div>
                </div>
              </div>
            </div>

            <!-- 任务操作 -->
            <div class="bg-white rounded border border-gray-light p-3">
              <h3 class="font-bold text-gray-700 mb-3 flex items-center gap-2">
                <i class="fa fa-cogs text-primary"></i>
                任务操作
              </h3>
              <div class="space-y-2">
                <button
                  class="w-full text-sm bg-primary/10 text-primary py-2 rounded hover:bg-primary/20 transition flex items-center justify-center gap-2"
                >
                  <i class="fa fa-plus"></i>
                  <span>添加任务点</span>
                </button>
                <button
                  class="w-full text-sm bg-warning/10 text-warning py-2 rounded hover:bg-warning/20 transition flex items-center justify-center gap-2"
                >
                  <i class="fa fa-trash"></i>
                  <span>清除任务</span>
                </button>
                <button
                  class="w-full text-sm bg-success/10 text-success py-2 rounded hover:bg-success/20 transition flex items-center justify-center gap-2"
                >
                  <i class="fa fa-save"></i>
                  <span>保存任务</span>
                </button>
              </div>
            </div>

            <!-- 任务状态 -->
            <div class="mt-4 bg-gray-50 rounded border border-gray-light p-3">
              <h3 class="font-bold text-gray-700 mb-2 flex items-center gap-2">
                <i class="fa fa-info-circle text-primary"></i>
                任务状态
              </h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-deep">当前状态</span>
                  <span id="task-status" class="text-gray-500">未开始</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-deep">已选点</span>
                  <span id="selected-point" class="text-primary font-medium"
                    >p1</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-deep">任务进度</span>
                  <span class="text-gray-700">0/8</span>
                </div>
              </div>
            </div>
          </aside>
        </main>

        <!-- 临时任务页面底部状态栏 -->
        <footer
          class="bg-white border-t border-gray-light px-4 py-1.5 flex items-center justify-between text-sm"
        >
          <div class="flex items-center gap-2">
            <i class="fa fa-circle text-success text-xs"></i>
            <span>临时任务状态：就绪</span>
          </div>
          <div class="flex items-center gap-6">
            <div>当前地图: 主地图 v2.1</div>
            <div>最后更新: 2024-05-20 16:50:10</div>
          </div>
        </footer>
      </div>
</template>

<script>
export default {
  name: 'TempTaskPage',
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {
      // Page-specific initialization
    },
  },
};
</script>
