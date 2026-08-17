#!/bin/sh
set -e

echo "==> Waiting for MySQL at sylius-db:3306..."
until php -r "new PDO('mysql:host=sylius-db;port=3306;dbname=sylius', 'sylius', 'sylius');" 2>/dev/null; do
  echo "  MySQL not ready, retrying in 3s..."
  sleep 3
done
echo "==> MySQL is ready."

cd /var/www/html

# Parse DB config from DATABASE_URL
export DATABASE_URL="${DATABASE_URL:-mysql://sylius:sylius@sylius-db:3306/sylius}"

echo "==> Clearing Symfony cache..."
APP_ENV=prod php bin/console cache:clear --no-warmup 2>/dev/null || true
APP_ENV=prod php bin/console cache:warmup 2>/dev/null || true

echo "==> Running database schema setup..."
APP_ENV=prod php bin/console doctrine:schema:create --no-interaction 2>/dev/null || \
APP_ENV=prod php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration 2>/dev/null || true

echo "==> Running Sylius setup (locale, currency, channel)..."
APP_ENV=prod php bin/console sylius:install:setup --no-interaction 2>/dev/null || true

echo "==> Creating admin user (admin@telebey.com) ..."
APP_ENV=prod php bin/console sylius:admin-user:create \
  --email=admin@telebey.com \
  --password=Admin1234! \
  --username=telebey_admin \
  --first-name=Telebey \
  --last-name=Admin \
  --no-interaction 2>/dev/null || echo "  Admin user may already exist."

echo "==> Generating JWT keys if missing..."
APP_ENV=prod php bin/console lexik:jwt:generate-keypair --skip-if-exists 2>/dev/null || true

echo "==> Fixing permissions..."
chown -R www-data:www-data var/ public/media/ config/jwt/ 2>/dev/null || true

echo "==> Starting Apache..."
exec "$@"
