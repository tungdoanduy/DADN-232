import { mqttClient } from '@be/services';
import { Device } from '@be/models';
import path from 'path';
import fs from 'fs';
import { limitHandler } from '@be/handlers';
const GetDeViceInfo = mqttClient.onMessage(async (topic, message) => {
    const regex = /\/feeds\/(\d+)\/json/;
    if (regex.test(topic)) {
        try {
            const jsonMessage = JSON.parse(message);
            const adaFruitID = jsonMessage.id;
            const name = jsonMessage.key;
            if (name === 'speechrecognition') return;
            if (name === 'color') return;
            const device = await Device.findOne({ adaFruitID });
            if (device) {
                const updateTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
                if (updateTime === device.updatedTime) return;
                device.deviceState =
                    jsonMessage.key.split('-')[0] === 'led' || jsonMessage.key.split('-')[0] === 'waterpump'
                        ? jsonMessage.last_value === '1'
                            ? 'ON'
                            : 'OFF'
                        : 'NONE';
                device.lastValue = jsonMessage.last_value;
                device.updatedTime = updateTime;
                if (!device.environmentValue[device.environmentValue.length - 1].value) {
                    device.environmentValue[device.environmentValue.length - 1].value = jsonMessage.data.value;
                    device.environmentValue[device.environmentValue.length - 1].createdTime = new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Bangkok'
                    });
                } else {
                    device.environmentValue.push({
                        value: jsonMessage.data.value,
                        createdTime: new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
                    });
                }
                await device.save();
                await limitHandler(device);
            } else {
                if (name === 'color' || name === 'speechrecognition') return;
                const newDevice = new Device({
                    adaFruitID: jsonMessage.id,
                    deviceName: jsonMessage.key,
                    deviceType: jsonMessage.key.split('-')[0],
                    deviceState: jsonMessage.key.split('-')[0] === 'led' || jsonMessage.key.split('_')[0] === 'waterpump' ? 'ON' : 'NONE',
                    lastValue: parseInt(jsonMessage.last_value),
                    updatedTime: new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }),
                    environmentValue: {
                        value: jsonMessage.data.value,
                        createdTime: new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
                    }
                });
                await newDevice.save();
            }
            const dataPath = path.join(__dirname, 'data.json');
            fs.writeFileSync(dataPath, JSON.stringify(device), 'utf8');
        } catch (err) {
            console.error('Error parsing message from Adafruit: ', err);
        }
    }
});
const UpdateDeviceInfo = (adaFruitID: string, body: MQTTDeviceData) => {
    if (Object.keys(body).length !== 0) {
        mqttClient.publish(`${adaFruitID}`, JSON.stringify(body.lastValue));
    }
};
const UpdateDeviceColor = (adaFruitID: string, body: ColorType) => {
    if (Object.keys(body).length !== 0) {
        mqttClient.publishColor(`${adaFruitID}`, JSON.stringify(body));
    }
};
const UpdateSpeechRecognition = (adaFruitID: string, body: boolean) => {
    mqttClient.publishSpeechRecognition(`${adaFruitID}`, JSON.stringify(body));
};
export const mqttController = {
    GetDeViceInfo,
    UpdateDeviceInfo,
    UpdateDeviceColor,
    UpdateSpeechRecognition
};
