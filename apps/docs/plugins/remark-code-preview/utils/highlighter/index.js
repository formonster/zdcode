import { setCDN, getHighlighter, FontStyle } from 'shiki'

let highlighterPromise = null
let highlighter = null

const newlineRe = /\r\n|\r|\n/

export async function highlight({ code, lang, theme }) {
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
    const langs = isBrowser ? [lang] : undefined

    // TODO add version
    setCDN('https://unpkg.com/shiki/')
    highlighterPromise = getHighlighter({
      theme: theme,
      langs,
    })
  }

  if (highlighter === null) {
    highlighter = await highlighterPromise
  }
  if (missingTheme(highlighter, theme)) {
    await highlighter.loadTheme(theme)
  }
  if (missingLang(highlighter, lang)) {
    try {
      await highlighter.loadLanguage(lang)
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

function missingTheme(highlighter, theme) {
  return !highlighter.getLoadedThemes().some((t) => t === theme.name)
}

function missingLang(highlighter, lang) {
  return !highlighter.getLoadedLanguages().some((l) => l === lang)
}

const FONT_STYLE_TO_CSS = {
  [FontStyle.NotSet]: {},
  [FontStyle.None]: {},
  [FontStyle.Italic]: { fontStyle: 'italic' },
  [FontStyle.Bold]: { fontWeight: 'bold' },
  [FontStyle.Underline]: { textDecoration: 'underline' },
}
function getStyle(token) {
  const fontStyle = token.fontStyle ? FONT_STYLE_TO_CSS[token.fontStyle] : {}
  return {
    color: token.color,
    ...fontStyle,
  }
}
