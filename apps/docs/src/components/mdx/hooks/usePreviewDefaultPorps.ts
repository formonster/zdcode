import { PropsOptions } from "@/components/propsEditor"
import { useMemo } from "react"
import { SyntaxKind } from "typescript"

const usePreviewDefaultPorps = (componentPropsOptions: PropsOptions | undefined) => {
  const defaultPorps = useMemo(() => {
    if (!componentPropsOptions) return {}
    let props: Record<string, any> = {}
    componentPropsOptions
      .filter(({ tags }) => tags.default || tags.editData)
      .forEach(({ kind, name, tags }) => {
        if (kind === SyntaxKind.BooleanKeyword) {
          props[name] = tags.default === 'true'
          return
        }
        if (tags.editType === 'json') {
          try {
            props[name] = JSON.parse(tags.default || tags.editData)
          } catch (error) {
            props[name] = tags.isArray ? [] : {}
          }
          return
        }
        props[name] = tags.default || tags.editData
      })

    return props
  }, [componentPropsOptions])

  return defaultPorps
}

export default usePreviewDefaultPorps