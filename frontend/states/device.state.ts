import { create } from 'zustand';
import { DeviceService } from '@fe/services';
export const useDevicesStore = create<DevicesInfo>((set) => ({
    deviceInfos: [],
    getDeviceInfos: async (userId: string, limit: number) => {
        try {
            const data = await DeviceService.getAllDevice(userId, limit);
            const deviceInfos: DeviceData[] = data.devices.map((device: DeviceData) => ({
                deviceName: device.deviceName,
                deviceState: device.deviceState,
                deviceType: device.deviceType,
                userID: device.userID,
                schedule: device.schedule,
                color: device.color,
                minLimit: device.minLimit,
                maxLimit: device.maxLimit,
                lastValue: device.lastValue,
                updatedTime: device.updatedTime,
                environmentValue: device.environmentValue,
                adaFruitID: device.adaFruitID
            }));
            set({ deviceInfos });
        } catch (err) {
            DeviceService.updateToken();
            console.log(err);
        }
    },
    removeDevice: async (deviceID: string) => {
        const deviceInfos = useDevicesStore.getState().deviceInfos.filter((device) => device.adaFruitID !== deviceID);
        set({ deviceInfos });
    }
}));
