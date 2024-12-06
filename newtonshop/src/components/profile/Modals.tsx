import React from "react";

interface ModalsProps {
  isModalOpen: boolean;
  modalAction: string;
  isLogoutModalOpen: boolean;
  closeModal: () => void;
  closeLogoutModal: () => void;
  handleModalConfirm: () => void;
  handleLogoutConfirm: () => void;
}

const Modals = ({
  isModalOpen,
  modalAction,
  isLogoutModalOpen,
  closeModal,
  closeLogoutModal,
  handleModalConfirm,
  handleLogoutConfirm,
}: ModalsProps) => {
  return (
    <>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>
              {modalAction === "delete"
                ? "Вы уверены, что хотите удалить свой профиль?"
                : "Вы уверены, что хотите изменить свой профиль?"}
            </p>
            <div className="modal-buttons">
              <button className="modal-button yes-button" onClick={handleModalConfirm}>
                Да
              </button>
              <button className="modal-button no-button" onClick={closeModal}>
                Нет
              </button>
            </div>
          </div>
        </div>
      )}
      {isLogoutModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Вы уверены, что хотите выйти из аккаунта?</p>
            <div className="modal-buttons">
              <button className="modal-button yes-button" onClick={handleLogoutConfirm}>
                Да
              </button>
              <button className="modal-button no-button" onClick={closeLogoutModal}>
                Нет
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modals;
