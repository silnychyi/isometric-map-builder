document.addEventListener("DOMContentLoaded", ()=>{

    let cells = document.querySelectorAll(".cell");
    let itemsList = document.querySelector("#items-list");
    let items = itemsList.querySelectorAll(".item");
    let itemsHistory = document.querySelector(".items-history");
    let scrollUp = document.querySelector(".fa-angle-up");
    let scrollDown = document.querySelector(".fa-angle-down");

    let currentCell

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
            idCell: currentCell.id,
            class: this.classList.value,
            zIndex: null
        }

        if (this.classList.contains("road")){
            currentItem.zIndex = 1
        }else if(this.classList.contains("bld")) {
            currentItem.zIndex = parseInt(currentCell.data.top)+19
        }else{
            currentItem.zIndex = parseInt(currentCell.data.top)
        }

        
        
        itemsArr.forEach((item, index, object) => {
            if (item.idCell == currentCell.id){
                object.splice(index, 1)
                console.log(item)
            }
        })
        itemsArr.push(currentItem);




    }

    function renderToGrid(){
        cells.forEach(j =>{
            if (j.hasChildNodes()){
                j.removeChild(j.childNodes[0]);
            }
        })
        itemsArr.forEach(item => {
            let elem = document.createElement('div');
            elem.dataset.id = item.id;
            elem.classList = item.class;
            elem.style.zIndex = item.zIndex;
            cells.forEach(i =>{
                if (i.dataset.id == item.idCell){
                    i.appendChild(elem)
                }
            })
        });
    }

    function renderHistory(){
        while (itemsHistory.firstChild) {
            itemsHistory.removeChild(itemsHistory.firstChild);
        }

        let list = []

        if (itemsArr.length > 12){
            list = itemsArr.slice().splice(-12)
        } else {
            list = itemsArr.slice()
        }
        list.forEach(item => {
            let row = document.createElement("div");
            let elem = document.createElement("div");
            let i = document.createElement("i");
            i.classList = "fas fa-times";
            row.classList = "item-history-row";
            row.dataset.id = item.id;
            elem.classList = item.class;
            itemsHistory.insertBefore(row, itemsHistory.firstChild);
            row.appendChild(elem);
            row.appendChild(i);

            row.addEventListener("mouseenter", ()=>{
                cells.forEach(j =>{
                    if (j.childNodes[0]){
                        if (j.childNodes[0].dataset.id == row.dataset.id){
                            j.childNodes[0].classList.add("item-hover");
                        }    
                    }
                })
            });

            row.addEventListener("mouseleave", ()=>{
                cells.forEach(j =>{
                    if (j.childNodes[0]){
                        j.childNodes[0].classList.remove("item-hover");
                    }
                })
            })

            i.addEventListener("click", function(){
                itemsArr.forEach((e, index) =>{
                    if (this.parentElement.dataset.id == e.id){
                        itemsArr.splice(index, 1)
                    }
                })
                renderHistory();
                renderToGrid();
            })

        });
    }

    cells.forEach((cell, index) => {
        cell.dataset.id = index+1;

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
                currentCell = {
                    "id": cell.dataset.id,
                    "data": cell.getBoundingClientRect()
                }
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




