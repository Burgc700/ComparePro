--Drop Database if it exists
-- Force disconnect all users and drop
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'ComparePro')
BEGIN
    ALTER DATABASE ComparePro SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE ComparePro;
END
GO

--Create Database
CREATE DATABASE ComparePro
GO;

USE ComparePro
GO;

--Creates schemas
IF SCHEMA_ID(N'Products') IS NULL   
    EXEC(N'CREATE SCHEMA Products;');

IF SCHEMA_ID(N'Users') IS NULL  
    EXEC(N'CREATE SCHEMA Users;');

--Create tables
CREATE TABLE Products.Products(
	Product_id INT IDENTITY(1,1) PRIMARY KEY,
	Product_name NVARCHAR(400) NOT NULL,
	Brand NVARCHAR(50) NOT NULL,
	Model_Number NVARCHAR(50),
	Product_Category NVARCHAR(50) NOT NULL,
	Image_URL NVARCHAR(1000),
	Features NVARCHAR(MAX),
	Created_On DATETIME DEFAULT(SYSDATETIMEOFFSET()),
	Updated_On DATETIME DEFAULT(SYSDATETIMEOFFSET())
);

CREATE TABLE Products.Price(
	Price_id INT IDENTITY(1,1) PRIMARY KEY,
	Product_id INT NOT NULL,
	Store NVARCHAR(20) NOT NULL,
	Price DECIMAL(6, 2) NOT NULL,
	Rating DECIMAL(2, 1) NOT NULL,
	[URL] NVARCHAR(1000),
	Scrapped_At DATETIME DEFAULT(SYSDATETIMEOFFSET()),

	CONSTRAINT FK1_Product_id FOREIGN KEY(Product_id)
		REFERENCES Products.Products(Product_id)
);

CREATE TABLE Users.User_Comments(
    Comment_id INT IDENTITY(1,1) PRIMARY KEY,
    Product_id INT NOT NULL,
    User_id NVARCHAR(100) NOT NULL,
    [Text] NVARCHAR(MAX) NOT NULL,
    Created_at DATETIME DEFAULT(SYSDATETIME()),

    CONSTRAINT FK2_Product_id FOREIGN KEY(Product_id)
        REFERENCES Products.Products(Product_id)
);

CREATE TABLE Users.Recommendations(
    View_id INT IDENTITY(1,1) PRIMARY KEY,
    Product_id INT NOT NULL,
    User_id NVARCHAR(100) NOT NULL,
    Viewed_at DATETIME DEFAULT(GETDATE()),

    CONSTRAINT FK3_Product_id FOREIGN KEY(Product_id)
        REFERENCES Products.Products(Product_id)
);

CREATE TABLE Users.Likes(
    Like_id INT IDENTITY(1,1) PRIMARY KEY,
    Product_id INT NOT NULL,
    User_id NVARCHAR(100) NOT NULL,
    Created_at DATETIME DEFAULT(GETDATE()),

    CONSTRAINT FK4_Product_id FOREIGN KEY(Product_id)
        REFERENCES Products.Products(Product_id),

    CONSTRAINT UQ_User_Product UNIQUE(User_id, Product_id)
);

--indexs (possibly later)

