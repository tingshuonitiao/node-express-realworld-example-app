-- 创建用户 (条件创建)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'user0') THEN
    CREATE USER user0 WITH PASSWORD '123456';
  END IF;
END
$$;

-- 创建数据库 (条件创建)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'realworld') THEN
    CREATE DATABASE realworld WITH OWNER = user0 ENCODING 'UTF8';
  ELSE
    ALTER DATABASE realworld OWNER TO user0;
  END IF;
END
$$;

-- 授予权限
GRANT ALL PRIVILEGES ON DATABASE realworld TO user0;

-- 设置数据库权限
\c realworld
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO user0;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO user0;