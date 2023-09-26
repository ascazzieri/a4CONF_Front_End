import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import { SuperUserContext } from "../../utils/context/SuperUser";

const PrivateRoute = ({ authenticated, superUserRequired, children }) => {

    const superUser = useContext(SuperUserContext)

    const navigate = useNavigate()

    if (superUserRequired && superUser[0] && authenticated) {

        return children

    } else if (superUserRequired && !superUser[0]) {
        navigate('/login', { state: { elevation: true }, replace: true });
    } else {
        return authenticated ? children : <Navigate to="/login" />;
    }

};

export default PrivateRoute