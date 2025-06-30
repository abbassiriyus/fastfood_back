CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    type INT CHECK (type IN (1, 2, 3)),
    image TEXT,
    description TEXT,
    count_seen INTEGER DEFAULT 0,
    prosent FLOAT,
    orders INTEGER,
    password VARCHAR(255) UNIQUE NOT NULL,  -- UNIQUE cheklovi qo'shildi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT FALSE
);
CREATE TABLE tarixoylik(
    id SERIAL PRIMARY KEY,
    user_id INT,
    price INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE carousel (
    id SERIAL PRIMARY KEY,
    fastfood_id INT,
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    fastfood_id INT,
    orders INTEGER,
    FOREIGN KEY (fastfood_id) REFERENCES fastfood(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INT,
    image TEXT NOT NULL,
    orders INT,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE zakaz(
    id SERIAL PRIMARY KEY,
    user_id INT,
    number_stol INTEGER,
    status INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE zakaz_products (
    id SERIAL PRIMARY KEY,
    product_id INT,   
    zakaz_id INT,
    count INT,
    price INTEGER,
    fastfood_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE protsent(
    id SERIAL PRIMARY KEY,
    foiz FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE users_id_seq OWNED BY users.id;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO hayyatuz_menugo_user;

ALTER SEQUENCE protsent_id_seq OWNED BY protsent.id;
GRANT USAGE, SELECT ON SEQUENCE protsent_id_seq TO hayyatuz_menugo_user;

ALTER SEQUENCE carousel_id_seq OWNED BY carousel.id;
GRANT USAGE, SELECT ON SEQUENCE carousel_id_seq TO hayyatuz_menugo_user;




ALTER SEQUENCE categories_id_seq OWNED BY categories.id;
GRANT USAGE, SELECT ON SEQUENCE categories_id_seq TO hayyatuz_menugo_user;


ALTER SEQUENCE products_id_seq OWNED BY products.id;
GRANT USAGE, SELECT ON SEQUENCE products_id_seq TO hayyatuz_menugo_user;


ALTER SEQUENCE zakaz_id_seq OWNED BY zakaz.id;
GRANT USAGE, SELECT ON SEQUENCE zakaz_id_seq TO hayyatuz_menugo_user;


ALTER SEQUENCE zakaz_products_id_seq OWNED BY zakaz_products.id;
GRANT USAGE, SELECT ON SEQUENCE zakaz_products_id_seq TO hayyatuz_menugo_user;


ALTER SEQUENCE tarixoylik_id_seq OWNED BY tarixoylik.id;
GRANT USAGE, SELECT ON SEQUENCE tarixoylik_id_seq TO hayyatuz_menugo_user;



