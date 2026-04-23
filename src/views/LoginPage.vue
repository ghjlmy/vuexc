<template>
      <div id="login-page" class="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-white">
        <div class="flex-1 flex items-center justify-center">
          <div class="bg-white rounded-xl shadow-lg p-8 w-96 slide-in">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fa fa-robot text-white text-3xl"></i>
              </div>
              <h2 class="text-2xl font-bold text-dark">AGV智能小车</h2>
              <p class="text-gray-deep text-sm mt-1">连接机器人设备</p>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-dark mb-1">机器人IP地址</label>
                <input
                  id="robot-ip"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="192.168.1.100"
                  value="192.168.1.100"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-dark mb-1">端口号</label>
                <input
                  id="robot-port"
                  type="number"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="8080"
                  value="8080"
                />
              </div>
              
              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2">
                  <input type="checkbox" id="remember-ip" class="accent-primary w-4 h-4" checked />
                  <span class="text-sm text-gray-deep">记住IP地址</span>
                </label>
              </div>
              
              <button
                id="connect-btn"
                class="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 font-medium"
                @click="handleConnect()"
              >
                <i class="fa fa-plug"></i>
                <span>连接机器人</span>
              </button>
              
              <div class="pt-2">
                <div class="text-sm text-gray-deep mb-2">快速连接:</div>
                <div class="flex flex-wrap gap-2">
                  <button class="px-3 py-1 bg-gray-100 text-gray-dark text-sm rounded hover:bg-gray-200 transition" @click="setQuickConnect('192.168.1.100', '8080')">
                    机器人1
                  </button>
                  <button class="px-3 py-1 bg-gray-100 text-gray-dark text-sm rounded hover:bg-gray-200 transition" @click="setQuickConnect('192.168.1.101', '8080')">
                    机器人2
                  </button>
                  <button class="px-3 py-1 bg-gray-100 text-gray-dark text-sm rounded hover:bg-gray-200 transition" @click="setQuickConnect('192.168.1.102', '8080')">
                    机器人3
                  </button>
                </div>
              </div>
            </div>
            
            <div id="connect-status" class="mt-4 hidden">
              <div class="flex items-center gap-2 text-sm">
                <i class="fa fa-spinner fa-spin text-primary"></i>
                <span id="connect-status-text">正在连接...</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white border-t border-gray-200 py-3 px-4 flex items-center justify-between text-sm text-gray-deep">
          <div>版本: v2.0.0</div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1">
              <i class="fa fa-circle text-success text-xs"></i>
              <span>系统就绪</span>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
export default {
  name: 'LoginPage',
  methods: {
    handleConnect() {
      const btn = document.getElementById('connect-btn');
      const status = document.getElementById('connect-status');
      const statusText = document.getElementById('connect-status-text');
      
      btn.disabled = true;
      status.classList.remove('hidden');
      statusText.textContent = '正在连接...';
      
      setTimeout(() => {
        statusText.textContent = '验证身份...';
      }, 1000);
      
      setTimeout(() => {
        statusText.textContent = '连接成功！';
        btn.innerHTML = '<i class="fa fa-check"></i><span>连接成功</span>';
        btn.classList.remove('bg-primary');
        btn.classList.add('bg-success');
        
        setTimeout(() => {
          this.$router.push('/main');
        }, 800);
      }, 2000);
    },
    setQuickConnect(ip, port) {
      document.getElementById('robot-ip').value = ip;
      document.getElementById('robot-port').value = port;
    },
  },
};
</script>
