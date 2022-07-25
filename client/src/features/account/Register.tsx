import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { history } from "../..";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";

export default function Register() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { isSubmitting, errors },
    } = useForm({
        mode: "all",
    });

    function handleApiErrors(errors: any) {
        if (errors) {
            errors.forEach((error: string) => {
                if (error.includes("Password")) {
                    setError("password", { message: error });
                } else if (error.includes("Email")) {
                    setError("email", { message: error });
                } else if (error.includes("Username")) {
                    setError("username", { message: error });
                }
            });
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
                Register in
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit((data) =>
                    agent.Account.register(data)
                        .then(() => {
                            toast.success(
                                "Registration successful - You need to verify your email before you can log in"
                            );
                            history.push("/login");
                        })
                        .catch((error) => handleApiErrors(error))
                )}
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
                    label="Email address"
                    // autoComplete="email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                            message: "Not a valid email",
                        },
                    })}
                    error={!!errors.email}
                    //@ts-ignore
                    helperText={errors?.email?.message}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Password"
                    type="password"
                    // autoComplete="current-password"
                    {...register("password", {
                        required: "Password is required",
                        pattern: {
                            value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                            message: "Password is not strong enough",
                        },
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
                    Register
                </LoadingButton>
                <Grid container>
                    {/* <Grid item xs>
                        <Link href="#" variant="body2">
                            Forgot password?
                        </Link>
                    </Grid> */}
                    <Grid item>
                        <Link to="/login">
                            {"Already have an account? Log in"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
            {/* </Box> */}
        </Container>
    );
}
