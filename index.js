const eventEmitter = require('events')

function Promice(callback) {
  this.callback = callback

  this.resolved = Symbol('resolved')
  this.rejected = Symbol('rejected')
  this.completeEvent = new eventEmitter(this.resolved)
  this.rejectEvent = new eventEmitter(this.rejected)

  this.state = 'initial'

  this.resolve = (value) => {
    console.log('resolved')
    this.state = 'resolved'
    this.value = value
    this.completeEvent.emit(this.resolved)
  }

  this.reject = function (error) {
    state = 'rejected'
    this.error = error
    this.completeEvent.emit(this.rejected)
  }

  this.then = (onsuc, onerr) => {
    if (this.state === 'initial') {
      this.callback(this.resolve, this.reject)
      this.state = 'pending'
    }
    this.completeEvent.once(this.resolved, () => onsuc(this.value))
    this.completeEvent.once(this.rejected, () => onsuc(null, this.error))
  }
}

p = new Promice((resolve, reject) => {
                   console.log('called');
                   setTimeout(resolve,1000,1)
                })
p.then(res => console.log('<>', res))
p.then(res => console.log('<>', res))
p.then(res => console.log('<>', res))