# Características importantes
- **Concurrencia con goroutines y canales**
    - Mucho más ligeras que los hilos tradicionales.
    - Puedes lanzar miles de goroutines sin que el rendimiento se hunda.
    - Hace que Go sea ideal para servidores de alto rendimiento, microservicios y sistemas distribuidos.
- **Compilación ultra rápida + binarios únicos**
    - Compila a la velocidad de un script, pero con tipado estático.
    - Genera un solo **binario estático y portable** (sin dependencias externas).
    - Esto lo vuelve perfecto para contenedores y despliegues en la nube.
- **Simplicidad y código uniforme**
    - Sintaxis minimalista, sin exceso de abstracciones.
    - Con `gofmt` todo el código luce igual en todos los proyectos.
    - Esto reduce la curva de aprendizaje y los debates de estilo.
- **Librería estándar muy completa**
    - Networking, concurrencia, JSON, servidores HTTP y más, todo nativo.
    - Menos necesidad de frameworks pesados o dependencias externas.

# Tipos basicos
bool
string
int  int8  int16  int32  int64
uint uint8 uint16 uint32 uint64 uintptr
byte // alias for uint8
rune // alias for int32
     // represents a Unicode code point
float32 float64
complex64 complex128
## Valores iniciales
- `0` for numeric types,
- `false` for the boolean type, and
- `""` (the empty string) for strings.

# Sintaxis/Propiedades propia de Go

## Sintaxis
```Go
// Si poner := no hace falta que especifiques el tipo 
numero := 2
```
### Functions
Las funciones en Go pueden devolver mas de un valor
```Go
package main
import "fmt"
func swap(x int, y string) (int, string) {
    return x, y // Dos valores
}
func main() {
    a, b := swap(4, "world")
    fmt.Println(a, b)
}
```
### While
En Go el while se pone como un for
```Go
func main() {
	sum := 1
	for sum < 1000 {
		sum += sum
	}
	fmt.Println(sum)
	// Loop infinito 
	for {
	}
}
```

### If
En Go podemos asignar variables en los if y se pueden usar dentro del scope del mismo
```Go
// If regular
x := 10
if x > 5 {
    fmt.Println("x es mayor que 5")
}
// If con assignación de variable
if y := 7; y%2 == 0 {
    fmt.Println("y es par")
} else {
    fmt.Println("y es impar")
}
```
### Swich case
Lo swich case en Go: Otra diferencia importante es que los casos de `switch` en Go no necesitan ser constantes, y los valores involucrados no tienen por qué ser enteros.
```Go
color := "rojo"
switch color { // Si pones swich { } sin condición es = true
	case "azul":
        fmt.Println("El color es azul")
    case "rojo":
        fmt.Println("El color es rojo")
    case "verde":
        fmt.Println("El color es verde")
    default:
        fmt.Println("Color no reconocido")
}
```

### Arrays && slice
Los arrays tienen un tamaño fijo
```Go
var a [5]int      // array de 5 enteros, inicializado a 0
b := [3]string{"a", "b", "c"} // array de 3 strings con valores iniciales
// Aceso de elementos
a := [3]int{10, 20, 30}
fmt.Println(a[0]) // 10
a[1] = 50
fmt.Println(a)    // [10 50 30]
// Iterar
for i := 0; i < len(a); i++ {
    fmt.Println(a[i])
}

// Con range
for index, value := range a {
    fmt.Println(index, value)
}
```
Un **slice** es una **vista dinámica de un array**.
- No tiene tamaño fijo.
- Puede crecer y reducirse.
- Se crea a partir de un array o directamente con `make`.
```Go
// A partir de un array
arr := [5]int{1, 2, 3, 4, 5}
s := arr[1:4]  // elementos de índice 1 a 3 → [2 3 4]

// Crear un slice directamente
s2 := []int{10, 20, 30} // slice literal
s := make([]int, 3)      // slice de 3 elementos inicializados a 0
s2 := make([]int, 3, 5)  // slice de 3 elementos, capacidad 5
fmt.Println(len(s2)) // 3 → longitud
fmt.Println(cap(s2)) // 5 → capacidad
// Append
s := []int{1, 2, 3}
s = append(s, 4, 5)     // añade elementos
fmt.Println(s)          // [1 2 3 4 5]

sub := s[1:4]           // slicing → [2 3 4]
fmt.Println(sub)

```

