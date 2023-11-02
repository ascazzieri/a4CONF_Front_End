import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import { updateFastData } from "../../../utils/redux/reducers";
import Button from "@mui/material/Button";
import JsonEditorComponent from "../../../components/JsonEditor/JsonEditor";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  FormLabel,
  Autocomplete,
  FormControl,
  TextField,
  Stack,
  Divider,
} from "@mui/material";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import { JSONTree } from "react-json-tree";
import BackButton from "../../../components/BackButton/BackButton";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import SaveButton from "../../../components/SaveButton/SaveButton";
import { Container } from "@mui/material";
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
  const [currentMatrixId, setCurrentMatrixId] = useState();

  //Update React states
  useEffect(() => {
    setMatrixDataManagement(matrix?.matrix_data_managment || dummy_matrix);
  }, [matrix]);

  const handleItemChange = (jsonItem) => {
    const oldMatrixManagement =
      matrixDataManagement?.length !== 0 ? [...matrixDataManagement] : [];
    const newItemIndex = oldMatrixManagement?.findIndex(
      (item) => item?.id === jsonItem?.id
    );
    if (newItemIndex !== -1) {
      oldMatrixManagement[newItemIndex] = jsonItem;
    } else {
      oldMatrixManagement.push(jsonItem);
    }
    setMatrixDataManagement(oldMatrixManagement);
  };
  const handleDeleteItem = () => {
    const newMatrixDataManagement = matrixDataManagement?.filter(
      (item) => item?.id !== currentMatrixId
    );
    setMatrixDataManagement(newMatrixDataManagement);
  };

  const handleMatrixChange = (e) => {
    e.preventDefault();
    const newMatrix = {
      ...matrix,
      matrix_data_managment: matrixDataManagement || [],
    };

    dispatch(updateFastData({ customer: { matrix: newMatrix } }));
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
              <FormLabel>Remove matrix item</FormLabel>
              <Stack
                direction="row"
                spacing={3}
                justifyContent="center"
                alignItems="center"
              >
                <FormControl fullWidth>
                  <Autocomplete
                    disablePortal
                    options={matrixDataManagement?.map((item) => item?.id)}
                    onChange={(event, newValue) => {
                      setCurrentMatrixId(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Matrix ID elements" />
                    )}
                  />
                </FormControl>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteItem}
                >
                  Delete
                </Button>
              </Stack>
              <Divider />
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
