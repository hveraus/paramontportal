import { useState, useCallback } from 'react'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import { useNavigation } from '../context/NavigationContext'
import {
  ORG_TREE,
  PERM_CONFIGS,
  COMPANY_DEFAULTS,
  MODULE_FEATURES,
  MENU_ITEMS,
  BUTTON_ACTIONS,
  BUTTON_MODULES,
  findNode,
  getDeptName,
  computeEffective,
  type OrgNode,
  type NodePermConfig,
  type PermVal,
  type DataScope,
} from '../mock/orgTree'

// ── Deep clone ────────────────────────────────────────────────────────────────

function deepClone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val))
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconBuilding() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}
function IconDeptUsers() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
function IconPerson() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}
function IconChevronRight({ open }: { open: boolean }) {
  return (
    <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
function IconInfo() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function IconSearch() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

// ── TriSwitch ─────────────────────────────────────────────────────────────────

interface TriSwitchProps {
  value: PermVal
  onChange: (v: PermVal) => void
  inheritedFrom?: string
  inheritedSource?: string
  allowInherit?: boolean
  disabled?: boolean
}

function TriSwitch({ value, onChange, inheritedFrom, inheritedSource = '上级部门配置', allowInherit = true, disabled }: TriSwitchProps) {
  const cycle = () => {
    if (disabled) return
    if (!allowInherit) {
      onChange(value === true ? false : true)
      return
    }
    if (value === true) onChange(false)
    else if (value === false) onChange('inherit')
    else onChange(true)
  }

  const isInherit = value === 'inherit'
  const isTrue = value === true

  return (
    <div className="relative group inline-flex">
      <button
        onClick={cycle}
        title={allowInherit && isInherit && inheritedFrom ? `继承来源：${inheritedSource}（${inheritedFrom}）` : undefined}
        disabled={disabled}
        className={`relative inline-flex items-center w-9 h-5 rounded-full transition-colors focus:outline-none
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isInherit
            ? 'bg-green-500'
            : isTrue
              ? 'bg-blue-500'
              : 'bg-slate-200'
          }`}
      >
        <span
          className={`inline-block w-3 h-3 rounded-full shadow transition-transform
            ${isInherit
              ? 'bg-white translate-x-3'
              : isTrue
                ? 'bg-white translate-x-5'
                : 'bg-white translate-x-1'
            }`}
        />
      </button>
      {allowInherit && isInherit && inheritedFrom && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-50 pointer-events-none">
          <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            继承来源：{inheritedSource} · {inheritedFrom}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Org Tree Component ────────────────────────────────────────────────────────

interface OrgTreeNodeProps {
  node: OrgNode
  selectedId: string | null
  onSelect: (id: string) => void
  searchText: string
  defaultExpanded?: boolean
}

function OrgTreeNode({ node, selectedId, onSelect, searchText, defaultExpanded }: OrgTreeNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? node.type === 'department')

  const matchesSearch = !searchText || node.name.toLowerCase().includes(searchText.toLowerCase())
  const hasMatchingChildren = node.children?.some(c =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  )

  if (searchText && !matchesSearch && !hasMatchingChildren) return null

  const isActive = selectedId === node.id
  const hasChildren = node.children && node.children.length > 0

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setExpanded(p => !p)
          onSelect(node.id)
        }}
        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition-colors text-sm group
          ${isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-slate-700 hover:bg-slate-50'
          }`}
      >
        {/* Expand chevron for nodes with children */}
        {hasChildren ? (
          <span
            className={`flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-300'}`}
            onClick={e => { e.stopPropagation(); setExpanded(p => !p) }}
          >
            <IconChevronRight open={expanded} />
          </span>
        ) : (
          <span className="w-3 flex-shrink-0" />
        )}

        {/* Icon */}
        <span className={`flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>
          {node.type === 'company' ? <IconBuilding /> :
           node.type === 'department' ? <IconDeptUsers /> :
           <IconPerson />}
        </span>

        {/* Name + role */}
        <div className="flex-1 min-w-0">
          <span className={`block truncate font-medium text-xs ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
            {node.name}
          </span>
          {node.role && (
            <span className={`block truncate text-[10px] ${isActive ? 'text-blue-400' : 'text-slate-400'}`}>
              {node.role}
            </span>
          )}
        </div>

        {/* hasCustomConfig badge */}
        {node.hasCustomConfig && (
          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-400" title="已配置自定义权限" />
        )}
      </button>

      {hasChildren && expanded && (
        <div className="ml-4 pl-2 border-l border-slate-100 mt-0.5 space-y-0.5">
          {node.children!.map(child => (
            <OrgTreeNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              searchText={searchText}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Tab: Feature Permissions ──────────────────────────────────────────────────

interface FeatureTabProps {
  config: NodePermConfig
  onChange: (config: NodePermConfig) => void
  nodeType: 'company' | 'department' | 'user' | 'role'
  deptName?: string
}

const FEATURE_MATRIX = [
  {
    key: 'portal',
    label: '门户应用',
    features: [
      { key: 'overview', label: 'Overview' },
      { key: 'browseByCategory', label: 'Browse by Category' },
      { key: 'ourBrands', label: 'Our Brands' },
      { key: 'hotProducts', label: 'Hot Products' },
      { key: 'recentlyViewed', label: 'Recently Viewed' },
      { key: 'myFavorites', label: 'My Favorites' },
      { key: 'recentlyUpdated', label: 'Recently Updated' },
    ],
  },
  {
    key: 'pdm',
    label: '产品信息管理',
    features: [
      { key: 'basic', label: '基础信息' },
      { key: 'specs', label: 'Specs' },
      { key: 'packaging', label: 'Packaging' },
      { key: 'quality', label: '质量信息' },
      { key: 'cost', label: '成本信息' },
      { key: 'patent', label: '专利信息' },
      { key: 'cert', label: '认证信息' },
      { key: 'customs', label: '报关信息' },
      { key: 'gallery', label: 'Gallery' },
    ],
  },
] as const

function FeatureTab({ config, onChange, nodeType, deptName }: FeatureTabProps) {
  const isRole = nodeType === 'role'
  const inheritedFrom = nodeType === 'user'
    ? (deptName ?? '所属部门')
    : nodeType === 'department'
      ? '公司'
      : undefined

  const handleChange = (mod: string, feat: string, val: PermVal) => {
    const next = deepClone(config)
    if (!next.feature[mod]) next.feature[mod] = {}
    next.feature[mod][feat] = val
    onChange(next)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 w-28">模块</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-slate-500">子功能</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 w-56">当前配置对象</th>
            {!isRole && (
              <th className="text-center py-2 px-3 text-xs font-medium text-slate-500 w-36">继承自部门</th>
            )}
          </tr>
        </thead>
        <tbody>
          {FEATURE_MATRIX.map(mod => (
            <>
              {mod.features.map((feature, idx) => {
                const rawVal = config.feature[mod.key]?.[feature.key] ?? false
                const val = isRole && rawVal === 'inherit' ? false : rawVal
                const stateLabel = val === true ? '开启' : val === false ? '关闭' : '继承'
                const stateClass = val === true
                  ? 'bg-blue-50 text-blue-700'
                  : val === false
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-green-50 text-green-700'

                return (
                  <tr key={`${mod.key}-${feature.key}`} className="border-b border-slate-50 hover:bg-slate-50/40">
                    <td className="px-3 py-2 text-xs text-slate-700 font-medium">
                      {idx === 0 ? mod.label : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-700">{feature.label}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] text-slate-500 truncate">feature.{mod.key}.{feature.key}</p>
                          <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${stateClass}`}>
                            {stateLabel}
                          </span>
                        </div>
                        <TriSwitch
                          value={val}
                          onChange={v => handleChange(mod.key, feature.key, v)}
                          inheritedFrom={inheritedFrom}
                          inheritedSource="上级部门配置"
                          allowInherit={!isRole}
                        />
                      </div>
                    </td>
                    {!isRole && (
                      <td className="px-3 py-2 text-center">
                        <span className="text-xs text-slate-400">
                          {val === 'inherit' ? (inheritedFrom ?? '—') : '—'}
                        </span>
                      </td>
                    )}
                  </tr>
                )
              })}
              <tr className="h-1.5 bg-slate-50/40"><td colSpan={isRole ? 3 : 4} /></tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Tab: Role Permissions (Org only) ─────────────────────────────────────────

interface RolePermissionTabProps {
  nodeType: 'company' | 'department' | 'user'
  roles: RoleItem[]
  selectedRoleIds: string[]
  onChange: (roleIds: string[]) => void
}

function RolePermissionTab({ nodeType, roles, selectedRoleIds, onChange }: RolePermissionTabProps) {
  if (nodeType === 'company') {
    return (
      <div className="px-5 py-6 text-center text-slate-400">
        <p className="text-sm text-slate-500">公司节点不支持角色勾选</p>
        <p className="text-xs mt-1">请选择部门或个人进行角色权限配置</p>
      </div>
    )
  }

  const toggleRole = (roleId: string) => {
    const next = selectedRoleIds.includes(roleId)
      ? selectedRoleIds.filter(id => id !== roleId)
      : [...selectedRoleIds, roleId]
    onChange(next)
  }

  return (
    <div className="px-5 py-4">
      <p className="text-xs text-slate-500 mb-3">可为当前{nodeType === 'user' ? '人员' : '部门'}勾选一个或多个角色</p>
      <div className="space-y-2">
        {roles.map(role => (
          <label key={role.id} className="flex items-center justify-between gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{role.name}</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">{role.description}</p>
            </div>
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selectedRoleIds.includes(role.id) ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white'}`}
              onClick={e => {
                e.preventDefault()
                toggleRole(role.id)
              }}
            >
              {selectedRoleIds.includes(role.id) && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

// ── Tab: Menu Permissions ─────────────────────────────────────────────────────

interface MenuTabProps {
  config: NodePermConfig
  onChange: (config: NodePermConfig) => void
  nodeType: 'company' | 'department' | 'user' | 'role'
  deptName?: string
}

type MenuItem = { id: string; label: string; children: MenuItem[] }

function MenuItemRow({
  item, config, onChange, depth, deptName, allowInherit
}: {
  item: MenuItem
  config: NodePermConfig
  onChange: (config: NodePermConfig) => void
  depth: number
  deptName?: string
  allowInherit: boolean
}) {
  const rawVal = config.menu[item.id] ?? false
  const val = !allowInherit && rawVal === 'inherit' ? false : rawVal

  const handleParentChange = (nextVal: PermVal) => {
    const next = deepClone(config)
    next.menu[item.id] = nextVal
    for (const c of item.children) next.menu[c.id] = nextVal
    onChange(next)
  }

  const handleChildChange = (childId: string, nextVal: PermVal) => {
    const next = deepClone(config)
    next.menu[childId] = nextVal
    onChange(next)
  }

  return (
    <div>
      {/* Parent row */}
      <div
        className="flex items-center justify-between gap-3 px-3 py-1.5 hover:bg-slate-50 rounded-lg"
        style={{ paddingLeft: `${12 + depth * 20}px` }}
      >
        <div className="min-w-0 flex items-center gap-2">
          <span className="text-xs text-slate-700 font-medium">{item.label}</span>
        </div>
        <TriSwitch
          value={val}
          onChange={v => handleParentChange(v)}
          inheritedFrom={deptName}
          inheritedSource="上级部门菜单权限"
          allowInherit={allowInherit}
        />
      </div>
      {/* Children */}
      {item.children.map(child => (
        <div
          key={child.id}
          className="flex items-center justify-between gap-3 px-3 py-1.5 hover:bg-slate-50 rounded-lg"
          style={{ paddingLeft: `${12 + (depth + 1) * 20}px` }}
        >
          <div className="min-w-0 flex items-center gap-2">
            <span className="text-xs text-slate-600">{child.label}</span>
          </div>
          <TriSwitch
            value={!allowInherit && (config.menu[child.id] ?? false) === 'inherit' ? false : (config.menu[child.id] ?? false)}
            onChange={v => handleChildChange(child.id, v)}
            inheritedFrom={deptName}
            inheritedSource="上级部门菜单权限"
            allowInherit={allowInherit}
          />
        </div>
      ))}
    </div>
  )
}

function MenuTab({ config, onChange, nodeType, deptName }: MenuTabProps) {
  const allowInherit = nodeType !== 'role'

  return (
    <div className="space-y-1 py-2">
      {(MENU_ITEMS as MenuItem[]).map(item => (
        <MenuItemRow
          key={item.id}
          item={item}
          config={config}
          onChange={onChange}
          depth={0}
          deptName={nodeType === 'user' ? deptName : undefined}
          allowInherit={allowInherit}
        />
      ))}
    </div>
  )
}

// ── Tab: Data Permissions ─────────────────────────────────────────────────────

const SCOPE_OPTIONS: { value: DataScope; label: string; desc: string; includes: string[] }[] = [
  {
    value: 'public',
    label: '公开数据',
    desc: '仅限公开的产品基础信息',
    includes: ['基础产品信息', '品类信息'],
  },
  {
    value: 'department',
    label: '本部门数据',
    desc: '本部门相关的数据，包含内部记录',
    includes: ['基础产品信息', '品类信息', '质量记录', '内部备注'],
  },
  {
    value: 'all',
    label: '全部数据',
    desc: '全公司所有数据，包含敏感信息',
    includes: ['基础产品信息', '品类信息', '质量记录', '内部备注', '成本数据', '供应商资料'],
  },
  {
    value: 'confidential',
    label: '保密数据',
    desc: '最高权限，包含核心机密',
    includes: ['基础产品信息', '品类信息', '质量记录', '内部备注', '成本数据', '供应商资料', '专利文件', '核心配方'],
  },
]

// ── Tab: Button Permissions ───────────────────────────────────────────────────

interface ButtonTabProps {
  config: NodePermConfig
  onChange: (config: NodePermConfig) => void
  nodeType: 'company' | 'department' | 'user' | 'role'
  deptName?: string
}

const BUTTON_TAB_MODULES = ['产品管理', '样品管理'] as const

function ButtonTab({ config, onChange, nodeType, deptName }: ButtonTabProps) {
  const allowInherit = nodeType !== 'role'

  const handleChange = (mod: string, action: string, val: PermVal) => {
    const next = deepClone(config)
    if (!next.buttons[mod]) next.buttons[mod] = {}
    next.buttons[mod][action] = val
    onChange(next)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 w-20">操作</th>
            {BUTTON_TAB_MODULES.map(mod => (
              <th key={mod} className="text-center py-2 px-2 text-xs font-medium text-slate-500 w-24">
                {mod}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {BUTTON_ACTIONS.map(action => (
            <tr key={action} className="border-b border-slate-50 hover:bg-slate-50/40">
              <td className="px-3 py-2 text-xs text-slate-700 font-medium">{action}</td>
              {BUTTON_TAB_MODULES.map(mod => {
                const rawVal = config.buttons[mod]?.[action] ?? false
                const val = !allowInherit && rawVal === 'inherit' ? false : rawVal
                return (
                  <td key={mod} className="px-2 py-2 text-center">
                    <TriSwitch
                      value={val}
                      onChange={v => handleChange(mod, action, v)}
                      inheritedFrom={nodeType === 'user' ? deptName : undefined}
                      allowInherit={allowInherit}
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Right: Preview Panel ──────────────────────────────────────────────────────

interface PreviewPanelProps {
  mode: 'org' | 'role'
  nodeId: string | null
  configs: Record<string, NodePermConfig>
  roleName?: string
}

function PreviewPanel({ mode, nodeId, configs, roleName }: PreviewPanelProps) {
  if (mode === 'role') {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full text-slate-400">
        <span className="text-sm">权限预览</span>
        <span className="text-xs mt-1">{roleName ? `当前角色：${roleName}` : '请先选择角色'}</span>
      </div>
    )
  }

  if (!nodeId) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full text-slate-400">
        <span className="text-sm">权限预览</span>
        <span className="text-xs mt-1">请先选择节点</span>
      </div>
    )
  }

  const node = findNode(nodeId)
  if (!node) return null

  // Compute effective using latest configs (merge override)
  const effective = computeEffective(nodeId)

  // Determine sources for features
  const deptId = node.type === 'user' ? node.departmentId : null
  const deptName = deptId ? getDeptName(deptId) : null

  const inheritedFeatures: string[] = []
  const overriddenFeatures: string[] = []

  if (node.type === 'user') {
    for (const mod of Object.keys(MODULE_FEATURES)) {
      for (const feat of Object.keys(MODULE_FEATURES[mod].features)) {
        const userVal = configs[nodeId]?.feature[mod]?.[feat] ?? 'inherit'
        if (userVal !== 'inherit') {
          overriddenFeatures.push(`${MODULE_FEATURES[mod].features[feat]}`)
        } else {
          inheritedFeatures.push(`${MODULE_FEATURES[mod].features[feat]}`)
        }
      }
    }
  }

  return (
    <div className="p-4 overflow-y-auto h-full">
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-800">权限预览</p>
        <p className="text-xs text-slate-500 mt-0.5">最终生效权限（并集 + 个人覆盖）</p>
      </div>

      <div className="space-y-4">
        {Object.entries(MODULE_FEATURES).map(([modKey, mod]) => (
          <div key={modKey}>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              {mod.label}
            </p>
            <div className="space-y-1">
              {Object.entries(mod.features).map(([featKey, featLabel]) => {
                const hasIt = effective.feature[modKey]?.[featKey] === true
                return (
                  <div key={featKey} className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${hasIt ? 'bg-green-500' : 'bg-slate-300'}`} />
                    <span className={`text-xs ${hasIt ? 'text-slate-700' : 'text-slate-400'}`}>
                      {featLabel}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Data scope */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">数据权限</p>
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          {SCOPE_OPTIONS.find(o => o.value === effective.dataScope)?.label ?? effective.dataScope}
        </span>
      </div>

      {/* Source analysis */}
      {node.type === 'user' && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">权限来源分析</p>
          <div className="flex flex-wrap gap-1">
            {deptName && inheritedFeatures.length > 0 && (
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                继承自{deptName}
              </span>
            )}
            {overriddenFeatures.length > 0 && (
              <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                个人覆盖
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Dialogs ───────────────────────────────────────────────────────────────────

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  confirmClass,
  onCancel,
  onConfirm,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  confirmClass?: string
  onCancel: () => void
  onConfirm: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-80 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-xs text-slate-600 mb-5">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 rounded-lg text-xs text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-1.5 rounded-lg text-xs text-white transition-colors ${confirmClass ?? 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function CopyToDeptModal({
  open,
  currentDeptId,
  onCancel,
  onConfirm,
}: {
  open: boolean
  currentDeptId: string | null
  onCancel: () => void
  onConfirm: (deptIds: string[]) => void
}) {
  const [selected, setSelected] = useState<string[]>([])

  const depts = ORG_TREE.children?.filter(
    n => n.type === 'department' && n.id !== currentDeptId
  ) ?? []

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-80 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">复制权限到其他部门</h3>
        <p className="text-xs text-slate-500 mb-4">请选择要复制到的目标部门</p>
        <div className="space-y-2 mb-5">
          {depts.map(dept => (
            <label key={dept.id} className="flex items-center gap-2.5 cursor-pointer">
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer
                  ${selected.includes(dept.id) ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}
                onClick={() => toggle(dept.id)}
              >
                {selected.includes(dept.id) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-slate-700">{dept.name}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => { onCancel(); setSelected([]) }}
            className="px-4 py-1.5 rounded-lg text-xs text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => { onConfirm(selected); setSelected([]) }}
            disabled={selected.length === 0}
            className="px-4 py-1.5 rounded-lg text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            确认复制
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {message}
    </div>
  )
}

// ── Main SettingsPage ─────────────────────────────────────────────────────────

interface RoleItem {
  id: string
  name: string
  description: string
  memberCount: number
}

const INITIAL_ROLES: RoleItem[] = [
  { id: 'role-pd-designer', name: 'PD 设计师', description: '负责产品设计和打样流程', memberCount: 6 },
  { id: 'role-sales-manager', name: '销售经理', description: '负责销售跟进与客户沟通', memberCount: 4 },
  { id: 'role-quality-auditor', name: '质量审核员', description: '负责质量检查和问题追踪', memberCount: 3 },
]

function buildRoleConfigs(roles: RoleItem[]) {
  return roles.reduce<Record<string, NodePermConfig>>((acc, role) => {
    acc[role.id] = deepClone(COMPANY_DEFAULTS)
    return acc
  }, {})
}

const ORG_TABS = ['角色权限', '菜单权限', '功能模块权限', '按钮权限']
const ROLE_TABS = ['菜单权限', '功能模块权限', '按钮权限']

export default function SettingsPage() {
  const { navigate } = useNavigation()
  const [leftMode, setLeftMode] = useState<'org' | 'role'>('org')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [configs, setConfigs] = useState<Record<string, NodePermConfig>>(() => deepClone(PERM_CONFIGS))
  const [savedConfigs, setSavedConfigs] = useState<Record<string, NodePermConfig>>(() => deepClone(PERM_CONFIGS))
  const [nodeRoleBindings, setNodeRoleBindings] = useState<Record<string, string[]>>({})
  const [savedNodeRoleBindings, setSavedNodeRoleBindings] = useState<Record<string, string[]>>({})
  const [roles, setRoles] = useState<RoleItem[]>(() => deepClone(INITIAL_ROLES))
  const [roleConfigs, setRoleConfigs] = useState<Record<string, NodePermConfig>>(() => buildRoleConfigs(INITIAL_ROLES))
  const [savedRoleConfigs, setSavedRoleConfigs] = useState<Record<string, NodePermConfig>>(() => buildRoleConfigs(INITIAL_ROLES))
  const [pendingTarget, setPendingTarget] = useState<{ mode: 'org' | 'role'; id: string } | null>(null)
  const [showUnsaved, setShowUnsaved] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showCopyModal, setShowCopyModal] = useState(false)
  const [showDeleteRoleConfirm, setShowDeleteRoleConfirm] = useState(false)
  const [pendingDeleteRoleId, setPendingDeleteRoleId] = useState<string | null>(null)
  const [roleFormMode, setRoleFormMode] = useState<'create' | 'edit' | null>(null)
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null)
  const [roleFormName, setRoleFormName] = useState('')
  const [roleFormDescription, setRoleFormDescription] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')

  const selectedNode = leftMode === 'org' && selectedId ? findNode(selectedId) : null
  const selectedRole = leftMode === 'role' ? roles.find(r => r.id === selectedRoleId) : undefined
  const selectedNodeRoleIds = selectedId ? (nodeRoleBindings[selectedId] ?? []) : []
  const isDirty = leftMode === 'org'
    ? (selectedId
      ? (JSON.stringify(configs[selectedId]) !== JSON.stringify(savedConfigs[selectedId])
        || JSON.stringify(nodeRoleBindings[selectedId] ?? []) !== JSON.stringify(savedNodeRoleBindings[selectedId] ?? []))
      : false)
    : (selectedRoleId ? JSON.stringify(roleConfigs[selectedRoleId]) !== JSON.stringify(savedRoleConfigs[selectedRoleId]) : false)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  const applyTarget = useCallback((target: { mode: 'org' | 'role'; id: string }) => {
    setLeftMode(target.mode)
    if (target.mode === 'org') {
      setSelectedId(target.id)
      setSelectedRoleId(null)
    } else {
      setSelectedRoleId(target.id)
      setSelectedId(null)
    }
    setActiveTab(0)
  }, [])

  const handleSelectTarget = useCallback((target: { mode: 'org' | 'role'; id: string }) => {
    const currentId = leftMode === 'org' ? selectedId : selectedRoleId
    if (target.mode === leftMode && target.id === currentId) return

    if (isDirty) {
      setPendingTarget(target)
      setShowUnsaved(true)
      return
    }

    applyTarget(target)
  }, [applyTarget, isDirty, leftMode, selectedId, selectedRoleId])

  const handleSelectNode = useCallback((id: string) => {
    handleSelectTarget({ mode: 'org', id })
  }, [handleSelectTarget])

  const handleSelectRole = useCallback((id: string) => {
    handleSelectTarget({ mode: 'role', id })
  }, [handleSelectTarget])

  const handleSwitchLeftMode = (mode: 'org' | 'role') => {
    if (mode === 'org') {
      handleSelectTarget({ mode: 'org', id: selectedId ?? ORG_TREE.id })
      return
    }

    const fallbackRoleId = selectedRoleId ?? roles[0]?.id
    if (!fallbackRoleId) {
      setLeftMode('role')
      setSelectedId(null)
      return
    }
    handleSelectTarget({ mode: 'role', id: fallbackRoleId })
  }

  const handleDiscardAndSwitch = () => {
    if (leftMode === 'org' && selectedId) {
      setConfigs(prev => ({ ...prev, [selectedId]: deepClone(savedConfigs[selectedId]) }))
      setNodeRoleBindings(prev => ({ ...prev, [selectedId]: deepClone(savedNodeRoleBindings[selectedId] ?? []) }))
    }
    if (leftMode === 'role' && selectedRoleId) {
      setRoleConfigs(prev => ({ ...prev, [selectedRoleId]: deepClone(savedRoleConfigs[selectedRoleId]) }))
    }

    if (pendingTarget) applyTarget(pendingTarget)

    setShowUnsaved(false)
    setPendingTarget(null)
  }

  const handleSave = () => {
    if (leftMode === 'org') {
      if (!selectedId) return
      setSavedConfigs(prev => ({ ...prev, [selectedId]: deepClone(configs[selectedId]) }))
      setSavedNodeRoleBindings(prev => ({ ...prev, [selectedId]: deepClone(nodeRoleBindings[selectedId] ?? []) }))
    } else {
      if (!selectedRoleId) return
      setSavedRoleConfigs(prev => ({ ...prev, [selectedRoleId]: deepClone(roleConfigs[selectedRoleId]) }))
    }
    showToast('权限已保存')
  }

  const handleReset = () => {
    if (!selectedId) return
    const node = findNode(selectedId)
    if (!node) return
    const deptId = node.departmentId
    // Reset user config to all inherit
    const resetConfig: NodePermConfig = {
      feature: {},
      menu: {},
      dataScope: 'inherit',
      buttons: {},
    }
    // Initialize all features to 'inherit'
    for (const mod of Object.keys(MODULE_FEATURES)) {
      resetConfig.feature[mod] = {}
      for (const feat of Object.keys(MODULE_FEATURES[mod].features)) {
        resetConfig.feature[mod][feat] = 'inherit'
      }
    }
    for (const menuId of Object.keys(savedConfigs[selectedId]?.menu ?? {})) {
      resetConfig.menu[menuId] = 'inherit'
    }
    for (const mod of BUTTON_MODULES) {
      resetConfig.buttons[mod] = {}
      for (const action of BUTTON_ACTIONS) {
        resetConfig.buttons[mod][action] = 'inherit'
      }
    }
    setConfigs(prev => ({ ...prev, [selectedId]: resetConfig }))
    setSavedConfigs(prev => ({ ...prev, [selectedId]: resetConfig }))
    setShowResetConfirm(false)
    showToast('已重置为部门默认权限')
    void deptId // suppress unused warning
  }

  const handleCopyToDept = (targetDeptIds: string[]) => {
    if (!selectedId) return
    const source = deepClone(configs[selectedId])
    setConfigs(prev => {
      const next = { ...prev }
      for (const id of targetDeptIds) next[id] = deepClone(source)
      return next
    })
    setSavedConfigs(prev => {
      const next = { ...prev }
      for (const id of targetDeptIds) next[id] = deepClone(source)
      return next
    })
    setShowCopyModal(false)
    showToast(`已复制到 ${targetDeptIds.length} 个部门`)
  }

  const handleConfigChange = (newConfig: NodePermConfig) => {
    if (leftMode === 'org') {
      if (!selectedId) return
      setConfigs(prev => ({ ...prev, [selectedId]: newConfig }))
      return
    }
    if (!selectedRoleId) return
    setRoleConfigs(prev => ({ ...prev, [selectedRoleId]: newConfig }))
  }

  const handleNodeRoleBindingsChange = (roleIds: string[]) => {
    if (!selectedId) return
    setNodeRoleBindings(prev => ({ ...prev, [selectedId]: roleIds }))
  }

  const openCreateRoleForm = () => {
    setRoleFormMode('create')
    setEditingRoleId(null)
    setRoleFormName('')
    setRoleFormDescription('')
  }

  const openEditRoleForm = (role: RoleItem) => {
    setRoleFormMode('edit')
    setEditingRoleId(role.id)
    setRoleFormName(role.name)
    setRoleFormDescription(role.description)
    if (leftMode !== 'role' || selectedRoleId !== role.id) {
      handleSelectRole(role.id)
    }
  }

  const handleSubmitRoleForm = () => {
    const name = roleFormName.trim()
    const description = roleFormDescription.trim()
    if (!name) {
      showToast('角色名称不能为空')
      return
    }

    if (roleFormMode === 'create') {
      const id = `role-${Date.now()}`
      const newRole: RoleItem = {
        id,
        name,
        description: description || '未设置描述',
        memberCount: 0,
      }
      setRoles(prev => [...prev, newRole])
      setRoleConfigs(prev => ({ ...prev, [id]: deepClone(COMPANY_DEFAULTS) }))
      setSavedRoleConfigs(prev => ({ ...prev, [id]: deepClone(COMPANY_DEFAULTS) }))
      setRoleFormMode(null)
      setEditingRoleId(null)
      setRoleFormName('')
      setRoleFormDescription('')
      setLeftMode('role')
      setSelectedId(null)
      setSelectedRoleId(id)
      setActiveTab(0)
      showToast('角色已创建')
      return
    }

    if (roleFormMode === 'edit' && editingRoleId) {
      setRoles(prev => prev.map(role =>
        role.id === editingRoleId
          ? { ...role, name, description: description || '未设置描述' }
          : role
      ))
      setRoleFormMode(null)
      setEditingRoleId(null)
      setRoleFormName('')
      setRoleFormDescription('')
      showToast('角色已更新')
    }
  }

  const handleDeleteRole = (roleId: string) => {
    setPendingDeleteRoleId(roleId)
    setShowDeleteRoleConfirm(true)
  }

  const confirmDeleteRole = () => {
    if (!pendingDeleteRoleId) return

    setRoles(prev => prev.filter(role => role.id !== pendingDeleteRoleId))
    setRoleConfigs(prev => {
      const next = { ...prev }
      delete next[pendingDeleteRoleId]
      return next
    })
    setSavedRoleConfigs(prev => {
      const next = { ...prev }
      delete next[pendingDeleteRoleId]
      return next
    })
    setNodeRoleBindings(prev => {
      const next: Record<string, string[]> = {}
      for (const [nodeId, roleIds] of Object.entries(prev)) {
        next[nodeId] = roleIds.filter(roleId => roleId !== pendingDeleteRoleId)
      }
      return next
    })
    setSavedNodeRoleBindings(prev => {
      const next: Record<string, string[]> = {}
      for (const [nodeId, roleIds] of Object.entries(prev)) {
        next[nodeId] = roleIds.filter(roleId => roleId !== pendingDeleteRoleId)
      }
      return next
    })

    if (selectedRoleId === pendingDeleteRoleId) {
      setSelectedRoleId(null)
    }

    setShowDeleteRoleConfirm(false)
    setPendingDeleteRoleId(null)
    showToast('角色已删除')
  }

  const currentConfig = leftMode === 'org'
    ? (selectedId ? (configs[selectedId] ?? COMPANY_DEFAULTS) : COMPANY_DEFAULTS)
    : (selectedRoleId ? (roleConfigs[selectedRoleId] ?? COMPANY_DEFAULTS) : COMPANY_DEFAULTS)
  const deptId = selectedNode?.type === 'user' ? selectedNode.departmentId : null
  const deptName = deptId ? getDeptName(deptId) : undefined
  const filteredRoles = roles.filter(role => role.name.toLowerCase().includes(searchText.toLowerCase()))
  const tabs = leftMode === 'org' ? ORG_TABS : ROLE_TABS

  // Count members for depts
  const memberCount = selectedNode?.children?.filter(c => c.type === 'user').length ?? 0

  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar />

      <div className="flex" style={{ height: 'calc(100vh - 56px)' }}>

        {/* ── Main sidebar ── */}
        <Sidebar topOffset={56} />

        {/* ── Content: breadcrumb + 3-column layout ── */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* Breadcrumb — same position as Settings index */}
          <div className="px-6 pt-5 pb-3 flex-shrink-0 bg-white border-b border-slate-200">
            <p className="text-xs text-slate-400">
              <button onClick={() => navigate('settings')} className="hover:text-slate-600 transition-colors">Settings</button>
              <span className="mx-1.5">›</span>
              <span className="text-slate-600 font-medium">权限管理</span>
            </p>
          </div>

          {/* ── Permissions 3-column layout ── */}
          <div className="flex flex-1 min-h-0">

        {/* ── Left: Org/Role Panel ── */}
        <div className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <div className="px-3 pt-3 pb-2">
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg mb-2">
              <button
                onClick={() => handleSwitchLeftMode('org')}
                className={`text-xs py-1 rounded-md transition-colors ${leftMode === 'org' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
              >
                组织架构
              </button>
              <button
                onClick={() => handleSwitchLeftMode('role')}
                className={`text-xs py-1 rounded-md transition-colors ${leftMode === 'role' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
              >
                角色管理
              </button>
            </div>

            <div className="flex items-center justify-between px-1 mb-2">
              <p className="text-xs font-semibold text-slate-700">{leftMode === 'org' ? '组织架构' : '角色管理'}</p>
              {leftMode === 'role' && (
                <button
                  onClick={openCreateRoleForm}
                  className="text-[11px] text-blue-600 hover:text-blue-700"
                >
                  + 新增角色
                </button>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                <IconSearch />
              </span>
              <input
                type="text"
                placeholder={leftMode === 'org' ? '搜索成员...' : '搜索角色...'}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg
                           placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30
                           focus:border-blue-400 transition-colors"
              />
            </div>

            {leftMode === 'role' && roleFormMode && (
              <div className="mt-2 p-2 border border-slate-200 rounded-lg bg-slate-50 space-y-1.5">
                <input
                  value={roleFormName}
                  onChange={e => setRoleFormName(e.target.value)}
                  placeholder="角色名称"
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <input
                  value={roleFormDescription}
                  onChange={e => setRoleFormDescription(e.target.value)}
                  placeholder="角色描述"
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => {
                      setRoleFormMode(null)
                      setEditingRoleId(null)
                      setRoleFormName('')
                      setRoleFormDescription('')
                    }}
                    className="px-2 py-1 text-[11px] text-slate-600 border border-slate-200 rounded-md hover:bg-white"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSubmitRoleForm}
                    className="px-2 py-1 text-[11px] text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    {roleFormMode === 'create' ? '创建' : '保存'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
            {leftMode === 'org' ? (
              <OrgTreeNode
                node={ORG_TREE}
                selectedId={selectedId}
                onSelect={handleSelectNode}
                searchText={searchText}
                defaultExpanded
              />
            ) : (
              filteredRoles.map(role => {
                const isActive = selectedRoleId === role.id
                const hasCustomConfig = JSON.stringify(savedRoleConfigs[role.id]) !== JSON.stringify(COMPANY_DEFAULTS)
                return (
                  <div
                    key={role.id}
                    className={`px-2.5 py-2 rounded-lg border transition-colors ${isActive ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  >
                    <button
                      onClick={() => handleSelectRole(role.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>{role.name}</span>
                        {hasCustomConfig && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{role.description}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{role.memberCount} 人</p>
                    </button>
                    <div className="flex gap-2 mt-2 justify-end">
                      <button
                        onClick={() => openEditRoleForm(role)}
                        className="text-[11px] text-slate-500 hover:text-blue-600"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-[11px] text-slate-500 hover:text-red-600"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* ── Middle: Permission Panel ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!selectedId && !selectedRoleId ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <svg className="w-10 h-10 mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm text-slate-500">← 请从左侧选择{leftMode === 'org' ? '部门或人员' : '角色'}</p>
              <p className="text-xs text-slate-400 mt-1">选中后可在此配置权限</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-5 py-4">
                {leftMode === 'role' && selectedRole ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-indigo-700">R</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{selectedRole.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">角色</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedRole.description} · {selectedRole.memberCount} 人</p>
                    </div>
                    <span className="text-slate-300">
                      <IconInfo />
                    </span>
                  </div>
                ) : selectedNode?.type === 'user' ? (
                  <div className="flex items-center gap-3">
                    {/* Avatar initials */}
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-blue-700">
                        {selectedNode.name.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{selectedNode.name}</span>
                        {selectedNode.hasCustomConfig && (
                          <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                            已配置
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedNode.role} · {deptName}
                      </p>
                    </div>
                    <span className="text-slate-300">
                      <IconInfo />
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-slate-600">
                        {selectedNode?.type === 'company' ? <IconBuilding /> : <IconDeptUsers />}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{selectedNode?.name}</span>
                        {selectedNode?.hasCustomConfig && (
                          <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                            已配置
                          </span>
                        )}
                      </div>
                      {selectedNode?.type === 'department' && (
                        <p className="text-xs text-slate-500 mt-0.5">{memberCount} 名成员</p>
                      )}
                    </div>
                    <span className="text-slate-300">
                      <IconInfo />
                    </span>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Tab Bar */}
                <div className="border-b border-slate-200 flex">
                  {tabs.map((tab, i) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(i)}
                      className={`px-5 py-3 text-xs font-medium border-b-2 transition-colors
                        ${activeTab === i
                          ? 'border-blue-600 text-blue-700 bg-blue-50/40'
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-64">
                  {leftMode === 'org' && activeTab === 0 && (
                    <RolePermissionTab
                      nodeType={selectedNode?.type ?? 'department'}
                      roles={roles}
                      selectedRoleIds={selectedNodeRoleIds}
                      onChange={handleNodeRoleBindingsChange}
                    />
                  )}
                  {((leftMode === 'org' && activeTab === 1) || (leftMode === 'role' && activeTab === 0)) && (
                    <MenuTab
                      config={currentConfig}
                      onChange={handleConfigChange}
                      nodeType={leftMode === 'org' ? (selectedNode?.type ?? 'department') : 'role'}
                      deptName={deptName}
                    />
                  )}
                  {((leftMode === 'org' && activeTab === 2) || (leftMode === 'role' && activeTab === 1)) && (
                    <FeatureTab
                      config={currentConfig}
                      onChange={handleConfigChange}
                      nodeType={leftMode === 'org' ? (selectedNode?.type ?? 'department') : 'role'}
                      deptName={deptName}
                    />
                  )}
                  {((leftMode === 'org' && activeTab === 3) || (leftMode === 'role' && activeTab === 2)) && (
                    <ButtonTab
                      config={currentConfig}
                      onChange={handleConfigChange}
                      nodeType={leftMode === 'org' ? (selectedNode?.type ?? 'department') : 'role'}
                      deptName={deptName}
                    />
                  )}
                </div>
              </div>

              {/* Action bar */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-5 py-3 flex items-center gap-3">
                <button
                  onClick={handleSave}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  保存
                </button>
                {leftMode === 'org' && selectedNode?.type === 'user' && (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-5 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    重置为部门默认
                  </button>
                )}
                {leftMode === 'org' && selectedNode?.type === 'department' && (
                  <button
                    onClick={() => setShowCopyModal(true)}
                    className="px-5 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    复制权限到其他部门
                  </button>
                )}
                {isDirty && (
                  <span className="text-xs text-orange-500 ml-auto">有未保存的修改</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Preview Panel ── */}
        <div className="w-72 flex-shrink-0 bg-white border-l border-slate-200 overflow-hidden flex flex-col">
          <PreviewPanel
            mode={leftMode}
            nodeId={leftMode === 'org' ? selectedId : null}
            configs={configs}
            roleName={selectedRole?.name}
          />
        </div>
          </div>{/* end 3-col layout */}
        </div>{/* end content column */}
      </div>{/* end outer flex */}

      {/* Dialogs */}
      <ConfirmDialog
        open={showUnsaved}
        title="是否放弃当前修改？"
        message="当前页有未保存的权限修改，切换后将会丢失这些更改。"
        confirmLabel="放弃修改"
        confirmClass="bg-red-500 hover:bg-red-600"
        onCancel={() => { setShowUnsaved(false); setPendingTarget(null) }}
        onConfirm={handleDiscardAndSwitch}
      />

      <ConfirmDialog
        open={showResetConfirm}
        title="确认重置？"
        message="将清除个人自定义配置，恢复为部门权限。此操作不可撤销。"
        confirmLabel="确认重置"
        confirmClass="bg-red-500 hover:bg-red-600"
        onCancel={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
      />

      <CopyToDeptModal
        open={showCopyModal}
        currentDeptId={selectedNode?.type === 'department' ? selectedId : null}
        onCancel={() => setShowCopyModal(false)}
        onConfirm={handleCopyToDept}
      />

      <ConfirmDialog
        open={showDeleteRoleConfirm}
        title="确认删除角色？"
        message="删除后将移除该角色及其权限配置。此操作不可撤销。"
        confirmLabel="确认删除"
        confirmClass="bg-red-500 hover:bg-red-600"
        onCancel={() => {
          setShowDeleteRoleConfirm(false)
          setPendingDeleteRoleId(null)
        }}
        onConfirm={confirmDeleteRole}
      />

      <Toast message={toast} />
    </div>
  )
}
