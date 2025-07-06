import {
  Product,
  Customer,
  Order,
  OrderItem,
  ContactMessage,
  Review
} from "./models";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export interface IStorage {
  // Product operations
  getProducts(): Promise<any[]>;
  getProductById(id: string): Promise<any>;
  getProductsByCategory(category: string): Promise<any[]>;
  createProduct(product: any): Promise<any>;
  updateProduct(id: string, product: any): Promise<any>;
  deleteProduct(id: string): Promise<boolean>;
  updateProductStock(id: string, stock: number): Promise<void>;

  // Customer operations
  getCustomers(): Promise<any[]>;
  getCustomerById(id: string): Promise<any>;
  getCustomerByEmail(email: string): Promise<any>;
  createCustomer(customer: any): Promise<any>;
  updateCustomer(id: string, customer: any): Promise<any>;

  // Order operations
  getOrders(): Promise<any[]>;
  getOrderById(id: string): Promise<any>;
  getOrdersByCustomer(customerId: string): Promise<any[]>;
  createOrder(order: any, items: any[]): Promise<any>;
  updateOrderStatus(id: string, status: string): Promise<void>;
  getOrderStats(): Promise<{
    totalSales: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
  }>;

  // Contact message operations
  getContactMessages(): Promise<any[]>;
  createContactMessage(message: any): Promise<any>;
  markMessageAsRead(id: string): Promise<void>;

  // Authentication operations
  registerCustomer(customer: any): Promise<any>;
  loginCustomer(email: string, password: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Helper methods to convert MongoDB documents to our types
  private mongoToProduct(doc: any): any {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      price: doc.price.toString(),
      category: doc.category,
      imageUrl: doc.image,
      stock: doc.stock,
      isActive: doc.isActive,
      averageRating: doc.rating ? doc.rating.toString() : null,
      totalReviews: doc.reviewCount || 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  private mongoToCustomer(doc: any): any {
    return {
      id: doc._id.toString(),
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      password: doc.password,
      phone: doc.phone,
      address: doc.address,
      createdAt: doc.createdAt
    };
  }

  private mongoToOrder(doc: any): any {
    return {
      id: doc._id.toString(),
      customerId: doc.customerId ? doc.customerId.toString() : null,
      status: doc.status,
      shippingAddress: doc.shippingAddress,
      customerName: doc.customerName || '',
      customerEmail: doc.customerEmail || '',
      customerPhone: doc.customerPhone || null,
      totalAmount: doc.total.toString(),
      orderDate: doc.createdAt,
      shippedAt: doc.shippedAt || null,
      deliveredAt: doc.deliveredAt || null
    };
  }

  private mongoToOrderItem(doc: any): any {
    return {
      id: doc._id.toString(),
      orderId: doc.orderId.toString(),
      productId: doc.productId.toString(),
      quantity: doc.quantity,
      price: doc.price.toString()
    };
  }

  private mongoToContactMessage(doc: any): any {
    return {
      id: doc._id.toString(),
      firstName: doc.name || doc.firstName || '',
      lastName: doc.lastName || '',
      email: doc.email,
      message: doc.message,
      isRead: doc.isRead,
      createdAt: doc.createdAt
    };
  }

  // Product operations
  async getProducts(): Promise<any[]> {
    try {
      const products = await Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .lean() // Use lean() for better performance
        .exec();
      return products.map(this.mongoToProduct);
    } catch (error) {
      console.log('Database not connected, returning sample data');
      return this.getSampleProducts();
    }
  }

  private getSampleProducts(): any[] {
    return [
      {
        id: '1',
        name: 'Midnight Elegance',
        description: 'A sophisticated blend of bergamot, jasmine, and sandalwood',
        price: '125.00',
        category: 'Luxury',
        imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
        stock: 50,
        isActive: true,
        averageRating: '4.8',
        totalReviews: 127,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2', 
        name: 'Ocean Breeze',
        description: 'Fresh aquatic notes with hints of sea salt and citrus',
        price: '98.00',
        category: 'Fresh',
        imageUrl: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400',
        stock: 75,
        isActive: true,
        averageRating: '4.6',
        totalReviews: 89,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Royal Amber',
        description: 'Rich amber and vanilla with warm spices',
        price: '156.00',
        category: 'Oriental',
        imageUrl: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400',
        stock: 30,
        isActive: true,
        averageRating: '4.9',
        totalReviews: 203,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async getProductById(id: string): Promise<any> {
    try {
      const product = await Product.findById(id).lean().exec();
      return product ? this.mongoToProduct(product) : undefined;
    } catch (error) {
      console.log('Database not connected, returning sample data');
      return this.getSampleProducts().find(p => p.id === id);
    }
  }

  async getProductsByCategory(category: string): Promise<any[]> {
    const products = await Product.find({ category, isActive: true });
    return products.map(this.mongoToProduct);
  }

  async createProduct(product: any): Promise<any> {
    const newProduct = new Product({
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      category: product.category,
      image: product.imageUrl,
      stock: product.stock,
      isActive: product.isActive,
      rating: product.averageRating ? parseFloat(product.averageRating) : 0,
      reviewCount: product.totalReviews || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const saved = await newProduct.save();
    return this.mongoToProduct(saved);
  }

  async updateProduct(id: string, product: any): Promise<any> {
    const updateData: any = { updatedAt: new Date() };
    if (product.name) updateData.name = product.name;
    if (product.description) updateData.description = product.description;
    if (product.price) updateData.price = parseFloat(product.price);
    if (product.category) updateData.category = product.category;
    if (product.imageUrl) updateData.image = product.imageUrl;
    if (product.stock !== undefined) updateData.stock = product.stock;
    if (product.isActive !== undefined) updateData.isActive = product.isActive;
    if (product.averageRating) updateData.rating = parseFloat(product.averageRating);
    if (product.totalReviews !== undefined) updateData.reviewCount = product.totalReviews;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    return updatedProduct ? this.mongoToProduct(updatedProduct) : undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await Product.findByIdAndUpdate(id, { isActive: false });
    return !!result;
  }

  async updateProductStock(id: string, stock: number): Promise<void> {
    await Product.findByIdAndUpdate(id, { stock, updatedAt: new Date() });
  }

  // Customer operations
  async getCustomers(): Promise<any[]> {
    const customers = await Customer.find().sort({ createdAt: -1 });
    return customers.map(this.mongoToCustomer);
  }

  async getCustomerById(id: string): Promise<any> {
    const customer = await Customer.findById(id);
    return customer ? this.mongoToCustomer(customer) : undefined;
  }

  async getCustomerByEmail(email: string): Promise<any> {
    const customer = await Customer.findOne({ email });
    return customer ? this.mongoToCustomer(customer) : undefined;
  }

  async createCustomer(customer: any): Promise<any> {
    const newCustomer = new Customer({
      ...customer,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const saved = await newCustomer.save();
    return this.mongoToCustomer(saved);
  }

  async updateCustomer(id: string, customer: any): Promise<any> {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { ...customer, updatedAt: new Date() },
      { new: true }
    );
    return updatedCustomer ? this.mongoToCustomer(updatedCustomer) : undefined;
  }

  // Order operations
  async getOrders(): Promise<any[]> {
    const orders = await Order.find().sort({ createdAt: -1 });
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id }).populate('productId');
        const orderData = this.mongoToOrder(order);
        return {
          ...orderData,
          items: items.map(item => ({
            ...this.mongoToOrderItem(item),
            product: this.mongoToProduct(item.productId)
          }))
        };
      })
    );
    return ordersWithItems;
  }

  async getOrderById(id: string): Promise<any> {
    const order = await Order.findById(id);
    if (!order) return undefined;

    const items = await OrderItem.find({ orderId: id }).populate('productId');
    const orderData = this.mongoToOrder(order);
    return {
      ...orderData,
      items: items.map(item => ({
        ...this.mongoToOrderItem(item),
        product: this.mongoToProduct(item.productId)
      }))
    };
  }

  async getOrdersByCustomer(customerId: string): Promise<any[]> {
    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id }).populate('productId');
        const orderData = this.mongoToOrder(order);
        return {
          ...orderData,
          items: items.map(item => ({
            ...this.mongoToOrderItem(item),
            product: this.mongoToProduct(item.productId)
          }))
        };
      })
    );
    return ordersWithItems;
  }

  async createOrder(order: any, items: any[]): Promise<any> {
    // Parse shipping address to extract components
    const shippingParts = order.shippingAddress.split(', ');
    const [address, city, stateZip] = shippingParts;
    const [state, zipCode] = stateZip ? stateZip.split(' ') : ['', ''];

    const newOrder = new Order({
      customerId: null, // For guest orders
      status: order.status || 'pending',
      total: parseFloat(order.totalAmount || order.total),
      shippingAddress: address || order.shippingAddress,
      shippingCity: city || 'Unknown',
      shippingState: state || 'Unknown',
      shippingZipCode: zipCode || '00000',
      shippingCountry: 'US', // Default to US
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone || '',
      paymentMethod: 'Credit Card', // Default payment method
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const savedOrder = await newOrder.save();

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const newOrderItem = new OrderItem({
          orderId: savedOrder._id,
          productId: item.productId,
          quantity: item.quantity,
          price: parseFloat(item.price)
        });
        return await newOrderItem.save();
      })
    );

    // Update product stock
    await Promise.all(
      items.map(async (item) => {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      })
    );

    // Get populated items
    const populatedItems = await OrderItem.find({ orderId: savedOrder._id }).populate('productId');
    
    return {
      ...this.mongoToOrder(savedOrder),
      items: populatedItems.map(item => ({
        ...this.mongoToOrderItem(item),
        product: this.mongoToProduct(item.productId)
      }))
    };
  }

  async updateOrderStatus(id: string, status: string): Promise<void> {
    await Order.findByIdAndUpdate(id, { status, updatedAt: new Date() });
  }

  async getOrderStats(): Promise<{
    totalSales: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
  }> {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    const salesResult = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: '$total' } } }
    ]);
    const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;

    return {
      totalSales,
      totalOrders,
      pendingOrders,
      completedOrders
    };
  }

  // Contact message operations
  async getContactMessages(): Promise<any[]> {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return messages.map(this.mongoToContactMessage);
  }

  async createContactMessage(message: any): Promise<any> {
    const newMessage = new ContactMessage({
      name: message.firstName || message.name,
      email: message.email,
      subject: message.subject || 'Contact Form Message',
      message: message.message,
      isRead: false,
      createdAt: new Date(),
    });
    const saved = await newMessage.save();
    return this.mongoToContactMessage(saved);
  }

  async markMessageAsRead(id: string): Promise<void> {
    await ContactMessage.findByIdAndUpdate(id, { isRead: true });
  }

  // Authentication operations
  async registerCustomer(customerData: any): Promise<any> {
    const existingCustomer = await Customer.findOne({ email: customerData.email });
    if (existingCustomer) {
      throw new Error("Customer already exists");
    }

    const hashedPassword = await bcrypt.hash(customerData.password, 10);
    const newCustomer = new Customer({
      ...customerData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const saved = await newCustomer.save();
    return this.mongoToCustomer(saved);
  }

  async loginCustomer(email: string, password: string): Promise<any> {
    const customer = await Customer.findOne({ email });
    if (!customer) return null;

    const isValidPassword = await bcrypt.compare(password, customer.password);
    if (!isValidPassword) return null;

    return this.mongoToCustomer(customer);
  }
}

export const storage = new DatabaseStorage();