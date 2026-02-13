-- Create a public bucket for assets if it doesn't exist
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('assets', 'assets', true, 5242880, '{image/*}')
on conflict (id) do nothing;

-- Policy to allow public read access
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'assets' );

-- Policy to allow authenticated users (admin) to upload
create policy "Admin Upload"
on storage.objects for insert
with check ( bucket_id = 'assets' AND auth.role() = 'authenticated' );

-- Policy to allow admin to update/delete
create policy "Admin Update"
on storage.objects for update
using ( bucket_id = 'assets' AND auth.role() = 'authenticated' );

create policy "Admin Delete"
on storage.objects for delete
using ( bucket_id = 'assets' AND auth.role() = 'authenticated' );
