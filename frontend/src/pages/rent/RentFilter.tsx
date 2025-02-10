import { useState, useEffect } from 'react';
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

const RentFilter = ({ properties, onFilterChange }) => {
    // States for filters
    const [rentRange, setRentRange] = useState([0, 0]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [furnished, setFurnished] = useState(null); // null = all, true = furnished, false = unfurnished
    const [sortBy, setSortBy] = useState("");
    const [isAvailable, setIsAvailable] = useState(false);

    // Derived values
    const [minRent, setMinRent] = useState(0);
    const [maxRent, setMaxRent] = useState(0);
    const [availableLocations, setAvailableLocations] = useState([]);

    useEffect(() => {
        if (properties.length > 0) {
            // Get Rent Range
            const rents = properties.map(p => parseFloat(p.rent_per_month));
            const min = Math.floor(Math.min(...rents));
            const max = Math.ceil(Math.max(...rents));
            setMinRent(min);
            setMaxRent(max);
            setRentRange([min, max]);

            // Get unique locations
            const locations = [...new Set(properties.map(p => p.location))];
            setAvailableLocations(locations);
        }
    }, [properties]);

    const handleApplyFilters = () => {
        onFilterChange({
            rentRange,
            locations: selectedLocations,
            furnished,
            sortBy,
            isAvailable
        });
    };

    const handleLocationChange = (location) => {
        setSelectedLocations(prev =>
            prev.includes(location)
                ? prev.filter(l => l !== location)
                : [...prev, location]
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
                    Filters {selectedLocations.length > 0 && `(${selectedLocations.length})`}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle>Filter Properties</SheetTitle>
                    <SheetDescription>
                        {properties.length} properties available
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                    <div className="space-y-6 py-4">
                        {/* Sort Options */}
                        <div className="space-y-2">
                            <Label>Sort By</Label>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select sorting option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rent-asc">Rent: Low to High</SelectItem>
                                    <SelectItem value="rent-desc">Rent: High to Low</SelectItem>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator />

                        {/* Rent Range */}
                        <div className="space-y-2">
                            <Label>Rent Per Month</Label>
                            <div className="pt-2">
                                <Slider
                                    min={minRent}
                                    max={maxRent}
                                    step={Math.ceil((maxRent - minRent) / 100)}
                                    value={rentRange}
                                    onValueChange={setRentRange}
                                />
                                <div className="flex justify-between mt-2 text-sm">
                                    <span>{formatCurrency(rentRange[0])}</span>
                                    <span>{formatCurrency(rentRange[1])}</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Locations */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Locations</Label>
                                {selectedLocations.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        className="h-auto p-0 text-sm text-muted-foreground"
                                        onClick={() => setSelectedLocations([])}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {availableLocations.map((location) => {
                                    const count = properties.filter(p => p.location === location).length;
                                    return (
                                        <div key={location} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={location}
                                                checked={selectedLocations.includes(location)}
                                                onCheckedChange={() => handleLocationChange(location)}
                                            />
                                            <label
                                                htmlFor={location}
                                                className="text-sm font-medium leading-none flex justify-between w-full"
                                            >
                                                <span>{location}</span>
                                                <span className="text-muted-foreground">({count})</span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <Separator />

                        {/* Furnished/Unfurnished */}
                        <div className="space-y-2">
                            <Label>Furnished</Label>
                            <Select value={furnished !== null ? furnished.toString() : "all"} onValueChange={value => setFurnished(value === "true" ? true : value === "false" ? false : null)}>
                            <SelectTrigger>
                                    <SelectValue placeholder="Select Furnishing" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>  {/* Fix: Use a defined value instead of an empty string */}
                                    <SelectItem value="true">Furnished</SelectItem>
                                    <SelectItem value="false">Unfurnished</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </div>
                </ScrollArea>

                <SheetFooter className="pt-4">
                    <div className="w-full space-y-2">
                        {(selectedLocations.length > 0 || isAvailable || sortBy || furnished !== null) && (
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setSelectedLocations([]);
                                    setIsAvailable(false);
                                    setSortBy("");
                                    setRentRange([minRent, maxRent]);
                                    setFurnished(null);
                                    onFilterChange({
                                        rentRange: [minRent, maxRent],
                                        locations: [],
                                        furnished: null,
                                        sortBy: "",
                                        isAvailable: false
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

export default RentFilter;
