# Test Scenarios

## Smoke (P0)
- CAT-001 Product catalog loads with visible products
- AUTH-001 Registered customer can login
- CHK-005 Demo payment method is visible on payment step

## E2E (P0)
- CHK-006 Registered customer can complete payment with Demo provider
- CHK-007 Payment success page shows amount and reference
- ACC-002 Completed order appears in Your Orders
- ACC-003 Customer can view and download invoice

## Functional (P1)
- CART-001 Cart displays selected product correctly
- CART-002 Cart quantity update recalculates total
- CART-003 Product can be removed from cart
- CAT-003 Product search returns matching results
- CHK-002 Delivery address can be selected
- PRD-005 Product can be added to cart from product detail page

## Negative (P1)
- AUTH-003 Invalid password shows login error
- AUTH-002 New customer can register
- CHK-004 Unauthenticated user is redirected to login
