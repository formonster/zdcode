import React, { FC } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { json } from "@codemirror/lang-json"
import { useTheme } from '../ThemeToggle'
import './index.scss'

export interface IJsonEditorProps {
  defaultValue?: string
  onChange?: (value: string) => void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const JsonEditor: FC<IJsonEditorProps> = ({ defaultValue = "{\n}", onChange }) => {
  const [theme] = useTheme()
  
  return (
    <CodeMirror
      value={JSON.stringify(JSON.parse(defaultValue), null, 2)}
      extensions={[json()]}
      theme={theme}
      onChange={onChange}
    />
  )
}

export default React.memo(JsonEditor)
