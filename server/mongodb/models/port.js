import mongoose from "mongoose";

const PortSchema = new mongoose.Schema({
  interfaceDetail: { type: String, required: true },
  title: { type: String, required: true },
  ciscophone: { type: String, required: true },
  mac: { type: String, required: true },
  switchDetail: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Switch' },
      title: { type: String, ref: 'Switch' },
      ip: { type: String, ref: 'Switch' },
    }
  ],
  floor: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor' },
      floorNumber: { type: String, ref: 'Floor' },
    }
  ],
  building: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
      buildingName: { type: String, ref: 'Building' },
    }
  ],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const PortModel = mongoose.model('Port', PortSchema)

export default PortModel