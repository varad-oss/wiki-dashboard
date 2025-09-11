// src/App.js
import React, { useState } from 'react';
import { fetchWikiData } from './services/wikipediaService'; 
import PageviewsChart from './components/PageviewsChart'; 
import WikiText from './components/WikiText';

const StatItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
    <div className="flex-shrink-0 w-6 h-6 text-cyan-400">{icon}</div>
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-base font-semibold text-slate-100">{value || 'N/A'}</p>
    </div>
  </div>
);

function App() {
  const [searchTerm, setSearchTerm] = useState('Albert Einstein');
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrollToAnalytics = () => {
    const analyticsSection = document.getElementById('analytics-section');
    if (analyticsSection) {
      analyticsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleSearch = async (title) => {
    setLoading(true);
    setError(null);
    setPageData(null);
    try {
      const data = await fetchWikiData(title);
      setPageData(data);
    } catch (err) {
     
      if (err.message.toLowerCase().includes('not found') || 
          err.message.toLowerCase().includes('does not exist') ||
          err.message.toLowerCase().includes('missing') ||
          err.message.includes('via search')) {
        setError('This Wikipedia page doesn\'t exist. Try something else, e.g. Virat Kohli');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchTerm) {
      handleSearch(searchTerm);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">WikiDash</h1>
          <p className="text-slate-400 text-lg">Your Real-Time Wikipedia Article Analyzer</p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-10 shadow-lg">
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="e.g., Albert Einstein" className="flex-grow bg-slate-800 border-2 border-slate-700 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300" />
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:bg-slate-500 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md">
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
            {pageData && (
              <button type="button" onClick={scrollToAnalytics} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
                View Analytics
              </button>
            )}
          </div>
        </form>

        <main>
          {loading && (<div className="flex justify-center items-center p-16"><div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>)}
          {error && (<div className="bg-red-900/50 border border-red-700 text-red-300 p-6 rounded-lg shadow-lg flex items-center space-x-4"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><div><h3 className="font-bold text-xl">Oops</h3><p>{error}</p></div></div>)}
          
          {pageData && (
            // This is the main container that stacks all sections vertically
            <div className="space-y-6 fade-in">
              
              {/* --- SECTION 1: SUMMARY --- */}
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg">
                <h2 className="text-3xl font-bold text-cyan-400 mb-4 border-b border-slate-700 pb-3">{pageData.title}</h2>
                {pageData.imageUrl && (<img src={pageData.imageUrl} alt={pageData.title} className="float-right w-36 h-auto ml-6 mb-4 rounded-md shadow-md border-2 border-slate-700"/>)}
                <WikiText text={pageData.summary} />
              </div>

              {/* --- SECTION 2: STATS BAR --- */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700 shadow-lg">
                <StatItem icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1921.75 8.25z" /></svg>} label="Page ID" value={pageData.pageId} />
                <StatItem icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>} label="Page Length" value={`${pageData.length.toLocaleString()} bytes`} />
                <StatItem icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>} label="Last Editor" value={pageData.lastEditor} />
                <StatItem icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.598m-1.5-6.375a3.375 3.375 0 00-3-3.375M4.5 8.25a3.375 3.375 0 003 3.375m-3-3.375a3.375 3.375 0 00-3 3.375M9 15l-3-3m0 0l3-3m-3 3h12" /></svg>} label="Unique Editors" value={pageData.uniqueEditors.toLocaleString()} />
                <StatItem icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.76 14.066 9.76 14.868 12m-4.542 6.375h7.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.375c.621 0 1.125.504 1.125 1.125V21" /></svg>} label="Languages" value={pageData.languages} />
                <StatItem icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></svg>} label="Created" value={pageData.creationDate} />
              </div>
              
              {/* --- SECTION 3: PAGEVIEWS CHART & STAT CARDS --- */}
              {/* This section now contains the chart AND the two stat cards side-by-side */}
              <div id="analytics-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2">
                    <PageviewsChart pageviewsData={pageData.pageviewsData} />
                 </div>
                 {/* This container stacks the two view cards vertically */}
                 <div className="space-y-6">
                    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg text-center flex flex-col justify-center">
                        <h3 className="text-slate-400 text-lg">Total Views (30 days)</h3>
                        <p className="text-4xl font-bold text-cyan-400 mt-2">{pageData.totalViews.toLocaleString()}</p>
                    </div>
                     <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg text-center flex flex-col justify-center">
                        <h3 className="text-slate-400 text-lg">Average Daily Views</h3>
                        <p className="text-4xl font-bold text-cyan-400 mt-2">{pageData.averageDailyViews.toLocaleString()}</p>
                    </div>
                 </div>
              </div>

              {/* --- SECTION 4: LINKS & BACKLINKS --- */}
              {/* This is its own separate grid, so it cannot collide with the section above */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg"><h3 className="text-xl font-semibold mb-3">Pages it Links To ({pageData.links.length.toLocaleString()})</h3><ul className="h-72 overflow-y-auto space-y-1 pr-2">{pageData.links.map(link => (<li key={link.title} className="text-slate-400 p-2 rounded-md hover:bg-slate-700/50 hover:text-cyan-300 truncate transition-colors cursor-pointer">{link.title}</li>))}</ul></div>
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg"><h3 className="text-xl font-semibold mb-3">Pages That Link Here ({pageData.backlinks.length.toLocaleString()})</h3><ul className="h-72 overflow-y-auto space-y-1 pr-2">{pageData.backlinks.map(link => (<li key={link.title} className="text-slate-400 p-2 rounded-md hover:bg-slate-700/50 hover:text-cyan-300 truncate transition-colors cursor-pointer">{link.title}</li>))}</ul></div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;