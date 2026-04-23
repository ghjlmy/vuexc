import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'login', component: () => import('../views/LoginPage.vue') },
  { path: '/main', name: 'main', component: () => import('../views/MainPage.vue') },
  { path: '/create-map', name: 'create-map', component: () => import('../views/CreateMapPage.vue') },
  { path: '/mapping', name: 'mapping', component: () => import('../views/MappingPage.vue') },
  { path: '/map-list', name: 'map-list', component: () => import('../views/MapListPage.vue') },
  { path: '/initial-location', name: 'initial-location', component: () => import('../views/InitialLocationPage.vue') },
  { path: '/point-manage', name: 'point-manage', component: () => import('../views/PointManagePage.vue') },
  { path: '/path-manage', name: 'path-manage', component: () => import('../views/PathManagePage.vue') },
  { path: '/hand-draw-track', name: 'hand-draw-track', component: () => import('../views/HandDrawTrackPage.vue') },
  { path: '/nav-config', name: 'nav-config', component: () => import('../views/NavConfigPage.vue') },
  { path: '/temp-task', name: 'temp-task', component: () => import('../views/TempTaskPage.vue') },
  { path: '/record-pack', name: 'record-pack', component: () => import('../views/RecordPackPage.vue') },
  { path: '/scheduled-task', name: 'scheduled-task', component: () => import('../views/ScheduledTaskPage.vue') },
  { path: '/task-report', name: 'task-report', component: () => import('../views/TaskReportPage.vue') },
  { path: '/system-config', name: 'system-config', component: () => import('../views/SystemConfigPage.vue') },
  { path: '/virtual-wall', name: 'virtual-wall', component: () => import('../views/VirtualWallPage.vue') },
  { path: '/composite-task', name: 'composite-task', component: () => import('../views/CompositeTaskPage.vue') },
  { path: '/create-task', name: 'create-task', component: () => import('../views/CreateTaskPage.vue') },
  { path: '/view-task/:id', name: 'view-task', component: () => import('../views/ViewTaskPage.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
