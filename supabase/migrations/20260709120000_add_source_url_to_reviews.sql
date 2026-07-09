-- Add source_url column to reviews table if it doesn't exist
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS source_url text;

-- Add comment for documentation
COMMENT ON COLUMN public.reviews.source_url IS 'URL reference to the review source (e.g., Goodreads link)';
