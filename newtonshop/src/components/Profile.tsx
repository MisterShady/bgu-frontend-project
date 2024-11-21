import React, {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import "./Profile.css";
import {deleteProfile, getCurrentProfile, getOrders, updateAvatar, updatePassword, updateProfile} from "../Api";
import {ProfileDto} from "../types";
import {categoryMapping} from "./products/AllProducts";
import {
    setAvatar,
    setFormData,
    setExistingProfile,
    setOrders,
    setIsModalOpen,
    setModalAction,
    setIsChangePassword,
    setPasswordData,
    setExpandedOrderId,
    setIsLogoutModalOpen,
} from "./slices/profileSlice";
import {RootState} from "../store";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        avatar,
        formData,
        existingProfile,
        orders,
        isModalOpen,
        modalAction,
        isChangePassword,
        passwordData,
        expandedOrderId,
        isLogoutModalOpen,
    } = useSelector((state: RootState) => state.profile);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getCurrentProfile();
                dispatch(setFormData(data));
                dispatch(setExistingProfile(data));
                dispatch(setAvatar(data.avatar ? `data:image/jpeg;base64,${data.avatar}` : "/image/png/account.png"));
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                dispatch(setOrders(data));
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchUserData();
        fetchOrders();
    }, [dispatch]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        console.log("Logged out and access token removed.");
        navigate("/auth");
        const event = new Event("logout");
        window.dispatchEvent(event);
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64String = reader.result?.toString().split(",")[1];
                if (base64String) {
                    dispatch(setAvatar(`data:image/jpeg;base64,${base64String}`));
                    dispatch(setFormData({...formData, avatar: base64String}));
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleAvatarClick = () => {
        document.getElementById("avatar-upload")?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        dispatch(setFormData({...formData, [name]: value}));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        dispatch(setPasswordData({...passwordData, [name]: value}));
    };

    const handleDeleteProfile = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                await deleteProfile(accessToken);
                handleLogout();
            }
        } catch (error) {
            console.error("Ошибка при удалении профиля:", error);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const updatedData: Partial<ProfileDto> = {};

                if (formData.email && formData.email !== existingProfile.email) updatedData.email = formData.email;
                if (formData.phoneNumber && formData.phoneNumber !== existingProfile.phoneNumber)
                    updatedData.phoneNumber = formData.phoneNumber;
                if (formData.fullName && formData.fullName !== existingProfile.fullName)
                    updatedData.fullName = formData.fullName;
                if (formData.dateOfBirth && formData.dateOfBirth !== existingProfile.dateOfBirth)
                    updatedData.dateOfBirth = formData.dateOfBirth;
                if (formData.avatar && formData.avatar !== existingProfile.avatar) updatedData.avatar = formData.avatar;

                Object.keys(updatedData).forEach((key) => {
                    if (!updatedData[key as keyof Partial<ProfileDto>]) {
                        delete updatedData[key as keyof Partial<ProfileDto>];
                    }
                });

                console.log("Sending update request with data:", updatedData);
                const updatedProfile = await updateProfile(accessToken, updatedData);
                dispatch(setFormData(updatedProfile));
                dispatch(setExistingProfile(updatedProfile));

                if (formData.avatar && formData.avatar !== existingProfile.avatar) {
                    const file = new File([base64ToBlob(formData.avatar)], "avatar.jpg", {type: "image/jpeg"});
                    await updateAvatar(accessToken, file);
                }

                window.location.reload();
            }
        } catch (error) {
            console.error("Ошибка при обновлении профиля:", error);
        }
    };


    const handleUpdatePassword = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                if (passwordData.newPassword !== passwordData.confirmNewPassword) {
                    alert("Новый пароль и подтверждение нового пароля не совпадают");
                    return;
                }

                const updatedProfile = await updatePassword(accessToken, {
                    providedCurrentPassword: passwordData.providedCurrentPassword,
                    newPassword: passwordData.newPassword,
                });
                dispatch(setFormData(updatedProfile));
                dispatch(setExistingProfile(updatedProfile));
                dispatch(setIsChangePassword(false));
            }
        } catch (error) {
            console.error("Ошибка при смене пароля:", error);
        }
    };

    const openModal = (action: string) => {
        dispatch(setModalAction(action));
        dispatch(setIsModalOpen(true));
    };

    const closeModal = () => {
        dispatch(setIsModalOpen(false));
    };

    const openLogoutModal = () => {
        dispatch(setIsLogoutModalOpen(true));
    };

    const closeLogoutModal = () => {
        dispatch(setIsLogoutModalOpen(false));
    };

    const handleModalConfirm = () => {
        if (modalAction === "delete") {
            handleDeleteProfile();
        } else if (modalAction === "update") {
            handleUpdateProfile();
        }
        closeModal();
    };

    const handleLogoutConfirm = () => {
        handleLogout();
        closeLogoutModal();
    };

    const toggleOrderDetails = (orderId: number) => {
        dispatch(setExpandedOrderId(expandedOrderId === orderId ? null : orderId));
    };

    const formatCardNumber = (cardNumber: string) => {
        const lastTwoDigits = cardNumber.slice(-2);
        return "*".repeat(cardNumber.length - 2) + lastTwoDigits;
    };

    const base64ToBlob = (base64: string, contentType: string = 'image/jpeg') => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], {type: contentType});
    };

    return (
        <div className="profile-wrapper">
            <div className="profile-form-container">
                {isChangePassword ? (
                    <>
                        <h2 className="change-password-title">Смена пароля</h2>
                        <form className="password-form">
                            <div className="password-input-container">
                                <label htmlFor="providedCurrentPassword">Старый пароль:</label>
                                <input
                                    type="password"
                                    id="providedCurrentPassword"
                                    name="providedCurrentPassword"
                                    value={passwordData.providedCurrentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className="password-input"
                                />
                            </div>
                            <div className="password-input-container">
                                <label htmlFor="newPassword">Новый пароль:</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className="password-input"
                                />
                            </div>
                            <div className="password-input-container">
                                <label htmlFor="confirmNewPassword">Подтверждение нового пароля:</label>
                                <input
                                    type="password"
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    value={passwordData.confirmNewPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className="password-input"
                                />
                            </div>
                            <div className="button-container">
                                <button type="button" className="rounded-button" onClick={handleUpdatePassword}>
                                    Сохранить пароль
                                </button>
                                <button type="button" className="rounded-button"
                                        onClick={() => dispatch(setIsChangePassword(false))}>
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <div
                            className="avatar-container"
                        >
                            <div onClick={handleAvatarClick} className="avatar-circle">
                                <img src={avatar} alt="Avatar" className="avatar"/>
                            </div>
                            <p className="username">{formData.username}</p>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="file-input"
                                style={{display: "none"}}
                            />
                        </div>
                        <form className="profile-form">
                            <div className="input-row">
                                <div className="profile-input-container">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email || ""}
                                        onChange={handleChange}
                                        required
                                        className="profile-input"
                                    />
                                </div>
                                <div className="profile-input-container">
                                    <label htmlFor="phone">Номер телефона:</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phoneNumber"
                                        value={formData.phoneNumber || ""}
                                        onChange={handleChange}
                                        required
                                        className="profile-input"
                                    />
                                </div>
                            </div>
                            <div className="input-row">
                                <div className="profile-input-container">
                                    <label htmlFor="fullName">ФИО:</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName || ""}
                                        onChange={handleChange}
                                        required
                                        className="profile-input"
                                    />
                                </div>
                                <div className="profile-input-container">
                                    <label htmlFor="birthdate">Дата рождения:</label>
                                    <input
                                        type="date"
                                        id="birthdate"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth || ""}
                                        onChange={handleChange}
                                        required
                                        className="profile-input"
                                    />
                                </div>
                            </div>
                            <div className="button-container">
                                <button type="button" className="rounded-button"
                                        onClick={() => dispatch(setIsChangePassword(true))}>
                                    Сменить пароль
                                </button>
                                <button type="button" className="rounded-button" onClick={() => openModal("update")}>
                                    Сохранить профиль
                                </button>
                                <button type="button" className="rounded-button" onClick={openLogoutModal}>
                                    Выход
                                </button>
                                <button
                                    type="button"
                                    className="rounded-button delete-profile-button"
                                    onClick={() => openModal("delete")}
                                >
                                    Удалить профиль
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
            {!isChangePassword && (
                <>
                    <h3 className="orders-title">Ваши заказы</h3>
                    <div className="orders-container">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <div key={order.id} className="order-item">
                                    <div className={`order-header ${expandedOrderId === order.id ? "expanded" : ""}`}>
              <span>
                Заказ №{order.id} от {order.creationDate}
              </span>
                                        <span className="order-status">в пути</span>
                                        <img
                                            alt="Arrow"
                                            className={`arrow-down ${expandedOrderId === order.id ? "expanded" : ""}`}
                                            onClick={() => toggleOrderDetails(order.id)}
                                            src="/image/svg/arrow.svg"
                                        />
                                    </div>
                                    {expandedOrderId !== order.id && (
                                        <div className="order-details">
                                            <div className="order-images">
                                                {order.cartItems.map((item, index) => (
                                                    <img
                                                        key={index}
                                                        src={item.imageUrl ? item.imageUrl : "/image/placeholder.svg"}
                                                        alt={`Изображение товара ${index + 1}`}
                                                        className="order-image"
                                                    />
                                                ))}
                                            </div>
                                            <div className="order-price">
                                                <span className="total-price">${order.totalPrice}</span>
                                            </div>
                                        </div>
                                    )}
                                    {expandedOrderId === order.id && (
                                        <div className="order-details-expanded">
                                            <p>ФИО: {order.fullName}</p>
                                            <p>Email: {order.email}</p>
                                            <p>Телефон: {order.phoneNumber}</p>
                                            <p>Адрес: {order.address}</p>
                                            <p className={`card-number ${expandedOrderId === order.id ? "expanded" : ""}`}>
                                                Номер карты: {formatCardNumber(order.cardNumber)}
                                            </p>
                                            {order.cartItems.length > 0 ? (
                                                order.cartItems.map((item) => (
                                                    <div key={item.id} className="order-item-product">
                                                        <Link
                                                            to={`/${categoryMapping[item.type.slice(0, 3)]}/${item.productId}`}
                                                            className="product-link"
                                                        >
                                                            <img
                                                                src={item.imageUrl ? item.imageUrl : "/image/placeholder.svg"}
                                                                alt={"Изображение товара"}
                                                                className="order-image"
                                                            />
                                                        </Link>
                                                        <div>
                                                            <Link
                                                                to={`/${categoryMapping[item.type.slice(0, 3)]}/${item.productId}`}
                                                                className="product-link"
                                                            >
                                                                <p>{item.name}</p>
                                                            </Link>
                                                            <p>Количество: {item.quantity}</p>
                                                            <p>
                                                                {item.config.split(",").map((config, index) => (
                                                                    <span key={index}>
                              {config}
                                                                        <br/>
                            </span>
                                                                ))}
                                                            </p>
                                                        </div>
                                                        <p className="price-product">${item.price}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>Нет товаров</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-orders">У вас пока нет заказов</div>
                        )}
                    </div>
                </>
            )}
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
        </div>
    );
};

export default Profile;
