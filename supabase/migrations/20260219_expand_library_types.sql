-- Add 'tips' and 'illusion' to library_item_type enum
ALTER TYPE library_item_type ADD VALUE IF NOT EXISTS 'tips';
ALTER TYPE library_item_type ADD VALUE IF NOT EXISTS 'illusion';
