import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Mail, Phone, Calendar, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCustomers() {
  const { data: customers, isLoading, error } = useQuery({
    queryKey: ["/api/customers"],
  });

  const { data: orders } = useQuery({
    queryKey: ["/api/orders"],
  });

  const getCustomerOrderCount = (customerId: string) => {
    if (!orders) return 0;
    return orders.filter((order: any) => order.customerId === customerId).length;
  };

  const getCustomerTotalSpent = (customerId: string) => {
    if (!orders) return 0;
    return orders
      .filter((order: any) => order.customerId === customerId)
      .reduce((total: number, order: any) => total + parseFloat(order.total || 0), 0);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="text-center text-red-400">
          Error loading customers: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="icon" className="text-gold">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-foreground">Customer Management</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-luxury">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Customers</p>
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? <Skeleton className="h-6 w-16" /> : customers?.length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Customers</p>
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? <Skeleton className="h-6 w-16" /> : customers?.length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? <Skeleton className="h-6 w-16" /> : orders?.length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers List */}
        <Card className="card-luxury">
          <CardHeader>
            <CardTitle className="text-gold">Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : customers && customers.length > 0 ? (
              <div className="space-y-4">
                {customers.map((customer: any) => {
                  const orderCount = getCustomerOrderCount(customer.id);
                  const totalSpent = getCustomerTotalSpent(customer.id);
                  
                  return (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-gold/10 rounded-full flex items-center justify-center">
                          <span className="text-gold font-medium">
                            {customer.firstName?.[0]}{customer.lastName?.[0]}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-foreground">
                            {customer.firstName} {customer.lastName}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{customer.email}</span>
                            </div>
                            {customer.phone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="h-3 w-3" />
                                <span>{customer.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-center">
                          <Badge variant="secondary" className="mb-1">
                            {orderCount} orders
                          </Badge>
                          <p className="text-gray-400">
                            ${totalSpent.toFixed(2)} spent
                          </p>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Joined {new Date(customer.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No customers found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}