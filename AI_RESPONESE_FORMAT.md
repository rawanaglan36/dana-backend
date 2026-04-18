# 📦 Response Format Rules (STRICT)

## 🎯 Standard Response

ALL responses MUST follow:

```ts
return {
  response: new responseDto(status, message, data, pagination?)
};
```

---

## 🧾 responseDto Structure

```ts
class responseDto<T> {
  status: number;
  message: string;
  data?: T;
  pagination?: any;

  constructor(status: number, message: string, data?: T, pagination?: any) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.pagination = pagination;
  }
}
```

---

## ✅ Success Example

```ts
return {
  response: new responseDto(200, 'success', data),
};
```

---

## ❌ Error Handling

Use NestJS exceptions:

* `BadRequestException`
* `NotFoundException`

---

## ⚠️ Try-Catch Rules

* Use try-catch when needed
* Validate inputs before operations
* Throw correct exception based on case

---

## 📊 Pagination (Optional)

```ts
return {
  response: new responseDto(200, 'success', data, pagination),
};
```

---

## 🚫 Forbidden

* Do NOT return raw data
* Do NOT change response structure
* Do NOT create custom formats

---

## 🧠 Message Rules

Use simple messages:

* "success"
* "created successfully"
* "invalid input"

---

## ⚠️ Consistency Rule

ALL endpoints MUST return the SAME structure

NO EXCEPTIONS

---

## ❗ When unsure

* Follow existing implementation
* Do NOT invent new format
