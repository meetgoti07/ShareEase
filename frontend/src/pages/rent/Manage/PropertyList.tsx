import Layout from "@/layout/Layout.tsx";
import {getProperties, deleteProperty, getMyProperties, deleteMyProperty} from "@/pages/rent/api/api.tsx";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { useNavigate } from "react-router-dom";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {Property} from "@/Schema/Schema.ts";

export default function PropertyList() {
    const [properties, setProperties] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getMyProperties().then((data) => {
            setProperties(data);
        });
    }, []);

    const handleEdit = (id: number) => {
        navigate(`${id}`);
    };

    const handleDelete = async (id) => {
        await deleteMyProperty(id);
        setProperties((prevProperties) => prevProperties.filter((property) => property.id !== id));
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-4 mt-4">
                <h1 className="text-2xl font-bold">Listed Properties</h1>
                <Button onClick={() => navigate('/rent/add-property')}>Add Property</Button>
            </div>
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Rent (₹/month)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Vacancy</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {properties.map((property: Property) => (
                                <TableRow key={property.id}>
                                    <TableCell>{property.title}</TableCell>
                                    <TableCell>{property.owner_name}</TableCell>
                                    <TableCell>{property.location}</TableCell>
                                    <TableCell>₹{property.rent_per_month}</TableCell>
                                    <TableCell>
                                        <Badge variant={property.is_active ? "default" : "secondary"}>
                                            {property.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {property.available_vacancy}/{property.total_vacancy}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" className="mr-2" onClick={() => handleEdit(property.id)}>Edit</Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive">Delete</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the property.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction className='bg-destructive' onClick={() => handleDelete(property.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Layout>
    );
}
