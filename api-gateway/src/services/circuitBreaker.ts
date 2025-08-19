// src/services/circuitBreaker.ts

type AsyncFunction = (req: any, res: any) => Promise<void>;

enum State {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  HALF_OPEN = "HALF_OPEN"
}

export function createCircuitBreaker(fn: AsyncFunction, options?: { failureThreshold?: number; successThreshold?: number; timeout?: number }) {
  const failureThreshold = options?.failureThreshold ?? 5;  // failures before opening circuit
  const successThreshold = options?.successThreshold ?? 2;  // successes to close half-open
  const timeout = options?.timeout ?? 10_000;                // open state timeout in ms

  let state = State.CLOSED;
  let failureCount = 0;
  let successCount = 0;
  let nextAttempt = 0;

  async function circuitBreaker(req: any, res: any): Promise<void> {
    if (state === State.OPEN) {
      if (Date.now() > nextAttempt) {
        state = State.HALF_OPEN;
      } else {
        res.status(503).json({ success: false, message: "Service temporarily unavailable due to circuit breaker" });
        return;
      }
    }

    try {
      await fn(req, res);

      if (state === State.HALF_OPEN) {
        successCount++;
        if (successCount >= successThreshold) {
          state = State.CLOSED;
          failureCount = 0;
          successCount = 0;
        }
      }
    } catch (error) {
      failureCount++;

      if (failureCount >= failureThreshold) {
        state = State.OPEN;
        nextAttempt = Date.now() + timeout;
      }

      throw error; // rethrow error to caller or proxy middleware
    }
  }

  return circuitBreaker;
}
