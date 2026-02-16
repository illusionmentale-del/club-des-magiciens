-- SEED DATA FOR PRODUCTS
-- ⚠️ REPLACE 'price_...' WITH YOUR ACTUAL STRIPE PRICE IDs FROM YOUR DASHBOARD

-- 1. SUBSCRIPTIONS
insert into public.products (space, type, title, description, price, stripe_price_id, metadata)
values 
('kids', 'subscription', 'Apprenti Magicien', 'Accès illimité à l''espace Kids. Grimoire, Vidéos, Badges.', 499, 'price_H5ggYJ...', '{"benefits": ["Grimoire secret", "Vidéos interactives"]}'),
('adults', 'subscription', 'Membre Initié', 'Accès au Club Adulte. Programme complet, Live, et Communauté.', 999, 'price_1P...', '{"benefits": ["Programme Le Club", "1 Contenu Fort/semaine"]}');

-- 2. SAMPLE PACKS (ADULTS)
insert into public.products (space, type, title, description, price, stripe_price_id, metadata)
values
('adults', 'pack', 'Pack Mentalisme Express', 'Apprenez 3 routines de mentalisme impromptues à faire partout.', 2900, 'price_pack_mentalisme', '{"duration": "45 min", "level": "Débutant"}'),
('adults', 'pack', 'La Psychologie du Mensonge', 'Masterclass sur la détection du mensonge et le détournement d''attention.', 4900, 'price_pack_psychologie', '{"duration": "1h30", "level": "Intermédiaire"}'),
('adults', 'course', 'Formation Hypnose Rapide', 'Formation complète pour induire des transe hypnotiques en moins de 3 minutes.', 19900, 'price_course_hypnose', '{"duration": "4h", "level": "Avancé"}');
