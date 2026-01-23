import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

const ErrorDisplay = ({ error, onRetry }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-rose-500/10 rounded-2xl flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-rose-400" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">{t('errorBoundary.title')}</h2>
          <p className="text-gray-400">
            {error?.message || t('errorBoundary.unexpectedError')}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            {t('errorBoundary.retry')}
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            {t('errorBoundary.goHome')}
          </button>
        </div>
      </div>
    </div>
  );
};

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(t('errorBoundary.errorCaptured'), error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

const t = (key) => {
  return key;
};