// hooks.ts
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected = unknown>(selector: (state: RootState) => TSelected) => useSelector(selector);
