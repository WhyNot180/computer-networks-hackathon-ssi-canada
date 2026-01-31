
async function Greenhouse(file){
    let x = await fetch(file);
    let y = await x.text();

    const data = await response.json();

    const dataList = document.getElementById('GreenhouseOptions');

    data.forEach(value => {
            const p = document.createElement('p');
            p.textContent = `Temperature: ${value.temp}, Name: ${value.hum}, Color: ${value.soil_val}`;
            dataList.appendChild(p);
            const br = document.createElement('br');
            dataList.appendChild(br);
    
        });

}


setInterval(Greenhouse("/greenhouses/"), 100);