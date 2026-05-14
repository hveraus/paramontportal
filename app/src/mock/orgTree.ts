// ── Types ────────────────────────────────────────────────────────────────────

export type PermVal = true | false | 'inherit'
export type DataScope = 'public' | 'department' | 'all' | 'confidential' | 'inherit'

export interface OrgNode {
  id: string
  name: string
  type: 'company' | 'department' | 'user'
  role?: string
  departmentId?: string
  children?: OrgNode[]
  hasCustomConfig?: boolean
}

export const MODULE_FEATURES: Record<string, { label: string; features: Record<string, string> }> = {
  portal: {
    label: '门户应用',
    features: {
      home: '首页展示',
      category: '品类索引',
      preview: '产品预览',
      dashboard: '仪表盘',
    },
  },
  pdm: {
    label: '产品信息管理',
    features: {
      basic: '基础信息',
      quality: '质量信息',
      cost: '成本信息',
      patent: '专利信息',
      cert: '认证信息',
    },
  },
  sample: {
    label: '样品管理',
    features: {
      search: '样品检索',
      location: '样品间位置管理',
    },
  },
}

export const MENU_ITEMS = [
  { id: 'home', label: '首页', children: [] },
  {
    id: 'products',
    label: '产品',
    children: [
      { id: 'products.list', label: '产品列表', children: [] },
      { id: 'products.detail', label: '产品详情', children: [] },
      { id: 'products.create', label: '新建产品', children: [] },
    ],
  },
  {
    id: 'projects',
    label: '项目',
    children: [
      { id: 'projects.list', label: '项目列表', children: [] },
      { id: 'projects.detail', label: '项目详情', children: [] },
    ],
  },
  { id: 'clients', label: '客户', children: [] },
  {
    id: 'settings',
    label: '设置',
    children: [
      { id: 'settings.permissions', label: '权限配置', children: [] },
      { id: 'settings.users', label: '用户管理', children: [] },
      { id: 'settings.system', label: '系统配置', children: [] },
    ],
  },
]

export const BUTTON_ACTIONS = ['查看', '编辑', '删除', '下载', '分享', '导出']
export const BUTTON_MODULES = ['门户', '产品管理', '样品管理', '数据审计']

export type FeaturePerm = Record<string, Record<string, PermVal>>
export type MenuPerm = Record<string, PermVal>
export type ButtonPerm = Record<string, Record<string, PermVal>>

export interface NodePermConfig {
  feature: FeaturePerm
  menu: MenuPerm
  dataScope: DataScope
  buttons: ButtonPerm
}

// ── Org Tree ─────────────────────────────────────────────────────────────────

