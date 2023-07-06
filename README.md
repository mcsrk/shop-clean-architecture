# E-commerce unificado

Unificación de productos de Shopify y Vtex por medio de NodeJs + Express, los cuales son consultados desde un cliente hecho en ReactJs.

## Tabla de contenido:

- [E-commerce unificado](#e-commerce-unificado)
  - [Tabla de contenido:](#tabla-de-contenido)
  - [Tecnologías](#tecnologías)
  - [Estado](#estado)
  - [Acerca de la app](#acerca-de-la-app)
  - [Setup](#setup)
    - [Servidor](#servidor)
    - [Cliente](#cliente)
  - [Screenshots](#screenshots)
    - [Cliente](#cliente-1)
    - [Documentación del servidor](#documentación-del-servidor)
  - [Cómo se abordó el problema](#cómo-se-abordó-el-problema)
      - [Poblar la base de datos con cada consulta](#poblar-la-base-de-datos-con-cada-consulta)
      - [Poblar la base de datos desde el inicio](#poblar-la-base-de-datos-desde-el-inicio)
  - [Referentes](#referentes)
  - [License](#license)

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
- Correr el servidor en  [`http://localhost:8000/`](http://localhost:8000/) usando  
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
- Correr el cliente en  [`http://localhost:5173/`](http://localhost:5173/)usando  
  ```sh
    npm run dev
  ```  
  > Nota:   por default accede al servidor por medio de [`http://localhost:8000/`](http://localhost:8000/).

## Screenshots
### Cliente
![Screenshot de cliente](client/public//Screenshot_de_busqeuda.JPG)

### Documentación del servidor
![Diagrama de base de datos](server/docs/Diagrama%20ER%20de%20base%20de%20datos.png)
![Diagrama de casos de uso](server/docs/Diagrama%20de%20casos%20de%20uso.png)
![Diagrama de secuencia /search](server/docs/Diagrama%20de%20secuencia%20-%20Search.png)
![Diagrama de secuencia /products](server/docs/Diagrama%20de%20secuencia%20-%20Products.png)
 

## Cómo se abordó el problema

Se inició el desarrollo del cliente haciendo uso de React + Vite y se implemetó el diseño de GUI propuesto usando datos simulados. Se añadió adaptabilidad a diferentes dispositivos. Se usó Redux Toolkit con gestor de estados globales y evitar el prop-drilling.

A nivel de servidor, se investigó la implementación de la [Arquitectura Clean](https://merlino.agency/blog/clean-architecture-in-express-js-applications), y el patrón de diseño más conveniente para el problema: [Patrón Adaptador](https://refactoring.guru/design-patterns/adapter). 

Se creó una base de datos PostgresSQL en [render.com](https://render.com/), ya que  se ajusta al alcance de la prueba. En cuanto a modelo de datos, se estableció una relación 1:N de Products a Products para representar los Productos con variantes.

Para el flujo de búsqueda en los diferentes Ecommerce se tuvo en cuenta 2 alternativas: 
- Poblar la base de datos con cada consulta.
- Poblar la base de datos desde el inicio.

#### Poblar la base de datos con cada consulta
Cada cambio de parámetros hechos desde el cliente dispara un consulta a la ruta `/search/${companyPrefix}` para cada ecommerce disponible : 
- Esta consulta busca un máximo de 10 productos que coincidan con el filtro `search_text`, acto seguido inserta en la base de datos propia los resultados.

Una vez finalizadas las peticiones a los ecommerce, el cliente ejecuta una petición `/products`:
- Esta consulta ejecuta una busqueda a la base de datos propia, la cual tiene en cuenta los campos `search_text`, `price` y `price_operartor`. Retornando los resultados esperados. 

  > Esta estrategía permite poblar la base de datos progresivamente con cada consulta hecha desde el cliente. A su vez, mantiene en la base de datos propia productos que hayan podido ser agregados a los  ECommerce recientemente.
  
#### Poblar la base de datos desde el inicio

En el momento en el que se renderiza el cliente se ejecuta `/search/all/${companyPrefix}` para cada ecommerce disponible : 
- Esta consulta obtiene todos los productos disponibles por medio de paginación, acto seguido los inserta en la base de datos propia. 
 > Nota - `/search/all/${companyPrefix}` Puede tandar minutos en completar según la cantidad de productos. En este caso tardó 20 segundos.

De manera restictiva, el cliente tendrá que esperar a que la "migración" de productos se complete para poder realizar consultas a `/products` por medio de los filtros disponibles. 

  > Esta estrategía permite migrar los productos de los Ecommerce a la DB propia, lo cual reduce los tiempos de búsqueda de `/products`. Sin embargo, es bloqueante ya que las consultas realizadas durante la migración podrían no retornar productos. 
  Además, solo se mantiene una versión de los productos de los Ecommerce sincronizada ya que si, un producto nuevo es añadido a algún Ecommerce, el cliente web no sabrá de su existencia hasta que la migración se haga otra vez.


## Referentes

[Merlino - Clean Architecture in Express Js](https://merlino.agency/blog/clean-architecture-in-express-js-applications)
[Refactoring Guru - Adapter](https://refactoring.guru/design-patterns/adapter)
[UML Use Cases Diagram](https://www.youtube.com/watch?v=zid-MVo7M-E)


## License

MIT license @[Jhon Acosta](https://www.github.com/mcsrk)