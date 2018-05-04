const tap = require('tap')
const scheduler = require('../lib/scheduler')

tap.test('scheduler.at() schedules at a specific time', async assert => {
  let after
  const nowFunc = () => 3
  const timerFunc = (delay, _action) => { after = delay }
  const sched = scheduler({nowFunc, timerFunc})
  sched.at(2, () => {})
  assert.equal(after, -1)
})

tap.test('scheduler.after() schedules after a delay', async assert => {
  let after
  const nowFunc = () => 3
  const timerFunc = (delay, _action) => { after = delay }
  const sched = scheduler({nowFunc, timerFunc})
  sched.after(2, () => {})
  assert.equal(after, 2)
})

tap.test('scheduler triggers only when at == now ', async assert => {
  let now = 0
  const nowFunc = () => now

  let act
  const timerFunc = (when, action) => {
    act = action
  }

  const sched = scheduler({nowFunc, timerFunc})

  let happening = false
  sched.at(1, () => { happening = true })

  act()
  assert.equal(happening, false)

  now = 1
  act()
  assert.equal(happening, true)
})

tap.test('scheduler triggers only when at > now ', async assert => {
  let now = 0
  const nowFunc = () => now

  let act
  const timerFunc = (when, action) => { act = action }

  const sched = scheduler({nowFunc, timerFunc})

  let happening = false
  sched.at(1, () => { happening = true })

  act()
  assert.equal(happening, false)

  now = 2
  act()
  assert.equal(happening, true)
})

tap.test('scheduler triggers only once', async assert => {
  let now = 0
  const nowFunc = () => now

  let act
  const timerFunc = (when, action) => {
    act = action
  }

  const sched = scheduler({nowFunc, timerFunc})

  let count = 0
  sched.at(1, () => count++)

  act()
  assert.equal(count, 0)

  now = 1
  act()
  assert.equal(count, 1)

  now = 1
  act()
  assert.equal(count, 1)

  now = 2
  act()
  assert.equal(count, 1)
})

tap.test("scheduler doesn't trigger when paused", async assert => {
  let now = 1
  const nowFunc = () => now

  let act
  let cancelled = false
  const timerFunc = (when, action) => {
    act = () => {
      if (!cancelled) {
        action()
      }
    }

    return () => {
      cancelled = true
    }
  }

  const sched = scheduler({nowFunc, timerFunc})

  let count = 0
  sched.at(1, () => count++)

  assert.equal(cancelled, false)
  sched.pause()
  assert.equal(cancelled, true)

  act()
  assert.equal(count, 0)
})

tap.test('scheduler triggers after pause/resume cycle', async assert => {
  let now = 1
  const nowFunc = () => now

  let act
  let cancelled
  const timerFunc = (when, action) => {
    cancelled = false
    act = () => {
      if (!cancelled) {
        action()
      }
    }

    return () => {
      cancelled = true
    }
  }

  const sched = scheduler({nowFunc, timerFunc})

  let count = 0
  sched.at(1, () => count++)

  assert.equal(cancelled, false)
  sched.pause()
  assert.equal(cancelled, true)

  act()
  assert.equal(count, 0)

  sched.resume()
  assert.equal(cancelled, false)
  act()
  assert.equal(count, 1)
})
