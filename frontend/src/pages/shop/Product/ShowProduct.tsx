import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Product} from "@/pages/shop/schema.ts";
import {getProduct} from "@/pages/shop/api/api.tsx";

import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Layout from "@/layout/Layout.tsx";

export const ShowProduct = () => {

    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (id) {
                const data = await getProduct(id);
                setProduct(data);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <Layout>
        <div className="container p-10">
            {/* First Row - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-8">
                {/* Left Column - Image Carousel */}
                <div className="flex content-center align-middle justify-center">
                    <Carousel >
                        <CarouselContent>
                            {product.images.map((image, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="flex aspect-square items-center justify-center p-0">
                                                <img
                                                    src={image}
                                                    alt={`Product image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>

                {/* Right Column - Features and Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                        <p className="text-lg text-gray-600">Brand: {product.brand}</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-lg">MRP:</span>
                            <span className="text-lg font-semibold">₹{product.mrp}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-lg">Selling Price:</span>
                            <span className="text-lg font-semibold text-green-600">₹{product.selling_price}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-lg">Quantity Available:</span>
                            <span className="text-lg">{product.quantity}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Additional Features</h2>
                        {product.extra_features.length > 0 ? (
                            <ul className="list-disc list-inside">
                                {product.extra_features.map((feature, index) => (
                                    <li key={index}>{feature.value}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No additional features listed</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Second Row - Description */}
            <div className="mt-8">
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">Product Description</h2>
                        <p className="text-gray-700">{product.description}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
        </Layout>
    );
};
