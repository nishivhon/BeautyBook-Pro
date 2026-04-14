-- Update all slots with consistent booking data using row numbers
WITH booking_data AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY id) AS row_num,
    (ARRAY['Maria Santos', 'Juan Del Cruz', 'Ana Garcia', 'Carlos Rodriguez', 'Rosa Torres', 'Miguel Gonzalez', 'Lisa Chen', 'James Smith', 'Rebecca Johnson', 'David Williams'])[((ROW_NUMBER() OVER (ORDER BY id) % 10) + 1)] AS customer_name,
    (ARRAY['09171234567', '09281234567', '09351234567', '09451234567', '09551234567', '09651234567', '09751234567', '09851234567', '09951234567', '09061234567'])[((ROW_NUMBER() OVER (ORDER BY id) % 10) + 1)] AS customer_contact,
    (ARRAY['Athlon', 'Charlie', 'Inishi', 'Karl', 'Abdulah'])[((ROW_NUMBER() OVER (ORDER BY id) % 5) + 1)] AS assigned_staff,
    to_jsonb((ARRAY['Haircut', 'Hair Color', 'Manicure', 'Pedicure', 'Facial', 'Massage', 'Waxing', 'Threading'])[(((ROW_NUMBER() OVER (ORDER BY id) % 8) + 1))]) AS services
  FROM available_slots
)
UPDATE available_slots
SET 
  customer_name = bd.customer_name,
  customer_contact = bd.customer_contact,
  assigned_staff = bd.assigned_staff,
  services = bd.services,
  status = 'pending'::slot_status,
  availability = false
FROM booking_data bd
WHERE available_slots.id = bd.id;ALTER

-- 
--
-- UNDO UPDATE available_slots
--
--

UPDATE available_slots
SET 
  availability = true,
  status = 'pending'::slot_status,
  customer_name = NULL,
  customer_contact = NULL,
  assigned_staff = NULL,
  services = NULL;