export const ORG_TREE: OrgNode = {
  id: 'company',
  name: '公司',
  type: 'company',
  children: [
    {
      id: 'dept-cn-pd',
      name: '中国 PD 部门',
      type: 'department',
      hasCustomConfig: true,
      children: [
        {
          id: 'user-summer',
          name: 'Summer',
          type: 'user',
          role: 'PD 设计师',
          departmentId: 'dept-cn-pd',
          hasCustomConfig: true,
        },
        {
          id: 'user-xiali',
          name: '小李',
          type: 'user',
          role: 'PD 设计师',
          departmentId: 'dept-cn-pd',
        },
        {
          id: 'user-xiaowang',
          name: '小王',
          type: 'user',
          role: 'PD 设计师',
          departmentId: 'dept-cn-pd',
          hasCustomConfig: true,
        },
        {
          id: 'user-xiaochen',
          name: '小陈',
          type: 'user',
          role: 'PD 设计师',
          departmentId: 'dept-cn-pd',
        },
        {
          id: 'user-linxiao',
          name: '林晓',
          type: 'user',
          role: '高级设计师',
          departmentId: 'dept-cn-pd',
        },
      ],
    },
    {
      id: 'dept-us-pd',
      name: '美国 PD 部门',
      type: 'department',
      hasCustomConfig: true,
      children: [
        {
          id: 'user-josh',
          name: 'Josh',
          type: 'user',
          role: 'PD 设计师',
          departmentId: 'dept-us-pd',
        },
        {
          id: 'user-mike',
          name: 'Mike',
          type: 'user',
          role: 'PD 设计师',
          departmentId: 'dept-us-pd',
        },
        {
          id: 'user-sarah',
          name: 'Sarah',
          type: 'user',
          role: 'Senior Designer',
          departmentId: 'dept-us-pd',
          hasCustomConfig: true,
        },
        {
          id: 'user-tom',
          name: 'Tom',
          type: 'user',
          role: 'PD 设计师',
          departmentId: 'dept-us-pd',
        },
        {
          id: 'user-emma',
          name: 'Emma',
          type: 'user',
          role: 'PD 设计师',
          departmentId: 'dept-us-pd',
        },
      ],
    },
    {
      id: 'dept-sales',
      name: '销售部门',
      type: 'department',
      hasCustomConfig: true,
      children: [
        {
          id: 'user-zhangwei',
          name: '张伟',
          type: 'user',
          role: '销售经理',
          departmentId: 'dept-sales',
        },
        {
          id: 'user-lina',
          name: '李娜',
          type: 'user',
          role: '销售专员',
          departmentId: 'dept-sales',
        },
        {
          id: 'user-wangfang',
          name: '王芳',
          type: 'user',
          role: '销售专员',
          departmentId: 'dept-sales',
          hasCustomConfig: true,
        },
        {
          id: 'user-zhaoming',
          name: '赵明',
          type: 'user',
          role: '客户经理',
          departmentId: 'dept-sales',
        },
      ],
    },
    {
      id: 'dept-mgmt',
      name: '管理层',
      type: 'department',
      hasCustomConfig: true,
      children: [
        {
          id: 'user-kimi',
          name: 'Kimi',
          type: 'user',
          role: '产品经理',
          departmentId: 'dept-mgmt',
          hasCustomConfig: true,
        },
        {
          id: 'user-alex',
          name: 'Alex',
          type: 'user',
          role: 'COO',
          departmentId: 'dept-mgmt',
          hasCustomConfig: true,
        },
        {
          id: 'user-lizong',
          name: '李总',
          type: 'user',
          role: 'CEO',
          departmentId: 'dept-mgmt',
        },
      ],
    },
  ],
}

// ── Permission Configs ────────────────────────────────────────────────────────

function makeAllTrueFeature(): FeaturePerm {
  const result: FeaturePerm = {}
  for (const mod of Object.keys(MODULE_FEATURES)) {
    result[mod] = {}
    for (const feat of Object.keys(MODULE_FEATURES[mod].features)) {
      result[mod][feat] = true
    }
  }
  return result
}

function makeAllInheritFeature(): FeaturePerm {
  const result: FeaturePerm = {}
  for (const mod of Object.keys(MODULE_FEATURES)) {
    result[mod] = {}
    for (const feat of Object.keys(MODULE_FEATURES[mod].features)) {
      result[mod][feat] = 'inherit'
    }
  }
  return result
}

function makeMenuPerm(val: PermVal): MenuPerm {
  const result: MenuPerm = {}
  result['home'] = val
  result['products'] = val
  result['products.list'] = val
  result['products.detail'] = val
  result['products.create'] = val
  result['projects'] = val
  result['projects.list'] = val
  result['projects.detail'] = val
  result['clients'] = val
  result['settings'] = val
  result['settings.permissions'] = val
  result['settings.users'] = val
  result['settings.system'] = val
  return result
}

function makeButtonPerm(val: PermVal): ButtonPerm {
  const result: ButtonPerm = {}
  for (const mod of BUTTON_MODULES) {
    result[mod] = {}
    for (const action of BUTTON_ACTIONS) {
      result[mod][action] = val
    }
  }
  return result
}

