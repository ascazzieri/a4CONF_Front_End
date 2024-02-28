import React, { useRef, useEffect } from 'react';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';

const JsonEditorComponent = ({ jsonData, setJsonData }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const options = {
      onValidate: function (json) {
        // Effettua la validazione del JSON
        const errors = validateJson(json);

        // Aggiorna lo stato solo se non ci sono errori
        if (errors.length === 0) {
          setJsonData(json);
        }

        return errors;
      },
    };

    editorRef.current = new JSONEditor(document.getElementById('jsoneditor'), options);
    editorRef.current.set(jsonData);

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  const validateJson = (json) => {
    const errors = [];

    /* // Esempio di validazione: verifica la presenza dell'indirizzo nel customer
    if (json && json.customer && !json.customer.address) {
      errors.push({
        path: ['customer'],
        message: 'Required property "address" missing.',
      });
    } */

    return errors;
  };

  return <div id="jsoneditor" style={{ height: '500px' }} />;
};

export default JsonEditorComponent;
