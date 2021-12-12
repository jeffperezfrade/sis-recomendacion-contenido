# Descripción del código desarrollado.

El código está desarrollado con JavaScript, HTML y CSS, se ha optado por escribir HTML de forma dinámica en el archivo JavaScript.

El código pricipal se encuentra en el archivo `main.js` y el archivo donde se encuentran las stopword en `stopword.js`.

Dentro del archivo `main.js` podemos observar varias funciones, entre ellas encontramos:

`leerArchivo(e)` la cual accede el documento elegido en la página principal.

`mostrarContenido(contenido)` función que muestra el contenido.

`ejecutar()` es la función principal, en esta se realizan las siguientes tareas:

- Se almacenan los datos en una tupla compuesta por el numbre del término, TF, IDF y por ultimo TF-IDF.

- Los resultados se muestran ordenados de mayor a menor por TF-IDF.

- Posteriormente se crea una matriz normalizada para crear la matriz de similaridad coseno.

- Se muestra por pantalla el resultado de la matriz similaridad coseno.


`sortByTF_IDF(matriz)` función que devuelve una matriz ordenada por TF-IDF.

`normalizar(obj)` normaliza una matriz, es decir, divide todos los TF de sus términos entre la longitud del vector de atributos.

`cos(u, v)` devuelve la similitud coseno entre cada par de articulos.

`lengthOfVector(fila)` devuelve la longitud del vector de atributos, este se calcula como la raiz cuadrada de las sumas de los TF's al cuadrado.

`separarValoraciones(documento)` dado un documento separado por saltos de linea, esta función elimina puntos, comas y signos de los términos.

`termFound(doc, term)` devuelve un booleano indicando si un elemento se ha encontrado en un documento o no.

## Funciones de cálculo de TF IDF.

`inverseDocumentFrequecy(matrizVal, term)` devuelve el IDF de un término pasado por parametro.

`termFrequency(doc, term)` devuelve el TF de un término pasado por parametro.


# Descripción de uso (ejemplo de uso).
Al situarse en la página principal de la aplicación, es necesario elegir un archivo de texto contenedor de los documentos mediante al botón de `Seleccionar archivo`.

Una vez hecho esto se mostrará por pantalla el documento elegido.

Pulsar en el botón `Ejecutar` para iniciar el programa.

Se desplegarán varias tablas correspondientes a cada Documento recogido.

Al final de la página se mostrará tambien la matriz de cosenos la cual indica la similaridad coseno entre cada par de documentos.