"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { useEffect, useState } from "react";
import { getProducts, deleteProduct as deleteAction } from "@/lib/actions";
import { Product } from "@/lib/db";
import Link from "next/link";

export default function AdminProducts() {
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm(t.admin.manage.deleteConfirm)) return;

        try {
            await deleteAction(id);
            fetchProducts();
            alert(t.admin.manage.delete);
        } catch (error) {
            alert("Error");
        }
    };

    if (loading) return <div className="text-center py-12">{t.admin.manage.loading}</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{t.admin.manage.title}</h1>
                <Link
                    href="/admin/products/add"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    ➕ {t.admin.manage.add}
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-lg border border-gray-200">
                        <div className="h-40 bg-gray-100 overflow-hidden rounded-t-lg">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-bold text-blue-600">{product.price} TND</span>
                                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/products/edit/${product.id}`}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-center"
                                >
                                    ✏️ {t.admin.manage.edit}
                                </Link>
                                <button
                                    onClick={() => deleteProduct(product.id)}
                                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                                >
                                    🗑️ {t.admin.manage.delete}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">{t.admin.manage.noProducts}</p>
                    <Link href="/admin/products/add" className="text-blue-600 hover:underline">
                        {t.admin.manage.addFirst}
                    </Link>
                </div>
            )}

            <Link href="/admin" className="block mt-8 text-center text-blue-600 hover:underline">
                ← {t.admin.manage.backToDash}
            </Link>
        </div>
    );
}