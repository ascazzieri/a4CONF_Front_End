import { Stack, Button } from "@mui/material"
import { ArrowBackIos } from "@mui/icons-material"
import { useLocation, useNavigate } from "react-router-dom";
export default function BackButton(props) {
    const { pageTitle } = props
    const location = useLocation();
    const currentURLArray = location.pathname.split("/");

    const navigate = useNavigate();

    const handleClick = (name) => {
        currentURLArray.pop()
        navigate(`/${currentURLArray.toString().replace(',', '')}`);
    }


    return (
        <div style={{margin: '10px 0px'}}>
            <Stack direction="row" spacing={4} alignItems="center" justifyContent="flex-start">
                <Button variant="outlined" color="secondary" startIcon={<ArrowBackIos />} onClick={handleClick}>
                    Back
                </Button>
                <h2 style={{fontWeight: 800, fontSize: 30 }}>{pageTitle}</h2>
            </Stack>
        </div>
    )
}