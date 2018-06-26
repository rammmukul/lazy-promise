const EventEmitter = require('events')

function Promice (_callback) {
  this.callback = _callback

  this.resolved = Symbol('resolved')
  this.rejected = Symbol('rejected')
  this.Event = new EventEmitter()
  this.state = 'initial'
  this.value = undefined
  this.error = undefined
  this.return = undefined

  this.resolve = (_value) => {
    if (this.state === 'resolved' || this.state === 'rejected') return
    console.log('resolved')
    this.state = 'resolved'
    this.value = _value
    this.Event.emit(this.resolved, _value)
  }

  this.reject = (_error) => {
    if (this.state === 'resolved' || this.state === 'rejected') return
    console.log('rejected')
    this.state = 'rejected'
    this.error = _error
    this.Event.emit(this.rejected, null, _error)
  }

  this.then = onSettelment => {
    let settle = ((value, error) => { this.return = onSettelment(value, error) }) ||
      (() => {})
    if (this.state === 'initial') {
      this.Event.once(this.resolved, settle)
      this.Event.once(this.rejected, settle)
      this.state = 'pending'
      this.callback(this.resolve, this.reject)
    } else if (this.state === 'pending') {
      this.Event.once(this.resolved, settle)
      this.Event.once(this.rejected, settle)
    } else if (this.state === 'resolved') {
      settle(this.value, this.error)
    }
    return new Promice((resolve, reject) => {
      if (this.state === 'resolved') {
        this.return instanceof Promice
          ? this.return.then(res => resolve(res)) : resolve(this.return)
      } else if (this.state === 'rejected') {
        this.return instanceof Promice
          ? this.return.then((_, err) => reject(err)) : reject(this.return)
      } else {
        this.Event.once(this.resolved, () => {
          this.return instanceof Promice
            ? this.return.then(res => resolve(res)) : resolve(this.return)
        })
        this.Event.once(this.rejected, () => {
          this.return instanceof Promice
            ? this.return.then((_, err) => reject(err)) : reject(this.return)
        })
      }
    })
  }
}

let valueResolver = (resolve, reject) => {
  console.log('called')

  // Do computation || I/O ooperation

  // setImmediate(resolve, 'hola')
  // setTimeout(resolve, 1000, 1)
  resolve(1)
  // reject(Error('I should not print'))
}

console.log('before construction')
let p = new Promice(valueResolver)

console.log('after construction')
p.then((r, e) => { console.log('<>', r, e); return new Promice(resolve => resolve(2)) })
  .then(resolvedValue => console.log('<<>>', resolvedValue))
console.log('between calls')
p.then(resolvedValue => console.log('<<<>>>', resolvedValue))
p.then(resolvedValue => console.log('<<<1457>>>', resolvedValue))
console.log('after calls')
