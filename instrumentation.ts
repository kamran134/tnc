// instrumentation.ts - Needed for Next.js standalone mode to access runtime env vars
export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Make BACKEND_URL available at runtime
    const backendUrl = process.env.BACKEND_URL || 'http://backend:8080';
    process.env.BACKEND_URL = backendUrl;
    
    console.log('🔧 [Instrumentation] BACKEND_URL set to:', backendUrl);
  }
}
