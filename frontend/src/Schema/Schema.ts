import * as z from "zod";

export const CategorySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: "Name is required." }),
    slug: z.string().min(1, { message: "Slug is required." }),
    description: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof CategorySchema>;


export type ExtraFeatureSchema = {
    key: string;
    value: string;
};

export type ProductSchema = {
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
    is_active: boolean;
    category: number;
    images: string[];
    extra_features: ExtraFeatureSchema[];
};



export interface PropertySchema {
    id: number;
    title: string;
    description: string;
    location: string;
    images: string[];
    rent_per_month: number;
    security_deposit: number;
    furnished: boolean;
    total_vacancy: number;
    available_vacancy: number;
    sharing: number;
    is_active: boolean;
    custom_features: Record<string, any>;
    owner_name: string;
    owner_email: string;
    created_at: string;
    updated_at: string;
}

export interface UserSchema {
  id: number;
  username: string;
  email: string;
}

// Represents the extended UserProfile model.
export interface UserProfileSchema {
  id: number;
  user: UserSchema;
  institute?: string | null;
  department?: string | null;
  division?: string | null;
  mobile_number?: string | null;
  company_name?: string | null;
  address?: string | null;
}