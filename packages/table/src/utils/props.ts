// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type NativeType = null | undefined | number | string | boolean | symbol | Function

type InferDefault<P, T> = ((props: P) => T & {}) | (T extends NativeType ? T : never)

type InferDefaults<T> = {
  [K in keyof T]?: InferDefault<T, T[K]>
}

export function defineDefaultProps<T>(defaults: InferDefaults<T>): InferDefaults<T> {
  return defaults
}
