import * as z from "zod";

export const categorySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: "Name is required." }),
    slug: z.string().min(1, { message: "Slug is required." }),
    description: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;


export type ExtraFeature = {
    key: string;
    value: string;
};

export type Product = {
    id: number;
    owner: number;
    title: string;
    description: string;
    brand: string;
    quantity: number;
    mrp: string;
    selling_price: string;
    is_ad: boolean;
    created_at: string;
    updated_at: string;
    is_sold: boolean;
    category: number;
    images: string[];
    extra_features: ExtraFeature[];
};
