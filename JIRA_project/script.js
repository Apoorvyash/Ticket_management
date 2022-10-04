let addBtn = document.querySelector(".add-btn");
let addflag = false;
let remflag = false;
let rembtn = document.querySelector(".delete-btn");
let allPrioritycolors = document.querySelectorAll(".priority-color");

let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textareaCont = document.querySelector(".textarea-cont");
let colors = ["yellow", "purple", "lightgrey", "lightblack"]; //ye sare colors h
let modalPriorityColor = colors[colors.length - 1];
let toolBoxColors = document.querySelectorAll(".color");
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";
let ticketsArr = [];
for (let i = 0; i < toolBoxColors.length; i++){
    toolBoxColors[i].addEventListener("click", (e) => {
        let currentToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketsArr.filter((ticketObj, idx)=> {
            return currentToolBoxColor === ticketObj.ticketcolor;
        })
        //Remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++){
            allTicketsCont[i].remove();
        }
        //display new filtered tickets
        filteredTickets.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketcolor, ticketObj.tickettask, ticketObj.ticketid);
        })
    })
    toolBoxColors[i].addEventListener("dblclick", (e) => {
        //remove kr rhe h prev tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++){
            allTicketsCont[i].remove();
        }
        ticketsArr.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketcolor, ticketObj.tickettask, ticketObj.ticketid);
        })
    })
}
addBtn.addEventListener("click", (e) => {
    //modal bna rhe h taki ticket bne
    //addflag true->display
    //addflag false->none
    addflag = !addflag;
    if (addflag) {
        modalCont.style.display = "flex";
    }
    else {
        modalCont.style.display = "none";
    }
})
rembtn.addEventListener("click", (e) => {
    remflag = !remflag;
})

modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Shift") {
        createTicket(modalPriorityColor, textareaCont.value);
        setModaltodefault();
        
        addflag=false;
    }
})
allPrioritycolors.forEach((colorElem, idx)=> {
    colorElem.addEventListener("click", (e) => {
        allPrioritycolors.forEach((prioritycolorelem, idx) => {
            prioritycolorelem.classList.remove("border");
        })
        colorElem.classList.add("border");
        modalPriorityColor = colorElem.classList[0];
    })
     //default lga rhe h
})

function createTicket(ticketcolor, tickettask, ticketid) {
    let id = ticketid || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
        <div class="ticket-cont">
            <div class="ticket-color ${ticketcolor}"></div>
            <div class="ticket-id ">${id}</div>
            <div class="task-area">${tickettask}</div>
            <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div>
        </div>
    
`;
    mainCont.appendChild(ticketCont);
    //create ticket ki object and add to array
    if (!ticketid) {
        localStorage.setItem("jira_tickets", JSON.stringify(ticketsArr));
        ticketsArr.push({ ticketcolor, tickettask, ticketid: id })
    };
    handleRemoval(ticketCont, id);
    handleLock(ticketCont, id);
    handleColor(ticketCont, id);
}
    function handleRemoval(ticket, id) {
        // remove flag agar true-> remove
        ticket.addEventListener("click", (e) => {
            if (!remflag) return;
            let idx=getTicketIdx(id);
            ticketsArr.splice(idx, 1);
            let strTicketsArr = JSON.stringify(ticketsArr);
            localStorage.setItem("jira_tickets", strTicketsArr);

        ticket.remove();
        })
        
    }
    function handleLock(ticket, id) {
        let ticketLockelem = ticket.querySelector(".ticket-lock");
        let ticketLock = ticketLockelem.children[0];
        let ticketTaskArea = ticket.querySelector(".task-area");
        ticketLock.addEventListener("click", (e) => {
            let ticketIdx = getTicketIdx(id);
            if (ticketLock.classList.contains(lockClass)) {
                ticketLock.classList.remove(lockClass);
                ticketLock.classList.add(unlockClass);
                ticketTaskArea.setAttribute("contenteditable", "true");
            }
            else {
                ticketLock.classList.remove(unlockClass);
                ticketLock.classList.add(lockClass);
                ticketTaskArea.setAttribute("contenteditable", "false");
            }
            //modify data (task)
            ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
            localStorage.setItem("jira_tickets", JSON.stringify(ticketsArr));
        })
}
function handleColor(ticket, id) {
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
        //get index of ticket from array
        let ticketIdx = getTicketIdx(id);
        let currentTicketColor = ticketColor.classList[1];
        //get ticket color idx
        let currcolor = colors.findIndex((color) => {
            return currentTicketColor === color;
        })

        currcolor++;
        let newTicketColoridx = currcolor % colors.length;
        let newTicketColor = colors[newTicketColoridx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);
        
        //modify data

        ticketsArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("jira_tickets", JSON.stringify(ticketsArr));

    })

}

function getTicketIdx(id) {
    let ticketIdx = ticketsArr.findIndex((ticketObj) => {
        return ticketObj.ticketID === id;
    })
    return ticketIdx;
}
function setModaltodefault() {
    textareaCont.value = ""; 
    modalCont.style.display = "none";
    modalPriorityColor = colors[colors.length - 1];
    allPrioritycolors.forEach((prioritycolorelem, idx) => {
        prioritycolorelem.classList.remove("border");
    })
    allPrioritycolors[allPrioritycolors.length - 1].classList.add("border");
    
}