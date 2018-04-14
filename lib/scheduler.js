module.exports = scheduler

const rbtree = require('functional-red-black-tree')

function scheduler (options = {}) {
  // Configuration
  const {
    timer = () => Date.now()
  } = options

  // Store scheduled actions ordered by time
  let tree = rbtree((a, b) => a.when - b.when)

  // Perform all expired actions
  let ref
  const tick = () => {
    ref = null
    let iter = tree.begin

    while (iter.valid && iter.value.when <= timer()) {
      act = iter.value.action
      tree = iter.remove()
      act()
      iter = tree.begin
    }

    reset()
  }

  // Reset the expiration timer
  const reset = () => {
    if (ref) {
      clearTimeout(ref)
      ref = null
    }

    if (tree.length > 0) {
      ref = setTimeout(tick, tree.begin.value.when)
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
    const when = timer() + Math.max(delay, 0)
    at(when, action)
  }

  return {at, after}
}
