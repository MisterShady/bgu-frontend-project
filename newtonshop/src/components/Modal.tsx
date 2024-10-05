import React from 'react';
import { AirpodsDto, IpadDto, IphoneDto, WatchDto } from '../types';

interface ModalProps {
    item: AirpodsDto | IpadDto | IphoneDto | WatchDto;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ item, onClose }) => {
    const renderCommonDetails = () => (
        <>
            <h2>{item.title}</h2>
            <p>Цена: {item.price}</p>
            <img src={item.thumbUrl} alt={item.title} className="modal-image" />
        </>
    );

    const renderAirpodsDetails = (item: AirpodsDto) => (
        <div>
            {renderCommonDetails()}
            <h3>Аудио функции</h3>
            <p>{item.audioFeatures.length > 0 ? item.audioFeatures.join(', ') : 'Нет данных'}</p>

            <h3>Сенсоры</h3>
            <p>{item.sensors.join(', ')}</p>

            <h3>Микрофон</h3>
            <p>{item.mic}</p>

            <h3>Чип</h3>
            <p>{item.chip}</p>

            <h3>Управление</h3>
            <p>{item.controls.join(', ')}</p>

            <h3>Размеры</h3>
            <p>Высота: {item.size.height}, Ширина: {item.size.width}, Глубина: {item.size.depth}, Вес: {item.size.weight}</p>

            <h3>Аккумулятор</h3>
            <p>{item.battery}</p>

            <h3>Подключение</h3>
            <p>{item.connectivity}</p>

            <h3>Защита</h3>
            <p>{item.resistance}</p>

            <h3>Комплектация</h3>
            <p>{item.packageEquipments.join(', ')}</p>

            <h3>Доступность</h3>
            <p>{item.accessibilities.join(', ')}</p>

            <h3>Тип кейса</h3>
            <p>{item.caseType}</p>
        </div>
    );

    const renderIpadDetails = (item: IpadDto) => (
        <div>
            {renderCommonDetails()}
            <h3>Экран</h3>
            <p>Тип: {item.display?.type || 'Нет данных'}</p>
            <p>Размер: {item.display?.screen?.large?.size || 'Нет данных'}</p>
            <p>Разрешение: {item.display?.screen?.large?.resolution || 'Нет данных'}</p>
            <p>Яркость: {item.display?.brightness || 'Нет данных'}</p>

            <h3>Чипсет</h3>
            <p>Процессор: {item.chipset?.cpu || 'Нет данных'}</p>
            <p>Память: {item.chipset?.storage || 'Нет данных'}, RAM: {item.chipset?.ram || 'Нет данных'}</p>

            <h3>Аккумулятор</h3>
            <p>Время работы: {item.battery?.lifetime || 'Нет данных'}</p>

            <h3>Размеры</h3>
            {item.dimensions?.length > 0 ? (
                <p>Высота: {item.dimensions[0].height}, Ширина: {item.dimensions[0].width}</p>
            ) : (
                <p>Размеры не указаны</p>
            )}
        </div>
    );

    const renderIphoneDetails = (item: IphoneDto) => (
        <div>
            {renderCommonDetails()}
            <h3>Экран</h3>
            <p>Тип: {item.display?.type || 'Нет данных'}</p>
            <p>Размер: {item.display?.screen?.large?.size || 'Нет данных'}</p>
            <p>Разрешение: {item.display?.screen?.large?.resolution || 'Нет данных'}</p>
            <p>Яркость: {item.display?.brightness || 'Нет данных'}</p>

            <h3>Чипсет</h3>
            <p>Процессор: {item.chipset?.cpu || 'Нет данных'}</p>
            <p>Память: {item.chipset?.storage || 'Нет данных'}, RAM: {item.chipset?.ram || 'Нет данных'}</p>

            <h3>Аккумулятор</h3>
            <p>Время работы: {item.battery?.lifetime || 'Нет данных'}</p>
        </div>
    );

    const renderWatchDetails = (item: WatchDto) => (
        <div>
            {renderCommonDetails()}
            <h3>Экран</h3>
            <p>Тип: {item.display?.type || 'Нет данных'}</p>
            <p>Размер: {item.display?.screen?.large?.size || 'Нет данных'}</p>
            <p>Яркость: {item.display?.brightness || 'Нет данных'}</p>

            <h3>Чипсет</h3>
            <p>Процессор: {item.chipset?.cpu || 'Нет данных'}</p>
            <p>Память: {item.chipset?.storage || 'Нет данных'}, RAM: {item.chipset?.ram || 'Нет данных'}</p>

            <h3>Водонепроницаемость</h3>
            <p>Вода: {item.resistance?.water || 'Нет данных'}</p>
            <p>Пыль: {item.resistance?.dust || 'Нет данных'}</p>

            <h3>Размеры</h3>
            {item.dimensions?.length > 0 ? (
                <p>Высота: {item.dimensions[0].height}, Ширина: {item.dimensions[0].width}</p>
            ) : (
                <p>Размеры не указаны</p>
            )}
        </div>
    );

    return (
        <div className="modal">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>Закрыть</button>
                {item.type === 'airpods' && renderAirpodsDetails(item as AirpodsDto)}
                {item.type === 'ipad' && renderIpadDetails(item as IpadDto)}
                {item.type === 'iphone' && renderIphoneDetails(item as IphoneDto)}
                {item.type === 'watch' && renderWatchDetails(item as WatchDto)}
            </div>
        </div>
    );
};

export default Modal;
