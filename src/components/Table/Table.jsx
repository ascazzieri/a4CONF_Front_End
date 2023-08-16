import React, { useCallback, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { ExportToCsv } from "export-to-csv";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { Delete, Edit, Add, FileDownload } from "@mui/icons-material";

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  selectableObjectData,
}) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    //put your validation logic here
    console.log(values);
    onSubmit(values);
    onClose();
  };

  let MenuItemIterator = [];

  if (
    selectableObjectData &&
    selectableObjectData?.internal_key !== undefined
  ) {
    selectableObjectData.data.map((item, index) =>
      MenuItemIterator.push(item[`${selectableObjectData?.internal_key}`])
    );
  } else if (
    selectableObjectData &&
    selectableObjectData?.internal_key === undefined
  ) {
    selectableObjectData.data.map((item, index) => MenuItemIterator.push(item));
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
            {columns.map((column, index) => {
              if (
                selectableObjectData?.enabled &&
                selectableObjectData?.accessorKey === column?.accessorKey
              ) {
                return (
                  <TextField
                    select
                    key={index}
                    label={column.header}
                    name={column.accessorKey}
                    defaultValue={
                      selectableObjectData?.internal_key !== undefined
                        ? MenuItemIterator[0]
                        : selectableObjectData.data[0]
                    }
                    onBlur={(e) => {
                      setValues({ ...values, [e.target.name]: e.target.value });
                    }}
                  >
                    {MenuItemIterator.map((item) => (
                      <MenuItem key={Math.random() + item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              } else {
                return (
                  <TextField
                    key={index}
                    label={column.header}
                    name={column.accessorKey}
                    onBlur={(e) => {
                      setValues({ ...values, [e.target.name]: e.target.value });
                    }}
                  />
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
  const { tableData, setTableData, columnsData, selectableObjectData } = props;

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      /* if (
        !confirm(`Are you sure you want to delete ${row.getValue("firstName")}`)
      ) {
        return;
      } */
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData]
  );

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

  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter.generateCsv(tableData);
  };

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "email"
              ? validateEmail(event.target.value)
              : cell.column.id === "age"
                ? validateAge(+event.target.value)
                : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

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
        onEditingRowCancel={handleCancelRowEdits}
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}
          >
            <Button onClick={() => setCreateModalOpen(true)}>
              <Add />
            </Button>
            {tableData && Object.keys(tableData).length !== 0 && <Button
              color="primary"
              //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
              onClick={handleExportData}
              startIcon={<FileDownload />}
              variant="contained"
            >
              Export Table Data
            </Button>}

          </Box>
        )}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }} style={{ justifyContent: 'center' }}>
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
      />
    </div>
  );
};

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default Table;
