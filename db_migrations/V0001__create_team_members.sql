CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  real_name VARCHAR(200) NOT NULL,
  role VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO team_members (name, real_name, role) VALUES
  ('BANNDA 82', 'Баннов Александр Анатольевич', 'Основатель, Nemezido Records');
