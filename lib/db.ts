import { createClient } from '@libsql/client';

// Turso Database Connection
// Free tier: 9GB storage, 500M row reads/month, 25M row writes/month
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export interface Product {
  id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  description: string;
  description_ar?: string;
  description_en?: string;
  price: number;
  image_url: string;
  image_url2?: string;
  image_url3?: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  product_name_snapshot: string;
}

// Initialize tables (runs once)
export async function initializeDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_ar TEXT,
      name_en TEXT,
      description TEXT,
      description_ar TEXT,
      description_en TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      image_url2 TEXT,
      image_url3 TEXT,
      stock INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE,
      customer_name TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      total_price REAL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
      product_id TEXT REFERENCES products(id),
      quantity INTEGER NOT NULL,
      price_at_time REAL NOT NULL,
      product_name_snapshot TEXT NOT NULL
    )
  `);

  // Check if products exist, if not add sample data
  const result = await db.execute('SELECT COUNT(*) as count FROM products');
  const count = result.rows[0]?.count as number;

  if (count === 0) {
    await db.execute({
      sql: `INSERT INTO products (id, name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)`,
      args: ['v1', 'Vase Miniature', 'Beau vase décoratif parfait pour les petits espaces', 45.00, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&h=500&fit=crop', 10]
    });
    await db.execute({
      sql: `INSERT INTO products (id, name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)`,
      args: ['p1', 'Support Téléphone', 'Support de téléphone ergonomique imprimé en 3D pour votre bureau', 25.00, 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&h=500&fit=crop', 15]
    });
    await db.execute({
      sql: `INSERT INTO products (id, name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)`,
      args: ['o1', 'Boîte de Rangement', 'Boîte de rangement de câbles pour garder votre bureau propre', 55.00, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop', 8]
    });
  }
}

// Helper function to convert rows to typed objects
function rowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    name_ar: row.name_ar,
    name_en: row.name_en,
    description: row.description,
    description_ar: row.description_ar,
    description_en: row.description_en,
    price: row.price,
    image_url: row.image_url,
    image_url2: row.image_url2,
    image_url3: row.image_url3,
    stock: row.stock,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function rowToOrder(row: any): Order {
  return {
    id: row.id,
    order_number: row.order_number,
    customer_name: row.customer_name,
    customer_address: row.customer_address,
    customer_phone: row.customer_phone,
    total_price: row.total_price,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Database query functions
export async function getAllProducts(): Promise<Product[]> {
  const result = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
  return result.rows.map(rowToProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM products WHERE id = ?',
    args: [id]
  });
  return result.rows[0] ? rowToProduct(result.rows[0]) : null;
}

export async function getAllOrders(): Promise<Order[]> {
  const result = await db.execute('SELECT * FROM orders ORDER BY created_at DESC');
  return result.rows.map(rowToOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM orders WHERE id = ?',
    args: [id]
  });
  return result.rows[0] ? rowToOrder(result.rows[0]) : null;
}

export async function getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM order_items WHERE order_id = ?',
    args: [orderId]
  });
  return result.rows as unknown as OrderItem[];
}

export async function insertProduct(product: {
  id: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  description: string;
  description_en?: string;
  description_ar?: string;
  price: number;
  image_url: string;
  image_url2?: string;
  image_url3?: string;
  stock: number;
}) {
  await db.execute({
    sql: `INSERT INTO products (id, name, name_en, name_ar, description, description_en, description_ar, price, image_url, image_url2, image_url3, stock)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      product.id,
      product.name,
      product.name_en || null,
      product.name_ar || null,
      product.description,
      product.description_en || null,
      product.description_ar || null,
      product.price,
      product.image_url,
      product.image_url2 || null,
      product.image_url3 || null,
      product.stock
    ]
  });
}

export async function updateProductById(id: string, product: {
  name: string;
  name_en?: string;
  name_ar?: string;
  description: string;
  description_en?: string;
  description_ar?: string;
  price: number;
  image_url: string;
  image_url2?: string;
  image_url3?: string;
  stock: number;
}) {
  await db.execute({
    sql: `UPDATE products SET 
            name = ?, name_en = ?, name_ar = ?,
            description = ?, description_en = ?, description_ar = ?,
            price = ?, image_url = ?, image_url2 = ?, image_url3 = ?, 
            stock = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
    args: [
      product.name,
      product.name_en || null,
      product.name_ar || null,
      product.description,
      product.description_en || null,
      product.description_ar || null,
      product.price,
      product.image_url,
      product.image_url2 || null,
      product.image_url3 || null,
      product.stock,
      id
    ]
  });
}

export async function deleteProductById(id: string) {
  await db.execute({
    sql: 'DELETE FROM products WHERE id = ?',
    args: [id]
  });
}

export async function insertOrder(order: {
  id: string;
  order_number: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  total_price: number;
  status: string;
}) {
  await db.execute({
    sql: `INSERT INTO orders (id, order_number, customer_name, customer_address, customer_phone, total_price, status)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [order.id, order.order_number, order.customer_name, order.customer_address, order.customer_phone, order.total_price, order.status]
  });
}

export async function insertOrderItem(item: {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  product_name_snapshot: string;
}) {
  await db.execute({
    sql: `INSERT INTO order_items (id, order_id, product_id, quantity, price_at_time, product_name_snapshot)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [item.id, item.order_id, item.product_id, item.quantity, item.price_at_time, item.product_name_snapshot]
  });
}

export async function updateProductStock(productId: string, decrementBy: number) {
  await db.execute({
    sql: 'UPDATE products SET stock = stock - ? WHERE id = ?',
    args: [decrementBy, productId]
  });
}

export async function updateOrderStatusById(id: string, status: string) {
  await db.execute({
    sql: 'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    args: [status, id]
  });
}

export default db;
