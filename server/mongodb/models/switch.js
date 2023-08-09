import mongoose from "mongoose";

const SwitchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ip: { type: String, required: true },
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

const SwitchModel = mongoose.model('Switch', SwitchSchema)

export default SwitchModel