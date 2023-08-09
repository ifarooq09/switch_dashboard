import Building from "../mongodb/models/building.js";
import User from "../mongodb/models/user.js";
import Floor from "../mongodb/models/floor.js";
import Switch from "../mongodb/models/switch.js";
import Port from "../mongodb/models/port.js";
import LogsModel from "../mongodb/models/log.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const getAllPort = async (req, res) => {
    const {
        _end,
        _order,
        _start,
        _sort,
        title_like = "",
        ciscophone_like = "",
        mac_like = ""
    } = req.query;

    const query = {};


    if (title_like) {
        query.$or = [
            { title: { $regex: title_like, $options: "i" } },
            { ciscophone: { $regex: ciscophone_like, $options: "i" } },
            { mac: { $regex: mac_like, $options: "i" } },
        ];
    }


    try {
        const count = await Port.countDocuments({ query });

        const ports = await Port.find(query)
            .limit(_end)
            .skip(_start)
            .sort({ [_sort]: _order });

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(ports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPortDetail = async (req, res) => {
    const { id } = req.params;
    const portExists = await Port.findOne({ _id: id })

    if (portExists) {
        res.status(200).json(portExists);
    } else {
        res.status(404).json({ message: "Port not found" });
    }

};

const createPort = async (req, res) => {
    try {
        const {
            interfaceDetail,
            title,
            ciscophone,
            mac,
            building,
            floor,
            switchDetail,
            email
        } = req.body;

        const session = await mongoose.startSession();
        session.startTransaction();

        const user = await User.findOne({ email }).session(session);

        if (!user) throw new Error("User not found");

        const buildingDoc = await Building.findById(building).session(session);

        if (!buildingDoc) throw new Error("Building not Found");

        const floorDoc = await Floor.findById(floor).session(session)

        if (!floorDoc) throw new Error("Floor not Found")

        const switchDoc = await Switch.findById(switchDetail).session(session)

        if (!switchDoc) throw new Error("Switch not Found")

        const existingInterfaceDetail = await Port.findOne({ interfaceDetail, "switchDetail._id": switchDoc._id, "floor._id": floorDoc._id, "building._id": buildingDoc._id }).session(session);
        // const existingTitle = await Port.findOne({ title, "switchDetail._id": switchDoc._id, "floor._id": floorDoc._id, "building._id": buildingDoc._id }).session(session);
        // const existingCiscophone = await Port.findOne({ ciscophone, "switchDetail._id": switchDoc._id, "floor._id": floorDoc._id, "building._id": buildingDoc._id }).session(session);
        const existingMac = await Port.findOne({ mac, "switchDetail._id": switchDoc._id, "floor._id": floorDoc._id, "building._id": buildingDoc._id }).session(session);

        if (existingInterfaceDetail && existingMac) {
            throw new Error("Same interface detail and MAC address already exist in the selected Switch, Floor, and Building.");
        } else if (existingInterfaceDetail) {
            throw new Error("Same interface detail already exists in the selected Switch, Floor, and Building.");
        } else if (existingMac) {
            throw new Error("Same MAC address already exists in the selected Switch, Floor, and Building.");
        }
        
        const newPort = await Port.create({
            interfaceDetail,
            title,
            ciscophone,
            mac,
            switchDetail: {
                _id: switchDoc._id,
                title: switchDoc.title,
                ip: switchDoc.ip
            },
            floor: {
                _id: floorDoc._id,
                floorNumber: floorDoc.floorNumber
            },
            building: {
                _id: buildingDoc._id,
                buildingName: buildingDoc.buildingName
            },
            creator: user._id,

        });

        switchDoc.allPorts.push({
            _id: newPort._id,
            interfaceDetail: newPort.interfaceDetail,
            title: newPort.title,
            ciscophone: newPort.ciscophone,
            mac: newPort.mac
        })
        await switchDoc.save({ session })

        floorDoc.allPorts.push({
            _id: newPort._id,
            interfaceDetail: newPort.interfaceDetail,
            title: newPort.title,
            ciscophone: newPort.ciscophone,
            mac: newPort.mac
        })
        await floorDoc.save({ session })

        buildingDoc.allPorts.push({
            _id: newPort._id,
            interfaceDetail: newPort.interfaceDetail,
            title: newPort.title,
            ciscophone: newPort.ciscophone,
            mac: newPort.mac
        })
        await buildingDoc.save({ session })

        // user.allPorts.push(newPort._id);
        // await user.save({ session });

        await session.commitTransaction();

        res.status(200).json({ message: "Port created successfully" });

    } catch (error) {

        res.status(500).json({ message: error.message });
    }

};

const updatePort = async (req, res) => {
    try {
        const { id } = req.params;
        const { interfaceDetail, title, ciscophone, mac, switchDetail, building, floor } =
            req.body;

        const portToUpdate = await Port.findById(id);
        if (!portToUpdate) throw new Error("Port not found");

        const buildingDoc = await Building.findById(building);
        if (!buildingDoc) throw new Error("Building not found");

        const floorDoc = await Floor.findById(floor);
        if (!floorDoc) throw new Error("Floor not found");

        const switchDoc = await Switch.findById(switchDetail);
        if (!switchDoc) throw new Error("Switch not found");

        //Create a log entry for the previous port data
        const logEntry = {
            portId: id,
            previousData: {
                interfaceDetail: portToUpdate.interfaceDetail,
                title: portToUpdate.title,
                ciscophone: portToUpdate.ciscophone,
                mac: portToUpdate.mac,
                switchDetail: {
                    _id: switchDoc._id,
                    title: switchDoc.title,
                    ip: switchDoc.ip
                },
                floor: {
                    _id: floorDoc._id,
                    floorNumber: floorDoc.floorNumber
                },
                building: {
                    _id: buildingDoc._id,
                    buildingName: buildingDoc.buildingName
                }
            }
        }

        // Save the log entry into the 'logs model
        await LogsModel.create(logEntry);

        //Update the Port
        await Port.findByIdAndUpdate(
            { _id: id },
            {
                interfaceDetail,
                title,
                ciscophone,
                mac,
                switchDetail: {
                    _id: switchDoc._id,
                    title: switchDoc.title,
                    ip: switchDoc.ip
                },
                floor: {
                    _id: floorDoc._id,
                    floorNumber: floorDoc.floorNumber
                },
                building: {
                    _id: buildingDoc._id,
                    buildingName: buildingDoc.buildingName
                }
            },
        );

        // Update Port details in Switch Model
        await Building.updateMany(
            { "allPorts._id": id },
            {
                $set: {
                    "allPorts.$.interfaceDetail": interfaceDetail,
                    "allPorts.$.title": title,
                    "allPorts.$.ciscophone": ciscophone,
                    "allPorts.$.mac": mac,
                }
            }
        );

        // Update Port details in Switch Model
        await Floor.updateMany(
            { "allPorts._id": id },
            {
                $set: {
                    "allPorts.$.interfaceDetail": interfaceDetail,
                    "allPorts.$.title": title,
                    "allPorts.$.ciscophone": ciscophone,
                    "allPorts.$.mac": mac,
                }
            }
        );

        // Update Port detials in the Switch model
        await Switch.updateMany(
            { "allPorts._id": id },
            {
                $set: {
                    "allPorts.$.interfaceDetail": interfaceDetail,
                    "allPorts.$.title": title,
                    "allPorts.$.ciscophone": ciscophone,
                    "allPorts.$.mac": mac,
                }
            }
        );

        res.status(200).json({ message: "Port updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }

};

const deletePort = async (req, res) => {

    try {
        const { id } = req.params;

        const portToDelete = await Port.findById(id);

        if (!portToDelete) throw new Error("Port not found");

        const session = await mongoose.startSession();
        session.startTransaction();

        // Remove Port from the previous building
        const previousBuilding = await Building.findOneAndUpdate(
            { "allPorts._id": id },
            { $pull: { allPorts: { _id: id } } },
            { new: true }
        );
        if (previousBuilding) {
            await previousBuilding.save();
        }

        // Remove the port from the floor's allPorts array
        const previousFloor = await Floor.findOneAndUpdate(
            { "allPorts._id": id },
            { $pull: { allPorts: { _id: id } } },
            { new: true }
        );
        if (previousFloor) {
            await previousFloor.save();
        }

        // Remove the port from the switch's allPorts array
        const previousSwitch = await Switch.findOneAndUpdate(
            { "allPorts._id": id },
            { $pull: { allPorts: { _id: id } } },
            { new: true }
        );
        if (previousSwitch) {
            await previousSwitch.save();
        }

        // Delete the Port
        await portToDelete.deleteOne({ _id: id }, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "Port deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};


export {
    getAllPort,
    getPortDetail,
    createPort,
    updatePort,
    deletePort,
};