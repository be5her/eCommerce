import { Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import BasketSummary from "./BasketSummary";
import BasketTAble from "./BasketTable";

export default function BasketPage() {
    const { basket } = useAppSelector((state) => state.basket);

    if (!basket)
        return (
            <Typography variant="h3">Your basket is empty</Typography>
        );

    return (
        <Grid container justifyContent="right" spacing={1}>
            <Grid item xs={12} lg={8}>
                <BasketTAble items={basket.items} />
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
