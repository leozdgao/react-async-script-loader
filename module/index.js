import React, { Component, PropTypes as T } from 'react'
import hoistStatics from 'hoist-non-react-statics'
import { isDefined, newScript, series } from './utils'

const loadedScript = []
let failedScript = []

const scriptLoader = (...scripts) => (WrappedComponent) => {

  const addCache = (entry) => {
    if (loadedScript.indexOf(entry) < 0) {
      loadedScript.push(entry)
    }
  }

  const removeFailedScript = () => {
    if (failedScript.length > 0) {
      failedScript.forEach((script) => {
        const node = document.querySelector(`script[src='${script}']`)
        if (node != null) {
          node.parentNode.removeChild(node)
        }
      })

      failedScript = []
    }
  }

  class ScriptLoader extends Component {
    static propTypes = {
      onScriptLoaded: T.func
    };

    static defaultProps = {
      onScriptLoaded: () => {}
    };

    constructor (props, context) {
      super(props, context)

      this.state = {
        isScriptLoaded: false,
        isScriptLoadSucceed: false
      }
    }

    componentDidMount () {
      // sequence load
      const loadNewScript = (src) => {
        if (loadedScript.indexOf(src) < 0) return newScript(src)
      }
      const tasks = scripts.map(src => {
        if (Array.isArray(src)) {
          return src.map(loadNewScript)
        }
        else return loadNewScript(src)
      })

      series(...tasks)((err, src) => {
        if (err) {
          failedScript.push(src)
        }
        else {
          if (Array.isArray(src)) {
            src.forEach(addCache)
          }
          else addCache(src)
        }
      })(err => {
        removeFailedScript()

        this.setState({
          isScriptLoaded: true,
          isScriptLoadSucceed: !err
        }, () => {
          if (!err) {
            this.props.onScriptLoaded()
          }
        })
      })
    }

    render () {
      const props = {
        ...this.props,
        ...this.state
      }

      return (
        <WrappedComponent {...props} />
      )
    }
  }

  return hoistStatics(ScriptLoader, WrappedComponent)
}

export default scriptLoader
