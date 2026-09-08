# ShopSphere Defect Report (UI Automation & Exploratory Testing)

**Project**: ShopSphere MERN E-Commerce Platform  
**Target Environment**: Production Vercel Deployment (`https://shop-sphere-mern-ecommerce.vercel.app`)  
**Backend API**: Production Render Server (`https://shopsphere-mern-ecommerce.onrender.com`)  
**QA Assessment Date**: September 2026  
**Test Suite Coverage**: UI Automation (Playwright E2E — 38 Test Cases across 8 Modules) & Exploratory Testing  
**Status**: Completed  

---

## 1. Executive Summary

During the comprehensive end-to-end (E2E) UI automation and exploratory testing phase executed against the live ShopSphere deployment, **4 frontend/UI defects** were identified, categorized, and documented. Combined with the previously identified **8 backend API defects** (`BUG-SHOP-001` to `BUG-SHOP-008`), the cumulative defect count stands at **12 defects**.

### Cumulative Defect Severity Distribution

| Severity | API Testing (`BUG-SHOP-*`) | UI Testing (`BUG-UI-*`) | Total | Percentage |
| :--- | :---: | :---: | :---: | :---: |
| **Critical** | 2 | 0 | **2** | 16.7% |
| **High** | 4 | 1 | **5** | 41.7% |
| **Medium** | 2 | 1 | **3** | 25.0% |
| **Low** | 0 | 2 | **2** | 16.7% |
| **Total** | **8** | **4** | **12** | **100%** |

---

## 2. Detailed UI Defect Reports

---

### Defect ID: BUG-UI-001

| Field | Details |
| :--- | :--- |
| **Title** | Race condition in Catalog Search causes search results to be overwritten by full catalog fetch |
| **Module** | Catalog / Search (`Products.jsx`) |
| **Severity** | **High** |
| **Priority** | **High** |
| **Environment** | Production Web Client (`https://shop-sphere-mern-ecommerce.vercel.app`) |
| **Component** | `client/src/pages/Products.jsx` |
| **Status** | **Confirmed** |

#### Description
When a user navigates to `/products` and quickly inputs a search query and clicks "Search" (or navigates directly to `/products?search=<term>`), two asynchronous network requests are initiated:
1. An initial catalog fetch: `GET /api/products` (retrieving all 14 catalog items).
2. A search query fetch: `GET /api/products/search?query=<term>` (retrieving filtered results, e.g., 1 item).

Because `Products.jsx` does not utilize an `AbortController` or sequential request timestamping, the initial full-catalog request—which involves a larger database payload—often resolves *after* the search query request. When the initial fetch promise resolves last, its `setProducts(response.data.products)` callback overwrites the filtered search results. Consequently, the user is presented with all 14 catalog products, even though the page heading states:
`Showing results for "Nike" (14 items)`

#### Steps to Reproduce
1. Open a browser and navigate to `https://shop-sphere-mern-ecommerce.vercel.app/products`.
2. Immediately type `Nike` in the search box and click the **Search** button before the initial 14-product catalog load completes.
3. Observe the product grid and search summary banner.

#### Test Data
* Search Keyword: `Nike`
* Route: `/products?search=Nike`

#### Expected Result
* Only matching products (1 item: `Nike Air Max Running Shoes`) should be rendered in the grid.
* The header counter should display: `Showing results for "Nike" (1 items)`.

#### Actual Result
* The initial full catalog request resolves last, executing `setProducts()` with all 14 items.
* All 14 unrelated products (laptops, cameras, smart watches, etc.) are rendered in the grid beneath the heading `Showing results for "Nike" (14 items)`.

#### Root Cause Analysis
In `client/src/pages/Products.jsx` lines 28–54:
```javascript
const loadCatalog = async () => {
  try {
    setLoading(true);
    let response;
    if (searchParam) {
      setSearch(searchParam);
      response = await api.get(`/products/search?query=${encodeURIComponent(searchParam)}`);
    } else {
      response = await api.get("/products");
    }
    setProducts(response.data.products); // <-- Unchecked asynchronous setter
  } catch (err) { ... }
};
```
When `searchParam` changes quickly or components remount, previous in-flight Axios requests are not aborted, leading to race conditions.

#### Suggested Developer Fix
Incorporate an `AbortController` inside the `useEffect` hook in `Products.jsx`:
```javascript
useEffect(() => {
  const controller = new AbortController();
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = searchParam
        ? `/products/search?query=${encodeURIComponent(searchParam)}`
        : "/products";
      const response = await api.get(url, { signal: controller.signal });
      setProducts(response.data.products);
    } catch (err) {
      if (!api.isCancel(err)) setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
  return () => controller.abort();
}, [searchParam]);
```

---

### Defect ID: BUG-UI-002

| Field | Details |
| :--- | :--- |
| **Title** | Forgot Password with valid registered email remains stuck on "REQUESTING..." and does not display verification-code/reset-password form |
| **Module** | Authentication / Account Recovery (`ForgotPassword.jsx`) |
| **Severity** | **High** |
| **Priority** | **High** |
| **Environment** | Production Web Client (`https://shop-sphere-mern-ecommerce.vercel.app`) |
| **Component** | `client/src/pages/ForgotPassword.jsx` & `server/controllers/authController.js` |
| **Status** | **Confirmed** |

