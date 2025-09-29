-- Inserta usuarios de ejemplo
INSERT INTO users (email, username, password, icon, admin) VALUES
('alice@example.com', 'alice', '$2a$10$/hl16QUmvpV2.2a8o7VTEOdRptbssk/u6AYnkSAtiFVJC9vJcr1fK', 'https://avatar.iran.liara.run/username?username=Alice', FALSE),
('bob@example.com', 'bob', '$2a$10$rarhuhkUDN0DD6kmrH0v0.CIJUjUc0f1RfE0LHTWahfnQPQAor.Be', 'https://avatar.iran.liara.run/username?username=Bob', FALSE),
('charlie@example.com', 'charlie', '$2a$10$6kfMXScaWG7gPdLX4VqEXetgbM6ASp5G68mg0PXuRgT0F7MUdCA3G', 'https://avatar.iran.liara.run/username?username=Charlie', FALSE),
('admin@example.com', 'admin', '$2a$10$nyholObjpuWYJspsitliMewDzLhSNTHIPKNqnULKpAUo61I8/co8W', 'https://avatar.iran.liara.run/username?username=Admin', TRUE);
