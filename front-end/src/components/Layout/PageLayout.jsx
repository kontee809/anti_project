import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import TopBar from './TopBar';

const PageLayout = () => {
  return (
    <div className="flex w-full h-screen app-shell-bg text-slate-800 overflow-hidden">
      <Navbar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