--Insert data
INSERT INTO Products.Products (Product_name, Brand, Model_Number, Product_Category, Image_URL, Features)
VALUES
	-- CPU mock data
	('AMD Ryzen 9 7950X', 'AMD', '100-100000514WOF', 'CPU', 'https://m.media-amazon.com/images/I/61R3PqyVuCL._AC_SL1500_.jpg', '16 Cores, 32 Threads, 5.7 GHz Max Boost, AM5 Socket'),
    ('Intel Core i9-14900K', 'Intel', 'BX8071514900K', 'CPU', 'https://m.media-amazon.com/images/I/51ctDR0L+xL._AC_SL1200_.jpg', '24 Cores (8P+16E), 32 Threads, 6.0 GHz Max Boost, LGA1700'),
    ('AMD Ryzen 7 7800X3D', 'AMD', '100-100000910WOF', 'CPU', 'https://m.media-amazon.com/images/I/61izEb1FDyL._AC_SL1500_.jpg', '8 Cores, 16 Threads, 5.0 GHz, 3D V-Cache, AM5 Socket'),
    ('Intel Core i7-14700K', 'Intel', 'BX8071514700K', 'CPU', 'https://m.media-amazon.com/images/I/51nBjY3dOPL._AC_SL1200_.jpg', '20 Cores (8P+12E), 28 Threads, 5.6 GHz Max Boost, LGA1700'),
    ('AMD Ryzen 5 7600X', 'AMD', '100-100000593WOF', 'CPU', 'https://m.media-amazon.com/images/I/61vGQNUEsqL._AC_SL1500_.jpg', '6 Cores, 12 Threads, 5.3 GHz Max Boost, AM5 Socket'),
    ('Intel Core i5-14600K', 'Intel', 'BX8071514600K', 'CPU', 'https://m.media-amazon.com/images/I/51WZvR7HHJL._AC_SL1200_.jpg', '14 Cores (6P+8E), 20 Threads, 5.3 GHz Max Boost, LGA1700'),

	--GPU mock data
	('ASUS ROG Strix RTX 4090', 'ASUS', 'ROG-STRIX-RTX4090-O24G-GAMING', 'GPU', 'https://m.media-amazon.com/images/I/81bhFNQDO2L._AC_SL1500_.jpg', '24GB GDDR6X, 2640 MHz Boost Clock, PCIe 4.0, DLSS 3, Ray Tracing'),
    ('MSI GeForce RTX 4080 SUPRIM X', 'MSI', 'RTX 4080 16GB SUPRIM X', 'GPU', 'https://m.media-amazon.com/images/I/81cNW6FHVJL._AC_SL1500_.jpg', '16GB GDDR6X, 2625 MHz Boost Clock, PCIe 4.0, Tri Frozr 3 Cooling'),
    ('GIGABYTE AORUS RTX 4070 Ti', 'GIGABYTE', 'GV-N407TAORUS M-12GD', 'GPU', 'https://m.media-amazon.com/images/I/81X5cuFKzlL._AC_SL1500_.jpg', '12GB GDDR6X, 2610 MHz Boost Clock, PCIe 4.0, WINDFORCE Cooling'),
    ('AMD Radeon RX 7900 XTX', 'AMD', '21322-00-40G', 'GPU', 'https://m.media-amazon.com/images/I/81bhqBPwZgL._AC_SL1500_.jpg', '24GB GDDR6, 2500 MHz Boost Clock, PCIe 4.0, RDNA 3'),
    ('ASUS TUF Gaming RTX 4070', 'ASUS', 'TUF-RTX4070-O12G-GAMING', 'GPU', 'https://m.media-amazon.com/images/I/81Y3FQFqZcL._AC_SL1500_.jpg', '12GB GDDR6X, 2610 MHz Boost Clock, PCIe 4.0, Axial-tech Fans'),
    ('MSI Ventus RTX 4060 Ti', 'MSI', 'RTX 4060 Ti VENTUS 2X BLACK 8G OC', 'GPU', 'https://m.media-amazon.com/images/I/71hL9RXHKVL._AC_SL1500_.jpg', '8GB GDDR6, 2565 MHz Boost Clock, PCIe 4.0, Dual Fan Design'),

    --Ram mock data
    ('G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5-6000 CL30', 'G.Skill', 'F5-6000J3038F16GX2-TZ5RK', 'RAM', 'https://m.media-amazon.com/images/I/71V2lGZ5eDL._AC_SL1500_.jpg','32GB Kit (2x16GB), DDR5-6000, CL30, Intel XMP/AMD EXPO, RGB'),
    ('Corsair Vengeance 32GB (2x16GB) DDR5-6000 CL36', 'Corsair', 'CMK32GX5M2E6000C36', 'RAM', 'https://m.media-amazon.com/images/I/71vD6xk0JwL._AC_SL1500_.jpg', '32GB Kit (2x16GB), DDR5-6000, CL36, XMP/EXPO Ready, Low-profile'),
    ('Kingston Fury Beast 16GB (2x8GB) DDR4-3200 CL16', 'Kingston', 'KF432C16BBK2/16', 'RAM', 'https://m.media-amazon.com/images/I/61GQ9k4jHJL._AC_SL1500_.jpg', '16GB Kit (2x8GB), DDR4-3200, CL16, Plug N Play, Black'),

    --SSD mock data
    ('Samsung 990 PRO 2TB NVMe M.2 PCIe 4.0', 'Samsung', 'MZ-V9P2T0B/AM', 'SSD', 'https://m.media-amazon.com/images/I/71u2Xl7v7VL._AC_SL1500_.jpg', '2TB, NVMe, M.2 2280, PCIe 4.0 x4, Up to 7450 MB/s Read'),
    ('WD_BLACK SN850X 1TB NVMe M.2 PCIe 4.0', 'Western Digital', 'WDS100T2X0E', 'SSD', 'https://m.media-amazon.com/images/I/61J9c4u3P6L._AC_SL1500_.jpg',   '1TB, NVMe, M.2 2280, PCIe 4.0 x4, Gaming SSD'),
    ('Crucial MX500 1TB SATA 2.5" SSD', 'Crucial', 'CT1000MX500SSD1', 'SSD', 'https://m.media-amazon.com/images/I/61V0b3Qh3IL._AC_SL1500_.jpg', '1TB, SATA III, 2.5-inch, Up to 560 MB/s Read');


