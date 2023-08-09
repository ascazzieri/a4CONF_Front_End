import { useSelector, useDispatch } from "react-redux";
import { updateInternalPC } from "../../utils/redux/reducers";
import JSONPretty from "react-json-pretty";
import VerticalTab from "../../components/VerticalTab/VerticalTab";
import { Grid, Card, CardContent, Container } from "@mui/material";
import { Outlet, useLocation, Link } from "react-router-dom";
import { SparkContext } from "../../components/RerenderSpark/RerenderSparkContext";
import { useContext, useState, useEffect } from "react";

export default function InternalPC() {
  const config = useSelector((state) => state);

  const internalPC = config?.system;
  let onlyInternalPC = Object.keys(internalPC)
    .filter(
      (key) => key !== "network" && key !== "hostname" && key !== "reboot"
    )
    .reduce((obj, key) => {
      obj[key] = internalPC[key];
      return obj;
    }, {});

  /* const industrialIP = useSelector(
    (state) => state.json.config.system.network.industrial.ip
  ); */
  const dispatch = useDispatch();
  const [reRender, setReRender] = useState(false);
  const renderSpark = useContext(SparkContext);

/*   useEffect(() => {
    setReRender(!reRender);
    console.log('re-reinderizzo')
  }, [renderSpark]); */

  const location = useLocation();
  const currentURLArray = location.pathname.split("/");

  const handleInternalPCChange = () => {
    const newInternalPC = {
      onlyinternal: true,
      toProduction: true,
    };
    dispatch(updateInternalPC({ newInternalPC }));
  };

  const tabsData = ["Network", "Kepware"];

  if (currentURLArray.length === 2) {
    return (
      <div>
        <h2>Lista di elementi:</h2>
        <ul>
          <li>
            <Link to="/internal-pc/network">Network</Link>
          </li>
          <li>
            <Link to="/internal-pc/kepware">Kepware</Link>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <Container sx={{ flexGrow: 1 }} disableGutters>
      <Card sx={{ mt: 1 }}>
        <CardContent>
          <VerticalTab tabsData={tabsData} root="internal-pc">
            <Outlet />
          </VerticalTab>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        <Grid item xs={4} sx={{ display: "flex" }}>
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <JSONPretty data={onlyInternalPC} />
              <button onClick={handleInternalPCChange}>
                Change External PC
              </button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8} sx={{ display: "flex" }}>
          <Card sx={{ width: "100%" }}>
            <CardContent style={{ paddingBottom: 16 }}>
              {/* <VerticalTabs tabsData={tabsData} /> */}
              <h3>Qui ci metto altro</h3>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
