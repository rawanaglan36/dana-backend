# 🔐 Authentication & Authorization Rules

## 🛡️ Authentication System

Authentication is handled using:

* `AuthGuard`

Example:

```ts
@UseGuards(AuthGuard)
```

---

## 🔒 Protected Routes

Use `AuthGuard` for:

* Create operations
* Update operations
* Delete operations
* Any sensitive data access

---

## 🚫 Forbidden

* Do NOT expose protected routes without AuthGuard
* Do NOT bypass authentication

---

## 👥 Roles System

Roles exist but are NOT strictly enforced.

Example:

```ts
@Roles(['parent', 'admin', 'doctor'])
```

---

## ⚠️ Roles Rules

* Roles are optional
* Do NOT depend heavily on roles
* Do NOT implement complex permission systems

---

## 🧠 Auth Flow

1. Request received
2. AuthGuard validates user
3. If valid → continue
4. Service handles logic

---

## ⚠️ When unsure

* If endpoint modifies data → use AuthGuard
* Otherwise → ask or return "UNKNOWN"

