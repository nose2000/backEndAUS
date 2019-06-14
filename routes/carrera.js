var express = require('express');

var mdAutenticacion = require('../middleeares/autenticacion');

var app = express();

var Carrera = require('../models/carrera');




//===========================================================================
//                 OBTENER TODOS LAS CARRERAS 
//===========================================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Carrera.find({})
        .skip(desde)
        .limit(10)
        .exec(

            (err, carreras) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error cargando carrera',
                        errors: err
                    });
                }

                Carrera.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        carreras,
                        total: conteo
                    });

                });

            });
});



//===========================================================================
//                 OBTENER UNA CARRERA
//===========================================================================

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Carrera.findById(id, (err, carrera) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar carrera',
                errors: err
            });
        }

        if (!carrera) {
            return res.status(400).json({
                ok: false,
                mensaje: 'la carrera con el id' + id + 'no existe',
                errors: { message: 'no existe una carrera con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            carrera: carrera
        });

    });

});





//===========================================================================
//                 ACTUALIZAR CARRERA
//===========================================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //busacando en la base de datos por  el id 
    Carrera.findById(id, (err, carrera) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar carrera',
                errors: err
            });
        }

        if (!carrera) {
            return res.status(400).json({
                ok: false,
                mensaje: 'la carrera con el id' + id + 'no existe',
                errors: { message: 'no existe una carrera con ese id' }
            });
        }


        carrera.carrera = body.carrera;

        carrera.save((err, carreraGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actializar carrera',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                carrera: carreraGuardado
            });

        });

    });

});



//===========================================================================
//                 CREAR UN NUEVA CARRERA  
//===========================================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var carrera = new Carrera({
        carrera: body.carrera
    });

    carrera.save((err, carreraGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear carrera',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            carrera: carreraGuardado
        });

    });

});





//===========================================================================
//                 BORAR UNA CARRERA POR EL ID  
//===========================================================================

app.put('/delete/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //busacando en la base de datos por  el id  
    Carrera.findById(id, (err, carrera) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar carrera',
                errors: err
            });
        }

        if (!carrera) {
            return res.status(400).json({
                ok: false,
                mensaje: 'la carrera con el id' + id + 'no existe',
                errors: { message: 'no existe una carrera con ese id' }
            });
        }


        carrera.estadoCar = false;

        carrera.save((err, carreraEliminado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al eliminar carrera',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                carrera: carreraEliminado
            });

        });

    });

});






module.exports = app;