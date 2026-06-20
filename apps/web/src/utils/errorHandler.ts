/**
 * 사용자 친화적 에러 메시지 변환
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean = true,
    public userMessage?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * 에러를 사용자 친화적 메시지로 변환
 */
export function getUserFriendlyMessage(error: Error | AppError): string {
  if (error instanceof AppError && error.userMessage) {
    return error.userMessage;
  }

  const message = error.message.toLowerCase();

  if (message.includes("network") || message.includes("fetch")) {
    return "인터넷 연결을 확인해주세요. 네트워크 문제로 인해 데이터를 불러올 수 없습니다.";
  }

  if (message.includes("not found") || message.includes("404")) {
    return "요청한 리소스를 찾을 수 없습니다.";
  }

  if (message.includes("permission") || message.includes("unauthorized")) {
    return "접근 권한이 없습니다.";
  }

  if (message.includes("timeout")) {
    return "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.";
  }

  if (message.includes("validation") || message.includes("invalid")) {
    return "입력한 값이 올바르지 않습니다. 다시 확인해주세요.";
  }

  return "문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
}

/**
 * 에러 로깅 (개발 환경 및 에러 리포팅 서비스)
 */
export function logError(error: Error, context?: Record<string, any>) {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // 개발 환경에서는 콘솔에 상세 정보 출력
  // Vite에서는 import.meta.env.DEV 사용
  if (import.meta.env.DEV) {
    console.group("🚨 Error Logged");
    console.error("Error:", error);
    console.error("Context:", context);
    console.error("Full Info:", errorInfo);
    console.groupEnd();
  }

  // TODO: 프로덕션 환경에서는 에러 리포팅 서비스로 전송
  // 예: Sentry, LogRocket, Bugsnag 등
  if (import.meta.env.PROD) {
    // Sentry.captureException(error, { extra: context });
  }

  return errorInfo;
}

/**
 * 재시도 로직이 포함된 함수 래퍼
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delay?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {},
): Promise<T> {
  const { maxRetries = 3, delay = 1000, onRetry } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        if (onRetry) {
          onRetry(attempt + 1, lastError);
        }

        // 지수 백오프: 1초, 2초, 4초...
        const waitTime = delay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError!;
}
