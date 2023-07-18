import React from "react";
import { useSelector } from "react-redux";
import { dummy_config } from "../utils/redux/dummy-conf";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'


const ObjectComparator = () => {
  const initialState = useSelector((state) => state);
  const currentState = useSelector((state) => state);

  const compareObjects = (initialState, currentState) => {
    const diffObject = {};

    const compare = (obj1, obj2, path) => {
      for (let key in obj2) {
        if (obj2.hasOwnProperty(key)) {
          const newPath = path ? `${path}.${key}` : key;

          if (!obj1.hasOwnProperty(key)) {
            // La chiave non è presente nell'oggetto 1
            diffObject[newPath] = obj2[key];
          } else if (
            typeof obj2[key] === "object" &&
            typeof obj1[key] === "object"
          ) {
            // Le chiavi sono oggetti, confronta ricorsivamente
            compare(obj1[key], obj2[key], newPath);
          } else if (obj1[key] !== obj2[key]) {
            // I valori delle chiavi sono diversi
            diffObject[newPath] = obj2[key];
          }
        }
      }
    };

    compare(initialState, currentState, "");

    return diffObject;
  };

  const diffObject = compareObjects(initialState, currentState);

  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardContent>
        <Typography variant="h4" component="div">
          Updated Keys:
        </Typography>
        <Typography variant="body2">
          <div>
            <pre>{JSON.stringify(diffObject, null, 2)}</pre>
          </div>
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Clean log</Button>
      </CardActions>
    </Card>

  );
};

export default ObjectComparator;
