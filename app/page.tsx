import { getProducts } from "@/lib/actions";
import ProductGrid from "@/components/ProductGrid";

// Revalidate every 60 seconds for better caching while still updating
export const revalidate = 60;

export default async function Home() {
    const products = await getProducts();
    return <ProductGrid products={products} />;
}