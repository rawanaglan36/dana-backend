# 📡 API Rules (STRICT)

## 📌 Project Overview
This is a NestJS backend project using MongoDB with Mongoose.

The project follows a structured modular architecture with strict rules for validation, data access, and feature organization.


## 🌐 Base URL Structure

All endpoints MUST be versioned:

* `/v1/...`

Examples:

* `/v1/videos`
* `/v1/child`
* `/v1/child/:id/growth`

---

## 🎯 Controller Responsibilities

Controllers MUST:

* Handle routing only
* Extract data using:

  * `@Body()`
  * `@Param()`
  * `@Query()`
* Call the service directly

Controllers MUST NOT:

* Contain business logic
* Access database directly
* Skip DTO validation

---

## 🧾 DTO Rules

* Every request body MUST use a DTO
* Validation is REQUIRED using `class-validator`
* No raw input is allowed

Naming:

* `createXDto`
* `updateXDto`
* Additional DTOs allowed as needed

---

## 🔁 Standard CRUD Pattern

* GET    `/resource`        → findAll
* GET    `/resource/:id`    → findOne
* POST   `/resource`        → create
* PATCH  `/resource/:id`    → update
* DELETE `/resource/:id`    → remove

---

## 🔍 Query & Search

* Use `@Query()` in controller
* Implement logic inside service

Allowed:

* MongoDB queries
* Regex search
* Text index (if exists)

---

## ⚠️ Validation Rules

* Validate IDs inside service
* Example: ObjectId validation
* Throw exception if invalid

---

## 📦 Multi-Controller Modules

If module contains multiple controllers:

* Each controller handles a specific responsibility
* DO NOT merge controllers
* Keep structure as-is

---

## 🔗 Service Communication

* Controller → Service only
* Service can call other services if needed
* Avoid circular dependencies

---



## 🗄️ Database (Mongoose)

### Schemas Location
All schemas are inside:
schemas/

### Registering Models
Models are registered inside modules using:

MongooseModule.forFeature([
  { name: ModelName.name, schema: ModelSchema }
])

### Injecting Models in Service

@InjectModel(ModelName.name)

---

## 🚫 Forbidden

* No business logic in controller
* No DB access in controller
* No skipping DTO validation
* No changing route structure

---

## ⚠️ When unsure

* DO NOT guess
* Return "UNKNOWN"


## 📦 Module Rules

Inside each module:

- import schemas using MongooseModule
- define controllers
- define services (providers)

Example:

@Module({
  imports: [MongooseModule.forFeature([...])],
  controllers: [...],
  providers: [...],
})

---

## 🔗 AppModule Registration

Every module MUST be imported in AppModule:

@Module({
  imports: [VideosModule],
})

---

## 🎯 Controller Rules

Controllers are responsible ONLY for:
- routing
- receiving params (Body, Query, Param)

Controllers MUST NOT:
- contain business logic
- access database

---

## ⚙️ Service Rules

- All logic happens inside services
- Services interact with database using Mongoose
- Validate IDs (e.g. ObjectId)
- Throw exceptions when needed

---

## 🧾 DTO Rules

- Every request must use DTO
- Validation is done using class-validator
- DTO is mandatory

---

## 🧩 Multi-Controller Modules

Some modules contain multiple controllers and services.

Example:
ChildModule contains:
- ChildController
- ChildGrowthController
- VaccinationsController

Each controller handles a specific responsibility.

---


## 🔍 Query Rules

- Queries are handled in services
- Use regex or DB indexing when needed

---

## ⚠️ Important Notes

- Follow existing patterns EXACTLY
- Do NOT assume missing logic
- If something is unclear → write "UNKNOWN"