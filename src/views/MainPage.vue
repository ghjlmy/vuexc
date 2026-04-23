<template>
  <div class="flex flex-col h-screen">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm border-b border-gray-200 px-4 py-2 flex items-center justify-between z-20 flex-shrink-0">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6">
          <i class="fa fa-wifi text-primary"></i>
        </div>
        <span class="text-lg font-bold text-dark">AGV智能操作系统</span>
      </div>

      <div class="flex items-center gap-1">
        <button @click="$router.push('/composite-task')" class="px-4 py-2 bg-success text-white rounded-md hover:bg-success/90 transition-all flex items-center gap-1">
          <i class="fa fa-play"></i>
          开始任务
        </button>
        <button class="px-4 py-2 bg-warning text-white rounded-md hover:bg-warning/90 transition-all flex items-center gap-1">
          <i class="fa fa-pause"></i>
          结束/暂停
        </button>
        <!-- <div class="relative">
          <button id="taskManageBtn" @click="toggleTaskManage" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-all flex items-center gap-1">
            <i class="fa fa-list"></i>
            任务管理
            <i class="fa fa-caret-down text-xs"></i>
          </button>
          <div id="taskManagePopup" :class="taskManageOpen ? '' : 'hidden'" class="absolute top-full right-0 mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-30 slide-in">
            <h4 class="text-sm font-semibold text-primary mb-3">导航参数设置</h4>
            <div class="space-y-2">
              <label class="flex items-center justify-between text-sm">
                <span>循环执行</span>
                <input type="checkbox" class="rounded text-primary" />
              </label>
              <label class="flex items-center justify-between text-sm">
                <span>沿轨道行驶</span>
                <input type="checkbox" class="rounded text-primary" />
              </label>
              <label class="flex items-center justify-between text-sm">
                <span>定时任务</span>
                <input type="checkbox" class="rounded text-primary" />
              </label>
              <div class="pt-1">
                <label class="text-xs text-gray-dark mb-1 block">定时时间</label>
                <div class="flex">
                  <input type="datetime-local" class="flex-1 px-3 py-2 border border-gray-200 rounded-l-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div class="pt-1">
                <label class="text-xs text-gray-dark mb-1 block">导航速度</label>
                <input type="text" class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" value="0.5m/s" />
              </div>
              <div class="pt-2">
                <button class="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-all text-sm">保存设置</button>
              </div>
            </div>
          </div>
        </div> -->
      </div>
      <div style="display: flex; gap: 8px">
        <button @click="$router.push('/temp-task')" class="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm">
          <i class="fa fa-tasks"></i>
          <span>临时任务</span>
        </button>
        <button class="px-3 py-2 text-gray-dark hover:bg-gray-100 rounded-md transition-all flex items-center gap-1 border border-gray-200">
          <i class="fa fa-cog"></i>
          系统设置
        </button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <aside class="w-40 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <nav class="flex-1 py-2 overflow-y-auto scrollbar-hide">
          <ul class="space-y-0.5">
            <li>
              <button @click="$router.push('/main')" class="bg-primary text-white  menu-item w-full text-left px-3 py-2 rounded-md flex items-center gap-2  hover:bg-gray-50 transition-all">
                <i class="fa fa-map-o w-5 text-center"></i>
                主地图
              </button>
            </li>
            <li>
              <button @click="toggleMapManage" class="menu-item w-full text-left px-3 py-2 rounded-md flex items-center justify-between text-dark hover:bg-gray-50 transition-all">
                <div class="flex items-center gap-2">
                  <i class="fa fa-map w-5 text-center"></i>
                  地图管理
                </div>
                <i id="map-manage-icon" :class="mapManageOpen ? 'fa-caret-up' : 'fa-caret-down'" class="fa text-xs"></i>
              </button>
              <div id="map-manage-dropdown" :class="mapManageOpen ? 'show' : ''" class="sidebar-dropdown">
                <a href="javascript:void(0)" @click="$router.push('/create-map')" class="block px-6 py-2 text-sm hover:bg-primary/10 hover:text-primary transition">
                  <i class="fa fa-plus mr-2"></i>新建地图
                </a>
                <a href="javascript:void(0)" @click="$router.push('/map-list')" class="block px-6 py-2 text-sm hover:bg-primary/10 hover:text-primary transition">
                  <i class="fa fa-list mr-2"></i>地图列表
                </a>
              </div>
            </li>
            <li><button @click="$router.push('/initial-location')" class="menu-item w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-dark hover:bg-gray-50 transition-all"><i class="fa fa-crosshairs w-5 text-center"></i>初始化定位</button></li>
            <li><button @click="$router.push('/point-manage')" class="menu-item w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-dark hover:bg-gray-50 transition-all"><i class="fa fa-map-marker w-5 text-center"></i>点管理</button></li>
            <li><button @click="$router.push('/path-manage')" class="menu-item w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-dark hover:bg-gray-50 transition-all"><i class="fa fa-road w-5 text-center"></i>路径管理</button></li>
            <li><button @click="$router.push('/hand-draw-track')" class="menu-item w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-dark hover:bg-gray-50 transition-all"><i class="fa fa-pencil w-5 text-center"></i>手绘轨道</button></li>
            <li><button @click="$router.push('/virtual-wall')" class="menu-item w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-dark hover:bg-gray-50 transition-all"><i class="fa fa-ban w-5 text-center"></i>虚拟墙设置</button></li>
            <li><button @click="$router.push('/nav-config')" class="menu-item w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-dark hover:bg-gray-50 transition-all"><i class="fa fa-compass w-5 text-center"></i>导航配置</button></li>
            <li><button @click="$router.push('/record-pack')" class="menu-item w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-dark hover:bg-gray-50 transition-all"><i class="fa fa-folder w-5 text-center"></i>路录包管理</button></li>
            <li><button @click="$router.push('/scheduled-task')" class="menu-item w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-dark hover:bg-gray-50 transition-all"><i class="fa fa-clock-o w-5 text-center"></i>定时任务</button></li>
            <li><button @click="$router.push('/task-report')" class="menu-item w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-dark hover:bg-gray-50 transition-all"><i class="fa fa-file-text-o w-5 text-center"></i>任务报告</button></li>
            <li><button @click="$router.push('/system-config')" class="menu-item w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-dark hover:bg-gray-50 transition-all"><i class="fa fa-cogs w-5 text-center"></i>系统配置</button></li>
            <li class="pt-2 border-t border-gray-100 mt-2">
              <button class="menu-item w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-dark hover:bg-gray-50 transition-all">
                <i class="fa fa-ellipsis-h w-5 text-center"></i>
                更多功能
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main class="flex-1 relative bg-gray-50 overflow-hidden">
        <div id="mapContainer" class="w-full h-full relative bg-white border border-gray-200">
          <div class="absolute inset-0 opacity-40" style="background-image: linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px); background-size: 40px 40px;"></div>

          <svg id="mapSvg" class="absolute inset-0 w-full h-full">
            <g id="routesLayer">
              <defs>
                <marker id="arrowStart" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto"><polygon points="10 0, 10 7, 0 3.5" fill="#4080FF" /></marker>
                <marker id="arrowEnd" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#4080FF" /></marker>
                <marker id="arrowSingle" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#4080FF" /></marker>
              </defs>
              <path d="M 180 380 L 220 380 L 220 250 L 280 250 L 280 450 L 380 450" stroke="#4080FF" stroke-width="3" fill="none" stroke-dasharray="8,4" opacity="0.9"/>
              <path d="M 280 450 L 280 250" stroke="#62C462" stroke-width="2" fill="none" marker-end="url(#arrowSingle)" opacity="0.7" data-direction="single"/>
            </g>
            
            <g id="pointsLayer">
              <g id="point-1" data-type="nav" data-direction="0">
                <circle cx="180" cy="380" r="8" fill="#62C462" stroke="#3CB371" stroke-width="2"/>
                <circle cx="180" cy="380" r="3" fill="white"/>
                <polygon points="180,365 175,373 185,373" fill="#62C462"/>
                <text x="180" y="400" text-anchor="middle" font-size="10" fill="#333">入库</text>
              </g>
              
              <g id="point-2" data-type="nav" data-direction="90">
                <circle cx="220" cy="380" r="8" fill="#4080FF" stroke="#1E5FB0" stroke-width="2"/>
                <circle cx="220" cy="380" r="3" fill="white"/>
                <polygon points="235,380 227,375 227,385" fill="#4080FF"/>
                <text x="220" y="400" text-anchor middle font-size="10" fill="#333">分拣区</text>
              </g>
              
              <g id="point-3" data-type="nav" data-direction="0">
                <circle cx="220" cy="250" r="8" fill="#4080FF" stroke="#1E5FB0" stroke-width="2"/>
                <circle cx="220" cy="250" r="3" fill="white"/>
                <polygon points="220,235 215,243 225,243" fill="#4080FF"/>
                <text x="220" y="270" text-anchor="middle" font-size="10" fill="#333">导航1</text>
              </g>
              
              <g id="point-4" data-type="nav" data-direction="0">
                <circle cx="280" cy="250" r="8" fill="#4080FF" stroke="#1E5FB0" stroke-width="2"/>
                <circle cx="280" cy="250" r="3" fill="white"/>
                <polygon points="280,235 275,243 285,243" fill="#4080FF"/>
                <text x="280" y="270" text-anchor="middle" font-size="10" fill="#333">导航2</text>
              </g>
              
              <g id="point-5" data-type="nav" data-direction="0">
                <circle cx="280" cy="450" r="8" fill="#4080FF" stroke="#1E5FB0" stroke-width="2"/>
                <circle cx="280" cy="450" r="3" fill="white"/>
                <polygon points="280,435 275,443 285,443" fill="#4080FF"/>
                <text x="280" y="470" text-anchor="middle" font-size="10" fill="#333">导航3</text>
              </g>
              
              <g id="point-6" data-type="charge" data-direction="180">
                <circle cx="380" cy="450" r="10" fill="#EE9A49" stroke="#CC7733" stroke-width="2"/>
                <circle cx="380" cy="450" r="4" fill="white"/>
                <polygon points="380,470 375,462 385,462" fill="#EE9A49"/>
                <text x="380" y="490" text-anchor="middle" font-size="10" fill="#333">
                  <tspan x="380" y="490">充电</tspan>
                  <tspan x="380" y="502" font-size="8">⚡</tspan>
                </text>
              </g>
            </g>
            
            <g id="agvCar" :transform="`translate(${carX}, ${carY}) rotate(${carRotation})`">
              <rect x="-16" y="-16" width="32" height="32" rx="4" fill="#4080FF"/>
              <polygon points="0,-12 -6,-5 6,-5" fill="white"/>
              <text x="0" y="4" text-anchor="middle" font-size="12" fill="white"><tspan>🤖</tspan></text>
            </g>
          </svg>

          <div class="absolute bottom-4 right-4 text-gray-400 pointer-events-none">主地图</div>
        </div>

        <div class="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
          <button class="w-8 h-8 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-all text-gray-dark flex items-center justify-center">
            <i class="fa fa-plus text-sm"></i>
          </button>
          <button class="w-8 h-8 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-all text-gray-dark flex items-center justify-center">
            <i class="fa fa-dot-circle-o text-sm"></i>
          </button>
          <button class="w-8 h-8 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-all text-gray-dark flex items-center justify-center">
            <i class="fa fa-minus text-sm"></i>
          </button>
        </div>
      </main>

      <aside class="w-64 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
        <div class="p-3 border-b border-gray-200">
          <h3 class="text-sm font-bold text-gray-dark mb-2 flex items-center gap-1">
            <i class="fa fa-info-circle text-primary"></i>机器人状态
          </h3>
          <div class="space-y-1.5 text-xs">
            <div class="flex items-center justify-between py-0.5"><span>位置 X:</span><span id="posX" class="font-medium">30.45</span></div>
            <div class="flex items-center justify-between py-0.5"><span>位置 Y:</span><span id="posY" class="font-medium">10.78</span></div>
            <div class="flex items-center justify-between py-0.5"><span>速度:</span><span id="speed" class="font-medium">0.45 m/s</span></div>
            <div class="flex items-center justify-between py-0.5"><span>角速度:</span><span id="angular-velocity" class="font-medium">0.12 °/s</span></div>
            <div class="flex items-center justify-between py-0.5"><span>电流:</span><span id="current" class="font-medium">2.35 A</span></div>
            <div class="flex items-center justify-between py-0.5"><span>电压:</span><span id="voltage" class="font-medium">23.75 V</span></div>
            <div class="flex items-center justify-between py-0.5"><span>里程:</span><span id="mileage" class="font-medium">125.90 km</span></div>
          </div>
        </div>

        <div class="p-3 border-b border-gray-200">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs text-gray-dark flex items-center gap-1"><i class="fa fa-battery-three-quarters text-success"></i>电池</span>
            <span id="batteryText" class="text-xs font-medium text-gray-dark">{{ battery }}%</span>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div id="batteryBar" :class="battery < 20 ? 'bg-danger' : (battery <50 ? 'bg-warning' : 'bg-success')" class="h-full transition-all duration-300" :style="{ width: battery + '%' }"></div>
          </div>
          <div class="mt-2">
            <div class="flex items-center justify-between mb-1 text-xs"><span class="text-gray-dark">
              地图匹配度:
                      <span class="text-warning cursor-help" title="表示当前位置与地图的匹配程度，数值越高定位越准确">!</span>
                    </span><span id="map-match" class="font-medium text-success">95%</span></div>
            
            <div class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-success" style="width:95%"></div>
            </div>
          </div>
        </div>

        <div class="p-3 border-b border-gray-200">
          <h3 class="text-xs font-semibold text-gray-dark mb-2">底盘状态</h3>
          <div class="space-y-1.5 text-xs">
            <div class="flex items-center justify-between py-0.5"><span>底盘:</span><span id="chassis-status" class="font-medium text-success">导航中</span></div>
            <div class="flex items-center justify-between py-0.5"><span>电池温度:</span><span id="battery-temp" class="font-medium">35°C</span></div>
            <div class="flex items-center justify-between py-0.5"><span>运行时间:</span><span id="uptime" class="font-medium">2:21:16</span></div>
            <div class="flex items-center justify-between py-0.5"><span>错误代码:</span><span id="error-code" class="font-medium text-success">0</span></div>
          </div>
        </div>

        <div class="p-3 border-b border-gray-200">
          <!-- WASD键盘控制 -->
              <div>
                <h4 class="text-sm font-semibold text-dark mb-3">
                  WASD键盘控制
                </h4>
                <div class="grid grid-cols-3 gap-1 w-28 mx-auto">
                  <div></div>
                  <button
                    class="w-10 h-10 bg-white border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-center font-medium"
                  >
                    W
                  </button>
                  <div></div>
                  <button
                    class="w-10 h-10 bg-white border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-center font-medium"
                  >
                    A
                  </button>
                  <button
                    class="w-10 h-10 bg-white border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-center font-medium"
                  >
                    S
                  </button>
                  <button
                    class="w-10 h-10 bg-white border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-center font-medium"
                  >
                    D
                  </button>
                  <div></div>
                  <button
                    class="w-10 h-10 bg-gray-100 border border-gray-200 rounded flex items-center justify-center"
                  >
                    <i class="fa fa-stop text-gray-400"></i>
                  </button>
                  <div></div>
                </div>
              </div>
        </div>

        <div class="flex-1 flex flex-col min-h-0">
          <div class="p-3 flex-1 overflow-y-auto">
            <h3 class="text-xs font-semibold text-gray-dark mb-2 flex items-center gap-1">
              <i class="fa fa-history text-primary"></i>操作日志
            </h3>
            <div class="space-y-1 text-xs">
              <div class="text-gray-500"><span class="text-gray-deep">[14:35:20]</span> 任务开始执行</div>
              <div class="text-gray-500"><span class="text-gray-deep">[14:34:45]</span> 到达导航点2</div>
              <div class="text-gray-500"><span class="text-gray-deep">[14:34:00]</span> 路径规划完成</div>
            </div>
          </div>
          <div class="p-3 border-t border-gray-200 text-xs text-gray-deep">
            <span>AGV状态:正常 | 任务:执行中</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainPage',
  data() {
    return {
      taskManageOpen: false,
      mapManageOpen: false,
      carX: 280,
      carY: 250,
      carRotation: 0,
      battery: 82,
      runSeconds: 2 * 3600 + 21 * 60 + 16,
      totalMileage: 125.9,
      currentPointIndex: 0,
      pathPoints: [
        { x: 280, y: 250, targetRotation: 180 },
        { x: 280, y: 450, targetRotation: 90 },
        { x: 380, y: 450, targetRotation: 0 },
        { x: 220, y: 250, targetRotation: 180 },
      ],
      chassisStates: ['空闲', '导航', '充电', '急停', '异常'],
      currentChassisState: 0,
      intervalId: null,
    };
  },
  mounted() {
    this.startDataUpdates();
  },
  beforeUnmount() {
    this.stopDataUpdates();
  },
  methods: {
    toggleTaskManage() {
      this.taskManageOpen = !this.taskManageOpen;
    },
    toggleMapManage() {
      this.mapManageOpen = !this.mapManageOpen;
    },
    startDataUpdates() {
      this.intervalId = setInterval(() => {
        const target = this.pathPoints[this.currentPointIndex];
        if (target) {
          const dx = target.x - this.carX;
          const dy = target.y - this.carY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 2) {
            const moveSpeed = 1;
            this.carX += (dx / dist) * moveSpeed;
            this.carY += (dy / dist) * moveSpeed;
            
            const targetAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
            let angleDiff = targetAngle - this.carRotation;
            
            while (angleDiff > 180) angleDiff -= 360;
            while (angleDiff < -180) angleDiff += 360;
            
            if (Math.abs(angleDiff) > 1) {
              this.carRotation += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), 3);
            }

            const posX = document.getElementById("posX");
            const posY = document.getElementById("posY");
            const mileage = document.getElementById("mileage");
            if (posX) posX.textContent = ((this.carX - 100) * 0.1 + 30).toFixed(2);
            if (posY) posY.textContent = ((this.carY - 200) * 0.1 + 10).toFixed(2);

            this.totalMileage += 0.001;
            if (mileage) mileage.textContent = this.totalMileage.toFixed(1) + " km";
          } else {
            this.currentPointIndex = (this.currentPointIndex + 1) % this.pathPoints.length;
            const nextTarget = this.pathPoints[this.currentPointIndex];
            this.carRotation = nextTarget.targetRotation;
          }
        }

        this.battery -= 0.01;
        const speed = document.getElementById("speed");
        const angularVelocity = document.getElementById("angular-velocity");
        const current = document.getElementById("current");
        const voltage = document.getElementById("voltage");
        const mapMatch = document.getElementById("map-match");
        const chassisStatus = document.getElementById("chassis-status");
        const batteryTemp = document.getElementById("battery-temp");
        const errorCode = document.getElementById("error-code");
        const uptime = document.getElementById("uptime");

        if (current) current.textContent = (2.3 + Math.random() * 0.2).toFixed(1) + " A";
        if (voltage) voltage.textContent = (23.7 + Math.random() * 0.2).toFixed(1) + " V";
        if (speed) speed.textContent = (0.4 + Math.random() * 0.1).toFixed(1) + " m/s";
        if (angularVelocity) angularVelocity.textContent = (Math.random() * 2 - 1).toFixed(1) + "°/s";
        if (mapMatch) mapMatch.textContent = (90 + Math.random() * 10).toFixed(0) + "%";
        if (batteryTemp) batteryTemp.textContent = (35 + Math.random() * 10).toFixed(0) + "°C";
        if (errorCode) {
          errorCode.textContent = Math.random() > 0.9 ? Math.floor(Math.random() * 100) : 0;
          errorCode.className = errorCode.textContent === "0" ? "font-medium text-success" : "font-medium text-danger";
        }

        if (Math.random() < 0.01) {
          this.currentChassisState = Math.floor(Math.random() * this.chassisStates.length);
          if (chassisStatus) {
            chassisStatus.textContent = this.chassisStates[this.currentChassisState];
            chassisStatus.className = "font-medium text-success";
          }
        }

        this.runSeconds++;
        if (uptime) {
          const hours = Math.floor(this.runSeconds / 3600);
          const minutes = Math.floor((this.runSeconds % 3600) / 60);
          const secs = this.runSeconds % 60;
          uptime.textContent = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }

      }, 1000);
    },
    stopDataUpdates() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  }
};
</script>
