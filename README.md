# E-commerce unificado

Unificación de productos de Shopify y Vtex por medio de NodeJs + Express, los cuales son consultados desde un cliente hecho en ReactJs.

## Demo link:
Accede al sitio desplegado en Vercel [google.com](https://google.com)

## Table of Content:

- [E-commerce unificado](#e-commerce-unificado)
  - [Demo link:](#demo-link)
  - [Table of Content:](#table-of-content)
  - [Acerca de la app](#acerca-de-la-app)
  - [Screenshots](#screenshots)
    - [Server Docs](#server-docs)
  - [Tecnologías](#tecnologías)
  - [Setup](#setup)
    - [Servidor](#servidor)
    - [Cliente](#cliente)
  - [Cómo abordé el problema](#cómo-abordé-el-problema)
  - [Status](#status)
  - [Créditos](#créditos)
  - [License](#license)

## Acerca de la app
TBD

## Screenshots

### Server Docs
![Diagrama de base de datos](server/docs/Diagrama%20ER%20de%20base%20de%20datos.png)
![Diagrama de casos de uso](server/docs/Diagrama%20de%20casos%20de%20uso.png)
![Diagrama de secuencia /search](server/docs/Diagrama%20de%20secuencia%20-%20Search.png)
![Diagrama de secuencia /products](server/docs/Diagrama%20de%20secuencia%20-%20Products.png)
 

## Tecnologías
`HTML`, `CSS`, `ReactJs`, `NodeJs`, `Express`, `Sequalize`, `PostgresSql` 

## Setup

### Servidor
- Descargar el prositorio
- Acceder a la carpeta del servidor usando `cd server/` 
- Instalar las dependencias del servidor usando `npm install`
- Correr el servidor usando `nodemon` 

### Cliente
- Acceder a la carpeta del cliente usando  `cd client/` 
- Instalar las dependencias del servidor usando `npm install`
- Correr el cliente usand `npm run dev` 

## Cómo abordé el problema

Debido a que se tiene predefinida la estructura de retorno del servidor, se inició el desarrollo del cliente haciendo uso de React + Vite y de daimplementó el diseño de GUI propuesto, asímismo se aseguró tos simulados. Se cierto nivel de adaptabilidad a diferentes dispositivos. Se usó ContextProvider para almacenar de manera apropiada los datos de los filtros evitando el prop-drilling.

A nivel de servidor, se investigó la implementación de la arquitectura Clean, y el patrón de diseño más conveniente para el problema, cuya decisión final fue el patrón Adaptador. También se investigó la mejor alternativa para desplegar una base de datos PostgresSQL para el alcance de la prueba (usando Render.com). 


## Status
✅ Los datos simulados se muestran correctamente en el cliente.

✅ El servidor adapta los productos de Shopify y VTEX.
✅ El servidor almacena prodcutos externos en base de datos
✅ El servidor consulta propia base de datos usando filtros.
 
## Créditos

[Merlino - Clean Architecture in Express Js](https://merlino.agency/blog/clean-architecture-in-express-js-applications)
[Refactoring Guru - Adapter](https://refactoring.guru/design-patterns/adapter)
[UML Use Cases Diagram](https://www.youtube.com/watch?v=zid-MVo7M-E)


## License

MIT license @ [Jhon Acosta](https://www.github.com/mcsrk)