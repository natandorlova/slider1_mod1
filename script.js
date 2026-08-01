const markers = document.getElementById("markers");
const connections = document.getElementById("connections");
const infoContent = document.getElementById("infoContent");

const sliderTrack = document.getElementById("sliderTrack");
const sliderHandle = document.getElementById("sliderHandle");
const sliderFill = document.getElementById("sliderFill");
const documentBox = document.getElementById("document");

let progress = 0;
let dragging = false;

const cards = {};


// ===================================
// создание полей
// ===================================

function createMarkers(){

    fields.forEach(field=>{

        field.pairs.forEach((p,index)=>{

            const marker=document.createElement("div");

            marker.className="marker";

            marker.id=`${field.id}-${index}`;

            marker.innerHTML=field.number+".";

            marker.style.left=p.x+"%";
            marker.style.top=p.y+"%";
            marker.style.width=p.w+"%";
            marker.style.height=p.h+"%";

            marker.style.background=hexToRGBA(field.color,.35);
            marker.style.borderColor=field.color;
            marker.style.color=darken(field.color);

            marker.onclick=()=>showCard(field);

            markers.appendChild(marker);

        });

    });

}



// ===================================
// движение ползунка
// ===================================

function setProgress(value){

    progress=Math.max(0,Math.min(100,value));

    sliderFill.style.width=progress+"%";

    sliderHandle.style.left=progress+"%";

    updateFields();

}



function getProgress(clientX){

    const rect=sliderTrack.getBoundingClientRect();

    return ((clientX-rect.left)/rect.width)*100;

}



// ===================================
// мышь
// ===================================

sliderHandle.onmousedown=function(e){

    dragging=true;

    e.preventDefault();

};

window.onmousemove=function(e){

    if(!dragging)return;

    setProgress(getProgress(e.clientX));

};

window.onmouseup=function(){

    dragging=false;

};



// ===================================
// touch
// ===================================

sliderHandle.addEventListener("touchstart",function(e){

    dragging=true;

    e.preventDefault();

},{passive:false});

window.addEventListener("touchmove",function(e){

    if(!dragging)return;

    setProgress(getProgress(e.touches[0].clientX));

},{passive:false});

window.addEventListener("touchend",function(){

    dragging=false;

});



// ===================================
// обновление
// ===================================

function updateFields(){

    connections.innerHTML="";

    fields.forEach(field=>{

        const visible=progress>=field.showAt;

        field.pairs.forEach((p,i)=>{

            const m=document.getElementById(`${field.id}-${i}`);

            m.classList.toggle("active",visible);

        });

        if(visible){

            drawConnection(field);

            if(!cards[field.id]){

                showCard(field);

            }

        }
        else{

            removeCard(field.id);

        }

    });

}



// ===================================
// линии
// ===================================

function drawConnection(field){

    const a=document.getElementById(field.id+"-0");

    const b=document.getElementById(field.id+"-1");

    const r1=a.getBoundingClientRect();

    const r2=b.getBoundingClientRect();

    const base=documentBox.getBoundingClientRect();

    const x1=r1.left+r1.width/2-base.left;
    const y1=r1.top+r1.height/2-base.top;

    const x2=r2.left+r2.width/2-base.left;
    const y2=r2.top+r2.height/2-base.top;

    const line=document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    line.setAttribute("x1",x1);
    line.setAttribute("y1",y1);

    line.setAttribute("x2",x2);
    line.setAttribute("y2",y2);

    line.setAttribute("stroke",field.color);

    line.classList.add("connection");

    connections.appendChild(line);

}



// ===================================
// карточки
// ===================================

function showCard(field){

    if(cards[field.id])return;

    const card=document.createElement("div");

    card.className="info-card";

    card.id="card-"+field.id;

    card.style.borderLeftColor=field.color;

    card.innerHTML=`

<h3 style="color:${field.color}">

${field.number}. ${field.title}

</h3>

<p>

${field.description}

</p>

<button class="close-button">

Закрыть

</button>

`;

    card.querySelector("button").onclick=function(){

        removeCard(field.id);

    };

    infoContent.appendChild(card);

    cards[field.id]=true;

}



function removeCard(id){

    const card=document.getElementById("card-"+id);

    if(card)card.remove();

    delete cards[id];

}



// ===================================
// цвет
// ===================================

function hexToRGBA(hex,a){

    const r=parseInt(hex.substr(1,2),16);

    const g=parseInt(hex.substr(3,2),16);

    const b=parseInt(hex.substr(5,2),16);

    return `rgba(${r},${g},${b},${a})`;

}

function darken(hex){

    return hex;

}



// ===================================
// старт
// ===================================

window.onload=function(){

    createMarkers();

    setProgress(0);

};
