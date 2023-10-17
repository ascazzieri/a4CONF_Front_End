import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateBackChannel } from "../../utils/redux/reducers";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import { JSONTree } from "react-json-tree";
import Table from "../../components/Table/Table";
import SecondaryNavbar from "../../components/SecondaryNavbar/SecondaryNavbar";
import {
  Container,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  Button,
  Divider,
} from "@mui/material";
export default function BackChannel() {
  const backChannel = useSelector((state) => state?.services?.backchannel);

  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = ["Topics", "File names", "JSON"];

  const getTableArray = (data, type) => {
    let tableData = [];
    if (data && data.length !== 0) {
      tableData = data.map((item) => ({ [`${type}`]: item }));
    }
    return tableData;
  };
  const [topicsTableData, setTopicsTableData] = useState(
    getTableArray(backChannel?.topics, "topics")
  );
  const [filesTableData, setFilesTableData] = useState(
    getTableArray(backChannel?.files, "files")
  );


  useEffect(() => {
    setTopicsTableData(getTableArray(backChannel?.topics, "topics"))
    setFilesTableData(getTableArray(backChannel?.files, "files"))
  },[backChannel])

  const handleBackChannelChange = (event) => {
    event.preventDefault();

    const topicsArray =
      topicsTableData && topicsTableData.length !== 0
        ? topicsTableData.map((item) => item?.topics)
        : [];
    const filesArray =
      filesTableData && filesTableData.length !== 0
        ? filesTableData.map((item) => item?.files)
        : [];
    const newBackChannel = {
      topics: topicsArray,
      files: filesArray,
    };
    dispatch(updateBackChannel({ newBackChannel }));
  };

  const topicsColumnData = [
    {
      accessorKey: "topics",
      header: "Topics",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
    },
  ];

  const filesColumnData = [
    {
      accessorKey: "files",
      header: "Files",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
    },
  ];

  return (
    <ErrorCacher>
      <Container sx={{ flexGrow: 1 }} disableGutters>
        <Card sx={{ mt: 1 }}>
          <CardContent>
            <Container>
              <h2>Back Channel</h2>
              <SecondaryNavbar
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                navbarItems={navbarItems}
              />
              {currentTab === 2 && <JSONTree data={backChannel} />}

              <form onSubmit={handleBackChannelChange}>
                {currentTab === 0 && (
                  <>
                    <FormLabel>Topics white-list:</FormLabel>

                    <Table
                      tableData={topicsTableData}
                      setTableData={setTopicsTableData}
                      columnsData={topicsColumnData}
                    />

                    <Divider />
                  </>
                )}

                {currentTab === 1 && (
                  <>
                    <FormLabel>File names white-list:</FormLabel>

                    <Table
                      tableData={filesTableData}
                      setTableData={setFilesTableData}
                      columnsData={filesColumnData}
                    />

                    <Divider />
                  </>
                )}

                <FormControl fullWidth>
                  <Button type="submit" variant="contained">
                    Invia
                  </Button>
                </FormControl>
              </form>
            </Container>
          </CardContent>
        </Card>
      </Container>
    </ErrorCacher>
  );
}