#### Description
When a user attempts to recover their account by entering a valid, registered email address on `/forgot-password` and clicking **Send Verification Code**, the UI button transitions into a disabled state displaying `"REQUESTING..."` and remains permanently stuck. The application never transitions to the verification code input screen or displays the reset password form.

#### Workflow Comparison

**Expected:**
```text
Enter registered email
        ↓
Send Verification Code
        ↓
Verification code screen appears
```

**Actual:**
```text
Enter registered email
        ↓
Send Verification Code
        ↓
REQUESTING...  ← stuck (never displays verification-code/reset-password screen)
```

#### Steps to Reproduce
1. Navigate to `https://shop-sphere-mern-ecommerce.vercel.app/forgot-password`.
2. Enter a valid registered email address (e.g., `playwrightTest@gmail.com`).
3. Click the **Send Verification Code** button.
4. Observe the button state and screen progression.

#### Expected Result
1. The `POST /api/auth/forgot-password` request resolves successfully.
2. The UI advances to the next step, rendering the OTP / verification code input fields along with the new password entry form and the **Reset Password** action button.

#### Actual Result
1. The submit button enters a disabled state displaying `"REQUESTING..."`.
2. The UI hangs indefinitely in this state without advancing to the verification-code screen.
3. The user remains locked out of the password recovery workflow.

#### Observed Live Diagnostic Output
```text
URL: https://shop-sphere-mern-ecommerce.vercel.app/forgot-password
PAGE TEXT:
Reset Password
Enter your email to receive a recovery verification code.
EMAIL ADDRESS
REQUESTING...
Remember your password? Login
```

#### Root Cause Analysis
1. **Frontend (`client/src/pages/ForgotPassword.jsx`):**
   The component executes `api.post("/auth/forgot-password", { email })` without a client-side request timeout or abort controller. When `setLoading(true)` is invoked, the button label changes to `"REQUESTING..."`. Because Axios has no default timeout configured in `api.js`, the UI awaits response resolution indefinitely.
2. **Backend (`server/controllers/authController.js`):**
   In `sendOTPMail()`, `nodemailer` attempts an outbound SMTP handshake over port 587. In the Render hosting environment, outbound port 587 is blocked. The connection hangs until a 120-second TCP socket timeout elapses, returning `500 Internal Server Error: Failed to send reset email`.

#### Suggested Developer Fix
1. **Frontend:** Add an explicit request timeout (e.g., 10 seconds) with graceful error fallback in `ForgotPassword.jsx`:
   ```javascript
   const response = await api.post("/auth/forgot-password", { email }, { timeout: 10000 });
   ```
2. **Backend:** Switch from SMTP port 587 to an API-based email provider (e.g., SendGrid, Resend, or AWS SES REST API) or configure SSL port 465 to avoid outbound socket blocking on cloud hosting platforms.


---

### Defect ID: BUG-UI-003

| Field | Details |
| :--- | :--- |
| **Title** | Product card image container is non-clickable and fails to navigate to Product Details |
| **Module** | Products / UI Navigation (`ProductCard.jsx`) |
| **Severity** | **Low** |
| **Priority** | **Medium** |
| **Environment** | Production Web Client (`https://shop-sphere-mern-ecommerce.vercel.app`) |
| **Component** | `client/src/components/ProductCard.jsx` |
| **Status** | **Confirmed** |

#### Description
In `ProductCard.jsx`, the primary product visual thumbnail is encapsulated within an inert `<div>` container without an `onClick` listener or React Router `<Link>` wrapper. Only the textual product title (`<h3>`) below the image is wrapped in a `<Link to={'/products/' + product._id}>`. As a result, when users click on the product thumbnail—which is the standard e-commerce interaction pattern—no navigation occurs.

#### Steps to Reproduce
1. Navigate to the Home page (`/`) or Catalog page (`/products`).
2. Click directly on any product thumbnail image (e.g., Nike Air Max Shoes).
3. Observe browser behavior.

#### Expected Result
Clicking the product image should navigate the user to `/products/:id` (Product Details page).

#### Actual Result
The image is unclickable; cursor pointer is absent, and clicking the image produces no navigation or feedback.

#### Root Cause Analysis
In `client/src/components/ProductCard.jsx` lines 64–74:
```jsx
{/* Image Container */}
<div className="relative mb-4 flex h-52 items-center justify-center overflow-hidden rounded-xl bg-gray-50/50 border border-gray-100 p-4">
  {product.images?.length > 0 ? (
    <img
      src={product.images[0]}
      alt={product.name}
      className="h-full w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-105"
    />
  ) : (
    <span className="text-gray-400 text-sm font-medium">No Image</span>
  )}
...
```
The image container is not wrapped in `<Link to={`/products/${product._id}`}>`.

#### Suggested Developer Fix
Wrap the image element in a React Router `<Link>`:
```jsx
<Link to={`/products/${product._id}`} className="block h-full w-full">
  <img
    src={product.images[0]}
    alt={product.name}
    className="h-full w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-105 cursor-pointer"
  />
</Link>
```

