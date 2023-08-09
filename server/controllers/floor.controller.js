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

const getAllFloor = async (req, res) => {

  const {
    _end,
    _order,
    _start,
    _sort,
    floorNumber_like = "",
  } = req.query;

  const query = {};

  if (floorNumber_like) {
    query.floorNumber = { $regex: floorNumber_like, $options: "i" };
  }

  try {
    const count = await Floor.countDocuments({ query });

    const floor = await Floor.find(query)
      .limit(_end)
      .skip(_start)
      .sort({ [_sort]: _order });

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");
    res.header('Content-Type', 'application/json')

    res.status(200).json(floor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFloorDetail = async (req, res) => {
  const { id } = req.params;
  const floorExists = await Floor.findOne({ _id: id }).populate(
    "creator");

  if (floorExists) {
    res.status(200).json(floorExists);
  } else {
    res.status(404).json({ message: "Building not found" });
  }

};

const createFloor = async (req, res) => {

  try {
    const {
      floorNumber,
      email,
      building
    } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);

    if (!user) throw new Error("User not found");

    const buildingDoc = await Building.findById(building).session(session);

    if (!buildingDoc) throw new Error("Building not found");

    //Check if a floor with the same floor number and building already exist
    const existingFloor = await Floor.findOne({floorNumber, "building._id": buildingDoc.id }).session(session);

    if(existingFloor) {
      throw new Error ("A Floor with the same floor name already exists in the building")
    }

    const newFloor = await Floor.create({
      floorNumber,
      creator: user._id,
      building: {
        _id: buildingDoc._id,
        buildingName: buildingDoc.buildingName
      }
    });

    buildingDoc.allFloors.push({
      _id: newFloor._id,
      floorNumber: newFloor.floorNumber,
    });
    await buildingDoc.save({ session });

    // user.allFloors.push(newFloor._id)
    // await user.save({ session })

    await session.commitTransaction();

    res.status(200).json({ message: "Floor created successfully" });

  } catch (error) {

    res.status(500).json({ message: error.message });
  }

};

const updateFloor = async (req, res) => {
  try {
    const { id } = req.params;
    const { floorNumber, building } =
      req.body;

    const buildingDoc = await Building.findById(building);

    if (!buildingDoc) throw new Error("Building not found");

    await Floor.findByIdAndUpdate(
      { _id: id },
      {
        floorNumber,
        building: {
          _id: buildingDoc._id,
          buildingName: buildingDoc.buildingName
        }
      },
    );

    const updatedFloor = {
      _id: id,
      floorNumber: floorNumber,
    };

    if (buildingDoc.buildingName && floorNumber !== undefined) {
      // Update building name and floor number
      const existingFloorIndex = buildingDoc.allFloors.findIndex(
        (floor) => floor._id && floor._id.equals(id)
      );

      if (existingFloorIndex !== -1) {
        buildingDoc.allFloors.splice(existingFloorIndex, 1);
      }

      buildingDoc.allFloors.push(updatedFloor);

      // Remove updated floor from the previous building
      const previousBuilding = await Building.findOneAndUpdate(
        { "allFloors._id": id },
        { $pull: { allFloors: { _id: id } } },
        { new: true }
      );

      if (previousBuilding) {
        // Remove switches and ports from the previous building
        await Building.updateMany(
          { _id: previousBuilding._id },
          {
            $pull: {
              allSwitches: { _id: { $in: previousBuilding.allSwitches } },
              allPorts: { _id: { $in: previousBuilding.allPorts } },
            },
          }
        );

        // Add switches and ports to the updated building
        await Building.updateOne(
          { _id: building },
          {
            $push: {
              allSwitches: { $each: previousBuilding.allSwitches },
              allPorts: { $each: previousBuilding.allPorts },
            },
          }
        );

        await previousBuilding.save();
      }

    } else if (floorNumber !== undefined) {
      // Update only floor number
      buildingDoc.allFloors.forEach((floor, index) => {
        if (floor && floor._id && floor._id.equals(id)) {
          buildingDoc.allFloors[index] = updatedFloor;
        }
      });
    }

    await buildingDoc.save();

    // Update building name in the Switch model
    if (floorNumber !== undefined) {
      // Update floor number in Switch model
      await Switch.updateMany(
        { "floor._id": id },
        { $set: { "floor.$.floorNumber": floorNumber } }
      );

      // Update floor number in Port model
      await Port.updateMany(
        { "floor._id": id },
        { $set: { "floor.$.floorNumber": floorNumber } }
      );
    }

    if (floorNumber !== undefined && building) {
      // Update floor and building in Switch model
      await Switch.updateMany(
        { "floor._id": id },
        {
          $set: {
            "floor.$.floorNumber": floorNumber,
            building: {
              _id: building,
              buildingName: buildingDoc.buildingName,
            },
          },
        }
      );

      // Update floor and building in Port model
      await Port.updateMany(
        { "floor._id": id },
        {
          $set: {
            "floor.$.floorNumber": floorNumber,
            building: {
              _id: building,
              buildingName: buildingDoc.buildingName,
            },
          },
        }
      );
    }

    res.status(200).json({ message: "Floor updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error)
  }

};

const deleteFloor = async (req, res) => {
  try {
    const { id } = req.params;

    const floorToDelete = await Floor.findById(id)

    if (!floorToDelete) throw new Error("Floor not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    // Delete related switches
    await Switch.deleteMany({ floor: [{ _id: floorToDelete._id, floorNumber: floorToDelete.floorNumber }] }).session(session);

    // Delete related ports
    await Port.deleteMany({ floor: [{ _id: floorToDelete._id, floorNumber: floorToDelete.floorNumber }] }).session(session);

    // Remove the floor from the creator's allFloors array
    // if (floorToDelete.creator && floorToDelete.creator.allFloors) {
    //   floorToDelete.creator.allFloors.pull(floorToDelete._id);
    //   await floorToDelete.creator.save({ session });
    // }

    // Remove floor from the previous building
    const previousBuilding = await Building.findOneAndUpdate(
      { "allFloors._id": id },
      { $pull: { allFloors: { _id: id } } },
      { new: true }
    );

    if (previousBuilding) {
      // Remove switches and ports of the selected floor from the previous building
      await Building.updateMany(
        { _id: previousBuilding._id },
        {
          $pull: {
            allSwitches: { _id: { $in: previousBuilding.allSwitches } },
            allPorts: { _id: { $in: previousBuilding.allPorts } },
          },
        }
      );
      await previousBuilding.save();
    }

    // Delete the floor
    await floorToDelete.deleteOne({ _id: id }, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Floor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

const getSwitchByFloorId = async (req, res) => {
  try {
    const { floorId } = req.params;
    // Retrieve the specific building data based on the buildingId
    const floor = await Floor.findById(floorId);

    if (!floor) {
      return res.status(404).json({ message: 'floor not found' });
    }

    res.status(200).json(floor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export {
  getAllFloor,
  getFloorDetail,
  createFloor,
  updateFloor,
  deleteFloor,
  getSwitchByFloorId
};