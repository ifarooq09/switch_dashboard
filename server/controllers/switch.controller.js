import Building from "../mongodb/models/building.js";
import User from "../mongodb/models/user.js";
import Floor from "../mongodb/models/floor.js";
import Switch from "../mongodb/models/switch.js";
import Port from "../mongodb/models/port.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const getAllSwitch = async (req, res) => {
    const {
        _end,
        _order,
        _start,
        _sort,
        title_like = "",
        ip_like = "",
    } = req.query;

    const query = {};


    if (title_like) {
        query.$or = [
            { title: { $regex: title_like, $options: "i" } },
            { ip: { $regex: ip_like, $options: "i" } },
        ];
    }

    try {
        const count = await Switch.countDocuments({ query });

        const switches = await Switch.find(query)
            .limit(_end)
            .skip(_start)
            .sort({ [_sort]: _order });

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");
        res.header('Content-Type', 'application/json')
        res.status(200).json(switches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSwitchDetail = async (req, res) => {
    const { id } = req.params;
    const switchExists = await Switch.findOne({ _id: id }).populate(
        "creator");

    if (switchExists) {
        res.status(200).json(switchExists);
    } else {
        res.status(404).json({ message: "Switch not found" });
    }

};

const createSwitch = async (req, res) => {
    try {
        const {
            title,
            ip,
            email,
            building,
            floor
        } = req.body;

        const session = await mongoose.startSession();
        session.startTransaction();

        const user = await User.findOne({ email }).session(session);

        if (!user) throw new Error("User not found");

        const buildingDoc = await Building.findById(building).session(session);

        if (!buildingDoc) throw new Error("Building not Found");

        const floorDoc = await Floor.findById(floor).session(session)

        if (!floorDoc) throw new Error("Floor not Found")

        const existingSwitchTitle = await Switch.findOne({ title, "floor._id": floorDoc._id, "building._id": buildingDoc._id }).session(session);
        const existingSwitchIP = await Switch.findOne({ ip, "floor._id": floorDoc._id, "building._id": buildingDoc._id }).session(session);

        if (existingSwitchTitle && existingSwitchIP) {
            throw new Error("Same Interface Detail and IP already exists in the selected Floor and Building");
        } else if (existingSwitchTitle) {
            throw new Error("Switch with same name already exists in the selected Floor, and Building.");
        } else if (existingSwitchIP) {
            throw new Error("Switch with same IP already exists in the selected Floor, and Building.");
        }

        const newSwitch = await Switch.create({
            title,
            ip,
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

        floorDoc.allSwitches.push({
            _id: newSwitch._id,
            title: newSwitch.title,
            ip: newSwitch.ip
        })
        await floorDoc.save({ session })

        buildingDoc.allSwitches.push({
            _id: newSwitch._id,
            title: newSwitch.title,
            ip: newSwitch.ip
        })
        await buildingDoc.save({ session })

        // user.allSwitches.push(newSwitch._id);
        // await user.save({ session });

        await session.commitTransaction();

        res.status(200).json({ message: "Switch created successfully" });

    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};

const updateSwitch = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, ip, building, floor } = req.body;

        const switchToUpdate = await Switch.findById(id);
        if (!switchToUpdate) throw new Error("Switch not found");

        const buildingDoc = await Building.findById(building);
        if (!buildingDoc) throw new Error("Building not found");

        const floorDoc = await Floor.findById(floor);
        if (!floorDoc) throw new Error("Floor not found");

        // Update the switch itself
        await Switch.findByIdAndUpdate(id, {
            title,
            ip,
            floor: {
                _id: floorDoc._id,
                floorNumber: floorDoc.floorNumber
            },
            building: {
                _id: buildingDoc._id,
                buildingName: buildingDoc.buildingName
            }
        });

        // Update switch details in Building Model
        await Building.updateMany(
            { "allSwitches._id": id },
            {
                $set: {
                    "switchDetail.$.title": title, 
                    "switchDetail.$.ip": ip,
                }
            }
        );
        
        // Update switch details in Floor Model
        await Floor.updateMany(
            { "allSwitches._id": id },
            {
                $set: {
                    "allSwitches.$.title": title, 
                    "allSwitches.$.ip": ip,
                }
            }
        );

        // Update switch detials in the Port model
        await Port.updateMany(
            { "switchDetail._id": id },
            {
                $set: {
                    "switchDetail.$.title": title, 
                    "switchDetail.$.ip": ip,
                }
            }
        );

        res.status(200).json({ message: "Switch updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};

const deleteSwitch = async (req, res) => {
    try {
        const { id } = req.params;

        const switchToDelete = await Switch.findById(id)


        if (!switchToDelete) throw new Error("Switch not found");

        const session = await mongoose.startSession();
        session.startTransaction();

        // Delete related ports
        await Port.deleteMany({ switchDetail: [{ _id: switchToDelete._id, title: switchToDelete.title, ip: switchToDelete.ip }] }).session(session);

        // Remove the switch from the creator's allSwitches array
        // switchToDelete.creator.allSwitches.pull(switchToDelete._id);
        // await switchToDelete.creator.save({ session });

        // Remove Switch from the previous building
        const previousBuilding = await Building.findOneAndUpdate(
            { "allSwitches._id": id },
            { $pull: { allSwitches: { _id: id } } },
            { new: true }
        );

        if (previousBuilding) {
            // Remove ports of the selected switches from the previous building
            await Building.updateMany(
                { _id: previousBuilding._id },
                {
                    $pull: {
                        allPorts: { _id: { $in: previousBuilding.allPorts } },
                    },
                }
            );
            await previousBuilding.save();
        }

        // Remove Switch from the previous floor
        const previousFloor = await Floor.findOneAndUpdate(
            { "allSwitches._id": id },
            { $pull: { allSwitches: { _id: id } } },
            { new: true }
        );

        if (previousFloor) {
            // Remove ports of the selected switches from the previous floor
            await Floor.updateMany(
                { _id: previousFloor._id },
                {
                    $pull: {
                        allPorts: { _id: { $in: previousFloor.allPorts } },
                    },
                }
            );
            await previousFloor.save();
        }

        // Delete the Port
        await switchToDelete.deleteOne({ _id: id }, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "Switch deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getIpBySwitchId = async (req, res) => {
    try {
        const { switchId } = req.params;
        // Retrieve the specific building data based on the buildingId
        const switchIP = await Switch.findById(switchId);

        if (!switchIP) {
            return res.status(404).json({ message: 'IP not found' });
        }

        res.status(200).json(switchIP);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export {
    getAllSwitch,
    getSwitchDetail,
    createSwitch,
    updateSwitch,
    deleteSwitch,
    getIpBySwitchId
};