export interface AirpodsDto {
    id: string;
    type: string;
    category: string;
    title: string;
    namingCode: string;
    model: string;
    thumbUrl: string;
    images: string[];
    colors: string[];
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
    category: string;
    title: string;
    namingCode: string;
    model: string;
    thumbUrl: string;
    images: string[];
    colors: string[];
    price: number;
    display: {
        size: string;
        type: string;
        resolution: string;
        ppi: string;
        refreshRate: string;
    };
    processor: {
        chip: string;
        cpu: string;
        gpu: string;
    };
    camera: {
        rearCameras: {
            resolution: string;
            aperture: string;
            type: string;
        }[];
        frontCamera: {
            resolution: string;
            aperture: string;
        };
    };
    memory: string;
    storages: {
        size: string;
        additionalPrice: number;
    }[];
    connectivities: {
        type: string;
        additionalPrice: number;
    }[];
    applePencils: {
        type: string;
        additionalPrice: number;
    }[];
    smartKeyboards: {
        type: string;
        additionalPrice: number;
    }[];
    waterResistance: string;
    battery: {
        capacity: string;
    };
    dimensions: {
        height: string;
        width: string;
        depth: string;
        weight: string;
    };
    operatingSystem: string;
}

export interface IphoneDto {
    id: string;
    type: string;
    category: string;
    title: string;
    namingCode: string;
    model: string;
    thumbUrl: string;
    images: string[];
    colors: string[];
    price: number;
    display: {
        size: string;
        type: string;
        resolution: string;
        ppi: string;
        refreshRate: string;
    };
    processor: {
        chip: string;
        cpu: string;
        gpu: string;
    };
    camera: {
        rearCameras: {
            resolution: string;
            aperture: string;
            type: string;
            features: string[];
        }[];
        frontCamera: {
            resolution: string;
            aperture: string;
            features: string[];
        };
        zoomValues: number[];
    };
    memory: string;
    storages: {
        size: string;
        additionalPrice: number;
    }[];
    connectivities: string[];
    waterResistance: string;
    battery: {
        capacity: string;
        chargingCapabilities: string[];
    };
    dimensions: {
        height: string;
        width: string;
        depth: string;
        weight: string;
    };
    operatingSystem: string;
}

export interface WatchDto {
    id: string;
    type: string;
    category: string;
    title: string;
    namingCode: string;
    model: string;
    thumbUrl: string;
    images: string[];
    price: number;
    resistance: {
        water: string;
        dust: string;
    };
    connectivity: {
        cellular: string;
        wifi: string;
        bluetooth: number;
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
            small: string | null;
            large: {
                size: string;
                resolution: string;
            };
        };
        material: string;
        protection: string;
        alwaysOn: boolean;
    };
    chipset: {
        cpu: string;
        storage: string;
        ram: string;
    };
    operatingSystem: string;
    battery: {
        lifetime: string;
    };
    caseTypes: {
        material: string;
        description: string;
        image: string;
        colors: string[];
        additionalPrice: number;
    }[];
    size: {
        large: {
            name: string;
            additionalPrice: number;
        };
        small: string | null;
    };
    versions: {
        type: string;
        description: string;
        additionalPrice: number;
    }[];
    bandTypes: {
        material: string;
        description: string;
        styles: {
            name: string;
            description: string;
            image: string;
            colors: string[];
            additionalPrice: number;
        }[];
    }[];
    safetyCapabilities: string[];
    dimensions: {
        size: string;
        height: string;
        width: string;
        depth: string;
        weight: string;
    }[];
    description: string;
}

