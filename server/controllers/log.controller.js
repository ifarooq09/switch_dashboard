import LogsModel from "../mongodb/models/log.js";

import * as dotenv from "dotenv";

dotenv.config();


const getPortLogDetail = async (req, res) => {
    const { id } = req.params;
    // console.log("Requested portId:", id);

    try {
        const logExists = await LogsModel.find({ portId: id });
        // console.log("Found logs:", logExists);

        if (logExists && logExists.length > 0) {
            res.status(200).json(logExists);
        } else {
            res.status(404).json({ message: "Log not Existed" });
        }
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



export {
    getPortLogDetail
}