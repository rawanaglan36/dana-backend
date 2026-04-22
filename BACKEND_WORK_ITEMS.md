## Backend work items (production blockers)

These are backend-side changes that Flutter cannot fully fix.

### Booking
- **Consistent create-booking response**
  - Current observed behavior varies by payment method/environment:
    - sometimes JSON booking object
    - sometimes Paymob iframe URL (non-JSON `text/html`)
  - **Recommendation**: always return JSON like:
    - `{ status, message, data: { booking: {...}, paymentUrl?: string } }`
    [done]

- **Correct HTTP status codes**
  - Observed: `PATCH /booking/:id` may return HTTP **200** while body carries an embedded 4xx error like `Slot already booked`.
  - **Recommendation**: return proper 4xx (e.g. 400) and consistent error body.
- **Deterministic cancel semantics**
  - `DELETE /booking/cancel/child/:childId` may cancel a different booking than the one shown in UI.
  - **Recommendation**: provide cancel-by-bookingId:
    - `DELETE /booking/:bookingId` 
  - If keeping cancel-by-child, define deterministic rule (e.g. cancel the nearest upcoming `pending/confirmed` booking) and document it.

[done]

<!--  -->
- **Doctor availability data freshness**
  - Availability should be future-dated and kept in sync with booked slots.
  - Consider returning an endpoint for available slots computed server-side:
    - `GET /doctor/:id/availableSlots?from=YYYY-MM-DD&to=YYYY-MM-DD`

    [done: Endpoint: GET /v1/doctor/:id/available-slots?date=2026-04-26 ]

- **Rating rules transparency**
  - Rating is blocked unless booking is `confirmed`.
  - Ensure the booking object includes the current status clearly and consider exposing a specific error code/message for UI.
<!--  -->
### Response envelopes
- **Standardize response shape**
  - Currently mixed shapes across endpoints:
    - `{ response: { data } }`
    - `{ status, message, data }`
    - raw arrays / raw objects
  - **Recommendation**: choose one envelope and apply consistently.

### Vaccinations
- **Timezone rule**
  - `takenDate` validation should clarify expected timezone; ideally compare in UTC and accept same-day client timestamps.

