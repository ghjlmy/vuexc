<template>
      <div
        id="create-map-page"
        class="bg-map-bg min-h-screen flex flex-col"
      >
        <!-- 新建地图页面顶部导航 -->
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
            <h1 class="text-xl font-bold text-gray-800">新建地图</h1>
          </div>
          <div class="text-sm text-gray-deep">
            <span>AGV OS v1.8.0</span>
          </div>
        </header>

        <!-- 新建地图主内容 -->
        <main class="flex-1 flex items-center justify-center p-8">
          <div class="text-center">
            <div class="mb-8">
              <i class="fa fa-map text-6xl text-primary/70 mb-4"></i>
              <h2 class="text-2xl font-semibold text-gray-700 mb-2">
                地图创建准备
              </h2>
              <p class="text-gray-deep">
                请确认机器人处于建图区域，点击下方按钮开始建图
              </p>
            </div>
            <!-- 发光的开始建图按钮 -->
            <button
              @click="$router.push('/mapping')"
              class="glow-btn bg-primary text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-primary/90 transition-all"
            >
              <i class="fa fa-play-circle mr-2"></i>开始建图
            </button>
          </div>
        </main>

        <!-- 新建地图页面底部 -->
        <footer
          class="bg-white border-t border-gray-light px-6 py-2 text-sm text-gray-deep text-center"
        >
          建图前请确保激光雷达无遮挡 | 机器人电量充足
        </footer>
      </div>
</template>

<script>
export default {
  name: 'CreateMapPage',
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
