-- Create chains table
CREATE TABLE IF NOT EXISTS chains (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    type VARCHAR(50) DEFAULT 'tunnel',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some default chains
INSERT INTO chains (name, description, icon, status, type) VALUES
    ('Ethereum', 'Ethereum Mainnet', '🔷', 'active', 'tunnel'),
    ('Polygon', 'Polygon PoS', '💜', 'active', 'tunnel'),
    ('Arbitrum', 'Arbitrum One', '🔵', 'active', 'tunnel'),
    ('Optimism', 'Optimism Mainnet', '🔴', 'active', 'tunnel'),
    ('Base', 'Base Network', '🔵', 'active', 'tunnel')
ON CONFLICT (name) DO NOTHING;
