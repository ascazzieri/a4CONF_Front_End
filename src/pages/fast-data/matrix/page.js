import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import { updateFastData } from "../../../utils/redux/reducers";
import JsonEditorComponent from "../../../components/JsonEditor/JsonEditor";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import { JSONTree } from "react-json-tree";
import Stack from "@mui/material/Stack";
import Item from "antd/es/list/Item";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BackButton from "../../../components/BackButton/BackButton";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import SaveButton from "../../../components/SaveButton/SaveButton";
import { Container, Typography } from "@mui/material";
import { Fragment } from "react";

const dummy_matrix = [
  {
    id: "7Q910A0",
    grouping_files: 10,
    matrix_delimiter: {
      start: "[",
      mid: ",",
      end: "]",
    },
    source_object_ID_column_name: "Engine_ID",
    source_objects_properties: [
      "RefPosition",
      "TrackingDeviation",
      "RefVelocity",
      "ActualVelocity",
      "RefAcceleration",
      "ActualCurrent",
    ],
    each_source_object_properties: {
      engine_1: [1, 2, 3, 4, 5, 6],
      engine_2: [7, 8, 9, 10, 11, 12],
      engine_3: [13, 14, 15, 16, 17, 18],
      engine_4: [19, 20, 21, 22, 23, 24],
      engine_5: [25, 26, 27, 28, 29, 30],
    },
    timestamp: {
      db_timestamp_column_name: "Timestamp",
      get_timestamp_from_matrix: {
        enabled: false,
        matrix_index_number: 0,
      },
    },
    machine_id_column: {
      enabled: true,
      machine_id_column_name: "machine_id",
    },
    custom_columns: {
      dynamic_columns: {
        enabled: false,
        columns: {
          MasterRefPosition: 26,
          Counter: 0,
        },
      },
    },
  },
  {
    id: "7Q810A0",
    grouping_files: 10,
    matrix_delimiter: {
      start: "[",
      mid: ",",
      end: "]",
    },
    source_object_ID_column_name: "Engine_ID",
    source_objects_properties: [
      "RefPosition",
      "TrackingDeviation",
      "RefVelocity",
      "ActualVelocity",
      "RefAcceleration",
      "ActualCurrent",
    ],
    each_source_object_properties: {
      engine_1: [1, 2, 3, 4, 5, 6],
      engine_2: [7, 8, 9, 10, 11, 12],
      engine_3: [13, 14, 15, 16, 17, 18],
      engine_4: [19, 20, 21, 22, 23, 24],
      engine_5: [25, 26, 27, 28, 29, 30],
    },
    timestamp: {
      db_timestamp_column_name: "Timestamp",
      get_timestamp_from_matrix: {
        enabled: false,
        matrix_index_number: 0,
      },
    },
    machine_id_column: {
      enabled: true,
      machine_id_column_name: "machine_id",
    },
    custom_columns: {
      dynamic_columns: {
        enabled: false,
        columns: {
          MasterRefPosition: 26,
          Counter: 0,
        },
      },
    },
  },
  {
    id: "7Q610A0",
    grouping_files: 10,
    matrix_delimiter: {
      start: "[",
      mid: ",",
      end: "]",
    },
    source_object_ID_column_name: "Engine_ID",
    source_objects_properties: [
      "RefPosition",
      "TrackingDeviation",
      "RefVelocity",
      "ActualVelocity",
      "RefAcceleration",
      "ActualCurrent",
    ],
    each_source_object_properties: {
      engine_1: [1, 2, 3, 4, 5, 6],
      engine_2: [7, 8, 9, 10, 11, 12],
      engine_3: [13, 14, 15, 16, 17, 18],
      engine_4: [19, 20, 21, 22, 23, 24],
      engine_5: [25, 26, 27, 28, 29, 30],
    },
    timestamp: {
      db_timestamp_column_name: "Timestamp",
      get_timestamp_from_matrix: {
        enabled: false,
        matrix_index_number: 0,
      },
    },
    machine_id_column: {
      enabled: true,
      machine_id_column_name: "machine_id",
    },
    custom_columns: {
      dynamic_columns: {
        enabled: false,
        columns: {
          MasterRefPosition: 26,
          Counter: 0,
        },
      },
    },
  },
];

