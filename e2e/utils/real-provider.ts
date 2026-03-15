import path from 'path'

export function envFlag(name: string) {
  return /^(1|true|yes|on)$/i.test(process.env[name] || '')
}

export function missingEnvVars(names: string[]) {
  return names.filter((name) => !process.env[name]?.trim())
}

export function resolveEnvPath(name: string) {
  const value = process.env[name]?.trim()
  if (!value) return undefined

  return path.isAbsolute(value) ? value : path.resolve(process.cwd(), value)
}

export function skipMessage(flow: string, vars: string[]) {
  const missing = missingEnvVars(vars)
  if (missing.length === 0) return null
  return `${flow} requires: ${missing.join(', ')}`
}
