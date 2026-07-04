import { configureGlobal } from 'fast-check'

// Configure fast-check with minimum 100 iterations per property test
configureGlobal({
  numRuns: 100,
  verbose: false,
})
