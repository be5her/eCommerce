import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
    Box,
    Button,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";
import { currencyFormat } from "../../app/util/util";
import BasketSummary from "./BasketSummery";

export default function BasketPage() {
    const { basket, setBasket, removeItem } = useStoreContext();
    const [status, setStatus] = useState({
        loading: false,
        name: "",
    });

    function handleAddItem(productId: number, name: string) {
        setStatus({ loading: true, name });
        agent.Basket.addItem(productId)
            .then((basket) => setBasket(basket))
            .catch((error) => console.log(error))
            .finally(() =>
                setStatus({
                    loading: false,
                    name: "",
                })
            );
    }

    function handleRemoveItem(
        productId: number,
        quantity = 1,
        name: string
    ) {
        setStatus({
            loading: true,
            name,
        });
        agent.Basket.removeItem(productId, quantity)
            .then(() => removeItem(productId, quantity))
            .catch((error) => console.log(error))
            .finally(() =>
                setStatus({
                    loading: false,
                    name: "",
                })
            );
    }

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
                                                status.loading &&
                                                status.name ===
                                                    "rem" + item.name
                                            }
                                            onClick={() =>
                                                handleRemoveItem(
                                                    item.productId,
                                                    1,
                                                    `rem${item.name}`
                                                )
                                            }
                                            color="error"
                                        >
                                            <Remove />
                                        </LoadingButton>
                                        {item.quantity}
                                        <LoadingButton
                                            loading={
                                                status.loading &&
                                                status.name ===
                                                    "add" + item.name
                                            }
                                            onClick={() =>
                                                handleAddItem(
                                                    item.productId,
                                                    `add${item.name}`
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
                                                status.loading &&
                                                status.name ===
                                                    "del" + item.name
                                            }
                                            onClick={() =>
                                                handleRemoveItem(
                                                    item.productId,
                                                    item.quantity,
                                                    `del${item.name}`
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
