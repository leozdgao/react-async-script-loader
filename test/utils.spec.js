const { newScript, parallel, series } = require('../src/utils')

describe('Test util functions', _ => {
  const testTask = v => cb => setTimeout(_ => cb(null, v), 100)
  const taskBundle = [1, 2, 3, 4, 5].map(testTask)

  it('[utils/newScript] A thunk task, append new script tag', function (done) {
    const testScript = '//cdn.bootcss.com/jquery/2.2.1/jquery.min.js'
    const task = newScript(testScript)

    // start task
    task((err, src) => {
      const tag = document.querySelector(`script[src='${testScript}']`)

      // assert
      expect(err).to.not.exist
      expect(src).to.equal(testScript)
      expect(tag).to.exist

      done()
    })
  })

  it('[utils/parallel] Run thunk task in parallel mode', function (done) {
    const startTime = Date.now()

    parallel.apply(null, taskBundle)((err, val, i) => {
      // assert for iteration
      expect(err).to.not.exist
      expect(val).to.equal(i + 1)
    })((err, ret) => {
      const finishTime = Date.now()
      const delta = finishTime - startTime

      // assert for success callback
      expect(err).to.not.exist
      expect(ret).to.eql([1, 2, 3, 4, 5])
      // check execute time, parallel mode would take about >100, <200 ms
      expect(delta).to.be.below(200)

      done()
    })
  })

  it('[utils/series] Run thunk task in series mode', function (done) {
    const startTime = Date.now()

    series.apply(null, taskBundle)((err, val, i) => {
      // assert for iteration
      expect(err).to.not.exist
      expect(val).to.equal(i + 1)
    })((err, ret) => {
      const finishTime = Date.now()
      const delta = finishTime - startTime

      // assert for success callback
      expect(err).to.not.exist
      expect(ret).to.eql([1, 2, 3, 4, 5])
      // check execute time, series mode would >500 ms
      expect(delta).to.be.above(500)

      done()
    })
  })
})
