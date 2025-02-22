import Layout from "@/layout/Layout.tsx";
import {deleteProduct, getProducts} from "@/pages/admin/api/api.tsx";
import {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge"
import {Product} from "@/pages/shop/schema.ts";
import {useNavigate} from "react-router-dom";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";

export default function AdminProductList() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getProducts().then((data) => {
            setProducts(data);
        });
    }, []);


    const handleEdit = (id:number) => {
        navigate(`edit/${id}`);
    };

const handleDelete = async (id: number) => {

    await deleteProduct(id);
    setProducts((prevProducts) => {
        return prevProducts.filter((product: Product) => product.id !== id);
    });
};




    return (
        <Layout>
            <div className="flex justify-between items-center mb-4 mt-4">
                <h1 className="text-2xl font-bold">Listed Products</h1>
                <Button onClick={() => {
                    navigate('/admin/products/add-product');
                }}>Add Product</Button>
            </div>
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Brand</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Approval</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product:Product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{product.title}</TableCell>
                                    <TableCell>{product.brand}</TableCell>
                                    <TableCell>₹{product.selling_price}</TableCell>
                                    <TableCell>
                                        <Badge variant={product.is_active ? "default" : "secondary"}>
                                            {product.is_active ? "Approved" : "Pending"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.is_sold ? "destructive" : "secondary"}>
                                            {product.is_sold ? "Sold" : "Not Sold"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" className="mr-2" onClick={() => handleEdit(product.id)}>Edit</Button>
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button variant="destructive">Delete</Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your
                                                product.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction className={'bg-destructive'} onClick={() => handleDelete(product.id)}>Delete</AlertDialogAction>
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
