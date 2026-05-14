import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import { useNavigation } from '../context/NavigationContext'
import { useLang } from '../context/LanguageContext'

// ── Setting items ─────────────────────────────────────────────────────────

const SETTINGS_ITEMS = [
  {
    id: 'general',
    label: '通用',
    labelEn: 'General',
    description: '语言、显示与界面偏好设置',
    descriptionEn: 'Language, display and interface preferences',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'bg-slate-100 text-slate-600',
    page: null,
  },
  {
    id: 'account',
    label: '账号设置',
    labelEn: 'Account Settings',
    description: '个人资料、密码与通知偏好',
    descriptionEn: 'Profile, password and notification preferences',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: 'bg-blue-50 text-blue-600',
    page: null,
  },
  {
    id: 'permissions',
    label: '权限管理',
    labelEn: 'Permissions',
    description: '配置部门与成员的功能、菜单、数据及操作权限',
    descriptionEn: 'Configure department and member feature, menu, data and action permissions',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'bg-violet-50 text-violet-600',
    page: 'settings-permissions' as const,
  },
  {
    id: 'about',
    label: '关于',
    labelEn: 'About',
    description: 'PDM Portal 版本信息、更新日志与技术支持',
    descriptionEn: 'PDM Portal version info, changelog and support',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-emerald-50 text-emerald-600',
    page: null,
  },
]

// ── Component ─────────────────────────────────────────────────────────────

export default function SettingsIndexPage() {
  const { navigate } = useNavigation()
  const { lang } = useLang()

  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar />

      <div className="flex">
        <Sidebar topOffset={56} />

        <div className="flex-1 min-w-0 px-6 py-5">

          {/* Breadcrumb */}
          <p className="text-xs text-slate-400 mb-5">
            <span className="text-slate-600 font-medium">Settings</span>
          </p>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">{lang === 'en' ? 'Settings' : '设置'}</h1>
            <p className="text-sm text-slate-500 mt-1">{lang === 'en' ? 'Manage system preferences, account information and permission settings' : '管理系统偏好、账号信息与权限配置'}</p>
          </div>

          {/* Settings list */}
          <div className="max-w-2xl space-y-3">
            {SETTINGS_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => item.page ? navigate(item.page) : undefined}
                disabled={!item.page}
                className={`w-full bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-4
                  flex items-center gap-4 text-left transition-all duration-150
                  ${item.page
                    ? 'hover:shadow-md hover:border-blue-300 cursor-pointer'
                    : 'cursor-default opacity-60'
                  }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  {item.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{lang === 'en' ? item.labelEn : item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{lang === 'en' ? item.descriptionEn : item.description}</p>
                </div>

                {/* Arrow */}
                {item.page ? (
                  <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                ) : (
                  <span className="text-[10px] text-slate-300 font-medium flex-shrink-0">{lang === 'en' ? 'Coming Soon' : '即将推出'}</span>
                )}
              </button>
            ))}
          </div>

          {/* Version info */}
          <p className="mt-8 text-xs text-slate-300">PDM Portal · v5.0 · © 2025 Paramont Group</p>
        </div>
      </div>
    </div>
  )
}
