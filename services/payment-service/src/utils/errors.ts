export class PaymentError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class ValidationError extends PaymentError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends PaymentError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictError extends PaymentError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class UnauthorizedError extends PaymentError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends PaymentError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class InternalServerError extends PaymentError {
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}
