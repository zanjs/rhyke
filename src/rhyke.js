class Rhyke {
  constructor (options = {}) {
    this.options = Object.assign({
      el: 'body',
      rhythm: '...',
      dashTime: 400,
      timeout: 2000,
      isMobile: true,
      matching: () => {},
      matched: () => {},
      unmatched: () => {},
      onTimeout: () => {}
    }, options)

    this.el = document.querySelector(this.options.el)

    this.tabStartEvent = this.options.isMobile ? 'touchstart' : 'mousedown'
    this.tabEndEvent = this.options.isMobile ? 'touchend' : 'mouseup'

    this.tabStart = 0
    this.tabTime = 0

    this.userRhythm = []
    this.isTimeout = false
    this.timeoutStart = 0
    this.timeout = 0

    this.addListener()
  }

  tabStartFunc () {
    this.tabStart = new Date().getTime()
    this.timeout = this.timeout === 0 ? 1 : new Date().getTime() - this.timeoutStart
    this.isTimeout = this.timeout > this.options.timeout ? true : false
    if (this.isTimeout) {
      this.options.onTimeout()
      this.reset()
    }
  }

  tabEndFunc () {
    this.tabTime = new Date().getTime() - this.tabStart
    this.timeoutStart = new Date().getTime()
    if (!this.isTimeout) {
      this.tabTime < this.options.dashTime ? this.userRhythm.push('.') : this.userRhythm.push('-')
      this.options.matching(this.userRhythm)
      this.matchRhythem(this.userRhythm)
    } else {
      this.reset()
    }
  }

  addListener () {
    this.registedTabStartFunc = () => {
      this.tabStartFunc()
    }
    this.registedTabEndFuc = () => {
      this.tabEndFunc()
    }
    this.el.addEventListener(this.tabStartEvent, this.registedTabStartFunc)
    this.el.addEventListener(this.tabEndEvent, this.registedTabEndFuc)
  }

  removeListener () {
    this.el.removeEventListener(this.tabStartEvent, this.registedTabStartFunc)
    this.el.removeEventListener(this.tabEndEvent, this.registedTabEndFuc)
  }

  matchRhythem (userRhythm) {
    const rhythm = this.options.rhythm
    const testRhythm = userRhythm.join('')
    if (testRhythm.length === rhythm.length && testRhythm === rhythm) {
      this.options.matched()
      this.reset()
    } else if (testRhythm.length === rhythm.length && testRhythm !== rhythm) {
      this.options.unmatched()
      this.reset()
    }
  }

  reset () {
    this.userRhythm = []
    this.isTimeout = false
    this.timeoutStart = 0
    this.timeout = 0
  }
}

export default Rhyke
