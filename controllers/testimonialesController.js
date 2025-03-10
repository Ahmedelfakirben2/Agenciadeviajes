import { Testimonial } from "../models/Testimoniales.js";

const guardarTestimonial = async (req, res)=>{

    //validar..
    const {nombre, correo, mensaje} = req.body;

    const errores = [];
   
    if(nombre.trim()===''){
        errores.push({mensaje : 'Nombre vacio'});
    }
    
    if(correo.trim()===''){
        errores.push({mensaje : 'Correo vacio'});
    }

    if(mensaje.trim()===''){
        errores.push({mensaje : 'Mensaje vacio'});
    }
    
    if(errores.length > 0){

        //Consultar testimoniales existentes
        const testimoniales = await Testimonial.findAll();

        //mostrar la vista con errores
        res.render('testimoniales', {
            pagina: 'Testimoniales',
            errores,
            nombre,
            correo,
            mensaje,
            testimoniales
        });
    }else{
        

        try{
            await Testimonial.create({
                nombre,
                correo,
                mensaje
            });

            res.redirect('/testimoniales');
        }catch(error){
            console.log(error);
        }

    }
    
};
export {
    guardarTestimonial
}