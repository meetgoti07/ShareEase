"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUserMeta, setUserMeta } from "@/lib/allAuth.tsx";
import { useToast } from "@/hooks/use-toast";
import { currentTime } from "@/lib/utils.ts";

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

type Profile = z.infer<typeof profileSchema>;
export function ProfileForm() {
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
            try {
                const userMeta: Profile = await getUserMeta();
                if (userMeta) {
                    // Ensure all form fields have string values
                    const sanitizedData= {
                        name: userMeta.name ?? "",
                        institute: userMeta.institute ?? "",
                        department: userMeta.department ?? "",
                        division: userMeta.division ?? "",
                        mobile_number: userMeta.mobile_number ?? "",
                    };
                    form.reset(sanitizedData);
                }
            } catch (error) {
                console.error("Error fetching user meta:", error);
            }
        }
        fetchData();
    }, [form]);

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        try {
            const resp: Profile = await setUserMeta(values);
            if (resp.name || resp.institute || resp.department || resp.division || resp.mobile_number) {
                toast({
                    title: "Profile Updated Successfully!",
                    description: currentTime(),
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Something Unexpected Happened!",
                    description: currentTime(),
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error updating profile",
                description: "Please try again later.",
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your Name" {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormDescription>Your full name.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Institute and Department Fields */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <FormField
                        control={form.control}
                        name="institute"
                        render={({ field }) => (
                            <FormItem className="w-full sm:w-1/2">
                                <FormLabel>Institute</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Institute" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormDescription>The institute you belong to.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                            <FormItem className="w-full sm:w-1/2">
                                <FormLabel>Department</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Department" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormDescription>Your department.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Division and Mobile Number Fields */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <FormField
                        control={form.control}
                        name="division"
                        render={({ field }) => (
                            <FormItem className="w-full sm:w-1/2">
                                <FormLabel>Division</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Division" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormDescription>Your division.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="mobile_number"
                        render={({ field }) => (
                            <FormItem className="w-full sm:w-1/2">
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Mobile Number" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormDescription>Your contact number.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit">Update Profile</Button>
            </form>
        </Form>
    );
}