import React, { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const ScrollArea = ({
  children,
  className,
  viewportClassName,
  scrollbarClassName,
  orientation = 'vertical',
  scrollHideDelay = 1000,
  autoHide = true,
  type = 'hover',
  ...props
}) => {
  const [isScrollable, setIsScrollable] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [showScrollbar, setShowScrollbar] = useState(false)
  const [scrollPos, setScrollPos] = useState(0)
  const [thumbSize, setThumbSize] = useState(20)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartPos, setDragStartPos] = useState(0)
  const [dragStartScroll, setDragStartScroll] = useState(0)

  const rootRef = useRef(null)
  const viewportRef = useRef(null)
  const thumbRef = useRef(null)
  const hideTimer = useRef(null)
  const isVertical = orientation === 'vertical'

  useEffect(() => {
    const checkScrollable = () => {
      if (!viewportRef.current) return

      const { clientWidth, clientHeight, scrollWidth, scrollHeight } = viewportRef.current
      const scrollableDimension = isVertical ? scrollHeight > clientHeight : scrollWidth > clientWidth

      setIsScrollable(scrollableDimension)

      if (isVertical) {
        const ratio = clientHeight / scrollHeight
        setThumbSize(Math.max(ratio * clientHeight, 20))
      } else {
        const ratio = clientWidth / scrollWidth
        setThumbSize(Math.max(ratio * clientWidth, 20))
      }
    }

    checkScrollable()

    const resizeObserver = new ResizeObserver(() => {
      checkScrollable()
    })

    if (viewportRef.current) {
      resizeObserver.observe(viewportRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [isVertical, children])

  const handleScroll = () => {
    if (!viewportRef.current || !isScrollable) return

    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = viewportRef.current
    const scrollPosition = isVertical ? scrollTop / (scrollHeight - clientHeight) : scrollLeft / (scrollWidth - clientWidth)

    setScrollPos(Math.max(0, Math.min(1, scrollPosition)))
    setIsScrolling(true)
    setShowScrollbar(true)

    if (autoHide) {
      clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => {
        if (!isDragging) {
          setShowScrollbar(false)
          setIsScrolling(false)
        }
      }, scrollHideDelay)
    }
  }

  const handleThumbMouseDown = (e) => {
    e.preventDefault()
    e.stopPropagation()

    setIsDragging(true)
    setShowScrollbar(true)

    const thumbRect = thumbRef.current.getBoundingClientRect()
    const clickOffset = isVertical ? e.clientY - thumbRect.top : e.clientX - thumbRect.left

    setDragStartPos(isVertical ? e.clientY - clickOffset : e.clientX - clickOffset)

    if (viewportRef.current) {
      setDragStartScroll(isVertical ? viewportRef.current.scrollTop : viewportRef.current.scrollLeft)
    }

    const handleMouseMove = (e) => {
      if (!viewportRef.current || !rootRef.current) return

      const { scrollHeight, scrollWidth, clientHeight, clientWidth } = viewportRef.current
      const rootRect = rootRef.current.getBoundingClientRect()

      const currentPos = isVertical ? e.clientY : e.clientX
      const rootStart = isVertical ? rootRect.top : rootRect.left
      const rootSize = isVertical ? rootRect.height : rootRect.width

      // Tính toán vị trí relative trong scrollbar track
      const relativePos = (currentPos - rootStart) / rootSize
      const clampedPos = Math.max(0, Math.min(1, relativePos))

      // Tính toán scroll position
      const maxScroll = isVertical ? scrollHeight - clientHeight : scrollWidth - clientWidth
      const newScrollPos = clampedPos * maxScroll

      if (isVertical) {
        viewportRef.current.scrollTop = newScrollPos
      } else {
        viewportRef.current.scrollLeft = newScrollPos
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

      if (autoHide && !isScrolling) {
        hideTimer.current = setTimeout(() => {
          setShowScrollbar(false)
        }, scrollHideDelay)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTrackClick = (e) => {
    if (!viewportRef.current || !rootRef.current || e.target === thumbRef.current) return

    e.preventDefault()

    const { scrollHeight, scrollWidth, clientHeight, clientWidth } = viewportRef.current
    const rootRect = rootRef.current.getBoundingClientRect()

    const clickPos = isVertical ? e.clientY : e.clientX
    const rootStart = isVertical ? rootRect.top : rootRect.left
    const rootSize = isVertical ? rootRect.height : rootRect.width

    const relativePos = (clickPos - rootStart) / rootSize
    const clampedPos = Math.max(0, Math.min(1, relativePos))

    const maxScroll = isVertical ? scrollHeight - clientHeight : scrollWidth - clientWidth
    const newScrollPos = clampedPos * maxScroll

    if (isVertical) {
      viewportRef.current.scrollTop = newScrollPos
    } else {
      viewportRef.current.scrollLeft = newScrollPos
    }
  }

  const handleMouseEnter = () => {
    if (type === 'hover' && isScrollable) {
      setShowScrollbar(true)
    }
  }

  const handleMouseLeave = () => {
    if (type === 'hover' && !isDragging && !isScrolling && autoHide) {
      setShowScrollbar(false)
    }
  }

  const trackSize = isVertical ? rootRef.current?.clientHeight || 0 : rootRef.current?.clientWidth || 0

  const thumbPosition = scrollPos * (trackSize - thumbSize)

  const thumbStyle = {
    [isVertical ? 'height' : 'width']: `${thumbSize}px`,
    transform: isVertical ? `translateY(${thumbPosition}px)` : `translateX(${thumbPosition}px)`,
    transition: isDragging ? 'none' : 'opacity 0.15s ease',
    opacity: showScrollbar ? 1 : 0
  }

  return (
    <div
      ref={rootRef}
      className={cn('relative overflow-hidden', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        ref={viewportRef}
        className={cn('scrollbar-hide h-full w-full overflow-auto', viewportClassName)}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {children}
      </div>

      {isScrollable && (
        <div
          className={cn(
            'absolute z-10',
            showScrollbar ? 'pointer-events-auto' : 'pointer-events-none',
            isVertical ? 'top-0 right-0.5 bottom-0 w-2' : 'right-0 bottom-0.5 left-0 h-2',
            scrollbarClassName
          )}
          onClick={handleTrackClick}
        >
          <div
            ref={thumbRef}
            className={cn('absolute cursor-pointer rounded-full bg-indigo-500/30 select-none hover:bg-indigo-500/50', isVertical ? 'w-1.5' : 'h-1.5')}
            style={thumbStyle}
            onMouseDown={handleThumbMouseDown}
          />
        </div>
      )}
    </div>
  )
}

export default ScrollArea
