import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../store/configureStore";

interface Props {
    roles?: string[];
    children: JSX.Element;
}
export default function RequireAuth({ children, roles }: Props) {
    const { user } = useAppSelector((state) => state.account);
    let location = useLocation();

    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }
    if (roles && !roles?.some((r) => user.roles?.includes(r))) {
        toast.error("Not authorized to access this area");
        return <Navigate to="/catalog" />;
    }

    return children;
}
