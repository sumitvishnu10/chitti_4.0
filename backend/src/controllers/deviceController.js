const Device = require("../models/Device");

// Create Device
const createDevice = async (req, res) => {
    try {

        const device = new Device(req.body);

        await device.save();

        res.status(201).json({
            success: true,
            message: "Device created successfully",
            data: device
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get All Devices
const getDevices = async (req, res) => {
    try {

        const devices = await Device.find();

        res.status(200).json({
            success: true,
            count: devices.length,
            data: devices
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get Device Status
const getDeviceStatus = async (req, res) => {
    try {

        const device = await Device.findOne().sort({ createdAt: -1 });

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "No device found"
            });
        }

        res.status(200).json({
            success: true,
            data: device
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createDevice,
    getDevices,
    getDeviceStatus
};