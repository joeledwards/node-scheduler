module.exports = scheduler

const rbtree = require('functional-red-black-tree')

function scheduler (options = {}) {
  // Configuration
  const {
    timerFunc = defaultTimer,
    nowFunc = () => Date.now()
  } = options

  // Store scheduled actions ordered by time
  let tree = rbtree((a, b) => a.when - b.when)

  // Perform all expired actions
  let cancel
  let paused = false
  const tick = () => {
    if (paused) {
      return
    }

    cancel = null
    let iter = tree.begin

    while (iter.valid && iter.value.when <= nowFunc()) {
      const act = iter.value.action
      tree = iter.remove()
      act()
      iter = tree.begin
    }

    reset()
  }

  // Reset the expiration timer
  const reset = () => {
    if (cancel) {
      cancel()
      cancel = null
    }

    if (tree.length > 0 && !paused) {
      cancel = timerFunc(tree.begin.value.when - nowFunc(), tick)
    }
  }

  // Schedule at a specific time
  const at = (when, action) => {
    const record = {when, action}
    tree = tree.insert(record, record)
    reset()
  }

  // Schedule after a delay
  const after = (delay, action) => {
    const when = nowFunc() + Math.max(delay, 0)
    at(when, action)
  }

  // Prevents action invocations (cancels the timer)
  const pause = () => {
    // Resetting when paused
    paused = true
    reset()
  }

  // Resumes action invocations
  const resume = () => {
    paused = false
    reset()
  }

  return {at, after, pause, resume}
}

function defaultTimer (delay, action) {
  let timerRef = setTimeout(action, delay)

  const cancel = () => {
    if (timerRef) {
      clearTimeout(timerRef)
      timerRef = null
    }
  }

  return cancel
}
