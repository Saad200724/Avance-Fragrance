// server/index.ts
import "dotenv/config";
import express2 from "express";
import compression from "compression";
import helmet from "helmet";

// server/routes.ts
import { createServer } from "http";

// server/models.ts
import mongoose from "mongoose";
var productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
var customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
var reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});
var orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: false },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: false },
  status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
  total: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  shippingCity: { type: String, required: true },
  shippingState: { type: String, required: true },
  shippingZipCode: { type: String, required: true },
  shippingCountry: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
var orderItemSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});
var contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
var Product = mongoose.model("Product", productSchema);
var Customer = mongoose.model("Customer", customerSchema);
var Review = mongoose.model("Review", reviewSchema);
var Order = mongoose.model("Order", orderSchema);
var OrderItem = mongoose.model("OrderItem", orderItemSchema);
var ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

// server/storage-simple.ts
import bcrypt from "bcryptjs";
var DatabaseStorage = class {
  // Helper methods to convert MongoDB documents to our types
  mongoToProduct(doc) {
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
  mongoToCustomer(doc) {
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
  mongoToOrder(doc) {
    return {
      id: doc._id.toString(),
      customerId: doc.customerId ? doc.customerId.toString() : null,
      status: doc.status,
      shippingAddress: doc.shippingAddress,
      customerName: doc.customerName || "",
      customerEmail: doc.customerEmail || "",
      customerPhone: doc.customerPhone || null,
      totalAmount: doc.total.toString(),
      orderDate: doc.createdAt,
      shippedAt: doc.shippedAt || null,
      deliveredAt: doc.deliveredAt || null
    };
  }
  mongoToOrderItem(doc) {
    return {
      id: doc._id.toString(),
      orderId: doc.orderId.toString(),
      productId: doc.productId.toString(),
      quantity: doc.quantity,
      price: doc.price.toString()
    };
  }
  mongoToContactMessage(doc) {
    return {
      id: doc._id.toString(),
      firstName: doc.name || doc.firstName || "",
      lastName: doc.lastName || "",
      email: doc.email,
      message: doc.message,
      isRead: doc.isRead,
      createdAt: doc.createdAt
    };
  }
  // Product operations
  async getProducts() {
    try {
      const products2 = await Product.find({ isActive: true }).sort({ createdAt: -1 }).lean().exec();
      return products2.map(this.mongoToProduct);
    } catch (error) {
      console.log("Database not connected, returning sample data");
      return this.getSampleProducts();
    }
  }
  getSampleProducts() {
    return [
      {
        id: "1",
        name: "Midnight Elegance",
        description: "A sophisticated blend of bergamot, jasmine, and sandalwood",
        price: "125.00",
        category: "Luxury",
        imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
        stock: 50,
        isActive: true,
        averageRating: "4.8",
        totalReviews: 127,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: "2",
        name: "Ocean Breeze",
        description: "Fresh aquatic notes with hints of sea salt and citrus",
        price: "98.00",
        category: "Fresh",
        imageUrl: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400",
        stock: 75,
        isActive: true,
        averageRating: "4.6",
        totalReviews: 89,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: "3",
        name: "Royal Amber",
        description: "Rich amber and vanilla with warm spices",
        price: "156.00",
        category: "Oriental",
        imageUrl: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400",
        stock: 30,
        isActive: true,
        averageRating: "4.9",
        totalReviews: 203,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    ];
  }
  async getProductById(id) {
    try {
      const product = await Product.findById(id).lean().exec();
      return product ? this.mongoToProduct(product) : void 0;
    } catch (error) {
      console.log("Database not connected, returning sample data");
      return this.getSampleProducts().find((p) => p.id === id);
    }
  }
  async getProductsByCategory(category) {
    const products2 = await Product.find({ category, isActive: true });
    return products2.map(this.mongoToProduct);
  }
  async createProduct(product) {
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
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    const saved = await newProduct.save();
    return this.mongoToProduct(saved);
  }
  async updateProduct(id, product) {
    const updateData = { updatedAt: /* @__PURE__ */ new Date() };
    if (product.name) updateData.name = product.name;
    if (product.description) updateData.description = product.description;
    if (product.price) updateData.price = parseFloat(product.price);
    if (product.category) updateData.category = product.category;
    if (product.imageUrl) updateData.image = product.imageUrl;
    if (product.stock !== void 0) updateData.stock = product.stock;
    if (product.isActive !== void 0) updateData.isActive = product.isActive;
    if (product.averageRating) updateData.rating = parseFloat(product.averageRating);
    if (product.totalReviews !== void 0) updateData.reviewCount = product.totalReviews;
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    return updatedProduct ? this.mongoToProduct(updatedProduct) : void 0;
  }
  async deleteProduct(id) {
    const result = await Product.findByIdAndUpdate(id, { isActive: false });
    return !!result;
  }
  async updateProductStock(id, stock) {
    await Product.findByIdAndUpdate(id, { stock, updatedAt: /* @__PURE__ */ new Date() });
  }
  // Customer operations
  async getCustomers() {
    const customers2 = await Customer.find().sort({ createdAt: -1 });
    return customers2.map(this.mongoToCustomer);
  }
  async getCustomerById(id) {
    const customer = await Customer.findById(id);
    return customer ? this.mongoToCustomer(customer) : void 0;
  }
  async getCustomerByEmail(email) {
    const customer = await Customer.findOne({ email });
    return customer ? this.mongoToCustomer(customer) : void 0;
  }
  async createCustomer(customer) {
    const newCustomer = new Customer({
      ...customer,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    const saved = await newCustomer.save();
    return this.mongoToCustomer(saved);
  }
  async updateCustomer(id, customer) {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { ...customer, updatedAt: /* @__PURE__ */ new Date() },
      { new: true }
    );
    return updatedCustomer ? this.mongoToCustomer(updatedCustomer) : void 0;
  }
  // Order operations
  async getOrders() {
    const orders2 = await Order.find().sort({ createdAt: -1 });
    const ordersWithItems = await Promise.all(
      orders2.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id }).populate("productId");
        const orderData = this.mongoToOrder(order);
        return {
          ...orderData,
          items: items.map((item) => ({
            ...this.mongoToOrderItem(item),
            product: this.mongoToProduct(item.productId)
          }))
        };
      })
    );
    return ordersWithItems;
  }
  async getOrderById(id) {
    const order = await Order.findById(id);
    if (!order) return void 0;
    const items = await OrderItem.find({ orderId: id }).populate("productId");
    const orderData = this.mongoToOrder(order);
    return {
      ...orderData,
      items: items.map((item) => ({
        ...this.mongoToOrderItem(item),
        product: this.mongoToProduct(item.productId)
      }))
    };
  }
  async getOrdersByCustomer(customerId) {
    const orders2 = await Order.find({ customerId }).sort({ createdAt: -1 });
    const ordersWithItems = await Promise.all(
      orders2.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id }).populate("productId");
        const orderData = this.mongoToOrder(order);
        return {
          ...orderData,
          items: items.map((item) => ({
            ...this.mongoToOrderItem(item),
            product: this.mongoToProduct(item.productId)
          }))
        };
      })
    );
    return ordersWithItems;
  }
  async createOrder(order, items) {
    const shippingParts = order.shippingAddress.split(", ");
    const [address, city, stateZip] = shippingParts;
    const [state, zipCode] = stateZip ? stateZip.split(" ") : ["", ""];
    const newOrder = new Order({
      customerId: null,
      // For guest orders
      status: order.status || "pending",
      total: parseFloat(order.totalAmount || order.total),
      shippingAddress: address || order.shippingAddress,
      shippingCity: city || "Unknown",
      shippingState: state || "Unknown",
      shippingZipCode: zipCode || "00000",
      shippingCountry: "US",
      // Default to US
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone || "",
      paymentMethod: "Credit Card",
      // Default payment method
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    const savedOrder = await newOrder.save();
    const orderItems2 = await Promise.all(
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
    await Promise.all(
      items.map(async (item) => {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      })
    );
    const populatedItems = await OrderItem.find({ orderId: savedOrder._id }).populate("productId");
    return {
      ...this.mongoToOrder(savedOrder),
      items: populatedItems.map((item) => ({
        ...this.mongoToOrderItem(item),
        product: this.mongoToProduct(item.productId)
      }))
    };
  }
  async updateOrderStatus(id, status) {
    await Order.findByIdAndUpdate(id, { status, updatedAt: /* @__PURE__ */ new Date() });
  }
  async getOrderStats() {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({ status: "delivered" });
    const salesResult = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$total" } } }
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
  async getContactMessages() {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return messages.map(this.mongoToContactMessage);
  }
  async createContactMessage(message) {
    const newMessage = new ContactMessage({
      name: message.firstName || message.name,
      email: message.email,
      subject: message.subject || "Contact Form Message",
      message: message.message,
      isRead: false,
      createdAt: /* @__PURE__ */ new Date()
    });
    const saved = await newMessage.save();
    return this.mongoToContactMessage(saved);
  }
  async markMessageAsRead(id) {
    await ContactMessage.findByIdAndUpdate(id, { isRead: true });
  }
  // Authentication operations
  async registerCustomer(customerData) {
    const existingCustomer = await Customer.findOne({ email: customerData.email });
    if (existingCustomer) {
      throw new Error("Customer already exists");
    }
    const hashedPassword = await bcrypt.hash(customerData.password, 10);
    const newCustomer = new Customer({
      ...customerData,
      password: hashedPassword,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    const saved = await newCustomer.save();
    return this.mongoToCustomer(saved);
  }
  async loginCustomer(email, password) {
    const customer = await Customer.findOne({ email });
    if (!customer) return null;
    const isValidPassword = await bcrypt.compare(password, customer.password);
    if (!isValidPassword) return null;
    return this.mongoToCustomer(customer);
  }
};
var storage = new DatabaseStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, decimal, timestamp, boolean, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  imageUrl: text("image_url").notNull(),
  stock: integer("stock").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0.00"),
  totalReviews: integer("total_reviews").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  customerId: integer("customer_id").references(() => customers.id),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  rating: integer("rating").notNull(),
  // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }),
  shippingAddress: text("shipping_address").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  orderDate: timestamp("order_date").defaultNow().notNull(),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at")
});
var orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull()
});
var contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  reviews: many(reviews)
}));
var customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
  reviews: many(reviews)
}));
var reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id]
  }),
  customer: one(customers, {
    fields: [reviews.customerId],
    references: [customers.id]
  })
}));
var ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id]
  }),
  items: many(orderItems)
}));
var orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderDate: true,
  shippedAt: true,
  deliveredAt: true
});
var insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true
});
var insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  isRead: true,
  createdAt: true
});
var insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      let products2;
      if (category && typeof category === "string") {
        products2 = await storage.getProductsByCategory(category);
      } else {
        products2 = await storage.getProducts();
      }
      res.json(products2);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  app2.put("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  app2.delete("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  app2.get("/api/customers", async (req, res) => {
    try {
      const customers2 = await storage.getCustomers();
      res.json(customers2);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });
  app2.get("/api/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const customer = await storage.getCustomerById(id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });
  app2.post("/api/customers", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create customer" });
    }
  });
  app2.get("/api/orders", async (req, res) => {
    try {
      const orders2 = await storage.getOrders();
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const createOrderSchema = z.object({
        order: z.object({
          customerName: z.string(),
          customerEmail: z.string().email(),
          customerPhone: z.string().optional(),
          shippingAddress: z.string(),
          totalAmount: z.string(),
          status: z.string().default("pending")
        }),
        items: z.array(z.object({
          productId: z.string(),
          // Accept string ID for MongoDB
          quantity: z.number().positive(),
          price: z.string()
        }))
      });
      const { order: orderData, items } = createOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData, items);
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  app2.put("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = z.object({ status: z.string() }).parse(req.body);
      await storage.updateOrderStatus(id, status);
      res.json({ message: "Order status updated successfully" });
    } catch (error) {
      console.error("Error updating order status:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update order status" });
    }
  });
  app2.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getOrderStats();
      const products2 = await storage.getProducts();
      const customers2 = await storage.getCustomers();
      res.json({
        ...stats,
        totalProducts: products2.length,
        totalCustomers: customers2.length
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });
  app2.get("/api/contact-messages", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });
  app2.post("/api/contact-messages", async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating contact message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create contact message" });
    }
  });
  app2.put("/api/contact-messages/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markMessageAsRead(id);
      res.json({ message: "Message marked as read" });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });
  app2.post("/api/auth/signup", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const existingCustomer = await storage.getCustomerByEmail(customerData.email);
      if (existingCustomer) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const customer = await storage.registerCustomer(customerData);
      const { password, ...customerResponse } = customer;
      res.status(201).json(customerResponse);
    } catch (error) {
      console.error("Error creating customer:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create customer" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const customer = await storage.loginCustomer(email, password);
      if (!customer) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const { password: _, ...customerResponse } = customer;
      res.json(customerResponse);
    } catch (error) {
      console.error("Error logging in customer:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/db.ts
import mongoose2 from "mongoose";
if (!process.env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI must be set. Please provide your MongoDB Atlas connection string."
  );
}
var connectDB = async () => {
  try {
    await mongoose2.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3e4,
      socketTimeoutMS: 45e3,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 3e4,
      retryWrites: true
    });
    console.log("MongoDB Atlas connected successfully");
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    console.log("Note: You may need to whitelist Replit's IP addresses in MongoDB Atlas Network Access settings.");
    console.log("Continuing without database connection for development...");
    return false;
  }
};

// server/index.ts
var app = express2();
app.use(helmet({
  contentSecurityPolicy: false,
  // Disable for development
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(express2.json({ limit: "10mb" }));
app.use(express2.urlencoded({ extended: false, limit: "10mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await connectDB();
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
