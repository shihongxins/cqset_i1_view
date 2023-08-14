export const DevTypeMap = new Map([
  [0, { desc: '未知' }],
  [1, { desc: '枪机' }],
  [2, { desc: '云台' }],
  [3, { desc: '杆塔倾斜' }],
  [4, { desc: '微气象' }],
  [5, { desc: '绝缘子污秽监测' }],
  ['GUN', { desc: '枪机' }],
  ['PTZ', { desc: '云台' }],
  ['tower_tilt', { desc: '杆塔倾斜' }],
  ['micro_meteorology', { desc: '微气象' }],
  ['site_pollution', { desc: '现场污秽' }],
  ['insulator_leakage_current', { desc: '绝缘子串泄露电流数据' }],
]);

/**
 * @param {string} basePath
 * @param {import("axios").AxiosInstance} service
 * @returns
 */
export const useI1CommonAPI = (basePath, service) => {
  if (!basePath) {
    throw new Error('未知 i1 接口基础路径');
  }
  if (!service) {
    throw new Error('必须传入 axios 或 axios 实例');
  }
  /**
   * @typedef {object} I1Dev - i1 设备
   * @property {string} uuid - 设备编号
   * @property {"ALL"|"GUN"|"HALF"|"BALL"|"PTZ"|"UNKNOW"} camera_type - 监控点类型 GUN枪机 HALF半球 BALL-快球 PTZ-云台 UNKNOW-未知
   * @property {string} camera_uuid - 相机UUID
   * @property {string} cmd_id - 状态监测装置 ID
   * @property {string} created_at - 创建时间
   * @property {number} dept_id - 部门
   * @property {string} detail - 电量等详细信息
   * @property {1|2|3|4|5} dev_type - 1图片机2云台 3杆塔倾斜 4微气象 5绝缘子污秽监测
   * @property {number} id
   * @property {string} name - 名称
   * @property {boolean} status - 在线状态
   * @property {number} station_id - 变电站ID
   * @property {number} tower_id - 杆塔ID
   * @property {string} updated_at - 更新时间
   * @property {string} version - 版本信息
   */
  const dev = {
    basePath: basePath + '/dev',
    /**
     * 添加 i1 设备
     * @param {I1Dev} info - i1 设备信息
     */
    add(info = {}) {
      const devInfo = Object.assign(
        {
          dept_id: 0,
          tower_id: 0,
          dev_type: 0,
          cmd_id: 'string',
          name: '',
        },
        info
      );
      if (!(devInfo && (devInfo.station_id || devInfo.tower_id) && devInfo.cmd_id)) {
        return new Error('设备信息不完整');
      }
      return service.post(`${this.basePath}/add`, devInfo).catch((reason) => reason);
    },
    /**
     * 删除 i1 设备
     * @param {I1Dev.cmd_id|string} uuid - i1 设备编号
     */
    del(uuid = '') {
      if (!uuid) {
        return new Error('未知设备编号');
      }
      return service.post(`${this.basePath}/del`, { uuid }).catch((reason) => reason);
    },
    /**
     * @typedef {object} I1DevListParams - i1 设备列表查询参数
     * @property {string} keyword - 搜索关键词(可选)
     * @property {number} page - minimum: 1 *页码(必须)
     * @property {number} size - minimum: 1 *每页条数(必须)
     * @property {"asc"|"desc"} sort - *排序方式(必须)
     * @property {number} station_id - 变电站(可选)
     * @property {number} line_id - 线路(可选)
     * @property {number} tower_id - 杆塔(可选)
     * @property {"ALL"|"GUN"|"HALF"|"BALL"|"PTZ"|"UNKNOW"} camera_type - *设备类型 监控点类型 GUN-枪机 HALF-半球 BALL-快球 PTZ-云台 UNKNOW-未知
     * @property {"ALL"|"ONLINE"|"OFFLINE"} status - *是否在线 ALL-所有 ONLINE-在线 OFFLINE-离线
     *
     * @description i1 设备列表
     * @param {I1DevListParams} query
     */
    async list(query = {}) {
      const reqData = Object.assign(
        {
          keyword: '',
          page: 1,
          size: 1,
          sort: 'asc',
          camera_type: 'ALL',
          status: 'ALL',
        },
        query
      );
      return service.post(`${this.basePath}/list`, reqData).catch((reason) => reason);
    },
    /**
     * 修改 i1 设备
     * @param {I1Dev} info - i1 设备信息
     */
    mod(info = {}) {
      const devInfo = Object.assign(
        {
          dept_id: 0,
          tower_id: 0,
          dev_type: 0,
          cmd_id: 'string',
          name: '',
        },
        info
      );
      if (!(devInfo && (devInfo.station_id || devInfo.tower_id) && devInfo.cmd_id)) {
        return new Error('设备信息不完整');
      }
      return service.post(`${this.basePath}/mod`, devInfo).catch((reason) => reason);
    },
  };

  /**
   * @typedef {object} I1DevChannel - i1 设备通道
   * @property {number} channel_no - 通道号
   * @property {I1Dev.cmd_id} cmd_id - 设备号
   * @property {"GUN"|"PTZ"|"tower_tilt"|"micro_meteorology"|"site_pollution"|"insulator_leakage_current"} dev_type - GUN: "枪机",PTZ: "云台",tower_tilt: "杆塔倾斜",micro_meteorology: "微气象",site_pollution: "现场污秽",insulator_leakage_current: "绝缘子串泄露电流数据",
   * @property {string} name - 设备通道名称
   */
  const channel = {
    basePath: basePath + '/dev/channel',
    /**
     * 添加通道
     * @param {I1DevChannel} info - 设备通道信息
     */
    add(info = {}) {
      const channelInfo = Object.assign(
        {
          cmd_id: '',
          channel_no: 0,
          dev_type: '',
          name: '',
        },
        info
      );
      if (!(channelInfo && channelInfo.cmd_id && channelInfo.channel_no)) {
        return new Error('通道信息不完整');
      }
      return service.post(`${this.basePath}/add`, channelInfo).catch((reason) => reason);
    },
    /**
     * 通道列表
     * @param {I1Dev.cmd_id|string} uuid - i1 设备编号
     */
    list(uuid = '') {
      if (!uuid) {
        return new Error('未知设备编号');
      }
      return service.post(`${this.basePath}/list`, { uuid }).catch((reason) => reason);
    },
    /**
     * 删除通道
     * @param {I1DevChannel} info - 设备通道信息
     */
    async del(info = {}) {
      if (!(info && info.cmd_id && info.channel_no)) {
        return new Error('通道信息不完整');
      }
      return service.post(`${this.basePath}/del`, info).catch((reason) => reason);
    },
    /**
     * 修改通道
     * @param {I1DevChannel} info - 设备通道信息
     */
    async mod(info = {}) {
      if (!(info && info.cmd_id && info.channel_no)) {
        return new Error('通道信息不完整');
      }
      return service.post(`${this.basePath}/mod`, info).catch((reason) => reason);
    },
  };

  const upgrade = {
    basePath: basePath + '/dev/upgrade',
    /**
     * @typedef I1DevUpgradeFileListQuery - i1 设备升级文件列表查询参数
     * @property {I1Dev.cmd_id} cmd_id - 设备编号
     * @property {0|1|2|3} dev_file_type - 设备升级文件类型：0：程序升级包，1：系统包，2：补丁,3-智能识别模型
     * @property {1|2} file_type - 升级文件类型: 1通用升级文件,2单个设备
     * @property {1|2} i1_region - I1协议地区版本 1:青海北京智芯 2:国网
     * @property {string} patch_path - 仅针对补丁有效，固定长度
     * @property {string} version - 版本号
     *
     * @param {I1DevUpgradeFileListQuery & { page: number, size: number }} query
     */
    file_list(query = {}) {
      const reqData = {
        params: Object.assign(
          {
            page: 1,
            size: 100,
            cmd_id: '',
            dev_file_type: 0,
            file_type: 0,
            i1_region: 0,
            patch_path: '',
            version: '',
          },
          query
        ),
      };
      if (!reqData.params.cmd_id) {
        return new Error('未知设备');
      }
      return service.get(`${this.basePath}/list`, { ...reqData }).catch((reason) => reason);
    },
  };
  return {
    dev,
    channel,
    upgrade,
  };
};

export default useI1CommonAPI;
