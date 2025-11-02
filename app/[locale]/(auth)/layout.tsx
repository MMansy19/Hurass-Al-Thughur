import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout min-h-screen relative overflow-hidden">
      {/* Elegant CSS Background */}
      <div className="absolute inset-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50"></div>
        
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(5, 150, 105, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(14, 116, 144, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(5, 150, 105, 0.1) 0%, transparent 50%)
            `
          }}></div>
        </div>

        {/* Islamic geometric pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(5, 150, 105, 0.1) 10px, rgba(5, 150, 105, 0.1) 20px),
              repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(14, 116, 144, 0.05) 10px, rgba(14, 116, 144, 0.05) 20px)
            `
          }}></div>
        </div>

        {/* Floating circles for depth */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-100/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-teal-100/40 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-100/25 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-1/3 w-16 h-16 bg-emerald-200/35 rounded-full blur-lg"></div>

        {/* Subtle animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/20"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Elegant form container */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              {/* Header decoration */}
              <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"></div>
              
              {/* Content area */}
              <div className="p-8 sm:p-10">
                {children}
              </div>
            </div>

            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-600/10 rounded-3xl blur-xl -z-10 transform scale-105"></div>
          </div>
        </div>
      </div>
    </div>
  );
}