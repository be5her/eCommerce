import {
    CssBaseline,
    Container,
    createTheme,
    ThemeProvider,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./Header";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import ContactPage from "../../features/contact/ContactPage";
import HomePage from "../../features/home/HomePage";
import AboutPage from "../../features/about/AboutPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import Register from "../../features/account/Register";
import Login from "../../features/account/Login";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import RequireAuth from "./RequireAuth";
import Orders from "../../features/orders/Orders";
import CheckoutWrapper from "../../features/checkout/CheckoutWrapper";

function App() {
    // const { setBasket } = useStoreContext();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    const requestUser = useRef(false);

    const initApp = useCallback(async () => {
        try {
            if (!requestUser.current) {
                await dispatch(fetchCurrentUser());
                //@ts-ignore
                requestUser.current = true;
            }
            await dispatch(fetchBasketAsync());
        } catch (error) {
            console.log(error);
        }
    }, [dispatch]);

    useEffect(() => {
        initApp().then(() => setLoading(false));
    }, [initApp]);

    const [darkMode, setDarkMode] = useState(true);
    const paletteType = darkMode ? "dark" : "light";
    const theme = createTheme({
        palette: {
            mode: paletteType,
            background: {
                default:
                    paletteType === "light" ? "#eaeaea" : "#121212",
            },
        },
    });

    function handleThemeChange() {
        setDarkMode(!darkMode);
    }

    if (loading) return <LoadingComponent message="starting..." />;

    return (
        <ThemeProvider theme={theme}>
            <ToastContainer
                position="bottom-right"
                hideProgressBar
                theme="colored"
                closeOnClick={false}
            />
            <CssBaseline />
            <Header
                darkMode={darkMode}
                handleThemeChange={handleThemeChange}
            />
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
            <Container sx={{ mt: 4, mb: 2 }}>
                <Routes>
                    <Route path="/" />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route
                        path="/catalog/:id"
                        element={<ProductDetails />}
                    />
                    <Route path="/about" element={<AboutPage />} />
                    <Route
                        path="/contact"
                        element={<ContactPage />}
                    />
                    <Route path="/basket" element={<BasketPage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/checkout"
                        element={
                            <RequireAuth>
                                <CheckoutWrapper />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/orders"
                        element={
                            <RequireAuth>
                                <Orders />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/server-error"
                        element={<ServerError />}
                    />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Container>
        </ThemeProvider>
    );
}

export default App;
