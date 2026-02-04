/**
 * DIAGNOSTIC: Animation Test Component
 * Test semua animations untuk debug
 */

export function AnimationDiagnostic() {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] p-6 bg-black/90 text-white rounded-lg shadow-2xl border border-white/20 max-w-sm">
      <h3 className="font-bold text-lg mb-4">🔍 Animation Diagnostic</h3>
      
      {/* Test 1: Inline Style Spinner */}
      <div className="mb-4">
        <p className="text-sm mb-2">1. Inline Style Spinner:</p>
        <div
          className="inline-block w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
          style={{
            animation: "custom-spin 0.6s linear infinite",
            willChange: "transform"
          }}
        />
        <span className="ml-2 text-xs text-green-400">✓ Should spin</span>
      </div>
      
      {/* Test 2: CSS Class Spinner */}
      <div className="mb-4">
        <p className="text-sm mb-2">2. CSS Class (.spinner-rotate):</p>
        <div
          className="spinner-rotate inline-block w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full"
        />
        <span className="ml-2 text-xs text-green-400">✓ Should spin</span>
      </div>
      
      {/* Test 3: Tailwind animate-spin */}
      <div className="mb-4">
        <p className="text-sm mb-2">3. Tailwind animate-spin:</p>
        <div className="animate-spin inline-block w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full" />
        <span className="ml-2 text-xs text-green-400">✓ Should spin</span>
      </div>
      
      {/* Test 4: Fade animation */}
      <div className="mb-4">
        <p className="text-sm mb-2">4. Fade In:</p>
        <div className="animate-fade-in inline-block px-3 py-1 bg-blue-500/20 rounded">
          Fading in...
        </div>
      </div>
      
      {/* Test 5: Card hover */}
      <div className="mb-4">
        <p className="text-sm mb-2">5. Card Hover:</p>
        <div className="card-hover inline-block px-3 py-1 bg-purple-500/20 rounded cursor-pointer">
          Hover me
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/20 text-xs text-gray-400">
        <p>✅ If semua spin & animate = WORKING!</p>
        <p>❌ If takde pusing = BROWSER CACHE / CSS CONFLICT</p>
        <p className="mt-2">Press <kbd className="px-1 bg-white/10 rounded">Ctrl+Shift+R</kbd> to hard refresh</p>
      </div>
    </div>
  )
}
