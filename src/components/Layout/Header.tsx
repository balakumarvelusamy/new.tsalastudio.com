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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const allNavItems = [
        { name: 'Home', href: '/' },
        { name: 'Courses', href: '/courses' },
        { name: 'Workshops', href: '/workshops' },
        { name: 'Shop', href: '/shop' },
        { name: 'Rent Out Studio', href: '/rent-out-studio' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Blog', href: '/blog' },
    ];

    const mobileVisibleItems = ['Home', 'Courses', 'Shop', 'Contact Us'];
    const primaryMobileNav = allNavItems.filter(item => mobileVisibleItems.includes(item.name));
    const secondaryMobileNav = allNavItems.filter(item => !mobileVisibleItems.includes(item.name));

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check for client-side session
        const name = secureLocalStorage.getItem('tsalaname') as string;
        if (name) setUserName(name);
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const query = (form.elements.namedItem('q') as HTMLInputElement).value;
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsMobileMenuOpen(false);
        }
    };

    const handleLogout = () => {
        secureLocalStorage.clear();
        setUserName(null);
        setIsDropdownOpen(false);
        router.push('/');
        window.location.reload();
    };

    return (
        <header className="sticky top-0 z-50 bg-[#1d788f] text-white border-b border-gray-800 shadow-sm relative">
            <div className="container mx-auto px-4 lg:px-12 max-w-[1440px]">
                <div className="flex flex-wrap md:flex-nowrap justify-between items-center py-4 md:py-0 md:h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center order-1">
                        <Link href="/" className="flex items-center gap-2">
                            {config.logo ? (
                                <img className="h-11 w-auto object-contain rounded-xl" src={config.logo} alt={config.title} />
                            ) : (
                                <span className="text-2xl font-bold font-heading text-primary">Tsala Studio</span>
                            )}
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="order-3 md:order-2 w-full md:w-auto flex flex-wrap justify-center gap-4 md:gap-8 mt-4 md:mt-0 hidden md:flex">
                        {allNavItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${pathname === item.href
                                    ? 'text-white border-b-2 border-white'
                                    : 'text-white hover:text-gray-200'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="order-2 md:order-3 flex items-center space-x-2 md:space-x-4">
                        {/* Desktop Search Bar */}
                        <form
                            onSubmit={handleSearchSubmit}
                            className="hidden md:block relative"
                        >
                            <input
                                type="text"
                                name="q"
                                placeholder="Search..."
                                className="bg-white/10 text-white placeholder-gray-300 rounded-full py-1.5 px-4 pl-10 text-sm focus:outline-none focus:bg-white/20 border border-transparent focus:border-white/30 transition-all w-32 focus:w-48"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </form>

                        <Link href="/shop/cart" className="p-1 md:p-2 text-white hover:text-gray-200 relative group">
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
                                    className="flex items-center gap-2 p-1 md:p-2 text-white hover:text-gray-200 focus:outline-none"
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
                            <Link href="/login" className="p-1 md:p-2 text-white hover:text-gray-200">
                                <span className="sr-only">Login</span>
                                <UserIcon className="w-6 h-6" />
                            </Link>
                        )}


                    </div>

                    {/* Mobile Search Bar (Full Width) */}
                    <div className="w-full mt-3 md:hidden order-4">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                name="q"
                                placeholder="Search courses, workshops, products..."
                                className="w-full bg-white/10 text-white placeholder-gray-300 rounded-lg py-2.5 px-4 pl-10 text-sm focus:outline-none focus:bg-white/20 border border-transparent focus:border-white/30 transition-all"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </form>
                    </div>

                    {/* Mobile Primary Navigation (Horizontal Scroll) */}
                    {/* Mobile Primary Navigation (Horizontal Scroll) and Right-Aligned Toggle */}
                    <div className="w-full md:hidden order-5 mt-4 flex items-center justify-between border-b border-white/10 pb-2">
                        <nav className="flex-1 overflow-x-auto scrollbar-hide mr-4">
                            <div className="flex gap-6 min-w-max px-1">
                                {primaryMobileNav.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`text-sm font-medium whitespace-nowrap transition-colors ${pathname === item.href
                                            ? 'text-white border-b-2 border-white'
                                            : 'text-white hover:text-gray-200'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </nav>

                        {/* Hamburger Menu Toggle (Right Aligned) */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="flex-shrink-0 flex items-center gap-1 text-sm font-medium text-white hover:text-gray-200 focus:outline-none"
                        >
                            <span className="sr-only">Menu</span>
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="w-6 h-6" />
                            ) : (
                                <Bars3Icon className="w-6 h-6" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Collapsible Menu (Overlay) */}
                    {isMobileMenuOpen && (
                        <div className="absolute top-full left-0 w-full bg-[#186477] z-50 shadow-xl border-t border-white/10 animate-fadeIn md:hidden">
                            <nav className="flex flex-col p-4 space-y-3">
                                {secondaryMobileNav.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`text-sm font-medium px-2 py-1.5 rounded transition-colors ${pathname === item.href
                                            ? 'bg-white/10 text-white'
                                            : 'text-gray-200 hover:bg-white/5 hover:text-white'
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
