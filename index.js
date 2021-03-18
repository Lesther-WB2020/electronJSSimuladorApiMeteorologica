document.getElementById('formulario').addEventListener('submit', async (event)=>{
    event.preventDefault(); 
    //fecha Seleccionada    
    var fechaSeleccionada = new Date(document.getElementById('datePicker').value); 
    var titulo = document.getElementById('tituloGetInfo');
    var fsDia = fechaSeleccionada.getDate(); if(fsDia!=31){fsDia+=1;}
    var fsMes = fechaSeleccionada.getMonth()+1;
    var fsAnio = fechaSeleccionada.getFullYear();
    var fs = fsDia+ '-'+fsMes+'-'+fsAnio;
    console.log(fs);
        //validar fecha de hoy para saber que datos mostrar
        var fechaOrdenador = new Date();
        var myDia = fechaOrdenador.getDate();    
        var myMes = fechaOrdenador.getMonth()+1;
        var myAnio = fechaOrdenador.getFullYear();
        console.log(myDia + '-'+myMes+'-'+myAnio)
        var esHoy = false;
            if((fsDia == myDia)&&(fsMes==myMes)&&(fsAnio==myAnio)){
                esHoy=true;
            }
            var fechaValida = true;
                if(fsAnio<myAnio){
                    fechaValida = false;
                }else if((fsAnio==myAnio)&&(fsMes<myMes)){
                    fechaValida = false;
                }else if((fsAnio==myAnio)&&(fsMes==myMes)&&(fsDia<myDia)){
                    fechaValida = false;
                }

                if(fechaValida){
                    //variables a usar para mostrar la informaic[on]
                    document.getElementById('fecha_').innerHTML = '';
                    var infoManiana  = document.getElementById('infoUno'); infoManiana.innerHTML =''; 
                    var infoTarde    = document.getElementById('infoDos'); infoTarde.innerHTML   =''; 
                    var infoNoche   = document.getElementById('infoTres'); infoNoche.innerHTML   ='';
                    var tempManiana  = document.getElementById('dataUno'); tempManiana.innerHTML =''; 
                    var tempTarde    = document.getElementById('dataDos'); tempTarde.innerHTML   ='';
                    var tempNoche   = document.getElementById('dataTres'); tempNoche.innerHTML   ='';
                    var lblClima1   = document.getElementById('climaUno'); lblClima1.innerHTML = '';
                    var lblClima2   = document.getElementById('climaDos'); lblClima2.innerHTML = '';
                    var lblClima3  = document.getElementById('climaTres'); lblClima3.innerHTML = '';
                    var imgUno  = document.getElementById('imgUno'); imgUno.src = '';
                    var imgDos  = document.getElementById('imgDos'); imgDos.src = '';
                    var imgTres = document.getElementById('imgTres'); imgTres.src = '';
                    imgUno.classList.remove('insertedImg');
                    imgDos.classList.remove('insertedImg');
                    imgTres.classList.remove('insertedImg');
                            //variables que mostraran la informacion 0=mañana,1=tarde,2=noche
                            var infoClima = new Array();
                            var infoTemperatura = new Array();

                                //MUESTRO ESTE SMS EN LO QUE 'OBTENO LA INFORMACION'
                                infoTarde.innerHTML = 'CONSULTANDO DATOS...';
                                //obtengo temperatura
                                    await getTemperatura().then(resultado => infoTemperatura[0] = resultado)
                                    .catch(err => infoTemperatura[0] = err);
                                    //con base a ello,defino clima.
                                    getClima(infoTemperatura[0]).then(resultado => infoClima[0] = resultado)
                                    .catch(err =>infoClima[0] = err);
                                
                                    if(esHoy){ //si es = true
                                        await getTemperatura().then(resultado => infoTemperatura[1] = resultado)
                                        .catch(err => infoTemperatura[1] = err);
                                        await getTemperatura().then(resultado => infoTemperatura[2] = resultado)
                                        .catch(err => infoTemperatura[2] = err);                                   
                                            getClima(infoTemperatura[1]).then(resultado => infoClima[1] = resultado)
                                            .catch(err =>infoClima[1] = err);
                                            getClima(infoTemperatura[2]).then(resultado => infoClima[2] = resultado)
                                            .catch(err =>infoClima[2] = err);
                                    }
                                        setTimeout(() => {
                                                if(esHoy){
                                                    document.getElementById('fecha_').innerHTML = 'PRONÓSTICO PARA HOY, ' + fs;
                                                    infoManiana.innerHTML = 'MAÑANA';
                                                    infoTarde.innerHTML = 'TARDE';
                                                    infoNoche.innerHTML = 'NOCHE';
                                                        tempManiana.innerHTML  = infoTemperatura[0] + ' °C';
                                                        tempTarde.innerHTML  = infoTemperatura[1] + ' °C';                                    
                                                        tempNoche.innerHTML  = infoTemperatura[2] + ' °C';
                                                            imgUno.classList.add('insertedImg');
                                                            imgDos.classList.add('insertedImg');
                                                            imgTres.classList.add('insertedImg');
                                                                setTimeout(() => {
                                                                    setIconImage(infoClima[0],0); lblClima1.innerHTML = infoClima[0];
                                                                    setIconImage(infoClima[1],1); lblClima2.innerHTML = infoClima[1];
                                                                    setIconImage(infoClima[2],2); lblClima3.innerHTML = infoClima[2];
                                                                }, 0001);
                                                }else{
                                                    document.getElementById('fecha_').innerHTML = 'PRONÓSTICO PARA EL ' + fs;
                                                    document.getElementById('infoDos').innerHTML = 'MAÑANA';
                                                    document.getElementById('dataDos').innerHTML = infoTemperatura[0] + ' °C';
                                                    document.getElementById('climaDos').innerHTML = infoClima[0];
                                                    imgDos.classList.add('insertedImg');
                                                        setTimeout(() => {
                                                            setIconImage(infoClima[0],1);
                                                        }, 0001);
                                                }
                                        }, 1000); 

                }else{
                    alert('EL PRONÓSTICO FUNCIONA CON FECHAS FUTURAS');
                }
})

function getClima(infoTemperatura){
    return new Promise((resolve,reject)=>{
            if(infoTemperatura>24){
                resolve('DESPEJADO');
            }else if((infoTemperatura>18)&&(infoTemperatura<=24)){
                resolve('NUBLADO');
            }else if(infoTemperatura<=18){
                resolve('LLUVIOSO');
            }else{
                reject(Error('ERROR AL "OBTENER" EL CLIMA'));
            }           
    })
}
function getTemperatura(){
    return new Promise((resolve,reject)=>{
        let temperatura = randomConIntervalo(5,30);
            if(temperatura != 0){
                resolve(temperatura);
            }else{
                reject(Error('ERROR AL "OBTENER" LA TEMPERATURA'));
            }
    })
}
function randomConIntervalo(minimo,maximo){
    return Math.floor(Math.random() * ((maximo+1) - minimo) + minimo);
}
function setIconImage(clima,position){
    var idImg = '';
    if(position==0){
        idImg = 'imgUno';
    }else if(position==1){
        idImg = 'imgDos';
    }else{
        idImg = 'imgTres';
    }
        if(clima=='DESPEJADO'){
            document.getElementById(idImg).src = './img/despejado.png';
        }else if(clima=='NUBLADO'){
            document.getElementById(idImg).src = './img/nublado.png';
        }else{
            document.getElementById(idImg).src = './img/lluvioso.png';
        }
}