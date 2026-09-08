import { getEnv } from '@/config/env'
import { checkDatabaseConnection } from '@/lib/db'
import { jsonOk, handleRouteError, getRequestId } from '@/lib/http/response'

export async function GET(request: Request) {
  const requestId = getRequestId(request)

  try {
    getEnv()
    const dbConnected = await checkDatabaseConnection()

    return jsonOk({
      ok: true,
      service: 'blackbox-platform',
      status: dbConnected ? 'healthy' : 'degraded',
      checks: {
        application: true,
        database: dbConnected,
      },
      timestamp: new Date().toISOString(),
      requestId,
    })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
