import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type UserState = {
    name: string
    surname: string
    age: number | null
}

const initialState: UserState = {
    name: '',
    surname: '',
    age: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload
        },
        setSurname: (state, action: PayloadAction<string>) => {
            state.surname = action.payload
        },
        setAge: (state, action: PayloadAction<null | number>) => {
            state.age = action.payload
        },
        resetUser: () => initialState
    }
})
export const {setName, setSurname, setAge, resetUser} = userSlice.actions
export default userSlice.reducer