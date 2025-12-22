-- Enable realtime for bookings table so hotel owners see new bookings instantly
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- Set replica identity to full for complete row data in realtime updates
ALTER TABLE public.bookings REPLICA IDENTITY FULL;