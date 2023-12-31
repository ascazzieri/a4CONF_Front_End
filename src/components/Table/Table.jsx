import React, { useCallback, useState, useContext, Fragment } from "react";
import { MaterialReactTable } from "material-react-table";
import { SnackbarContext } from "../../utils/context/SnackbarContext";
import { ExportToCsv } from "export-to-csv";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import { Delete, Edit, Add, FileDownload } from "@mui/icons-material";
//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  selectableObjectData,
  validationFields,
  validationAgents,
  staticValue,
}) => {
  const [values, setValues] = useState(() =>
    columns?.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );
  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  const handleSubmit = () => {
    let validationResult = true;

    if (!values) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Unable to perform actions on null data`,
      });
      return;
    }
    let validationIterator = [];
    validationFields?.forEach((item) => {
      if (Object.keys(values)?.some((accessorKey) => accessorKey === item)) {
        validationIterator?.push(values[item]);
      }
    });
    validationIterator?.forEach((item, index) => {
      if (!validationAgents[index](item?.trim())) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `Error on ${item}, it doeas not satisfy the requested parameters`,
        });
        validationResult = false;
      }
    });
    if (validationResult) {
      onSubmit(values);
      setValues();
      onClose();
    }
  };
  let MenuItemIterator = [];
  if (
    selectableObjectData &&
    selectableObjectData?.internal_key !== undefined
  ) {
    selectableObjectData?.data.map((item, index) =>
      MenuItemIterator?.push(item[`${selectableObjectData?.internal_key}`])
    );
  } else if (
    selectableObjectData &&
    selectableObjectData?.internal_key === undefined
  ) {
    selectableObjectData?.data?.map((item, index) =>
      MenuItemIterator?.push(item)
    );
  }

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Add new row</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              gap: "1.5rem",
            }}
          >
            {columns?.map((column, index) => {
              const isPasswordColumn = column.type === "password";

              if (
                selectableObjectData?.enabled &&
                selectableObjectData?.accessorKey?.some(
                  (item) => item === column?.accessorKey
                )
              ) {
                return (
                  <Fragment key={Math.random()}>
                    <Autocomplete
                      freeSolo
                      name={column.accessorKey}
                      key={index}
                      sx={{ minWidth: 400 }}
                      defaultValue={
                        values && values[column.accessorKey]
                          ? values[column.accessorKey]
                          : ""
                      }
                      onChange={(e, newValue) => {
                        setValues({
                          ...values,
                          [column.accessorKey]: newValue,
                        });
                      }}
                      onBlur={(event) => {
                        setValues({
                          ...values,
                          [column.accessorKey]: event?.target?.value,
                        });
                      }}
                      options={MenuItemIterator}
                      renderInput={(params) => (
                        <TextField {...params} label={column?.header} />
                      )}
                    />
                    <Divider />
                  </Fragment>
                );
              } else {
                return (
                  <Fragment key={Math.random()}>
                    <TextField
                      key={index}
                      label={column?.header}
                      name={column?.accessorKey}
                      type={isPasswordColumn ? "password" : "text"}
                      disabled={!column.enableEditing}
                      sx={{ minWidth: 400 }}
                      defaultValue={
                        !column.enableEditing
                          ? staticValue
                          : values
                          ? values[column?.accessorKey]
                          : ""
                      }
                      onBlur={(e) => {
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    />
                    <Divider />
                  </Fragment>
                );
              }
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Table = (props) => {
  const {
    tableData,
    setTableData,
    columnsData,
    selectableObjectData,
    validationObject,
    staticValue,
  } = props;

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const validationFields = validationObject && Object.keys(validationObject);
  const validationAgents = validationObject && Object.values(validationObject);

  const checkObject = (item, values) => {
    const itemKeys = Object?.keys(values);
    let result = false;
    if (itemKeys.every((element) => item[element] === values[element])) {
      result = true;
    }
    return result;
  };

  const handleCreateNewRow = (values) => {
    const newTableData = tableData?.length !== 0 ? [...tableData] : [];
    if (newTableData?.some((item) => checkObject(item, values))) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `The row has not been added due to the existance of an exact copy inside previous data`,
      });
      return;
    }
    let updatedValues = values && values?.length !== 0 && { ...values };
    columnsData?.forEach((columnItem) => {
      if (columnItem?.enableEditing === false) {
        updatedValues[columnItem.accessorKey] = staticValue
      }
    });
    newTableData.push(updatedValues);
    setTableData(newTableData);
  };
  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };
  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    let validationResult = true;
    if (!values) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Unable to perform actions on null data`,
      });
      return;
    }
    let validationIterator = [];
    validationFields?.forEach((item) => {
      if (Object.keys(values).some((accessorKey) => accessorKey === item)) {
        validationIterator?.push(values[item]);
      }
    });
    validationIterator?.forEach((item, index) => {
      if (!validationAgents[index](item)) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `Error on ${item}, it doeas not satisfy the requested parameters`,
        });
        validationResult = false;
      }
    });
    if (validationResult) {
      // Crea una copia dell'array
      const updatedTableData = tableData?.length !== 0 ? [...tableData] : [];

      if (updatedTableData?.some((item, index) => checkObject(item, values))) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `The row cannot be created due to the existance of an exact copy inside previous data`,
        });
        return;
      }
      // Assegna il nuovo valore all'elemento specifico
      updatedTableData[row.index] = values;
      // Aggiorna lo stato con la nuova copia dell'array
      setTableData(updatedTableData);

      // Invia/receive le chiamate API qui, quindi refetch o aggiorna i dati della tabella locale per il re-render
      exitEditingMode(); // Richiesto per uscire dalla modalità di modifica e chiudere la modale di modifica */
    }
  };
  const handleDeleteRow = (row) => {
    if (tableData?.length === 0) {
      setTableData([]);
      return;
    }
    const newData = [...tableData];
    newData?.splice(row.index, 1);
    setTableData(newData);
  };
  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columnsData.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportData = () => {
    csvExporter?.generateCsv(tableData);
  };
  return (
    <div style={{ marginTop: 15, marginBottom: 15 }}>
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        columns={columnsData}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}
          >
            <Button onClick={() => setCreateModalOpen(true)}>
              <Add />
            </Button>
            {tableData && Object.keys(tableData).length !== 0 && (
              <Button
                color="primary"
                //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                onClick={handleExportData}
                startIcon={<FileDownload />}
                variant="contained"
              >
                Export Table Data
              </Button>
            )}
          </Box>
        )}
        renderRowActions={({ row, table }) => (
          <Box
            sx={{ display: "flex", gap: "1rem" }}
            style={{ justifyContent: "center" }}
          >
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
      <CreateNewAccountModal
        columns={columnsData}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        selectableObjectData={selectableObjectData}
        validationFields={validationFields}
        validationAgents={validationAgents}
        staticValue={staticValue}
      />
    </div>
  );
};

export default Table;
