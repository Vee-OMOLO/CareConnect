import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-medicine-bg flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-medicine text-[28px]">error</span>
          </div>
          <h2 className="text-lg font-bold text-on-surface mb-1">Something went wrong</h2>
          <p className="text-sm text-on-surface-variant mb-4">An unexpected error occurred. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
