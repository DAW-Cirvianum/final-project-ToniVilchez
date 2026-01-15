export function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="text-center space-y-6">
        {/* Animated spinner */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-white/10 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-primary-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
        </div>
        
        {/* Text */}
        <div className="space-y-2">
          <p className="text-white font-medium">Cargando</p>
          <div className="flex items-center justify-center gap-1">
            <div className="w-1 h-1 bg-primary-500 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}