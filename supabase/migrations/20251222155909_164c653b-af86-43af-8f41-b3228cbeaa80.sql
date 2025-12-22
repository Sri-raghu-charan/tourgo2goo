-- Allow hotel owners to view guest profiles for their bookings
CREATE POLICY "Hotel owners can view guest profiles for their bookings" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM bookings b
    JOIN hotels h ON b.hotel_id = h.id
    WHERE b.user_id = profiles.user_id
    AND h.owner_id = auth.uid()
  )
);