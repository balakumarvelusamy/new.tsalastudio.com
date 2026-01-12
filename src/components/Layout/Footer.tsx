import Link from 'next/link';
import config from '../../config.json';

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Contact Info */}
                    <div>
                        <h5 className="text-xl font-heading font-bold mb-6 text-white border-b border-white/10 pb-2 inline-block">Contact Us</h5>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="mt-1">📍</span>
                                <p>{config.contact_address}</p>
                            </li>
                            <li className="flex items-center gap-3">
                                <span>📞</span>
                                <p>{config.contact_phone1}</p>
                            </li>
                            <li className="flex items-center gap-3">
                                <span>📱</span>
                                <p>{config.contact_phone2}</p>
                            </li>
                            <li className="flex items-center gap-3">
                                <span>✉️</span>
                                <p className="lowercase">{config.contact_email}</p>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h5 className="text-xl font-heading font-bold mb-6 text-white border-b border-white/10 pb-2 inline-block">Quick Links</h5>
                        <ul className="space-y-2 text-gray-300">
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'About Us', href: '/about' },
                                { name: 'Courses', href: '/courses' },
                                { name: 'Blog', href: '/blog' },
                                { name: 'Shop', href: '/shop' },
                                { name: 'Contact', href: '/contact' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-secondary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Socials & Hours */}
                    <div>
                        <h5 className="text-xl font-heading font-bold mb-6 text-white border-b border-white/10 pb-2 inline-block">Connect</h5>
                        <div className="flex space-x-4 mb-8">
                            <a href={config.fb || '#'} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-secondary rounded-full transition-colors">
                                FB
                            </a>
                            <a href={config.insta || '#'} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-secondary rounded-full transition-colors">
                                IG
                            </a>
                            <a href={config.pins || '#'} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-secondary rounded-full transition-colors">
                                Pin
                            </a>
                        </div>

                        <h5 className="text-lg font-heading font-bold mb-4">Opening Hours</h5>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li className="flex justify-between">
                                <span>Mon - Fri</span>
                                <span>10AM - 6PM</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Saturday</span>
                                <span>By Appointment</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Sunday</span>
                                <span>Closed</span>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h5 className="text-xl font-heading font-bold mb-6 text-white border-b border-white/10 pb-2 inline-block">Legal</h5>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <Link href="/terms" className="hover:text-secondary transition-colors">Terms & Conditions</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 mt-8 text-center md:flex md:justify-between md:text-left text-gray-400 text-sm">
                    <p>© {new Date().getFullYear()} Tsala Quilting Studio. All rights reserved.</p>
                    <p>Developed by <a href="https://theuniquecreations.com" target="_blank" className="text-white hover:text-secondary">Unique Creations</a></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
