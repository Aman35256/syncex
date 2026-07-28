
const coreconnection = require('./bluetoothservice');
exports.getUserDashboard = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Ok reporting"
    })
}

