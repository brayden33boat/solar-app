

export const calculateBatteryPercentage = (voltage: number, batteryBankVoltage: number, batteryType: string) => {
    let minVoltage, maxVoltage;

    if (batteryType === 'Lithium') {
        maxVoltage = batteryBankVoltage * (28.8 / 24);
        minVoltage = batteryBankVoltage * (21.0 / 24);
    } else if (batteryType === 'AGM') {
        maxVoltage = batteryBankVoltage * (25.6 / 24);
        minVoltage = batteryBankVoltage * (21.0 / 24);
    } else {
        console.log('Unknown battery type:', batteryType);
        return 0;
    }

    const percentage = ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100;
    return Math.max(0, Math.min(100, percentage));
};