-- Este script deve ser executado no SQL Editor do Supabase.
-- Ele cria a tabela 'mentors' e insere os dados iniciais.

-- 1. Criação da Tabela mentors
CREATE TABLE mentors (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    price NUMERIC(5, 2) NOT NULL,
    bio TEXT NOT NULL,
    verified BOOLEAN NOT NULL,
    rating REAL NOT NULL,
    image_url TEXT NOT NULL,
    backgroundurl TEXT
);

-- 2. Inserção dos Dados Iniciais
INSERT INTO mentors (id, name, subject, price, bio, verified, rating, image_url, backgroundurl) VALUES (1, 'McLovin', 'Python', 95.00, 'Desenvolvedora Sênior, proficiente em Python e Inglês. Experiência em projetos de software.', TRUE, 4.9, 'https://placehold.co/100x100/E8634E/FFFFFF?text=MC', 'https://placehold.co/1280x400/313739/FBF2F0?text=Background+Python');
INSERT INTO mentors (id, name, subject, price, bio, verified, rating, image_url, backgroundurl) VALUES (2, 'Marcos Silva', 'Cálculo Avançado', 110.00, 'Mestre em Matemática. Foco em derivadas e integrais complexas.', TRUE, 4.7, 'https://placehold.co/100x100/313739/FFFFFF?text=MS', 'https://placehold.co/1280x400/313739/FBF2F0?text=Background+Calculo');
INSERT INTO mentors (id, name, subject, price, bio, verified, rating, image_url, backgroundurl) VALUES (3, 'SR. Olívio', 'História', 80.00, 'Professor de História Geral, especialista em História Contemporânea.', TRUE, 4.5, 'https://placehold.co/100x100/727B82/FFFFFF?text=SO', 'https://placehold.co/1280x400/313739/FBF2F0?text=Background+Historia');
INSERT INTO mentors (id, name, subject, price, bio, verified, rating, image_url, backgroundurl) VALUES (4, 'Mariana Oliveira', 'Geografia', 75.00, 'Geógrafa, foco em Geopolítica e Cartografia.', FALSE, 4.2, 'https://placehold.co/100x100/E8634E/FFFFFF?text=MO', 'https://placehold.co/1280x400/313739/FBF2F0?text=Background+Geografia');
