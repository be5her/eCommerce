import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyUser } from "../../features/account/accountSlice";
import { useAppDispatch } from "../store/configureStore";

export default function EmailVerify() {
    const { token } = useParams<{ token: string }>();
    const dispatch = useAppDispatch();
    if (token) {
        dispatch(verifyUser(token))
            .then((data) => {
                if (data.type.includes("fulfilled"))
                    toast.success("Email confirmed Successfully");
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return <Navigate to="/catalog" />;
}