INSERT INTO Products.Price (Product_id, Store, Price, Rating, [URL])
VALUES
	--Price CPU mock data

	-- AMD Ryzen 9 7950X
    (1, 'Newegg', 549.99, 4.8, 'https://www.newegg.com/amd-ryzen-9-7950x/p/N82E16819113770'),
    (1, 'MicroCenter', 529.99, 4.7, 'https://www.microcenter.com/product/651756/amd-ryzen-9-7950x'),
    
    -- Intel Core i9-14900K
    (2, 'Newegg', 589.99, 4.6, 'https://www.newegg.com/intel-core-i9-14900k/p/N82E16819118471'),
    (2, 'MicroCenter', 579.99, 4.5, 'https://www.microcenter.com/product/670504/intel-core-i9-14900k'),
    
    -- AMD Ryzen 7 7800X3D
    (3, 'Newegg', 449.99, 4.9, 'https://www.newegg.com/amd-ryzen-7-7800x3d/p/N82E16819113795'),
    (3, 'MicroCenter', 429.99, 5.0, 'https://www.microcenter.com/product/661320/amd-ryzen-7-7800x3d'),
    
    -- Intel Core i7-14700K
    (4, 'Newegg', 409.99, 4.7, 'https://www.newegg.com/intel-core-i7-14700k/p/N82E16819118470'),
    (4, 'MicroCenter', 399.99, 4.6, 'https://www.microcenter.com/product/670503/intel-core-i7-14700k'),
    
    -- AMD Ryzen 5 7600X
    (5, 'Newegg', 229.99, 4.8, 'https://www.newegg.com/amd-ryzen-5-7600x/p/N82E16819113768'),
    (5, 'MicroCenter', 219.99, 4.7, 'https://www.microcenter.com/product/651759/amd-ryzen-5-7600x'),
    
    -- Intel Core i5-14600K
    (6, 'Newegg', 319.99, 4.7, 'https://www.newegg.com/intel-core-i5-14600k/p/N82E16819118469'),
    (6, 'MicroCenter', 309.99, 4.6, 'https://www.microcenter.com/product/670502/intel-core-i5-14600k'),

    --Mock GPU price data

     -- ASUS ROG Strix RTX 4090
    (7, 'Newegg', 1899.99, 4.9, 'https://www.newegg.com/asus-geforce-rtx-4090-24gb/p/N82E16814126594'),
    (7, 'MicroCenter', 1849.99, 4.8, 'https://www.microcenter.com/product/652662/asus-rog-strix-geforce-rtx-4090'),
    
    -- MSI GeForce RTX 4080 SUPRIM X
    (8, 'Newegg', 1299.99, 4.7, 'https://www.newegg.com/msi-geforce-rtx-4080-16gb/p/N82E16814137751'),
    (8, 'MicroCenter', 1279.99, 4.6, 'https://www.microcenter.com/product/658480/msi-geforce-rtx-4080-suprim'),
    
    -- GIGABYTE AORUS RTX 4070 Ti
    (9, 'Newegg', 849.99, 4.7, 'https://www.newegg.com/gigabyte-geforce-rtx-4070-ti-12gb/p/N82E16814932563'),
    (9, 'MicroCenter', 829.99, 4.6, 'https://www.microcenter.com/product/660935/gigabyte-aorus-geforce-rtx-4070-ti'),
    
    -- AMD Radeon RX 7900 XTX
    (10, 'Newegg', 999.99, 4.5, 'https://www.newegg.com/amd-radeon-rx-7900-xtx-24gb/p/N82E16814105456'),
    (10, 'MicroCenter', 979.99, 4.4, 'https://www.microcenter.com/product/660000/amd-radeon-rx-7900-xtx'),
    
    -- ASUS TUF Gaming RTX 4070
    (11, 'Newegg', 599.99, 4.8, 'https://www.newegg.com/asus-geforce-rtx-4070-12gb/p/N82E16814126595'),
    (11, 'MicroCenter', 579.99, 4.7, 'https://www.microcenter.com/product/660936/asus-tuf-gaming-geforce-rtx-4070'),
    
    -- MSI Ventus RTX 4060 Ti
    (12, 'Newegg', 419.99, 4.6, 'https://www.newegg.com/msi-geforce-rtx-4060-ti-8gb/p/N82E16814137752'),
    (12, 'MicroCenter', 399.99, 4.5, 'https://www.microcenter.com/product/666666/msi-ventus-geforce-rtx-4060-ti'),