### Packages
Loa packages son una unidad básica ed organicación en Go, define un espacio de nombres para el código que contiene
```Go
// archivo: mathutils/add.go
package mathutils

func Add(a int, b int) int {
    return a + b
}
```

### GoRoutines
Una **goroutine** es una función que se ejecuta de manera **concurrente** con otras funciones.
Son ligeras: puedes tener **miles de goroutines** funcionando al mismo tiempo.    
Son la forma principal de manejar **concurrencia** en Go, diferente a hilos de sistema operativo.
```Go
package main

import (
    "fmt"
    "time"
)

func sayHello() {
    fmt.Println("Hola desde Goroutine")
}

func main() {
    go sayHello() // <-- se ejecuta de manera concurrente

    // Necesitamos esperar un poco para que termine la goroutine
    time.Sleep(1 * time.Second)
    fmt.Println("Main function terminó")
} // Si no pones `time.Sleep`, la goroutine puede no alcanzar a ejecutarse antes de que termine `main`.
```
### Defer
El defer se usa para retrasar la ejecución de una línea de código y es útil para cerrar conexiones y cosas similares.
```Go
defer fmt.Println("world") // Saldra mas tarde
fmt.Println("hello")
```
### Pointers
Un puntero es una variable que almacena la dirección de memoria de otra variable. En Go 
- `&x` obtiene la dirección (puntero) de `x`.
- `*p` desreferencia `p`, es decir, accede al valor al que apunta.
Go **no** permite aritmética de punteros (no `p+1`), lo que evita mucha clase de errores.#
```Go
x := 42
p := &x             // p es *int, apunta a x
fmt.Printf("x = %d, p = %p\n", x, p) // %p muestra la dirección
fmt.Println("Valor apuntado por p:", *p) // desreferenciamos
*p = 100            // cambia el valor de x a través del puntero
fmt.Println("x tras modificar vía p:", x)
```

### Structs
No tienen nada de especial ni diferentes pero es para tener un ejemplo basico con punteros
```Go
type Vertex struct {
	X, Y int
}

var (
	v1 = Vertex{1, 2}  // has type Vertex
	v2 = Vertex{X: 1}  // Y:0 is implicit
	v3 = Vertex{}      // X:0 and Y:0
	p  = &Vertex{1, 2} // has type *Vertex haces un puntero al struct
)

func main() {
	fmt.Println(v1, p, v2, v3)
}
```

# API Rest + Gin
## Controllers
**Función o un método que recibe un `Context` de Gin** y responde al cliente.
```Go
// Función que actúa como controller
func GetHello(c *gin.Context) {
    name := c.Query("name") // leer query param ?name=Go
    if name == "" {
        name = "Mundo"
    }
    c.JSON(http.StatusOK, gin.H{
        "message": "Hola " + name,
    })
}
```
## Routes
```Go
userController := controllers.UserController{}
userRoutes := r.Group("/users")
{
    userRoutes.GET("/:id", userController.GetUser)
    userRoutes.PUT("/:id", userController.UpdateUser)
    userRoutes.DELETE("/:id", userController.DeleteUser)
}
```

## Middlewares
En los middlewares hay que tener en cuenta que en Gin podemos guardar valores o objetos en el contexto en el middleware y luego pasarselos al controller de la siguiente maners
```Go
func ValidateRegisterRequest() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.RegisterRequestModel

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid request",
				"details": err.Error(),
			})
			c.Abort()
			return
		}
		// Guardar la request validada en el contexto para el controller
		c.Set("registerRequest", req)

		c.Next()
	}
}
```

