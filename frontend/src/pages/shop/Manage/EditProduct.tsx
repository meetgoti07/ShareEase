"use client";

import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


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
import {editProduct, getProduct} from "@/pages/shop/api/api.tsx";

// import { v4 as uuidv4 } from 'uuid';
import { useToast} from "@/hooks/use-toast.ts";
import {useParams} from "react-router-dom";


// import { createClient } from '@supabase/supabase-js';
//
// const supabaseUrl = 'https://puyvmepvpbbvsajxlkju.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1eXZtZXB2cGJidnNhanhsa2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNDE2MDksImV4cCI6MjA1MjYxNzYwOX0.9AHjLae8sgEzV_8B-O_4mRWsQcvb_LtWybCMgy6___I';
// export const supabase = createClient(supabaseUrl, supabaseKey);


// Define the schema for form validation using zod
const productSchema = z.object({
    title: z.string().min(1, { message: "Title is required." }),
    description: z.string().min(1, { message: "Description is required." }),
    brand: z.string().min(1, { message: "Brand is required." }),
    quantity: z.number().min(0, "Quantity cannot be negative").default(0),
    mrp: z.number().min(0, { message: "MRP cannot be negative." }),
    selling_price: z.number().min(0, { message: "Price cannot be negative." }),
    extra_features: z.array(
        z.object({
            key: z.string().min(1, "Feature key is required"),
            value: z.string().min(1, "Feature value is required"),
        })
    ).optional(),
});


type ProductFormValues = z.infer<typeof productSchema>;

export function EditProduct() {

    const {toast} = useToast();

    const {id} = useParams();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: async () => {
            if (id) {
                const data: ProductFormValues = await getProduct(id);

                data.mrp = Math.floor(parseFloat(data.mrp.toString()));
                data.selling_price = Math.floor(parseFloat(data.selling_price.toString()));

                return data;

            }
            return {
                title: "",
                description: "",
                brand: "",
                quantity: 0,
                mrp: 0,
                selling_price: 0,
                extra_features: [],
            };
        },
    });

    const { fields: featureFields, append, remove } = useFieldArray({
        control: form.control,
        name: "extra_features",
    });


    async function onSubmit(values: ProductFormValues) {
        try {
            console.log("Submitting Product:", values);

            const data = await editProduct(id, values);
            if(data) {
                toast({
                    title: "Product Edited Successfully!",
                    description: "Wait For Approval"

                })
            }
        } catch (error) {
            console.log("Error adding product:", error);
            toast({
                variant: "destructive",
                title: "Error adding product",
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
                        {/*<div>*/}
                        {/*    <FormField*/}
                        {/*        control={form.control}*/}
                        {/*        name="images"*/}
                        {/*        render={() => (*/}
                        {/*            <FormItem>*/}
                        {/*                <FormLabel>Upload Images</FormLabel>*/}
                        {/*                <FormControl>*/}
                        {/*                    <Input*/}
                        {/*                        type="file"*/}
                        {/*                        multiple*/}
                        {/*                        accept="image/*"*/}
                        {/*                        onChange={handleFileChange}*/}
                        {/*                    />*/}
                        {/*                </FormControl>*/}
                        {/*                <FormMessage />*/}
                        {/*            </FormItem>*/}
                        {/*        )}*/}
                        {/*    />*/}
                        {/*    <div className="flex flex-wrap gap-2 mt-2">*/}
                        {/*        {form.watch("images").map((file, index) => (*/}
                        {/*            <div key={index} className="relative">*/}
                        {/*                <img*/}
                        {/*                    src={URL.createObjectURL(file)}*/}
                        {/*                    alt={`preview-${index}`}*/}
                        {/*                    className="w-24 h-24 object-cover rounded-md"*/}
                        {/*                />*/}
                        {/*                <button*/}
                        {/*                    type="button"*/}
                        {/*                    onClick={() => handleRemoveImage(index)}*/}
                        {/*                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"*/}
                        {/*                >*/}
                        {/*                    &times;*/}
                        {/*                </button>*/}
                        {/*            </div>*/}
                        {/*        ))}*/}
                        {/*    </div>*/}
                        {/*</div>*/}

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
                                variant={"outline"}
                                onClick={() => append({ key: "", value: "" })}
                            >
                                Add Feature
                            </Button>
                        </div>

                        <Button type="submit" className="w-full sm:w-auto">Edit Product</Button>
                    </form>
                </Form>
            </div>
        </Layout>
    );
}