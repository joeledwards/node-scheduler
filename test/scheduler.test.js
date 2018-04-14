const tap = require('tap')
const scheduler = require('../lib/scheduler')

tap.test('scheduler.at() schedules at a specific time', async assert => {
  let at
  const nowFunc = () => 3
  const timerFunc = (when, _action) => at = when
  const sched = scheduler({nowFunc, timerFunc})
  sched.at(2, () => {})
  assert.equal(at, 2)
})

tap.test('scheduler.after() schedules after a delay', async assert => {
  let at
  const nowFunc = () => 3
  const timerFunc = (when, _action) => at = when
  const sched = scheduler({nowFunc, timerFunc})
  sched.after(2, () => {})
  assert.equal(at, 5)
})

tap.test('scheduler triggers only when at == now ', async assert => {
  let now = 0
  const nowFunc = () => now

  let at
  let act
  const timerFunc = (when, action) => {
    at = when
    act = action
  }

  const sched = scheduler({nowFunc, timerFunc})

  let happening = false
  sched.at(1, () => happening = true)

  act()
  assert.equal(happening, false)

  now = 1
  act()
  assert.equal(happening, true)
})

tap.test('scheduler triggers only when at > now ', async assert => {
  let now = 0
  const nowFunc = () => now

  let at
  let act
  const timerFunc = (when, action) => {
    at = when
    act = action
  }

  const sched = scheduler({nowFunc, timerFunc})

  let happening = false
  sched.at(1, () => happening = true)

  act()
  assert.equal(happening, false)

  now = 2
  act()
  assert.equal(happening, true)
})

tap.test('scheduler triggers only once', async assert => {
  let now = 0
  const nowFunc = () => now

  let at
  let act
  const timerFunc = (when, action) => {
    at = when
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
