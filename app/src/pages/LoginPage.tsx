import { useState, useEffect, useRef } from 'react'
import { useNavigation } from '../context/NavigationContext'

// ── QR code generator (deterministic, looks like a real QR) ───────────────

function buildQRMatrix(size = 25): number[][] {
  const m: number[][] = Array.from({ length: size }, () => Array(size).fill(-1))

  // Finder pattern (7×7) at given top-left origin
  const finder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++)
      for (let c = 0; c < 7; c++) {
        const outer = r === 0 || r === 6 || c === 0 || c === 6
        const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4
        m[r0 + r][c0 + c] = outer || inner ? 1 : 0
      }
  }
  finder(0, 0); finder(0, 18); finder(18, 0)

  // Separators (already 0 from fill; mark as 0 explicitly)
  for (let i = 0; i <= 7; i++) {
    m[7][i] = 0; m[i][7] = 0   // TL
    m[7][size - 1 - i] = 0; m[i][size - 8] = 0  // TR
    m[size - 8][i] = 0; m[size - 1 - i][7] = 0  // BL
  }

  // Timing patterns (row 6 / col 6)
  for (let i = 8; i < size - 8; i++) {
    if (m[6][i] === -1) m[6][i] = i % 2
    if (m[i][6] === -1) m[i][6] = i % 2
  }

  // Dark module (format requirement)
  m[size - 8][8] = 1

  // Fill remaining with seeded pseudo-random data
  let seed = 0x5a4d
  const rng = () => { seed ^= seed << 13; seed ^= seed >> 17; seed ^= seed << 5; return (seed >>> 0) % 2 }
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (m[r][c] === -1) m[r][c] = rng()

  return m
}

const QR_MATRIX = buildQRMatrix()

function QRCodeSVG({ dim = 200 }: { dim?: number }) {
  const size = QR_MATRIX.length
  const cell = dim / size
  return (
    <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={dim} height={dim} fill="white" />
      {QR_MATRIX.flatMap((row, r) =>
        row.map((v, c) =>
          v === 1 ? (
            <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#111827" />
          ) : null
        )
      )}
    </svg>
  )
}

// ── Feishu icon (simplified) ──────────────────────────────────────────────

function FeishuIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#1456F0" />
      <path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M11 18 L21 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

// ── Scan status types ─────────────────────────────────────────────────────

type ScanStatus = 'waiting' | 'scanned' | 'confirmed' | 'expired'

// ── Main page ─────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { navigate } = useNavigation()
  const [status, setStatus] = useState<ScanStatus>('waiting')
  const [countdown, setCountdown] = useState(60)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Countdown tick
  useEffect(() => {
    if (status !== 'waiting') return
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { setStatus('expired'); return 0 }
        return c - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [status])

  const refresh = () => {
    setStatus('waiting')
    setCountdown(60)
  }

  const simulateScan = () => {
    if (status !== 'waiting') return
    setStatus('scanned')
    setTimeout(() => {
      setStatus('confirmed')
      setTimeout(() => navigate('dashboard'), 900)
    }, 1600)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #2e1065 100%)' }}
    >
      {/* Subtle dot grid */}
      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Header band */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-slate-100">
            <img
              src={`${import.meta.env.BASE_URL}logo-paramont-global.png`}
              alt="Paramont"
              className="h-28 object-contain mx-auto"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>

          {/* QR section */}
          <div className="px-8 py-7 flex flex-col items-center">
            {/* Title row with Feishu icon */}
            <div className="flex items-center gap-2 mb-5">
              <FeishuIcon size={20} />
              <span className="text-sm font-semibold text-slate-700">飞书扫码登录</span>
            </div>

            {/* QR code container */}
            <div
              className="relative rounded-2xl overflow-hidden cursor-pointer select-none"
              style={{ width: 200, height: 200 }}
              onClick={simulateScan}
            >
              <QRCodeSVG dim={200} />

              {/* Scan-line animation (waiting state) */}
              {status === 'waiting' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div
                    className="absolute left-0 right-0 h-0.5 bg-blue-500 opacity-70"
                    style={{
                      boxShadow: '0 0 8px 2px rgba(59,130,246,0.6)',
                      animation: 'scanLine 2.4s ease-in-out infinite',
                    }}
                  />
                </div>
              )}

              {/* Hover hint */}
              {status === 'waiting' && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/0 hover:bg-white/80 transition-all duration-200 group">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full shadow">
                    点击模拟扫码
                  </span>
                </div>
              )}

              {/* Scanned overlay */}
              {status === 'scanned' && (
                <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">已扫码</p>
                  <p className="text-xs text-slate-400">请在飞书 App 上确认</p>
                </div>
              )}

              {/* Confirmed overlay */}
              {status === 'confirmed' && (
                <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-emerald-700">登录成功</p>
                  <p className="text-xs text-slate-400">正在跳转…</p>
                </div>
              )}

              {/* Expired overlay */}
              {status === 'expired' && (
                <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-600">二维码已过期</p>
                  <button
                    onClick={e => { e.stopPropagation(); refresh() }}
                    className="text-xs text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                  >
                    点击刷新
                  </button>
                </div>
              )}
            </div>

            {/* Instructions + countdown */}
            {status === 'waiting' && (
              <div className="mt-4 text-center space-y-1">
                <p className="text-xs text-slate-500">使用 <span className="font-semibold text-slate-700">飞书 App</span> 扫描上方二维码</p>
                <p className="text-[11px] text-slate-400">
                  二维码将在 <span className="font-mono text-slate-600">{countdown}s</span> 后失效
                </p>
              </div>
            )}
            {status === 'scanned' && (
              <p className="mt-4 text-xs text-blue-600 font-medium">等待飞书 App 确认中…</p>
            )}
            {status === 'expired' && (
              <button
                onClick={refresh}
                className="mt-4 text-xs text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                刷新二维码
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 pb-7 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[11px] text-slate-300 whitespace-nowrap">其他登录方式</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <button
              onClick={() => navigate('dashboard')}
              className="text-xs text-slate-400 hover:text-blue-600 transition-colors font-medium"
            >
              账号密码登录 →
            </button>
          </div>
        </div>

        {/* Below card */}
        <p className="text-center text-[11px] text-white/30 mt-5">
          © 2025 Paramont Global · All rights reserved
        </p>
      </div>

      {/* Scan line keyframe */}
      <style>{`
        @keyframes scanLine {
          0%   { top: 10%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}
