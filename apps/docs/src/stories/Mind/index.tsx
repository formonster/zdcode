// @ts-nocheck
import React, { FC, useEffect, useState } from 'react'
import classNames from 'classnames'
import { Button } from 'antd'
import moment from 'moment'
import SimpleMind from 'react-simple-mind'
import 'react-simple-mind/dist/style.css';
import './index.scss'

var Sys = {};
var ua = navigator.userAgent.toLowerCase();
// if (s = ua.match(/firefox\/([\d.]+)/)) Sys.firefox = true
// (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
// (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
      // if (ua.match(/version\/([\d.]+).*safari/)) Sys.safari = true

      // console.log(Sys);
      

export interface IMindProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const preCls = 'titaui-mind'

const testData = {
  title: 'root',
  children: [
    {
      title: 'xxx',
      children: [
        {
          title: <p>xxx <Button>hello</Button></p>
        },
        {
          title: 'xxx1'
        },
        {
          title: 'xxx3'
        },
      ]
    },
    {
      title: 'xxx1',
      children: [
        {
          title: 'xxx'
        },
        {
          title: <p>xxx <Button>hello</Button> <Button>hello</Button><Button>hello</Button><Button>hello</Button></p>
        },
        {
          title: 'xxx3'
        },
      ]
    },
    {
      title: 'xxx3',
      children: [
        {
          title: 'xxx'
        },
        {
          title: 'xxx1'
        },
      ]
    },
  ]
}

const Mind: FC<IMindProps> = ({ className, style }) => {
  const [minder, setMinder] = useState(null)

  useEffect(() => {
    console.log('minder => ', minder)
  }, [minder])

  return (
    <div className={classNames(preCls, className)} style={style}>
      <SimpleMind
        elementClassName={'element'}
        data={testData}
        gap={[64, 24]}
        lineWidth={4}
        lineColor={'red'}
      />
    </div>
  )
}

export default React.memo(Mind)
