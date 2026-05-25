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

export const MODULE_FEATURES: Record<string, { label: string; labelEn: string; features: Record<string, string>; featuresEn: Record<string, string> }> = {
  portal: {
    label: '门户应用',
    labelEn: 'Portal',
    features: {
      home: '首页展示',
      category: '品类索引',
      preview: '产品预览',
      dashboard: '仪表盘',
    },
    featuresEn: {
      home: 'Homepage',
      category: 'Category Index',
      preview: 'Product Preview',
      dashboard: 'Dashboard',
    },
  },
  pdm: {
    label: '产品信息管理',
    labelEn: 'Product Info',
    features: {
      basic: '基础信息',
      quality: '质量信息',
      cost: '成本信息',
      patent: '专利信息',
      cert: '认证信息',
    },
    featuresEn: {
      basic: 'Basic Info',
      quality: 'Quality',
      cost: 'Cost',
      patent: 'Patents',
      cert: 'Certifications',
    },
  },
  sample: {
    label: '样品管理',
    labelEn: 'Samples',
    features: {
      search: '样品检索',
      location: '样品间位置管理',
    },
    featuresEn: {
      search: 'Sample Search',
      location: 'Sample Room Location',
    },
  },
}

export interface MenuItem {
  id: string
  label: string
  labelEn: string
  children: MenuItem[]
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 'home', label: '首页', labelEn: 'Home', children: [] },
  {
    id: 'products',
    label: '产品',
    labelEn: 'Products',
    children: [
      { id: 'products.list', label: '产品列表', labelEn: 'Product List', children: [] },
      { id: 'products.detail', label: '产品详情', labelEn: 'Product Detail', children: [] },
      { id: 'products.create', label: '新建产品', labelEn: 'Create Product', children: [] },
    ],
  },
  {
    id: 'projects',
    label: '项目',
    labelEn: 'Projects',
    children: [
      { id: 'projects.list', label: '项目列表', labelEn: 'Project List', children: [] },
      { id: 'projects.detail', label: '项目详情', labelEn: 'Project Detail', children: [] },
    ],
  },
  { id: 'clients', label: '客户', labelEn: 'Clients', children: [] },
  {
    id: 'settings',
    label: '设置',
    labelEn: 'Settings',
    children: [
      { id: 'settings.permissions', label: '权限配置', labelEn: 'Permissions', children: [] },
      { id: 'settings.users', label: '用户管理', labelEn: 'User Management', children: [] },
      { id: 'settings.system', label: '系统配置', labelEn: 'System Config', children: [] },
    ],
  },
]

export type FeatureActionPerm = { view: PermVal; edit: PermVal; delete: PermVal }
export type FeaturePerm = Record<string, Record<string, FeatureActionPerm>>
export type MenuPerm = Record<string, PermVal>

export interface NodePermConfig {
  feature: FeaturePerm
  menu: MenuPerm
  dataScope: DataScope
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
      result[mod][feat] = { view: true, edit: true, delete: true }
    }
  }
  return result
}

