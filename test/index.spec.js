const ReactTestUtils = require('react-dom/test-utils')
const React = require('react')
const AsyncScriptLoader = require('../src').default

class TestComponent extends React.Component {
  render() {
    return <div />
  }
}

function renderTestComponent(deps, onScriptLoaded, extraProps = {}) {
  const MockedComponent = AsyncScriptLoader.apply(null, deps)(TestComponent)
  const result = ReactTestUtils.renderIntoDocument(
    <MockedComponent onScriptLoaded={onScriptLoaded} {...extraProps} />
  )

  return ReactTestUtils.findRenderedComponentWithType(result, TestComponent)
}

function checkScriptLoaded(getComponent, done) {
  return _ => {
    const com = getComponent()

    expect(com.props.isScriptLoaded).to.be.true
    expect(com.props.isScriptLoadSucceed).to.be.true

    done()
  }
}

describe('Test this module', _ => {
  it('[react-async-script-loader] Load external script after component mounted', function(done) {
    const deps = [
      'https://ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.min.js'
    ]
    const com = renderTestComponent(deps, onScriptLoaded)

    this.timeout(5000)

    // check script tags
    deps.forEach(testScript => {
      const tag = document.querySelector(`script[src='${testScript}']`)
      expect(tag).to.be.exist
    })

    // check component props before loading
    expect(com.props.isScriptLoaded).to.be.false
    expect(com.props.isScriptLoadSucceed).to.be.false

    function onScriptLoaded() {
      expect(com.props.isScriptLoaded).to.be.true
      expect(com.props.isScriptLoadSucceed).to.be.true

      done()
    }
  })

  it('[react-async-script-loader] No redundant script tag will be appended', function(done) {
    const deps = ['//cdn.bootcss.com/jquery/2.1.1/jquery.min.js']
    const com0 = renderTestComponent(
      deps,
      checkScriptLoaded(_ => com0, checkAllDone)
    )
    const com1 = renderTestComponent(
      deps,
      checkScriptLoaded(_ => com1, checkAllDone)
    )
    let count = 0

    this.timeout(5000)

    // check script tags
    deps.forEach(testScript => {
      const tags = document.querySelectorAll(`script[src='${testScript}']`)
      expect(tags.length).to.equal(1)
    })

    function checkAllDone() {
      count++
      if (count == 2) done()
    }
  })

  it('[react-async-script-loader] Accepts a function that maps props to script sources', function(done) {
    const scriptMapper = [
      props => {
        return [
          'https://ajax.googleapis.com/ajax/libs/jquery/' +
            props.version +
            '/jquery.min.js'
        ]
      }
    ]
    this.timeout(5000)
    function onScriptLoaded() {
      const tag = document.querySelector(
        `script[src='https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js']`
      )
      expect(tag).to.exist
      done()
    }
    let comWithMapper
    comWithMapper = renderTestComponent(scriptMapper, onScriptLoaded, {
      version: '2.0.0'
    })
  })
})
