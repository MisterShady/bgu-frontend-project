import {useAppDispatch, useAppSelector} from "../hooks";
import {setAge, setName, setSurname} from "./userSlice";
import styles from './styles.module.css';
import {ChangeEvent} from "react";

export const UserForm = () => {
    const {name, surname, age} = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setName(e.target.value));
    };

    const handleChangeSurname = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setSurname(e.target.value));
    };

    const handleChangeAge = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setAge(Number(e.target.value)));
    };

    return (
        <form className={styles.form}>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" value={name} onChange={handleChangeName}/>

            <label htmlFor="surname">Surname</label>
            <input id="surname" type="text" value={surname} onChange={handleChangeSurname}/>

            <label htmlFor="age">Age</label>
            <input id="age" type="number" value={age ?? 0} onChange={handleChangeAge}/>

            <button type="submit">Submit</button>
        </form>
    );
};