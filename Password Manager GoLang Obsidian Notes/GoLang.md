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
## Propiedades
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

## Structs
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
# Comandos de Go
```Shell
go run rutaArchivo
go build -o hello_world main.go
# El -o es para proporcionar nombre al .bin
```