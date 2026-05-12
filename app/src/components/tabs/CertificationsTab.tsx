import type { CertificationRecord, CertificationType } from '../../types'

const TYPE_STYLE: Record<CertificationType, { bg: string; text: string }> = {
  CE:    { bg: 'bg-blue-50',    text: 'text-blue-700'    },
  FCC:   { bg: 'bg-purple-50',  text: 'text-purple-700'  },
  RoHS:  { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Other: { bg: 'bg-slate-100',  text: 'text-slate-600'   },
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function isExpired(expiryDate: string | null) {
  if (!expiryDate) return false
  return new Date(expiryDate) < new Date()
}

function FileIcon() {
  return (
    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function CertCard({ cert }: { cert: CertificationRecord }) {
  const style = TYPE_STYLE[cert.certType]
  const expired = isExpired(cert.expiryDate)

  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md ${style.bg} ${style.text}`}>
            {cert.certType}
          </span>
          <p className="text-xs font-mono text-slate-600 pt-0.5">{cert.certNumber}</p>
        </div>
        {cert.expiryDate && (
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
            expired ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${expired ? 'bg-red-500' : 'bg-emerald-500'}`} />
            {expired ? 'Expired' : 'Valid'}
          </span>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Cert Date</p>
          <p className="text-sm text-slate-700">{formatDate(cert.certDate)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Expiry Date</p>
          <p className={`text-sm ${expired ? 'text-red-600 font-medium' : 'text-slate-700'}`}>
            {formatDate(cert.expiryDate)}
          </p>
        </div>
      </div>

      {/* Files */}
      {cert.files.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Cert Files</p>
          <div className="space-y-1.5">
            {cert.files.map(file => (
              <a
                key={file.id}
                href={file.url}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
              >
                <FileIcon />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate group-hover:text-blue-700 transition-colors">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400">{file.size} · Uploaded {formatDate(file.uploadedAt)}</p>
                </div>
                <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {cert.files.length === 0 && (
        <p className="text-xs text-slate-300 italic">No files attached</p>
      )}
    </div>
  )
}

export default function CertificationsTab({ certifications }: { certifications: CertificationRecord[] }) {
  if (certifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg className="w-10 h-10 text-slate-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        <p className="text-sm text-slate-400">No certifications on file for this product</p>
      </div>
    )
  }

  const typeCounts = certifications.reduce<Partial<Record<CertificationType, number>>>((acc, c) => {
    acc[c.certType] = (acc[c.certType] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-4 pb-1">
        <span className="text-xs text-slate-400">{certifications.length} certification{certifications.length !== 1 ? 's' : ''}</span>
        <div className="flex items-center gap-2 flex-wrap">
          {(Object.entries(typeCounts) as [CertificationType, number][]).map(([type, count]) => {
            const s = TYPE_STYLE[type]
            return (
              <span key={type} className={`text-xs font-medium px-2 py-0.5 rounded ${s.bg} ${s.text}`}>
                {count} {type}
              </span>
            )
          })}
        </div>
      </div>

      {/* Cert cards */}
      {certifications.map(cert => (
        <CertCard key={cert.id} cert={cert} />
      ))}
    </div>
  )
}
