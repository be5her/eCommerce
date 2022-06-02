import {
    Button,
    Container,
    Divider,
    Paper,
    Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function ServerError() {
    const navigate = useNavigate();
    const location = useLocation();
    const state: any = location.state;

    return (
        <Container component={Paper}>
            {state?.errors ? (
                <>
                    <Typography
                        variant="h3"
                        color="error"
                        gutterBottom
                    >
                        {state.errors.title}
                    </Typography>
                    <Divider />
                    <Typography>
                        {state.errors.detail ||
                            "Internal server error"}
                    </Typography>
                </>
            ) : (
                <Typography variant="h5" gutterBottom>
                    Server error
                </Typography>
            )}
            <Button onClick={() => navigate("/catalog")}>
                Go back to the store
            </Button>
        </Container>
    );
}
