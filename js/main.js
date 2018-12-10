document.addEventListener("DOMContentLoaded", ()=>{

    let cells = document.querySelectorAll(".cell");
    let itemsList = document.querySelectorAll(".item");
    let itemsMap = document.querySelector(".items-map")

    let pos
    
    function clone() {
        console.log(pos)
        itemsList.forEach(item => {
            item.removeEventListener("click", clone)
        })
        itemClone = itemsMap.appendChild(this.cloneNode(true)); 
        itemClone.style.top = `${pos.top - 200 + pos.height}px`
        itemClone.style.left = `${pos.left}px`
        itemClone.style.width = `${pos.width}px`
        itemClone.style.height = `200px`
        itemClone.style.position = `absolute`
        console.dir(itemClone)
        if (itemClone.classList.contains("road")){
            itemClone.style.zIndex = 1
        }else if(itemClone.classList.contains("bld")) {
            itemClone.style.zIndex = `${parseInt(pos.top)+19}`
        }else{
            itemClone.style.zIndex = `${parseInt(pos.top)}`
        }

    }


    cells.forEach((cell) => {
        cell.addEventListener("click", function _listener(){
            new Promise(function(resolve, reject) {
                resolve(cell)
    
            }).then(function(cell){
            
                itemsList.forEach(item => {
                    item.removeEventListener("click", clone)
                    item.addEventListener("click", clone)
                })
                pos = cell.getBoundingClientRect()
            })
        });
    }); 
   

})




