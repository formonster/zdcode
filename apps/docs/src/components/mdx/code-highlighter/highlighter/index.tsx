import {
  Highlighter,
  setCDN,
  getHighlighter,
  IShikiTheme,
  IThemedToken,
  FontStyle,
  Lang,
} from 'shiki'
import { Code } from '../utils/code'

let highlighterPromise: Promise<Highlighter> | null = null
let highlighter: Highlighter | null = null

const newlineRe = /\r\n|\r|\n/

export async function highlight({
  code,
  lang,
  theme,
}: {
  code: string
  lang: string
  theme: any // TODO type this
}): Promise<Code> {
  if (lang === 'text') {
    const lines = code ? code.split(newlineRe) : ['']
    return {
      lines: lines.map((line) => ({
        tokens: [{ content: line, props: {} }],
      })),
      lang,
    }
  }
  if (highlighterPromise === null) {
    const isBrowser = typeof window !== 'undefined'
    // if we are on the server we load all the languages
    // if we are on the browser just load the first language
    // subsequent calls with different languages will lazy load
    const langs = isBrowser ? [lang as Lang] : undefined

    // TODO add version
    setCDN('https://unpkg.com/shiki/')
    highlighterPromise = getHighlighter({
      theme: theme as IShikiTheme,
      langs,
    })
  }

  if (highlighter === null) {
    highlighter = await highlighterPromise
  }
  if (missingTheme(highlighter, theme)) {
    await highlighter.loadTheme(theme as IShikiTheme)
  }
  if (missingLang(highlighter, lang)) {
    try {
      await highlighter.loadLanguage(lang as Lang)
    } catch (e) {
      console.warn(
        '[Code Hike warning]',
        `${lang} is not a valid language, no syntax highlighting will be applied.`
      )
      return highlight({ code, lang: 'text', theme })
    }
  }

  const tokenizedLines = highlighter.codeToThemedTokens(
    code,
    lang,
    theme.name,
    {
      includeExplanation: false,
    }
  )

  const lines = tokenizedLines.map((line) => ({
    tokens: line.map((token) => ({
      content: token.content,
      props: { style: getStyle(token) },
    })),
  }))

  return { lines, lang }
}

function missingTheme(highlighter: Highlighter, theme: any) {
  return !highlighter.getLoadedThemes().some((t) => t === theme.name)
}

function missingLang(highlighter: Highlighter, lang: string) {
  return !highlighter.getLoadedLanguages().some((l) => l === lang)
}

const FONT_STYLE_TO_CSS = {
  [FontStyle.NotSet]: {},
  [FontStyle.None]: {},
  [FontStyle.Italic]: { fontStyle: 'italic' },
  [FontStyle.Bold]: { fontWeight: 'bold' },
  [FontStyle.Underline]: { textDecoration: 'underline' },
}
function getStyle(token: IThemedToken) {
  const fontStyle = token.fontStyle ? FONT_STYLE_TO_CSS[token.fontStyle] : {}
  return {
    color: token.color,
    ...fontStyle,
  }
}
