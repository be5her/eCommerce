import { ShoppingCart } from "@mui/icons-material";
import {
    AppBar,
    Badge,
    Box,
    FormControlLabel,
    FormGroup,
    IconButton,
    List,
    ListItem,
    Switch,
    Toolbar,
    Typography,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
}

const midLinks = [
    { title: "catalog", path: "/catalog" },
    { title: "about", path: "/about" },
    { title: "contact", path: "/contact" },
];

const rightLinks = [
    { title: "login", path: "/login" },
    { title: "register", path: "/register" },
];

const navStyles = {
    color: "inherit",
    typography: "h6",
    textDecoration: "none",
    "&:hover": {
        color: "grey.500",
    },
    "&.active": {
        color: "text.secondary",
    },
};

export default function Header({
    darkMode,
    handleThemeChange,
}: Props) {
    const { basket } = useAppSelector((state) => state.basket);
    const { user } = useAppSelector((state) => state.account);
    const itemCount = basket?.items.reduce(
        (sum: number, item) => sum + item.quantity,
        0
    );
    return (
        <AppBar position="static">
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box display="flex" alignItems="center">
                    <Typography
                        variant="h6"
                        component={NavLink}
                        to="/"
                        sx={navStyles}
                    >
                        Re-Store
                    </Typography>
                    <FormGroup>
                        <FormControlLabel
                            sx={{ ml: 2 }}
                            control={
                                <Switch
                                    checked={darkMode}
                                    onChange={handleThemeChange}
                                />
                            }
                            label="Dark Mode"
                        />
                    </FormGroup>
                </Box>

                <Box>
                    <List sx={{ display: "flex" }}>
                        {midLinks.map(({ title, path }) => (
                            <ListItem
                                component={NavLink}
                                to={path}
                                key={path}
                                sx={navStyles}
                            >
                                {title.toUpperCase()}
                            </ListItem>
                        ))}
                        {user && user.roles?.includes("Admin") && (
                            <ListItem
                                component={NavLink}
                                to={"/inventory"}
                                sx={navStyles}
                            >
                                INVENTORY
                            </ListItem>
                        )}
                    </List>
                </Box>

                <Box display="flex" alignItems="center">
                    <IconButton
                        component={Link}
                        to="/basket"
                        size="large"
                        sx={{ color: "inherit" }}
                    >
                        <Badge
                            badgeContent={itemCount}
                            color="secondary"
                        >
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    {user ? (
                        <SignedInMenu />
                    ) : (
                        <List sx={{ display: "flex" }}>
                            {rightLinks.map(({ title, path }) => (
                                <ListItem
                                    component={NavLink}
                                    to={path}
                                    key={path}
                                    sx={navStyles}
                                >
                                    {title.toUpperCase()}
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
