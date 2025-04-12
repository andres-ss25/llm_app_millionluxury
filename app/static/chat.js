function formatBotResponse(response) {
  // Eliminar marcadores especiales como el que aparece al final del texto
  response = response.replace(/【\d+:\d+†source】/g, '');
  
  const lines = response.split('\n');
  let formattedResponse = '';
  let inList = false;
  let listContent = '';
  
  for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      if (line === '') {
          // Si estamos en una lista y encontramos una línea vacía, no la procesamos ahora
          if (!inList) {
              formattedResponse += '<p>&nbsp;</p>';
          }
          continue;
      }
      
      // Detectar líneas de lista numerada (1. texto)
      const listMatch = line.match(/^(\d+)\.\s+(.*)/);
      
      if (listMatch) {
          if (!inList) {
              // Iniciamos una nueva lista
              listContent = '<ol>\n';
              inList = true;
          }
          
          // Formateamos el contenido de la lista (negritas, etc)
          let itemContent = listMatch[2];
          itemContent = itemContent.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
          
          // Agregamos el elemento a la lista
          listContent += `  <li>${itemContent}</li>\n`;
      } else {
          // Si estábamos en una lista y ahora salimos
          if (inList) {
              listContent += '</ol>\n';
              formattedResponse += listContent;
              inList = false;
              listContent = '';
          }
          
          // Procesamos encabezados (# Título)
          if (/^#{1,6}\s/.test(line)) {
              const level = line.match(/^(#{1,6})\s/)[1].length;
              const text = line.replace(/^#{1,6}\s/, '');
              formattedResponse += `<h${level}>${text}</h${level}>\n`;
          } else {
              // Formateamos el texto normal (negritas, etc)
              line = line.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
              formattedResponse += `<p>${line}</p>\n`;
          }
      }
  }
  
  // Si terminamos y aún estamos en una lista, la cerramos
  if (inList) {
      listContent += '</ol>\n';
      formattedResponse += listContent;
  }
  
  return formattedResponse;
}