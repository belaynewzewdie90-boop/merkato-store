# Merkato Store

E-commerce app using [Platzi FakeAPI](https://fakeapi.platzi.com) as the backend.

## How to upload products to the API

### 1. Check valid category IDs

```powershell
Invoke-RestMethod https://api.escuelajs.co/api/v1/categories
```

| ID | Name          |
|----|---------------|
| 1  | Clothes       |
| 2  | Electronics   |
| 3  | Furniture     |
| 4  | Shoes         |
| 5  | Miscellaneous |

### 2. Upload all products from info.json

Run this PowerShell script from the project root:

```powershell
$products = Get-Content -Raw -LiteralPath "info.json" | ConvertFrom-Json
foreach ($p in $products) {
  $body = $p | ConvertTo-Json
  try {
    $result = Invoke-RestMethod -Uri "https://api.escuelajs.co/api/v1/products" `
      -Method Post -ContentType "application/json" -Body $body
    Write-Host "OK: $($result.id) - $($result.title)"
  } catch {
    Write-Host "FAIL: $($p.title) - $($_.Exception.Message)"
  }
}
```

### 3. Upload a single product

```powershell
$body = @{
  title       = "My Product"
  price       = 99
  description = "Some description"
  categoryId  = 1
  images      = @("https://placehold.co/600x400")
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.escuelajs.co/api/v1/products" `
  -Method Post -ContentType "application/json" -Body $body
```

### Product schema (POST body)

| Field         | Type     | Required | Notes                        |
|---------------|----------|----------|------------------------------|
| `title`       | string   | yes      | Product name                 |
| `price`       | number   | yes      | Numeric price                |
| `description` | string   | yes      | Description text             |
| `categoryId`  | number   | yes      | Must be 1–5 (see step 1)     |
| `images`      | string[] | yes      | Array of valid image URLs    |

### 4. Interact with products

| Action      | Method   | Endpoint                              |
|-------------|----------|---------------------------------------|
| List all    | `GET`    | `/api/v1/products`                    |
| Get one     | `GET`    | `/api/v1/products/{id}`               |
| Create      | `POST`   | `/api/v1/products`                    |
| Update      | `PUT`    | `/api/v1/products/{id}`               |
| Delete      | `DELETE` | `/api/v1/products/{id}`               |
| Paginate    | `GET`    | `/api/v1/products?offset=0&limit=10`  |
| Filter      | `GET`    | `/api/v1/products?price_min=100&price_max=500&categoryId=1` |

Example: view products in your browser

```
https://api.escuelajs.co/api/v1/products?offset=0&limit=5
```

### 5. Known issue: slug collisions

The FakeAPI is shared. If another user already created a product with the same title, you get:

```
SQLITE_CONSTRAINT_UNIQUE — UNIQUE constraint failed: product.slug
```

Just use a more specific title (e.g. `"Merkato Organic Coffee"` instead of `"Organic Coffee"`).  
The titles in `info.json` already include the `Merkato` prefix to avoid this.

### 6. Run the app locally

```powershell
npm install
npm run dev
```

The admin panel at `/admin` is wired to `AdminContext` (localStorage), **not** the Platzi API.  
To sync with the live API, use the functions in `src/api/platziApi.js` or the curl/PowerShell commands above.
