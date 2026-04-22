## Backend Fix Specs (Dana Mobile)

This document captures **backend-ready** fixes discovered during terminal-only E2E smoke tests against:

- **Base URL**: `http://3.64.255.173:3000/api`
- **Auth flow**: `pre-signIn` → OTP → `verify-signIn` → Bearer JWT

It focuses on 3 backend issues that block or degrade the mobile UX:

1) **Skills API returns empty** → skills UI cannot function beyond empty state.\n+2) **Booking rating fails with 400** → rating bottom sheet submits but fails.\n+3) **Sensory test submit fails with 400** → examination results cannot be shown.

---

## 1) Skills are empty (`GET /v1/skills -> []`)

### Observed behavior
- Endpoint returns `200` with an empty JSON array.
- Result: mobile skills UI shows empty/placeholder, and progress cannot be computed.

### Mobile expectations (contract)
Mobile already supports these endpoints (see Flutter wiring):
- `GET /v1/skills` → list skills with `_id`, `name`, `itemCount`
- `GET /v1/skills/:skillId/child/:childId/checklist` → list checklist items with `id|_id`, `title`, `checked`
- `POST /v1/skills/toggle/child/:childId` → body `{ itemId, checked }`

### Proposed backend fix
Provide **seed data** (migration/seed script) so `/v1/skills` is non-empty in all envs used by mobile.

Minimum dataset:
- At least 4 skills (motor/speech/cognition/social) OR whatever you want to expose.
- Each skill should have at least 1 checklist item so completion % can be computed.

### Acceptance criteria
- `GET /v1/skills` returns a non-empty array.
- For an existing childId, checklist endpoint returns a non-empty list for each skill.
- Toggle endpoint persists and returns updated checklist state on re-fetch.

### Example response shapes
`GET /v1/skills` (either raw list or enveloped list is ok; mobile supports both):

```json
[
  { "_id": "skill1", "name": "Motor", "itemCount": 12 },
  { "_id": "skill2", "name": "Speech", "itemCount": 9 }
]
```

or:

```json
{ "response": { "data": [ { "_id": "skill1", "name": "Motor", "itemCount": 12 } ] } }
```

---

## 2) Booking rating fails (`POST /v1/booking/:bookingId/rate -> 400`)

### Observed behavior
- `GET /v1/booking/myAppointment/:parentId` returns bookings successfully.
- `GET /v1/booking/:bookingId` works.
- `POST /v1/booking/:bookingId/rate` returns **400 Bad Request** for at least one booking.

### Problem
Mobile needs one of:
- Rating allowed for the booking (based on status), or
- A **clear and stable** error response to explain why it’s blocked.

Currently the backend 400 response body was not reliably surfaced in client logs.

### Proposed backend fix
1) Document and enforce rating eligibility rules:
   - Which booking statuses are allowed? (`completed` only? `confirmed`? etc.)
2) Return a consistent 4xx with a machine-readable code + human message.

Recommended error shape:

```json
{
  "statusCode": 400,
  "error": "RATING_NOT_ALLOWED",
  "message": "Rating is allowed only after the visit is completed."
}
```

### Acceptance criteria
- For an eligible booking: rating returns `200` or `201`.
- For an ineligible booking: backend returns `400` (or `409`) with stable `{error,message}` fields.

---

## 3) Sensory test submit fails (`POST /v1/sensory-test/:childId -> 400`)

### Observed behavior
- `GET /v1/sensory-test/` returns questions successfully (mobile saw 49 questions).
- `POST /v1/sensory-test/:childId` returns **400 Bad Request**.

### Current mobile request contract (Flutter)
Mobile submits answers as:

```json
{
  "answers": [
    { "questionId": "QUESTION_ID", "selectedValue": 1 },
    { "questionId": "QUESTION_ID", "selectedValue": 2 }
  ]
}
```

Where `selectedValue` is **1/2/3**.

### Proposed backend fix
Align backend validation with the above payload, or publish the expected payload shape so mobile can match it.

Also recommend standardizing response envelope (one of):

Raw object:
```json
{ "totalScore": 47, "level": "medium", "categoryScores": { "seeking": 10 } }
```

Or enveloped:
```json
{ "response": { "data": { "totalScore": 47, "level": "medium", "categoryScores": { "seeking": 10 } } } }
```

### Acceptance criteria
- Posting answers with valid questionIds and values returns `200`.
- Response includes: `totalScore`, `level` (`low|medium|high`), `categoryScores`.
- Invalid payload returns a 4xx with clear message about missing/invalid fields.

---

## Repro curl snippets (replace TOKEN/IDS)

```bash
# 1) pre-signIn
curl -s -X POST 'http://3.64.255.173:3000/api/v1/parent/pre-signIn' \
  -H 'Content-Type: application/json' \
  -d '{"phone":"01024299309","password":"123456"}'

# 2) verify-signIn
curl -s -X POST 'http://3.64.255.173:3000/api/v1/parent/verify-signIn' \
  -H 'Content-Type: application/json' \
  -d '{"phone":"01024299309","otp":123456}'

# 3) skills
curl -s 'http://3.64.255.173:3000/api/v1/skills' \
  -H "Authorization: Bearer TOKEN"

# 4) rate booking
curl -s -X POST 'http://3.64.255.173:3000/api/v1/booking/BOOKING_ID/rate' \
  -H "Authorization: Bearer TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"rating":5}'

# 5) sensory submit
curl -s -X POST 'http://3.64.255.173:3000/api/v1/sensory-test/CHILD_ID' \
  -H "Authorization: Bearer TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"answers":[{"questionId":"QUESTION_ID","selectedValue":1}]}'
```

