import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
    portId: { type: mongoose.Schema.Types.ObjectId, ref: 'Port', required: true },
    previousData: {
        interfaceDetail: { type: String, required: true },
        title: { type: String, required: true },
        ciscophone: { type: String, required: true },
        mac: { type: String, required: true },
        switchDetail: {
            _id: mongoose.Schema.Types.ObjectId,
            title: String,
            ip: String
          },
          floor: {
            _id: mongoose.Schema.Types.ObjectId,
            floorNumber: String
          },
          building: {
            _id: mongoose.Schema.Types.ObjectId,
            buildingName: String
          }
    },
    createdAt: { type: Date, default: Date.now}
})

const LogsModel = mongoose.model('Log', LogSchema)

export default LogsModel