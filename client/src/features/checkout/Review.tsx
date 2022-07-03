import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "../../app/store/configureStore";
import BasketSummary from "../basket/BasketSummary";
import BasketTAble from "../basket/BasketTable";

export default function Review() {
    const { basket } = useAppSelector((state) => state.basket);

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Order summary
            </Typography>
            <Grid container spacing={2}>
                {basket && (
                    <Grid item xs={12} lg={9}>
                        <BasketTAble
                            items={basket.items}
                            isBasket={false}
                        />
                    </Grid>
                )}
                <Grid item xs={12} lg={3}>
                    <BasketSummary />
                </Grid>
            </Grid>
        </>
    );
}
