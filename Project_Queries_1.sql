use master 
GO
 ALTER DATABASE Project_DB
 SET SINGLE_USER
 WITH ROLLBACK IMMEDIATE;
GO

-- ALTER DATABASE Project_DB
-- SET MULTI_USER;
--GO

drop database Project_DB;
go

create database Project_DB;
go
use Project_DB;
go


create table PersonnelRank (
	rankID int primary Key identity(1,1),
	[rank] varchar(20) check ([rank] in ('Team Lead', 'Frontend Developer', 'Backend Developer', 'Code Tester', 'DB Handler')),
	salary int check (salary >= 0)
);

create table PersonnelInfo (
	infoID int primary Key identity(1,1),
	fName varchar(50) NOT NULL,
	lName varchar(50) NOT NULL,
    	email varchar(100) UNIQUE NOT NULL,
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
(1, 6), -- Ali Raza
(2, 6), -- Sara Khan
(3, 6), -- Hamza Malik
(4, 5), -- Ayesha Ahmed
(5, 5); -- Usman Ali


-- Insert values into Employees
INSERT INTO Employees (ordersAccepted, ordersCancelled, ordersSubmittedLate, infoID) VALUES 
(1, 1, 1, 6),  -- Bilal Hassan (Frontend)
(1, 1, 2, 7),  -- Zainab Iqbal (Backend)
(2, 1, 1, 8),  -- Taha Rehman (Code Tester)
(2, 1, 1, 9),  -- Mehak Raza (DB Handler)
(2, 1, 1, 10); -- Hassan Shah (Frontend)

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

-- EMPLOYEE 1
INSERT INTO Orders (title, description, deadline, priority, status, admin_id)
VALUES 
('Task 1A', 'Completed task for Emp 1', '2025-05-30', 'High', 'Completed', 1),
('Task 1B', 'Cancelled task for Emp 1', '2025-05-31', 'Medium', 'Cancelled', 2),
('Task 1C', 'Pending task for Emp 1', '2025-06-01', 'Low', 'Pending', 3),
('Task 1D', 'In progress task for Emp 1', '2025-06-02', 'High', 'In Progress', 4);

-- EMPLOYEE 2
INSERT INTO Orders (title, description, deadline, priority, status, admin_id)
VALUES 
('Task 2A', 'Completed task for Emp 2', '2025-05-30', 'High', 'Completed', 5),
('Task 2B', 'Cancelled task for Emp 2', '2025-05-31', 'Medium', 'Cancelled', 1),
('Task 2C', 'Pending task for Emp 2', '2025-06-01', 'Low', 'Pending', 2),
('Task 2D', 'In progress task for Emp 2', '2025-06-02', 'High', 'In Progress', 3);

-- EMPLOYEE 3
INSERT INTO Orders (title, description, deadline, priority, status, admin_id)
VALUES 
('Task 3A', 'Completed task for Emp 3', '2025-05-30', 'High', 'Completed', 4),
('Task 3B', 'Cancelled task for Emp 3', '2025-05-31', 'Medium', 'Cancelled', 5),
('Task 3C', 'Pending task for Emp 3', '2025-06-01', 'Low', 'Pending', 1),
('Task 3D', 'In progress task for Emp 3', '2025-06-02', 'High', 'In Progress', 2);

-- EMPLOYEE 4
INSERT INTO Orders (title, description, deadline, priority, status, admin_id)
VALUES 
('Task 4A', 'Completed task for Emp 4', '2025-05-30', 'High', 'Completed', 3),
('Task 4B', 'Cancelled task for Emp 4', '2025-05-31', 'Medium', 'Cancelled', 4),
('Task 4C', 'Pending task for Emp 4', '2025-06-01', 'Low', 'Pending', 5),
('Task 4D', 'In progress task for Emp 4', '2025-06-02', 'High', 'In Progress', 1);

-- EMPLOYEE 5
INSERT INTO Orders (title, description, deadline, priority, status, admin_id)
VALUES 
('Task 5A', 'Completed task for Emp 5', '2025-05-30', 'High', 'Completed', 2),
('Task 5B', 'Cancelled task for Emp 5', '2025-05-31', 'Medium', 'Cancelled', 3),
('Task 5C', 'Pending task for Emp 5', '2025-06-01', 'Low', 'Pending', 4),
('Task 5D', 'In progress task for Emp 5', '2025-06-02', 'High', 'In Progress', 5);

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

-- Assign Orders to Employees
INSERT INTO Order_Assignments (order_id, employee_id)
VALUES 
(1, 1), (2, 1), (3, 1), (4, 1),
(5, 2), (6, 2), (7, 2), (8, 2),
(9, 3), (10, 3), (11, 3), (12, 3),
(13, 4), (14, 4), (15, 4), (16, 4),
(17, 5), (18, 5), (19, 5), (20, 5);


select * from PersonnelRank
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

		UPDATE Admins
        SET ordersAssigned = ordersAssigned + 1
        WHERE admin_id = @admin_id;

		update Employees
		set ordersAccepted = ordersAccepted + 1
		where employee_id = @employee_id

		return 1;
	end try
	begin catch
		print 'Error occurred while creating task.';
		return 0;
	end catch
end;
go
--exec new_task 'Test Task 1.1', 'Description 1.1', '2025-05-10', 'High', 'Pending', 1, 'Zainab.Iqbal@fast.edu.pk'

go --update the task 
CREATE PROCEDURE update_status
	@adminID INT,
    @new_status VARCHAR(20),
    @orderID INT
AS
BEGIN
    DECLARE @assigned_admin INT;
    DECLARE @employee_id INT;
    DECLARE @current_status VARCHAR(20);

    -- Check if the order exists and get admin
    SELECT @assigned_admin = admin_id, @current_status = [status]
    FROM Orders
    WHERE order_id = @orderID;

    IF @assigned_admin IS NULL
    BEGIN
        PRINT 'Order ID not found.';
        RETURN -1;
    END

    IF @assigned_admin <> @adminID
    BEGIN
        PRINT 'Access Denied: You can only update orders assigned by you.';
        RETURN 0;
    END

    -- Get employee assigned to this order
    SELECT @employee_id = employee_id
    FROM Order_Assignments
    WHERE order_id = @orderID;

    -- Update the status of the order
    UPDATE Orders
    SET [status] = @new_status
    WHERE order_id = @orderID;

    -- Update statistics based on new status
    IF @new_status = 'In Progress'
    BEGIN
        UPDATE Employees
        SET ordersAccepted = ordersAccepted + 1
        WHERE employee_id = @employee_id;
    END
    ELSE IF @new_status = 'Cancelled'
    BEGIN
        UPDATE Employees
        SET ordersCancelled = ordersCancelled + 1
        WHERE employee_id = @employee_id;
    END
    ELSE IF @new_status = 'Completed'
    BEGIN
        DECLARE @deadline DATE;
        SELECT @deadline = deadline FROM Orders WHERE order_id = @orderID;

        -- Compare with current date to check lateness
        IF GETDATE() > @deadline
        BEGIN
            UPDATE Employees
            SET ordersSubmittedLate = ordersSubmittedLate + 1
            WHERE employee_id = @employee_id;
        END
    END

    PRINT 'Order status and related stats updated successfully.';
    RETURN 1;
END
GO
--exec update_status 1, 'In Progress', 1
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
--exec update_priority 1, 'Low', 1

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

--exec status_search 'Pending' , 1

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

--exec employee_search 1 , 1



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

	-- incrementing cancelled order
	IF LOWER(@new_status) = 'cancelled'
	begin
	update Employees
	set ordersCancelled = ISNULL(ordersCancelled, 0) + 1
	where employee_id = @employeeId
	end

    update Orders
    set [status] = @new_status
    where order_id = @orderID;

    print 'Order status updated successfully';
	return 1;
end
--select * from Employees
--select * from Order_Assignments
--exec Emp_update_status 1, 'Cancelled', 1
--
--go -- in progress status
--create procedure Emp_status_search
--	@employeeId INT
--as
--begin
--	
--
--	select O.*
--	from Orders O
--	join Order_Assignments os on os.order_id = O.order_id
--	where O.[status] = 'In progress' AND os.employee_id = @employeeId
--
--end
--
----exec Emp_status_search @eID = 1
--
--go
---- pending status
--create procedure Emp_Pstatus_search
--	@employeeId INT
--as
--begin
--	
--
--	select O.*
--	from Orders O
--	join Order_Assignments os on os.order_id = O.order_id
--	where O.[status] = 'Pending' AND os.employee_id = @employeeId
--
--end
--
--
--go--accepting or declining functionality
--create procedure acp_dec_status
--	@employeeID int,
--    @orderID int,
--
--	@claim varchar(20)
--AS
--begin
--
--	declare @assigned_emp int;
--
--	select @assigned_emp = employee_id FROM Order_Assignments WHERE order_id = @orderID;
--	if @assigned_emp is null
--	begin
--	print 'Order id is not found'
--	return -1;
--	end
--
--	 if @assigned_emp <> @employeeID
--	 begin
--	 print 'Access Denied: You can only update orders assigned to you.';
--	 return -2;
--	 end
--
--	 IF LOWER(@claim) not in ('accept', 'decline')
--	 begin
--	 print 'Invalid claim value. It should be Accept or Decline.';
--	 return -3;
--	 end
--
--	 IF LOWER(@claim) = 'accept'
--	 begin
--	 update Orders
--     set [status] = 'In Progress'
--     where order_id = @orderID;
--	 UPDATE Employees
--     SET ordersAccepted = ISNULL(ordersAccepted, 0) + 1
--     WHERE employee_id = @employeeID;
--
--	 return 1;
--	 end
--	 IF LOWER(@claim) = 'decline'
--	 begin
--	 update Orders
--     set [status] = 'Pending'
--     where order_id = @orderID;
--	 
--	 DECLARE @order_status VARCHAR(50);
--
--	 SELECT @order_status = [status] 
--     FROM Orders 
--     WHERE order_id = @orderID;
--
--	 IF LOWER(@order_status) = 'in progress'
--     BEGIN
--            UPDATE Employees
--            SET 
--                ordersAccepted = CASE 
--                                    WHEN ISNULL(ordersAccepted, 0) > 0 
--                                    THEN ordersAccepted - 1 
--                                    ELSE 0 
--                                 END,
--                ordersCancelled = ISNULL(ordersCancelled, 0) + 1
--            WHERE employee_id = @employeeID;
--		END
--        ELSE
--        BEGIN
--            UPDATE Employees
--            SET ordersCancelled = ISNULL(ordersCancelled, 0) + 1
--            WHERE employee_id = @employeeID;
--        END
--	 return 1;
--	 end
--
--    print 'Decision updated successfully';
--end

--drop procedure acp_dec_status
--exec acp_dec_status 2,29,'accept'

--select * from Employees

GO
CREATE PROCEDURE CheckUserRole
    @email VARCHAR(100),
    @userId INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @infoID INT;

    -- Get the infoID based on the email provided
    SELECT @infoID = infoID
    FROM PersonnelInfo
    WHERE email = @email;

    -- Check if email is valid
    IF @infoID IS NULL
    BEGIN
        RETURN NULL;  -- Invalid user
    END

    -- If userId matches the infoID, check for role
    IF @infoID = @userId
    BEGIN
        IF EXISTS (SELECT 1 FROM Admins WHERE infoID = @infoID)
        BEGIN
            RETURN 1;  -- Admin
        END

        IF EXISTS (SELECT 1 FROM Employees WHERE infoID = @infoID)
        BEGIN
            RETURN 0;  -- Employee
        END
    END
    -- If no match found for userId and email, return NULL
    RETURN NULL;  -- Invalid user
END;

go

CREATE PROCEDURE GetUserDetails
    @userId INT, 
    @userRole INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Declare a variable to store the infoID
    DECLARE @infoID INT;

    -- Ensure the user role is valid
    IF @userRole NOT IN (0, 1)
    BEGIN
        PRINT 'Invalid user role';
        RETURN -2;  -- Return error code if userRole is invalid
    END

    -- If the userRole is 1 (Admin), get the corresponding infoID from the Admins table
    IF @userRole = 1
    BEGIN
        SELECT @infoID = infoID
        FROM Admins
        WHERE admin_id = @userId;

        -- If the infoID is found, return the admin and associated personnel info
        IF @infoID IS NOT NULL
        BEGIN
            SELECT 
                p.fName,
                p.lName,
                p.email,
                p.contactNo,
                p.gender,
                p.dofBirth,
                r.rank AS PersonnelRank,
                a.ordersAssigned
            FROM PersonnelInfo p
            JOIN PersonnelRank r ON p.rankID = r.rankID
            JOIN Admins a ON p.infoID = a.infoID
            WHERE p.infoID = @infoID;
        END
        ELSE
        BEGIN
            PRINT 'Admin not found';
            RETURN -1;  -- Return error code if admin is not found
        END
    END
    -- If the userRole is 0 (Employee), get the corresponding infoID from the Employees table
    ELSE IF @userRole = 0
    BEGIN
        SELECT @infoID = infoID
        FROM Employees
        WHERE employee_id = @userId;

        -- If the infoID is found, return the employee and associated personnel info
        IF @infoID IS NOT NULL
        BEGIN
            SELECT 
                p.fName,
                p.lName,
                p.email,
                p.contactNo,
                p.gender,
                p.dofBirth,
                r.rank AS PersonnelRank,
                e.ordersAccepted,
                e.ordersCancelled,
                e.ordersSubmittedLate
            FROM PersonnelInfo p
            JOIN PersonnelRank r ON p.rankID = r.rankID
            JOIN Employees e ON p.infoID = e.infoID
            WHERE p.infoID = @infoID;
        END
        ELSE
        BEGIN
            PRINT 'Employee not found';
            RETURN -1;  -- Return error code if employee is not found
        END
    END
    ELSE
    BEGIN
        PRINT 'Invalid user role';
        RETURN -2;  -- Return error code if userRole is invalid
    END
END;

GO
GO
CREATE PROCEDURE getAdminInfo
    @admin_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @infoID INT;

    SELECT @infoID = infoID
    FROM Admins
    WHERE admin_id = @admin_id;

    IF @infoID IS NULL
    BEGIN
        PRINT 'Admin not found.';
        RETURN -1;
    END

    SELECT 
        CONCAT(fName, ' ', lName) AS FullName,
        email
    FROM PersonnelInfo
    WHERE infoID = @infoID;
END;
go
--DROP PROCEDURE IF EXISTS getNonAdminEmployees;
--GO

CREATE PROCEDURE getNonAdminEmployees
AS
BEGIN
    SET NOCOUNT ON;

    SELECT E.employee_id, P.email 
    FROM Employees E
    JOIN PersonnelInfo P ON E.infoID = P.infoID;
END;
GO


--Exec getNonAdminEmployees
--EXEC sp_helptext 'getNonAdminEmployees';

GO
CREATE PROCEDURE DeleteOrderAndUpdateStats
    @order_id INT,
    @admin_id INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Step 1: Decrement ordersAssigned for the given admin_id
        UPDATE Admins
        SET ordersAssigned = ordersAssigned - 1
        WHERE admin_id = @admin_id AND ordersAssigned > 0;

        -- Step 2: Check if the order is 'In Progress'
        DECLARE @order_status VARCHAR(20);
        SELECT @order_status = [status]
        FROM Orders
        WHERE order_id = @order_id;

        -- Step 2.1: If 'In Progress', decrement the employee's ordersAccepted
        IF @order_status = 'In Progress'
        BEGIN
            DECLARE @employee_id INT;

            SELECT @employee_id = employee_id
            FROM Order_Assignments
            WHERE order_id = @order_id;

            IF @employee_id IS NOT NULL
            BEGIN
                UPDATE Employees
                SET ordersAccepted = ordersAccepted - 1
                WHERE employee_id = @employee_id AND ordersAccepted > 0;
            END
        END

        -- Step 3: Delete the order (Order_Assignments will be deleted due to ON DELETE CASCADE)
        DELETE FROM Orders
        WHERE order_id = @order_id;

        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH
END;

GO
--EXEC DeleteOrderAndUpdateStats @order_id = 30, @admin_id = 1;



-- TRIGGER : Prevent deletion of PersonnelInfo

GO
CREATE TRIGGER trg_prevent_personnelinfo_delete
ON PersonnelInfo
INSTEAD OF DELETE
AS
BEGIN
    RAISERROR ('Cannot delete personnel info: it is referenced in other tables.', 16, 1);
END;

-- TRIGGER : Enforce minimum age of 18 years
go
CREATE TRIGGER trg_enforce_min_age
ON PersonnelInfo
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS 
	(
        SELECT 1 FROM inserted
        WHERE DATEDIFF(YEAR, dofBirth, GETDATE()) < 18
    )
    BEGIN
        RAISERROR ('Personnel must be at least 18 years old.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;

