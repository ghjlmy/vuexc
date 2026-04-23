<template>
      <div
        id="record-pack-page"
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
            <h1 class="text-xl font-bold text-gray-800">路录包管理</h1>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="refreshRecordPacks()"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded flex items-center gap-1 transition"
            >
              <i class="fa fa-refresh"></i>
              <span>刷新</span>
            </button>
            <button
              @click="deleteSelectedRecordPacks()"
              class="bg-danger hover:bg-danger/90 text-white px-4 py-2 rounded flex items-center gap-1 transition"
            >
              <i class="fa fa-trash"></i>
              <span>删除选中</span>
            </button>
          </div>
        </header>

        <!-- 路录包管理主内容 -->
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
                    placeholder="输入路录包名称搜索"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-700">类型:</span>
                  <select
                    class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  >
                    <option value="all">全部</option>
                    <option value="navigation">导航</option>
                    <option value="mapping">建图</option>
                    <option value="other">其他</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 路录包列表 -->
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
                      @click="toggleSelectAll()"
                    />
                  </div>
                  <div class="col-span-2">时间</div>
                  <div class="col-span-2">名称</div>
                  <div class="col-span-1">地点</div>
                  <div class="col-span-1">操作员</div>
                  <div class="col-span-1">大小</div>
                  <div class="col-span-2">备注</div>
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
                      class="record-pack-checkbox accent-primary w-4 h-4"
                    />
                  </div>
                  <div class="col-span-2 text-sm text-gray-600">
                    2024-05-20 14:30:25
                  </div>
                  <div class="col-span-2 text-sm">导航记录_12345</div>
                  <div class="col-span-1 text-sm text-gray-500">仓库A区</div>
                  <div class="col-span-1 text-sm text-gray-500">张三</div>
                  <div class="col-span-1 text-sm text-gray-500">1.2 MB</div>
                  <div class="col-span-2 text-sm text-gray-500">
                    日常巡检记录
                  </div>
                  <div class="col-span-2 flex justify-center gap-2">
                    <button
                      @click="
                        viewRecordPack(
                          '导航记录_12345',
                          '2024-05-20 14:30:25',
                          '仓库A区',
                          '张三',
                          '1.2 MB',
                          '日常巡检记录',
                        )
                      "
                      class="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition"
                    >
                      查看
                    </button>
                    <button
                      @click="downloadRecordPack('导航记录_12345')"
                      class="px-2 py-1 bg-success text-white text-xs rounded hover:bg-success/90 transition"
                    >
                      下载
                    </button>
                    <button
                      @click="deleteRecordPack('导航记录_12345')"
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
                      class="record-pack-checkbox accent-primary w-4 h-4"
                    />
                  </div>
                  <div class="col-span-2 text-sm text-gray-600">
                    2024-05-19 09:15:40
                  </div>
                  <div class="col-span-2 text-sm">建图记录_67890</div>
                  <div class="col-span-1 text-sm text-gray-500">仓库B区</div>
                  <div class="col-span-1 text-sm text-gray-500">李四</div>
                  <div class="col-span-1 text-sm text-gray-500">3.5 MB</div>
                  <div class="col-span-2 text-sm text-gray-500">新区域建图</div>
                  <div class="col-span-2 flex justify-center gap-2">
                    <button
                      @click="
                        viewRecordPack(
                          '建图记录_67890',
                          '2024-05-19 09:15:40',
                          '仓库B区',
                          '李四',
                          '3.5 MB',
                          '新区域建图',
                        )
                      "
                      class="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition"
                    >
                      查看
                    </button>
                    <button
                      @click="downloadRecordPack('建图记录_67890')"
                      class="px-2 py-1 bg-success text-white text-xs rounded hover:bg-success/90 transition"
                    >
                      下载
                    </button>
                    <button
                      @click="deleteRecordPack('建图记录_67890')"
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
                      class="record-pack-checkbox accent-primary w-4 h-4"
                    />
                  </div>
                  <div class="col-span-2 text-sm text-gray-600">
                    2024-05-18 16:45:30
                  </div>
                  <div class="col-span-2 text-sm">导航记录_54321</div>
                  <div class="col-span-1 text-sm text-gray-500">仓库C区</div>
                  <div class="col-span-1 text-sm text-gray-500">王五</div>
                  <div class="col-span-1 text-sm text-gray-500">0.8 MB</div>
                  <div class="col-span-2 text-sm text-gray-500">
                    物料运输记录
                  </div>
                  <div class="col-span-2 flex justify-center gap-2">
                    <button
                      @click="
                        viewRecordPack(
                          '导航记录_54321',
                          '2024-05-18 16:45:30',
                          '仓库C区',
                          '王五',
                          '0.8 MB',
                          '物料运输记录',
                        )
                      "
                      class="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition"
                    >
                      查看
                    </button>
                    <button
                      @click="downloadRecordPack('导航记录_54321')"
                      class="px-2 py-1 bg-success text-white text-xs rounded hover:bg-success/90 transition"
                    >
                      下载
                    </button>
                    <button
                      @click="deleteRecordPack('导航记录_54321')"
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
                  <span>共 <span id="record-pack-count">3</span> 个路录包</span>
                  <span>已选择 <span id="selected-count">0</span> 个</span>
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

        <!-- 路录包管理页面底部状态栏 -->
        <footer
          class="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm"
        >
          <div class="flex items-center gap-2">
            <i class="fa fa-circle text-success text-xs"></i>
            <span>路录包管理状态：正常</span>
          </div>
          <div class="text-gray-500">最后更新: 2024-05-20 16:50:10</div>
        </footer>
      </div>
</template>

<script>
export default {
  name: 'RecordPackPage',
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
