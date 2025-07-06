import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAsync, selectIsLoggedIn, selectUser, selectRole, selectStatus, selectError } from "../authSlice";

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLoggedIn = useSelector(selectIsLoggedIn);
    const user = useSelector(selectUser);
    const role = useSelector(selectRole);
    const status = useSelector(selectStatus);
    const error = useSelector(selectError);

    const handleLogin = async (loginInfo) => {
        if (status === "loading") return;
    
        const resultAction = await dispatch(loginAsync(loginInfo));
        if (loginAsync.fulfilled.match(resultAction)) {
            const userRole = resultAction.payload?.role;
            if (userRole === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } else if (loginAsync.rejected.match(resultAction)) {
            const errorMsg = resultAction?.payload?.message || "로그인 실패";
            alert(errorMsg);
            console.error("로그인 실패");
        }
    }

    return {
        isLoggedIn,
        user,
        role,
        status,
        error,
        login: handleLogin,
    };
}