"use client";

import { useEffect, useState } from "react";
import { getProduct, updateProduct } from "@/lib/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

interface FormData {
    name: string;
    description: string;
    price: string;
    image_url: string;
    image_url2: string;
    image_url3: string;
    stock: string;
}

export default function EditProduct({ params }: { params: { id: string } }) {
    const { t } = useLanguage();
    const [form, setForm] = useState<FormData>({
        name: "",
        description: "",
        price: "",
        image_url: "",
        image_url2: "",
        image_url3: "",
        stock: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await getProduct(params.id);
                if (product) {
                    setForm({
                        name: product.name,
                        description: product.description || "",
                        price: product.price.toString(),
                        image_url: product.image_url || "",
                        image_url2: product.image_url2 || "",
                        image_url3: product.image_url3 || "",
                        stock: product.stock.toString(),
                    });
                } else {
                    alert("Product not found");
                    router.push("/admin/products");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params.id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await updateProduct(params.id, form);
            alert(t.admin.add.updateSuccess);
            router.push("/admin/products");
        } catch (error) {
            alert(`${t.admin.add.error} ${error instanceof Error ? error.message : "Error"}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-12">{t.admin.manage.loading}</div>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <Link href="/admin/products" className="text-blue-600 hover:underline mb-6 block">
                ← {t.admin.add.back}
            </Link>

            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{t.admin.add.editTitle}</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.admin.add.name} <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.admin.add.desc} <span className="text-red-600">*</span>
                        </label>
                        <textarea
                            name="description"
                            required
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.admin.add.price} <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                required
                                step="0.01"
                                min="0"
                                value={form.price}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.admin.add.stock} <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="number"
                                name="stock"
                                required
                                min="0"
                                value={form.stock}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.admin.add.img1} <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="url"
                            name="image_url"
                            required
                            value={form.image_url}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.admin.add.img2}
                        </label>
                        <input
                            type="url"
                            name="image_url2"
                            value={form.image_url2}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.admin.add.img3}
                        </label>
                        <input
                            type="url"
                            name="image_url3"
                            value={form.image_url3}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? t.admin.add.saving : t.admin.add.save}
                    </button>
                </form>
            </div>
        </div>
    );
}
