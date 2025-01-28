"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Import Shadcn UI form components
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form"; // Adjust the import paths as needed
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {getUserMeta, setUserMeta} from "@/lib/allAuth.tsx";
import {useEffect} from "react";

import { useToast } from "@/hooks/use-toast"
import {currentTime} from "@/lib/utils.ts";


// Define the schema for form validation using zod
const profileSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    institute: z.string().min(1, { message: "Institute is required." }),
    department: z.string().min(1, { message: "Department is required." }),
    division: z.string().min(1, { message: "Division is required." }),
    mobile_number: z
        .string()
        .min(10, { message: "Mobile number must be at least 10 digits." })
        .max(15, { message: "Mobile number is too long." }),
});

export function ProfileForm() {
    // Initialize the form with react-hook-form and zod resolver
    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            institute: "",
            department: "",
            division: "",
            mobile_number: "",
        },
    });

    const { toast } = useToast();

    useEffect(() => {
        async function fetchData() {
            const userMeta = await getUserMeta();
            form.reset(userMeta);
        }
        fetchData();
    }, [form]);

    // Submit handler
    async function onSubmit(values: z.infer<typeof profileSchema>) {
        const resp:z.infer<typeof profileSchema> = await setUserMeta(values);
        if(resp.name) {
            toast({
                title: "Profile Updated Successfully!",
                description: currentTime(),
            })
        } else {
            toast({
                variant: "destructive",
                title: "Something Unexpected Happened!",
                description: currentTime(),
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Name Field */}
                <div className='flex gap-3'>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem className='w-full'>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Name" {...field} />
                                </FormControl>
                                <FormDescription>Your full name.</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                </div>
                {/* Institute Field */}
                <div className='flex gap-3'>
                    <FormField
                        control={form.control}
                        name="institute"
                        render={({field}) => (
                            <FormItem className='w-1/2'>
                                <FormLabel>Institute</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Institute" {...field} />
                                </FormControl>
                                <FormDescription>The institute you belong to.</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* Department Field */}
                    <FormField
                        control={form.control}
                        name="department"
                        render={({field}) => (
                            <FormItem className='w-1/2'>
                                <FormLabel>Department</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Department" {...field} />
                                </FormControl>
                                <FormDescription>Your department.</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Division Field */}
                <div className='flex gap-3'>
                    <FormField
                        control={form.control}
                        name="division"
                        render={({field}) => (
                            <FormItem className='w-1/2'>
                                <FormLabel>Division</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Division" {...field} />
                                </FormControl>
                                <FormDescription>Your division.</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* Mobile Number Field */}
                    <FormField
                        control={form.control}
                        name="mobile_number"
                        render={({field}) => (
                            <FormItem className='w-1/2'>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Mobile Number" {...field} />
                                </FormControl>
                                <FormDescription>Your contact number.</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                    {/* Submit Button */}
                    <Button type="submit">Update Profile</Button>
            </form>
        </Form>
);
}
