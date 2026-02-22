import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("flexpay.db");

// Initialize database with expanded schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT, -- 'consumer', 'merchant', 'admin'
    credit_limit REAL DEFAULT 5000,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS merchants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    business_name TEXT,
    tax_id TEXT,
    bank_account TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    merchant_id INTEGER,
    name TEXT,
    price REAL,
    category TEXT,
    image TEXT,
    flexpay_eligible INTEGER DEFAULT 1,
    FOREIGN KEY(merchant_id) REFERENCES merchants(id)
  );

  CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    installments INTEGER,
    interest_rate REAL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    consumer_id INTEGER,
    merchant_id INTEGER,
    product_id INTEGER,
    total_amount REAL,
    plan_id INTEGER,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(consumer_id) REFERENCES users(id),
    FOREIGN KEY(merchant_id) REFERENCES merchants(id),
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(plan_id) REFERENCES plans(id)
  );

  CREATE TABLE IF NOT EXISTS installments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    due_date DATE,
    amount REAL,
    status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'overdue'
    FOREIGN KEY(order_id) REFERENCES orders(id)
  );

  CREATE TABLE IF NOT EXISTS payouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    merchant_id INTEGER,
    amount REAL,
    status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed'
    scheduled_date DATE,
    FOREIGN KEY(merchant_id) REFERENCES merchants(id)
  );
