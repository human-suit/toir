# TOiR System Generator

Система генерации **backend и frontend** для системы **ТОиР (Техническое обслуживание и ремонт оборудования)** на основе описания сущностей в **Prisma Schema**.

Главная идея проекта — **описать структуру данных один раз**, после чего автоматически получить:

* Backend API (NestJS)
* Admin UI (React Admin)
* Полноценную CRUD-админку

---

# Главная концепция

Проект строится вокруг **code generation архитектуры**.

Описание сущностей:

```
Prisma schema
      ↓
Prisma DMMF
      ↓
generator
      ↓
meta.json
      ↓
NestJS modules
      ↓
React Admin UI
```

Это позволяет создать систему, где **добавление новой сущности занимает несколько минут**.

---

# Как работает генерация

## 1. Prisma Schema

Файл `schema.prisma` содержит описание моделей данных.

Пример:

```prisma
model Equipment {
  id        Int      @id @default(autoincrement())
  name      String
  serial    String?
  createdAt DateTime @default(now())

  workOrders WorkOrder[]
}
```

Schema является **единственным источником правды (Single Source of Truth)** для всей системы.

---

## 2. Prisma DMMF

DMMF (Data Model Meta Format) — это **метаданные Prisma Schema**.

Prisma преобразует schema в JSON-описание моделей:

* модели
* поля
* типы
* связи
* optional поля
* id и unique поля

Generator использует DMMF чтобы **понять структуру данных**.

---

## 3. Generator

Генератор находится в:

```
tools/generator
```

Он:

1. Читает Prisma Schema
2. Получает DMMF
3. Извлекает модели
4. Генерирует NestJS код

Generator создаёт CRUD модуль для каждой модели.

---

## 4. meta.json

Генератор может формировать **мета-описание модели**.

Пример:

```json
{
  "model": "Equipment",
  "fields": [
    { "name": "id", "type": "Int", "required": true },
    { "name": "name", "type": "String", "required": true },
    { "name": "serial", "type": "String", "required": false }
  ]
}
```

Этот файл нужен для:

* генерации backend
* генерации frontend
* генерации DTO
* генерации React Admin

meta.json — это **универсальное описание модели для генераторов**.

---

# Генерация Backend

Генератор создаёт NestJS CRUD модуль.

Структура:

```
src/modules/equipment

equipment.module.ts
equipment.controller.ts
equipment.service.ts

dto/
  create-equipment.dto.ts
  update-equipment.dto.ts
```

---

# DTO

DTO (Data Transfer Object) используется для:

* валидации входящих данных
* контроля структуры API
* защиты от лишних полей

Пример:

```
CreateEquipmentDto
UpdateEquipmentDto
```

DTO генерируются из Prisma модели.

Пример:

Prisma:

```prisma
model Equipment {
  id Int
  name String
  serial String?
}
```

DTO:

```ts
export class CreateEquipmentDto {
  name: string
  serial?: string
}
```

DTO позволяет:

* не принимать `id`
* не принимать системные поля
* валидировать данные

---

# Архитектура Backend

```
backend
│
├─ src
│   ├─ modules
│   │   └─ equipment
│   │
│   └─ prisma
│       ├─ prisma.module.ts
│       └─ prisma.service.ts
│
└─ tools
    └─ generator
```

---

# Технологический стек

## Backend

* Node.js
* NestJS
* TypeScript
* Prisma 7

## Frontend

* React
* TypeScript
* Vite
* React Admin

## Database

* PostgreSQL

## Infrastructure

* Docker
* Portainer
* Nginx Proxy Manager

---

# Docker

PostgreSQL работает в Docker.

```yaml
services:
  db:
    image: postgres:17
    container_name: toir-postgres
    restart: always
    environment:
      POSTGRES_DB: toir
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 515340
    ports:
      - "5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Порт **5433** используется потому что:

* `5432` — локальный postgres Windows
* `5433` — postgres внутри Docker

---

# Подключение к базе

```
DATABASE_URL="postgresql://postgres:515340@localhost:5433/toir"
```

---

# Prisma Config

```ts
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
```

---

# Текущее состояние проекта

## Инфраструктура

Готово:

* Docker
* PostgreSQL
* Prisma
* миграции
* подключение к базе

---

## Backend

Готово:

* NestJS сервер
* PrismaService
* Prisma 7
* Swagger
* тестовый endpoint

```
GET /test
SELECT 1
```

---

## Генератор

Генератор уже умеет:

* читать Prisma schema
* получать DMMF
* находить модели
* генерировать CRUD NestJS модуль

Создаётся:

* module
* controller
* service
* DTO

---

# Пример endpoint

```
GET /equipment
```

Service использует Prisma Client:

```
findAll
findOne
create
update
delete
```

---

# Принципы разработки

Проект развивается **итерационно как production система**.

Основные правила:

1. Один шаг за раз
2. Без больших планов
3. Если ошибка — сразу фиксируем
4. Каждый шаг минимальный
5. Архитектура должна быть расширяемой

---

# Главная цель проекта

Добавил модель в Prisma:

```
model SparePart {
  id Int @id
  name String
}
```

Запустил генератор:

```
npm run generate
```

Получил:

```
backend API
admin UI
```

---

# Будущие шаги

Следующий этап развития:

### Backend

* генерация Response DTO
* генерация relation DTO
* генерация pagination
* генерация filters

### Frontend

* генерация React Admin resources
* автоматические формы
* автоматические таблицы

---

# Итог

Проект создаёт **универсальную систему генерации админ-панелей**.

Цель:

**1 модель в Prisma → полный backend + frontend CRUD.**

Это значительно ускоряет разработку внутренних систем, таких как:

* ERP
* CRM
* CMMS
* системы ТОиР
