// Importamos el modulo contenedor de las stopwords
import { foundStopWord } from './stopword.js';

// Lee el archivo donde se encuentra el documento
function leerArchivo(e) {
  var archivo = e.target.files[0];
  if (!archivo) {
    return;
  }
  var lector = new FileReader();
  lector.onload = function(e) {
    var contenido = e.target.result;
    mostrarContenido(contenido);
  };
  lector.readAsText(archivo);
}
// Muestra el contenido del documento seleccionado anteriormente
let valoraciones = [];
function mostrarContenido(contenido) {
  var elemento = document.getElementById('contenido-archivo');
  // Separo los documentos por saltos de linea
  valoraciones = separarValoraciones(contenido.split('\n'));
  // Muestro el contenido
  elemento.innerHTML += `<h5><b>Documentos leídos:</b></h5>`;
  elemento.innerHTML += contenido;
}

// Cierra el documento
document.getElementById('file-input').addEventListener('change', leerArchivo, false);

// Cuando se le da click al boton de 'Ejecuar' se ejecuta la función ejecutar()
document.getElementById('btn-ejecutar').addEventListener('click', ejecutar);

// Div contenedor de la tabla resultante
let resultado = document.querySelector('.resultado');

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////   MAIN  //////////////////////////////////////////
function ejecutar() {

  let matrizValores = [];
  // Creamos un elemento tabla para almacenar los resultados
  let tabla = document.createElement("table");

  for(var i = 0; i < valoraciones.length; i++){
    // Creo un vector con los terminos estudiados para no repetirlos en la tabla
    let visitados = [];
    // Creo un vector con todos los terminos y los calculos correspondientes
    let filaDatosTerminos = [];
    for(var j = 0; j < valoraciones[i].length; j++){
      // Compruebo si la palabra no ha sido visitada y ademas no es una 'stopword'
      if(!termFound(visitados, valoraciones[i][j]) && !foundStopWord(valoraciones[i][j])){
        // Almaceno los valores necesarios para la tabla
        let TF = termFrequency(valoraciones[i], valoraciones[i][j]);
        let IDF = inverseDocumentFrequecy(valoraciones, valoraciones[i][j]);
        let TF_IDF = TF * IDF;
        // Añado la fila con los datos recogidos
        filaDatosTerminos.push({"termino": valoraciones[i][j],"indice": j ,"TF": TF, "IDF": IDF, "TF_IDF": TF_IDF});
        // Agrego la palabra a la lista de visitados para que no se vuelva a repetir
        visitados.push(valoraciones[i][j]);
      }
    }
    matrizValores.push(filaDatosTerminos);
  }

  // Almancena la matriz ordenada por TF_IDF (de mayor a menor)
  let matrizOrdenada = sortByTF_IDF(matrizValores);
  for(var i = 0; i < matrizOrdenada.length; i++){
    // Creo los nombres de las columnas
    let trHeader = document.createElement("tr");
    let titulo = document.createElement("h4");
    titulo.innerHTML = `<h4>Documento Nº ${i+1}</h4>`
    trHeader.innerHTML = `<th scope="row">Término</th>
    <th>Indice</th>
    <th>TF</th>
    <th>IDF</th>
    <th>TF-IDF</th>`
    tabla.appendChild(titulo);
    tabla.appendChild(trHeader);

    for(var j = 0; j < matrizOrdenada[i].length; j++){
      // Imprimo por pantalla los resultados
      let TF = matrizOrdenada[i][j].TF;
      let IDF = matrizOrdenada[i][j].IDF;
      let TF_IDF = matrizOrdenada[i][j].TF_IDF;
      // Creo un elemento 'tr' para almancenar los resultados
      let trTermino = document.createElement("tr");
      trTermino.innerHTML += `<td>${matrizOrdenada[i][j].termino}</td>
      <td>${matrizOrdenada[i][j].indice}</td>
      <td>${TF}</td>
      <td>${IDF.toFixed(2)}</td>
      <td>${TF_IDF.toFixed(2)}</td>`;
      tabla.appendChild(trTermino);
    }
  }
  resultado.appendChild(tabla);
  
  // Aqui se mostraran las similitudes entre cada par de documentos
  let similitud = document.querySelector('.similitud');
  let tablaCosenos = document.createElement("table");
  let trHeader = document.createElement("tr");
  similitud.innerHTML += `<h5 style="padding-left: 50px">Matriz de Similaridad Coseno</h5>`;
  trHeader.innerHTML += `<th scope="row">Documentos</th>`;
  for(var i = 0; i < matrizOrdenada.length; i++)
    trHeader.innerHTML += `<th><b>Doc ${i+1}</b></th>`;
  tablaCosenos.appendChild(trHeader);

  // Donde se almacena la matriz normalizada 
  let matrizNormalizada = normalizar(matrizValores);

  for(var i = 0; i < matrizNormalizada.length; i++){
    let trDoc = document.createElement("tr");
    trDoc.innerHTML += `<th><b>Doc ${i+1}</b></th>`;
    for(var j = 0; j < matrizNormalizada.length; j++){
        // Se almacena el valor de la similaridad coseno
        let sim = cos(matrizNormalizada[i], matrizNormalizada[j]);
        trDoc.innerHTML += `<td>${sim.toFixed(3)}</td>`;
    }
    tablaCosenos.appendChild(trDoc);
  }
  similitud.appendChild(tablaCosenos);
}
/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

