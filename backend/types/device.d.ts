type DeviceType = 'led' | 'earthhumidity' | 'airhumidity' | 'temperature' | 'waterpump' | 'light';
type ColorType = 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'cyan' | 'white' | 'black';
type DeviceState = 'ON' | 'OFF' | 'NONE';
interface Scheduler {
    startTime: string;
    endTime: string;
}

interface DeviceSchema {
    deviceName: string;
    deviceState: DeviceState;
    deviceType: DeviceType;
    userID: string;
    schedule: Scheduler[];
    color: ColorType;
    minLimit: number;
    maxLimit: number;
    lastValue: number;
    updatedTime: string;
    environmentValue: { value: number; createdTime: string }[];
    adaFruitID: string;
}

interface MQTTDeviceData {
    lastValue: number;
    deviceState?: DeviceState;
    updatedTime?: string;
    environmentValue?: { value: number; createdTime: string }[];
}
