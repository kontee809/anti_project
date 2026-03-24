import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const PageLayout = () => {
  return (
    <div className="flex flex-col w-full h-screen bg-slate-50 text-slate-800 overflow-hidden">
      <Navbar />
      <main className="flex-grow pt-16 relative w-full h-[calc(100vh-64px)] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default PageLayout;
