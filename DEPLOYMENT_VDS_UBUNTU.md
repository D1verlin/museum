# Инструкция по развертыванию проекта на VDS (Ubuntu 22.04 / 24.04 LTS)

**Домен проекта**: `museum.diverlin.ru`  
**Порт бэкенда**: `3017`  
**Менеджер процессов**: `PM2`  
**Веб-сервер / Reverse Proxy**: `Nginx`  
**База данных**: `SQLite 3 (Sequelize ORM)`

---

## 1. Подготовка сервера Ubuntu

Подключитесь к вашему VDS по SSH:
```bash
ssh root@ваш_ip_адрес
```

### 1.1 Обновление пакетов системы
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw build-essential
```

### 1.2 Установка Node.js (версия 20 LTS или 22 LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # Проверка: должно вывести v20.x.x
npm -v    # Проверка: должно вывести 10.x.x
```

### 1.3 Установка PM2 глобально
```bash
sudo npm install -g pm2
```

### 1.4 Установка Nginx и Certbot (для SSL-сертификата Let's Encrypt)
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

---

## 2. Настройка DNS-записи домена

В панели управления вашим доменом (REG.RU, Cloudflare, Beget или у вашего регистратора) добавьте A-запись:
* **Тип**: `A`
* **Имя (Subdomain)**: `museum`
* **Значение (IP)**: `IP-адрес вашего VDS`
* **TTL**: `300` (или `Auto`)

Убедитесь, что домен резолвится на ваш сервер:
```bash
ping museum.diverlin.ru
```

---

## 3. Перенос и сборка проекта на VDS

### 3.1 Создание рабочей директории
```bash
sudo mkdir -p /var/www/museum.diverlin.ru
sudo chown -R $USER:$USER /var/www/museum.diverlin.ru
```

### 3.2 Перенос файлов на сервер
**Вариант А: через Git (рекомендуется)**
```bash
cd /var/www/museum.diverlin.ru
git clone <URL_ВАШЕГО_РЕПОЗИТОРИЯ> .
```

**Вариант Б: через SCP с локального компьютера (Windows PowerShell)**
```powershell
# Выполнить на вашем локальном компьютере в папке проекта:
scp -r * root@ваш_ip_адреса:/var/www/museum.diverlin.ru/
```

### 3.3 Установка зависимостей и сборка фронтенда
На сервере перейдите в папку проекта:
```bash
cd /var/www/museum.diverlin.ru

# Установка зависимостей
npm install

# Сборка оптимизированного продакшн-бандла Vite
npm run build
```
После сборки появится папка `/var/www/museum.diverlin.ru/dist`.

### 3.4 Настройка файла окружения `.env`
Создайте файл `.env`:
```bash
nano /var/www/museum.diverlin.ru/.env
```
Вставьте следующие параметры:
```env
PORT=3017
NODE_ENV=production
JWT_SECRET=super_secret_jwt_museum_key_diverlin_ru_2026
DOMAIN=museum.diverlin.ru
```
Сохраните файл (`Ctrl + O`, `Enter`, `Ctrl + X`).

---

## 4. Запуск бэкенда через PM2

В проекте уже подготовлен конфигурационный файл `ecosystem.config.cjs`.

### 4.1 Создание папки для логов
```bash
mkdir -p /var/www/museum.diverlin.ru/logs
```

### 4.2 Запуск процесса в PM2
```bash
cd /var/www/museum.diverlin.ru
pm2 start ecosystem.config.cjs
```

### 4.3 Настройка автозапуска PM2 при перезагрузке сервера
```bash
pm2 save
pm2 startup
```
*(Выполните команду, которую PM2 выведет в терминале, например: `sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root`).*

### 4.4 Проверка статуса
```bash
pm2 status
pm2 logs museum-diverlin --lines 20
```
Тест локального ответа API:
```bash
curl http://127.0.0.1:3017/api/health
```
*(Должен вернуться JSON: `{"success":true,"data":{"status":"UP",...}}`)*.

---

## 5. Настройка веб-сервера Nginx

### 5.1 Копирование конфигурации
Скопируйте подготовленный конфигурационный файл в директорию Nginx:
```bash
sudo cp /var/www/museum.diverlin.ru/nginx/museum.diverlin.ru.conf /etc/nginx/sites-available/museum.diverlin.ru
```

### 5.2 Активация сайта
```bash
sudo ln -s /etc/nginx/sites-available/museum.diverlin.ru /etc/nginx/sites-enabled/
```

### 5.3 Проверка синтаксиса и перезапуск Nginx
```bash
sudo nginx -t
sudo systemctl reload nginx
```

Теперь ваш сайт и API уже доступны по HTTP: `http://museum.diverlin.ru`.

---

## 6. Получение бесплатного SSL-сертификата (HTTPS)

Выполните команду Certbot для автоматической генерации и установки сертификата Let's Encrypt:
```bash
sudo certbot --nginx -d museum.diverlin.ru
```
* Введите ваш email для уведомлений о сертификате.
* Согласитесь с условиями (`Y`).
* Certbot автоматически настроит защищенный протокол HTTPS и редирект с HTTP на HTTPS.

Проверка автообновления сертификатов:
```bash
sudo certbot renew --dry-run
```

---

## 7. Настройка Firewall (UFW)
Оставьте открытыми только необходимые порты (SSH, HTTP, HTTPS):
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```
*(Прямой порт 3017 наружу открывать не требуется — к нему безопасно обращается локальный Nginx).*

---

## 8. Проверка работоспособности

1. **Главная страница веб-приложения**:  
   `https://museum.diverlin.ru`
2. **Интерактивная документация Swagger UI**:  
   `https://museum.diverlin.ru/api/docs`
3. **Системный Health-check**:  
   `https://museum.diverlin.ru/api/health`
4. **Учетные записи по умолчанию**:
   * **Администратор**: `admin@artmuseum.by` / `AdminPass123!`
   * **Посетитель**: `visitor@artmuseum.by` / `VisitorPass123!`

---

## 9. Полезные команды для обслуживания

* **Просмотр логов бэкенда в реальном времени**:
  ```bash
  pm2 logs museum-diverlin
  ```
* **Мониторинг нагрузки и памяти (Dashboard)**:
  ```bash
  pm2 monit
  ```
* **Перезапуск сервера при обновлениях**:
  ```bash
  cd /var/www/museum.diverlin.ru
  git pull
  npm install
  npm run build
  pm2 reload museum-diverlin
  ```
* **Резервная копия базы данных SQLite**:
  База данных хранится в одном файле:
  ```bash
  cp /var/www/museum.diverlin.ru/server/data/museum.sqlite /var/backups/museum_$(date +%F).sqlite
  ```
