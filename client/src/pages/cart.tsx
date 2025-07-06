import { Minus, Plus, X, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/currency";

export default function Cart() {
  const { items, total, updateQuantity, removeItem } = useCart();

  const shippingCost = 100;
  const finalTotal = total + shippingCost;

  return (
    <>
      <Navbar />
      
      <div className="pt-16 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-8">
            <Link href="/products">
              <Button variant="ghost" className="text-gold hover:text-gold/80">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-gold mb-2 sm:mb-4">Shopping Cart</h1>
            <p className="text-sm sm:text-base text-gray-300">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-8" />
              <h2 className="text-2xl font-playfair font-bold text-gray-300 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-400 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link href="/products">
                <Button className="bg-gold text-black hover:bg-gold/90">
                  Shop Now
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.product.id} className="card-luxury">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                          />
                          {item.product.stock < 5 && item.product.stock > 0 && (
                            <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs">
                              Low Stock
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex-1 w-full sm:w-auto">
                          <h3 className="text-lg sm:text-xl font-playfair font-semibold text-foreground mb-2">
                            {item.product.name}
                          </h3>
                          <p className="text-gray-400 text-xs sm:text-sm mb-2 line-clamp-2">
                            {item.product.description}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <Badge variant="outline" className="border-gold text-gold w-fit">
                              {item.product.category}
                            </Badge>
                            <span className="text-gold font-bold text-sm sm:text-base">
                              {formatPrice(item.product.price)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="h-8 w-8 border-border"
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <span className="w-8 sm:w-12 text-center font-medium text-sm sm:text-base">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="h-8 w-8 border-border"
                            >
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                          
                          <div className="text-left sm:text-right flex sm:block justify-between w-full sm:w-auto">
                            <div className="text-lg sm:text-xl font-bold text-gold">
                              {formatPrice(Number(item.product.price) * item.quantity)}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.product.id)}
                              className="text-red-400 hover:text-red-300 text-xs sm:text-sm p-1 sm:p-2"
                            >
                              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <Card className="card-luxury sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-playfair font-bold text-gold mb-6">
                      Order Summary
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
                        </span>
                        <span className="text-foreground font-medium">
                          {formatPrice(total)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Shipping</span>
                        <span className="text-foreground font-medium">
                          {formatPrice(shippingCost)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Tax</span>
                        <span>Calculated at checkout</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gold">Total</span>
                        <span className="text-gold">{formatPrice(finalTotal)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Link href="/checkout">
                        <Button className="w-full bg-gold text-black hover:bg-gold/90">
                          Proceed to Checkout
                        </Button>
                      </Link>
                      <Link href="/products">
                        <Button
                          variant="outline"
                          className="w-full border-gold text-gold hover:bg-gold hover:text-black"
                        >
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="mt-6 p-4 bg-secondary rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Free shipping on orders over ৳5,000</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">30-day return policy</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
