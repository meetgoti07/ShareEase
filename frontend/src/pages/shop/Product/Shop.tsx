import { useEffect, useState } from "react";
import { Product } from "../schema.ts"; // Adjust the import path
import { useNavigate } from "react-router-dom";
import Layout from "@/layout/Layout.tsx";
import { getProducts } from "@/pages/shop/api/api.tsx";
import {Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";

export const Shop = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setProducts(data);
        };

        fetchProducts();
    }, []);

    return (
        <Layout>
            <div className="grid grid-cols-3 gap-6 p-6">
                {products.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg">
                        <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-60 object-cover rounded-t-md"
                        />
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">{product.title}</CardTitle>
                            <CardDescription>{product.brand}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">{product.description}</p>
                            <p className="text-sm text-gray-700 mt-2">
                                Price: <strong>${product.selling_price}</strong>
                            </p>
                        </CardContent>
                        <CardFooter>
                        <Button
                            onClick={() => navigate(`/shop/${product.id}`)}
                        >
                            View Product
                        </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </Layout>
    );
};
