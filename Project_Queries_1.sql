create database Project_DB;
use Project_DB;

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
	created_at timestamp,
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
    [name] varchar(100) NOT NULL,
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
    created_at timestamp,
    deadline date,
    admin_id int foreign key references Admins(admin_id) on delete set null,
);


CREATE TABLE Order_Assignments (
    assignment_id int primary Key identity(1,1),
    order_id int,
    employee_id int,
    assigned_at datetime not null,
    completed_at timestamp not null,
    foreign key (order_id) references Orders(order_id) on delete cascade,
    foreign key (employee_id) references Employees(employee_id) on delete cascade
);