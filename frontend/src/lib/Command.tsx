"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command.tsx"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx"
import {searchProduct} from "@/pages/shop/api/api.tsx"
import {useNavigate} from "react-router-dom";

// Define the Product type
type Product = {
    id: string
    title: string
    selling_price: number

}

export function CommandDemo() {
    const [open, setOpen] = React.useState<boolean>(false)
    const [value, setValue] = React.useState<string>("")
    const [products, setProducts] = React.useState<Product[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string | null>(null)
    const navigate = useNavigate();

    // Debounce function with TypeScript types
    const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
        let timeout: ReturnType<typeof setTimeout>
        return (...args: Parameters<T>) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => func(...args), wait)
        }
    }

    const searchProducts = async (query: string) => {
        if (!query) {
            setProducts([])
            setError(null)
            return
        }

        setLoading(true)
        setError(null)

        try {
            const data:any = await searchProduct(query)

            if (!data || !data.products) {
                throw new Error('No products found')
            }

            if (data.products.length === 0) {
                setError('No products found')
            }

            setProducts(data.products)
        } catch (error) {
            console.error('Search error:', error)
            setError(error instanceof Error ? error.message : 'Failed to fetch products')
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    // Debounced search function with TypeScript types
    const debouncedSearch = React.useMemo(
        () => debounce(searchProducts, 300),
        []
    )

    // Format price to local currency
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value ? value : "Search Products..."}
                    <SearchIcon className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search Products..."
                        onValueChange={(search: string) => {
                            debouncedSearch(search)
                        }}
                    />
                    <CommandList>
                        {loading && <CommandEmpty>Searching...</CommandEmpty>}
                        {error && <CommandEmpty>{error}</CommandEmpty>}
                        {!loading && !error && products.length === 0 && (
                            <CommandEmpty>No products found.</CommandEmpty>
                        )}
                        <CommandGroup>
                            {products.map((product: Product) => (
                                <CommandItem
                                    key={product.id}
                                    value={product.id}
                                    onSelect={() => {
                                        setValue(product.title)
                                        setOpen(false)
                                        navigate(`/shop/${product.id}`)
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <span className="font-medium">{product.title}</span>
                                    <span className="text-sm text-gray-500">
                                        {formatPrice(product.selling_price)}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default CommandDemo