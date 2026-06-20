import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import GlassPanel from "../ui/GlassPanel";
import Button from "../ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // 에러 로깅 (추후 에러 리포팅 서비스 연동)
    this.logErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // TODO: Sentry, LogRocket 등 에러 리포팅 서비스 연동
    if (import.meta.env.DEV) {
      console.group("🚨 Error Details");
      console.error("Error:", error);
      console.error("Error Info:", errorInfo);
      console.error("Component Stack:", errorInfo.componentStack);
      console.groupEnd();
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  getUserFriendlyMessage = (error: Error): string => {
    const message = error.message.toLowerCase();

    if (message.includes("network") || message.includes("fetch")) {
      return "인터넷 연결을 확인해주세요. 네트워크 문제로 인해 데이터를 불러올 수 없습니다.";
    }

    if (message.includes("not found") || message.includes("404")) {
      return "요청한 리소스를 찾을 수 없습니다. 페이지가 이동되었거나 삭제되었을 수 있습니다.";
    }

    if (message.includes("permission") || message.includes("unauthorized")) {
      return "접근 권한이 없습니다. 필요한 권한이 있는지 확인해주세요.";
    }

    if (message.includes("timeout")) {
      return "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.";
    }

    return "문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error } = this.state;
      const userMessage = error
        ? this.getUserFriendlyMessage(error)
        : "알 수 없는 오류가 발생했습니다.";

      return (
        <div className="min-h-screen bg-primary-bg flex items-center justify-center p-4">
          <GlassPanel className="max-w-md w-full p-lg">
            <div className="text-center">
              <div className="flex justify-center mb-lg">
                <div className="w-16 h-16 rounded-full bg-danger bg-opacity-20 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-danger" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-text-primary mb-md">
                오류가 발생했습니다
              </h2>

              <p className="text-text-secondary mb-lg">{userMessage}</p>

              {import.meta.env.DEV && error && (
                <details className="mb-lg text-left">
                  <summary className="cursor-pointer text-sm text-text-muted mb-sm">
                    개발자 정보 (클릭하여 확장)
                  </summary>
                  <div className="mt-sm p-sm bg-secondary-bg rounded text-xs font-mono overflow-auto max-h-48">
                    <div className="mb-sm">
                      <strong className="text-danger">Error:</strong>
                      <div className="text-text-secondary">{error.message}</div>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong className="text-danger">Stack:</strong>
                        <pre className="text-text-secondary whitespace-pre-wrap">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-sm justify-center">
                <Button
                  onClick={this.handleReset}
                  variant="primary"
                  leftIcon={<RefreshCw size={16} />}
                >
                  다시 시도
                </Button>

                <Button onClick={this.handleReload} variant="secondary">
                  페이지 새로고침
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="ghost"
                  leftIcon={<Home size={16} />}
                >
                  홈으로
                </Button>
              </div>
            </div>
          </GlassPanel>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
