import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser, checkAuth } from "./api/authApi";

const initialState = {
  isLoggedIn: false,
  user: null,
  role: null,
  status: "idle",
  error: null,
}


export const loginAsync = createAsyncThunk(
  "auth/login",
  async (loginInfo, { rejectWithValue }) => {
    try{
      const response = await loginUser(loginInfo);
      // 서버 응답에서 user_uuid와 role을 직접 추출
      const { user_uuid, role, message } = response; 
      
      // user 객체를 수동으로 구성하여 반환
      const user = { user_uuid, role }; // user_uuid를 포함한 user 객체 생성

      return { user, role, message }; // message도 함께 반환할 수 있음
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue({ message: error.response.data.message });
      }
      return rejectWithValue({ message: error.message || '로그인에 실패했습니다.' });
    }
  } 
)

export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      return { user: null, role: null };
    } catch (error) {
      return rejectWithValue(error.message || '로그아웃에 실패했습니다.');
    }
  }
)

export const checkAuthAsync = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const response = await checkAuth();
      const { isLoggedIn, user } = response;

      const role = user?.role;
      return { isLoggedIn, user, role };
    } catch (error) {
      return rejectWithValue(error.message || '인증 확인에 실패했습니다.');
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.role = null;
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        console.log("[authSlice] 로그인 성공 후 payload:", action.payload); // payload 전체 확인
        console.log("[authSlice] 로그인 성공 후 user:", action.payload.user); // user 객체 확인
        console.log("[authSlice] 로그인 성공 후 role:", action.payload.role);

        state.status = "succeeded";
        state.isLoggedIn = true;
        state.user = action.payload.user; // 이제 user_uuid가 포함된 user 객체가 할당됨
        state.role = action.payload.role;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logoutAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.status = "idle";
        state.isLoggedIn = false;
        state.user = null;
        state.role = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        console.log("[authSlice] checkAuth 결과:", action.payload); // 여기도 중요
        state.status = "succeeded";
        state.isLoggedIn = action.payload.isLoggedIn;
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {  
        state.status = "failed";
        state.error = action.payload;
        state.isLoggedIn = false;
        state.user = null;
        state.role = null;
      });
  },
});

export default authSlice.reducer;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;
export const selectRole = (state) => state.auth.role;
export const selectStatus = (state) => state.auth.status;
export const selectError = (state) => state.auth.error;
