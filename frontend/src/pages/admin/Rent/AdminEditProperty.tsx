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
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import Layout from "@/layout/Layout.tsx";
import { useToast } from "@/hooks/use-toast.ts";


import {editProperty, getPropertyById} from "@/pages/admin/api/api.tsx";


import {useParams} from "react-router-dom";

// Define the schema for form validation using zod
const propertySchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: "Title is required." }),
    description: z.string().min(1, { message: "Description is required." }),
    location: z.string().min(1, { message: "Location is required." }),
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

export function AdminEditProperty() {
    const { toast } = useToast();
    const {id} = useParams();

    const form = useForm<PropertyFormValues>({
        resolver: zodResolver(propertySchema),
        defaultValues: async () => {
            if (id) {

                const data: PropertyFormValues = await getPropertyById(id);

                data.total_vacancy = Math.floor(parseFloat(data.total_vacancy.toString()));
                data.rent_per_month = Math.floor(parseFloat(data.rent_per_month.toString()));
                data.security_deposit = Math.floor(parseFloat(data.security_deposit.toString()));
                data.available_vacancy = Math.floor(parseFloat(data.available_vacancy.toString()));
                data.sharing = Math.floor(parseFloat(data.sharing.toString()));

                return data;

            }
            return {
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
            };
        },
    });



    const { fields: featureFields, append, remove } = useFieldArray({
        control: form.control,
        name: "custom_features",
    });


    async function onSubmit(values: PropertyFormValues) {
        try {
                const data: PropertyFormValues = await editProperty(id || "" , values);
                if (data.id) {
                    toast({
                        title: "Property Editec Successfully!",
                        description: "Your property has been listed for review"
                    });
                    form.reset();
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

                        <Button type="submit" className="w-full sm:w-auto">Edit Property</Button>
                    </form>
                </Form>
            </div>
        </Layout>

    );
}