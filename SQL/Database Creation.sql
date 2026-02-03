--Create Database
CREATE DATABASE ComparePro
GO

USE ComparePro
GO

--Create tables
CREATE TABLE Products(
	Product_id INT IDENTITY(1,1) PRIMARY KEY,
	Product_name NVARCHAR(400) NOT NULL,
	Brand NVARCHAR(50) NOT NULL,
	Model_Number NVARCHAR(50),
	Product_Category NVARCHAR(50) NOT NULL,
	Image_URL NVARCHAR(1000),
	Features NVARCHAR(MAX),
	Created_On DATETIME DEFAULT(SYSDATETIMEOFFSET()),
	Updated_On DATETIME DEFAULT(SYSDATETIMEOFFSET()),
);

CREATE TABLE Price(
	Price_id INT IDENTITY(1,1) PRIMARY KEY,
	Product_id INT NOT NULL,
	Store NVARCHAR(20) NOT NULL,
	Price DECIMAL(6, 2) NOT NULL,
	Rating DECIMAL(2, 1) NOT NULL,
	[URL] NVARCHAR(1000),
	Scrapped_At DATETIME DEFAULT(SYSDATETIMEOFFSET()),

	CONSTRAINT FK1_Product_id FOREIGN KEY(Product_id)
		REFERENCES Products(Product_id)
);

--indexs (possibly later)

--Insert data
INSERT INTO Products (Product_name, Brand, Model_Number, Product_Category, Image_URL, Features)
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
    ('MSI Ventus RTX 4060 Ti', 'MSI', 'RTX 4060 Ti VENTUS 2X BLACK 8G OC', 'GPU', 'https://m.media-amazon.com/images/I/71hL9RXHKVL._AC_SL1500_.jpg', '8GB GDDR6, 2565 MHz Boost Clock, PCIe 4.0, Dual Fan Design');

INSERT INTO Price (Product_id, Store, Price, Rating, [URL])
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
    (12, 'MicroCenter', 399.99, 4.5, 'https://www.microcenter.com/product/666666/msi-ventus-geforce-rtx-4060-ti');