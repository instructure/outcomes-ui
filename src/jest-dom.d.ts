import type {TestingLibraryMatchers} from '@testing-library/jest-dom/matchers'
import type {expect} from '@jest/globals'

declare module '@jest/expect' {
  interface Matchers<R extends void | Promise<void>>
    extends TestingLibraryMatchers<
      ReturnType<typeof expect.stringContaining>,
      R
    > {}
}
