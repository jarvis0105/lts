import { Component, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
          <p className="font-serif text-2xl text-foreground">
            Une erreur est survenue
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Vous pouvez recharger la page pour reprendre la navigation.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-8 inline-flex h-12 items-center justify-center bg-foreground px-8 text-[11px] uppercase tracking-[0.3em] text-background transition-colors duration-300 hover:bg-brand-strong"
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
