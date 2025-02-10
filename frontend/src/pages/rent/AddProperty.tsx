"use client";

import * as z from "zod";
import {useFieldArray, useForm} from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Layout from "@/layout/Layout";
import { useToast } from "@/hooks/use-toast";

import { v4 as uuidv4 } from 'uuid';
import {supabase} from "@/pages/shop/Manage/AddProduct.tsx";
import {addProperty} from "@/pages/rent/api/api.tsx";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

// Define the schema for form validation using zod
const propertySchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: "Title is required." }),
    description: z.string().min(1, { message: "Description is required." }),
    location: z.string().min(1, { message: "Location is required." }),
    images: z.array(z.instanceof(File)).min(1, { message: "At least one image is required" }),
    rent_per_month: z.number().min(0, { message: "Rent cannot be negative." }),
    security_deposit: z.number().min(0, { message: "Security deposit cannot be negative." }),
    furnished: z.boolean().default(false),
    total_vacancy: z.number().min(1, { message: "Total vacancy must be at least 1" }),
    available_vacancy: z.number().min(0, { message: "Available vacancy cannot be negative" }),
    sharing: z.number().min(1, { message: "Sharing must be at least 1" }),
    custom_features: z.array(
        z.object({
            key: z.string().min(1, "Feature key is required"),
            value: z.string().min(1, "Feature value is required"),
        })
    ).optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

export function AddPropertyForm() {
    const { toast } = useToast();

    const form = useForm<PropertyFormValues>({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            title: "",
            description: "",
            location: "",
            images: [],
            rent_per_month: 0,
            security_deposit: 0,
            furnished: false,
            total_vacancy: 1,
            available_vacancy: 1,
            sharing: 1,
            custom_features: [],
        },
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

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `${uuidv4()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('products')
            .upload(`properties/${uniqueFileName}`, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            toast({
                variant: "destructive",
                title: "Error Uploading Images",
                description: error.toString(),
            });
        }

        return data;
    };

    const { fields: featureFields, append, remove } = useFieldArray({
        control: form.control,
        name: "custom_features",
    });


    async function onSubmit(values: PropertyFormValues) {
        try {
            console.log("Submitting Property:", values);

            const imageUrls = await Promise.all(values.images.map(async (file) => {
                const paths = await uploadImage(file);
                const path = paths?.path;
                const { data } = supabase.storage.from("products").getPublicUrl(path || "Unknown");
                return data.publicUrl;
            }));

            const propertyData = {
                ...values,
                images: imageUrls,
            };
            console.log(propertyData.images);
            // Add your API call here to save the property
            if(propertyData.images.length > 0) {
                const data: PropertyFormValues = await addProperty(propertyData);
                if (data.id) {
                    toast({
                        title: "Property Listed Successfully!",
                        description: "Your property has been listed for review"
                    });
                    form.reset();
                }
            } else {
                throw error;
            }
        } catch (error) {
            console.log("Error adding property:", error);
            toast({
                variant: "destructive",
                title: "Error Adding Property",
            });
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
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Property Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 2 BHK near College" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Detailed description of the property" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Location */}
                        <FormField
                            control={form.control}
                            name="location"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Full address of the property" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Rent and Deposit Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="rent_per_month"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Monthly Rent</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field}
                                                   onChange={(e) => field.onChange(Number(e.target.value))}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="security_deposit"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Security Deposit</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field}
                                                   onChange={(e) => field.onChange(Number(e.target.value))}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Vacancy and Sharing Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="total_vacancy"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Total Rooms</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field}
                                                   onChange={(e) => field.onChange(Number(e.target.value))}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="available_vacancy"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Available Rooms</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field}
                                                   onChange={(e) => field.onChange(Number(e.target.value))}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="sharing"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Sharing (per room)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field}
                                                   onChange={(e) => field.onChange(Number(e.target.value))}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Toggle Switches */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="furnished"
                                render={({field}) => (
                                    <FormItem
                                        className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel>Furnished</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <FormField
                                control={form.control}
                                name="images"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Upload Property Images</FormLabel>
                                        <FormControl>
                                            <Input type="file" multiple accept="image/*" onChange={handleFileChange}/>
                                        </FormControl>
                                        <FormMessage/>
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

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Product Features</h3>
                            {featureFields.map((item, index) => (
                                <div key={item.id} className="flex flex-col sm:flex-row gap-2 mb-2">
                                    <FormField
                                        control={form.control}
                                        name={`custom_features.${index}.key`}
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
                                        name={`custom_features.${index}.value`}
                                        render={({field}) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="Feature value" {...field} />
                                                </FormControl>
                                                <FormMessage/>
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
                                onClick={() => append({key: "", value: ""})}
                            >
                                Add Feature
                            </Button>
                        </div>

                        <Button type="submit" className="w-full sm:w-auto">List Property</Button>
                    </form>
                </Form>
            </div>
        </Layout>

    );
}