---

### Defect ID: BUG-UI-004

| Field | Details |
| :--- | :--- |
| **Title** | Applied coupon discount remains active and visual state diverges when coupon input is modified |
| **Module** | Checkout / Coupons (`Checkout.jsx`) |
| **Severity** | **Low** |
| **Priority** | **Low** |
| **Environment** | Production Web Client (`https://shop-sphere-mern-ecommerce.vercel.app`) |
| **Component** | `client/src/pages/Checkout.jsx` |
| **Status** | **Confirmed** |

#### Description
In `Checkout.jsx`, after a user applies a valid coupon (e.g., `WELCOME10`), a discount is computed and a green badge displays `"Applied: WELCOME10"`. If the user subsequently clears the coupon text input or types a different string into the input box without clicking "Apply", the previous coupon discount remains fully applied and the green badge remains visible. This creates visual ambiguity regarding whether the text in the input box or the previously applied badge will be submitted upon order confirmation.

#### Steps to Reproduce
1. Add an item to the cart and proceed to Checkout (`/checkout`).
2. Complete Step 1 (Address) and continue to the Coupon section.
3. Enter `WELCOME10` and click **Apply**. Notice the discount deduction.
4. Click into the coupon text input, backspace the text, and type `SAVE50` without clicking Apply.
5. Review the Order Summary.

#### Expected Result
Editing the coupon input should either display an `"Unapplied changes"` indicator or maintain clear separation showing the active discount vs. pending input.

#### Actual Result
The UI simultaneously shows an unapplied code in the input box while displaying an active badge and discount calculation for the previous code.

#### Root Cause Analysis
In `client/src/pages/Checkout.jsx` lines 37–43, the input field state (`couponCode`) and the validated coupon state (`appliedCoupon`) are kept separate, but there is no visual indicator alerting users that the value in the text input has not been applied.

#### Suggested Developer Fix
Add a visual note or disable the "Apply" button when the input matches the currently applied coupon, or clear `appliedCoupon` if the user erases the field:
```javascript
{appliedCoupon && couponCode !== appliedCoupon.code && (
  <span className="text-[10px] text-amber-600 font-semibold block mt-1">
    Click Apply to switch to code: {couponCode}
  </span>
)}
```

---

## 3. Comprehensive Defect Traceability Matrix (All 12 Defects)

| Defect ID | Layer | Module | Title | Severity | Priority | Status |
| :--- | :---: | :--- | :--- | :---: | :---: | :---: |
| **BUG-SHOP-001** | API | Authentication | Login response time exceeds defined performance threshold (2636 ms vs 2000 ms) | Medium | Medium | Confirmed |
| **BUG-SHOP-002** | API | Products | Product creation returns HTTP 500 for invalid input instead of validation error | High | High | Confirmed |
| **BUG-SHOP-003** | API | Products | Product update returns HTTP 500 for invalid price instead of HTTP 400 | High | High | Confirmed |
| **BUG-SHOP-004** | API | Wishlist | Get Wishlist does not contain the previously selected product | Medium | Medium | Investigating |
| **BUG-SHOP-005** | API | Orders | Order API accepts invalid quantity and creates the order | Critical | High | Confirmed |
| **BUG-SHOP-006** | API | Orders | Order API accepts negative quantity and creates the order | Critical | High | Confirmed |
| **BUG-SHOP-007** | API | Orders | Missing shipping address causes HTTP 500 instead of validation error | High | High | Confirmed |
| **BUG-SHOP-008** | API | Reviews | Duplicate product review is accepted instead of being rejected | High | High | Confirmed |
| **BUG-UI-001** | UI | Catalog / Search | Race condition causes search results to be overwritten by full catalog fetch | High | High | Confirmed |
| **BUG-UI-002** | UI | Authentication | Forgot Password verification code request hangs in loading state on latency | Medium | Medium | Confirmed |
| **BUG-UI-003** | UI | Products / Nav | Product card image container is non-clickable and fails to navigate | Low | Medium | Confirmed |
| **BUG-UI-004** | UI | Checkout / Coupons | Applied coupon remains active when coupon input field is altered | Low | Low | Confirmed |

---

## 4. Test Automation Execution Summary

* **API Testing (Newman)**:
  * Total Executed: 44 Requests
  * Passed: 36
  * Failed / Defects Uncovered: 8 (`BUG-SHOP-001` through `BUG-SHOP-008`)
  * Detailed Report: `QA/postman/Reports/ShopSphere-QA-Report.html`

* **UI Automation Testing (Playwright)**:
  * Total Test Cases: 38
  * Passed: 38 (100% Pass Rate)
  * Failed: 0
  * Skipped: 0
  * Average Execution Time: ~31 seconds across 4 workers
  * Detailed Report: `QA/playwright/playwright-report/index.html`

* **Defect Log Spreadsheet**:
  * File Location: `QA/defects/ShopSphere_Bug_Report.xlsx`
  * Sheet: `Defect Log` (Contains all 12 defects with full QA attributes, steps, preconditions, expected/actual results, and impact)
