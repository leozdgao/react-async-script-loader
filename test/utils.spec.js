const { newScript, parallel, series } = require('../src/utils')

describe('Test util functions', _ => {

  it('[utils/newScript] A thunk task, append new script tag', function (done) {
    const testScript = '//cdn.bootcss.com/jquery/2.2.1/jquery.min.js'
    const task = newScript(testScript)

    task(function (err, src) {
      const tag = document.querySelector(`script[src='${testScript}']`)

      expect(err).to.not.exist
      expect(src).to.equal(testScript)
      expect(tag).to.exist

      done()
    })
  })
})
