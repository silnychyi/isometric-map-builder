document.addEventListener("DOMContentLoaded", ()=>{

    let gridSize = {
        rows: 10,
        colums: 10
    }
    
    let grid = document.querySelector("#grid");
    let cells
    let itemsList = document.querySelector(".items-list");
    let itemsListWrap = document.querySelector(".items-list-wrap");
    let items = itemsList.querySelectorAll(".item");
    let itemsHistory = document.querySelector(".items-history");
    let closeBtn = document.querySelector(".close-list");
    let addGridRowBottom = document.querySelector(".add-row-bottom");
    let addGridRowTop = document.querySelector(".add-row-top");
    let addGridColumnLeft = document.querySelector(".add-column-left");
    let addGridColumnRight = document.querySelector(".add-column-right");

    let currentCell

    itemsArr = []


    gridRender(gridSize.rows, gridSize.colums);
    grid.style.top = `${document.documentElement.clientHeight/2-grid.getBoundingClientRect().height/2-100}px`;
    grid.style.left = `${document.documentElement.clientWidth/2-grid.getBoundingClientRect().width/2+100}px`;



    function gridRender(rows, colums){
        while (grid.children[4]){
            grid.removeChild(grid.children[2]);
        }
        grid.style.gridTemplateColumns = `repeat(${colums}, 50px)`;
        grid.style.gridTemplateRows = `repeat(${rows}, 50px)`;

        let cell = document.createElement("div");
        cell.classList = "cell";
        for (let i = 0; i < rows * colums; i++ ){
            grid.appendChild(cell.cloneNode(true));
        }
        cells = grid.querySelectorAll(".cell");
        cellsInit()
    }

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

        cells.forEach(i => {i.classList.remove("cell-active")})


        currentItem = {
            id: idGenerator(),
            idCell: currentCell.id,
            class: this.classList.value,
            zIndex: null
        }

        // setting z-index
        if (this.classList.contains("road")){
            currentItem.zIndex = 1
        }else if(this.classList.contains("l")) {
            currentItem.zIndex = parseInt(currentCell.data.top)+19
        }else if(this.classList.contains("m")) {
            currentItem.zIndex = parseInt(currentCell.data.top)+10
        }else {
            currentItem.zIndex = parseInt(currentCell.data.top)
        }

        
        // delete item on stacking
        itemsArr.forEach((item, index, object) => {
            if (item.idCell == currentCell.id){
                object.splice(index, 1)
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

        if (itemsArr.length > 15){
            list = itemsArr.slice().splice(-15)
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

    function cellsInit(){
        cells.forEach(cell => {
            if(!cell.dataset.id){
                cell.dataset.id = idGenerator();
            }    
            cell.addEventListener("click", ()=>{
                if(!itemsListWrap.classList.contains("items-list-active")){
                    itemsListWrap.classList.add("items-list-active");
                    closeBtn.classList.add("close-list-active");
                }
    
                cells.forEach(i => {i.classList.remove("cell-active")})
                cell.classList.add("cell-active");
    
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
    }

    function setZindex(){
        cells.forEach(cell=>{
            if (cell.children[0]){
                itemsArr.forEach(i=>{
                    if(i.id == cell.children[0].dataset.id){
                        if (cell.children[0].classList.contains("road")){
                            i.zIndex = 1
                        }else if(cell.children[0].classList.contains("l")) {
                            i.zIndex = parseInt(cell.getBoundingClientRect().top)+19
                        }else if(cell.children[0].classList.contains("m")) {
                            i.zIndex = parseInt(cell.getBoundingClientRect().top)+10
                        }else {
                            i.zIndex = parseInt(cell.getBoundingClientRect().top)
                        }        
                    }
                })
            }
        })
    }


    // events

    closeBtn.addEventListener("click", function(){
        itemsListWrap.classList.remove("items-list-active")
        this.classList.remove("close-list-active")
        cells.forEach(i => {i.classList.remove("cell-active")})

    });

    addGridRowBottom.addEventListener("click", ()=>{
        gridSize.rows ++
        for(let i=0; i<gridSize.colums; i++){
            newCell = grid.lastChild.cloneNode(true);
            newCell.dataset.id = idGenerator();
            grid.insertBefore(newCell, grid.children[(gridSize.rows * gridSize.colums) - gridSize.rows + 5]);
        }
        grid.style.gridTemplateRows = `repeat(${gridSize.rows}, 50px)`;
        cells = grid.querySelectorAll(".cell");
        cellsInit();
        setZindex();
        renderHistory();
        renderToGrid();

    });
    
    addGridRowTop.addEventListener("click", ()=>{
        gridSize.rows ++
        for(let i=0; i<gridSize.colums; i++){
            newCell = grid.lastChild.cloneNode(true);
            newCell.dataset.id = idGenerator();
            grid.insertBefore(newCell, grid.children[4]);
        }
        grid.style.gridTemplateRows = `repeat(${gridSize.rows}, 50px)`;
        cells = grid.querySelectorAll(".cell");
        cellsInit();
        setZindex();
        renderHistory();
        renderToGrid();
    });

    addGridColumnLeft.addEventListener("click", ()=>{
        gridSize.colums ++
        for(let i=0, j=4; i<gridSize.rows; i++, j+=gridSize.colums){
            newCell = grid.lastChild.cloneNode(true);
            newCell.dataset.id = idGenerator();
            grid.insertBefore(newCell, grid.children[j]);
        }
        grid.style.gridTemplateColumns = `repeat(${gridSize.colums}, 50px)`;
        cells = grid.querySelectorAll(".cell");
        cellsInit();
        setZindex();
        renderHistory();
        renderToGrid();
    });

    addGridColumnRight.addEventListener("click", ()=>{
        gridSize.colums ++
        for(let i=0, j=4+gridSize.colums-1; i<gridSize.rows; i++, j+=gridSize.colums){
            newCell = grid.lastChild.cloneNode(true);
            newCell.dataset.id = idGenerator();
            grid.insertBefore(newCell, grid.children[j]);
        }
        grid.style.gridTemplateColumns = `repeat(${gridSize.colums}, 50px)`;
        cells = grid.querySelectorAll(".cell");
        cellsInit();
        setZindex();
        renderHistory();
        renderToGrid();
    });


    grid.addEventListener("mousedown", e =>{
        currentGridTop = parseInt(grid.style.top);
        currentGridLeft = parseInt(grid.style.left);
        grid.addEventListener("mousemove", mousemove = a =>{
            grid.style.top = `${currentGridTop + (a.clientY - e.clientY)}px`
            grid.style.left = `${currentGridLeft + (a.clientX - e.clientX)}px`
        })

        grid.addEventListener("mouseup", ()=>{
            grid.removeEventListener("mousemove", mousemove);
            setZindex();
        })
    
        grid.addEventListener("mouseleave", ()=>{
            grid.removeEventListener("mousemove", mousemove);
            setZindex();
        })    
    })    

    
// dom load
})




