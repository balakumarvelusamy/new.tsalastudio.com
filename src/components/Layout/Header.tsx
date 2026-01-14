import { usePathname } from 'next/navigation';
import Link from 'next/link';
import config from '../../config.json';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';

const Header = () => {
    const pathname = usePathname();
    const { cartCount } = useCart();

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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </Link>
                        <Link href="/login" className="p-2 text-white hover:text-primary">
                            <span className="sr-only">Login</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
