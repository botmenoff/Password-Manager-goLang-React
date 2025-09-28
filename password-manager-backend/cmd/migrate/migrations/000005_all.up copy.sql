CREATE DATABASE passwordManagerDatabase;
CREATE USER IF NOT EXISTS 'ferran'@'localhost' IDENTIFIED BY 'password1234';
GRANT ALL PRIVILEGES ON passwordManagerDatabase.* TO 'ferran'@'localhost';
FLUSH PRIVILEGES;


USE passwordManagerDatabase;

CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    icon VARCHAR(255) NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS notes (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    note_text VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    password VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Inserta usuarios de ejemplo
INSERT INTO users (email, username, password, icon, admin) VALUES
('alice@example.com', 'alice', '$2a$10$/hl16QUmvpV2.2a8o7VTEOdRptbssk/u6AYnkSAtiFVJC9vJcr1fK', 'https://avatar.iran.liara.run/username?username=Alice', FALSE),
('bob@example.com', 'bob', '$2a$10$rarhuhkUDN0DD6kmrH0v0.CIJUjUc0f1RfE0LHTWahfnQPQAor.Be', 'https://avatar.iran.liara.run/username?username=Bob', FALSE),
('charlie@example.com', 'charlie', '$2a$10$6kfMXScaWG7gPdLX4VqEXetgbM6ASp5G68mg0PXuRgT0F7MUdCA3G', 'https://avatar.iran.liara.run/username?username=Charlie', FALSE),
('admin@example.com', 'admin', '$2a$10$nyholObjpuWYJspsitliMewDzLhSNTHIPKNqnULKpAUo61I8/co8W', 'https://avatar.iran.liara.run/username?username=Admin', TRUE);


-- Notas para Alice (user_id = 1)
INSERT INTO notes (user_id, note_text, username, password) VALUES
(1, 'Gmail', 'alice@gmail.com', NULL),
(1, 'Facebook', 'alice_fb', NULL),
(1, 'Twitter', 'alice_tw', NULL),
(1, 'LinkedIn', 'alice_li', NULL),
(1, 'Netflix', 'alice_nflx', NULL),
(1, 'Amazon', 'alice_amz', NULL),
(1, 'GitHub', 'alice_git', NULL),
(1, 'Dropbox', 'alice_drop', NULL),
(1, 'Spotify', 'alice_sp', NULL),
(1, 'Zoom', 'alice_zoom', NULL);

-- Notas para Bob (user_id = 2)
INSERT INTO notes (user_id, note_text, username, password) VALUES
(2, 'Gmail', 'bob@gmail.com', NULL),
(2, 'Facebook', 'bob_fb', NULL),
(2, 'Twitter', 'bob_tw', NULL),
(2, 'LinkedIn', 'bob_li', NULL),
(2, 'Netflix', 'bob_nflx', NULL),
(2, 'Amazon', 'bob_amz', NULL),
(2, 'GitHub', 'bob_git', NULL),
(2, 'Dropbox', 'bob_drop', NULL),
(2, 'Spotify', 'bob_sp', NULL),
(2, 'Zoom', 'bob_zoom', NULL);

-- Notas para Charlie (user_id = 3)
INSERT INTO notes (user_id, note_text, username, password) VALUES
(3, 'Gmail', 'charlie@gmail.com', NULL),
(3, 'Facebook', 'charlie_fb', NULL),
(3, 'Twitter', 'charlie_tw', NULL),
(3, 'LinkedIn', 'charlie_li', NULL),
(3, 'Netflix', 'charlie_nflx', NULL),
(3, 'Amazon', 'charlie_amz', NULL),
(3, 'GitHub', 'charlie_git', NULL),
(3, 'Dropbox', 'charlie_drop', NULL),
(3, 'Spotify', 'charlie_sp', NULL),
(3, 'Zoom', 'charlie_zoom', NULL);

-- Notas para Admin (user_id = 4)
INSERT INTO notes (user_id, note_text, username, password) VALUES
(4, 'Gmail', 'admin@gmail.com', NULL),
(4, 'Facebook', 'admin_fb', NULL),
(4, 'Twitter', 'admin_tw', NULL),
(4, 'LinkedIn', 'admin_li', NULL),
(4, 'Netflix', 'admin_nflx', NULL),
(4, 'Amazon', 'admin_amz', NULL),
(4, 'GitHub', 'admin_git', NULL),
(4, 'Dropbox', 'admin_drop', NULL),
(4, 'Spotify', 'admin_sp', NULL),
(4, 'Zoom', 'admin_zoom', NULL);
