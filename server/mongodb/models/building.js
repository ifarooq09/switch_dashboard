import mongoose from "mongoose";

const BuildingSchema = new mongoose.Schema({
  buildingName: { type: String, required: true },
  photo: { type: String, required: true },
  allFloors: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
      floorNumber: { type: String, ref: 'Building' },
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
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const BuildingModel = mongoose.model('Building', BuildingSchema)

export default BuildingModel