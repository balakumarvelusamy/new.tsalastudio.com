import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import config from '../../config.json';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import secureLocalStorage from 'react-secure-storage';

const Header = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { cartCount } = useCart();
    const [userName, setUserName] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check for client-side session
        const name = secureLocalStorage.getItem('tsalaname') as string;
        if (name) setUserName(name);
    }, [pathname]); // Re-check on route change if needed, or just mount

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        secureLocalStorage.clear();
        setUserName(null);
        setIsDropdownOpen(false);
        router.push('/');
        window.location.reload(); // Ensure clean state
    };

    return (
        <header className="sticky top-0 z-50 bg-black text-white border-b border-gray-800 shadow-sm">
            <div className="container mx-auto px-4 lg:px-12 max-w-[1440px]">
                <div className="flex flex-wrap md:flex-nowrap justify-between items-center py-4 md:py-0 md:h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center order-1">
                        <Link href="/" className="flex items-center gap-2">
                            {config.logo ? (
                                <img className="h-10 w-auto object-contain" src={config.logo} alt={config.title} />
                            ) : (
                                <span className="text-2xl font-bold font-heading text-primary">Tsala Studio</span>
                            )}
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="order-3 md:order-2 w-full md:w-auto flex flex-wrap justify-center gap-4 md:gap-8 mt-4 md:mt-0">
                        {[
                            { name: 'Home', href: '/' },
                            { name: 'About Us', href: '/about' },
                            { name: 'Courses', href: '/courses' },
                            { name: 'Blog', href: '/blog' },
                            { name: 'Shop', href: '/shop' },
                            { name: 'Contact', href: '/contact' },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${pathname === item.href
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-white hover:text-primary'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right/User Actions */}
                    <div className="order-2 md:order-3 flex items-center space-x-4">
                        <Link href="/shop/cart" className="p-2 text-white hover:text-primary relative group">
                            <span className="sr-only">Cart</span>
                            <div className="relative">
                                <ShoppingCartIcon className="w-6 h-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </Link>

                        {userName ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 p-2 text-white hover:text-primary focus:outline-none"
                                >
                                    <UserIcon className="w-6 h-6" />
                                    <span className="hidden md:inline text-sm font-medium max-w-[100px] truncate">{userName}</span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                                            <p className="text-sm font-bold truncate">{userName}</p>
                                        </div>
                                        <Link
                                            href="/shop/profile"
                                            className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-primary"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            href="/shop/orders"
                                            className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-primary"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Order History
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="p-2 text-white hover:text-primary">
                                <span className="sr-only">Login</span>
                                <UserIcon className="w-6 h-6" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
