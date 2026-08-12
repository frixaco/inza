import { useCallback, useMemo, useState } from 'react'
import { initOptimizer } from '@open-spaced-repetition/binding/dynamic-wasi'
import type { ComputeParametersOptions } from '@open-spaced-repetition/binding'
import type * as Optimizer from '@open-spaced-repetition/binding'
import wasmUrl from '@open-spaced-repetition/binding-wasm32-wasi/fsrs-binding.wasm32-wasi.wasm?url'
import WasiWorker from '@open-spaced-repetition/binding-wasm32-wasi/wasi-worker-browser.mjs?worker'
import { fsrs, type FSRSParameters, type Grade } from 'ts-fsrs'

let optimizer: Promise<typeof Optimizer> | undefined

export type OptimizerItem = {
  reviews: { rating: Grade; deltaT: number }[]
}

export const useFsrs = (parameters?: Partial<FSRSParameters>) =>
  useMemo(() => fsrs(parameters), [parameters])

export function useFsrsOptimizer() {
  const [parameters, setParameters] = useState<number[]>()
  const [error, setError] = useState<Error>()
  const [optimizing, setOptimizing] = useState(false)

  const optimize = useCallback(
    async (items: OptimizerItem[], options?: ComputeParametersOptions) => {
      setOptimizing(true)
      setError(undefined)

      try {
        const binding = await (optimizer ??= initOptimizer({
          wasm: wasmUrl,
          worker: () => new WasiWorker(),
        })).catch((error) => {
          optimizer = undefined
          throw error
        })
        const parameters = await binding.computeParameters(
          items.map(
            ({ reviews }) =>
              new binding.FSRSBindingItem(
                reviews.map(({ rating, deltaT }) => new binding.FSRSBindingReview(rating, deltaT)),
              ),
          ),
          options,
        )

        setParameters(parameters)
        return parameters
      } catch (error) {
        const cause = error instanceof Error ? error : new Error(String(error))
        setError(cause)
        throw cause
      } finally {
        setOptimizing(false)
      }
    },
    [],
  )

  return { error, optimize, optimizing, parameters }
}