`);

// Seed initial data
const seedData = () => {
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  if (userCount.count === 0) {
    // Admin
    db.prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)").run("admin@flexpay.com", "admin123", "admin");
    
    // Plans
    const insertPlan = db.prepare("INSERT INTO plans (name, installments, interest_rate) VALUES (?, ?, ?)");
    insertPlan.run("Pay in 3", 3, 0);
    insertPlan.run("Pay in 6", 6, 0.05);
    insertPlan.run("Pay in 12", 12, 0.1);

    // Sample Merchant User
    const merchantUser = db.prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)").run("merchant@apple.com", "apple123", "merchant");
    const merchantId = db.prepare("INSERT INTO merchants (user_id, business_name, tax_id, bank_account, status) VALUES (?, ?, ?, ?, ?)").run(merchantUser.lastInsertRowid, "Apple Inc.", "TAX-12345", "BANK-98765", "approved").lastInsertRowid;

    // Sample Products
    const insertProduct = db.prepare("INSERT INTO products (merchant_id, name, price, category, image) VALUES (?, ?, ?, ?, ?)");
    insertProduct.run(merchantId, "iPhone 15 Pro", 999.99, "Electronics", "https://picsum.photos/seed/iphone/400/400");
    insertProduct.run(merchantId, "MacBook Air M2", 1199.00, "Electronics", "https://picsum.photos/seed/macbook/400/400");
    insertProduct.run(merchantId, "AirPods Pro", 249.00, "Electronics", "https://picsum.photos/seed/airpods/400/400");
    
    // Sample Consumer
    db.prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)").run("consumer@gmail.com", "consumer123", "consumer");
  }
};
seedData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- COMMON API ---
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    if (user) {
      let merchantData = null;
      if (user.role === 'merchant') {
        merchantData = db.prepare("SELECT * FROM merchants WHERE user_id = ?").get(user.id);
      }
      res.json({ success: true, user: { ...user, merchant: merchantData } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // --- CONSUMER API ---
  app.get("/api/consumer/products", (req, res) => {
    const products = db.prepare(`
      SELECT p.*, m.business_name 
      FROM products p 
      JOIN merchants m ON p.merchant_id = m.id 
      WHERE m.status = 'approved'
    `).all();
    res.json(products);
  });

  app.get("/api/consumer/dashboard/:userId", (req, res) => {
    const userId = req.params.userId;
    const orders = db.prepare(`
      SELECT o.*, p.name as product_name, p.image as product_image 
      FROM orders o 
      JOIN products p ON o.product_id = p.id
      WHERE o.consumer_id = ?
      ORDER BY o.created_at DESC
    `).all(userId);

    const upcomingPayments = db.prepare(`
      SELECT i.*, p.name as product_name 
      FROM installments i
      JOIN orders o ON i.order_id = o.id
      JOIN products p ON o.product_id = p.id
      WHERE o.consumer_id = ? AND i.status = 'pending'
      ORDER BY i.due_date ASC
    `).all(userId);

    const user = db.prepare("SELECT credit_limit FROM users WHERE id = ?").get(userId) as any;

    res.json({ orders, upcomingPayments, creditLimit: user?.credit_limit || 0 });
  });

  app.post("/api/consumer/checkout", (req, res) => {
    const { consumerId, productId, merchantId, amount, planId } = req.body;
    
    const plan = db.prepare("SELECT * FROM plans WHERE id = ?").get(planId) as any;
    const totalWithInterest = amount * (1 + (plan.interest_rate || 0));

    const info = db.prepare("INSERT INTO orders (consumer_id, merchant_id, product_id, total_amount, plan_id) VALUES (?, ?, ?, ?, ?)")
      .run(consumerId, merchantId, productId, totalWithInterest, planId);
    
    const orderId = info.lastInsertRowid;
    const installmentAmount = totalWithInterest / plan.installments;
    
    const insertInstallment = db.prepare("INSERT INTO installments (order_id, amount, due_date, status) VALUES (?, ?, ?, ?)");
    for (let i = 0; i < plan.installments; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i);
      insertInstallment.run(orderId, installmentAmount, dueDate.toISOString().split('T')[0], i === 0 ? 'paid' : 'pending');
    }

    // Schedule payout to merchant (simulated)
    db.prepare("INSERT INTO payouts (merchant_id, amount, scheduled_date) VALUES (?, ?, ?)")
      .run(merchantId, amount * 0.95, new Date().toISOString().split('T')[0]); // 5% platform fee

    res.json({ success: true, orderId });
  });

  app.post("/api/consumer/apply-merchant", (req, res) => {
    const { userId, businessName, taxId, bankAccount } = req.body;
    db.prepare("INSERT INTO merchants (user_id, business_name, tax_id, bank_account) VALUES (?, ?, ?, ?)")
      .run(userId, businessName, taxId, bankAccount);
    res.json({ success: true });
  });

  // --- MERCHANT API ---
  app.get("/api/merchant/dashboard/:merchantId", (req, res) => {
    const merchantId = req.params.merchantId;
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_volume
      FROM orders 
      WHERE merchant_id = ?
    `).get(merchantId) as any;

    const payouts = db.prepare("SELECT * FROM payouts WHERE merchant_id = ?").all(merchantId);
    const products = db.prepare("SELECT * FROM products WHERE merchant_id = ?").all(merchantId);

    res.json({ stats, payouts, products });
  });

  app.post("/api/merchant/products", (req, res) => {
    const { merchantId, name, price, category, image } = req.body;
    db.prepare("INSERT INTO products (merchant_id, name, price, category, image) VALUES (?, ?, ?, ?, ?)")
      .run(merchantId, name, price, category, image);
    res.json({ success: true });
  });

  // --- ADMIN API ---
  app.get("/api/admin/dashboard", (req, res) => {
    const stats = db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'consumer') as total_consumers,
        (SELECT COUNT(*) FROM merchants WHERE status = 'approved') as total_merchants,
        (SELECT SUM(total_amount) FROM orders) as total_gmv,
        (SELECT COUNT(*) FROM orders) as total_orders
    `).get() as any;

    const pendingMerchants = db.prepare(`
      SELECT m.*, u.email 
      FROM merchants m 
      JOIN users u ON m.user_id = u.id 
      WHERE m.status = 'pending'
    `).all();

    const activity = db.prepare(`
      SELECT o.*, u.email as consumer_email, m.business_name 
      FROM orders o 
      JOIN users u ON o.consumer_id = u.id 
      JOIN merchants m ON o.merchant_id = m.id 
      ORDER BY o.created_at DESC LIMIT 10
    `).all();

    res.json({ stats, pendingMerchants, activity });
  });

  app.post("/api/admin/approve-merchant", (req, res) => {
    const { merchantId, action } = req.body; // action: 'approved' or 'rejected'
    db.prepare("UPDATE merchants SET status = ? WHERE id = ?").run(action, merchantId);
    
    if (action === 'approved') {
      const merchant = db.prepare("SELECT user_id FROM merchants WHERE id = ?").get(merchantId) as any;
      db.prepare("UPDATE users SET role = 'merchant' WHERE id = ?").run(merchant.user_id);
    }
    
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
