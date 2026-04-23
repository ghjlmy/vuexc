<template>
      <div
        id="task-report-page"
        class="bg-gray-50 min-h-screen flex flex-col"
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
            <h1 class="text-xl font-bold text-gray-800">任务报告</h1>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="exportTaskReports()"
              class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded flex items-center gap-1 transition"
            >
              <i class="fa fa-download"></i>
              <span>导出报告</span>
            </button>
            <button
              @click="refreshTaskReports()"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded flex items-center gap-1 transition"
            >
              <i class="fa fa-refresh"></i>
              <span>刷新</span>
            </button>
          </div>
        </header>

        <!-- 任务报告主内容 -->
        <main class="flex-1 p-6 overflow-y-auto">
          <div class="mx-auto">
            <!-- 工具栏 -->
            <div
              class="bg-white rounded shadow-sm border border-gray-200 p-4 mb-4"
            >
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-700">任务类型:</span>
                  <select
                    class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  >
                    <option value="all">全部</option>
                    <option value="navigation">导航</option>
                    <option value="charging">充电</option>
                    <option value="mapping">建图</option>
                  </select>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-700">开始时间:</span>
                  <input
                    type="date"
                    class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-700">结束时间:</span>
                  <input
                    type="date"
                    class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
              </div>
              <div class="mt-4 flex items-center gap-2">
                <span class="text-sm text-gray-700">搜索:</span>
                <input
                  type="text"
                  placeholder="输入任务名称或ID搜索"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <!-- 任务报告列表 -->
            <div
              class="bg-white rounded shadow-sm border border-gray-200 overflow-hidden"
            >
              <!-- 表头 -->
              <div class="bg-gray-50 border-b border-gray-200">
                <div
                  class="grid grid-cols-12 py-3 px-4 text-sm font-medium text-gray-600"
                >
                  <div class="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      class="accent-primary w-4 h-4"
                      @click="toggleSelectAllReports()"
                    />
                  </div>
                  <div class="col-span-1">序号</div>
                  <div class="col-span-1">地图名称</div>
                  <div class="col-span-1">任务名称</div>
                  <div class="col-span-2">任务地点</div>
                  <div class="col-span-2">开始时间</div>
                  <div class="col-span-2">结束时间</div>
                  <div class="col-span-1">备注</div>
                  <div class="col-span-1 text-center">操作</div>
                </div>
              </div>

              <!-- 列表内容 -->
              <div class="divide-y divide-gray-200">
                <!-- 示例数据 -->
                <div
                  class="grid grid-cols-12 py-3 px-4 items-center hover:bg-gray-50 transition"
                >
                  <div class="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      class="report-checkbox accent-primary w-4 h-4"
                    />
                  </div>
                  <div class="col-span-1 text-sm text-gray-600">1</div>
                  <div class="col-span-1 text-sm">主地图</div>
                  <div class="col-span-1 text-sm">每日巡检</div>
                  <div class="col-span-2 text-sm text-gray-500">仓库A区</div>
                  <div class="col-span-2 text-sm text-gray-500">
                    2024-05-20 09:00:00
                  </div>
                  <div class="col-span-2 text-sm text-gray-500">
                    2024-05-20 09:30:15
                  </div>
                  <div class="col-span-1 text-sm text-gray-500">正常完成</div>
                  <div class="col-span-1 flex justify-center gap-2">
                    <button
                      @click="
                        viewTaskReport(
                          '1',
                          '主地图',
                          '每日巡检',
                          '仓库A区',
                          '2024-05-20 09:00:00',
                          '2024-05-20 09:30:15',
                          '正常完成',
                        )
                      "
                      class="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition"
                    >
                      详情
                    </button>
                    <button
                      @click="deleteTaskReport('1')"
                      class="px-2 py-1 bg-danger text-white text-xs rounded hover:bg-danger/90 transition"
                    >
                      删除
                    </button>
                  </div>
                </div>
                <div
                  class="grid grid-cols-12 py-3 px-4 items-center hover:bg-gray-50 transition"
                >
                  <div class="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      class="report-checkbox accent-primary w-4 h-4"
                    />
                  </div>
                  <div class="col-span-1 text-sm text-gray-600">2</div>
                  <div class="col-span-1 text-sm">仓库B区地图</div>
                  <div class="col-span-1 text-sm">物料运输</div>
                  <div class="col-span-2 text-sm text-gray-500">仓库B区</div>
                  <div class="col-span-2 text-sm text-gray-500">
                    2024-05-20 14:30:00
                  </div>
                  <div class="col-span-2 text-sm text-gray-500">
                    2024-05-20 15:05:20
                  </div>
                  <div class="col-span-1 text-sm text-gray-500">正常完成</div>
                  <div class="col-span-1 flex justify-center gap-2">
                    <button
                      @click="
                        viewTaskReport(
                          '2',
                          '仓库B区地图',
                          '物料运输',
                          '仓库B区',
                          '2024-05-20 14:30:00',
                          '2024-05-20 15:05:20',
                          '正常完成',
                        )
                      "
                      class="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition"
                    >
                      详情
                    </button>
                    <button
                      @click="deleteTaskReport('2')"
                      class="px-2 py-1 bg-danger text-white text-xs rounded hover:bg-danger/90 transition"
                    >
                      删除
                    </button>
                  </div>
                </div>
                <div
                  class="grid grid-cols-12 py-3 px-4 items-center hover:bg-gray-50 transition"
                >
                  <div class="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      class="report-checkbox accent-primary w-4 h-4"
                    />
                  </div>
                  <div class="col-span-1 text-sm text-gray-600">3</div>
                  <div class="col-span-1 text-sm">仓库C区地图</div>
                  <div class="col-span-1 text-sm">建图任务</div>
                  <div class="col-span-2 text-sm text-gray-500">仓库C区</div>
                  <div class="col-span-2 text-sm text-gray-500">
                    2024-05-19 10:00:00
                  </div>
                  <div class="col-span-2 text-sm text-gray-500">
                    2024-05-19 12:30:45
                  </div>
                  <div class="col-span-1 text-sm text-gray-500">正常完成</div>
                  <div class="col-span-1 flex justify-center gap-2">
                    <button
                      @click="
                        viewTaskReport(
                          '3',
                          '仓库C区地图',
                          '建图任务',
                          '仓库C区',
                          '2024-05-19 10:00:00',
                          '2024-05-19 12:30:45',
                          '正常完成',
                        )
                      "
                      class="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition"
                    >
                      详情
                    </button>
                    <button
                      @click="deleteTaskReport('3')"
                      class="px-2 py-1 bg-danger text-white text-xs rounded hover:bg-danger/90 transition"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>

              <!-- 底部统计 -->
              <div
                class="bg-gray-50 border-t border-gray-200 py-3 px-4 flex items-center justify-between text-sm"
              >
                <div class="flex items-center gap-2">
                  <span>共 <span id="report-count">3</span> 个任务报告</span>
                  <span
                    >已选择 <span id="selected-report-count">0</span> 个</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <button
                    class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled
                  >
                    上一页
                  </button>
                  <button
                    class="px-3 py-1 bg-primary text-white rounded text-sm"
                  >
                    1
                  </button>
                  <button
                    class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled
                  >
                    下一页
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- 任务报告页面底部状态栏 -->
        <footer
          class="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm"
        >
          <div class="flex items-center gap-2">
            <i class="fa fa-circle text-success text-xs"></i>
            <span>任务报告管理状态：正常</span>
          </div>
          <div class="text-gray-500">最后更新: 2024-05-20 16:50:10</div>
        </footer>
      </div>
</template>

<script>
export default {
  name: 'TaskReportPage',
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
