import { Button, ButtonGroup, Typography } from "@mui/material";
import {
    useAppDispatch,
    useAppSelector,
} from "../../app/store/configureStore";
import { decrement, increment } from "./counterSlice";

export default function ContactPage() {
    const dispatch = useAppDispatch();
    const { data, title } = useAppSelector((state) => state.counter);

    return (
        <>
            <Typography variant="h5">{title}</Typography>
            <Typography variant="h5">The data is: {data}</Typography>
            <ButtonGroup variant="contained">
                <Button
                    onClick={() => dispatch(decrement(1))}
                    color="error"
                >
                    Dec
                </Button>
                <Button
                    onClick={() => dispatch(increment(1))}
                    color="primary"
                >
                    Inc
                </Button>
            </ButtonGroup>
        </>
    );
}