function makeAllInheritFeature(): FeaturePerm {
  const result: FeaturePerm = {}
  for (const mod of Object.keys(MODULE_FEATURES)) {
    result[mod] = {}
    for (const feat of Object.keys(MODULE_FEATURES[mod].features)) {
      result[mod][feat] = { view: 'inherit', edit: 'inherit', delete: 'inherit' }
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

// Company defaults — minimal access: portal features on, everything else off
export const COMPANY_DEFAULTS: NodePermConfig = {
  feature: {
    portal: {
      home:     { view: true,  edit: false, delete: false },
      category: { view: true,  edit: false, delete: false },
      preview:  { view: true,  edit: false, delete: false },
      dashboard:{ view: false, edit: false, delete: false },
    },
    pdm: {
      basic:   { view: false, edit: false, delete: false },
      quality: { view: false, edit: false, delete: false },
      cost:    { view: false, edit: false, delete: false },
      patent:  { view: false, edit: false, delete: false },
      cert:    { view: false, edit: false, delete: false },
    },
    sample: {
      search:   { view: false, edit: false, delete: false },
      location: { view: false, edit: false, delete: false },
    },
    audit: {
      archive:   { view: false, edit: false, delete: false },
      analytics: { view: false, edit: false, delete: false },
    },
    ai: {
      recommend: { view: false, edit: false, delete: false },
      agent:     { view: false, edit: false, delete: false },
    },
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
}

// Dept configs
const deptCnPdConfig: NodePermConfig = {
  feature: {
    portal: {
      home:     { view: true,  edit: false, delete: false },
      category: { view: true,  edit: false, delete: false },
      preview:  { view: true,  edit: false, delete: false },
      dashboard:{ view: true,  edit: false, delete: false },
    },
    pdm: {
      basic:   { view: true,  edit: true,  delete: false },
      quality: { view: true,  edit: true,  delete: false },
      cost:    { view: false, edit: false, delete: false },
      patent:  { view: false, edit: false, delete: false },
      cert:    { view: true,  edit: true,  delete: false },
    },
    sample: {
      search:   { view: true,  edit: false, delete: false },
      location: { view: false, edit: false, delete: false },
    },
    audit: {
      archive:   { view: false, edit: false, delete: false },
      analytics: { view: false, edit: false, delete: false },
    },
    ai: {
      recommend: { view: true,  edit: false, delete: false },
      agent:     { view: false, edit: false, delete: false },
    },
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
}

const deptUsPdConfig: NodePermConfig = {
  feature: {
    portal: {
      home:     { view: true,  edit: false, delete: false },
      category: { view: true,  edit: false, delete: false },
      preview:  { view: true,  edit: false, delete: false },
      dashboard:{ view: true,  edit: false, delete: false },
    },
    pdm: {
      basic:   { view: true,  edit: true,  delete: false },
      quality: { view: true,  edit: true,  delete: false },
      cost:    { view: false, edit: false, delete: false },
      patent:  { view: true,  edit: false, delete: false },
      cert:    { view: true,  edit: true,  delete: false },
    },
    sample: {
      search:   { view: true,  edit: false, delete: false },
      location: { view: false, edit: false, delete: false },
    },
    audit: {
      archive:   { view: false, edit: false, delete: false },
      analytics: { view: false, edit: false, delete: false },
    },
    ai: {
      recommend: { view: true,  edit: false, delete: false },
      agent:     { view: false, edit: false, delete: false },
    },
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
}

const deptSalesConfig: NodePermConfig = {
  feature: {
    portal: {
      home:     { view: true,  edit: false, delete: false },
      category: { view: true,  edit: false, delete: false },
      preview:  { view: true,  edit: false, delete: false },
      dashboard:{ view: false, edit: false, delete: false },
    },
    pdm: {
      basic:   { view: true,  edit: false, delete: false },
      quality: { view: false, edit: false, delete: false },
      cost:    { view: false, edit: false, delete: false },
      patent:  { view: false, edit: false, delete: false },
      cert:    { view: false, edit: false, delete: false },
    },
    sample: {
      search:   { view: false, edit: false, delete: false },
      location: { view: false, edit: false, delete: false },
    },
    audit: {
      archive:   { view: false, edit: false, delete: false },
      analytics: { view: false, edit: false, delete: false },
    },
    ai: {
      recommend: { view: false, edit: false, delete: false },
      agent:     { view: false, edit: false, delete: false },
    },
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
}

const deptMgmtConfig: NodePermConfig = {
  feature: makeAllTrueFeature(),
  menu: makeMenuPerm(true),
  dataScope: 'all',
}

// User configs
const userSummerConfig: NodePermConfig = {
  feature: {
    ...makeAllInheritFeature(),
    pdm: {
      basic:   { view: 'inherit', edit: 'inherit', delete: 'inherit' },
      quality: { view: 'inherit', edit: 'inherit', delete: 'inherit' },
      cost:    { view: false,     edit: false,     delete: false     },
      patent:  { view: 'inherit', edit: 'inherit', delete: 'inherit' },
      cert:    { view: 'inherit', edit: 'inherit', delete: 'inherit' },
    },
  },
  menu: makeMenuPerm('inherit'),
  dataScope: 'inherit',
}

const userXiaowangConfig: NodePermConfig = {
  feature: {
    ...makeAllInheritFeature(),
    pdm: {
      basic:   { view: 'inherit', edit: 'inherit', delete: 'inherit' },
      quality: { view: 'inherit', edit: 'inherit', delete: 'inherit' },
      cost:    { view: 'inherit', edit: 'inherit', delete: 'inherit' },
      patent:  { view: false,     edit: false,     delete: false     },
      cert:    { view: 'inherit', edit: 'inherit', delete: 'inherit' },
    },
    ai: {
      recommend: { view: true,  edit: false, delete: false },
      agent:     { view: false, edit: false, delete: false },
    },
  },
  menu: makeMenuPerm('inherit'),
  dataScope: 'inherit',
}

const userSarahConfig: NodePermConfig = {
  feature: {
    ...makeAllTrueFeature(),
    audit: {
      archive:   { view: false, edit: false, delete: false },
      analytics: { view: true,  edit: true,  delete: true  },
    },
  },
  menu: {
    ...makeMenuPerm(true),
    'settings': false,
    'settings.permissions': false,
    'settings.users': false,
    'settings.system': false,
  },
  dataScope: 'all',
}

const userWangfangConfig: NodePermConfig = {
  feature: {
    ...makeAllInheritFeature(),
    portal: {
      home:     { view: 'inherit', edit: 'inherit', delete: 'inherit' },
      category: { view: 'inherit', edit: 'inherit', delete: 'inherit' },
      preview:  { view: true,      edit: false,     delete: false     },
      dashboard:{ view: false,     edit: false,     delete: false     },
    },
  },
  menu: makeMenuPerm('inherit'),
  dataScope: 'inherit',
}

const userAlexConfig: NodePermConfig = {
  feature: makeAllTrueFeature(),
  menu: makeMenuPerm(true),
  dataScope: 'all',
}

const userKimiConfig: NodePermConfig = {
  feature: makeAllTrueFeature(),
  menu: makeMenuPerm(true),
  dataScope: 'all',
}

function makeInheritConfig(): NodePermConfig {
  return {
    feature: makeAllInheritFeature(),
    menu: makeMenuPerm('inherit'),
    dataScope: 'inherit',
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
    }
    for (const mod of Object.keys(MODULE_FEATURES)) {
      result.feature[mod] = {}
      for (const feat of Object.keys(MODULE_FEATURES[mod].features)) {
        const v = config.feature[mod]?.[feat] ?? { view: 'inherit', edit: 'inherit', delete: 'inherit' }
        const fallback = COMPANY_DEFAULTS.feature[mod]?.[feat] ?? { view: false, edit: false, delete: false }
        result.feature[mod][feat] = {
          view:   resolveVal(v.view,   fallback.view   as boolean),
          edit:   resolveVal(v.edit,   fallback.edit   as boolean),
          delete: resolveVal(v.delete, fallback.delete as boolean),
        }
      }
    }
    for (const menuId of Object.keys(config.menu)) {
      result.menu[menuId] = resolveVal(config.menu[menuId], COMPANY_DEFAULTS.menu[menuId] as boolean ?? false)
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
  }
  for (const mod of Object.keys(MODULE_FEATURES)) {
    result.feature[mod] = {}
    for (const feat of Object.keys(MODULE_FEATURES[mod].features)) {
      const v = userConfig.feature[mod]?.[feat] ?? { view: 'inherit', edit: 'inherit', delete: 'inherit' }
      const fallback = deptEffective.feature[mod]?.[feat] ?? { view: false, edit: false, delete: false }
      result.feature[mod][feat] = {
        view:   resolveVal(v.view,   fallback.view   as boolean),
        edit:   resolveVal(v.edit,   fallback.edit   as boolean),
        delete: resolveVal(v.delete, fallback.delete as boolean),
      }
    }
  }
  for (const menuId of Object.keys(userConfig.menu)) {
    result.menu[menuId] = resolveVal(userConfig.menu[menuId], deptEffective.menu[menuId] as boolean ?? false)
  }
  return result
}
