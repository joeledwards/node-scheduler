module.exports = scheduler

const rbtree = require('functional-red-black-tree')
const uuid = require('uuid/v1')

function scheduler (options = {}) {
  let nextId = 1

  // Configuration
  const {
    timerFunc = defaultTimer,
    nowFunc = () => Date.now(),
    idFunc = () => nextId++
  } = options

  // Store scheduled actions ordered by time
  let tree = rbtree((a, b) => (a.when === b.when) ? (a.id - b.id) : (a.when - b.when))

  // Perform all expired actions
  let cancelTimer
  let paused = false
  const tick = () => {
    if (paused) {
      return
    }

    cancelTimer = null
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
    if (cancelTimer) {
      cancelTimer()
      cancelTimer = null
    }

    if (tree.length > 0 && !paused) {
      cancelTimer = timerFunc(tree.begin.value.when - nowFunc(), tick)
    }
  }

  // Schedule at a specific time
  const at = (when, action, context) => {
    const id = idFunc()
    const record = {id, when, action, context}
    tree = tree.insert(record, record)
    reset()

    const cancel = () => {
      tree = tree.remove(record)
      reset()
    }

    return {cancel, context, when}
  }

  // Schedule after a delay
  const after = (delay, action, context) => {
    const when = nowFunc() + Math.max(delay, 0)
    return at(when, action, context)
  }

  // Cancel all scheduled events for which the shouldCancel() function
  // returns a truthy value
  const cancel = (shouldCancel) => {
    tree.keys.filter(({context, when}) => shouldCancel({context, when})).forEach(key => {
      tree = tree.remove(key)
    })

    reset()
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

  return {at, after, cancel, pause, resume}
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
