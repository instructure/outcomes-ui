// This file mocks the ResizeObserver API for Jest tests
// Since jsdom doesn't support ResizeObserver natively

class ResizeObserverMock {
  constructor(callback) {
    this.callback = callback
    this.observables = new Map()
  }

  observe(target) {
    this.observables.set(target, {
      target,
      contentRect: {
        width: target.clientWidth || 0,
        height: target.clientHeight || 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        x: 0,
        y: 0
      }
    })
  }

  unobserve(target) {
    this.observables.delete(target)
  }

  disconnect() {
    this.observables.clear()
  }

  // Simulate a resize
  triggerResize(target) {
    const entry = this.observables.get(target)
    if (entry) {
      this.callback([entry])
    }
  }
}

global.ResizeObserver = ResizeObserverMock
