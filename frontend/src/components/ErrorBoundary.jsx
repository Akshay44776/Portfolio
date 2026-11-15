import React, { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
          <div className="panel" style={{ maxWidth: "600px", margin: "0 auto", padding: "40px" }}>
            <div style={{ color: "var(--fail)", fontFamily: "var(--font-mono)", fontSize: "1.1rem", marginBottom: "16px" }}>
              [FATAL_EXCEPTION]: Kernel panic or render anomaly
            </div>
            <h1 style={{ fontSize: "var(--step-2)", marginBottom: "16px" }}>Service temporarily degraded</h1>
            <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
              The current node encountered an unexpected state. The incident has been captured in local diagnostics.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button type="button" className="btn btn--primary" onClick={this.handleReload}>
                Restart Node (Reload)
              </button>
              <a href="/" className="btn">
                Return to Root
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
