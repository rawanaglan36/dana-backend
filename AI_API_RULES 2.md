
# 📡 API Rules (STRICT)

## 📌 Project Overview

This is a NestJS backend project using MongoDB with Mongoose.

The project follows a strict modular architecture with clear separation between Controller, Service, DTO, and Database layers.

---

## 🌐 Base URL Structure

All endpoints MUST be versioned:

* `/v1/...`

Examples:

* `/v1/videos`
* `/v1/child`
* `/v1/child/:id/growth`

---

## 🏗️ Architecture Rules

### 🎯 Controller Rules

Controllers are responsible ONLY for:

* Routing
* Receiving input (`@Body()`, `@Param()`, `@Query()`)
* Calling services

Controllers MUST NOT:

* Contain business logic
* Access the database
* Skip DTO validation

---

### ⚙️ Service Rules

Services are responsible for ALL business logic:

* Handle application logic
* Communicate with database (Mongoose)
* Validate IDs (e.g. ObjectId)
* Throw exceptions when needed
* Can call other services if required

---

### 🧾 DTO Rules

* Every request MUST use a DTO
* Validation is REQUIRED using `class-validator`
* No raw request input is allowed

Naming convention:

* `createXDto`
* `updateXDto`
* Additional DTOs allowed when needed

---

## 🔁 Standard CRUD Pattern

* GET    `/resource`        → findAll
* GET    `/resource/:id`    → findOne
* POST   `/resource`        → create
* PATCH  `/resource/:id`    → update
* DELETE `/resource/:id`    → remove

---

## 🔍 Query & Search Rules

* All query logic MUST be handled in services
* Controllers only pass `@Query()` values
* Allowed techniques:

  * MongoDB queries
  * Regex search
  * Text index (if available)

---

## 🗄️ Database (Mongoose)

### 📁 Schema Location

All schemas MUST be inside:

```
schemas/
```

### 📦 Model Registration

```ts
MongooseModule.forFeature([
  { name: ModelName.name, schema: ModelSchema }
])
```

### 🔌 Injecting Models

```ts
@InjectModel(ModelName.name)
```

---

## 🧩 Module Rules

Each module MUST:

* Import schemas via `MongooseModule.forFeature`
* Declare controllers
* Declare services (providers)

Example:

```ts
@Module({
  imports: [MongooseModule.forFeature([...])],
  controllers: [...],
  providers: [...],
})
```

---

## 🧩 Multi-Controller Modules

Some modules may contain multiple controllers/services.

Example:

* `ChildController`
* `ChildGrowthController`
* `VaccinationsController`

Rules:

* Each controller has a single responsibility
* DO NOT merge controllers
* Keep separation clean

---

## 🔗 AppModule Registration

Every module MUST be registered:

```ts
@Module({
  imports: [VideosModule],
})
```

---

## ⚠️ Validation Rules

* Validate IDs inside services (e.g. ObjectId)
* Throw exceptions if invalid
* Never trust raw input

---

## 🚫 Forbidden Rules

* No business logic in controllers
* No database access in controllers
* No skipping DTO validation
* No modifying API structure without reason

---

## ⚠️ When Unsure

If something is unclear:

```
UNKNOWN
```

DO NOT guess behavior.

---

## 🎯 Core Principle

> Controllers = routing only
> Services = logic only
> DTOs = validation only
> Database = services only

---