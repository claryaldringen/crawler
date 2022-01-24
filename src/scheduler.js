const cluster = require('cluster')
const os = require('os')
const process = require('process')

const queue = require('./queue')
const parser = require('./parser')

const run = () => {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`)
    queue.run(() => {
      for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork()
      }

      cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`)
        cluster.fork()
      })
    })
  } else {
    console.log(`Forked ${process.pid} is running`)
    parser.run()
  }
}

exports.run = run
