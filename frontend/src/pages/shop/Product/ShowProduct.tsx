import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Product} from "@/pages/shop/schema.ts";
import {getProduct} from "@/pages/shop/api/api.tsx";

import {
    Card,
    CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Layout from "@/layout/Layout.tsx";
import {Button} from "@/components/ui/button.tsx";
import {HeartIcon} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";

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
                                                {product.is_ad &&
                                                    <div className="absolute top-2 right-3 space-x-">
                                                        <Badge variant={"default"}>
                                                            {"Featured"}
                                                        </Badge>
                                                    </div>
                                                }

                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious/>
                        <CarouselNext/>
                    </Carousel>
                </div>

                {/* Right Column - Features and Details */}
                <div className="space-y-4">
                    {/*Featured Product Badge*/}
                    <div>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                        <div className='flex gap-3'>
                            <p className="text-xl font-semibold mb-4">₹{product.selling_price}</p>
                            <p className="text-xl font-semibold mb-4 line-through text-red-700">₹{product.mrp}</p>
                        </div>
                        <p className="text-sm text-gray-600">Listed By: {product.owner}</p>

                    </div>

                    <div className="space-y-2">
                        <div className='flex gap-3'>
                            <Button>Buy Now</Button>

                            <Button variant={null}>
                                <HeartIcon className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Card className='shadow-none border border-gray-300 rounded-lg'>
                            <CardHeader>
                                <CardTitle className='text-xl'>Product Features</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <dl className="grid grid-cols-2 gap-4">
                                    {product.extra_features.map(({key,value}, index) => (
                                        <div key={index}>
                                            <dt className="font-semibold">{key}</dt>
                                            <dd>{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Second Row - Description */}
            <div className="mt-8">
                <Card className='shadow-none border border-gray-300 rounded-lg'>
                    <CardContent className="p-6 ">
                        <h2 className="text-xl font-semibold mb-4">Product Description</h2>
                        <p className="text-gray-700">{product.description}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
        </Layout>
    );
};


