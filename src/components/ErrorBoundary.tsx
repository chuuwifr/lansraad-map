import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Landsraad Holonet Uncaught Error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetStorage = () => {
    try {
      localStorage.removeItem('dune_landsraad_autosave_v2');
      localStorage.removeItem('dune_landsraad_autosave_v1');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-[#060709] text-[#e6d5b8] flex items-center justify-center p-6 z-[999999] overflow-auto select-none">
          <div className="max-w-xl w-full bg-[#0a0d14]/95 border-2 border-amber-600/40 rounded-xl p-8 shadow-[0_0_50px_rgba(217,119,6,0.25)] text-center relative overflow-hidden backdrop-blur-xl">
            {/* Hologram scanlines effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#d97706_3px,#d97706_3px)]" />

            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-xl font-bold tracking-widest uppercase font-mono text-amber-400 mb-2">
              DISFONCTIONNEMENT HOLOSPHÈRE // LANDSRAAD
            </h1>

            <p className="text-neutral-400 text-sm mb-6 font-mono leading-relaxed">
              Une anomalie de transmission quantique a interrompu le rendu holographique.
              Si vous utilisez un navigateur avec accélération matérielle désactivée, vérifiez l'activation de WebGL.
            </p>

            {this.state.error && (
              <div className="mb-6 p-4 rounded bg-black/60 border border-neutral-800 text-left font-mono text-xs text-red-400 overflow-x-auto max-h-36">
                <div className="font-bold text-red-300 mb-1">Message d'erreur :</div>
                <div>{this.state.error.message || String(this.state.error)}</div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-amber-600 hover:bg-amber-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)] cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Réinitialiser la transmission</span>
              </button>

              <button
                onClick={this.handleResetStorage}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
                title="Supprime les données locales en cache pour résoudre les incohérences de sauvegarde"
              >
                <Trash2 className="w-4 h-4 text-neutral-400" />
                <span>Purger le cache local</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
