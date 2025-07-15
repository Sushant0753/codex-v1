'use client';
import { useState} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Moon, Sun, LogOut } from 'lucide-react'; 
import { useTheme } from './ThemeProvider';
import { useSession, signOut } from 'next-auth/react'; 

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const { data: session } = useSession();
    const pathname = usePathname() as string | null;

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    const isActivePage = (path: string): boolean => {
        return pathname === path;
    };

    // Navigation links data for DRY code
    const navLinks = [
        { path: '/problems', label: 'Problems' },
        { path: '/contests', label: 'Contests' },
        { path: '/leaderboard', label: 'Leaderboard' },
        { path: '/learn', label: 'Learn' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-100/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link href="/" className={`flex items-center ${isActivePage('/') ? 'text-blue-600 dark:text-blue-400' : 'text-blue-600 dark:text-blue-500'} hover:scale-105 transition-transform duration-200`}>
                                <span className="text-2xl font-bold">Codex</span>
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navLinks.map((link) => (
                                    <Link 
                                        key={link.path}
                                        href={link.path} 
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                                            ${isActivePage(link.path) 
                                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold' 
                                                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                                            } hover:scale-105`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <Sun size={20} />
                                ) : (
                                    <Moon size={20} />
                                )}
                            </button>
                            {session ? (
                                <>
                                    <Link href="/profile">
                                        <Button 
                                            variant="outline" 
                                            className={`border-gray-300 dark:border-gray-600 transition-all duration-200 hover:scale-105
                                                ${isActivePage('/profile') 
                                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold' 
                                                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            Profile
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => signOut()}
                                        variant="outline"
                                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500 transition-all duration-200 hover:scale-105 group"
                                    >
                                        <span>Log out</span>
                                        {/* <LogOut size={16} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" /> */}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button 
                                            variant="outline" 
                                            className={`border-gray-300 dark:border-gray-600 transition-all duration-200 hover:scale-105
                                                ${isActivePage('/login') 
                                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold' 
                                                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button 
                                            className={`transition-all duration-200 hover:scale-105
                                                ${isActivePage('/register') 
                                                    ? 'bg-blue-700 hover:bg-blue-800' 
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                                } text-white`}
                                        >
                                            Sign up
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleTheme}
                            className="p-2 mr-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun size={20} />
                            ) : (
                                <Moon size={20} />
                            )}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none transition-transform duration-200 hover:scale-110"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-100 dark:bg-gray-800">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.path}
                                href={link.path} 
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200
                                    ${isActivePage(link.path) 
                                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold' 
                                        : 'text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center px-5">
                            <div className="px-2 space-y-1 w-full">
                                {session ? (
                                    <>
                                        <Link 
                                            href="/profile" 
                                            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200
                                                ${isActivePage('/profile') 
                                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold' 
                                                    : 'text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            Profile
                                        </Link>
                                        <Button
                                            onClick={() => signOut()}
                                            className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center group"
                                        >
                                            <span>Sign out</span>
                                            <LogOut size={16} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link 
                                            href="/login" 
                                            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200
                                                ${isActivePage('/login') 
                                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold' 
                                                    : 'text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            Log in
                                        </Link>
                                        <Link 
                                            href="/register" 
                                            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200
                                                ${isActivePage('/register') 
                                                    ? 'bg-blue-700 text-white font-semibold' 
                                                    : 'text-blue-600 dark:text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            Sign up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}