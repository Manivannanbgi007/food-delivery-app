import { useDispatch, useSelector } from 'react-redux';

/** Use these instead of useDispatch / useSelector: they know the store's types. */
export const useAppDispatch = useDispatch.withTypes();
export const useAppSelector = useSelector.withTypes();
