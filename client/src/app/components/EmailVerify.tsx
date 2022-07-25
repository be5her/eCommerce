import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import agent from "../api/agent";

export default function EmailVerify() {
    const { token } = useParams<{ token: string }>();

    var response = agent.Account.verifyEmail(token!);
    response
        .then((data) => {
            if (data === "Email Confirmed") {
                toast.success("Email Confirmed. you can log in now");
            }
        })
        .catch((error) => {
            console.log(error);
        });

    return <Navigate to="/login" />;
}
