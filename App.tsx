import React, { useState } from 'react';
import RPPForm from './components/RPPForm';
import RPPResult from './components/RPPResult';
import { RPPRequest, RPPResponse } from './types';
import { generateRPP } from './services/geminiService';

const App: React.FC = () => {
  const [requestData, setRequestData] = useState<RPPRequest | null>(null);
  const [result, setResult] = useState<RPPResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: RPPRequest) => {
    setLoading(true);
    setError(null);
    setRequestData(data); // Save request for display in result
    try {
      const generatedRPP = await generateRPP(data);
      setResult(generatedRPP);
    } catch (err) {
      setError("Gagal membuat RPP. Pastikan koneksi internet lancar dan coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setRequestData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">RPP Generator <span className="text-primary">AI</span></h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Asisten Cerdas Guru Indonesia
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200 max-w-2xl mx-auto flex items-center gap-3">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
               </svg>
               {error}
            </div>
          )}

          {!result ? (
            <div className="max-w-3xl mx-auto flex flex-col gap-8">
              <div className="text-center space-y-2 mb-4">
                <h2 className="text-3xl font-bold text-slate-900">Buat Perangkat Ajar dalam Hitungan Detik</h2>
                <p className="text-slate-600 text-lg">Masukkan CP dan kondisi kelas, AI akan menyusun strategi pembelajaran yang relevan.</p>
              </div>
              <RPPForm onSubmit={handleFormSubmit} isLoading={loading} />
            </div>
          ) : (
            requestData && (
                <RPPResult 
                    data={result} 
                    request={requestData} 
                    onReset={handleReset} 
                />
            )
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} RPP Generator AI. Dibuat untuk Guru Indonesia.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
