import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ProfileState = {
  username: string;
  is_active: boolean;
  created_at: string;
  role: string;
};

const initialState: ProfileState = {
  username: "",
  is_active: false,
  created_at: "",
  role: "",
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(_, action: PayloadAction<ProfileState>) {
        return action.payload;
      },
      clearProfile() {
        return initialState;
      },
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;