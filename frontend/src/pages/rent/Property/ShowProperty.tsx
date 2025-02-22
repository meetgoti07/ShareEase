import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel.tsx";
import Layout from "@/layout/Layout.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { MapPinIcon, BedDoubleIcon, UserIcon } from "lucide-react";
import {getPropertyById} from "@/pages/rent/api/api.tsx";

// You'll need to define this type based on your schema
interface Property {
    id: number;
    title: string;
    description: string;
    owner_name: string;
    owner_email: string;
    location: string;
    images: string[];
    rent_per_month: string;
    security_deposit: string;
    furnished: boolean;
    total_vacancy: number;
    available_vacancy: number;
    sharing: number;
    is_active: boolean;
    custom_features: Array<{ key: string; value: string }>;
    created_at: string;
    updated_at: string;
}

export const PropertyDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);

    useEffect(() => {
        // Replace with your actual API call
        const fetchProperty = async () => {
            if (id) {
                const data = await getPropertyById(id);
                setProperty(data);
            }
        };

        fetchProperty();
    }, [id]);

    if (!property) {
        return <p>Loading...</p>;
    }

    return (
        <Layout>
            <div className="container p-6 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-8">
                    {/* Left Column - Image Carousel */}
                    <div className="flex content-center align-middle justify-center pl-6 pr-6">
                        <Carousel className="w-full">
                            <CarouselContent>
                                {property.images.map((image, index) => (
                                    <CarouselItem key={index}>
                                        <Card>
                                            <CardContent className="flex aspect-square items-center justify-center p-0">
                                                <img
                                                    src={image}
                                                    alt={`Property image ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                {!property.is_active && (
                                                    <div className="absolute top-2 right-3">
                                                        <Badge variant="destructive">Not Available</Badge>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>

                    {/* Right Column - Property Details */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant={property.is_active ? "default" : "secondary"}>
                                    {property.is_active ? "Available" : "Occupied"}
                                </Badge>
                                {property.furnished && (
                                    <Badge variant="outline">Furnished</Badge>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                            <div className="flex items-center gap-2 text-gray-600 mb-4">
                                <MapPinIcon className="w-4 h-4" />
                                <p>{property.location}</p>
                            </div>
                        </div>

                        {/* Price Information */}
                        <Card className="shadow-sm">
                            <CardContent className="p-3">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Monthly Rent</p>
                                        <p className="text-2xl font-bold">₹{property.rent_per_month}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Security Deposit</p>
                                        <p className="text-lg font-semibold">₹{property.security_deposit}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <BedDoubleIcon className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Sharing</p>
                                    <p className="font-semibold">{property.sharing} Person</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Vacancy</p>
                                    <p className="font-semibold">{property.available_vacancy} / {property.total_vacancy}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Buttons */}
                        <div className="flex gap-3">
                            <Button className="flex-1">Contact Owner</Button>
                            <Button variant="outline" className="flex-1">Book Visit</Button>
                        </div>
                    </div>
                </div>

                {/* Property Description */}
                <div className="mt-8 space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl">About this property</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">{property.description}</p>
                        </CardContent>
                    </Card>

                    {/* Owner Information */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl">Listed By</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="font-semibold">{property.owner_name}</p>
                                <p className="text-gray-600">{property.owner_email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Custom Features */}
                    {property.custom_features.length > 0 && (
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">Additional Features</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <dl className="grid grid-cols-2 gap-4">
                                    {property.custom_features.map(({ key, value }, index) => (
                                        <div key={index}>
                                            <dt className="font-semibold">{key}</dt>
                                            <dd className="text-gray-600">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default PropertyDetail;