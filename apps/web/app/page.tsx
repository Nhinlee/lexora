import UploadZone from "./components/UploadZone";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
            ✨ AI-Powered Vocabulary Builder
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Master English with <br />
            <span className="text-gradient">Lexora</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload a page from your favorite book. Our AI extracts difficult words,
            provides definitions, and finds visual context instantly.
          </p>
        </div>

        <UploadZone />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-16">
          {[
            { title: "Smart OCR", desc: "Instantly recognizes text from any book page image." },
            { title: "Contextual Definitions", desc: "Get definitions that fit the specific context of your book." },
            { title: "Visual Learning", desc: "AI-curated images help reinforce memory retention." },
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl hover:bg-slate-800/50 transition-colors">
              <h3 className="font-semibold text-slate-200 mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