// Funcion que devuelve una tupla ordenada por valores de TF-IDF
function sortByTF_IDF(matriz){
  for(var i = 0; i < matriz.length; i++){
    let ordenado = matriz[i].slice(0);
    ordenado.sort(function(a,b) {
      return b.TF_IDF - a.TF_IDF; // ordenamos de mayor a menor
    });
    matriz[i] = ordenado;
  }
  return matriz;
}

// Normaliza los valores de la matriz de terminos para realizar la similitud
function normalizar(obj){
  let objNormalizado = [];
  for(var i = 0; i < obj.length; i++){
    let fila = [];
    for(var j = 0; j < obj[i].length; j++){
      // Divido el TF entre la la longitud del vector
      let TFNorm = obj[i][j].TF / lengthOfVector(obj[i]);
      // Creo un objeto con los datos recogidos
      fila.push({"termino": obj[i][j].termino, "TFNorm": TFNorm});
    }
    objNormalizado.push(fila);
  }
  return objNormalizado;
}

// Funcion para calcular la similitud entre articulos
function cos(u, v){
  let res = 0;
  for(var i = 0; i < u.length; i++){
    for(var j = 0; j < v.length; j++){
      if(u[i].termino == v[j].termino){
        res += u[i].TFNorm * v[j].TFNorm;
      }
    }
  }
  return res;
}

// Devuelve la longitud del vector de atributos (raiz cuadrada de la suma de todos los TF's al cuadrado)
function lengthOfVector(fila){
  let res = 0;
  for(var i = 0; i < fila.length; i++)
    res += Math.pow(fila[i].TF,2);
  return Math.sqrt(res);
}

// Funcion para crear una matriz de valoraciones utilizable
function separarValoraciones(documento){
  // Matriz donde se almacenará la matriz de valoraciones final
  let matrizValoraciones = [];

  for(var i = 0; i < documento.length; i++){
    let d = documento[i].split(' '); // Separo el documento primero por espacios
    let fila = [];

    for(var j = 0; j < d.length; j++){
      d[j] = d[j].replace(',',''); // Limpia las comas
      d[j] = d[j].replace('.',''); // Limpia los puntos
      d[j] = d[j].replace('!','');
      d[j] = d[j].replace('¡',''); // Limpia exclamaciones
      d[j] = d[j].replace('?','');
      d[j] = d[j].replace('¿',''); // Limpia interrogaciones
      fila.push(d[j]);
    }
    matrizValoraciones.push(fila); // Inserto la fila en la matriz final
  }
  return matrizValoraciones;
}

// Realiza el IDF de un termino analizandolo con todos los documentos
function inverseDocumentFrequecy(matrizVal, term){
  let numDocumentos = matrizVal.length;
  let counter = 0;
  for(var i = 0; i < numDocumentos; i++)
    if(termFound(matrizVal[i], term)) counter++;  
  return Math.log10(numDocumentos/counter);
}

// Devuelve cuantas veces aparece un termino en un documento
function termFrequency(doc, term){
  let counter = 0;
  for(var i = 0; i < doc.length; i++)
    if(doc[i] == term) counter++;
  return counter;
}

// Comprueba si un termino se encuentra en un documento
function termFound(doc, term){
  let found = false;
  for(var i = 0; i < doc.length; i++)
    if(doc[i] == term) found = true;
  return found;
}
