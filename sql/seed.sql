INSERT INTO "Challenge" (id, title, description, points, badge, status, "createdAt", "updatedAt")
VALUES
  ('seed-bike-5-days', 'Use bicycle 5 days', 'Replace short motorized trips with cycling for a workweek.', 220, 'Cycling Champion', 'active', NOW(), NOW()),
  ('seed-recycle-20-items', 'Recycle 20 items', 'Track and log household recyclables across the week.', 180, 'Recycling Ranger', 'active', NOW(), NOW()),
  ('seed-save-50-kwh', 'Save 50 kWh electricity', 'Reduce consumption through mindful usage and efficient devices.', 260, 'Energy Saver', 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
