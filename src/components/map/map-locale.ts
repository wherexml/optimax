type Expression = [string, ...unknown[]]

interface MapStyleLayer {
  id: string
  type?: string
}

interface MapStyle {
  layers?: MapStyleLayer[]
}

interface LocalizableMap {
  getStyle?: () => MapStyle | null | undefined
  getLayoutProperty?: (layerId: string, property: 'text-field') => unknown
  setLayoutProperty?: (layerId: string, property: 'text-field', value: Expression) => void
}

const LANG_TO_TILE_FIELD: Record<string, string> = {
  en: 'name:en',
  zh: 'name:zh',
  ja: 'name:ja',
  ko: 'name:ko',
  fr: 'name:fr',
  de: 'name:de',
  es: 'name:es',
  ru: 'name:ru',
  ar: 'name:ar',
}

function getLocalizedNameExpression(lang = 'zh'): Expression {
  const field = LANG_TO_TILE_FIELD[lang] ?? 'name:en'

  if (field === 'name:en') {
    return ['coalesce', ['get', 'name:en'], ['get', 'name']]
  }

  return ['coalesce', ['get', field], ['get', 'name:en'], ['get', 'name']]
}

function isLocalizableTextField(textField: unknown) {
  if (!textField) return false

  if (typeof textField === 'string') {
    return /\{name[^}]*\}/.test(textField)
  }

  if (typeof textField === 'object') {
    const serialized = JSON.stringify(textField)
    return (
      serialized.includes('"name"') ||
      serialized.includes('"name:') ||
      serialized.includes('"name_en"') ||
      serialized.includes('"name_int"') ||
      serialized.includes('{name')
    )
  }

  return false
}

export function localizeMapLabels(map: LocalizableMap | null | undefined, lang = 'zh') {
  if (!map) return

  const style = map.getStyle?.()
  if (!style?.layers) return

  const textFieldExpression = getLocalizedNameExpression(lang)

  for (const layer of style.layers) {
    if (layer.type !== 'symbol') continue

    let textField: unknown
    try {
      textField = map.getLayoutProperty?.(layer.id, 'text-field')
    } catch {
      continue
    }

    if (!isLocalizableTextField(textField)) continue

    try {
      map.setLayoutProperty?.(layer.id, 'text-field', textFieldExpression)
    } catch {
      // Some remote styles protect specific label layers; skip those silently.
    }
  }
}
