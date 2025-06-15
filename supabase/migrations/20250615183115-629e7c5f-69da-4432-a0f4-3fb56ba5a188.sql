
-- Create the bucket 'note-images', set public read access
insert into storage.buckets (id, name, public) values ('note-images', 'note-images', true);

-- Allow anyone to view (download) files in this bucket
create policy "Public read for note-images"
  on storage.objects
  for select
  using (bucket_id = 'note-images');

-- Allow authenticated users to upload (insert), update, delete images in this bucket
create policy "Authenticated upload for note-images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'note-images');

create policy "Authenticated update for note-images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'note-images');

create policy "Authenticated delete for note-images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'note-images');
