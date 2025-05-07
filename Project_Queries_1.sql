USE master;
GO

ALTER DATABASE Project_DB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO

DROP DATABASE Project_DB;
GO


create database Project_DB;
go
use Project_DB;
go

CREATE TABLE RankSalary (
    [rank] VARCHAR(20) PRIMARY KEY,
    salary INT CHECK (salary >= 0)
);

CREATE TABLE Personnel (
    rankID INT PRIMARY KEY IDENTITY(1,1),
    [rank] VARCHAR(20),

	FOREIGN KEY ([rank]) REFERENCES RankSalary([rank])
);

create table PersonnelInfo (
	infoID int primary Key identity(1,1),
	fName varchar(50) NOT NULL,
	lName varchar(50) NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
	password_hash VARCHAR(255) NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	contactNo varchar(15) NOT NULL,
	gender char(1) NOT NULL, check(gender IN ('M', 'F')),
	dofBirth DATE,
	rankID int foreign Key references Personnel(rankID)
);

CREATE TABLE Admins (
    admin_id int primary Key identity(1,1),
	ordersAssigned int check (ordersAssigned >= 0),
    infoID int UNIQUE,
	FOREIGN KEY (infoID) REFERENCES PersonnelInfo(infoID)
);


CREATE TABLE Employees (
    employee_id int primary Key identity(1,1),
	ordersAccepted int check (ordersAccepted >= 0),
	ordersCancelled int check (ordersCancelled >= 0),
	ordersSubmittedLate int check (ordersSubmittedLate >= 0),
    infoID int UNIQUE,
	FOREIGN KEY (infoID) REFERENCES PersonnelInfo(infoID)
);


CREATE TABLE Orders (
    order_id int primary Key identity(1,1),
    title varchar(255) NOT NULL,
    [description] TEXT,
    [status] varchar(20) check ([status] in ('Pending', 'In Progress', 'Completed', 'Cancelled')) default 'Pending',
    [priority] varchar(20) check ([priority] in ('Low', 'Medium', 'High')) default 'Medium',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deadline date,
    admin_id int foreign key references Admins(admin_id) on delete set null
);


CREATE TABLE Order_Assignments (
    assignment_id int primary Key identity(1,1),
    order_id int,
    employee_id int,
    assigned_at DATETIME not null DEFAULT CURRENT_TIMESTAMP,
	completed_at DATETIME not null DEFAULT CURRENT_TIMESTAMP

	UNIQUE (order_id, employee_id),
    foreign key (order_id) references Orders(order_id) on delete cascade,
    foreign key (employee_id) references Employees(employee_id) on delete cascade
);
alter table order_assignments 
alter column completed_at DATETIME null 

--Insert into RankSalary
INSERT INTO RankSalary ([rank], salary) VALUES
('Team Lead', 150000),
('Frontend Developer', 100000),
('Backend Developer', 110000),
('Code Tester', 95000),
('DB Handler', 105000);

--Insert into Personnel
INSERT INTO Personnel ([rank]) VALUES
('Team Lead'),
('Frontend Developer'),
('Backend Developer'),
('Code Tester'),
('DB Handler');

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

select * from Personnel
select * from RankSalary
select * from PersonnelInfo
select * from Admins
select * from Employees
select * from Orders
select * from Order_Assignments

select * from Admins join PersonnelInfo on Admins.infoID = PersonnelInfo.infoID
select * from Employees 
join PersonnelInfo on Employees.infoID = PersonnelInfo.infoID 
join Order_Assignments on Employees.employee_id = Order_Assignments.employee_id
join Orders on Order_Assignments.order_id = Orders.order_id
--group by Orders.order_id
order by Employees.employee_id


go -- login

create procedure login
    @email VARCHAR(100),
    @password VARCHAR(255)
AS
BEGIN
	declare @userID INT;
	declare @roleID INT;
    select @userID = infoID from PersonnelInfo
    where email = @email AND password_hash = @password;

    if @userID IS NULL
    begin
        SET @roleID = -1;
		select @roleID as RoleID;
        RETURN;
    end 

    select @roleID = admin_id FROM Admins WHERE infoID = @userID;
    if @roleID IS NOT NULL
    begin
        select @roleID as RoleID;
        RETURN;
    end

    select @roleID = employee_id FROM Employees WHERE infoID = @userID;
    if @roleID IS NOT NULL
    begin
        select @roleID as RoleID;
        RETURN;
    end

end
GO


go --TASK CREATION

create procedure new_task
    @title VARCHAR(255),
    @description TEXT,
    @deadline DATE,
    @priority VARCHAR(20),
    @status VARCHAR(20) = 'Pending',
    @admin_id INT,
    @employee_email VARCHAR(100)
as

begin
    declare @employee_id INT; -- finding employee id by email
    
    select @employee_id = E.employee_id
    from Employees E
    join PersonnelInfo P ON E.infoID = P.infoID
    where P.email = @employee_email;
   
   
    if @employee_id IS NULL  -- If employee does not exist
    begin
        return -1;
    end
    
	begin try
		declare @order_id INT;
		insert into Orders (title, [description], [status], [priority], created_at, deadline, admin_id)
		values (@title, @description, @status, @priority, DEFAULT, @deadline, @admin_id);
		
		set @order_id = SCOPE_IDENTITY();
		
		insert into Order_Assignments (order_id, employee_id, assigned_at, completed_at)
		values (@order_id, @employee_id, DEFAULT, NULL);
		return 1;
	end try
	begin catch
		print 'Error occurred while creating task.';
		return 0;
	end catch
