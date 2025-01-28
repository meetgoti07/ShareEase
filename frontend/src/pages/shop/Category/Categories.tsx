"use client";

import {useState, useEffect, useRef} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Layout from "@/layout/Layout";
import { addCategory, getCategories, editCategory, deleteCategory } from "@/pages/shop/api/api.tsx";
import { EditCategoryForm } from "./EditCategoryForm";
import { categorySchema, CategoryFormValues } from "../schema.ts";

export default function ManageCategories() {
    // Fixed the state type to CategoryFormValues[]
    const [categories, setCategories] = useState<CategoryFormValues[]>([]);
    const [editingCategory, setEditingCategory] = useState<CategoryFormValues | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const isSlugManuallyEdited = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getCategories();
            setCategories(data);
        };
        fetchData();
    }, []);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
        },
    });

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            // Only update slug if name field changed and slug hasn't been manually edited
            if (name === "name" && !isSlugManuallyEdited.current && value.name) {
                const generatedSlug = value.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");

                // Only update if the generated slug is different from current value
                if (form.getValues("slug") !== generatedSlug) {
                    form.setValue("slug", generatedSlug, {
                        shouldDirty: true,
                        shouldTouch: true
                    });
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [form]);

    const onSubmit = async (values: CategoryFormValues) => {
        try {
            const newCategory = await addCategory(values);
            setCategories((prev) => [...prev, newCategory]);
            form.reset();
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    const handleEditSubmit = async (values: CategoryFormValues) => {
        try {
            if (editingCategory?.id) {
                await editCategory(editingCategory.id, values);
                setCategories((prev) =>
                    prev.map((cat) =>
                        cat.id === editingCategory.id ? { ...cat, ...values } : cat
                    )
                );
                setIsDialogOpen(false);
                setEditingCategory(null);
            }
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    const handleEdit = (category: CategoryFormValues) => {
        setEditingCategory(category);
        setIsDialogOpen(true);
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isSlugManuallyEdited.current = true;
        form.setValue("slug", e.target.value, {
            shouldDirty: true,
            shouldTouch: true
        });
    };


    const handleDelete = async (id: string) => {
        try {
            await deleteCategory(id);
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };
    return (
        <Layout>
            <div className="grid grid-cols-10 gap-6 p-6">
                {/* Sidebar (Add Category Form) */}
                <div className="col-span-3">
                    <h2 className="text-xl font-bold mb-4">Add New Category</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter category name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Slug will be auto-generated"
                                                {...field}
                                                onChange={handleSlugChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter category description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                Add Category
                            </Button>
                        </form>
                    </Form>
                </div>

                {/* Categories Table */}
                <div className="col-span-7">
                    <h2 className="text-xl font-bold mb-4">Existing Categories</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category: CategoryFormValues) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>{category.slug}</TableCell>
                                    <TableCell>{category.description}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="mr-2"
                                            onClick={() => handleEdit(category)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(category.id || "")}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Edit Category Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    <EditCategoryForm
                        initialData={editingCategory || undefined}
                        onSubmit={handleEditSubmit}
                    />
                </DialogContent>
            </Dialog>
        </Layout>
    );
}