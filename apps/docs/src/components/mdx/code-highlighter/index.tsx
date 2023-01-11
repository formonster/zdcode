import classNames from 'classnames'
import React, { FC, useEffect, useState } from 'react'
import { highlight } from './highlighter'
import { theme } from './theme'
import style from './index.module.css'

type CodeLine = {
  tokens: {
    content: string
    props: {
      style?: React.CSSProperties
    }
  }[]
  active?: boolean
}[]

async function codeHighlight(code: string) {
  const codeData = await highlight({
    code,
    lang: 'javascript',
    theme,
  })
  return codeData.lines
}

export interface ICodeProps {
  children: string
  className?: string
  style?: React.CSSProperties
}

const Code: FC<ICodeProps> = ({ children, className, ...other }) => {
  const [codeLine, setCodeLine] = useState<CodeLine>()
  const startLine = 1

  useEffect(() => {
    if (children)
      codeHighlight(children).then((codeLine) => {
        setCodeLine(codeLine)
      })
  }, [children])

  return (
    <div className={classNames(className, style['mdx-code'])}>
      <code {...other}>
        {codeLine?.map(({ tokens, active }, i) => (
          <div
            key={i}
            className='w-full'
            style={{
              display: 'inline-block',
              ...(active && { backgroundColor: 'rgba(255, 255, 255, .1)' }),
            }}
          >
            <span>
              {tokens.map(({ props, content }, i) => (
                <span key={i} {...props}>
                  {content}
                </span>
              ))}
            </span>
          </div>
        ))}
      </code>
    </div>
  )
}

export default React.memo(Code)
