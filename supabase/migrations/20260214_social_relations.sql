-- Add Foreign Key to profiles for easier joins
ALTER TABLE public.course_comments
    ADD CONSTRAINT fk_course_comments_profiles
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;

-- Also for Likes if needed for avatar display later
ALTER TABLE public.course_likes
    ADD CONSTRAINT fk_course_likes_profiles
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;
