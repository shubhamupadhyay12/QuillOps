import os
import unittest

from database import normalize_database_urls


class TestDatabaseURLNormalization(unittest.TestCase):
    def test_standard_supabase_postgresql_uri(self):
        url = "postgresql://user:secretpass@db.supabase.co:5432/postgres"
        sqlalchemy_url, psycopg_url = normalize_database_urls(url)
        self.assertEqual(sqlalchemy_url, "postgresql+psycopg://user:secretpass@db.supabase.co:5432/postgres")
        self.assertEqual(psycopg_url, "postgresql://user:secretpass@db.supabase.co:5432/postgres")

    def test_postgres_legacy_uri(self):
        url = "postgres://user:secretpass@db.supabase.co:5432/postgres"
        sqlalchemy_url, psycopg_url = normalize_database_urls(url)
        self.assertEqual(sqlalchemy_url, "postgresql+psycopg://user:secretpass@db.supabase.co:5432/postgres")
        self.assertEqual(psycopg_url, "postgresql://user:secretpass@db.supabase.co:5432/postgres")

    def test_postgresql_psycopg_uri(self):
        url = "postgresql+psycopg://user:secretpass@db.supabase.co:5432/postgres"
        sqlalchemy_url, psycopg_url = normalize_database_urls(url)
        self.assertEqual(sqlalchemy_url, "postgresql+psycopg://user:secretpass@db.supabase.co:5432/postgres")
        self.assertEqual(psycopg_url, "postgresql://user:secretpass@db.supabase.co:5432/postgres")

    def test_sqlite_uri(self):
        url = "sqlite:///./quillops.db"
        sqlalchemy_url, psycopg_url = normalize_database_urls(url)
        self.assertEqual(sqlalchemy_url, "sqlite:///./quillops.db")
        self.assertEqual(psycopg_url, "sqlite:///./quillops.db")

    def test_encoded_password_characters(self):
        url = "postgresql://user:p%40ss%23word@db.supabase.co:5432/postgres"
        sqlalchemy_url, psycopg_url = normalize_database_urls(url)
        self.assertEqual(sqlalchemy_url, "postgresql+psycopg://user:p%40ss%23word@db.supabase.co:5432/postgres")
        self.assertEqual(psycopg_url, "postgresql://user:p%40ss%23word@db.supabase.co:5432/postgres")
        self.assertIn("p%40ss%23word", sqlalchemy_url)
        self.assertIn("p%40ss%23word", psycopg_url)

    def test_production_rejection_missing_db_url(self):
        from main import startup

        os.environ["ENV"] = "production"
        os.environ["JWT_SECRET"] = "valid-production-secret-with-sufficient-length"
        os.environ["NVIDIA_API_KEY"] = "valid-key"
        os.environ["TAVILY_API_KEY"] = "valid-key"
        old_db_url = os.environ.pop("DATABASE_URL", None)

        try:
            with self.assertRaises(RuntimeError) as cm:
                startup()
            self.assertIn("DATABASE_URL must be a PostgreSQL connection URL in production", str(cm.exception))
        finally:
            os.environ.pop("ENV", None)
            if old_db_url:
                os.environ["DATABASE_URL"] = old_db_url

    def test_production_rejection_sqlite(self):
        from main import startup

        os.environ["ENV"] = "production"
        os.environ["DATABASE_URL"] = "sqlite:///./quillops.db"
        os.environ["JWT_SECRET"] = "valid-production-secret-with-sufficient-length"
        os.environ["NVIDIA_API_KEY"] = "valid-key"
        os.environ["TAVILY_API_KEY"] = "valid-key"

        try:
            with self.assertRaises(RuntimeError) as cm:
                startup()
            self.assertIn("DATABASE_URL must be a PostgreSQL connection URL in production", str(cm.exception))
        finally:
            os.environ.pop("ENV", None)
            os.environ.pop("DATABASE_URL", None)

    def test_sqlalchemy_dialect_url(self):
        url = "postgresql://user:secretpass@host:5432/db"
        sqlalchemy_url, _ = normalize_database_urls(url)
        self.assertTrue(sqlalchemy_url.startswith("postgresql+psycopg://"))

    def test_psycopg_connect_url(self):
        url = "postgresql+psycopg://user:secretpass@host:5432/db"
        _, psycopg_url = normalize_database_urls(url)
        self.assertTrue(psycopg_url.startswith("postgresql://"))
        self.assertNotIn("+psycopg", psycopg_url)

    def test_no_secret_url_in_error_message(self):
        secret_url = "postgresql://user:SUPER_SECRET_PASSWORD@db.supabase.co:5432/db"
        sqlalchemy_url, _ = normalize_database_urls(secret_url)

        # Verify error string when production validation fails does not leak credentials
        os.environ["ENV"] = "production"
        os.environ["DATABASE_URL"] = "sqlite:///./quillops.db"
        try:
            from main import startup
            with self.assertRaises(RuntimeError) as cm:
                startup()
            err_msg = str(cm.exception)
            self.assertNotIn("SUPER_SECRET_PASSWORD", err_msg)
            self.assertNotIn("user:", err_msg)
            self.assertNotIn("db.supabase.co", err_msg)
        finally:
            os.environ.pop("ENV", None)
            os.environ.pop("DATABASE_URL", None)


if __name__ == "__main__":
    unittest.main()
