<template>
      <div
        id="scheduled-task-page"
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
            <h1 class="text-xl font-bold text-gray-800">定时任务</h1>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="addScheduledTask()"
              class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded flex items-center gap-1 transition"
            >
              <i class="fa fa-plus"></i>
              <span>新建任务</span>
            </button>
            <button
              @click="refreshScheduledTasks()"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded flex items-center gap-1 transition"
            >
              <i class="fa fa-refresh"></i>
              <span>刷新</span>
            </button>
          </div>
        </header>

        <!-- 定时任务主内容 -->
        <main class="flex-1 p-6 overflow-y-auto">
          <div class="mx-auto">
            <!-- 工具栏 -->
            <div
              class="bg-white rounded shadow-sm border border-gray-200 p-4 mb-4"
            >
              <div class="flex items-center gap-4">
                <div class="flex-1 flex items-center gap-2">
                  <span class="text-sm text-gray-700">搜索:</span>
                  <input
                    type="text"
                    placeholder="输入任务名称搜索"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-700">状态:</span>
                  <select
                    class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  >
                    <option value="all">全部</option>
                    <option value="enabled">启用</option>
                    <option value="disabled">禁用</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 定时任务列表 -->
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
                      @click="toggleSelectAllScheduledTasks()"
                    />
                  </div>
                  <div class="col-span-2">定时任务</div>
                  <div class="col-span-1">任务地点</div>
                  <div class="col-span-1">地图id</div>
                  <div class="col-span-1">执行任务</div>
                  <div class="col-span-2">执行时间</div>
                  <div class="col-span-1">操作员</div>
                  <div class="col-span-1">备注</div>
                  <div class="col-span-2 text-center">操作</div>
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
                      class="scheduled-task-checkbox accent-primary w-4 h-4"
                    />
                  </div>
                  <div class="col-span-2 text-sm">每日巡检任务</div>
                  <div class="col-span-1 text-sm text-gray-500">仓库A区</div>
                  <div class="col-span-1 text-sm text-gray-500">map-001</div>
                  <div class="col-span-1 text-sm text-gray-500">导航</div>
                  <div class="col-span-2 text-sm text-gray-500">09:00 每天</div>
                  <div class="col-span-1 text-sm text-gray-500">张三</div>
                  <div class="col-span-1 text-sm text-gray-500">日常巡检</div>
                  <div class="col-span-2 flex justify-center gap-2">
                    <button
                      @click="
                        viewScheduledTask(
                          '每日巡检任务',
                          '仓库A区',
                          'map-001',
                          '导航',
                          '09:00 每天',
                          '张三',
                          '日常巡检',
                        )
                      "
                      class="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition"
                    >
                      详情
                    </button>
                    <button
                      @click="editScheduledTask('每日巡检任务')"
                      class="px-2 py-1 bg-warning text-white text-xs rounded hover:bg-warning/90 transition"
                    >
                      编辑
                    </button>
                    <button
                      @click="deleteScheduledTask('每日巡检任务')"
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
                      class="scheduled-task-checkbox accent-primary w-4 h-4"
                    />
                  </div>
                  <div class="col-span-2 text-sm">物料运输任务</div>
                  <div class="col-span-1 text-sm text-gray-500">仓库B区</div>
                  <div class="col-span-1 text-sm text-gray-500">map-002</div>
                  <div class="col-span-1 text-sm text-gray-500">导航</div>
                  <div class="col-span-2 text-sm text-gray-500">
                    14:30 工作日
                  </div>
                  <div class="col-span-1 text-sm text-gray-500">李四</div>
                  <div class="col-span-1 text-sm text-gray-500">物料配送</div>
                  <div class="col-span-2 flex justify-center gap-2">
                    <button
                      @click="
                        viewScheduledTask(
                          '物料运输任务',
                          '仓库B区',
                          'map-002',
                          '导航',
                          '14:30 工作日',
                          '李四',
                          '物料配送',
                        )
                      "
                      class="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition"
                    >
                      详情
                    </button>
                    <button
                      @click="editScheduledTask('物料运输任务')"
                      class="px-2 py-1 bg-warning text-white text-xs rounded hover:bg-warning/90 transition"
                    >
                      编辑
                    </button>
                    <button
                      @click="deleteScheduledTask('物料运输任务')"
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
                      class="scheduled-task-checkbox accent-primary w-4 h-4"
                    />
                  </div>
                  <div class="col-span-2 text-sm">夜间充电任务</div>
                  <div class="col-span-1 text-sm text-gray-500">充电站</div>
                  <div class="col-span-1 text-sm text-gray-500">map-001</div>
                  <div class="col-span-1 text-sm text-gray-500">充电</div>
                  <div class="col-span-2 text-sm text-gray-500">22:00 每天</div>
                  <div class="col-span-1 text-sm text-gray-500">王五</div>
                  <div class="col-span-1 text-sm text-gray-500">自动充电</div>
                  <div class="col-span-2 flex justify-center gap-2">
                    <button
                      @click="
                        viewScheduledTask(
                          '夜间充电任务',
                          '充电站',
                          'map-001',
                          '充电',
                          '22:00 每天',
                          '王五',
                          '自动充电',
                        )
                      "
                      class="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition"
                    >
                      详情
                    </button>
                    <button
                      @click="editScheduledTask('夜间充电任务')"
                      class="px-2 py-1 bg-warning text-white text-xs rounded hover:bg-warning/90 transition"
                    >
                      编辑
                    </button>
                    <button
                      @click="deleteScheduledTask('夜间充电任务')"
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
                  <span
                    >共
                    <span id="scheduled-task-count">3</span> 个定时任务</span
                  >
                  <span>已选择 <span id="selected-task-count">0</span> 个</span>
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

        <!-- 定时任务页面底部状态栏 -->
        <footer
          class="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm"
        >
          <div class="flex items-center gap-2">
            <i class="fa fa-circle text-success text-xs"></i>
            <span>定时任务管理状态：正常</span>
          </div>
          <div class="text-gray-500">最后更新: 2024-05-20 16:50:10</div>
        </footer>
      </div>
</template>

<script>
export default {
  name: 'ScheduledTaskPage',
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
