import { Component } from 'react';

import { ErrorFallback } from '@/components/common/ErrorBoundary/ErrorFallback';
import { logger } from '@/utils/logger';

/**
 * Catches errors thrown while drawing the components inside it and shows ErrorFallback instead of a blank
 * screen. (React needs a class component for this.) Errors in event handlers and API calls are not caught here:
 * those are handled where they happen (ErrorMessage, toasts).
 */
export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    logger.error('A page crashed while being drawn', error, info.componentStack);
  }

  componentDidUpdate(previous) {
    if (this.state.error && previous.resetKey !== this.props.resetKey) {
      this.reset();
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} onReset={this.reset} />;
    }
    return this.props.children;
  }
}
