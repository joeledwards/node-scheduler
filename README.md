# scheduler

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

A simple, in-memory scheduler.

## Usage

Import and initialize
```javascript
const scheduler = require('@buzuli/scheduler')()
```

Schedule after a delay
```javascript
scheduler.after(1000, () => console.log('a second has elapsed'), 'some-context')
```

Schedule at a specific time
```javascript
scheduler.at(Date.now + 500, () => console.log('half a second has elapsed'), {some: 'ctxt'})
```

Pause the scheduler (timer will be cleared, permitting a clean exit)
```javascript
scheduler.pause()
```

Resume the scheduler (will immediately invoke all due or past-due actions)
```javascript
scheduler.resume()
```

Cancel a scheduled action
```javacsript
const {cancel, context, when} = scheduler.after(
  100, () => console.log('not happening'), 'nil'
)

cancel()
console.log(`Cancelled '${context}' scheduled to run at '${new Date(when)}'`)
```

Cancel all actions passing a filtering function
```javacsript
scheduler.after(1000, () => console.log('hello'))
scheduler.after(1300, () => console.log('ye'), 'yo')
scheduler.after(1700, () => console.log('old'), 'yo')
scheduler.after(2000, () => console.log('world'))
scheduler.after(10000, () => console.log('...'))

scheduler.cancel(({when, context}) => context === 'yo' || when >= (Date.now() + 5000))
```

[travis-url]: https://travis-ci.org/joeledwards/node-scheduler
[travis-image]: https://img.shields.io/travis/joeledwards/node-scheduler/master.svg
[npm-url]: https://www.npmjs.com/package/@buzuli/scheduler
[npm-image]: https://img.shields.io/npm/v/@buzuli/scheduler.svg
