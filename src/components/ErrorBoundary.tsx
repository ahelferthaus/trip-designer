import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: "var(--td-bg)" }}>
          <div className="text-5xl mb-4">😵</div>
          <h2 className="text-[22px] font-bold mb-2" style={{ color: "var(--td-label)" }}>
            Something went wrong
          </h2>
          <p className="text-[15px] text-center mb-6" style={{ color: "var(--td-secondary)" }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-3 rounded-2xl text-[17px] font-semibold active:opacity-70"
            style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
