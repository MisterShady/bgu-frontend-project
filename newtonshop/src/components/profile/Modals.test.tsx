import React from 'react';
import { render, screen } from '@testing-library/react';
import Modals from './Modals';

describe('Modals Component', () => {
    test('renders "Вы уверены, что хотите удалить свой профиль?" text', () => {
        render(
            <Modals
                isModalOpen={true}
                modalAction="delete"
                isLogoutModalOpen={false}
                closeModal={() => {}}
                closeLogoutModal={() => {}}
                handleModalConfirm={() => {}}
                handleLogoutConfirm={() => {}}
            />
        );

        const deleteProfileText = screen.getByText(/Вы уверены, что хотите удалить свой профиль\?/i);
        expect(deleteProfileText).toBeInTheDocument();
    });

    test('renders "Вы уверены, что хотите изменить свой профиль?" text', () => {
        render(
            <Modals
                isModalOpen={true}
                modalAction="update"
                isLogoutModalOpen={false}
                closeModal={() => {}}
                closeLogoutModal={() => {}}
                handleModalConfirm={() => {}}
                handleLogoutConfirm={() => {}}
            />
        );

        const updateProfileText = screen.getByText(/Вы уверены, что хотите изменить свой профиль\?/i);
        expect(updateProfileText).toBeInTheDocument();
    });

    test('renders "Вы уверены, что хотите выйти из аккаунта?" text', () => {
        render(
            <Modals
                isModalOpen={false}
                modalAction=""
                isLogoutModalOpen={true}
                closeModal={() => {}}
                closeLogoutModal={() => {}}
                handleModalConfirm={() => {}}
                handleLogoutConfirm={() => {}}
            />
        );

        const logoutText = screen.getByText(/Вы уверены, что хотите выйти из аккаунта\?/i);
        expect(logoutText).toBeInTheDocument();
    });
});