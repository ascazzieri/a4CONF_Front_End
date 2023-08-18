import { Card, CardContent, CardMedia, Button } from "@mui/material"
import { useNavigate } from "react-router-dom";
import Dashboard from "./dashboard/page";

const NoPage = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard");
  };

  return (
    <Card sx={{ height: 450, width: '100%' }}>
      <CardMedia
        sx={{ height: 350 }}
        image="/img/404.jpg"
        title="Did you get lost?"
      />
      <CardContent sx={{ textAlign: 'center' }}>
        <Button variant="contained" onClick={handleClick}>Go Home</Button>
      </CardContent>
    </Card >);
};

export default NoPage;