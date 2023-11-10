/**
 * @type {import('vue-router').RouteRecord[]}
 */
export const routes = [
  {
    path: 'disaster',
    name: 'JSL_BYNR_Disaster',
    component: () => import('@/views/jsl_byne/Disaster/Devices.vue'),
    meta: {
      text: '地灾监测',
      iconClass: 'uno-icon-fix i-material-symbols:lists-rounded',
      active: false,
    },
  },
  {
    path: 'tower_tilt',
    name: 'JSL_BYNR_TowerTilt',
    component: () => import('@/views/jsl_byne/TowerTilt/Device.vue'),
    meta: {
      text: '杆塔倾斜',
      iconClass: 'uno-icon-fix i-material-symbols:lists-rounded',
      active: false,
    },
  },
];