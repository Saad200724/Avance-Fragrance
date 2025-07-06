import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, User, Menu, X, LogOut, Home, Package, Info, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CartOverlay } from "./cart-overlay";

export function Navbar() {
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount, toggleCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  // Handle scroll effect for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home", icon: Home, active: location === "/" },
    { href: "/products", label: "Products", icon: Package, active: location === "/products" },
    { href: "/about", label: "About", icon: Info, active: location === "/about" },
    { href: "/contact", label: "Contact", icon: Mail, active: location === "/contact" },
  ];

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50' 
          : 'bg-background/60 backdrop-blur-sm border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/">
              <div className="text-2xl font-playfair font-bold text-gold cursor-pointer transform hover:scale-105 transition-transform duration-200">
                Avancé
              </div>
            </Link>

            {/* Desktop Navigation - Hidden below 846px */}
            <div className="hidden lg:flex space-x-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className={`text-gray-300 hover:text-gold transition-all duration-200 cursor-pointer relative group ${
                    item.active ? 'text-gold' : ''
                  }`}>
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-200 group-hover:w-full"></span>
                  </span>
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Search - Hidden below medium screens */}
              <div className="relative hidden md:block">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-gray-300 hover:text-gold transform hover:scale-105 transition-all duration-200"
                >
                  <Search className="h-5 w-5" />
                </Button>
                {isSearchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 lg:w-80 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-xl p-4 z-50 animate-in slide-in-from-top-1 duration-200">
                    <Input
                      placeholder="Search products..."
                      className="w-full bg-secondary/80 border-border"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Cart */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleCart}
                  className="text-gray-300 hover:text-gold transform hover:scale-105 transition-all duration-200"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gold text-black text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* User */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-300 hover:text-gold transform hover:scale-105 transition-all duration-200"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-md border-border animate-in slide-in-from-top-1 duration-200">
                    <DropdownMenuItem className="text-gray-300">
                      Welcome, {user?.firstName}!
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => logout()}
                      className="text-gray-300 hover:text-gold cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden lg:flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" className="text-gray-300 hover:text-gold text-sm transform hover:scale-105 transition-all duration-200">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-gold text-black hover:bg-gold/90 text-sm transform hover:scale-105 transition-all duration-200">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}



              {/* Mobile Menu Button - Shows below 1024px (lg) */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="lg:hidden text-gray-300 hover:text-gold transform hover:scale-105 transition-all duration-200"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background/95 backdrop-blur-md border-border w-[280px] animate-in slide-in-from-right duration-300">
                  <div className="flex flex-col space-y-6 mt-8">
                    {/* Mobile Search */}
                    <div className="md:hidden">
                      <Input
                        placeholder="Search products..."
                        className="w-full bg-secondary/80 border-border"
                      />
                    </div>
                    
                    {/* Navigation Items */}
                    <div className="space-y-4">
                      {navItems.map((item, index) => (
                        <Link key={item.href} href={item.href}>
                          <div 
                            className={`flex items-center space-x-3 text-gray-300 hover:text-gold transition-all duration-200 cursor-pointer text-lg p-2 rounded-lg hover:bg-secondary/50 ${
                              item.active ? 'text-gold bg-secondary/30' : ''
                            }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    {/* Mobile Auth Buttons */}
                    {!isAuthenticated && (
                      <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                        <Link href="/login">
                          <Button variant="ghost" className="text-gray-300 hover:text-gold w-full justify-start transform hover:scale-105 transition-all duration-200">
                            <User className="mr-2 h-4 w-4" />
                            Login
                          </Button>
                        </Link>
                        <Link href="/signup">
                          <Button className="bg-gold text-black hover:bg-gold/90 w-full transform hover:scale-105 transition-all duration-200">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )}

                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <CartOverlay />
    </>
  );
}
