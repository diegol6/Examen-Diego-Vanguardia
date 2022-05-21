const mongoose = require("mongoose");

//definismo el esquema del modelo video

const videoSchema = new mongoose.Schema(
{
    titulo: String,
    descripcion: String,
    duracion: String,
    autor: String,
    enlacedelvideo: String,
    fecha: String,
},
{
    collection: "Videos", versionKey: false 
}
    
);

module.exports = mongoose.model('Video', videoSchema);