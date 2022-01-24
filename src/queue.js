const http = require('http')
const process = require("process")

let data = ['https://ipfabric.io']
let globalPort = 3001

const sent = []

const requestListener = (req, res) => {
  if (req.method == 'POST') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      const links = JSON.parse(body)
      const filtered1 = links.filter((link) => !sent.includes(link))
      const filtered2 = filtered1.filter((link) => !data.includes(link))
      data = [...data, ...filtered2]
      console.log(`${sent.length}/${data.length}`)
    })
    res.writeHead(200)
  }

  if (req.method == 'GET') {
    res.writeHead(200)
    const link = data.shift()
    sent.push(link)
    res.end(link)
  }
}

const read = (cb) => {
  if (!globalPort) {
    cb(new Error('Queue is not running.'))
    return
  }
  http
    .get(`http://localhost:${globalPort}`, (res) => {
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => {
        rawData += chunk
      })
      res.on('end', () => {
        cb(null, rawData)
      })
    })
    .on('error', (err) => {
      cb(err)
    })
}

const write = (data, cb) => {
  if (!globalPort) {
    cb(new Error('Queue is not running.'))
    return
  }
  const postData = JSON.stringify(data)

  const options = {
    hostname: 'localhost',
    port: globalPort,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  }

  const req = http.request(options)
  req.write(postData)
  req.end(cb)
}

const run = (cb) => {
  const server = http.createServer(requestListener)
  server.listen(globalPort, () => {
    console.log(`Queue is listening on port ${globalPort}`)
    cb()
  })
}

process.on('SIGINT', () => {
  console.log('QUIT')
  console.log(data)
  process.exit()
})

exports.run = run
exports.write = write
exports.read = read
