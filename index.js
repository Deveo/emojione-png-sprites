const sprite  = require('sprity')
const _       = require('lodash')
const Promise = require('bluebird')
const path    = require('path')
const exec    = require('child_process').exec
const fs      = require('fs-extra-promise')
const sharp   = require('sharp')



const sizes         = [..._.range(10, 32), 32, 48, 64, 128]
// const sizes         = [20]
const srcPath       = 'bower_components/emojione/assets/png_512x512'
const tmpPath       = 'tmp'
const tmpResizePath = path.join(tmpPath, 'resize')
const tmpSpritePath = path.join(tmpPath, 'sprite')
const distPath      = 'dist'
const styleName     = 'style.scss'



const promisify =
  callback =>
    new Promise ((resolve, reject) => {
      callback(err => {
        if (err) {
          console.log('Error:', err.message, err)
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

console.log("Starting.")

sizes
  .reduce((promise, size) => {
    return promise
      .then(() => fs.ensureDirAsync(tmpResizePath))
      .then(() => fs.ensureDirAsync(tmpSpritePath))

      .then(() => {
        console.log(`Resizing emoji to size ${size}`)
        return fs.readdirAsync(srcPath)
      })

      .then(fileNames =>
        Promise.all(
          fileNames.map(fileName => {
            const inputFileName  = path.join(srcPath, fileName)
            const outputFileName = path.join(tmpResizePath, fileName)
            return promisify(callback =>
              sharp(inputFileName)
                .resize(size, size)
                .toFile(outputFileName, callback)
            )
          })
        )
      )

      .then(() => {
        console.log(`Generating spritesheet of size ${size}`)
        return promisify(
          callback =>
            sprite
              .create({
                  src:       path.join(tmpResizePath, '*.png'),
                  out:       tmpSpritePath,
                  name:      `sprite-${size}`,
                  style:     styleName,
                  processor: 'emojione-scss',
                  margin:    0,
                  prefix:    'emojione',
                  dimension: [ { ratio: 1, dpi: 1 } ],
                },
                callback
              )
        )
      })

    .then(() => {
      // https://zoompf.com/blog/2014/11/png-optimization
      console.log(`Optimizing spritesheet of size ${size}`)

      const sourcePath = path.join(tmpSpritePath, `sprite-${size}.png`)
      const targetPath = path.join(distPath,      `sprite-${size}.png`)
      const command    = `pngcrush -rem alla -nofilecheck -reduce -m 7 ${sourcePath} ${targetPath}`

      return execPrm(command)
    })
  }, Promise.resolve())

  .then(() => {
    console.log("Finished generating & optimizing sprites. Moving style file to dist.")

    const sourcePath = path.join(tmpSpritePath, styleName)
    const targetPath = path.join(distPath,      styleName)
    return fs.renameAsync(sourcePath, targetPath)
  })

  .then(() => {
    if (tmpPath.slice(0, 1) === '/') return
    console.log("Removing tmp folder.")
    return fs.removeAsync(tmpPath)
  })

  .then(() => {
    console.log("Finished.")
  })
