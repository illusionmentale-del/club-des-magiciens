-- Add 'game' and 'pdf' to library_item_type enum
ALTER TYPE library_item_type ADD VALUE IF NOT EXISTS 'game';
ALTER TYPE library_item_type ADD VALUE IF NOT EXISTS 'pdf';
