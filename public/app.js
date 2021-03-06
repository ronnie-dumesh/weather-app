//Make drop-down of top 100 cities
window.addEventListener("load", () => {
    let city = document.getElementById("city");

    const getCitiesAPI = 'http://localhost:3000/getCities';
    fetch(getCitiesAPI)
                .then(response => {return response.json();})
                .then(data => {
                    for(let i = 0; i < data.length; i++){
                        let dropDownChoice = document.createElement("option");
                        dropDownChoice.text=(data[i]['city'] + ', ' + data[i]['state']);
                        city.add(dropDownChoice);
                    }
                })
                .catch((error) => {console.error('Error:', error);});
});

//Submit user email and city and alert user if this action is successful 
$(document).ready(function () {
    $("#registrationForm").submit(function(event) {
        event.preventDefault(); 
        let formData = $(this).serializeArray(); 
        let parsedFormData = {
            email : formData[0]['value'],
            city : formData[1]['value']
        };
        const addEmailAPI = 'http://localhost:3000/addEmail';
        fetch(addEmailAPI, 
                {method: 'POST', 
                headers: {'Content-Type': "application/json",},
                body: JSON.stringify(parsedFormData),})
                    .then(response => {return response;})
                    .then(data => {
                        console.log('Success:', data);
                        alert("Your email is now in the database!");
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        alert("Unfortunately, you cannot sign up right now, try again later!");
                    });
    });
});
