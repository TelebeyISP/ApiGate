FROM php:8.3-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl unzip libzip-dev libpng-dev libjpeg-dev \
    libfreetype6-dev libicu-dev libonig-dev libxml2-dev \
    default-mysql-client nodejs npm \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo pdo_mysql zip gd intl mbstring opcache exif \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# PHP memory configuration
RUN echo "memory_limit = 1G\nupload_max_filesize = 32M\npost_max_size = 32M" \
    > /usr/local/etc/php/conf.d/sylius.ini

# Install Composer 2.5
COPY --from=composer:2.5 /usr/bin/composer /usr/bin/composer

# Enable mod_rewrite
RUN a2enmod rewrite

WORKDIR /var/www/html

ENV COMPOSER_ALLOW_SUPERUSER=1

# Step 1: Create project without running scripts/plugins
RUN composer create-project \
    --no-interaction \
    --prefer-dist \
    --no-scripts \
    --no-plugins \
    sylius/sylius-standard:^1.13 \
    .

# Step 2: Now configure all allowed plugins in the project
RUN composer config allow-plugins.sylius/sylius-fixtures-plugin true && \
    composer config allow-plugins.symfony/flex true && \
    composer config allow-plugins.symfony/runtime true && \
    composer config allow-plugins.dealerdirect/phpcodesniffer-composer-installer true && \
    composer config allow-plugins.rector/extension-installer true

# Step 3: Run install properly with plugins enabled (no scripts - they need a DB)
RUN composer install --no-interaction --prefer-dist --no-dev --no-scripts

# Set up Apache to serve /public  
RUN sed -i \
    's!DocumentRoot /var/www/html!DocumentRoot /var/www/html/public!' \
    /etc/apache2/sites-available/000-default.conf \
    && echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && printf '<Directory /var/www/html/public>\n  AllowOverride All\n  Require all granted\n</Directory>\n' \
       >> /etc/apache2/sites-available/000-default.conf

# Fix file ownership
RUN chown -R www-data:www-data /var/www/html

# Copy entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
CMD ["apache2-foreground"]
