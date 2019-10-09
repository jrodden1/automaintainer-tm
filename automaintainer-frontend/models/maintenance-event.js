class MaintEvent {
   constructor(data) {
      this.id = data.id
      this.completed = new Date(data.completed).toLocaleDateString()
      this.mileage = data.mileage
      this.eventType = data.event_type
      this.cost = data.cost
      this.vehicleId = data.vehicle_id
      MaintEvent.all.push(this)
   }
   
   static all = []

   static createMaintEventElements(maintEventObjsArr, targetUlNode) {
      //REFACTOR - should sort maintEventObjsArr by completed date ascending
      maintEventObjsArr.forEach(maintEventData => {
         const newMaintEventInst = new MaintEvent(maintEventData)
         const newMaintEventElem = newMaintEventInst.createMaintEvent()
         targetUlNode.appendChild(newMaintEventElem)
      })
   }

   static createNewMaintEvent(event) {
      event.preventDefault()
     

      const mileage = event.currentTarget.querySelector("#mileage")
      const completed = event.currentTarget.querySelector("#completed")
      const eventType = event.currentTarget.querySelector("#event-type")
      const cost = event.currentTarget.querySelector("#cost")
      const comment = event.currentTarget.querySelector("#comment")
      const vehicleId = event.currentTarget.querySelector("#for-vehicle")
      
      const newMaintEventObject = {
         maint_event: {
            mileage: mileage.value,
            completed: completed.value,
            event_type: eventType.value,
            cost: cost.value,
            comment: comment.value,
            vehicle_id: vehicleId.value
         }
      }

      const postOptionsObj = {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
         },
         body: JSON.stringify(newMaintEventObject)
      }
      
      fetch("http://localhost:3000/maint_events", postOptionsObj)
         .then(resp => resp.json())
         .then(newMaintEventData => MaintEvent.processNewMaintEventData(newMaintEventData))
         .catch(error => console.log(error))
      
      clearNewMaintForm()
      //Gets a new collection of all the collapsibles including the one just created
      $('.collapsible').collapsible();

      function clearNewMaintForm() {
         mileage.value = ""
         completed.value = ""
         eventType.value = ""
         cost.value = ""
         comment.value = ""
         vehicleId.value = ""
      }
   }

   static processNewMaintEventData(newMaintEventData) {  
      let newMaintEventInst = new MaintEvent(newMaintEventData)
      let newMaintEventElem = newMaintEventInst.createMaintEvent()
      let vehicleMaintEventsUl = document.querySelector(`#data-events-for-vehicle-${newMaintEventInst.vehicleId}`)
      const maintEventsP = document.querySelector(`#me-header-for-vehicle-${newMaintEventInst.vehicleId}`)
      if(maintEventsP.getAttribute("style") === "display: none;") {
         maintEventsP.setAttribute("style", "display: block;")
         vehicleMaintEventsUl.setAttribute("style", "display: block;")
      }  
      vehicleMaintEventsUl.appendChild(newMaintEventElem)
      console.log(`New MaintEvent "${newMaintEventInst.eventType}" appended to Vehicle ID: ${newMaintEventInst.vehicleId}`)
   }


   createMaintEvent() {
      const newMaintEventLi = document.createElement("li")
      newMaintEventLi.setAttribute("id", `maint-event-${this.id}`)

      newMaintEventLi.innerHTML = 
         `<div class="collapsible-header" tabindex="0"><i class="material-icons">build</i><strong>${this.eventType} - ${this.completed}</strong></div>
         <div class="collapsible-body"></div>`
      
      const maintEventDetailsElem = newMaintEventLi.querySelector(".collapsible-body")
      maintEventDetailsElem.innerHTML = 
         `<p>Mileage at time of Event: ${this.mileage} mi</p>
         <p>Cost: $${this.cost}</p>`

      return newMaintEventLi
   }
}