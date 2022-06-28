import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "../../app/store/configureStore";
import { signInUser } from "./accountSlice";
import { history } from "../..";

export default function Login() {
    let location = useLocation();
    //@ts-ignore
    let from = location.state?.from?.pathname || "/catalog";

    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm({
        mode: "all",
    });

    async function submitForm(data: FieldValues) {
        try {
            await dispatch(signInUser(data));
            history.replace(from);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container
            component={Paper}
            maxWidth="xs"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 4,
            }}
        >
            {/* <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                > */}
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit(submitForm)}
                noValidate
                sx={{ mt: 1 }}
            >
                <TextField
                    margin="normal"
                    fullWidth
                    label="Username"
                    // autoComplete="username"
                    autoFocus
                    {...register("username", {
                        required: "Username is required",
                    })}
                    error={!!errors.username}
                    //@ts-ignore
                    helperText={errors?.username?.message}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Password"
                    type="password"
                    // autoComplete="current-password"
                    {...register("password", {
                        required: "Password is required",
                    })}
                    error={!!errors.password}
                    //@ts-ignore
                    helperText={errors?.password?.message}
                />
                <LoadingButton
                    loading={isSubmitting}
                    // disabled={!isValid}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Log In
                </LoadingButton>
                <Grid container>
                    {/* <Grid item xs>
                        <Link href="#" variant="body2">
                            Forgot password?
                        </Link>
                    </Grid> */}
                    <Grid item>
                        <Link to="/register">
                            {"Don't have an account? Register"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
            {/* </Box> */}
        </Container>
    );
}
