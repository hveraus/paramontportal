import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import Breadcrumb from '../components/Breadcrumb'
import { useLang } from '../context/LanguageContext'

export default function ProgramPage() {
  const { lang } = useLang()

  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar />
      <div className="flex max-w-[1440px] mx-auto">
        <Sidebar topOffset={56} />
        <main className="flex-1 min-w-0 px-6 py-5">
          <Breadcrumb crumbs={[
            { label: lang === 'en' ? 'Home' : '首页', href: 'dashboard' },
            { label: lang === 'en' ? 'Program' : '项目' },
          ]} />

          <div className="mt-4 flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-slate-900">
              {lang === 'en' ? 'Program' : '项目管理'}
            </h1>
          </div>

          {/* Placeholder */}
          <div className="bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center py-32 text-slate-400">
            <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
            <p className="text-sm">
              {lang === 'en' ? 'Program management coming soon' : '项目管理功能即将上线'}
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
