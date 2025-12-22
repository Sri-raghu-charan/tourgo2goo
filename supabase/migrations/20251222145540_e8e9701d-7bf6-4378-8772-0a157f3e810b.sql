-- Create role enum
CREATE TYPE public.app_role AS ENUM ('tourist', 'hotel_owner', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  location TEXT,
  total_coins INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'tourist',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create hotel categories enum
CREATE TYPE public.hotel_category AS ENUM ('budget', 'premium', 'resort');

-- Create hotels table
CREATE TABLE public.hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  category hotel_category DEFAULT 'budget',
  images TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_per_night DECIMAL(10, 2) NOT NULL,
  total_rooms INTEGER DEFAULT 1,
  available_rooms INTEGER DEFAULT 1,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create food category enum
CREATE TYPE public.food_category AS ENUM ('veg', 'non_veg', 'drinks', 'desserts');

-- Create food items table
CREATE TABLE public.food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category food_category NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create discount type enum
CREATE TYPE public.discount_type AS ENUM ('flat', 'percentage', 'free_item');

-- Create discount target enum
CREATE TYPE public.discount_target AS ENUM ('room', 'food');

-- Create discounts table
CREATE TABLE public.discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  coins_required INTEGER NOT NULL,
  discount_type discount_type NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  target discount_target NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create booking status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  coins_used INTEGER DEFAULT 0,
  discount_applied DECIMAL(10, 2) DEFAULT 0,
  status booking_status DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create coin transactions table
CREATE TABLE public.coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  description TEXT,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role on signup"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Hotels policies
CREATE POLICY "Anyone can view active hotels"
  ON public.hotels FOR SELECT
  USING (is_active = true);

CREATE POLICY "Hotel owners can manage their hotels"
  ON public.hotels FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id);

-- Rooms policies
CREATE POLICY "Anyone can view available rooms"
  ON public.rooms FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = rooms.hotel_id AND hotels.is_active = true));

CREATE POLICY "Hotel owners can manage their rooms"
  ON public.rooms FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = rooms.hotel_id AND hotels.owner_id = auth.uid()));

-- Food items policies
CREATE POLICY "Anyone can view food items"
  ON public.food_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = food_items.hotel_id AND hotels.is_active = true));

CREATE POLICY "Hotel owners can manage their food items"
  ON public.food_items FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = food_items.hotel_id AND hotels.owner_id = auth.uid()));

-- Discounts policies
CREATE POLICY "Anyone can view active discounts"
  ON public.discounts FOR SELECT
  USING (is_active = true AND EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = discounts.hotel_id AND hotels.is_active = true));

CREATE POLICY "Hotel owners can manage their discounts"
  ON public.discounts FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = discounts.hotel_id AND hotels.owner_id = auth.uid()));

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Hotel owners can view bookings for their hotels"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = bookings.hotel_id AND hotels.owner_id = auth.uid()));

-- Coin transactions policies
CREATE POLICY "Users can view their own transactions"
  ON public.coin_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON public.coin_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'User'),
    NEW.raw_user_meta_data ->> 'phone'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'tourist')
  );
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hotels_updated_at
  BEFORE UPDATE ON public.hotels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_food_items_updated_at
  BEFORE UPDATE ON public.food_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discounts_updated_at
  BEFORE UPDATE ON public.discounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();