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

// Define the schema for form validation using zod
const productSchema = z
    .object({
        title: z.string().min(1, { message: "Title is required." }),
        description: z.string().min(1, { message: "Description is required." }),
        category: z.string().min(1, { message: "Category ID is required." }),
        brand: z.string().min(1, { message: "Brand is required." }),
        quantity: z.number().min(0, "Quantity cannot be negative").default(0),
        mrp: z.number().min(0, { message: "MRP cannot be negative." }), // Required
        selling_price: z.number().min(0, { message: "Price cannot be negative." }), // Required
        is_ad: z.boolean().default(false),
        images: z.array(z.string().url("Invalid URL format")).min(1, {message:"At least one image URL is required"}),
        extra_features: z
            .array(
                z.object({
                    key: z.string().min(1, "Feature key is required"),
                    value: z.string().min(1, "Feature value is required"),
                })
            )
            .optional(),
    })
    .refine(
        (data) => data.selling_price <= data.mrp, // Custom validation logic
        {
            message: "Selling price must be less than or equal to MRP.",
            path: ["selling_price"], // Error will be associated with the `selling_price` field
        }
    );



type ProductFormValues = z.infer<typeof productSchema>;

export function AddProductForm() {
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

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
            is_ad: false,
            images: [],
            extra_features: [],
        },
    });

    const { fields: featureFields, append, remove } = useFieldArray({
        control: form.control,
        name: "extra_features",
    });

    const handleAddImage = () => {
        const currentImages = form.getValues().images;
        form.setValue("images", [...currentImages, ""]);
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
                console.error('Error fetching categories:', error);
            }
        }

        fetchCategories();
    }, []);

    async function onSubmit(values: ProductFormValues) {

        try {
            const data = await addProduct(values);
            console.log('Product created:', data);
        } catch (error) {
            console.error('Error submitting product:', error);
            // Handle error
        }
    }

    return (
        <Layout>
            <div className='p-2 w-3/4'>
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

                        {/* Category Select */}
                        <div className='grid grid-cols-2 gap-4'>
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

                        {/* Brand */}
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
                        {/* Pricing Section */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="mrp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>MRP (Maximum Retail Price)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                {...field}
                                                onChange={e => field.onChange(Number(e.target.value))}
                                            />
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
                                            <Input
                                                type="text"
                                                {...field}
                                                onChange={e => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Quantity and Ad Checkbox */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={e => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Image URLs */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Image URLs</h3>
                            {form.watch("images").map((_, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <FormField
                                        control={form.control}
                                        name={`images.${index}`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        placeholder="https://example.com/image.jpg"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleAddImage}
                            >
                                Add Image URL
                            </Button>

                            {/* Display validation message for the entire images array */}
                            <FormField
                                control={form.control}
                                name="images"
                                render={() => (
                                    <FormItem>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Extra Features */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Product Features</h3>
                            {featureFields.map((item, index) => (
                                <div key={item.id} className="flex gap-2 mb-2">
                                    <FormField
                                        control={form.control}
                                        name={`extra_features.${index}.key`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="Feature name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`extra_features.${index}.value`}
                                        render={({ field }) => (
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

                        <Button type="submit">Create Product</Button>
                    </form>
                </Form>
            </div>
        </Layout>
    );
}