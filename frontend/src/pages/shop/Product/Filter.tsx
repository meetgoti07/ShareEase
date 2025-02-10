import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";


const Filter = ({ products  , onFilterChange }) => {
    // Dynamic state initialization
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortBy, setSortBy] = useState("");
    const [inStock, setInStock] = useState(false);

    // Derived values from products
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [availableBrands, setAvailableBrands] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);

    // Initialize filters based on product data
    useEffect(() => {
        if (products.length > 0) {
            // Get price range
            const prices = products.map(p => parseFloat(p.selling_price));
            const min = Math.floor(Math.min(...prices));
            const max = Math.ceil(Math.max(...prices));
            setMinPrice(min);
            setMaxPrice(max);
            setPriceRange([min, max]);

            // Get unique brands
            const brands = [...new Set(products.map(p => p.brand.toLowerCase()))];
            const categories = [...new Set(products.map(p => p.category))];
            setAvailableBrands(brands);
            setAvailableCategories(categories);
        }
    }, [products]);

    const handleApplyFilters = () => {
        onFilterChange({
            priceRange,
            brands: selectedBrands,
            categories: selectedCategories,
            sortBy,
            inStock
        });
    };


    const handleBrandChange = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };


    const formatCurrency = (value) => {
        return `₹${value.toLocaleString('en-IN')}`;
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <FilterIcon className="h-4 w-4" />
                    Filters {selectedBrands.length > 0 && `(${selectedBrands.length})`}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                    <SheetDescription>
                        {products.length} products available
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                    <div className="space-y-6 py-4">
                        {/* Sort Options */}
                        <div className="space-y-2">
                            <Label>Sort By</Label>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select sorting option"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator/>

                        {/* Dynamic Price Range */}
                        <div className="space-y-2">
                            <Label>Price Range</Label>
                            <div className="pt-2">
                                <Slider
                                    min={minPrice}
                                    max={maxPrice}
                                    step={Math.ceil((maxPrice - minPrice) / 100)}
                                    value={priceRange}
                                    onValueChange={setPriceRange}
                                />
                                <div className="flex justify-between mt-2 text-sm">
                                    <span>{formatCurrency(priceRange[0])}</span>
                                    <span>{formatCurrency(priceRange[1])}</span>
                                </div>
                            </div>
                        </div>

                        <Separator/>

                        {/* Dynamic Brands */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Brands</Label>
                                {selectedBrands.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        className="h-auto p-0 text-sm text-muted-foreground"
                                        onClick={() => setSelectedBrands([])}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {availableBrands.map((brand) => {
                                    const count = products.filter(p =>
                                        p.brand.toLowerCase() === brand
                                    ).length;
                                    return (
                                        <div key={brand} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={brand}
                                                checked={selectedBrands.includes(brand)}
                                                onCheckedChange={() => handleBrandChange(brand)}
                                            />
                                            <label
                                                htmlFor={brand}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between w-full"
                                            >
                                                <span>{brand.charAt(0).toUpperCase() + brand.slice(1)}</span>
                                                <span className="text-muted-foreground">({count})</span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <Separator/>

                        {/*Dynamic Categories*/}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Categories</Label>
                                {selectedCategories.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        className="h-auto p-0 text-sm text-muted-foreground"
                                        onClick={() => setSelectedCategories([])}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {availableCategories.map((category) => {
                                    const count = products.filter(p =>
                                        p.category === category
                                    ).length;
                                    return (
                                        <div key={category} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={category}
                                                checked={selectedCategories.includes(category)}  // ✅ Correct state used
                                                onCheckedChange={() => handleCategoryChange(category)}  // ✅ Correct function called
                                            />

                                            <label
                                                htmlFor={category}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between w-full"
                                            >
                                                <span>{category}</span>
                                                <span className="text-muted-foreground">({count})</span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                    </div>
                </ScrollArea>

                <SheetFooter className="pt-4">
                    <div className="w-full space-y-2">
                        {(selectedBrands.length > 0 || selectedCategories.length > 0 || inStock || sortBy ) && (
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setSelectedBrands([]);
                                    setInStock(false);
                                    setSelectedCategories([]);
                                    setSortBy("");
                                    setPriceRange([minPrice, maxPrice]);
                                    onFilterChange({
                                        priceRange: [minPrice, maxPrice],
                                        brands: [],
                                        categories: [],
                                        sortBy: "",
                                        inStock: false
                                    });
                                }}
                            >
                                Reset Filters
                            </Button>
                        )}
                        <SheetClose asChild>
                            <Button onClick={handleApplyFilters} className="w-full">
                                Apply Filters
                            </Button>
                        </SheetClose>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default Filter;