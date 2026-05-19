backbutton = document.createElement("button");
backbutton.classList.add("back-btn");
backbutton.textContent = "← Back";

backbutton2 = document.createElement("button");
backbutton2.classList.add("back-btn");
backbutton2.textContent = "← Back";
category_list=document.createElement("div");
category_list.innerHTML=
`<div id="category-wise-data"> 
 <button>Quant</button>
 <button>DSA</button>
 <button>Core-Elec</button>
 <button>Development</button>
 <button>Entertainment</button>
     </div>`;

    const monthYear = document.getElementById("monthYear");
    const datesContainer = document.getElementById("dates");
    const selectedDateText = document.getElementById("selectedDate");

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    let currentDate = new Date();

    function renderCalendar() {
      datesContainer.innerHTML = "";

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const firstDay = new Date(year, month, 1).getDay();
      const totalDays = new Date(year, month + 1, 0).getDate();

      const monthNames = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
      ];

      monthYear.textContent = `${monthNames[month]} ${year}`;

      // Empty spaces before month starts
      for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("empty");
        datesContainer.appendChild(emptyDiv);
      }

      // Create date cells
      for (let day = 1; day <= totalDays; day++) {
        const dateDiv = document.createElement("div");
        dateDiv.classList.add("date");
        dateDiv.textContent = day;

       dateDiv.addEventListener("click", () => {

    document.querySelectorAll(".date").forEach(d => {
        d.classList.remove("selected");
    });

    dateDiv.classList.add("selected");

    let selectedDay = day;
    let selectedMonth = monthNames[month];
    let selectedMonthNumber = month + 1;
    let selectedYear = year;


    selectedDateText.textContent =
        `Selected: ${selectedDay} ${selectedMonth} ${selectedYear}`;

    console.log(selectedDay);
    console.log(selectedMonth);
    console.log(selectedMonthNumber);
    console.log(selectedYear);
    let calendar = document.querySelector(".calendar");
    calendar.remove();
    document.body.append(category_list);
    const buttons=category_list.querySelectorAll("button");
    buttons.forEach((button)=>
    {    const fresh = button.cloneNode(true);
        button.replaceWith(fresh);
        fresh.addEventListener("click",()=>
        {   category_name=button.innerText;
            category_list.remove();
            backbutton.remove();
              document.body.append(backbutton2); 
            backbutton2.addEventListener("click",()=>{
                analysis.remove();
                document.body.append(category_list);
                 backbutton2.remove();
                document.body.append(backbutton);

            });
            analysis=document.createElement("div");
            analysis.id="analysis";
                const day =
               String(selectedDay).padStart(2, "0");

                const month =
                String(selectedMonthNumber)
               .padStart(2, "0");

        date_mentioned =`${day}/${month}/${selectedYear}`;
            chrome.storage.local.get(["analytica"],(result)=>
            {  analytica=result.analytica || {};    
            const dayData = analytica[date_mentioned]?.[category_name];
            if (!dayData) {
             analysis.innerHTML = `<p>No data for ${category_name} on ${date_mentioned}.</p>`;
              document.body.append(analysis);
                  return;
            }
            activetotalSeconds=analytica[date_mentioned][category_name].activetime ||0 ;
             const activeh = Math.floor(activetotalSeconds / 3600);
            const activem = Math.floor((activetotalSeconds % 3600) / 60);
            const actives = Math.floor(activetotalSeconds % 60);      
            analysis.innerHTML= `<div id="activetime">Total active time: ${activeh} h ${activem}min ${actives} sec</div>`;
            passivetotalSeconds=analytica[date_mentioned][category_name].passivetime ||0;
            const passiveh = Math.floor(passivetotalSeconds / 3600);
            const passivem = Math.floor((passivetotalSeconds % 3600) / 60);
            const passives = Math.floor(passivetotalSeconds % 60);           
            analysis.innerHTML+= `<div  id="passivetime">Total passive time: ${passiveh} h ${passivem}min ${passives} sec<div>`;

             document.body.append(analysis);

            }   
            );
         
        });
  
    });
    document.body.append(backbutton);
    backbutton.addEventListener("click",()=>
    {
    category_list.remove();
    backbutton.remove();
    document.body.append(calendar);

    }, { once: true });

});

        datesContainer.appendChild(dateDiv);
      }
    }

    prevBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });

    nextBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });

    renderCalendar();



