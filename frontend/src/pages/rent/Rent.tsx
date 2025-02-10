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
import { CheckIcon, HomeIcon, UserSquareIcon, XIcon } from "lucide-react";
import { getProperties } from "@/pages/rent/api/api.tsx";
import RentFilter from "@/pages/rent/RentFilter.tsx";
import { CommandDemo } from "@/lib/Command.tsx";

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

export const PropertyList = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const data: Property[] = await getProperties();
                setProperties(data);
                setFilteredProperties(data.filter(property => property.is_available));
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };

        fetchProperties();
    }, []);

    const handleFilterChange = ({ rentRange, locations, furnished, sortBy, isAvailable }) => {
        let filtered = [...properties];

        // Apply rent range filter
        filtered = filtered.filter(property => {
            const rent = parseFloat(property.rent_per_month);
            return rent >= rentRange[0] && rent <= rentRange[1];
        });

        // Apply location filter
        if (locations.length > 0) {
            filtered = filtered.filter(property =>
                locations.includes(property.location)
            );
        }

        // Apply furnishing filter
        if (furnished !== null) {
            filtered = filtered.filter(property => property.furnished === furnished);
        }

        // Apply availability filter
        if (isAvailable) {
            filtered = filtered.filter(property => property.is_available);
        }

        // Apply sorting
        switch (sortBy) {
            case "rent-asc":
                filtered.sort((a, b) => parseFloat(a.rent_per_month) - parseFloat(b.rent_per_month));
                break;
            case "rent-desc":
                filtered.sort((a, b) => parseFloat(b.rent_per_month) - parseFloat(a.rent_per_month));
                break;
            case "newest":
                filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
            default:
                break;
        }

        setFilteredProperties(filtered);
    };

    return (
        <Layout>
            <div className="container mx-auto">
                {/* Search & Filter Section */}
                <div className="flex justify-center items-center gap-2 p-6 w-full">
                    <div className="flex justify-center items-center gap-2 lg:p-1 w-full md:w-1/2 lg:w-1/2">
                        <CommandDemo />
                        <RentFilter properties={properties} onFilterChange={handleFilterChange} />
                    </div>
                </div>

                {/* Properties Listing */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {filteredProperties.map((property) => (
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
                                    <div className="flex justify-between items-center">
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
                                    onClick={() => navigate(`/rent/${property.id}`)}
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
