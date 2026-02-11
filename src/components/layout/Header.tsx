import { useState } from "react";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { Link } from "react-router-dom";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const toggleSubmenu = (name: string) => {
        setOpenSubmenu(openSubmenu === name ? null : name);
    };

    const navLinks = [
        { name: "HOME", href: "https://shinypathcleaning.ca/" },
        { name: "ABOUT US", href: "https://shinypathcleaning.ca/about-us/" },
        {
            name: "SERVICES",
            href: "https://shinypathcleaning.ca/services/",
            dropdown: [
                { name: "House Cleaning", href: "https://shinypathcleaning.ca/services/house-cleaning/" },
                { name: "Office Cleaning", href: "https://shinypathcleaning.ca/services/office-cleaning/" },
                { name: "Post-Construction Cleaning", href: "https://shinypathcleaning.ca/services/post-construction-cleaning/" }
            ]
        },
        { name: "CONTACT", href: "/contact" },
    ];

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 w-full transition-all duration-300 border-t-[5px] border-[#283D8F]">
            <div className="container mx-auto px-4 h-24 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex-shrink-0">
                    <img
                        src="/shiny-path-logo.png"
                        alt="Shiny Path Cleaning"
                        className="w-[130px] md:w-[150px] h-auto"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    <nav className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <div key={link.name} className="relative group">
                                {link.dropdown ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="flex items-center gap-1 font-ubuntu text-[#283D8F] text-[16px] font-normal hover:text-[#283D8F]/80 uppercase tracking-wide outline-none">
                                            {link.name} <ChevronDown className="w-4 h-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56 bg-white border-gray-100 shadow-lg rounded-sm mt-2 p-0">
                                            {link.dropdown.map((item) => (
                                                <DropdownMenuItem key={item.name} className="p-0">
                                                    <Link
                                                        to={item.href}
                                                        className="w-full px-6 py-3 text-gray-600 hover:text-[#283D8F] hover:bg-gray-50 text-sm font-ubuntu transition-colors"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Link
                                        to={link.href}
                                        className="font-ubuntu text-[#283D8F] text-[16px] font-normal hover:text-[#283D8F]/80 uppercase tracking-wide transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    <Link to="/">
                        <button className="border-[1.5px] border-[#283D8F] text-[#283D8F] px-6 py-3 rounded-[2px] font-ubuntu font-semibold text-sm uppercase tracking-wide hover:bg-[#283D8F] hover:text-white transition-all duration-300">
                            GET ESTIMATE PRICE
                        </button>
                    </Link>
                </div>

                {/* Mobile Navigation */}
                <div className="lg:hidden flex items-center">
                    <button
                        className="text-[#283D8F] p-2 relative z-50"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>

                    {/* Mobile Menu Overlay */}
                    <div
                        className={`
                            absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-100
                            transition-all duration-500 ease-in-out overflow-hidden flex flex-col
                            ${isOpen ? 'max-h-[calc(100vh-6rem)] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}
                        `}
                        style={{ height: isOpen ? 'calc(100vh - 96px)' : '0' }}
                    >
                        <nav className="flex flex-col items-center justify-start pt-8 pb-10 px-6 gap-6 overflow-y-auto h-full">
                            {navLinks.map((link) => (
                                <div key={link.name} className="w-full flex flex-col items-center">
                                    {link.dropdown ? (
                                        <div className="w-full flex flex-col items-center">
                                            <button
                                                onClick={() => toggleSubmenu(link.name)}
                                                className="flex items-center justify-center gap-2 font-ubuntu text-[#283D8F] text-[16px] font-normal uppercase tracking-wide py-2"
                                            >
                                                {link.name}
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-transform duration-300 ${openSubmenu === link.name ? 'rotate-180' : ''}`}
                                                />
                                            </button>

                                            <div
                                                className={`
                                                    w-full overflow-hidden transition-all duration-300 ease-in-out flex flex-col items-center gap-4 bg-gray-50/50
                                                    ${openSubmenu === link.name ? 'max-h-64 py-4 mt-2 mb-2 opacity-100' : 'max-h-0 py-0 opacity-0'}
                                                `}
                                            >
                                                {link.dropdown.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        to={item.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className="font-ubuntu text-gray-600 hover:text-[#283D8F] text-sm py-1"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            to={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="font-ubuntu text-[#283D8F] text-[16px] font-normal uppercase tracking-wide hover:opacity-80 transition-opacity py-2"
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </div>
                            ))}

                            <div className="pt-4 w-full max-w-xs">
                                <Link to="/">
                                    <button className="w-full bg-[#283D8F] text-white px-6 py-4 rounded-[2px] font-ubuntu font-semibold text-sm uppercase tracking-wide hover:bg-[#283D8F]/90 transition-all">
                                        GET ESTIMATE PRICE
                                    </button>
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
