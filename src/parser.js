const process = require('process')
const https = require('https')
const http = require('http')

const queue = require('./queue')

const clean = (links) =>
  [...new Set(links)].map((link) => {
    const lastCharPos = link.length - 1
    if (link.charAt(lastCharPos) === '/' || link.charAt(lastCharPos) === '#') {
      return link.slice(0, lastCharPos)
    }
    return link
  })

const parse = (link, cb) => {
  const protocol = link.includes('https') ? https : http
  try {
    protocol
      .get(link, (res) => {
        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => {
          rawData += chunk
        })
        res.on('end', () => {
          const parsedLinks = rawData.match(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g
          )
          // console.log(parsedLinks)
          if (parsedLinks && parsedLinks.length) {
            queue.write(clean(parsedLinks), cb)
          } else {
            cb()
          }
        })
      })
      .on('error', (e) => {
        cb(e)
      })
  } catch (e) {
    cb(e)
  }
}

const run = () => {
  queue.read((err, link) => {
    if (err) {
      console.log(err)
      process.exit()
    }
    if (link) {
      // console.log(`${process.pid}: ${link}`)
      parse(link, (err) => {
        if (err) {
          console.log(err)
        }
        run()
      })
    } else {
      console.log('No data.')
      process.exit()
    }
  })
}

exports.run = run