export default function Matrix() {
  const matrix = useSelector(
    (state) => state.services?.fastdata?.customer?.matrix
  );

  const dispatch = useDispatch();
  const superUser = useContext(SuperUserContext)[0];
  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = superUser
    ? ["Matrix management", "JSON"]
    : ["Matrix management"];

  const [matrixDataManagement, setMatrixDataManagement] = useState(
    matrix?.matrix_data_managment || []
  );

  console.log(matrixDataManagement);

  //Update React states
  useEffect(() => {
    setMatrixDataManagement(matrix?.matrix_data_managment || dummy_matrix);
  }, [matrix]);

  const handleItemChange = (jsonItem) => {
    if (matrixDataManagement?.length === 0) {
      setMatrixDataManagement([jsonItem]);
    } else {
      const existingObjectIndex = matrixDataManagement.findIndex(
        (obj) => obj?.id === jsonItem?.id
      );
      if (existingObjectIndex !== -1) {
        const updatedMatrixData = [...matrixDataManagement];
        updatedMatrixData[existingObjectIndex] = jsonItem;
        setMatrixDataManagement(updatedMatrixData);
      } else {
        setMatrixDataManagement((prevMatrixData) => [
          ...prevMatrixData,
          jsonItem,
        ]);
      }
    }
  };

  const handleMatrixChange = (e) => {
    e.preventDefault();
    const newMatrix = {
      ...matrix,
      matrix_data_managment: [
        {
          id: "7Q910A0",
          grouping_files: 10,
          matrix_delimiter: {
            start: "[",
            mid: ",",
            end: "]",
          },
          source_object_ID_column_name: "Engine_ID",
          source_objects_properties: [
            "RefPosition",
            "TrackingDeviation",
            "RefVelocity",
            "ActualVelocity",
            "RefAcceleration",
            "ActualCurrent",
          ],
          each_source_object_properties: {
            engine_1: [1, 2, 3, 4, 5, 6],
            engine_2: [7, 8, 9, 10, 11, 12],
            engine_3: [13, 14, 15, 16, 17, 18],
            engine_4: [19, 20, 21, 22, 23, 24],
            engine_5: [25, 26, 27, 28, 29, 30],
          },
          timestamp: {
            db_timestamp_column_name: "Timestamp",
            get_timestamp_from_matrix: {
              enabled: false,
              matrix_index_number: 0,
            },
          },
          machine_id_column: {
            enabled: true,
            machine_id_column_name: "machine_id",
          },
          custom_columns: {
            dynamic_columns: {
              enabled: false,
              columns: {
                MasterRefPosition: 26,
                Counter: 0,
              },
            },
          },
        },
        {
          id: "7Q810A0",
          grouping_files: 10,
          matrix_delimiter: {
            start: "[",
            mid: ",",
            end: "]",
          },
          source_object_ID_column_name: "Engine_ID",
          source_objects_properties: [
            "RefPosition",
            "TrackingDeviation",
            "RefVelocity",
            "ActualVelocity",
            "RefAcceleration",
            "ActualCurrent",
          ],
          each_source_object_properties: {
            engine_1: [1, 2, 3, 4, 5, 6],
            engine_2: [7, 8, 9, 10, 11, 12],
            engine_3: [13, 14, 15, 16, 17, 18],
            engine_4: [19, 20, 21, 22, 23, 24],
            engine_5: [25, 26, 27, 28, 29, 30],
          },
          timestamp: {
            db_timestamp_column_name: "Timestamp",
            get_timestamp_from_matrix: {
              enabled: false,
              matrix_index_number: 0,
            },
          },
          machine_id_column: {
            enabled: true,
            machine_id_column_name: "machine_id",
          },
          custom_columns: {
            dynamic_columns: {
              enabled: false,
              columns: {
                MasterRefPosition: 26,
                Counter: 0,
              },
            },
          },
        },
        {
          id: "7Q610A0",
          grouping_files: 10,
          matrix_delimiter: {
            start: "[",
            mid: ",",
            end: "]",
          },
          source_object_ID_column_name: "Engine_ID",
          source_objects_properties: [
            "RefPosition",
            "TrackingDeviation",
            "RefVelocity",
            "ActualVelocity",
            "RefAcceleration",
            "ActualCurrent",
          ],
          each_source_object_properties: {
            engine_1: [1, 2, 3, 4, 5, 6],
            engine_2: [7, 8, 9, 10, 11, 12],
            engine_3: [13, 14, 15, 16, 17, 18],
            engine_4: [19, 20, 21, 22, 23, 24],
            engine_5: [25, 26, 27, 28, 29, 30],
          },
          timestamp: {
            db_timestamp_column_name: "Timestamp",
            get_timestamp_from_matrix: {
              enabled: false,
              matrix_index_number: 0,
            },
          },
          machine_id_column: {
            enabled: true,
            machine_id_column_name: "machine_id",
          },
          custom_columns: {
            dynamic_columns: {
              enabled: false,
              columns: {
                MasterRefPosition: 26,
                Counter: 0,
              },
            },
          },
        },
      ],
    };

    dispatch(updateFastData({ customer: { matrix: { newMatrix } } }));
  };

  return (
    <ErrorCacher>
      <Container>
        <BackButton pageTitle="Matrix" />
        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 1 && superUser && <JSONTree data={matrix} />}

        <form onSubmit={handleMatrixChange}>
          {currentTab === 0 && (
            <>
              {matrixDataManagement &&
                matrixDataManagement.length !== 0 &&
                matrixDataManagement.map((item, index) => {
                  return (
                    <Fragment key={item.id}>
                      <JsonEditorComponent
                        key={`editor-${item.id}-${index}`}
                        jsonData={item}
                        setJsonData={handleItemChange}
                      />
                    </Fragment>
                  );
                })}
            </>
          )}

          {currentTab !== 1 && <SaveButton />}
        </form>
      </Container>
    </ErrorCacher>
  );
}
