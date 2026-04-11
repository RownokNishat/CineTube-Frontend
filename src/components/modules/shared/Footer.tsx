import Link from "next/link";
import { Film, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Brand & Intro */}
                <div className="space-y-4">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                        <Film className="size-6 text-primary" />
                        <span>CineTube</span>
                    </Link>
                    <p className="text-sm text-gray-400">
                        Your ultimate destination for discovering, rating, and exploring the best movies and TV series curated globally.
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                        <Link href="#" className="hover:text-white transition-colors"><Facebook className="size-5" /></Link>
                        <Link href="#" className="hover:text-white transition-colors"><Twitter className="size-5" /></Link>
                        <Link href="#" className="hover:text-white transition-colors"><Instagram className="size-5" /></Link>
                        <Link href="#" className="hover:text-white transition-colors"><Youtube className="size-5" /></Link>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/media" className="hover:text-white transition-colors">Browse Movies</Link></li>
                        <li><Link href="/media?mediaType=SERIES" className="hover:text-white transition-colors">TV Series</Link></li>
                        <li><Link href="/pricing" className="hover:text-white transition-colors">Premium Plans</Link></li>
                        <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h3 className="text-white font-semibold mb-4 text-lg">Resources</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/faq" className="hover:text-white transition-colors">Help Center & FAQ</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                        <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2 text-gray-400">
                            <MapPin className="size-4 shrink-0 mt-0.5" />
                            <span>123 Entertainment Blvd, Suite 400<br/>Hollywood, CA 90028</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-400">
                            <Phone className="size-4 shrink-0" />
                            <span>+1 (800) 123-4567</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-400">
                            <Mail className="size-4 shrink-0" />
                            <span>support@cinetube.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} CineTube. All rights reserved.</p>
            </div>
        </footer>
    );
}
