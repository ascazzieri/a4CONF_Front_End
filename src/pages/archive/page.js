import ErrorCacher from "../../components/Errors/ErrorCacher";
import {
    Grid,
    Box,
    Card,
    CardContent,
    CardActions,
    CardMedia,
    Container,
    Typography,
  } from "@mui/material";
export function Archive() {
    return (
        
        <ErrorCacher>
          <Container sx={{ flexGrow: 1 }} disableGutters>
            <Card sx={{ mt: 1 }}>
            <h1>Archive</h1>
            </Card>
          </Container>
        </ErrorCacher>
      );
    }