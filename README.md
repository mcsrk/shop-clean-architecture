# E-commerce unificado

Unificación de productos de Shopify y Vtex por medio de NodeJs + Express, los cuales son consultados desde un cliente hecho en ReactJs.

## Tecnologías
`HTML` `CSS` `ReactJs` `Redux Toolkit` 
`NodeJs` `TypeScript` `Express` `Sequalize` `PostgresSql` 

## Estado

- ✅ El servidor adapta los productos de Shopify y VTEX.
- ✅ El servidor almacena prodcutos externos en una base de datos PostgesSQL.
- ✅ El servidor consulta la propia base de datos usando filtros.
 
- ✅ El cliente muestra correctamente la estructura de datos esperada.
- ✅ El cliente se conecta con el servidor para consultar los endpoints disponibles.
- ✅ El cliente permite búsqueda unificada por texto.
- ✅ El cliente permite búsqueda unificada por precio + operador.

## Tabla de contenido:

- [E-commerce unificado](#e-commerce-unificado)
  - [Tecnologías](#tecnologías)
  - [Estado](#estado)
  - [Tabla de contenido:](#tabla-de-contenido)
  - [Acerca de la app](#acerca-de-la-app)
  - [Setup](#setup)
    - [Servidor](#servidor)
    - [Cliente](#cliente)
  - [Screenshots](#screenshots)
    - [Cliente](#cliente-1)
    - [Documentación del servidor](#documentación-del-servidor)
  - [Cómo se abordó el problema](#cómo-se-abordó-el-problema)
  - [Referentes](#referentes)
  - [License](#license)

## Acerca de la app
App fullstack que unifica productos de ecommerce diferentes, como VTEX y Shopify. 

## Setup

- Descargar el repositorio
  ```sh
    git clone https://github.com/mcsrk/shop-clean-architecture.git
  ``` 
### Servidor
- Acceder a la carpeta del servidor usando 
  ```sh
    cd server/
  ```  
- Instalar las dependencias del servidor usando 
  ```sh
    npm install
  ```  
- Crear un `.env` propio en `./server` usando como referencia  
  > Nota: usar `./server/.env.exmaple` como ejemplo.
- Correr el servidor usando  
  ```sh
    npm start
  ```  

### Cliente
- Acceder a la carpeta del cliente usando 
  ```sh
    cd client/
  ```  
- Instalar las dependencias del servidor usando 
  ```sh
    npm install
  ```  
- Correr el cliente usando  
  ```sh
    npm run dev
  ```  
  > Nota:   por default accede al servidor por medio de `localhost:8000`.

## Screenshots
### Cliente
![Screenshot de cliente](client/public//Screenshot_de_busqeuda.JPG)

### Documentación del servidor
![Diagrama de base de datos](server/docs/Diagrama%20ER%20de%20base%20de%20datos.png)
![Diagrama de casos de uso](server/docs/Diagrama%20de%20casos%20de%20uso.png)
![Diagrama de secuencia /search](server/docs/Diagrama%20de%20secuencia%20-%20Search.png)
![Diagrama de secuencia /products](server/docs/Diagrama%20de%20secuencia%20-%20Products.png)
 

## Cómo se abordó el problema

Debido a que se tiene predefinida la estructura de retorno del servidor, se inició el desarrollo del cliente haciendo uso de React + Vite y se implemetó el diseño de GUI propuesto usando datos simulados. Se añadió adaptabilidad a diferentes dispositivos. Se usó Redux Toolkit con gestor de estados globales y evitar el prop-drilling.

A nivel de servidor, se investigó la implementación de la [Arquitectura Clean](https://merlino.agency/blog/clean-architecture-in-express-js-applications), y el patrón de diseño más conveniente para el problema, cuya decisión final fue el patrón [Adaptador](https://refactoring.guru/design-patterns/adapter). 

También se investigó la mejor alternativa para desplegar una base de datos PostgresSQL para el alcance de la prueba, finalmente se optó por [render.com](https://render.com/))




## Referentes

[Merlino - Clean Architecture in Express Js](https://merlino.agency/blog/clean-architecture-in-express-js-applications)
[Refactoring Guru - Adapter](https://refactoring.guru/design-patterns/adapter)
[UML Use Cases Diagram](https://www.youtube.com/watch?v=zid-MVo7M-E)


## License

MIT license @[Jhon Acosta](https://www.github.com/mcsrk)