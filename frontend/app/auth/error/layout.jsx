import { Suspense } from "react";

export default function AuthErrorLayout({ children }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-white flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    }>
      {children}
    </Suspense>
  );
}