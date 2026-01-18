"use client";

import { useState } from "react";
import { addProduct } from "@/lib/actions";
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

export default function AddProduct() {
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
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addProduct(form);

            alert(t.admin.add.success);
            router.push("/admin/products");
        } catch (error) {
            alert(`${t.admin.add.error} ${error instanceof Error ? error.message : "Error"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <Link href="/admin/products" className="text-blue-600 hover:underline mb-6 block">
                ← {t.admin.add.back}
            </Link>

            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{t.admin.add.title}</h1>

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
                            placeholder="ex: Vase Miniature"
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
                            placeholder="..."
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
                                placeholder="0.00"
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
                                placeholder="0"
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
                            placeholder="https://..."
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
                            placeholder="https://..."
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
                            placeholder="https://..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? t.admin.add.adding : t.admin.add.submit}
                    </button>
                </form>
            </div>
        </div>
    );
}