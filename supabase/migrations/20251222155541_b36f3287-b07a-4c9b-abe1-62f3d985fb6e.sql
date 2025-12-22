-- Add RLS policy for hotel owners to update bookings for their hotels
CREATE POLICY "Hotel owners can update bookings for their hotels" 
ON public.bookings 
FOR UPDATE 
USING (EXISTS ( 
  SELECT 1 FROM hotels 
  WHERE hotels.id = bookings.hotel_id 
  AND hotels.owner_id = auth.uid() 
));