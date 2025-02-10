import {useEffect, useState} from "react";
import {Product} from "@/pages/shop/schema.ts";
import {useNavigate} from "react-router-dom";
import {getProducts} from "@/pages/shop/api/api.tsx";
import Layout from "@/layout/Layout.tsx";
import CommandDemo from "@/lib/Command.tsx";
import Filter from "@/pages/shop/Product/Filter.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";

export const Shop = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setProducts(data);
            setFilteredProducts(data);
        };

        fetchProducts();
    }, []);

    const handleFilterChange = ({ priceRange, brands, categories, sortBy, inStock }) => {
        let filtered = [...products];

        // Apply price filter
        filtered = filtered.filter(product => {
            const price = parseFloat(product.selling_price);
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Apply brand filter
        if (brands.length > 0) {
            filtered = filtered.filter(product =>
                brands.includes(product.brand.toLowerCase())
            );
        }

        // ✅ Apply category filter
        if (categories.length > 0) {
            filtered = filtered.filter(product =>
                categories.includes(product.category)
            );
        }

        // Apply sorting
        switch (sortBy) {
            case "price-asc":
                filtered.sort((a, b) => parseFloat(a.selling_price) - parseFloat(b.selling_price));
                break;
            case "price-desc":
                filtered.sort((a, b) => parseFloat(b.selling_price) - parseFloat(a.selling_price));
                break;
            case "newest":
                filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
            default:
                break;
        }

        setFilteredProducts(filtered);
    };


    return (
        <Layout>
            <div className="flex justify-center items-center gap-2 p-6 w-full">
                <div className="flex justify-center items-center gap-2 lg:p-1 w-full md:w-1/2 lg:w-1/2">
                    <CommandDemo />
                    <Filter products={products} onFilterChange={handleFilterChange} />

                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 pl-6 pr-6 gap-6">
                    {filteredProducts.map((product) => (
                        <Card key={product.id} className="hover:shadow-lg">
                            <div className='relative'>
                                <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    className="w-full h-60 object-cover rounded-t-md"
                                />
                                {product.is_ad && (
                                    <div className="absolute top-2 right-3">
                                        <Badge variant="default">Featured</Badge>
                                    </div>
                                )}
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">{product.title}</CardTitle>
                                <CardDescription>{product.brand}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='flex gap-3'>
                                    <p className="text-xl font-semibold">₹{product.selling_price}</p>
                                    <p className="text-xl font-semibold line-through text-red-700">₹{product.mrp}</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={() => navigate(`/shop/${product.id}`)}>
                                    View Product
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
        </Layout>

);
};
