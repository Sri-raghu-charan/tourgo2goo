-- Add base_coin_deduction column to hotels table
ALTER TABLE public.hotels 
ADD COLUMN base_coin_deduction integer NOT NULL DEFAULT 0;

-- Add comment for clarity
COMMENT ON COLUMN public.hotels.base_coin_deduction IS 'Number of coins to deduct from user for every room booking';