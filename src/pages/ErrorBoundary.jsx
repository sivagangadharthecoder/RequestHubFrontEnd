
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '1rem', color: 'red', textAlign: 'center' }}>
          <h3>Something went wrong.</h3>
          <p>{this.state.error?.message || 'Unknown error'}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