// Company defaults — minimal access: portal features on, everything else off
export const COMPANY_DEFAULTS: NodePermConfig = {
  feature: {
    portal: { home: true, category: true, preview: true, dashboard: false },
    pdm:    { basic: false, quality: false, cost: false, patent: false, cert: false },
    sample: { search: false, location: false },
    audit:  { archive: false, analytics: false },
    ai:     { recommend: false, agent: false },
  },
  menu: {
    home: true,
    products: true,
    'products.list': true,
    'products.detail': true,
    'products.create': false,
    projects: false,
    'projects.list': false,
    'projects.detail': false,
    clients: false,
    settings: false,
    'settings.permissions': false,
    'settings.users': false,
    'settings.system': false,
  },
  dataScope: 'public',
  buttons: {
    '门户':   { 查看: true,  编辑: false, 删除: false, 下载: false, 分享: false, 导出: false },
    '产品管理': { 查看: true,  编辑: false, 删除: false, 下载: false, 分享: false, 导出: false },
    '样品管理': { 查看: false, 编辑: false, 删除: false, 下载: false, 分享: false, 导出: false },
    '数据审计': { 查看: false, 编辑: false, 删除: false, 下载: false, 分享: false, 导出: false },
  },
}

// Dept configs
const deptCnPdConfig: NodePermConfig = {
  feature: {
    portal: { home: true, category: true, preview: true, dashboard: true },
    pdm:    { basic: true, quality: true, cost: false, patent: false, cert: true },
    sample: { search: true, location: false },
    audit:  { archive: false, analytics: false },
    ai:     { recommend: true, agent: false },
  },
  menu: {
    home: true,
    products: true,
    'products.list': true,
    'products.detail': true,
    'products.create': true,
    projects: true,
    'projects.list': true,
    'projects.detail': true,
    clients: false,
    settings: false,
    'settings.permissions': false,
    'settings.users': false,
    'settings.system': false,
  },
  dataScope: 'department',
  buttons: {
    '门户':   { 查看: true, 编辑: false, 删除: false, 下载: true,  分享: true,  导出: false },
    '产品管理': { 查看: true, 编辑: true,  删除: false, 下载: true,  分享: false, 导出: true  },
    '样品管理': { 查看: true, 编辑: false, 删除: false, 下载: false, 分享: false, 导出: false },
    '数据审计': { 查看: false, 编辑: false, 删除: false, 下载: false, 分享: false, 导出: false },
  },
}

const deptUsPdConfig: NodePermConfig = {
  feature: {
    portal: { home: true, category: true, preview: true, dashboard: true },
    pdm:    { basic: true, quality: true, cost: false, patent: true, cert: true },
    sample: { search: true, location: false },
    audit:  { archive: false, analytics: false },
    ai:     { recommend: true, agent: false },
  },
  menu: {
    home: true,
    products: true,
    'products.list': true,
    'products.detail': true,
    'products.create': true,
    projects: true,
    'projects.list': true,
    'projects.detail': true,
    clients: false,
    settings: false,
    'settings.permissions': false,
    'settings.users': false,
    'settings.system': false,
  },
  dataScope: 'department',
  buttons: {
    '门户':   { 查看: true, 编辑: false, 删除: false, 下载: true,  分享: true,  导出: false },
    '产品管理': { 查看: true, 编辑: true,  删除: false, 下载: true,  分享: false, 导出: true  },
    '样品管理': { 查看: true, 编辑: false, 删除: false, 下载: false, 分享: false, 导出: false },
    '数据审计': { 查看: false, 编辑: false, 删除: false, 下载: false, 分享: false, 导出: false },
  },
}

const deptSalesConfig: NodePermConfig = {
  feature: {
    portal: { home: true, category: true, preview: true, dashboard: false },
    pdm:    { basic: true, quality: false, cost: false, patent: false, cert: false },
    sample: { search: false, location: false },
    audit:  { archive: false, analytics: false },
    ai:     { recommend: false, agent: false },
  },
  menu: {
    home: true,
    products: true,
    'products.list': true,
    'products.detail': true,
    'products.create': false,
    projects: false,
    'projects.list': false,
    'projects.detail': false,
    clients: true,
    settings: false,
    'settings.permissions': false,
    'settings.users': false,
    'settings.system': false,
  },
  dataScope: 'public',
  buttons: {
    '门户':   { 查看: true,  编辑: false, 删除: false, 下载: false, 分享: false, 导出: false },
    '产品管理': { 查看: true,  编辑: false, 删除: false, 下载: false, 分享: false, 导出: false },
    '样品管理': { 查看: false, 编辑: false, 删除: false, 下载: false, 分享: false, 导出: false },
    '数据审计': { 查看: false, 编辑: false, 删除: false, 下载: false, 分享: false, 导出: false },
  },
}

