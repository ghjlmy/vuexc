<template>
      <div
        id="system-config-page"
        class="bg-gray-50 min-h-screen flex flex-col"
      >
        <!-- 顶部导航 -->
        <header
          class="bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <button
              @click="$router.push('/main')"
              class="flex items-center gap-2 text-primary hover:text-primary/80 transition"
            >
              <i class="fa fa-arrow-left"></i>
              <span>返回</span>
            </button>
          </div>
          <h1 class="text-lg font-bold">系统信息</h1>
          <div class="w-20"></div>
        </header>

        <!-- 系统配置主内容 -->
        <main class="flex-1 flex overflow-hidden">
          <!-- 左侧菜单栏（占比小） -->
          <aside
            class="w-56 bg-white border-r border-gray-200 flex flex-col overflow-y-auto"
          >
            <nav class="py-2">
              <!-- 固件升级 -->
              <button
                id="menu-firmware"
                @click="switchSystemMenu('firmware')"
                class="w-full text-left px-4 py-2.5 flex items-center justify-between text-gray-700 hover:bg-[#e8f0fe] transition bg-[#e8f0fe]"
              >
                <div class="flex items-center gap-2">
                  <i class="fa fa-floppy-o w-5 text-center text-xs"></i>
                  <span class="text-sm">固件升级</span>
                </div>
                <i class="fa fa-angle-right text-xs"></i>
              </button>

              <!-- Log下载 -->
              <button
                id="menu-log"
                @click="switchSystemMenu('log')"
                class="w-full text-left px-4 py-2.5 flex items-center justify-between text-gray-700 hover:bg-[#e8f0fe] transition"
              >
                <div class="flex items-center gap-2">
                  <i class="fa fa-line-chart w-5 text-center text-xs"></i>
                  <span class="text-sm">Log下载</span>
                </div>
                <i class="fa fa-angle-right text-xs"></i>
              </button>

              <!-- 上传地图 -->
              <button
                id="menu-upload-map"
                @click="switchSystemMenu('upload-map')"
                class="w-full text-left px-4 py-2.5 flex items-center justify-between text-gray-700 hover:bg-[#e8f0fe] transition"
              >
                <div class="flex items-center gap-2">
                  <i class="fa fa-upload w-5 text-center text-xs"></i>
                  <span class="text-sm">上传地图</span>
                </div>
                <i class="fa fa-angle-right text-xs"></i>
              </button>

              <!-- 上传激光参数文件 -->
              <button
                id="menu-upload-laser"
                @click="switchSystemMenu('upload-laser')"
                class="w-full text-left px-4 py-2.5 flex items-center justify-between text-gray-700 hover:bg-[#e8f0fe] transition"
              >
                <div class="flex items-center gap-2">
                  <i class="fa fa-upload w-5 text-center text-xs"></i>
                  <span class="text-sm">上传激光参数文件</span>
                </div>
                <i class="fa fa-angle-right text-xs"></i>
              </button>

              <!-- 回滚 -->
              <button
                id="menu-rollback"
                @click="switchSystemMenu('rollback')"
                class="w-full text-left px-4 py-2.5 flex items-center justify-between text-gray-700 hover:bg-[#e8f0fe] transition"
              >
                <div class="flex items-center gap-2">
                  <i class="fa fa-upload w-5 text-center text-xs"></i>
                  <span class="text-sm">回滚</span>
                </div>
                <i class="fa fa-angle-right text-xs"></i>
              </button>

              <!-- 同步时间 -->
              <button
                id="menu-sync-time"
                @click="switchSystemMenu('sync-time')"
                class="w-full text-left px-4 py-2.5 flex items-center justify-between text-gray-700 hover:bg-[#e8f0fe] transition"
              >
                <div class="flex items-center gap-2">
                  <i class="fa fa-clock-o w-5 text-center text-xs"></i>
                  <span class="text-sm">同步时间</span>
                </div>
                <i class="fa fa-angle-right text-xs"></i>
              </button>

              <!-- 系统状态 -->
              <button
                id="menu-status"
                @click="switchSystemMenu('status')"
                class="w-full text-left px-4 py-2.5 flex items-center justify-between text-gray-700 hover:bg-[#e8f0fe] transition"
              >
                <div class="flex items-center gap-2">
                  <i class="fa fa-info-circle w-5 text-center text-xs"></i>
                  <span class="text-sm">系统状态</span>
                </div>
                <i class="fa fa-angle-right text-xs"></i>
              </button>

              <!-- 恢复出厂设置 -->
              <button
                id="menu-reset"
                @click="switchSystemMenu('reset')"
                class="w-full text-left px-4 py-2.5 flex items-center justify-between text-gray-700 hover:bg-[#e8f0fe] transition"
              >
                <div class="flex items-center gap-2">
                  <i class="fa fa-refresh w-5 text-center text-xs"></i>
                  <span class="text-sm">恢复出厂设置</span>
                </div>
                <i class="fa fa-angle-right text-xs"></i>
              </button>
            </nav>
          </aside>

          <!-- 右侧内容区 -->
          <section
            class="flex-1 bg-white border-l border-gray-200 overflow-y-auto"
          >
            <!-- 固件升级内容 -->

            <main id="content-firmware" class="py-6">
              <!-- 系统概览卡片 -->
              <div
                class="bg-white rounded-xl p-5 mb-6 card-shadow border border-slate-100"
              >
                <div
                  class="flex flex-col md:flex-row md:items-center justify-between mb-4"
                >
                  <div>
                    <h2 class="text-lg font-bold text-slate-800">系统概览</h2>
                    <p class="text-sm text-dark mt-1">实时监控系统状态与性能</p>
                  </div>
                  <div
                    class="mt-2 md:mt-0 px-3 py-1 bg-green-100 text-secondary rounded-full text-sm font-medium flex items-center"
                  >
                    <span
                      class="w-2 h-2 bg-secondary rounded-full mr-2 animate-pulse"
                    ></span>
                    运行正常
                  </div>
                </div>

                <!-- 基础系统信息 -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    class="flex items-center gap-3 p-3 bg-neutral rounded-lg"
                  >
                    <i
                      class="fa fa-microchip text-primary text-xl p-3 bg-primary/10 rounded-lg"
                    ></i>
                    <div>
                      <p class="text-xs text-dark">操作系统</p>
                      <p class="font-medium">Windows 11 Pro</p>
                    </div>
                  </div>

                  <div
                    class="flex items-center gap-3 p-3 bg-neutral rounded-lg"
                  >
                    <i
                      class="fa fa-desktop text-accent text-xl p-3 bg-accent/10 rounded-lg"
                    ></i>
                    <div>
                      <p class="text-xs text-dark">主机名称</p>
                      <p class="font-medium">DEVELOPER-PC</p>
                    </div>
                  </div>

                  <div
                    class="flex items-center gap-3 p-3 bg-neutral rounded-lg"
                  >
                    <i
                      class="fa fa-clock-o text-secondary text-xl p-3 bg-secondary/10 rounded-lg"
                    ></i>
                    <div>
                      <p class="text-xs text-dark">运行时间</p>
                      <p class="font-medium">2 天 4 小时 36 分</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 硬件资源监控 -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <!-- CPU使用率 -->
                <div
                  class="bg-white rounded-xl p-5 card-shadow border border-slate-100"
                >
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="font-semibold text-slate-800">CPU 使用率</h3>
                    <i class="fa fa-microchip text-primary"></i>
                  </div>
                  <div class="h-48">
                    <canvas id="cpuChart"></canvas>
                  </div>
                  <div class="mt-4 flex justify-between items-center">
                    <span class="text-3xl font-bold text-slate-800">37%</span>
                    <span
                      class="text-sm text-dark bg-neutral px-3 py-1 rounded-full"
                      >8 核 16 线程</span
                    >
                  </div>
                </div>

                <!-- 内存使用率 -->
                <div
                  class="bg-white rounded-xl p-5 card-shadow border border-slate-100"
                >
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="font-semibold text-slate-800">内存使用率</h3>
                    <i class="fa fa-memory text-accent"></i>
                  </div>
                  <div class="h-48">
                    <canvas id="memoryChart"></canvas>
                  </div>
                  <div class="mt-4 flex justify-between items-center">
                    <span class="text-3xl font-bold text-slate-800">52%</span>
                    <span
                      class="text-sm text-dark bg-neutral px-3 py-1 rounded-full"
                      >16GB / 32GB</span
                    >
                  </div>
                </div>

                <!-- 磁盘使用率 -->
                <div
                  class="bg-white rounded-xl p-5 card-shadow border border-slate-100"
                >
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="font-semibold text-slate-800">磁盘使用率</h3>
                    <i class="fa fa-hdd-o text-secondary"></i>
                  </div>
                  <div class="h-48">
                    <canvas id="diskChart"></canvas>
                  </div>
                  <div class="mt-4 flex justify-between items-center">
                    <span class="text-3xl font-bold text-slate-800">41%</span>
                    <span
                      class="text-sm text-dark bg-neutral px-3 py-1 rounded-full"
                      >492GB / 1.2TB</span
                    >
                  </div>
                </div>
              </div>

              <!-- 网络与进程信息 -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- 网络状态 -->
                <div
                  class="bg-white rounded-xl p-5 card-shadow border border-slate-100"
                >
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="font-semibold text-slate-800">网络状态</h3>
                    <i class="fa fa-wifi text-primary"></i>
                  </div>
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-neutral p-3 rounded-lg">
                      <p class="text-xs text-dark">上传速度</p>
                      <p class="text-xl font-bold">
                        5.2 <span class="text-sm font-normal">MB/s</span>
                      </p>
                    </div>
                    <div class="bg-neutral p-3 rounded-lg">
                      <p class="text-xs text-dark">下载速度</p>
                      <p class="text-xl font-bold">
                        12.8 <span class="text-sm font-normal">MB/s</span>
                      </p>
                    </div>
                  </div>
                  <div class="h-36">
                    <canvas id="networkChart"></canvas>
                  </div>
                </div>

                <!-- 进程信息 -->
                <div
                  class="bg-white rounded-xl p-5 card-shadow border border-slate-100"
                >
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="font-semibold text-slate-800">进程信息</h3>
                    <i class="fa fa-tasks text-accent"></i>
                  </div>
                  <div class="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                    <div
                      class="flex justify-between items-center p-2 hover:bg-neutral rounded-lg transition-colors"
                    >
                      <div class="flex items-center gap-2">
                        <i class="fa fa-chrome text-orange-500"></i>
                        <span>Chrome</span>
                      </div>
                      <span
                        class="text-sm bg-blue-100 text-primary px-2 py-0.5 rounded"
                        >12%</span
                      >
                    </div>
                    <div
                      class="flex justify-between items-center p-2 hover:bg-neutral rounded-lg transition-colors"
                    >
                      <div class="flex items-center gap-2">
                        <i class="fa fa-code text-purple-500"></i>
                        <span>VS Code</span>
                      </div>
                      <span
                        class="text-sm bg-blue-100 text-primary px-2 py-0.5 rounded"
                        >8%</span
                      >
                    </div>
                    <div
                      class="flex justify-between items-center p-2 hover:bg-neutral rounded-lg transition-colors"
                    >
                      <div class="flex items-center gap-2">
                        <i class="fa fa-terminal text-green-500"></i>
                        <span>Terminal</span>
                      </div>
                      <span
                        class="text-sm bg-blue-100 text-primary px-2 py-0.5 rounded"
                        >3%</span
                      >
                    </div>
                    <div
                      class="flex justify-between items-center p-2 hover:bg-neutral rounded-lg transition-colors"
                    >
                      <div class="flex items-center gap-2">
                        <i class="fa fa-music text-pink-500"></i>
                        <span>Music</span>
                      </div>
                      <span
                        class="text-sm bg-blue-100 text-primary px-2 py-0.5 rounded"
                        >2%</span
                      >
                    </div>
                    <div
                      class="flex justify-between items-center p-2 hover:bg-neutral rounded-lg transition-colors"
                    >
                      <div class="flex items-center gap-2">
                        <i class="fa fa-database text-indigo-500"></i>
                        <span>Database</span>
                      </div>
                      <span
                        class="text-sm bg-blue-100 text-primary px-2 py-0.5 rounded"
                        >5%</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- 硬件详细信息 -->
              <div
                class="bg-white rounded-xl p-5 mb-6 card-shadow border border-slate-100"
              >
                <h3 class="font-semibold text-slate-800 mb-4">硬件详细信息</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b border-slate-200">
                        <th class="text-left py-3 px-4 text-dark">组件</th>
                        <th class="text-left py-3 px-4 text-dark">型号</th>
                        <th class="text-left py-3 px-4 text-dark">状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="border-b border-slate-100 hover:bg-neutral/50">
                        <td class="py-3 px-4">处理器</td>
                        <td class="py-3 px-4">Intel Core i7-12700H</td>
                        <td class="py-3 px-4 text-green-600">正常</td>
                      </tr>
                      <tr class="border-b border-slate-100 hover:bg-neutral/50">
                        <td class="py-3 px-4">显卡</td>
                        <td class="py-3 px-4">NVIDIA RTX 3060 Laptop</td>
                        <td class="py-3 px-4 text-green-600">正常</td>
                      </tr>
                      <tr class="border-b border-slate-100 hover:bg-neutral/50">
                        <td class="py-3 px-4">内存</td>
                        <td class="py-3 px-4">32GB DDR5 4800MHz</td>
                        <td class="py-3 px-4 text-green-600">正常</td>
                      </tr>
                      <tr class="border-b border-slate-100 hover:bg-neutral/50">
                        <td class="py-3 px-4">主硬盘</td>
                        <td class="py-3 px-4">Samsung SSD 1TB NVMe</td>
                        <td class="py-3 px-4 text-green-600">正常</td>
                      </tr>
                      <tr class="hover:bg-neutral/50">
                        <td class="py-3 px-4">网卡</td>
                        <td class="py-3 px-4">Intel AX211 Wi-Fi 6E</td>
                        <td class="py-3 px-4 text-green-600">正常</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div id="content-firmware" class="p-6">
                 <h3 class="font-semibold text-slate-800 mb-4">固件升级</h3>
                        <div class="space-y-4">
                            <div class="flex items-center gap-4">
                                <span class="text-gray-700 text-sm min-w-[100px]">PC 版本</span>
                                <span class="text-gray-800 text-sm">V3.0.3.20250826.AQN</span>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="text-gray-700 text-sm min-w-[100px]">固件版本</span>
                                <span class="text-gray-800 text-sm">DR230_HI_zhikong_A0242_2026010916</span>
                                <button class="text-gray-400 hover:text-gray-600 text-xs">
                                    <i class="fa fa-refresh mr-1"></i>刷新
                                </button>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="text-gray-700 text-sm min-w-[100px]">SN 号</span>
                                <span class="text-gray-800 text-sm">ZK_245_20250106_03</span>
                            </div>
                            <div class="space-y-2">
                                <div class="w-full bg-[#e6e6fa] rounded-full h-3">
                                    <div class="bg-[#e6e6fa] h-3 rounded-full" style="width: 0%"></div>
                                </div>
                                <div class="text-sm text-gray-500">0%</div>
                            </div>
                            <div>
                                <input type="file" class="hidden" id="firmware-file">
                                <button @click="document.getElementById('firmware-file').click()" class="border border-gray-300 px-3 py-1.5 rounded text-sm hover:bg-gray-50 transition">
                                    选择文件
                                </button>
                            </div>
                            <!-- 操作按钮区 -->
                        <div class="pt-6 flex justify-center gap-3">
                            <button class="bg-[#007bff] text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-600 transition flex items-center gap-2 shadow-sm">
                                <i class="fa fa-search"></i>
                                检查更新
                            </button>
                            <button class="bg-primary text-white px-5 py-2 rounded-lg text-sm hover:bg-primary/90 transition flex items-center gap-2 shadow-sm">
                                <i class="fa fa-upload"></i>
                                提交升级
                            </button>
                        </div>
                               <!-- 升级日志区域 -->
                        <div class="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-4">
                            <div class="flex items-center justify-between mb-3">
                                <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <i class="fa fa-file-text-o text-primary"></i>
                                    升级日志
                                </h3>
                                <button class="text-gray-400 hover:text-gray-600 text-xs flex items-center gap-1 transition">
                                    <i class="fa fa-trash-o"></i>
                                    清空
                                </button>
                            </div>
                            <div class="bg-white rounded border border-gray-200 p-3 h-32 overflow-y-auto">
                                <div class="text-xs text-gray-500 font-mono space-y-1">
                                    <div class="flex items-center gap-2">
                                        <span class="text-green-500"><i class="fa fa-check-circle"></i></span>
                                        <span>[10:30:25] 系统就绪，等待固件文件...</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                           
                        </div>
                     
                         
                    </div>
            </main>

            <!-- Log包下载内容 -->
            <div id="content-log" class="hidden p-4">
              <div class="bg-white border border-gray-200 rounded">
                <div
                  class="flex items-center justify-between p-3 border-b border-gray-200 text-sm font-medium text-gray-700"
                >
                  <span class="flex-1">名称</span>
                  <span class="flex-1">日期</span>
                  <span class="flex-1">大小</span>
                  <span class="flex-1 text-center">操作</span>
                </div>
                <div class="max-h-96 overflow-y-auto">
                  <div
                    class="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 text-sm"
                  >
                    <span class="flex-1 text-gray-800"
                      >cartographer_1-2.log</span
                    >
                    <span class="flex-1 text-gray-500">2024-05-20</span>
                    <span class="flex-1 text-gray-500">0.03178 MB</span>
                    <div class="flex-1 flex justify-center gap-2">
                      <button
                        @click="
                          viewLogPackage(
                            'cartographer_1-2.log',
                            '2024-05-20',
                            '0.03178 MB',
                          )
                        "
                        class="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition"
                      >
                        详情
                      </button>
                      <button
                        class="px-2 py-1 bg-success text-white text-xs rounded hover:bg-success/90 transition"
                      >
                        下载
                      </button>
                    </div>
                  </div>
                  <div
                    class="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 text-sm"
                  >
                    <span class="flex-1 text-gray-800"
                      >cartographer_1-1.log</span
                    >
                    <span class="flex-1 text-gray-500">2024-05-19</span>
                    <span class="flex-1 text-gray-500">1.50044 MB</span>
                    <div class="flex-1 flex justify-center gap-2">
                      <button
                        @click="
                          viewLogPackage(
                            'cartographer_1-1.log',
                            '2024-05-19',
                            '1.50044 MB',
                          )
                        "
                        class="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition"
                      >
                        详情
                      </button>
                      <button
                        class="px-2 py-1 bg-success text-white text-xs rounded hover:bg-success/90 transition"
                      >
                        下载
                      </button>
                    </div>
                  </div>
                  <div
                    class="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 text-sm"
                  >
                    <span class="flex-1 text-gray-800"
                      >drobot_updater-5.log</span
                    >
                    <span class="flex-1 text-gray-500">2024-05-18</span>
                    <span class="flex-1 text-gray-500">0 MB</span>
                    <div class="flex-1 flex justify-center gap-2">
                      <button
                        @click="
                          viewLogPackage(
                            'drobot_updater-5.log',
                            '2024-05-18',
                            '0 MB',
                          )
                        "
                        class="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition"
                      >
                        详情
                      </button>
                      <button
                        class="px-2 py-1 bg-success text-white text-xs rounded hover:bg-success/90 transition"
                      >
                        下载
                      </button>
                    </div>
                  </div>
                  <div
                    class="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 text-sm"
                  >
                    <span class="flex-1 text-gray-800"
                      >drobot_manager_console_node-0.log</span
                    >
                    <span class="flex-1 text-gray-500">2024-05-17</span>
                    <span class="flex-1 text-gray-500">0.00968 MB</span>
                    <div class="flex-1 flex justify-center gap-2">
                      <button
                        @click="
                          viewLogPackage(
                            'drobot_manager_console_node-0.log',
                            '2024-05-17',
                            '0.00968 MB',
                          )
                        "
                        class="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition"
                      >
                        详情
                      </button>
                      <button
                        class="px-2 py-1 bg-success text-white text-xs rounded hover:bg-success/90 transition"
                      >
                        下载
                      </button>
                    </div>
                  </div>
                  <div
                    class="flex items-center justify-between p-3 hover:bg-gray-50 text-sm"
                  >
                    <span class="flex-1 text-gray-800">system_log.tar.gz</span>
                    <span class="flex-1 text-gray-500">2024-05-15</span>
                    <span class="flex-1 text-gray-500">5.234 MB</span>
                    <div class="flex-1 flex justify-center gap-2">
                      <button
                        @click="
                          viewLogPackage(
                            'system_log.tar.gz',
                            '2024-05-15',
                            '5.234 MB',
                          )
                        "
                        class="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition"
                      >
                        详情
                      </button>
                      <button
                        class="px-2 py-1 bg-success text-white text-xs rounded hover:bg-success/90 transition"
                      >
                        下载
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pt-4 flex justify-center">
                <button
                  class="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary/90 transition"
                >
                  <i class="fa fa-download mr-1"></i>主下载页
                </button>
              </div>
            </div>

            <!-- 上传地图内容 -->
            <div id="content-upload-map" class="hidden p-6">
              <!-- 上传操作按钮区 -->
              <div class="upload-section mb-6 flex">
                <input
                  type="file"
                  id="mapFileInput"
                  style="display: none"
                  accept=".pcd,.map,.yaml,.json"
                  onchange="handleFileSelect()"
                />
                <button
                  class="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary/90 transition flex items-center gap-2"
                  @click="document.getElementById('mapFileInput').click()"
                >
                  <i class="fa fa-upload"></i>
                  选择文件
                </button>
                <button
                  class="bg-success text-white px-4 ml-2 py-2 rounded text-sm hover:bg-success/90 transition flex items-center gap-2"
                  id="uploadBtn"
                  disabled
                  @click="startUpload()"
                >
                  <i class="fa fa-upload"></i>
                  上传到原地图
                </button>
              </div>

              <!-- 上传进度条 -->
              <div
                class="progress-section mb-6"
                id="progressSection"
                style="display: none"
              >
                <div
                  class="progress-text flex justify-between text-sm text-gray-700 mb-2"
                >
                  <span>正在上传地图文件...</span>
                  <span id="progressPercent">0%</span>
                </div>
                <div
                  class="progress-bar-container w-full h-2 bg-gray-200 rounded-full overflow-hidden"
                >
                  <div
                    class="progress-bar h-full bg-primary rounded-full"
                    id="progressBar"
                    style="width: 0%"
                  ></div>
                </div>
              </div>

              <!-- 上传历史记录 -->
              <div
                class="upload-history bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6"
              >
                <h2
                  class="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2"
                >
                  <i class="fa fa-history"></i>
                  上传历史
                </h2>
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-gray-200">
                      <th class="text-left py-2 px-3 text-gray-600 font-medium">
                        文件名
                      </th>
                      <th class="text-left py-2 px-3 text-gray-600 font-medium">
                        文件大小
                      </th>
                      <th class="text-left py-2 px-3 text-gray-600 font-medium">
                        上传时间
                      </th>
                      <th class="text-left py-2 px-3 text-gray-600 font-medium">
                        状态
                      </th>
                      <th class="text-left py-2 px-3 text-gray-600 font-medium">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody id="historyTableBody">
                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                      <td class="py-2 px-3 text-gray-800">
                        office_20250312.map
                      </td>
                      <td class="py-2 px-3 text-gray-600">128.5 MB</td>
                      <td class="py-2 px-3 text-gray-600">
                        2025-03-12 14:30:22
                      </td>
                      <td class="py-2 px-3">
                        <span
                          class="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
                          >上传成功</span
                        >
                      </td>
                      <td class="py-2 px-3">
                        <button
                          class="text-primary hover:text-primary/80 text-xs mr-2"
                          @click="viewMap('office_20250312.map')"
                        >
                          查看
                        </button>
                        <button
                          class="text-danger hover:text-danger/80 text-xs"
                          @click="deleteMap('office_20250312.map')"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                      <td class="py-2 px-3 text-gray-800">
                        warehouse_20250310.pcd
                      </td>
                      <td class="py-2 px-3 text-gray-600">256.2 MB</td>
                      <td class="py-2 px-3 text-gray-600">
                        2025-03-10 09:15:47
                      </td>
                      <td class="py-2 px-3">
                        <span
                          class="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
                          >上传成功</span
                        >
                      </td>
                      <td class="py-2 px-3">
                        <button
                          class="text-primary hover:text-primary/80 text-xs mr-2"
                          @click="viewMap('warehouse_20250310.pcd')"
                        >
                          查看
                        </button>
                        <button
                          class="text-danger hover:text-danger/80 text-xs"
                          @click="deleteMap('warehouse_20250310.pcd')"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="py-2 px-3 text-gray-800">
                        lab_test_20250308.yaml
                      </td>
                      <td class="py-2 px-3 text-gray-600">2.1 MB</td>
                      <td class="py-2 px-3 text-gray-600">
                        2025-03-08 16:42:19
                      </td>
                      <td class="py-2 px-3">
                        <span
                          class="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs"
                          >上传失败</span
                        >
                      </td>
                      <td class="py-2 px-3">
                        <button
                          class="text-primary hover:text-primary/80 text-xs"
                          @click="retryUpload('lab_test_20250308.yaml')"
                        >
                          重试
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 帮助提示区 -->
              <div
                class="help-section bg-blue-50 border-l-4 border-primary rounded-r-lg p-4"
              >
                <h3
                  class="text-sm font-semibold text-primary mb-2 flex items-center gap-2"
                >
                  <i class="fa fa-info-circle"></i>
                  地图上传说明
                </h3>
                <ul
                  class="text-sm text-gray-700 space-y-1 list-disc list-inside"
                >
                  <li>
                    支持格式：.map / .pcd / .yaml / .json，单文件大小建议不超过
                    500MB
                  </li>
                  <li>上传前请确认地图文件与当前机器人型号、传感器配置匹配</li>
                  <li>
                    上传成功后，系统将自动覆盖原地图，建议先备份原地图文件
                  </li>
                  <li>上传过程中请勿断开机器人网络或关闭页面，避免文件损坏</li>
                  <li>若上传失败，请检查文件完整性、网络连接后重试</li>
                </ul>
              </div>
            </div>

            <!-- 上传激光参数文件内容 -->
            <div id="content-upload-laser" class="hidden p-6">
              <button
                class="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary/90 transition"
              >
                <i class="fa fa-upload mr-1"></i>上传
              </button>
            </div>

            <!-- 回滚内容 -->
            <div id="content-rollback" class="hidden p-4">
              <div class="bg-white border border-gray-200 rounded">
                <div
                  class="flex items-center justify-between p-3 border-b border-gray-200"
                >
                  <span class="text-sm font-medium text-gray-700"
                    >版本名称</span
                  >
                  <span class="text-sm font-medium text-gray-700">大小</span>
                  <span class="text-sm font-medium text-gray-700">时间</span>
                  <span class="text-sm font-medium text-gray-700">操作</span>
                </div>
                <div class="max-h-96 overflow-y-auto">
                  <div
                    class="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100"
                  >
                    <span class="text-sm text-gray-800"
                      >202412160924.tar.gz</span
                    >
                    <span class="text-sm text-gray-500">278.61MB</span>
                    <span class="text-sm text-gray-500">2024-12-16 14:24</span>
                    <button
                      class="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary/90 transition"
                    >
                      应用
                    </button>
                  </div>
                  <div
                    class="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100"
                  >
                    <span class="text-sm text-gray-800"
                      >DR221-zhikong.tar.gz</span
                    >
                    <span class="text-sm text-gray-500">164.01MB</span>
                    <span class="text-sm text-gray-500">2026-01-15 02:46</span>
                    <button
                      class="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary/90 transition"
                    >
                      应用
                    </button>
                  </div>
                </div>
              </div>
              <div class="pt-3 flex justify-end">
                <button class="text-gray-500 hover:text-gray-700 text-sm">
                  <i class="fa fa-refresh mr-1"></i>刷新
                </button>
              </div>
            </div>

            <!-- 同步时间内容 -->
            <div id="content-sync-time" class="hidden p-6">
              <!-- 时间同步卡片 -->
              <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
              >
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-lg font-semibold text-gray-800">
                    时间同步设置
                  </h2>
                  <div class="text-gray-600 text-sm">
                    <span
                      >当前设备时间：<span id="current-device-time"
                        >2026-04-14 10:30:25</span
                      ></span
                    >
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div class="space-y-4">
                    <h3 class="text-md font-medium text-gray-600">手动同步</h3>
                    <p class="text-gray-600 text-sm">手动同步网络时间到设备</p>
                    <button
                      id="syncTimeBtn"
                      class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition flex items-center"
                    >
                      <i class="fa fa-refresh mr-2"></i>
                      同步时间
                    </button>
                  </div>

                  <div class="space-y-4">
                    <h3 class="text-md font-medium text-gray-600">自动同步</h3>
                    <div class="flex items-center space-x-3">
                      <label
                        class="relative inline-flex items-center cursor-pointer"
                      >
                        <input type="checkbox" checked class="sr-only peer" />
                        <div
                          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                        ></div>
                      </label>
                      <span class="text-gray-600">启用自动时间同步</span>
                    </div>
                    <p class="text-gray-600 text-sm">
                      每 24 小时自动同步一次网络时间
                    </p>
                  </div>
                </div>

                <div class="space-y-4">
                  <h3 class="text-md font-medium text-gray-600">
                    NTP 服务器配置
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-gray-600 text-sm mb-1"
                        >服务器 1</label
                      >
                      <input
                        type="text"
                        value="ntp1.aliyun.com"
                        class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label class="block text-gray-600 text-sm mb-1"
                        >服务器 2</label
                      >
                      <input
                        type="text"
                        value="ntp.ubuntu.com"
                        class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label class="block text-gray-600 text-sm mb-1"
                        >服务器 3</label
                      >
                      <input
                        type="text"
                        value="pool.ntp.org"
                        class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 系统信息概览 -->
              <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h2 class="text-lg font-semibold text-gray-800 mb-4">
                  系统信息概览
                </h2>

                <div
                  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <div class="space-y-2">
                    <div class="text-gray-600 text-sm">设备型号</div>
                    <div class="font-medium text-gray-800">
                      AGV Controller V2
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="text-gray-600 text-sm">系统版本</div>
                    <div class="font-medium text-gray-800">Linux 5.15.0</div>
                  </div>

                  <div class="space-y-2">
                    <div class="text-gray-600 text-sm">运行时间</div>
                    <div class="font-medium text-gray-800">
                      128 天 04 小时 32 分
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="text-gray-600 text-sm">CPU 使用率</div>
                    <div class="font-medium text-gray-800 flex items-center">
                      <span>42%</span>
                      <div
                        class="ml-3 w-32 h-2 bg-gray-200 rounded-full overflow-hidden"
                      >
                        <div
                          class="h-full bg-primary rounded-full"
                          style="width: 42%"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="text-gray-600 text-sm">内存占用</div>
                    <div class="font-medium text-gray-800 flex items-center">
                      <span>1.8GB / 8GB</span>
                      <div
                        class="ml-3 w-32 h-2 bg-gray-200 rounded-full overflow-hidden"
                      >
                        <div
                          class="h-full bg-primary rounded-full"
                          style="width: 22%"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="text-gray-600 text-sm">存储空间</div>
                    <div class="font-medium text-gray-800 flex items-center">
                      <span>23GB / 128GB</span>
                      <div
                        class="ml-3 w-32 h-2 bg-gray-200 rounded-full overflow-hidden"
                      >
                        <div
                          class="h-full bg-primary rounded-full"
                          style="width: 18%"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 系统状态内容 -->
            <div id="content-status" class="hidden p-4">
              <div class="info-card">
            <div class="info-row">
                <span class="info-label">系统状态</span>
                <span class="status-normal">正常</span>
            </div>
            <div class="info-row">
                <span class="info-label">IP</span>
                <span class="info-value">192.168.1.100</span>
            </div>
            <div class="info-row">
                <span class="info-label">固件版本</span>
                <span class="info-value">DR230_HI_zhikong_A0242_2026010916</span>
            </div>
            <div class="info-row">
                <span class="info-label">PC版本</span>
                <span class="info-value">V3.0.3.20250826.AQN</span>
            </div>
            <div class="info-row">
                <span class="info-label">SN号</span>
                <span class="info-value">ZK_245_20250106_03</span>
            </div>
            <div class="info-row">
                <span class="info-label">MAC</span>
                <span class="info-value">00:1B:44:11:3A:B7</span>
            </div>
            <div class="info-row">
                <span class="info-label">内存使用</span>
                <div class="progress-wrapper">
                    <div class="progress-container">
                        <div class="progress-bar progress-memory"></div>
                    </div>
                    <span class="progress-text">1.8GB / 8GB</span>
                </div>
            </div>
            <div class="info-row">
                <span class="info-label">磁盘使用</span>
                <div class="progress-wrapper">
                    <div class="progress-container">
                        <div class="progress-bar progress-disk"></div>
                    </div>
                    <span class="progress-text">45.2GB / 128GB</span>
                </div>
            </div>
            <div class="info-row">
                <span class="info-label">运行时间</span>
                <span class="info-value">15天 6小时 32分钟</span>
            </div>
            <div class="info-row">
                <span class="info-label">在线状态</span>
                <span class="status-online">在线</span>
            </div>
        </div>
            </div>

            <!-- 恢复出厂设置内容 -->
            <div id="content-reset" class="hidden p-4">
              <div class="space-y-4">
                <div class="bg-white border border-gray-200 rounded p-4">
                  <div class="flex items-center gap-3 mb-4">
                    <i class="fa fa-warning text-warning text-xl"></i>
                    <span class="text-sm font-medium text-gray-700">警告</span>
                  </div>
                  <ul class="text-sm text-gray-600 space-y-2 ml-8">
                    <li>1. 恢复出厂设置将清除所有配置和数据</li>
                    <li>2. 所有地图信息将被删除</li>
                    <li>3. 所有路径信息将被删除</li>
                    <li>4. 所有任务信息将被删除</li>
                    <li>5. 此操作不可逆</li>
                  </ul>
                </div>
                <div class="bg-blue-50 border border-blue-200 rounded p-4">
                  <div class="flex items-center gap-3 mb-3">
                    <i class="fa fa-info-circle text-primary text-xl"></i>
                    <span class="text-sm font-medium text-gray-700"
                      >恢复出厂设置后</span
                    >
                  </div>
                  <ul class="text-sm text-gray-600 space-y-2 ml-8">
                    <li>1. 系统将自动重启</li>
                    <li>2. 设备需要重新配置网络</li>
                    <li>3. 设备需要重新校准</li>
                  </ul>
                </div>
                <div class="flex justify-center pt-4">
                  <button
                    class="bg-danger text-white px-8 py-3 rounded text-sm hover:bg-danger/90 transition"
                  >
                    <i class="fa fa-refresh mr-2"></i>恢复出厂设置
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'SystemConfigPage',
  mounted() {
    this.initPage();
    this.initCharts();
  },
  methods: {
    initPage() {
      // Page-specific initialization
    },
    switchSystemMenu(menu) {
      document.querySelectorAll('[id^="content-"]').forEach(el => {
        el.classList.add('hidden');
      });
      document.getElementById(`content-${menu}`).classList.remove('hidden');
      document.querySelectorAll('[id^="menu-"]').forEach(btn => {
        btn.classList.remove('bg-[#e8f0fe]');
      });
      document.getElementById(`menu-${menu}`).classList.add('bg-[#e8f0fe]');
    },
    initCharts() {
      const cpuCtx = document.getElementById('cpuChart');
      if (cpuCtx) {
        new Chart(cpuCtx, {
          type: 'line',
          data: {
            labels: ['0s', '5s', '10s', '15s', '20s', '25s', '30s'],
            datasets: [{
              label: 'CPU使用率(%)',
              data: [30, 45, 35, 50, 40, 37, 42],
              borderColor: '#4080FF',
              backgroundColor: 'rgba(64, 128, 255, 0.1)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { beginAtZero: true, max: 100 }
            }
          }
        });
      }

      const memoryCtx = document.getElementById('memoryChart');
      if (memoryCtx) {
        new Chart(memoryCtx, {
          type: 'line',
          data: {
            labels: ['0s', '5s', '10s', '15s', '20s', '25s', '30s'],
            datasets: [{
              label: '内存使用率(%)',
              data: [52, 48, 55, 49, 53, 50, 52],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { beginAtZero: true, max: 100 }
            }
          }
        });
      }

      const diskCtx = document.getElementById('diskChart');
      if (diskCtx) {
        new Chart(diskCtx, {
          type: 'line',
          data: {
            labels: ['0s', '5s', '10s', '15s', '20s', '25s', '30s'],
            datasets: [{
              label: '磁盘使用率(%)',
              data: [41, 42, 41, 43, 42, 41, 41],
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { beginAtZero: true, max: 100 }
            }
          }
        });
      }

      const networkCtx = document.getElementById('networkChart');
      if (networkCtx) {
        new Chart(networkCtx, {
          type: 'line',
          data: {
            labels: ['0s', '5s', '10s', '15s', '20s', '25s', '30s'],
            datasets: [
              {
                label: '上传',
                data: [5.2, 4.8, 5.5, 5.1, 4.9, 5.2, 5.0],
                borderColor: '#4080FF',
                tension: 0.4
              },
              {
                label: '下载',
                data: [12.8, 13.5, 12.5, 13.2, 13.8, 12.9, 13.0],
                borderColor: '#10b981',
                tension: 0.4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }
        });
      }
    },
    viewLogPackage(name, date, size) {
      alert(`查看日志包: ${name}\n日期: ${date}\n大小: ${size}`);
    },
    viewMap(filename) {
      alert(`查看地图: ${filename}`);
    },
    deleteMap(filename) {
      if (confirm(`确定要删除地图 ${filename} 吗?`)) {
        alert(`已删除地图: ${filename}`);
      }
    },
    retryUpload(filename) {
      alert(`重试上传: ${filename}`);
    },
    startUpload() {
      alert('开始上传地图...');
    },
    handleFileSelect() {
      alert('文件已选择');
    }
  }
};
</script>
