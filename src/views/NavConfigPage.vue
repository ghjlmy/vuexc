<template>
      <div
        id="nav-config-page"
        class="bg-gray-50 min-h-screen flex flex-col"
      >
        <!-- 顶部导航 -->
        <header
          class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <button
              @click="$router.push('/main')"
              class="flex items-center gap-2 text-primary hover:text-primary/80 transition"
            >
              <i class="fa fa-arrow-left"></i>
              <span>返回</span>
            </button>
            <h1 class="text-xl font-bold text-gray-800">导航配置</h1>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="resetNavConfig()"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded flex items-center gap-1 transition"
            >
              <i class="fa fa-refresh"></i>
              <span>重置参数</span>
            </button>
            <button
              @click="saveNavConfig()"
              class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded flex items-center gap-1 transition"
            >
              <i class="fa fa-save"></i>
              <span>保存配置</span>
            </button>
          </div>
        </header>

        <!-- 主内容 -->
        <main class="flex-1 p-6 overflow-y-auto">
          <div
            class="mx-auto"
            style="
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-gap: 20px;
            "
          >
            <!-- 设备设置-电池电量 -->
            <div
              class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 class="font-semibold text-gray-800 flex items-center gap-2">
                  <i class="fa fa-battery-three-quarters text-primary"></i>
                  设备设置 - 电池电量
                </h3>
              </div>
              <div class="p-4 space-y-4">
                <!-- 自动充电电量 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >自动充电电量 (单位: %)</label
                  >
                  <div class="flex items-center gap-3 w-96">
                    <input
                      type="range"
                      id="auto-charge-level"
                      min="0"
                      max="100"
                      value="20"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <input
                      type="number"
                      id="auto-charge-level-value"
                      value="20"
                      min="0"
                      max="100"
                      class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
                <!-- 空电量电压 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >空电量电压 (单位: V)</label
                  >
                  <div class="flex items-center gap-3 w-96">
                    <input
                      type="range"
                      id="empty-voltage"
                      min="20"
                      max="30"
                      step="0.1"
                      value="22"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <input
                      type="number"
                      id="empty-voltage-value"
                      value="22"
                      min="20"
                      max="30"
                      step="0.1"
                      class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
                <!-- 满电量电压 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >满电量电压 (单位: V)</label
                  >
                  <div class="flex items-center gap-3 w-96">
                    <input
                      type="range"
                      id="full-voltage"
                      min="25"
                      max="30"
                      step="0.1"
                      value="26"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <input
                      type="number"
                      id="full-voltage-value"
                      value="26"
                      min="25"
                      max="30"
                      step="0.1"
                      class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
                <!-- 完成充电重启任务 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >完成充电重启任务</label
                  >
                  <div class="flex items-center gap-3 w-96 justify-end">
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id="restart-after-charge"
                        class="sr-only peer"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                      ></div>
                    </label>
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- 导航设置-激光雷达配置 -->
            <div
              class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 class="font-semibold text-gray-800 flex items-center gap-2">
                  <i class="fa fa-eye text-primary"></i>
                  导航设置 - 激光雷达配置
                </h3>
              </div>
              <div class="p-4 space-y-4">
                <!-- 前方避障距离 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >前方避障距离 (单位: 米)</label
                  >
                  <div class="flex items-center gap-3 w-96">
                    <input
                      type="range"
                      id="lidar-front-avoid-distance"
                      min="0"
                      max="5"
                      step="0.1"
                      value="1.5"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <input
                      type="number"
                      id="lidar-front-avoid-distance-value"
                      value="1.5"
                      min="0"
                      max="5"
                      step="0.1"
                      class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- 导航设置-充电动作 -->
            <div
              class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 class="font-semibold text-gray-800 flex items-center gap-2">
                  <i class="fa fa-plug text-primary"></i>
                  导航设置 - 充电动作
                </h3>
              </div>
              <div class="p-4 space-y-4">
                <!-- 后退距离 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >后退距离 (单位: 米)</label
                  >
                  <div class="flex items-center gap-3 w-96">
                    <input
                      type="range"
                      id="charge-back-distance"
                      min="0"
                      max="5"
                      step="0.1"
                      value="0.5"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <input
                      type="number"
                      id="charge-back-distance-value"
                      value="0.5"
                      min="0"
                      max="5"
                      step="0.1"
                      class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
                <!-- 后退速度 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >后退速度 (单位: m/s)</label
                  >
                  <div class="flex items-center gap-3 w-96">
                    <input
                      type="range"
                      id="charge-back-speed"
                      min="0"
                      max="2"
                      step="0.1"
                      value="0.3"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <input
                      type="number"
                      id="charge-back-speed-value"
                      value="0.3"
                      min="0"
                      max="2"
                      step="0.1"
                      class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
                <!-- 导航至充电点距离 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >导航至充电点距离 (单位: 米)</label
                  >
                  <div class="flex items-center gap-3 w-96">
                    <input
                      type="range"
                      id="nav-to-charge-distance"
                      min="0"
                      max="5"
                      step="0.1"
                      value="1.5"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <input
                      type="number"
                      id="nav-to-charge-distance-value"
                      value="1.5"
                      min="0"
                      max="5"
                      step="0.1"
                      class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
                <!-- 充电完成后前进距离 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >充电完成后前进距离 (单位: 米)</label
                  >
                  <div class="flex items-center gap-3 w-96">
                    <input
                      type="range"
                      id="charge-forward-distance"
                      min="0"
                      max="5"
                      step="0.1"
                      value="1.5"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <input
                      type="number"
                      id="charge-forward-distance-value"
                      value="1.5"
                      min="0"
                      max="5"
                      step="0.1"
                      class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
                <!-- 充电角度偏差 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >充电角度偏差 (单位: 弧度)</label
                  >
                  <div class="flex items-center gap-3 w-96">
                    <input
                      type="range"
                      id="charge-angle-deviation"
                      min="0"
                      max="1"
                      step="0.01"
                      value="0.05"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <input
                      type="number"
                      id="charge-angle-deviation-value"
                      value="0.05"
                      min="0"
                      max="1"
                      step="0.01"
                      class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- 导航设置-跟随路径 -->
            <div
              class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 class="font-semibold text-gray-800 flex items-center gap-2">
                  <i class="fa fa-location-arrow text-primary"></i>
                  导航设置 - 跟随路径
                </h3>
              </div>
              <div class="p-4 space-y-4">
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >前方避障距离 (单位: 米)</label
                  >
                  <div class="flex items-center gap-3 w-96">
                    <input
                      type="range"
                      id="lidar-front-avoid-distance"
                      min="0"
                      max="5"
                      step="0.1"
                      value="1.5"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <input
                      type="number"
                      id="lidar-front-avoid-distance-value"
                      value="1.5"
                      min="0"
                      max="5"
                      step="0.1"
                      class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
                <!-- 避障开关 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >避障开关 (开启或关闭跟随路径时是否选择进行避障)</label
                  >
                  <div class="flex items-center gap-3 w-96 justify-end">
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id="path-avoid-obstacle"
                        class="sr-only peer"
                        checked
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                      ></div>
                    </label>
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
                <!-- 安全检测距离 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >安全检测距离 (检测前方障碍物距离, 单位: 米)</label
                  >
                  <div class="flex items-center gap-3 w-96">
                    <input
                      type="range"
                      id="path-safe-distance"
                      min="0"
                      max="5"
                      step="0.1"
                      value="1"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <input
                      type="number"
                      id="path-safe-distance-value"
                      value="1"
                      min="0"
                      max="5"
                      step="0.1"
                      class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
                <!-- 速度设置 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >速度设置 (跟随路径时的速度m/s)</label
                  >
                  <div class="flex items-center gap-3 w-96">
                    <input
                      type="range"
                      id="path-speed"
                      min="0"
                      max="2"
                      step="0.1"
                      value="0.8"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <input
                      type="number"
                      id="path-speed-value"
                      value="0.8"
                      min="0"
                      max="2"
                      step="0.1"
                      class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- 导航设置-自主导航 -->
            <div
              class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 class="font-semibold text-gray-800 flex items-center gap-2">
                  <i class="fa fa-location-arrow text-primary"></i>
                  导航设置 - 自主导航
                </h3>
              </div>
              <div class="p-4 space-y-4">
                <!-- 避障开关 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >避障开关 (开启或关闭是否选择进行避障)</label
                  >
                  <div class="flex items-center gap-3 w-96 justify-end">
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id="auto-nav-avoid-obstacle"
                        class="sr-only peer"
                        checked
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                      ></div>
                    </label>
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
                <!-- 无导航停止时间 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >无导航停止时间 (单位: 秒)</label
                  >
                  <div class="flex items-center gap-3 w-96">
                    <input
                      type="range"
                      id="no-nav-stop-time"
                      min="0"
                      max="60"
                      value="5"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <input
                      type="number"
                      id="no-nav-stop-time-value"
                      value="5"
                      min="0"
                      max="60"
                      class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
                <!-- 速度设置 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >速度设置 (自主导航速度, 单位: m/s)</label
                  >
                  <div class="flex items-center gap-3 w-96">
                    <input
                      type="range"
                      id="auto-nav-speed"
                      min="0"
                      max="3"
                      step="0.1"
                      value="1.2"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <input
                      type="number"
                      id="auto-nav-speed-value"
                      value="1.2"
                      min="0"
                      max="3"
                      step="0.1"
                      class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
                <!-- 是否使用轨道 -->
                <div class="flex items-center gap-4">
                  <label class="flex-1 text-sm text-gray-700"
                    >是否使用轨道 (开启为使用轨道)</label
                  >
                  <div class="flex items-center gap-3 w-96 justify-end">
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id="use-track"
                        class="sr-only peer"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                      ></div>
                    </label>
                  </div>
                  <div class="w-8 flex justify-center">
                    <i class="fa fa-check-circle text-success"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- 底部状态栏 -->
        <footer
          class="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm"
        >
          <div class="flex items-center gap-2">
            <i class="fa fa-circle text-success text-xs"></i>
            <span>导航配置状态：正常</span>
          </div>
          <div class="text-gray-500">上次保存: 2024-05-20 16:50:10</div>
        </footer>
      </div>
</template>

<script>
export default {
  name: 'NavConfigPage',
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