const deptMgmtConfig: NodePermConfig = {
  feature: makeAllTrueFeature(),
  menu: makeMenuPerm(true),
  dataScope: 'all',
  buttons: makeButtonPerm(true),
}

// User configs
const userSummerConfig: NodePermConfig = {
  feature: {
    ...makeAllInheritFeature(),
    pdm: { basic: 'inherit', quality: 'inherit', cost: false, patent: 'inherit', cert: 'inherit' },
  },
  menu: makeMenuPerm('inherit'),
  dataScope: 'inherit',
  buttons: makeButtonPerm('inherit'),
}

const userXiaowangConfig: NodePermConfig = {
  feature: {
    ...makeAllInheritFeature(),
    pdm: { basic: 'inherit', quality: 'inherit', cost: 'inherit', patent: false, cert: 'inherit' },
    ai:  { recommend: true, agent: false },
  },
  menu: makeMenuPerm('inherit'),
  dataScope: 'inherit',
  buttons: makeButtonPerm('inherit'),
}

const userSarahConfig: NodePermConfig = {
  feature: {
    ...makeAllTrueFeature(),
    audit: { archive: false, analytics: true },
  },
  menu: {
    ...makeMenuPerm(true),
    'settings': false,
    'settings.permissions': false,
    'settings.users': false,
    'settings.system': false,
  },
  dataScope: 'all',
  buttons: makeButtonPerm(true),
}

const userWangfangConfig: NodePermConfig = {
  feature: {
    ...makeAllInheritFeature(),
    portal: { home: 'inherit', category: 'inherit', preview: true, dashboard: false },
  },
  menu: makeMenuPerm('inherit'),
  dataScope: 'inherit',
  buttons: makeButtonPerm('inherit'),
}

const userAlexConfig: NodePermConfig = {
  feature: makeAllTrueFeature(),
  menu: makeMenuPerm(true),
  dataScope: 'all',
  buttons: makeButtonPerm(true),
}

const userKimiConfig: NodePermConfig = {
  feature: makeAllTrueFeature(),
  menu: makeMenuPerm(true),
  dataScope: 'all',
  buttons: makeButtonPerm(true),
}

function makeInheritConfig(): NodePermConfig {
  return {
    feature: makeAllInheritFeature(),
    menu: makeMenuPerm('inherit'),
    dataScope: 'inherit',
    buttons: makeButtonPerm('inherit'),
  }
}

export const PERM_CONFIGS: Record<string, NodePermConfig> = {
  'company':        COMPANY_DEFAULTS,
  'dept-cn-pd':     deptCnPdConfig,
  'dept-us-pd':     deptUsPdConfig,
  'dept-sales':     deptSalesConfig,
  'dept-mgmt':      deptMgmtConfig,
  'user-summer':    userSummerConfig,
  'user-xiali':     makeInheritConfig(),
  'user-xiaowang':  userXiaowangConfig,
  'user-xiaochen':  makeInheritConfig(),
  'user-linxiao':   makeInheritConfig(),
  'user-josh':      makeInheritConfig(),
  'user-mike':      makeInheritConfig(),
  'user-sarah':     userSarahConfig,
  'user-tom':       makeInheritConfig(),
  'user-emma':      makeInheritConfig(),
  'user-zhangwei':  makeInheritConfig(),
  'user-lina':      makeInheritConfig(),
  'user-wangfang':  userWangfangConfig,
  'user-zhaoming':  makeInheritConfig(),
  'user-kimi':      userKimiConfig,
  'user-alex':      userAlexConfig,
  'user-lizong':    makeInheritConfig(),
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function findNodeInTree(id: string, node: OrgNode): OrgNode | null {
  if (node.id === id) return node
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeInTree(id, child)
      if (found) return found
    }
  }
  return null
}

