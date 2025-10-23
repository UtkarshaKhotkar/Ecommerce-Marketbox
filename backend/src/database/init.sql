-- Initial database setup
CREATE DATABASE IF NOT EXISTS ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce;

-- Create indexes for better performance
-- These will be created by TypeORM, but having them here for reference

-- User indexes
-- CREATE INDEX idx_users_email ON users(email);
-- CREATE INDEX idx_users_role ON users(role);

-- Product indexes  
-- CREATE INDEX idx_products_name ON products(name);
-- CREATE INDEX idx_products_status_created ON products(status, created_at);
-- CREATE INDEX idx_products_category_status ON products(category_id, status);
-- CREATE INDEX idx_products_seller ON products(seller_id);

-- Order indexes
-- CREATE INDEX idx_orders_user ON orders(user_id);
-- CREATE INDEX idx_orders_status ON orders(status);
-- CREATE INDEX idx_orders_created ON orders(created_at);

-- Category indexes
-- CREATE INDEX idx_categories_slug ON categories(slug);
-- CREATE INDEX idx_categories_parent ON categories(parent_id);
-- CREATE INDEX idx_categories_active ON categories(is_active);