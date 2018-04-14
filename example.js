const sched = require('./lib/scheduler')()

sched.after(100, () => console.log('first'))
sched.after(10, () => console.log('second'))
sched.after(1, () => console.log('third'))
sched.after(2000, () => console.log('fourth'))
sched.after(500, () => console.log('fifth'))
sched.after(1000, () => sched.after(20, () => console.log('nested')))
