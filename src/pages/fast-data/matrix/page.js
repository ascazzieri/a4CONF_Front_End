import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import { updateFastDataMatrix } from "../../../utils/redux/reducers";
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
import { SnackbarContext } from "../../../utils/context/SnackbarContext";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import { JSONTree } from "react-json-tree";
import BackButton from "../../../components/BackButton/BackButton";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import SaveButton from "../../../components/SaveButton/SaveButton";
import { Container } from "@mui/material";
import { Fragment } from "react";

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
    setMatrixDataManagement(matrix?.matrix_data_managment || []);
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
  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };
  const handleMatrixChange = (e) => {
    e.preventDefault();
    const newMatrix = {
      ...matrix,
      matrix_data_managment: matrixDataManagement || [],
    };
    handleRequestFeedback({
      vertical: "bottom",
      horizontal: "right",
      severity: "success",
      message: `Matrix configuration save correctly`,
    });
    dispatch(updateFastDataMatrix(newMatrix));
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
