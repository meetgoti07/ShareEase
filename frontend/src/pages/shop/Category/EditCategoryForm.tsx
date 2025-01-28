"use client";

import * as z from "zod";
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
import { categorySchema } from "../schema.ts";
import { useEffect, useRef } from "react";

type CategoryFormValues = z.infer<typeof categorySchema>;

interface EditCategoryFormProps {
    initialData?: CategoryFormValues;
    onSubmit: (values: CategoryFormValues) => Promise<void>;
}

export function EditCategoryForm({ initialData, onSubmit }: EditCategoryFormProps) {
    const isSlugManuallyEdited = useRef(false);

    const editForm = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: initialData?.name || "",
            slug: initialData?.slug || "",
            description: initialData?.description || "",
        },
    });

    // Watch name field changes
    useEffect(() => {
        const subscription = editForm.watch((value, { name }) => {
            // Only update slug if name field changed and slug hasn't been manually edited
            if (name === "name" && !isSlugManuallyEdited.current && value.name) {
                const generatedSlug = value.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");

                // Only update if the generated slug is different from current value
                if (editForm.getValues("slug") !== generatedSlug) {
                    editForm.setValue("slug", generatedSlug, {
                        shouldDirty: true,
                        shouldTouch: true
                    });
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [editForm]);

    // Handle slug field manual changes
    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isSlugManuallyEdited.current = true;
        editForm.setValue("slug", e.target.value, {
            shouldDirty: true,
            shouldTouch: true
        });
    };

    const handleSubmit = async (values: CategoryFormValues) => {
        await onSubmit(values);
        editForm.reset();
        isSlugManuallyEdited.current = false;
    };

    return (
        <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={editForm.control}
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
                    control={editForm.control}
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
                    control={editForm.control}
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
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            isSlugManuallyEdited.current = false;
                            editForm.reset(initialData);
                        }}
                    >
                        Reset
                    </Button>
                    <Button type="submit" className="w-full">
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
    );
}