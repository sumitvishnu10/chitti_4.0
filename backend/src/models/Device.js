const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
{
    deviceId:{
        type:String,
        required:true,
        unique:true
    },

    battery:{
        type:Number,
        default:100
    },

    solarVoltage:{
        type:Number,
        default:0
    },

    temperature:{
        type:Number,
        default:0
    },

    humidity:{
        type:Number,
        default:0
    },

    pir:{
        type:Boolean,
        default:false
    },

    ultrasonic:{
        type:Boolean,
        default:false
    },

    vibration:{
        type:Boolean,
        default:false
    },

    camera:{
        type:Boolean,
        default:true
    },

    buzzer:{
        type:Boolean,
        default:false
    },

    led:{
        type:Boolean,
        default:false
    },

    status:{
        type:String,
        default:"Online"
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Device",deviceSchema);