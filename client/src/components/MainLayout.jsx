import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className="flex flex-wrap items-center justify-center w-full py-2 font-medium text-sm text-white text-center bg-gradient-to-b from-orange-500 to-orange-600">
        <p>Templates are live on prebuiltui!</p>
        <button className="flex items-center gap-1 px-3 py-1 rounded-lg text-orange-600 bg-white hover:bg-slate-200 transition active:scale-95 ml-3">
            Check it out
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.91797 7H11.0846" stroke="#F54900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 2.9165L11.0833 6.99984L7 11.0832" stroke="#F54900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </button>
    </div>
      <Header />
        <main className="flex-1 pt-40 container mx-auto"><Outlet /></main>
      <Footer />
    </div>
  );
}