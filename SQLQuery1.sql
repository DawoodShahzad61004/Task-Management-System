create table PersonnelRank (
	rankID int primary Key identity(1,1),
	[rank] varchar(20) check ([rank] in ('Team Lead', 'Frontend Developer', 'Backend Developer', 'Code Tester', 'DB Handler')),
	salary int check (salary >= 0)
);

create table PersonnelInfo (
	infoID int primary Key identity(1,1),
	fName varchar(50) NOT NULL,
	lName varchar(50) NOT NULL,
    email varchar(100) NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	contactNo varchar(15) NOT NULL,
	gender char(1) NOT NULL, check(gender IN ('M', 'F')),
	dofBirth DATE,
	--CONSTRAINT id_uniqueness UNIQUE (email, password_hash)
	rankID int foreign Key references PersonnelRank(rankID)
);

CREATE TABLE Admins (
    admin_id int primary Key identity(1,1),
    infoID int foreign key references PersonnelInfo(infoID),
	ordersAssigned int check (ordersAssigned >= 0)
);


CREATE TABLE Employees (
    employee_id int primary Key identity(1,1),
    --[name] varchar(100) NOT NULL,
	ordersAccepted int check (ordersAccepted >= 0),
	ordersCancelled int check (ordersCancelled >= 0),
	ordersSubmittedLate int check (ordersSubmittedLate >= 0),
    infoID int foreign key references PersonnelInfo(infoID),
);


CREATE TABLE Orders (
    order_id int primary Key identity(1,1),
    title varchar(255) NOT NULL,
    [description] TEXT,
    [status] varchar(20) check ([status] in ('Pending', 'In Progress', 'Completed', 'Cancelled')) default 'Pending',
    [priority] varchar(20) check ([priority] in ('Low', 'Medium', 'High')) default 'Medium',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deadline date,
    admin_id int foreign key references Admins(admin_id) on delete set null,
);


CREATE TABLE Order_Assignments (
    assignment_id int primary Key identity(1,1),
    order_id int,
    employee_id int,
    assigned_at DATETIME not null DEFAULT CURRENT_TIMESTAMP,
	completed_at DATETIME not null DEFAULT CURRENT_TIMESTAMP


    foreign key (order_id) references Orders(order_id) on delete cascade,
    foreign key (employee_id) references Employees(employee_id) on delete cascade
);
alter table order_assignments 
alter column completed_at DATETIME null 
-- Insert values into PersonnelRank
INSERT INTO PersonnelRank ([rank], salary) VALUES 
('Team Lead', 150000),
('Frontend Developer', 100000),
('Backend Developer', 110000),
('Code Tester', 95000),
('DB Handler', 105000);

-- Insert values into PersonnelInfo (Admins & Employees)
INSERT INTO PersonnelInfo (fName, lName, email, password_hash, created_at, contactNo, gender, dofBirth, rankID) VALUES 
('Ali', 'Raza', 'ali.raza@fast.edu.pk', 'hashed_pw1', DEFAULT, '03211234567', 'M', '1995-08-10', 1), -- Admin 1 (Team Lead)
('Sara', 'Khan', 'sara.khan@fast.edu.pk', 'hashed_pw2', DEFAULT, '03021234567', 'F', '1998-06-15', 1), -- Admin 2 (Team Lead)
('Hamza', 'Malik', 'hamza.malik@fast.edu.pk', 'hashed_pw3', DEFAULT, '03131234567', 'M', '1997-02-20', 1), -- Admin 3 (Team Lead)
('Ayesha', 'Ahmed', 'ayesha.ahmed@fast.edu.pk', 'hashed_pw4', DEFAULT, '03451234567', 'F', '1999-05-25', 1), -- Admin 4 (Team Lead)
('Usman', 'Ali', 'usman.ali@fast.edu.pk', 'hashed_pw5', DEFAULT, '03351234567', 'M', '1996-12-30', 1); -- Admin 5 (Team Lead)

