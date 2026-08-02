const markers = document.getElementById("markers");

const sliderTrack = document.getElementById("sliderTrack");
const sliderHandle = document.getElementById("sliderHandle");
const sliderFill = document.getElementById("sliderFill");


let progress = 0;

let dragging = false;



// =====================================
// СОЗДАЕМ ПОДСВЕТКИ
// =====================================


function createMarkers(){


    fields.forEach(field=>{


        field.areas.forEach((area,index)=>{


            const marker = document.createElement("div");


            marker.className="marker";


            marker.id =
            field.id + "-" + index;



            marker.style.left =
            area.x + "%";


            marker.style.top =
            area.y + "%";


            marker.style.width =
            area.w + "%";


            marker.style.height =
            area.h + "%";



            marker.style.background =
            hexToRGBA(field.color,.25);



            marker.style.borderColor =
            field.color;



            marker.innerHTML = `

                <div class="marker-title"
                style="color:${field.color}">
                
                    ${field.title}

                </div>

            `;



            markers.appendChild(marker);



        });


    });


}



// =====================================
// ПОЛЗУНОК
// =====================================


function setProgress(value){


    progress =
    Math.max(
        0,
        Math.min(100,value)
    );



    sliderHandle.style.top =
    progress + "%";



    sliderFill.style.height =
    progress + "%";



    updateMarkers();


}




function getProgress(clientY){


    const rect =
    sliderTrack.getBoundingClientRect();



    let value =
    ((clientY - rect.top)
    /
    rect.height)
    *
    100;



    return value;


}



// =====================================
// МЫШЬ
// =====================================


sliderHandle.addEventListener(
"mousedown",
function(e){

    dragging=true;

    e.preventDefault();

});



window.addEventListener(
"mousemove",
function(e){


    if(!dragging)
    return;



    setProgress(
        getProgress(e.clientY)
    );


});



window.addEventListener(
"mouseup",
function(){

    dragging=false;

});



// =====================================
// ТЕЛЕФОН
// =====================================


sliderHandle.addEventListener(
"touchstart",
function(e){

    dragging=true;

    e.preventDefault();


},
{passive:false}
);



window.addEventListener(
"touchmove",
function(e){


    if(!dragging)
    return;



    setProgress(
        getProgress(
            e.touches[0].clientY
        )
    );


},
{passive:false}
);



window.addEventListener(
"touchend",
function(){

    dragging=false;

});



// =====================================
// ПОКАЗ ПОЛЕЙ
// =====================================


function updateMarkers(){


    fields.forEach(field=>{


        const visible =
        progress >= field.showAt;



        field.areas.forEach(
        (area,index)=>{


            const marker =
            document.getElementById(
                field.id+"-"+index
            );



            if(visible){

                marker.classList.add(
                    "active"
                );

            }
            else{

                marker.classList.remove(
                    "active"
                );

            }


        });


    });


}



// =====================================
// ЦВЕТ
// =====================================


function hexToRGBA(hex,alpha){


    const r =
    parseInt(hex.substring(1,3),16);


    const g =
    parseInt(hex.substring(3,5),16);


    const b =
    parseInt(hex.substring(5,7),16);



    return `rgba(${r},${g},${b},${alpha})`;


}



// =====================================
// СТАРТ
// =====================================


window.onload=function(){


    createMarkers();


    setProgress(0);


};
