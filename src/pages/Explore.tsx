import { Navigation } from "@/components/Navigation";
import  InteractiveMap from "@/components/InteractiveMap";
import { LocationCard } from "@/components/LocationCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Filter, Search, Compass, MapPin, List, Map } from "lucide-react";
import { useState } from "react";

const allLocations = [
  {
    name: "Crystal Falls",
    category: "nature" as const,
    distance: "2.3 km",
    points: 150,
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&h=300&fit=crop",
    rating: 4.8,
    visitCount: 1245,
  },
  {
    name: "Sunset Bistro",
    category: "food" as const,
    distance: "0.8 km",
    points: 100,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    rating: 4.6,
    visitCount: 892,
  },
  {
    name: "Ancient Temple",
    category: "culture" as const,
    distance: "5.1 km",
    points: 200,
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=300&fit=crop",
    rating: 4.9,
    visitCount: 2341,
  },
  {
    name: "Sky Bridge Adventure",
    category: "adventure" as const,
    distance: "3.7 km",
    points: 250,
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&h=300&fit=crop",
    rating: 4.7,
    visitCount: 567,
  },
  {
    name: "Heritage Museum",
    category: "historical" as const,
    distance: "1.2 km",
    points: 175,
    image: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&h=300&fit=crop",
    rating: 4.5,
    visitCount: 1823,
  },
  {
    name: "Ocean View Restaurant",
    category: "food" as const,
    distance: "4.5 km",
    points: 120,
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop",
    rating: 4.7,
    visitCount: 645,
  },
  {
    name: "Mountain Trail",
    category: "adventure" as const,
    distance: "8.2 km",
    points: 300,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop",
    rating: 4.9,
    visitCount: 432,
  },
  {
    name: "Botanical Gardens",
    category: "nature" as const,
    distance: "3.0 km",
    points: 125,
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop",
    rating: 4.6,
    visitCount: 978,
  },
];

const categories = [
  { name: "All", icon: Compass, value: "all" },
  { name: "Nature", emoji: "🌿", value: "nature" },
  { name: "Food", emoji: "🍜", value: "food" },
  { name: "Culture", emoji: "🏛️", value: "culture" },
  { name: "Adventure", emoji: "🏔️", value: "adventure" },
  { name: "Historical", emoji: "🏰", value: "historical" },
];

const Explore = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = allLocations.filter((loc) => {
    const matchesCategory = activeCategory === "all" || loc.category === activeCategory;
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 md:pt-32 pb-32 md:pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
              Explore Places
            </h1>
            <p className="text-muted-foreground">
              Discover amazing locations near you and earn points
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <div className="flex border border-border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("map")}
                  className="rounded-none"
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.value
                    ? "gradient-primary text-primary-foreground shadow-soft"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {cat.icon ? <cat.icon className="w-4 h-4" /> : <span>{cat.emoji}</span>}
                {cat.name}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <Badge variant="outline" className="gap-1">
              <MapPin className="w-3 h-3" />
              {filteredLocations.length} places found
            </Badge>
          </div>

          {/* Content */}
          {viewMode === "map" ? (
            <InteractiveMap />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredLocations.map((location) => (
                <LocationCard key={location.name} {...location} />
              ))}
            </div>
          )}

          {filteredLocations.length === 0 && (
            <div className="text-center py-16">
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">No places found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Explore;
