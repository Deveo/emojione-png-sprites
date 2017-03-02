const sprite  = require('sprity')
const _       = require('lodash')
const Promise = require('bluebird')
const path    = require('path')
const exec    = require('child_process').exec
const fs      = require('fs-extra-promise')



const sizes     = [..._.range(10, 32), 32, 48, 64, 128] // MUST include 128
const tmpPath   = 'tmp'
const distPath  = 'dist'
const styleName = 'style.scss'



const promisify =
  callback =>
    new Promise ((resolve, reject) => {
      callback(err => {
        if (err) {
          reject(...arguments)
        } else {
          resolve(...arguments)
        }
      })
    })

const execPrm =
  command =>
    promisify(
      callback => exec(command, callback)
    )
      // .then((error, stdout, stderr) => {
      //   console.log("----------")
      //   console.log(`finished: ${command}`)
      //   console.log(`stdout: ${stdout}`);
      //   console.log(`stderr: ${stderr}`);
      // })



console.log("Starting. Generating sprites with sprity.")
console.log("This is gonna take a while, have a coffee.")

promisify(
  callback =>
    sprite
      .create({
        src: 'bower_components/emojione/assets/png_128x128/*.png',
        out: tmpPath,
        style: styleName,
        processor: 'emojione-scss',
        margin: 0,
        // 'no-sort': true,
        prefix: 'emojione',
        dimension:
          sizes
            .map(size => ({ratio: size, dpi: size * 10}))
        },
        callback
      )
)

  .then(() => {
    console.log("Finished generating sprites. Optimizing with pngcrush.")
    return fs.ensureDirAsync(distPath)
  })

  .then(() =>
    Promise.all(
      sizes.map(size => {
        const sourcePath = path.join(tmpPath, `sprite@${size}x.png`)
        const targetPath = path.join(distPath, `sprite-${size}.png`)
        const command    = `pngcrush -rem alla -nofilecheck -reduce -m 7 ${sourcePath} ${targetPath}`

        // https://zoompf.com/blog/2014/11/png-optimization
        return execPrm(command)
          .then(() => console.log("-- Finished", command))
          .catch(() => {
            console.log("-- Failed", command)
            return Promise.reject(...arguments)
          })
      })
    )
  )

  .then(() => {
    console.log("Finished optimizing sprites. Moving style file to dist.")

    const sourcePath = path.join(tmpPath,  styleName)
    const targetPath = path.join(distPath, styleName)
    return fs.renameAsync(sourcePath, targetPath)
  })

  .then(() => {
    if (tmpPath.slice(0, 1) === '/') return
    console.log("Removing tmp folder.")
    fs.removeAsync(tmpPath)
  })

  .then(() => {
    console.log("Finished.")
  })
