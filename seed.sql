INSERT INTO users (name, email, password, role) VALUES
  ('Admin User', 'admin@example.com', 'admin123', 'admin'),
  ('Manager User', 'manager@example.com', 'manager123', 'manager'),
  ('Employee User', 'employee@example.com', 'employee123', 'employee');

INSERT INTO requests (title, description, status, userId) VALUES
  ('Laptop Access Request', 'Requesting access to a company laptop for onboarding tasks.', 'pending', 3),
  ('Expense Reimbursement', 'Submitted travel expense documents for manager review.', 'in_review', 3),
  ('Policy Approval', 'Requesting approval for updated remote work policy document.', 'approved', 2);
