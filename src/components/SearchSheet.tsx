import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, TrendingUp, X } from "lucide-react";

const recentSearches = [
  "Crystal Falls",
  "Best restaurants nearby",
  "Adventure activities",
];

const trendingPlaces = [
  { name: "Mountain Peak Trail", category: "adventure", distance: "5.2 km" },
  { name: "Historic Old Town", category: "culture", distance: "1.8 km" },
  { name: "Lakeside Café", category: "food", distance: "0.5 km" },
];

interface SearchSheetProps {
  children: React.ReactNode;
}

export function SearchSheet({ children }: SearchSheetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="top" className="h-[80vh] sm:h-auto sm:max-h-[600px]">
        <SheetHeader className="sr-only">
          <SheetTitle>Search Places</SheetTitle>
        </SheetHeader>
        
        <div className="pt-6">
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search places, restaurants, activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-base"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Recent Searches */}
          {!searchQuery && (
            <div className="mb-6">
              <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => setSearchQuery(search)}
                    className="px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Places */}
          <div>
            <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending Near You
            </h3>
            <div className="space-y-2">
              {trendingPlaces.map((place) => (
                <button
                  key={place.name}
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{place.name}</p>
                    <p className="text-xs text-muted-foreground">{place.distance} away</p>
                  </div>
                  <Badge variant={place.category as any} className="text-xs capitalize">
                    {place.category}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Search Results would go here when searchQuery is not empty */}
          {searchQuery && (
            <div className="mt-6 text-center py-8">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Searching for "{searchQuery}"...</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
