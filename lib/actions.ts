'use server'

import { 
    getAllProducts, 
    getProductById, 
    getAllOrders, 
    getOrderById, 
    getOrderItemsByOrderId,
    insertProduct,
    updateProductById,
    deleteProductById,
    insertOrder,
    insertOrderItem,
    updateProductStock,
    updateOrderStatusById,
    initializeDatabase,
    Product, 
    Order 
} from './db';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { translateProductContent } from './translator';
import { sendOrderEmail } from './email';
import { validateFullName, validatePhone, validateAddress, validateProductId, validateQuantity } from './validation';

// Initialize database on first import
let dbInitialized = false;
async function ensureDbInitialized() {
    if (!dbInitialized) {
        await initializeDatabase();
        dbInitialized = true;
    }
}

export async function getProducts() {
    await ensureDbInitialized();
    return getAllProducts();
}

export async function getProduct(id: string) {
    await ensureDbInitialized();
    return getProductById(id);
}

export async function createOrder(data: any) {
    await ensureDbInitialized();
    
    // Server-side validation (OWASP A03:2021 - Injection)
    const fullNameValidation = validateFullName(data.fullName);
    if (!fullNameValidation.valid) {
        throw new Error(fullNameValidation.error || "Invalid full name");
    }

    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.valid) {
        throw new Error(phoneValidation.error || "Invalid phone number");
    }

    const addressValidation = validateAddress(data.address);
    if (!addressValidation.valid) {
        throw new Error(addressValidation.error || "Invalid address");
    }

    // Validate items
    if (!Array.isArray(data.items) || data.items.length === 0) {
        throw new Error("Order must contain at least one item");
    }

    for (const item of data.items) {
        const productIdValidation = validateProductId(item.id);
        if (!productIdValidation.valid) {
            throw new Error("Invalid product ID");
        }

        const quantityValidation = validateQuantity(item.quantity);
        if (!quantityValidation.valid) {
            throw new Error("Invalid quantity");
        }

        // Verify product exists and has sufficient stock
        const product = await getProductById(item.id);
        if (!product) {
            throw new Error("Product not found");
        }
        if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
        }
    }

    // Validate total price
    if (typeof data.totalPrice !== 'number' || data.totalPrice < 10) {
        throw new Error("Invalid total price");
    }

    const orderNum = `ORD-${Date.now()}`;
    const orderId = uuidv4();

    // Create the main order
    await insertOrder({
        id: orderId,
        order_number: orderNum,
        customer_name: data.fullName,
        customer_address: data.address,
        customer_phone: data.phone,
        total_price: data.totalPrice,
        status: 'pending'
    });

    // Add all products to the order_items table and update stock
    for (const item of data.items) {
        await insertOrderItem({
            id: uuidv4(),
            order_id: orderId,
            product_id: item.id,
            quantity: item.quantity,
            price_at_time: item.price,
            product_name_snapshot: item.name
        });
        // Decrease stock
        await updateProductStock(item.id, item.quantity);
    }

    const order = await getOrderById(orderId);

    // Send email notification (don't block the return if email fails)
    try {
        if (order) {
            await sendOrderEmail(order, data.items);
        }
    } catch (err) {
        console.error("Failed to send order email:", err);
    }

    revalidatePath('/');
    revalidatePath('/admin');

    return order;
}

export async function getOrders() {
    await ensureDbInitialized();
    return getAllOrders();
}

export async function getOrderItems(orderId: string) {
    await ensureDbInitialized();
    return getOrderItemsByOrderId(orderId);
}

export async function deleteProduct(id: string) {
    await ensureDbInitialized();
    await deleteProductById(id);
    revalidatePath('/');
    revalidatePath('/admin/products');
}

export async function addProduct(productData: any) {
    await ensureDbInitialized();
    const id = uuidv4();
    const translations = await translateProductContent(productData.name, productData.description);

    await insertProduct({
        id,
        name: productData.name,
        name_en: translations.nameEn,
        name_ar: translations.nameAr,
        description: productData.description,
        description_en: translations.descEn,
        description_ar: translations.descAr,
        price: parseFloat(productData.price),
        image_url: productData.image_url,
        image_url2: productData.image_url2 || undefined,
        image_url3: productData.image_url3 || undefined,
        stock: parseInt(productData.stock)
    });

    revalidatePath('/');
    revalidatePath('/admin/products');
    return id;
}

export async function updateProduct(id: string, productData: any) {
    await ensureDbInitialized();
    const translations = await translateProductContent(productData.name, productData.description);

    await updateProductById(id, {
        name: productData.name,
        name_en: translations.nameEn,
        name_ar: translations.nameAr,
        description: productData.description,
        description_en: translations.descEn,
        description_ar: translations.descAr,
        price: parseFloat(productData.price),
        image_url: productData.image_url,
        image_url2: productData.image_url2 || undefined,
        image_url3: productData.image_url3 || undefined,
        stock: parseInt(productData.stock)
    });

    revalidatePath('/');
    revalidatePath(`/products/${id}`);
    revalidatePath('/admin/products');
}

export async function updateOrderStatus(id: string, status: string) {
    await ensureDbInitialized();
    await updateOrderStatusById(id, status);
    revalidatePath('/admin');
}
