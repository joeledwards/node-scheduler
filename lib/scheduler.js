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
  const tick = () => {
    cancel = null
    let iter = tree.begin

    while (iter.valid && iter.value.when <= nowFunc()) {
      act = iter.value.action
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

    if (tree.length > 0) {
      cancel = timerFunc(tree.begin.value.when, tick)
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

  return {at, after}
}

function defaultTimer (delay, action) {
  let timerRef = setTimeout(action, delay)

  const clear = () => {
    if (timerRef) {
      clearTimeout(timerRef)
      timerRef = null
    }
  }

  return clear
}