## Models
Los campos de los modelos siempre tiene que empezar por mayúscula para ser exportados y accesibles desde otros paquetes. Se usa el json: para indicar como **serializar**  este campo al convertirse de struct a JSON
```Go
package database

import "database/sql"

type UserModel struct {
	DB *sql.DB
}

type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"-"`
	Username string `json:"username"`
	Icon     string `json:"icon"`
}
```
## JWT
En el jwt tenemos lo que se llaman los Claims que va "dentro" del jwt (el payload)
Existen 2 tipos :
- Registred Claims → son estándar de JWT (exp, iat, iss, sub, etc.).
- **Custom claims** → los que definimos nosotros (ejemplo: `Email`, `Role`, etc.). En este caso usare un custom Claim para luego poder encontrar el usuario buscando por emial
```Go
// Para hacer un custom claim primero tenemos que definir un nuevo struct
type Claims struct {
	Email string `json:"email"`        // claim personalizado con el email
	jwt.RegisteredClaims               // incluye los estándar de JWT
}
var jwtKey = []byte(os.Getenv("JWT_SECRET")) // Secret que usamos para generar el JWT
Esto significa que cuando generamos el token, tendrá:
- `email`: el correo del usuario.
- `exp`: fecha de expiración.
- `iat`: fecha de emisión.
- `iss`: quién emitió el token.
```
Y ahora necesitamos crear funciones para Generar el Token y para Validar este token
```Go
// GENERAR
func GenerarToken(email string) (string, error) {
	claims := &Claims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)), // expira en 1h
			IssuedAt:  jwt.NewNumericDate(time.Now()),                   // emitido ahora
			Issuer:    "mi-app",                                         // identificador del emisor
		},
	}

	// Crear el token con algoritmo HS256 (HMAC + clave secreta)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// Firmar el token con nuestra clave secreta
	return token.SignedString(jwtKey)
}

// VALIDAR
func ValidarToken(tokenStr string) (string, error) {
	claims := &Claims{}
	// Parsear y validar el token
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil // usamos la misma clave secreta
	})
	if err != nil || !token.Valid {
		return "", fmt.Errorf("token inválido: %v", err)
	}
	return claims.Email, nil
}

```

## Bcrypt
Es bastante similar a como funciona en node o en otros frameworks que ya he usado por lo que no voy a poner mucha explicación
```Go
package services

import (
	"golang.org/x/crypto/bcrypt"
)

// HashPassword recibe una contraseña en texto plano y devuelve su hash
func HashPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashed), nil
}

// CheckPassword compara la contraseña en texto plano con el hash
func CheckPassword(password, hashed string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashed), []byte(password))
	return err == nil
}

```

# Comandos de Go
```Shell
# ------------------------------
# Ejecutar archivos Go directamente
# Compila y ejecuta el archivo sin generar binario
go run main.go
# Ejecuta varios archivos juntos
go run main.go helpers.go

# ------------------------------
# Compilar binario
# El -o especifica el nombre del ejecutable
go build -o hello_world main.go
# Ejecutar el binario generado
./hello_world          # Linux / Mac
hello_world.exe        # Windows

# ------------------------------
# Inicializar un módulo Go
# Crea go.mod para manejar dependencias
go mod init nombreDelModulo

# ------------------------------
# Descargar y limpiar dependencias
# Descarga las necesarias y elimina las no usadas
go mod tidy
# Instalar una dependencia específica
go get github.com/gin-gonic/gin@latest

# ------------------------------
# Ejecutar tests
# Ejecuta todos los tests de todos los paquetes
go test ./...
# Ejecuta tests de un paquete específico
go test ./controllers
# Ejecuta tests y muestra detalles
go test -v ./controllers

# ------------------------------
# Formatear código
# Formatea todo el proyecto según las reglas de Go
go fmt ./...
# Formatear un archivo específico y escribir cambios
gofmt -w main.go

# ------------------------------
# Instalar herramientas
# Instala ejecutables de Go y los coloca en $GOPATH/bin
go install github.com/swaggo/swag/cmd/swag@latest

# ------------------------------
# Mostrar información de dependencias
# Lista todas las dependencias del proyecto
go list -m all

# ------------------------------
# Compilar para otra plataforma (cross-compiling)
# Por ejemplo, compilar en Windows para Linux AMD64
GOOS=linux GOARCH=amd64 go build -o app main.go

# ------------------------------
# Ejecutar con verbose
# Muestra información detallada de los paquetes que se compilan
go run -v main.go

# ------------------------------
# Ver versión de Go instalada
go version

# ------------------------------
# Actualizar dependencias
go get -u ./...

# ------------------------------
# Ver módulos disponibles
go list -m -versions nombreModulo

# ------------------------------
# Limpiar módulos no utilizados
go mod tidy

# ------------------------------
# Descargar dependencias sin compilarlas
go mod download

```