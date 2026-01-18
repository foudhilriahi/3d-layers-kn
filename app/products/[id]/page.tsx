import { getProduct } from "@/lib/actions";
import Link from "next/link";
import ProductDetail from "@/components/ProductDetail";

export default async function ProductPage({
    params,
}: {
    params: { id: string };
}) {
    const product = await getProduct(params.id);

    if (!product) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-32 text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-6">Produit non trouvé</h1>
                <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4">
                    Retour à la boutique
                </Link>
            </div>
        );
    }

    return <ProductDetail product={product} />;
}