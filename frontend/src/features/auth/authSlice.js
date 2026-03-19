import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/login', credentials);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/register', userData);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        loginSuccess: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
            .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload.message; })
            .addCase(register.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; });
    },
});

export const { logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
