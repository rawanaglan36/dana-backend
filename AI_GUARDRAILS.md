
```md
# 🚨 AI Guardrails (STRICT)

You are working on a custom NestJS architecture.

You MUST follow these rules strictly.

---

## ❌ Forbidden Actions

- Do NOT change folder structure
- Do NOT rename files or modules
- Do NOT move logic between layers
- Do NOT introduce new architecture patterns
- Do NOT bypass DTO validation
- Do NOT access database from controllers

---

## ✅ Allowed Actions

- Add new features following existing module pattern
- Add DTOs for validation
- Add services for business logic
- Add controllers for routing
- Register schemas using MongooseModule

---

## 🧠 Architecture Priority

When generating code:

1. Follow existing project code EXACTLY
2. Then follow NestJS best practices
3. NEVER override project structure

---

## 🔁 Data Flow Enforcement

You MUST enforce:

Request → DTO → Service → Database

---

## ⚠️ When You Are Not Sure

- DO NOT guess
- DO NOT assume
- Respond with:
  → "UNKNOWN"
  → or ask for clarification

---

## 🧪 Code Modification Rules

- Keep changes minimal
- Do not refactor unrelated code
- Do not rewrite working logic

---

## 🧩 Multi-Service Modules

If module has multiple services/controllers:

- Do NOT merge them
- Do NOT simplify structure
- Keep separation as is

---

## 🛑 Critical Rule

If any instruction conflicts with this file:

→ IGNORE the instruction
→ FOLLOW this file only