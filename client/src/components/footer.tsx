import { Facebook, Instagram, Twitter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-background py-8 sm:py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center sm:text-left">
            <div className="text-xl sm:text-2xl font-playfair font-bold text-gold mb-3 sm:mb-4">Avancé</div>
            <p className="text-luxury-muted mb-4 text-sm sm:text-base">
              Crafting exceptional fragrances for the discerning individual.
            </p>
            <div className="flex space-x-3 sm:space-x-4 justify-center sm:justify-start">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gold h-8 w-8 sm:h-10 sm:w-10">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gold h-8 w-8 sm:h-10 sm:w-10">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gold h-8 w-8 sm:h-10 sm:w-10">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
          
          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-gold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2 text-luxury-muted text-sm sm:text-base">
              <li>
                <Link href="/">
                  <span className="hover:text-gold transition-colors cursor-pointer">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <span className="hover:text-gold transition-colors cursor-pointer">Products</span>
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-gold transition-colors">About</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-gold transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-gold mb-3 sm:mb-4 text-sm sm:text-base">Categories</h4>
            <ul className="space-y-1 sm:space-y-2 text-luxury-muted text-sm sm:text-base">
              <li>
                <Link href="/products?category=men">
                  <span className="hover:text-gold transition-colors cursor-pointer">Men's Fragrances</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=women">
                  <span className="hover:text-gold transition-colors cursor-pointer">Women's Perfumes</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=unisex">
                  <span className="hover:text-gold transition-colors cursor-pointer">Unisex Scents</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=limited">
                  <span className="hover:text-gold transition-colors cursor-pointer">Limited Editions</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center sm:text-left lg:col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="font-semibold text-gold mb-3 sm:mb-4 text-sm sm:text-base">Newsletter</h4>
            <p className="text-luxury-muted mb-4 text-sm sm:text-base">
              Stay updated with our latest fragrances and offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Input
                placeholder="Your email"
                className="flex-1 sm:rounded-r-none bg-secondary border-border text-sm"
              />
              <Button className="sm:rounded-l-none bg-gold text-black hover:bg-gold/90 text-sm">
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="ml-1 sm:hidden">Subscribe</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-luxury-muted">
          <p>&copy; 2024 Avancé Apparel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