export function findNode(id: string): OrgNode | null {
  return findNodeInTree(id, ORG_TREE)
}

export function getNodeDeptIds(nodeId: string): string[] {
  const node = findNode(nodeId)
  if (!node) return []
  if (node.type === 'user') return node.departmentId ? [node.departmentId] : []
  if (node.type === 'department') return [node.id]
  return []
}

export function getDeptName(deptId: string): string {
  const node = findNode(deptId)
  return node?.name ?? deptId
}

/** Resolve a single PermVal against a fallback (for inherit resolution) */
function resolveVal(val: PermVal, fallback: boolean): boolean {
  if (val === 'inherit') return fallback
  return val
}

/** Resolve a DataScope against a fallback */
function resolveScope(scope: DataScope, fallback: DataScope): DataScope {
  if (scope === 'inherit') return fallback
  return scope
}

/**
 * Compute effective permissions for a node.
 * For dept: resolve 'inherit' against COMPANY_DEFAULTS.
 * For user: resolve dept config (inherit→company), then apply user overrides.
 */
export function computeEffective(nodeId: string): NodePermConfig {
  const node = findNode(nodeId)
  if (!node) return COMPANY_DEFAULTS

  if (node.type === 'company') return COMPANY_DEFAULTS

  if (node.type === 'department') {
    const config = PERM_CONFIGS[nodeId]
    const result: NodePermConfig = {
      feature: {},
      menu: {},
      dataScope: resolveScope(config.dataScope, COMPANY_DEFAULTS.dataScope),
      buttons: {},
    }
    for (const mod of Object.keys(MODULE_FEATURES)) {
      result.feature[mod] = {}
      for (const feat of Object.keys(MODULE_FEATURES[mod].features)) {
        const v = config.feature[mod]?.[feat] ?? 'inherit'
        result.feature[mod][feat] = resolveVal(v, COMPANY_DEFAULTS.feature[mod]?.[feat] as boolean ?? false)
      }
    }
    for (const menuId of Object.keys(config.menu)) {
      result.menu[menuId] = resolveVal(config.menu[menuId], COMPANY_DEFAULTS.menu[menuId] as boolean ?? false)
    }
    for (const mod of BUTTON_MODULES) {
      result.buttons[mod] = {}
      for (const action of BUTTON_ACTIONS) {
        const v = config.buttons[mod]?.[action] ?? 'inherit'
        result.buttons[mod][action] = resolveVal(v, COMPANY_DEFAULTS.buttons[mod]?.[action] as boolean ?? false)
      }
    }
    return result
  }

  // User node
  const deptId = node.departmentId
  const deptEffective = deptId ? computeEffective(deptId) : COMPANY_DEFAULTS
  const userConfig = PERM_CONFIGS[nodeId]
  const result: NodePermConfig = {
    feature: {},
    menu: {},
    dataScope: resolveScope(userConfig.dataScope, deptEffective.dataScope),
    buttons: {},
  }
  for (const mod of Object.keys(MODULE_FEATURES)) {
    result.feature[mod] = {}
    for (const feat of Object.keys(MODULE_FEATURES[mod].features)) {
      const v = userConfig.feature[mod]?.[feat] ?? 'inherit'
      result.feature[mod][feat] = resolveVal(v, deptEffective.feature[mod]?.[feat] as boolean ?? false)
    }
  }
  for (const menuId of Object.keys(userConfig.menu)) {
    result.menu[menuId] = resolveVal(userConfig.menu[menuId], deptEffective.menu[menuId] as boolean ?? false)
  }
  for (const mod of BUTTON_MODULES) {
    result.buttons[mod] = {}
    for (const action of BUTTON_ACTIONS) {
      const v = userConfig.buttons[mod]?.[action] ?? 'inherit'
      result.buttons[mod][action] = resolveVal(v, deptEffective.buttons[mod]?.[action] as boolean ?? false)
    }
  }
  return result
}
