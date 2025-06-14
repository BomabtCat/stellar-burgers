import { getIngredientsApi } from '../../../utils/burger-api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export type TIngState = {
  ings: TIngredient[];
  isLoading: boolean;
  err: string | null;
};

const initialState: TIngState = {
  ings: [],
  isLoading: true,
  err: null
};

export const fetchIngs = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ings/fetchIngs', async (_, { rejectWithValue }) => {
  try {
    const res = await getIngredientsApi();
    return res;
  } catch (e) {
    return rejectWithValue('Ошибка при получении ингредиентов');
  }
});

export const ingSlice = createSlice({
  name: 'ings',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchIngs.pending, (s) => {
      s.isLoading = true;
      s.err = null;
    })
      .addCase(fetchIngs.fulfilled, (s, a: PayloadAction<TIngredient[]>) => {
        s.ings = a.payload;
        s.isLoading = false;
      })
      .addCase(fetchIngs.rejected, (s, a) => {
        s.isLoading = false;
        s.err = a.payload || 'Неизвестная ошибка';
      });
  }
});

export const ingSelectors = {
  ingSel: (st: { ings: TIngState }) => st.ings.ings,
  isLoadingSel: (st: { ings: TIngState }) => st.ings.isLoading,
  errSel: (st: { ings: TIngState }) => st.ings.err
};

export default ingSlice.reducer;