--RAM price mock data

    (13, 'Newegg', 119.99, 4.8, 'https://www.newegg.com/p/N82E16820374440'),
    (13, 'MicroCenter', 109.99, 4.7, 'https://www.microcenter.com/product/000000/g-skill-trident-z5-rgb-32gb-ddr5-6000'),

    (14, 'Newegg', 104.99, 4.7, 'https://www.newegg.com/p/N82E16820236919'),
    (14, 'MicroCenter',  99.99, 4.6, 'https://www.microcenter.com/product/000000/corsair-vengeance-32gb-ddr5-6000'),

    (15, 'Newegg',  39.99, 4.7, 'https://www.newegg.com/p/N82E16820242598'),
    (15, 'MicroCenter', 34.99, 4.6, 'https://www.microcenter.com/product/000000/kingston-fury-beast-16gb-ddr4-3200'),

--SSD price mock data

    (16, 'Newegg', 169.99, 4.8, 'https://www.newegg.com/p/N82E16820147861'),
    (16, 'MicroCenter', 159.99, 4.7, 'https://www.microcenter.com/product/000000/samsung-990-pro-2tb'),

    (17, 'Newegg',  89.99, 4.7, 'https://www.newegg.com/p/N82E16820250261'),
    (17, 'MicroCenter', 84.99, 4.6, 'https://www.microcenter.com/product/000000/wd-black-sn850x-1tb'),

    (18, 'Newegg',  69.99, 4.7, 'https://www.newegg.com/p/N82E16820156174'),
    (18, 'MicroCenter', 64.99, 4.6, 'https://www.microcenter.com/product/000000/crucial-mx500-1tb');

INSERT INTO Users.User_Comments(Product_id, User_id, [Text])
VALUES
    (1, 'user_3ADS3TmrTw3sWbzJXDtp19B2iAW', 'This is a test.'),
    (1, 'user_3ADS3TmrTw3sWbzJXDtp19B2iAW', 'This is another test.');

INSERT INTO Users.Recommendations(Product_id, User_id)
VALUES
    (1, 'user_3ADS3TmrTw3sWbzJXDtp19B2iAW'),
    (2, 'user_3ADS3TmrTw3sWbzJXDtp19B2iAW'),
    (4, 'user_3ADS3TmrTw3sWbzJXDtp19B2iAW'),
    (12, 'user_3ADS3TmrTw3sWbzJXDtp19B2iAW')

INSERT INTO Users.Likes(Product_id, User_id)
VALUES
    (1, 'user_3ADS3TmrTw3sWbzJXDtp19B2iAW'),
    (10, 'user_3ADS3TmrTw3sWbzJXDtp19B2iAW')

--Testing to make sure everything is there
SELECT * FROM Products.Products WHERE Product_Category = 'CPU'

SELECT * FROM Products.Products WHERE Product_Category = 'CPU'

SELECT * FROM Products.Products WHERE Product_Category = 'RAM'

SELECT * FROM Products.Products WHERE Product_Category = 'SSD'

SELECT * FROM Products.Price WHERE Store = 'Newegg'

SELECT * FROM Products.Price WHERE Store = 'Microcenter'

SELECT Product_id, COUNT(*) as PriceCount 
FROM Products.Price 
GROUP BY Product_id

SELECT * FROM Users.User_comments

SELECT * FROM Users.Recommendations

SELECT * FROM Users.Likes