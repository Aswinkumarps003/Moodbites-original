const AuroraBackground = () => (
  <div className="absolute inset-0 -z-10 opacity-60 overflow-hidden">
    <div className="absolute inset-0 bg-background"></div>
    {/* Using warmer, orangish/rosy colors */}
    <div className="absolute top-1/4 left-0 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-2xl animate-blob-1"></div>
    <div className="absolute top-1/2 right-0 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl animate-blob-2"></div>
  </div>
);

export default AuroraBackground;