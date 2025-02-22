"use client";

import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

// Import Shadcn UI form components
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Button } from "@/components/ui/button.tsx";
import Layout from "@/layout/Layout.tsx";
import {addProduct, getCategories} from "@/pages/shop/api/api.tsx";

import { v4 as uuidv4 } from 'uuid';
import { useToast} from "@/hooks/use-toast.ts";


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://puyvmepvpbbvsajxlkju.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1eXZtZXB2cGJidnNhanhsa2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNDE2MDksImV4cCI6MjA1MjYxNzYwOX0.9AHjLae8sgEzV_8B-O_4mRWsQcvb_LtWybCMgy6___I';
export const supabase = createClient(supabaseUrl, supabaseKey);


// Define the schema for form validation using zod
const productSchema = z.object({
    title: z.string().min(1, { message: "Title is required." }),
    description: z.string().min(1, { message: "Description is required." }),
    category: z.string().min(1, { message: "Category ID is required." }),
    brand: z.string().min(1, { message: "Brand is required." }),
    quantity: z.number().min(0, "Quantity cannot be negative").default(0),
    mrp: z.number().min(0, { message: "MRP cannot be negative." }),
    selling_price: z.number().min(0, { message: "Price cannot be negative." }),
    images: z.array(z.instanceof(File)).min(1, { message: "At least one image is required" }),
    extra_features: z.array(
        z.object({
            key: z.string().min(1, "Feature key is required"),
            value: z.string().min(1, "Feature value is required"),
        })
    ).optional(),
});



type ProductFormValues = z.infer<typeof productSchema>;

export function AddProductForm() {
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const {toast} = useToast();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            brand: "",
            quantity: 0,
            mrp: 0,
            selling_price: 0,
            images: [],
            extra_features: [],
        },
    });

    const { fields: featureFields, append, remove } = useFieldArray({
        control: form.control,
        name: "extra_features",
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files);
            form.setValue("images", fileArray);
        }
    };

    const handleRemoveImage = (index: number) => {
        const currentImages = form.getValues().images;
        form.setValue("images", currentImages.filter((_, i) => i !== index));
    };

    useEffect(() => {
        // Fetch categories from API


        async function fetchCategories() {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error Fetching Categories",
                })
                console.log("Error fetching categories:", error);
            }
        }

        fetchCategories();
    }, []);

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop(); // Get file extension
        const uniqueFileName = `${uuidv4()}.${fileExt}`; // Generate UUID-based filename

        const { data, error } = await supabase.storage
            .from('products')
            .upload(`products/${uniqueFileName}`, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            toast({
                variant: "destructive",
                title: "Error Uploading Images",
                description: error.toString(),
            })
        }

        return data;
    };

    async function onSubmit(values: ProductFormValues) {
        try {

            const imageUrls = await Promise.all(values.images.map(async (file) => {
                const paths = await uploadImage(file);
                const path = paths?.path;
                const { data } = supabase.storage.from("products").getPublicUrl(path || "Unknown");

                return data.publicUrl;
            }));

            const productData = {
                ...values,
                images: imageUrls,
            };

            const data = await addProduct(productData);
            if(data) {
                toast({
                    title: "Product Added Successfully!",
                    description: "Wait For Approval"

                })
                form.reset();
            }
        } catch (error) {
            console.log("Error adding product:", error);
            toast({
                variant: "destructive",
                title: "Error Fetching Categories",
            })
        }
    }

    return (
        <Layout>
            <div className="p-2 w-full sm:w-3/4 lg:w-2/3 mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Product title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Product description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Category & Brand */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <select {...field} className="w-full p-2 border rounded">
                                                <option value="">Select a category</option>
                                                {categories.map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Brand</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Brand name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="mrp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>MRP</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="selling_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Selling Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Quantity */}
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock Quantity</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Image Upload */}
                        <div>
                            <FormField
                                control={form.control}
                                name="images"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Upload Images</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {form.watch("images").map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`preview-${index}`}
                                            className="w-24 h-24 object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Extra Features */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Product Features</h3>
                            {featureFields.map((item, index) => (
                                <div key={item.id} className="flex flex-col sm:flex-row gap-2 mb-2">
                                    <FormField
                                        control={form.control}
                                        name={`extra_features.${index}.key`}
                                        render={({field}) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="Feature name" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`extra_features.${index}.value`}
                                        render={({field}) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="Feature value" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => remove(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                onClick={() => append({ key: "", value: "" })}
                            >
                                Add Feature
                            </Button>
                        </div>

                        <Button type="submit" className="w-full sm:w-auto">Create Product</Button>
                    </form>
                </Form>
            </div>
        </Layout>
    );
}