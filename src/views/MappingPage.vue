<template>
      <div
        id="mapping-page"
        class="bg-map-bg min-h-screen flex flex-col map-scrollbar"
      >
        <!-- 建图页面顶部工具栏 -->
        <header
          class="bg-white shadow-sm px-4 py-2 flex items-center gap-3 border-b border-gray-light"
        >
          <button
            @click="$router.push('/create-map')"
            class="flex items-center gap-1 text-primary hover:text-primary/80 transition"
          >
            <i class="fa fa-arrow-left text-sm"></i>
            <span class="text-sm">返回</span>
          </button>

          <!-- 顶部功能按钮组 -->
          <div class="flex items-center gap-2 flex-wrap">
            <button
              @click="openSaveModal()"
              class="bg-map-control hover:bg-map-control/80 text-gray-700 px-3 py-1 rounded text-sm flex items-center gap-1 transition"
            >
              <i class="fa fa-save"></i>保存
            </button>
            <button
              class="bg-warning hover:bg-warning/90 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition"
            >
              <i class="fa fa-stop"></i>停止建图
            </button>
            <button
              class="bg-danger hover:bg-danger/90 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition"
            >
              <i class="fa fa-times"></i>退出
            </button>

            <!-- 分割线 -->
            <div class="w-px h-6 bg-gray-light mx-1"></div>

            <!-- 视图控制 -->
            <button
              class="bg-map-control hover:bg-map-control/80 text-gray-700 px-3 py-1 rounded text-sm flex items-center gap-1 transition"
            >
              <i class="fa fa-search-plus"></i>放大
            </button>
            <button
              class="bg-map-control hover:bg-map-control/80 text-gray-700 px-3 py-1 rounded text-sm flex items-center gap-1 transition"
            >
              <i class="fa fa-search-minus"></i>缩小
            </button>
            <button
              class="bg-map-control hover:bg-map-control/80 text-gray-700 px-3 py-1 rounded text-sm flex items-center gap-1 transition"
            >
              <i class="fa fa-home"></i>复位
            </button>

            <!-- 坐标显示 -->
            <div class="text-sm text-gray-deep ml-4">坐标: (164.1, 190.37)</div>
          </div>

          <!-- 右侧状态信息 -->
          <div class="ml-auto flex items-center gap-4 text-sm">
            <div class="flex items-center gap-1">
              <i class="fa fa-circle text-success text-xs"></i>
              <span>建图中</span>
            </div>
            <div>耗时: 00:08:23</div>
            <div>版本: v2.2.1</div>
          </div>
        </header>

        <!-- 建图页面主内容 -->
        <main class="flex-1 flex">
          <!-- 地图显示区域 -->
          <section
            class="flex-1 bg-white m-2 rounded shadow-sm overflow-hidden relative"
          >
            <!-- 室内激光地图背景 -->
            <div class="w-full h-full relative laser-map-bg">
              <!-- 激光扫描动画效果 -->
              <div class="laser-scan"></div>

              <!-- 模拟室内墙体（简单示例） -->
              <div
                class="absolute top-[10%] left-[10%] w-[80%] h-[80%] border-2 border-primary/30 rounded-sm"
              ></div>
              <div
                class="absolute top-[20%] left-[20%] w-[20%] h-[60%] bg-primary/5"
              ></div>
              <div
                class="absolute top-[20%] right-[20%] w-[20%] h-[60%] bg-primary/5"
              ></div>

              <!-- 建图状态提示 -->
              <div
                class="absolute top-4 left-[280px] bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded shadow-sm text-sm"
              >
                <i class="fa fa-spinner fa-spin text-primary mr-2"></i>
                <span>激光雷达建图中...</span>
              </div>

              <!-- 地图缩放控制 -->
              <div class="absolute bottom-4 right-4 flex flex-col gap-2">
                <button
                  class="w-8 h-8 flex items-center justify-center bg-white border border-gray-light rounded hover:border-primary transition shadow-sm"
                >
                  <i class="fa fa-plus"></i>
                </button>
                <button
                  class="w-8 h-8 flex items-center justify-center bg-white border border-gray-light rounded hover:border-primary transition shadow-sm"
                >
                  <i class="fa fa-dot-circle-o"></i>
                </button>
                <button
                  class="w-8 h-8 flex items-center justify-center bg-white border border-gray-light rounded hover:border-primary transition shadow-sm"
                >
                  <i class="fa fa-minus"></i>
                </button>
              </div>

              <!-- 遥控器 -->
              <div class="absolute bottom-4 left-4">
                <div class="remote-control">
                  <!-- 上按钮 -->
                  <div
                    class="remote-btn"
                    style="top: 10px; left: 50%; transform: translateX(-50%)"
                  >
                    <i class="fa fa-chevron-up"></i>
                  </div>
                  <!-- 下按钮 -->
                  <div
                    class="remote-btn"
                    style="bottom: 10px; left: 50%; transform: translateX(-50%)"
                  >
                    <i class="fa fa-chevron-down"></i>
                  </div>
                  <!-- 左按钮 -->
                  <div
                    class="remote-btn"
                    style="left: 10px; top: 50%; transform: translateY(-50%)"
                  >
                    <i class="fa fa-chevron-left"></i>
                  </div>
                  <!-- 右按钮 -->
                  <div
                    class="remote-btn"
                    style="right: 10px; top: 50%; transform: translateY(-50%)"
                  >
                    <i class="fa fa-chevron-right"></i>
                  </div>
                  <!-- 中心暂停按钮 -->
                  <div class="remote-center">
                    <i class="fa fa-pause"></i>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 右侧参数侧边栏 -->
          <aside
            class="w-64 bg-map-sidebar shadow-sm flex flex-col shrink-0 p-3 overflow-y-auto"
          >
            <!-- 建图参数面板 -->
            <div class="bg-white rounded border border-gray-light p-3 mb-3">
              <h3
                class="font-bold text-gray-700 mb-3 text-sm flex items-center gap-1"
              >
                <i class="fa fa-sliders text-primary"></i>
               回环距离
              </h3>
              <div class="space-y-3 text-xs">
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-gray-deep">回环距离
                      <span class="text-warning cursor-help" title="检测回环的距离阈值，值越小越容易检测到回环">!</span>
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value="1.0"
                    class="w-full px-2 py-1 border border-gray-light rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <!-- <span class="text-gray-deep text-xs">m</span> -->
                </div>
              </div>
            </div>

            <!-- 传感器数据面板 -->
            <div class="bg-white rounded border border-gray-light p-3 mb-3">
              <h3
                class="font-bold text-gray-700 mb-3 text-sm flex items-center gap-1"
              >
                <i class="fa fa-tachometer text-primary"></i>
                实时数据
              </h3>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between items-center">
                  <span class="text-gray-deep">LDS状态</span>
                  <span class="flex items-center gap-1 text-success">
                    <i class="fa fa-circle text-xs"></i>
                    正常
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-deep">CPU占用</span>
                  <span class="text-gray-700">28.5%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-deep">内存占用</span>
                  <span class="text-gray-700">426 MB</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-deep">温度</span>
                  <span class="text-gray-700">32.0℃</span>
                </div>
                <div class="space-y-1 mt-2">
                  <div class="flex justify-between text-xs">
                    <span class="text-gray-deep">激光点云</span>
                    <span>1248 pts</span>
                  </div>
                  <div
                    class="w-full h-1.5 bg-gray-light rounded-full overflow-hidden"
                  >
                    <div class="h-full bg-primary w-[75%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 建图日志面板 -->
            <div class="bg-white rounded border border-gray-light p-3 flex-1">
              <h3
                class="font-bold text-gray-700 mb-3 text-sm flex items-center gap-1"
              >
                <i class="fa fa-file-text-o text-primary"></i>
                建图日志
              </h3>
              <div
                class="text-xs text-gray-deep space-y-1 h-48 overflow-y-auto bg-gray-50 p-2 rounded"
              >
                <div>【14:23:45】开始建图任务</div>
                <div>【14:23:46】激光雷达初始化完成</div>
                <div>【14:23:48】地图分辨率设置为0.05m</div>
                <div>【14:23:50】首次扫描完成，点云数：1208</div>
                <div>【14:24:00】地图更新中，已覆盖面积：2.5㎡</div>
                <div>【14:24:10】机器人位置更新：(164.1, 190.37)</div>
                <div>【14:24:20】地图更新中，已覆盖面积：4.8㎡</div>
                <div>【14:24:30】激光数据接收正常，频率：10Hz</div>
              </div>
            </div>
          </aside>
        </main>

        <!-- 建图页面底部状态栏 -->
        <footer
          class="bg-white border-t border-gray-light px-4 py-1.5 flex items-center justify-between text-xs"
        >
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>正常</span>
            </div>
            <div>电量: 82%</div>
            <div>速度: 0.2 m/s</div>
          </div>
          <div class="flex items-center gap-4">
            <div>IP: 192.168.1.100</div>
            <div>端口: 8080</div>
            <div>帧率: 15 FPS</div>
          </div>
        </footer>
      </div>
</template>

<script>
export default {
  name: 'MappingPage',
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
