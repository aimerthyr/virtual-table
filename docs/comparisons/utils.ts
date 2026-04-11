export function measureRenderStable(startTime: number, cb: (result: any) => void) {
  let frame = 0
  function step() {
    requestAnimationFrame(() => {
      frame++
      // 连续 2 帧稳定后认为渲染完成
      if (frame >= 2) {
        // 强制延迟到下一事件循环，让 layout / paint 收尾
        setTimeout(() => {
          const endTime = performance.now()
          // ⚠️ 更稳的内存读取（延迟 GC 干扰）
          setTimeout(() => {
            const mem = (performance as any).memory
            cb({
              renderTime: Math.round(endTime - startTime),
              memory: mem ? (mem.usedJSHeapSize / 1024 / 1024).toFixed(2) : '0',
            })
          }, 50)
        }, 0)
      } else {
        step()
      }
    })
  }

  step()
}
