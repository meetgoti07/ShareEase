// types.ts
import {getProperties} from "@/pages/rent/api/api.tsx";

export interface Property {
    id: number;
    title: string;
    description: string;
    location: string;
    images: string[];
    rent_per_month: number;
    security_deposit: number;
    furnished: boolean;
    total_vacancy: number;
    available_vacancy: number;
    sharing: number;
    is_available: boolean;
    custom_features: Record<string, any>;
    owner_name: string;
    owner_email: string;
    created_at: string;
    updated_at: string;
}

// PropertyList.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/layout/Layout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {CheckIcon, HomeIcon, UserSquareIcon, XIcon} from "lucide-react";

export const PropertyList = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const data: Property[] = await getProperties();
                setProperties(data.filter(property => property.is_available));
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };

        fetchProperties();
    }, []);

    return (
        <Layout>
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Available Properties</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <Card key={property.id} className="hover:shadow-lg transition-shadow">
                            <div className="relative">

                                <img
                                    src={property.images[0]}
                                    alt={property.title}
                                    className="w-full h-60 object-cover rounded-t-lg"
                                />

                                <div className="absolute top-2 right-2 space-x-2">
                                    <Badge variant={property.furnished ? "default" : "secondary"}>
                                        {property.furnished ? "Furnished" : "Unfurnished"}
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">{property.title}</CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <HomeIcon className="w-4 h-4" />
                                    {property.location}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-gray-500 line-clamp-2">{property.description}</p>

                                    <div className="flex justify-between items-center mt-4">
                                        <div className="text-lg font-semibold text-primary">
                                            ₹{property.rent_per_month}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Deposit: ₹{property.security_deposit}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1">
                                            <UserSquareIcon className="w-4 h-4" />
                                            <span className="text-sm">
                                                {property.sharing} sharing
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {property.available_vacancy > 0 ? (
                                                <>
                                                    <CheckIcon className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm text-green-500">
                                                        {property.available_vacancy} vacant
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <XIcon className="w-4 h-4 text-red-500" />
                                                    <span className="text-sm text-red-500">
                                                        Full
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button
                                    onClick={() => navigate(`/properties/${property.id}`)}
                                    className="w-full"
                                >
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
};