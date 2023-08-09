import Building from "../mongodb/models/building.js";
import User from "../mongodb/models/user.js";
import Floor from "../mongodb/models/floor.js";
import Switch from "../mongodb/models/switch.js";
import Port from "../mongodb/models/port.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllBuilding = async (req, res) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    buildingName_like = "",
  } = req.query;

  const query = {};


  if (buildingName_like) {
    query.buildingName = { $regex: buildingName_like, $options: "i" };
  }

  try {
    const count = await Building.countDocuments({ query });

    const building = await Building.find(query)
      .limit(_end)
      .skip(_start)
      .sort({ [_sort]: _order });

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");
    res.header('Content-Type', 'application/json')
    res.status(200).json(building);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBuildingDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const buildingExists = await Building.findOne({ _id: id }).populate(
      "creator",
    );

    if (buildingExists) {
      res.status(200).json(buildingExists);
    } else {
      res.status(404).json({ message: "Building not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving building details" });
  }
};

const createBuilding = async (req, res) => {
  try {
    const {
      buildingName,
      photo,
      email,
    } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);

    if (!user) throw new Error("User not found");

    const photoUrl = await cloudinary.uploader.upload(photo);

    const existingBuilding = await Building.findOne({ buildingName }).session();

    if(existingBuilding) {
      throw new Error ("A building with the same name already exist");
    }

    await Building.create({
      buildingName,
      photo: photoUrl.url,
      creator: user._id,

    });

    // user.allBuildings.push(newBuilding._id);
    // await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: "Building created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

const updateBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const { buildingName, photo } =
      req.body;

    const photoUrl = await cloudinary.uploader.upload(photo);

    await Building.findByIdAndUpdate(
      { _id: id },
      {
        buildingName,
        photo: photoUrl.url || photo,
      },
    );

    // Update building name in the Floor model
    await Floor.updateMany(
      { "building._id": id },
      { $set: { "building.$.buildingName": buildingName } }
    );

    // Update building name in the Switch model
    await Switch.updateMany(
      { "building._id": id },
      { $set: { "building.$.buildingName": buildingName } }
    );

    // Update building name in the Port model
    await Port.updateMany(
      { "building._id": id },
      { $set: { "building.$.buildingName": buildingName } }
    );

    res.status(200).json({ message: "Building updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error)
  }

};

const deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;

    const buildingToDelete = await Building.findById(id)

    if (!buildingToDelete) throw new Error("Building not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    // Delete related floors
    await Floor.deleteMany({ building: [{ _id: buildingToDelete._id, buildingName: buildingToDelete.buildingName }] }).session(session);

    // Delete related switches
    await Switch.deleteMany({ building: [{ _id: buildingToDelete._id, buildingName: buildingToDelete.buildingName }] }).session(session);

    // Delete related ports
    await Port.deleteMany({ building: [{ _id: buildingToDelete._id, buildingName: buildingToDelete.buildingName }] }).session(session);

    // Remove the building from the creator's allBuildings array
    // buildingToDelete.creator.allBuildings.pull(buildingToDelete._id);
    // await buildingToDelete.creator.save({ session });

    // Delete the building
    await buildingToDelete.deleteOne({ _id: id }, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Building deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

const getFloorByBuildingId = async (req, res) => {
  try {
    const { buildingId } = req.params;
    // Retrieve the specific building data based on the buildingId
    const building = await Building.findById(buildingId);

    if (!building) {
      return res.status(404).json({ message: 'Building not found' });
    }

    res.status(200).json(building);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export {
  getAllBuilding,
  getBuildingDetail,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  getFloorByBuildingId
};