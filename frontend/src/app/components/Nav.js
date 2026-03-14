"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logout } from "../../redux/slices/userSlice";

export default function Nav() {
    const { token } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const router = useRouter();

    const isLoggedIn = !!token;

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    return (
        <div className="bg-gray-800 border-b border-gray-700 flex flex-row justify-between items-center w-full p-4 md:px-8">
            {/* Logo  section*/}
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text hover:scale-105 transition-transform cursor-pointer">
                Task App
            </Link>

            <div className="flex gap-x-4 items-center">
                 {!isLoggedIn && (
                    <Link href="/register" className="text-gray-300 hover:text-white font-medium hover:scale-95 transition-all duration-200">
                        Sign up
                    </Link>
                )}
                {!isLoggedIn && (
                    <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-95 transition-all duration-200">
                        Sign in
                    </Link>
                )}

                {isLoggedIn && (
                    <Link href="/dashboard" className="text-gray-300 hover:text-white font-medium hover:scale-95 transition-all duration-200 mr-2">
                        Dashboard
                    </Link>
                )}

                {isLoggedIn && (
                    <button 
                        onClick={handleLogout}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md hover:scale-95 transition-all duration-200 border border-gray-600"
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
}