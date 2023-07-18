import React from "react";
import { useSelector } from "react-redux";
import { dummy_config } from "../utils/redux/dummy-conf";

export default function Checklist() {
  const initialState = dummy_config;
  const currentState = useSelector((state) => state);

  const updatedKeysWithValues = findUpdatedKeysWithValues(initialState, currentState);

  return (
    <div>
      <h3>Updated Keys:</h3>
      <ul>
        {updatedKeysWithValues.map(({ key, value }) => (
          <li key={key}>
            <strong>{key}:</strong> {JSON.stringify(value)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function findUpdatedKeysWithValues(initialObj, currentObj, path = "") {
  const updatedKeysWithValues = [];

  for (let key in initialObj) {
    const newPath = path ? `${path}.${key}` : key;
    if (
      typeof initialObj[key] === "object" &&
      initialObj[key] !== null &&
      currentObj[key] !== undefined
    ) {
      const nestedKeysWithValues = findUpdatedKeysWithValues(
        initialObj[key],
        currentObj[key],
        newPath
      );
      updatedKeysWithValues.push(...nestedKeysWithValues);
    } else if (initialObj[key] !== currentObj[key]) {
      updatedKeysWithValues.push({
        key: newPath,
        value: currentObj[key],
      });
    }
  }

  return updatedKeysWithValues;
}
