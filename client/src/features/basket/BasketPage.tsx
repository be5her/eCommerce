import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
    Box,
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
    useAppDispatch,
    useAppSelector,
} from "../../app/store/configureStore";
import { currencyFormat } from "../../app/util/util";
import {
    addBasketItemAsync,
    removeBasketItemAsync,
} from "./basketSlice";
import BasketSummary from "./BasketSummery";

export default function BasketPage() {
    const { basket, status } = useAppSelector(
        (state) => state.basket
    );
    const dispatch = useAppDispatch();

    if (!basket)
        return (
            <Typography variant="h3">Your basket is empty</Typography>
        );

    return (
        <Grid container justifyContent="right" spacing={1}>
            <Grid item xs={12} lg={8}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell align="right">
                                    Price
                                </TableCell>
                                <TableCell align="center">
                                    Quantity
                                </TableCell>
                                <TableCell align="right">
                                    Subtotal
                                </TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {basket.items.map((item) => (
                                <TableRow
                                    key={item.productId}
                                    sx={{
                                        "&:last-child td, &:last-child th":
                                            {
                                                border: 0,
                                            },
                                    }}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                    >
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            component={Link}
                                            to={`/catalog/${item.productId}`}
                                            sx={{
                                                textDecoration:
                                                    "none",
                                                color: "inherit",
                                            }}
                                        >
                                            <img
                                                src={item.pictureUrl}
                                                alt={item.name}
                                                style={{
                                                    height: 50,
                                                    marginRight: 20,
                                                }}
                                            />
                                            <span>{item.name}</span>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        {currencyFormat(item.price)}
                                    </TableCell>
                                    <TableCell align="center">
                                        <LoadingButton
                                            loading={
                                                status ===
                                                `pendingRemoveItem${item.productId}rem`
                                            }
                                            onClick={() =>
                                                dispatch(
                                                    removeBasketItemAsync(
                                                        {
                                                            productId:
                                                                item.productId,
                                                            name: "rem",
                                                        }
                                                    )
                                                )
                                            }
                                            color="error"
                                        >
                                            <Remove />
                                        </LoadingButton>
                                        {item.quantity}
                                        <LoadingButton
                                            loading={
                                                status ===
                                                `pendingAddItem${item.productId}`
                                            }
                                            onClick={() =>
                                                dispatch(
                                                    addBasketItemAsync(
                                                        {
                                                            productId:
                                                                item.productId,
                                                        }
                                                    )
                                                )
                                            }
                                            color="success"
                                        >
                                            <Add />
                                        </LoadingButton>
                                    </TableCell>
                                    <TableCell align="right">
                                        {currencyFormat(
                                            item.price * item.quantity
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <LoadingButton
                                            color="error"
                                            loading={
                                                status ===
                                                `pendingRemoveItem${item.productId}del`
                                            }
                                            onClick={() =>
                                                dispatch(
                                                    removeBasketItemAsync(
                                                        {
                                                            productId:
                                                                item.productId,
                                                            quantity:
                                                                item.quantity,
                                                            name: "del",
                                                        }
                                                    )
                                                )
                                            }
                                        >
                                            <Delete />
                                        </LoadingButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <BasketSummary />
                <Button
                    sx={{ marginTop: 1 }}
                    component={Link}
                    to="/checkout"
                    variant="contained"
                    size="large"
                    fullWidth
                >
                    Checkout
                </Button>
            </Grid>
        </Grid>
    );
}
