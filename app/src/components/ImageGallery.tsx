import { useState, useRef, useCallback, useEffect } from 'react'
import type { ProductImage } from '../types'

interface Props {
  images: ProductImage[]
}

const IMAGE_TYPES = ['Product Render', 'Packaging Render', 'Reference Images'] as const

export default function ImageGallery({ images }: Props) {
  const [activeId, setActiveId]     = useState(images[0]?.id ?? '')
  const [activeType, setActiveType] = useState<string>('Product Render')
  const [zoom, setZoom]             = useState(1)
  const [panning, setPanning]       = useState(false)
  const [offset, setOffset]         = useState({ x: 0, y: 0 })
  const [fullscreen, setFullscreen] = useState(false)
  const [loadedUrl, setLoadedUrl]   = useState<string>('')
  const panStart                    = useRef<{ x: number; y: number } | null>(null)
  const offsetStart                 = useRef({ x: 0, y: 0 })

  const activeImage = images.find((i) => i.id === activeId) ?? images[0]
  const filteredByType = images.filter((i) => i.type === activeType)

  // reset zoom on image change
  useEffect(() => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }, [activeId])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setZoom((z) => Math.min(4, Math.max(1, z - e.deltaY * 0.001)))
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return
    setPanning(true)
    panStart.current = { x: e.clientX, y: e.clientY }
    offsetStart.current = { ...offset }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!panning || !panStart.current) return
    const dx = e.clientX - panStart.current.x
    const dy = e.clientY - panStart.current.y
    setOffset({ x: offsetStart.current.x + dx, y: offsetStart.current.y + dy })
  }

  const handleMouseUp = () => setPanning(false)

  const typeGroups = IMAGE_TYPES.filter((t) => images.some((i) => i.type === t))

  return (
    <>
      {/* ── Main image area ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div
          className="relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden"
          style={{ aspectRatio: '1 / 1' }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Skeleton */}
          {loadedUrl !== activeImage.url && (
            <div className="absolute inset-0 bg-slate-200 animate-pulse rounded-xl" />
          )}

          <img
            src={activeImage.url}
            alt={activeImage.alt}
            onLoad={() => setLoadedUrl(activeImage.url)}
            className="w-full h-full object-contain transition-transform duration-100 select-none"
            style={{
              transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
              cursor: zoom > 1 ? (panning ? 'grabbing' : 'grab') : 'default',
              opacity: loadedUrl === activeImage.url ? 1 : 0,
            }}
            draggable={false}
          />

          {/* Zoom indicator */}
          {zoom > 1 && (
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {Math.round(zoom * 100)}%
            </div>
          )}

          {/* Top-right actions */}
          <div className="absolute top-3 right-3 flex gap-1.5">
            {zoom > 1 && (
              <button
                onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }) }}
                className="bg-white/90 hover:bg-white border border-slate-200 text-slate-600
                           rounded-lg p-1.5 shadow-sm transition-colors text-xs"
                title="Reset zoom"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003
                       8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setFullscreen(true)}
              className="bg-white/90 hover:bg-white border border-slate-200 text-slate-600
                         rounded-lg p-1.5 shadow-sm transition-colors"
              title="Fullscreen"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11
                     5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            <button
              disabled
              className="bg-white/90 border border-slate-200 text-slate-400 rounded-lg p-1.5
                         shadow-sm cursor-not-allowed opacity-60"
              title="Video playback (coming soon)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832
                     l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          {/* Image type badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {activeImage.type}
            </span>
          </div>

          {/* Zoom hint */}
          <div className="absolute bottom-3 right-3 text-xs text-slate-400 pointer-events-none">
            Scroll to zoom
          </div>
        </div>

        {/* ── Type tabs ──────────────────────────────────────────── */}
        <div className="flex gap-1 border-b border-slate-200">
          {typeGroups.map((type) => (
            <button
              key={type}
              onClick={() => {
                setActiveType(type)
                const first = images.find((i) => i.type === type)
                if (first) setActiveId(first.id)
              }}
              className={`text-xs px-3 py-1.5 rounded-t-md border-b-2 transition-colors
                ${activeType === type
                  ? 'border-blue-600 text-blue-700 font-medium bg-blue-50'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
              {type}
              <span className="ml-1 text-slate-400">
                ({images.filter((i) => i.type === type).length})
              </span>
            </button>
          ))}
        </div>

        {/* ── Thumbnail strip ────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {filteredByType.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveId(img.id)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                ${activeId === img.id
                  ? 'border-blue-500 shadow-md ring-2 ring-blue-200'
                  : 'border-slate-200 hover:border-slate-400'
                }`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── Fullscreen overlay ─────────────────────────────────────── */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            onClick={() => setFullscreen(false)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={activeImage.url}
            alt={activeImage.alt}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {/* Prev / Next in fullscreen */}
          {images.indexOf(activeImage) > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white
                         bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                const idx = images.indexOf(activeImage)
                setActiveId(images[idx - 1].id)
              }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {images.indexOf(activeImage) < images.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white
                         bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                const idx = images.indexOf(activeImage)
                setActiveId(images[idx + 1].id)
              }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  )
}