end;
go

exec new_task 'Test Task 1.0', 'Description 1.0', '2025-05-10', 'High', 'Pending', 4, 'bilal.hassan@fast.edu.pk'

go --update the task 
create procedure update_status
	@adminID int,
    @new_status varchar(20),
    @orderID int
AS
begin

	declare @assigned_admin int;

	select @assigned_admin = admin_id FROM Orders WHERE order_id = @orderID;
	if @assigned_admin is null
	begin
	print 'Order id is not found'
	return -1;
	end

	 if @assigned_admin <> @adminID
	 begin
	 print 'Access Denied: You can only update orders assigned by you.';
	 return 0;
	 end


    update Orders
    set [status] = @new_status
    where order_id = @orderID;

    print 'Order status updated successfully';
	return 1;
end

go

create procedure update_priority
	@adminID int,
	@new_priority varchar(20),
	@order_id int
as
begin
	
	declare @assigned_admin int;

	select @assigned_admin = admin_id FROM Orders WHERE order_id = @order_id;
	if @assigned_admin is null
	begin
	print 'Order id is not found'
	return -1;
	end

	 if @new_priority not in ('Low', 'Medium', 'High')
	 begin
	 print 'Invalid priority value. It should be Low, Medium or High.';
	 return -2;
	end

	 if @assigned_admin <> @adminID
	 begin
	 print 'Access Denied: You can only update priority of orders assigned by you.';
	 return 9;
	 end

    update Orders
    set [priority] = @new_priority
    where order_id = @order_id;

    print 'Order priority updated successfully';
	return 1;
end;
exec update_priority 1, 'Low', 1

go

-- retrieving tasks based on status , deadline , assigned members

create procedure status_search
	@Sstatus varchar(20),
	@adminID INT
as
begin
	IF @@NESTLEVEL > 1
    RETURN;
	select *
	from Orders
	where [status] = @Sstatus
end

exec status_search 'Pending' , 1

go

create procedure date_search
	@Ddate date,
	@adminID int
as
begin
	select *
	from Orders
	where [deadline] = @Ddate

end;

--exec date_search '2025-04-10' , 5

go
--searching by admin based on assigned members
create procedure employee_search
	@employee_ID INT,
	@adminID INT
AS
begin 
	select O.*
	from Orders O
	join Order_Assignments os on  os.order_id = o.order_id
	where os.employee_id = @employee_ID
end

exec employee_search 1 , 1



-- above were admin functionalities
-- below are employees functionalities

GO

-- employee updated status of task
create procedure Emp_update_status
	@employeeId int,
    @new_status varchar(20),
    @orderID int
AS
begin

	declare @assigned_emp int;

	select @assigned_emp = employee_id FROM Order_Assignments WHERE order_id = @orderID;
	if @assigned_emp is null
	begin
	print 'Order id is not found'
	return -1;
	end

	if @new_status not in ('Pending', 'In Progress', 'Completed', 'Cancelled')
	begin
	print 'Invalid status value. It should be In Pending, Progress, Completed or Cancelled.';
	return -2;
	end

	if @assigned_emp <> @employeeId
	begin
	print 'Access Denied: You can only update orders assigned to you.';
 	return 0;
	end


    update Orders
    set [status] = @new_status
    where order_id = @orderID;

    print 'Order status updated successfully';
	return 1;
end

exec Emp_update_status 2, 'Completed', 1

go -- in progress status
create procedure Emp_status_search
	@employeeId INT
as
begin
	

	select O.*
	from Orders O
	join Order_Assignments os on os.order_id = O.order_id
	where O.[status] = 'In progress' AND os.employee_id = @employeeId

end

exec Emp_status_search @eID = 1

go
-- pending status
create procedure Emp_Pstatus_search
	@employeeId INT
as
begin
	

	select O.*
	from Orders O
	join Order_Assignments os on os.order_id = O.order_id
	where O.[status] = 'Pending' AND os.employee_id = @employeeId

end


go--accepting or declining functionality
create procedure acp_dec_status
	@employeeID int,
    @orderID int,

	@claim varchar(20)
AS
begin

	declare @assigned_emp int;

	select @assigned_emp = employee_id FROM Order_Assignments WHERE order_id = @orderID;
	if @assigned_emp is null
	begin
	print 'Order id is not found'
	return -1;
	end

	 if @assigned_emp <> @employeeID
	 begin
	 print 'Access Denied: You can only update orders assigned to you.';
	 return -2;
	 end

	 IF LOWER(@claim) not in ('accept', 'decline')
	 begin
	 print 'Invalid claim value. It should be Accept or Decline.';
	 return -3;
	 end

	 IF LOWER(@claim) = 'accept'
	 begin
	 update Orders
     set [status] = 'In Progress'
     where order_id = @orderID;
	 return 1;
	 end
	 IF LOWER(@claim) = 'decline'
	 begin
	 update Orders
     set [status] = 'Pending'
     where order_id = @orderID;
	 return 1;
	 end

    print 'Decision updated successfully';
end


CREATE PROCEDURE CheckUserRole
    @userId INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Admins WHERE infoID = @userId)
    BEGIN
        RETURN 1;
    END

    IF EXISTS (SELECT 1 FROM Employees WHERE infoID = @userId)
    BEGIN
        RETURN 0;
    END

    RETURN -1;
END
