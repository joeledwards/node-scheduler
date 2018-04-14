# scheduler

A simple, in-memory scheduler implemented in pure JavaScript.

## Usage

```
const scheduler = require('@buzuli/scheduler')()
scheduler.after(1000, console.log('a second has elapsed'))
scheduler.at(Date.now + 500, console.log('half a second has elapsed'))
```
