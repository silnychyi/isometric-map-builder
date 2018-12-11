document.addEventListener("DOMContentLoaded", ()=>{

    let cells = document.querySelectorAll(".cell");
    let items = document.querySelectorAll(".item");
    let itemsList = document.querySelector("#items-list");
    let itemsMap = document.querySelector(".items-map");
    let itemsHistory = document.querySelector(".items-history");
    let scrollUp = document.querySelector(".fa-angle-up");
    let scrollDown = document.querySelector(".fa-angle-down");

    let pos

    itemsArr = []

    function idGenerator() {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }
    
    function clone() {
        
        items.forEach(item => {
            item.removeEventListener("click", clone)
        })

        currentItem = {
            id: idGenerator(),
            class: this.classList.value,
            top: `${pos.top - 200 + pos.height + window.scrollY}px`,
            left: `${pos.left}px`,
            width: `${pos.width}px`,
            zIndex: null
        }

        if (this.classList.contains("road")){
            currentItem.zIndex = 1
        }else if(this.classList.contains("bld")) {
            currentItem.zIndex = `${parseInt(pos.top)+19}`
        }else{
            currentItem.zIndex = `${parseInt(pos.top)}`
        }

        itemsArr.push(currentItem);

    }

    function renderToGrid(){
        while (itemsMap.firstChild) {
            itemsMap.removeChild(itemsMap.firstChild);
        } 
        itemsArr.forEach(item => {
            let elem = document.createElement('div');
            elem.dataset.id = item.id;
            elem.classList = item.class;
            elem.style.top = item.top;
            elem.style.left = item.left;
            elem.style.width = item.width;
            elem.style.zIndex = item.zIndex;
            itemsMap.appendChild(elem)
        });
    }

    function renderHistory(){
        while (itemsHistory.firstChild) {
            itemsHistory.removeChild(itemsHistory.firstChild);
        }
        itemsArr.forEach(item => {
            let row = document.createElement("div");
            let elem = document.createElement("div");
            let i = document.createElement("i");
            i.classList = "fas fa-times";
            row.classList = "item-history-row";
            row.dataset.id = item.id;
            elem.classList = item.class;
            itemsHistory.insertBefore(row, itemsHistory.firstChild);;
            row.appendChild(elem);
            row.appendChild(i);

            row.addEventListener("mouseenter", ()=>{
                itemsMap.querySelectorAll(".item").forEach(i =>{
                    if (i.dataset.id == row.dataset.id){
                        i.classList.add("item-map-hover");
                    }
                })
            });

            row.addEventListener("mouseleave", ()=>{
                itemsMap.querySelectorAll(".item").forEach(i =>{
                    i.classList.remove("item-map-hover");
                })
            })

            i.addEventListener("click", function(){
                itemsArr.forEach((e, index) =>{
                    if (this.parentElement.dataset.id == e.id){
                        itemsArr.splice(index, 1)
                        console.log(itemsArr)
                        console.log(index)
                    }
                })
                renderHistory();
                renderToGrid();
            })

        });
    }

    cells.forEach((cell) => {
        cell.addEventListener("click", function _listener(){
            new Promise(function(resolve, reject) {
                resolve(cell)
    
            }).then(function(cell){
            
                items.forEach(item => {
                    item.removeEventListener("click", clone)
                    item.removeEventListener("click", renderToGrid)
                    item.removeEventListener("click", renderHistory)
                    item.addEventListener("click", clone)
                    item.addEventListener("click", renderToGrid)
                    item.addEventListener("click", renderHistory)
                })
                pos = cell.getBoundingClientRect()
            })
        });
    }); 
   

    scrollUp.addEventListener("click", ()=>{
        itemsList.scrollTop -= 50;
    });
    scrollDown.addEventListener("click", ()=>{
        itemsList.scrollTop += 50;
    });

})




