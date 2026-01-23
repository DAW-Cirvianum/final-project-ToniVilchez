# Projecte Word Game – Laravel + React (Laravel Sail)

## Descripció del projecte

Aquest projecte és una aplicació web **full-stack** desenvolupada amb **Laravel (API REST)** i **React** com a frontend.  
L’aplicació implementa un **joc de paraules per categories**, amb gestió de partides, rondes, jugadors, paraules i imatges, incloent autenticació d’usuaris i funcionalitats d’administració.

El backend s’executa mitjançant **Laravel Sail (Docker)** i el frontend consumeix l’API a través d’**Axios**.

---

## Esquema de la base de dades

### Taules i relacions

#### users
- id (PK)
- name
- email
- password
- role
- language
- avatar
- created_at
- updated_at

---

#### games
- id (PK)
- name
- status
- created_by (FK → users.id)
- created_at
- updated_at

---

#### players
- id (PK)
- user_id (FK → users.id)
- game_id (FK → games.id)
- score
- created_at
- updated_at

---

#### rounds
- id (PK)
- game_id (FK → games.id)
- round_number
- active
- created_at
- updated_at

---

#### categories
- id (PK)
- name
- is_default
- created_at
- updated_at

---

#### words
- id (PK)
- word
- category_id (FK → categories.id)
- created_at
- updated_at

---

#### images
- id (PK)
- path
- imageable_id (polimòrfic)
- imageable_type (polimòrfic)
- created_at
- updated_at

---

## Relacions principals

- **User 1 ── N Game**  
  Un usuari pot crear diverses partides.

- **User N ── N Game** (mitjançant *players*)  
  Un usuari pot participar en diverses partides.

- **Game 1 ── N Round**  
  Una partida té diverses rondes.

- **Game 1 ── N Player**  
  Una partida té diversos jugadors.

- **Category 1 ── N Word**  
  Una categoria conté múltiples paraules.

- **Image (polimòrfica)**  
  Una imatge pot pertànyer a una paraula o a una categoria.

---

## Funcionament del projecte

### Backend – Laravel

El backend segueix una arquitectura **MVC** i exposa una **API REST**.

#### Models
- User
- Game
- Round
- Player
- Word
- Category
- Image

#### Controllers
- AuthController
- UserController
- AdminController
- GameController
- RoundController
- PlayerController
- WordController
- CategoryController
- ImageController
- PasswordResetController
- RecoveryController

Les rutes de l’API es defineixen a `routes/api.php` i l’autenticació es gestiona amb **Laravel Sanctum**.

---

### Frontend – React

Aplicació **Single Page Application (SPA)** desenvolupada amb:
- React
- Vite
- Tailwind CSS

#### Funcionalitats
- Registre i inici de sessió
- Creació i gestió de partides
- Sistema de rondes
- Gestió de categories i paraules
- Panell d’administració
- Disseny responsive

Codi font ubicat a `frontend-project/src`.

---

## Instal·lació (Laravel Sail)

### Requisits previs

- Docker
- Docker Compose
- Node.js >= 18

---

### Backend

```bash
cd backend-project
cp .env.example .env
composer install
php artisan key:generate
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate --seed
```

API disponible a:
http://localhost:8000

### Frontend
```bash
cd frontend-project
npm install
npm run dev
```

Frontend disponible a:
http://localhost:5173

## Producció
### Backend
```bash
APP_ENV=production
APP_DEBUG=false

php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Configurar el servidor web apuntant a:

`backend-project/public`

### Frontend
```bash
npm run build
```

Publicar el contingut de:

`frontend-project/dist`
i configurar l’URL de l’API en producció.

## Autor

Toni Vilchez