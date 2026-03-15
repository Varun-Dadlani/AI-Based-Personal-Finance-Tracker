import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
