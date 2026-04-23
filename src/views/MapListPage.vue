<template>
      <div
        id="map-list-page"
        class="bg-map-bg min-h-screen flex flex-col"
      >
        <!-- 地图列表页面顶部导航 -->
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
            <h1 class="text-xl font-bold text-gray-800">地图列表</h1>
          </div>
          <div>
            <button
              @click="$router.push('/create-map')"
              class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded flex items-center gap-1 transition"
            >
              <i class="fa fa-plus"></i>
              <span>新建地图</span>
            </button>
          </div>
        </header>

        <!-- 地图列表主内容 -->
        <main class="flex-1 p-6">
          <div
            class="bg-white rounded shadow-sm border border-gray-light overflow-hidden"
          >
            <!-- 列表头部 -->
            <div
              class="bg-gray-50 px-6 py-3 flex items-center border-b border-gray-light text-sm"
            >
              <div class="w-[15%] font-bold">地图名称</div>
              <div class="w-[15%] font-bold">位置名称</div>
              <div class="w-[20%] font-bold">创建时间</div>
              <div class="w-[25%] font-bold">备注</div>
              <div class="w-[25%] font-bold text-center">操作</div>
            </div>

            <!-- 列表内容 -->
            <div id="map-list-content" class="divide-y divide-gray-light">
              <!-- 示例数据 -->
              <div class="px-6 py-4 flex items-center text-sm">
                <div class="w-[15%]">仓库A区主地图</div>
                <div class="w-[15%]">一号仓库A区</div>
                <div class="w-[20%]">2024-05-20 14:30:25</div>
                <div class="w-[25%]">日常巡检使用地图</div>
                <div class="w-[25%] flex justify-center gap-3">
                  <button
                    class="text-primary hover:text-primary/80 transition flex items-center gap-1"
                  >
                    <i class="fa fa-edit"></i>编辑
                  </button>
                  <button
                    class="text-warning hover:text-warning/80 transition flex items-center gap-1"
                  >
                    <i class="fa fa-eye"></i>查看
                  </button>
                  <button
                    class="text-success hover:text-success/80 transition flex items-center gap-1"
                  >
                    <i class="fa fa-check"></i>使用
                  </button>
                </div>
              </div>
              <div class="px-6 py-4 flex items-center text-sm">
                <div class="w-[15%]">生产车间地图</div>
                <div class="w-[15%]">二号生产车间</div>
                <div class="w-[20%]">2024-05-19 09:15:40</div>
                <div class="w-[25%]">物料运输专用地图</div>
                <div class="w-[25%] flex justify-center gap-3">
                  <button
                    class="text-primary hover:text-primary/80 transition flex items-center gap-1"
                  >
                    <i class="fa fa-edit"></i>编辑
                  </button>
                  <button
                    class="text-warning hover:text-warning/80 transition flex items-center gap-1"
                  >
                    <i class="fa fa-eye"></i>查看
                  </button>
                  <button
                    class="text-success hover:text-success/80 transition flex items-center gap-1"
                  >
                    <i class="fa fa-check"></i>使用
                  </button>
                </div>
              </div>
            </div>

            <!-- 空状态提示 -->
            <div id="empty-map-list" class="hidden py-16 text-center">
              <i class="fa fa-folder-open text-5xl text-gray-light mb-4"></i>
              <p class="text-gray-deep">暂无地图数据，请点击右上角新建地图</p>
            </div>
          </div>
        </main>

        <!-- 地图列表页面底部 -->
        <footer
          class="bg-white border-t border-gray-light px-6 py-3 text-sm text-gray-deep"
        >
          <div class="flex items-center justify-between">
            <div>共 <span id="map-count">2</span> 张地图</div>
            <div class="flex items-center gap-3">
              <button
                class="px-3 py-1 border border-gray-light rounded hover:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                上一页
              </button>
              <button class="px-3 py-1 bg-primary text-white rounded">1</button>
              <button
                class="px-3 py-1 border border-gray-light rounded hover:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                下一页
              </button>
            </div>
          </div>
        </footer>
      </div>
</template>

<script>
export default {
  name: 'MapListPage',
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
