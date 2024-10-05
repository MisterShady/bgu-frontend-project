export interface AirpodsDto {
    id: string;
    type: string;
    title: string;
    thumbUrl: string;
    price: number;
    audioFeatures: string[];
    sensors: string[];
    mic: string;
    chip: string;
    controls: string[];
    size: {
        height: string;
        width: string;
        depth: string;
        weight: string;
    };
    battery: string;
    connectivity: string;
    resistance: string;
    packageEquipments: string[];
    accessibilities: string[];
    caseType: string;
}

export interface IpadDto {
    id: string;
    type: string;
    title: string;
    thumbUrl: string;
    price: number;
    description: string;
    display: {
        type: string;
        brightness: string;
        ppi: number;
        screen: {
            large: {
                size: string;
                resolution: string;
            }
        }
    };
    chipset: {
        cpu: string;
        storage: string;
        ram: string;
    };
    battery: {
        lifetime: string;
    };
    connectivity: {
        cellular: string;
        wifi: string;
        bluetooth: string;
        ultraWideBand: string;
    };
    sensors: {
        name: string;
        spec: string;
    }[];
    dimensions: {
        size: string;
        height: string;
        width: string;
        depth: string;
        weight: string;
    }[];
}

export interface IphoneDto {
    id: string;
    type: string;
    title: string;
    thumbUrl: string;
    price: number;
    description: string;
    display: {
        type: string;
        brightness: string;
        ppi: number;
        screen: {
            large: {
                size: string;
                resolution: string;
            }
        }
    };
    chipset: {
        cpu: string;
        storage: string;
        ram: string;
    };
    battery: {
        lifetime: string;
    };
    connectivity: {
        cellular: string;
        wifi: string;
        bluetooth: string;
        ultraWideBand: string;
    };
    sensors: {
        name: string;
        spec: string;
    }[];
    dimensions: {
        size: string;
        height: string;
        width: string;
        depth: string;
        weight: string;
    }[];
}

export interface WatchDto {
    id: string;
    type: string;
    title: string;
    thumbUrl: string;
    price: number;
    resistance: {
        water: string;
        dust: string;
    };
    connectivity: {
        cellular: string;
        wifi: string;
        bluetooth: string;
        ultraWideBand: string;
    };
    sensors: {
        name: string;
        spec: string;
    }[];
    display: {
        type: string;
        brightness: string;
        ppi: number;
        screen: {
            large: {
                size: string;
                resolution: string;
            }
        }
    };
    chipset: {
        cpu: string;
        storage: string;
        ram: string;
    };
    battery: {
        lifetime: string;
    };
    caseTypes: {
        material: string;
        description: string;
        colors: string[];
        additionalPrice: number;
    }[];
    bandTypes: {
        material: string;
        description: string;
        styles: {
            name: string;
            description: string;
            colors: string[];
            additionalPrice: number;
        }[];
    }[];
    dimensions: {
        size: string;
        height: string;
        width: string;
        depth: string;
        weight: string;
    }[];
    description: string;
}
