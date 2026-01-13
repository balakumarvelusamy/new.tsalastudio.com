import Link from 'next/link';
import config from '../../config.json';

const Footer = () => {
    return (
        <footer className="relative bg-primary text-white pt-16 pb-8 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/banner.jpg"
                    alt="Footer Background"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-black/80" />
            </div>

            <div className="relative z-10 container-custom">
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
                            <a href={config.fb || '#'} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-secondary p-3 rounded-full transition-all hover:-translate-y-1">
                                <span className="sr-only">Facebook</span>
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                            </a>
                            <a href={config.insta || '#'} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-secondary p-3 rounded-full transition-all hover:-translate-y-1">
                                <span className="sr-only">Instagram</span>
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.53c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                            </a>
                            <a href={config.pins || '#'} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-secondary p-3 rounded-full transition-all hover:-translate-y-1">
                                <span className="sr-only">Pinterest</span>
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.487-.69-2.425-2.862-2.425-4.632 0-3.77 2.733-7.229 7.892-7.229 4.144 0 7.365 2.953 7.365 6.899 0 4.117-2.595 7.431-6.199 7.431-1.211 0-2.348-.63-2.738-1.373 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.525 24.3 10.763 24.463 12.017 24.463c6.627 0 11.985-5.365 11.985-11.987C23.97 5.381 18.646.02 12.017.02z" /></svg>
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
                                <Link href="/terms-conditions" className="hover:text-secondary transition-colors">Terms & Conditions</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 mt-8 text-center md:flex md:justify-between md:text-left text-gray-400 text-sm">
                    <p>© {new Date().getFullYear()} Tsala Quilting Studio. All rights reserved.</p>
                    <p>Developed by <a href="https://www.theuniquecreations.com" target="_blank" className="text-white hover:text-secondary">Unique Creations</a></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