-- Employees (Developers, Testers, DB Handlers)
INSERT INTO PersonnelInfo (fName, lName, email, password_hash, created_at, contactNo, gender, dofBirth, rankID) VALUES 
('Bilal', 'Hassan', 'bilal.hassan@fast.edu.pk', 'hashed_pw6', DEFAULT, '03151234567', 'M', '1998-07-22', 2), -- Employee (Frontend)
('Zainab', 'Iqbal', 'zainab.iqbal@fast.edu.pk', 'hashed_pw7', DEFAULT, '03231234567', 'F', '1999-01-18', 3), -- Employee (Backend)
('Taha', 'Rehman', 'taha.rehman@fast.edu.pk', 'hashed_pw8', DEFAULT, '03081234567', 'M', '1997-11-03', 4), -- Employee (Tester)
('Mehak', 'Raza', 'mehak.raza@fast.edu.pk', 'hashed_pw9', DEFAULT, '03421234567', 'F', '1996-09-27', 5), -- Employee (DB Handler)
('Hassan', 'Shah', 'hassan.shah@fast.edu.pk', 'hashed_pw10', DEFAULT, '03321234567', 'M', '1995-06-10', 2); -- Employee (Frontend)

-- Insert values into Admins (5 Admins)
INSERT INTO Admins (infoID, ordersAssigned) VALUES 
(1, 3), -- Ali Raza
(2, 2), -- Sara Khan
(3, 4), -- Hamza Malik
(4, 2), -- Ayesha Ahmed
(5, 3); -- Usman Ali

-- Insert values into Employees
INSERT INTO Employees (ordersAccepted, ordersCancelled, ordersSubmittedLate, infoID) VALUES 
(3, 1, 1, 6),  -- Bilal Hassan (Frontend)
(4, 0, 2, 7),  -- Zainab Iqbal (Backend)
(2, 2, 1, 8),  -- Taha Rehman (Code Tester)
(5, 1, 0, 9),  -- Mehak Raza (DB Handler)
(3, 0, 1, 10); -- Hassan Shah (Frontend)

-- Insert values into Orders (Tasks assigned by different admins)
INSERT INTO Orders (title, [description], [status], [priority], created_at, deadline, admin_id) VALUES 
('Homepage UI', 'Design homepage UI with responsiveness.', 'In Progress', 'High', DEFAULT, '2025-04-10', 1), -- Ali Raza assigned
('API Development', 'Create API for user authentication.', 'Pending', 'Medium', DEFAULT, '2025-04-15', 2), -- Sara Khan assigned
('Database Design', 'Setup schema for project.', 'Completed', 'High', DEFAULT, '2025-04-01', 3), -- Hamza Malik assigned
('Testing Module', 'Find and fix bugs in the code.', 'In Progress', 'Medium', DEFAULT, '2025-04-12', 4), -- Ayesha Ahmed assigned
('Query Optimization', 'Optimize database queries.', 'Pending', 'Low', DEFAULT, '2025-04-20', 5), -- Usman Ali assigned
('Dashboard UI', 'Create an interactive dashboard.', 'Pending', 'High', DEFAULT, '2025-04-18', 1), -- Ali Raza assigned
('Backend Logic', 'Implement business logic.', 'Completed', 'High', DEFAULT, '2025-04-05', 2), -- Sara Khan assigned
('Security Testing', 'Perform penetration testing.', 'In Progress', 'Medium', DEFAULT, '2025-04-25', 3); -- Hamza Malik assigned

-- Insert values into Order_Assignments (Tasks assigned to employees)
INSERT INTO Order_Assignments (order_id, employee_id, assigned_at, completed_at) VALUES 
(1, 1, DEFAULT, NULL), -- Bilal (Frontend) working on Homepage UI
(2, 2, DEFAULT, NULL), -- Zainab (Backend) working on API
(3, 4, DEFAULT, DEFAULT), -- Mehak (DB Handler) completed database design
(4, 3, DEFAULT, NULL), -- Taha (Code Tester) testing module
(5, 4, DEFAULT, NULL), -- Mehak (DB Handler) optimizing queries
(6, 1, DEFAULT, NULL), -- Bilal (Frontend) working on Dashboard UI
(7, 2, DEFAULT, DEFAULT), -- Zainab (Backend) completed Backend Logic
(8, 3, DEFAULT, NULL); -- Taha (Code Tester) performing Security Testing

select * from PersonnelRank
select * from PersonnelInfo
select * from Admins
select * from Employees
select * from Orders
select * from Order_Assignments


