import React from 'react';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: { componentStack?: string }) => void;
};

type State = {
  hasError: boolean;
  error?: Error | null;
};

// Consolidated ErrorBoundary implementation (single export)
export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Allow the parent to capture the error (e.g., send to Sentry)
    if (this.props.onError) {
      try {
        this.props.onError(error, { componentStack: info.componentStack ?? undefined });
      } catch (err) {
        // swallow any errors from the handler
        // eslint-disable-next-line no-console
        console.error('ErrorBoundary onError threw:', err);
      }
    }

    // Always log to console during development for visibility
    // eslint-disable-next-line no-console
    console.error('Uncaught error captured by ErrorBoundary:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return <>{this.props.fallback}</>;

      return (
        <div style={{ padding: 20, borderRadius: 8, background: 'rgba(255,255,255,0.03)', color: '#e6eef8', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 8px' }}>Something went wrong</h2>
          <p style={{ color: '#9aa0a6', margin: '0 0 12px' }}>We encountered an error while rendering this section.</p>
          <details style={{ whiteSpace: 'pre-wrap', color: '#cbd5e1' }}>
            {this.state.error?.message}
          </details>
          <div style={{ marginTop: 12 }}>
            <button onClick={this.handleReset} style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer', marginRight: 8 }}>Try again</button>
            <button onClick={() => window.location.reload()} style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Reload page</button>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
