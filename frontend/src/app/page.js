import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Manage your tasks with <span className="text-blue-500">ease.</span>
        </h1>
        <p className="text-xl text-gray-400">
          A production-ready Task Management Application demonstrating strong backend architecture, authentication, and frontend integration.
        </p>
        <div className="flex gap-4 justify-center pt-8">
          <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-105">
            Get Started
          </Link>
          <Link href="/login" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-all hover:scale-105">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}