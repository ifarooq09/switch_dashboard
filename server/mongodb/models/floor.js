import mongoose from "mongoose";

const FloorSchema = new mongoose.Schema({
  floorNumber: { type: String, required: true },
  building: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
      buildingName: { type: String, ref: 'Building' },
    }
  ],
  allSwitches: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Switch' },
      title: { type: String, ref: 'Switch' },
      ip: { type: String, ref: 'Switch' },
    }
  ],
  allPorts: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Port' },
      interfaceDetail: { type: String, ref: 'Port' },
      title: { type: String, ref: 'Port' },
      ciscophone: { type: String, ref: 'Port' },
      mac: { type: String, ref: 'Port' }
    }
  ],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const FloorModel = mongoose.model('Floor', FloorSchema)

export default FloorModel