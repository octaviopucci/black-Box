import { setTestEnv } from './helpers/env'

setTestEnv({
  NODE_ENV: 'test',
  LOG_LEVEL: 'error',
})
