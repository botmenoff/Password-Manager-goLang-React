# Valoración de que framework de Go usar
## 🔹 1) **Standard Library (`net/http`)**

- **Pros**:
    - No dependencias externas.
    - Muy ligera y estable.
    - Excelente para aprender Go “de verdad” y entender cómo funciona HTTP.
- **Contras**:
    - Código más verboso para rutas, middleware y JSON.
    - Menos “features” listas para usar.
- **Ideal para**: microservicios muy simples, APIs minimalistas, aprender Go.
``` Go
http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("Hola mundo"))
})
http.ListenAndServe(":8080", nil)
```

---
## 🔹 2) **Chi**
- Ligero, enfocado en **middlewares composables**.
- Soporta rutas anidadas y patrones muy Go-style.
- Compatible con `net/http`.
- **Ideal para**: APIs REST, microservicios, aplicaciones que quieren algo más estructurado que la Standard Library.
```Go
r := chi.NewRouter()
r.Get("/hello", func(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("Hola mundo"))
})
http.ListenAndServe(":8080", r)
```

---
## 🔹 3) **Gin** SELECCIONADO
- Muy popular y **rápido**.
- Sintaxis sencilla y muchas utilidades listas: JSON, validación, middleware, logging.
- Usa **recovery automático** (evita que un panic caiga todo el servidor).
- **Ideal para**: APIs REST completas, microservicios medianos/grandes.
```Go
r := gin.Default()
r.GET("/hello", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "Hola mundo"})
})
r.Run(":8080")
```

---
## 🔹 4) **Fiber**
- Inspirado en Express.js (Node.js).
- Muy rápido y fácil de usar si vienes de Node.
- **Ideal para**: desarrolladores de Node que quieren un Go “express-like”.
```Go
app := fiber.New()
app.Get("/hello", func(c *fiber.Ctx) error {
    return c.SendString("Hola mundo")
})
app.Listen(":8080")
```

---

## 🔹 5) **Gorilla**
- Muy estable y modular.
- Buena para proyectos grandes que requieren muchas herramientas.
- Menos “moderno” que Gin o Fiber, pero muy fiable.
- **Ideal para**: APIs que necesitan control fino sobre middleware, sesiones, websockets.
```Go
r := mux.NewRouter()
r.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("Hola mundo"))
})
http.ListenAndServe(":8080", r)
```

---

## 🔹 6) **HttpRouter**

- Muy ligero y rápido, pero **mínimo**.
- No tiene middleware, validaciones, ni JSON helpers.
- **Ideal para**: microservicios extremadamente rápidos y minimalistas.

---
## 🔹 7) **Echo**
- Similar a Gin, muy completo.
- Fácil manejo de middleware, rutas y JSON.
- Buen rendimiento y sintaxis clara.
- **Ideal para**: APIs REST completas, proyectos medianos/grandes.

```Go
e := echo.New()
e.GET("/hello", func(c echo.Context) error {
    return c.JSON(200, map[string]string{"message": "Hola mundo"})
})
e.Start(":8080")

```

## Razonamiento de la elección

He decidido usar `Gin` como mi framework para el backend porque es uno de los mas populares y usados, tiene una sintaxis sencilla y utilidades ya hechas como JSON, validación, middleware, logging. También es escalable por lo que lo probablemente es uno de los candidatos a usar en el proyecto de la empresa. Estaba entre este `Gin` y `Fiber` ya que vengo de Node.js y me seria facil adaptarme en la sintaxis de este framework pero he decidido entrar de lleno en el ecosistema de Go para asi familiarizarme con este lenguaje y su entorno.
