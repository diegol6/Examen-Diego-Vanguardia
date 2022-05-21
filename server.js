//npm install express --save
const express = require("express");
//npm install mongoose
const mongoose = require("mongoose");
//npm install body-parser
const bodyParser = require("body-parser");
//se importa path para los directorios y concatenar
var path = require('path');
const { dirname } = require('path');

const videoSchema = require('./src/models/video');

const app = express();

//puerto de la app
app.listen(3000, () => console.log("Corriendo en el puerto 3000!"));

//x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose
    .connect(
        "mongodb+srv://diegolopez:mrfantastic@cluster0.1eeoh.mongodb.net/VideosDB?retryWrites=true&w=majority"
    ).then(() => console.log('Conectado a Atlas'))
    .catch((error) => handleError(error));

    
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'public','inicio.html'));
});



app.get("/api/videos", (req,res) => {
    videoSchema
        .find((err,videos) => {
            if(err) res.status(500).send('Error en la BD para Extraer Videos');
            else res.status(200).json(videos);
        });
});

app.get("/api/videos/entrefecha", function (req, res) {
    videoSchema.find({ fecha: { $gte: req.query.fecha1, $lte: req.query.fecha2} }, function (err, videos) {
      if (err) {
        console.log("error");
        res.status(500).send("Error entre las fechas");
      } else res.status(200).json(videos);
    });
  });

app.get("/api/videos/porautor", function (req, res) {
    //hace un request por autor
    videoSchema.find({ autor: { $eq: req.query.autor } }, function (err, videos) {
      if (err) {
        console.log(err);
        res.status(500).send("Error al leer de la BD por Autor");
      } else res.status(200).json(videos);
    });
  });

app.get("/api/videos/:id", function (req, res) {
    //busca un video por id
    videoSchema.findById(req.params.id, function (err, videos) {
      if (err) res.status(500).send("Error en la BD ID");
      else {
        if (videos != null) {
          res.status(200).json(videos);
        } else res.status(404).send("No se encontro el Video por ID");
      }
    });
  });

 
  
app.post("/api/videos", (req, res) => {
    
    const videon = new videoSchema({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      duracion: req.body.duracion,
      autor: req.body.autor,
      enlacedelvideo: req.body.enlacedelvideo,
      fecha: req.body.fecha,
    });
  
    //guarda un video en la base de datos
    videon.save(function (error, videon) {
      if (error) {
        res.status(500).send("No se ha podido agregar.");
      } else {
        res.status(200).json({video:videon.titulo}); //se envia el titulo del video
      }
    });
  });

  app.delete("/api/videos/:id", function (req, res) {
    //Eliminar videos
    videoSchema.findById(req.params.id, function (err, videos) {
      if (err) res.status(500).send("Error en la base de datos");
      else {
        if (videos != null) {
          videos.remove(function (error, result) {
            if (error) res.status(500).send("Error en la base de datos");
            else {
              res.status(200).send("Eliminado exitosamente");
            }
          });
        } else res.status(404).send("No se encontro ese Video para Delete");
      }
    });
    });