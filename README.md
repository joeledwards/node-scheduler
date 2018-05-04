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
scheduler.after(1000, console.log('a second has elapsed'))
```

Schedule at a specific time
```javascript
scheduler.at(Date.now + 500, console.log('half a second has elapsed'))
```

Pause the scheduler (timer will be cleared, permitting a clean exit)
```javascript
scheduler.pause()
```

Resume the scheduler (will immediately invoke all due or past-due actions)
```javascript
scheduler.resume()
```

[travis-url]: https://travis-ci.org/joeledwards/node-scheduler
[travis-image]: https://img.shields.io/travis/joeledwards/node-scheduler/master.svg
[npm-url]: https://www.npmjs.com/package/@buzuli/scheduler
[npm-image]: https://img.shields.io/npm/v/@buzuli/scheduler.svg
