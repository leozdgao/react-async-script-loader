# react-async-script-loader

[![Build Status](https://travis-ci.org/leozdgao/react-async-script-loader.svg?branch=master)](https://travis-ci.org/leozdgao/react-async-script-loader) [![npm version](https://badge.fury.io/js/react-async-script-loader.svg)](https://badge.fury.io/js/react-async-script-loader)

A decorator for script lazy loading on react component.

## Description

Some component may depend on other vendors which you may not want to load them until you really need them. So here it is, use **High Order Component** to decorate your component and it will handle lazy loading for you, it support parallel and sequential loading.

## Installation

```bash
npm install --save react-async-script-loader
```

## API

```javascript
scriptLoader(...scriptSrc)([WrappedComponent])
```

`scriptSrc` can be a string of source or an array of source. `scriptSrc` will be loaded sequentially, but array of source will be loaded parallelly. It also cache the loaded script to avoid duplicated loading. More lively description see use case below.

## Properties

Decorated component will receive following properties:

|Name|Type|Description|
|----|----|-----------|
|isScriptLoaded|Boolean|Represent scripts loading process is over or not, maybe part of scripts load failed.|
|isScriptLoadSucceed|Boolean|Represent all scripts load successfully or not.|
|onScriptLoaded|Function|Triggered when all scripts load successfully.|

## How to use

You can use it to decorate your component.

```javascript
import React, { Component } from 'react'
import scriptLoader from 'react-async-script-loader'

class Editor extends Component {
  ...

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        this.initEditor()
      }
      else this.props.onError()
    }
  }

  componentDidMount () {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props
    if (isScriptLoaded && isScriptLoadSucceed) {
      this.initEditor()
    }
  }

  ...
}

export default scriptLoader(
  [
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.5/marked.min.js'
  ],
  '/assets/bootstrap-markdown.js'
)(Editor)
```

The example above means that the `jquery` and `marked` will be loading parallelly, and after loaded these 2 vendors, load `bootstrap-markdown` sequentially.

It is possible that some script will be failed to load. ScriptLoader will cache the script that load successfully and will remove the script node which fail to load before.

*Currently, if you try to reload scripts, you have to remount your component.*

And it's cooler if you use decorator syntax. (ES7)

```javascript
@scriptLoader(
  [
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.5/marked.min.js'
  ],
  '/assets/bootstrap-markdown.js'
)
class Editor extends Component {

}
```

## license

MIT
