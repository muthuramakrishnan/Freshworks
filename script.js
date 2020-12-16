let checkBoxSelectedCount = 0;
let checkBoxCount = 0;
DesignTableAndPopulateData();
selectAllCheckBoxListner();
createContact();
//this function makes a call to fetch json data. then configures checkboxlistner and then makes a call to delete function
async function DesignTableAndPopulateData(){
    try{
        let response = await getContactData();
        populateDataInsideTable(JSON.parse(response));
        // console.log(JSON.parse(response));
    }
    catch(error){
        console.error(error);
    }
    individualCheckBoxListner();
    let deleteButton = document.querySelector('#deleteButton');
    deleteButton.addEventListener('click',function(event){
        let checkBxs = document.querySelectorAll('.dataCheckBoxes');
        checkBxs.forEach(async function(checkBx){
            if(checkBx.checked)
            {
                try{
                    await deleteDataItem(checkBx.id);
                    window.location.reload();
                }
                catch(error){
                    console.error(error);
                }
                
            }
        });
    });
}


//makes api call to load the contact data
function getContactData(){
    return new Promise((resolve, reject)=>{
        let xhr = new XMLHttpRequest();
        xhr.open('GET','https://newaccount1608018282199.freshdesk.com/api/v2/contacts',true);
        xhr.setRequestHeader('Authorization','WEFnRnlTV241R2xucndlY2pvekE6WA==');
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==200)
            {
                resolve(xhr.responseText);
            }
            else if(xhr.readyState == 4 && xhr.status!=200)
            {
                reject('Internal Service Error');
            }
        }
        xhr.send();
    });
}

//populates the json data in the UI
function populateDataInsideTable(jsonContactList){
    let table = document.querySelector('#contactTable');
    let tBody = document.createElement('tbody');

    jsonContactList.forEach(function(data){
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        let ip = document.createElement('input');
        ip.setAttribute('type','checkbox');
        ip.setAttribute('id',data.id);
        ip.setAttribute('class','dataCheckBoxes')
        tr.append(ip);

        td = document.createElement('td');
        data.name=='undefined'?td.innerText = '--':td.innerText = data.name;
        tr.append(td);

        td = document.createElement('td');
        data.job_title==null?td.innerText = '--':td.innerText = data.job_title;
        tr.append(td);

        td = document.createElement('td');
        data.company_id==null?td.innerText = '--':td.innerText = data.company_id;
        tr.append(td);

        td = document.createElement('td');
        data.email==null?td.innerText = '--':td.innerText = data.email;
        tr.append(td);
        
        td = document.createElement('td');
        data.phone==null?td.innerText='--':td.innerText = data.phone;
        tr.append(td);
        
        td = document.createElement('td');
        data.facebook_id==null?td.innerText='--':td.innerText = data.facebook_id;
        tr.append(td);

        td = document.createElement('td');
        data.twitter_id==null?td.innerText='--':td.innerText = data.twitter_id;
        tr.append(td);
        tBody.append(tr);
    });
    table.append(tBody);
    table = document.querySelector('#contactTable');
}

//keeps track of checked and unchecked checkboxes
function individualCheckBoxListner(){
    let checkBxs = document.querySelectorAll('.dataCheckBoxes');
    checkBxs.forEach(function(checkBx){
        checkBx.addEventListener('change',function(event){
            if(checkBx.checked == true)
            {
                checkBoxSelectedCount++
            }else{
                checkBoxSelectedCount--;
            }
            if(checkBoxSelectedCount>0 )
            {
                document.querySelector('#deleteButton').disabled = false;
                document.querySelector('#editButton').disabled = false;
            }
            else {
                document.querySelector('#deleteButton').disabled = true;
                document.querySelector('#editButton').disabled = true;
            }
            if(checkBoxSelectedCount != checkBoxCount)
            {
                document.querySelector('#selectAll').checked = false;
            }
        });
    });
}

//receives call from DesignTableAndPopulateData function to delete a data item
function deleteDataItem(contactId){
    return new Promise((resolve, reject)=>{
        let xhr = new XMLHttpRequest();
        let url = 'https://newaccount1608018282199.freshdesk.com/api/v2/contacts/'+contactId+'/hard_delete?force=true';
        xhr.open('DELETE',url,true);
        xhr.setRequestHeader('Authorization','WEFnRnlTV241R2xucndlY2pvekE6WA==');
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==204)
            {
                resolve('DELETE SUCCESS');
                console.log('DELETE SUCCESS');
            }
            else if(xhr.readyState == 4 && xhr.status!=204)
            {
                reject('Internal Service Error');
            }
        }
        xhr.send();
    });
}

//keeps track of selectAll checkbox
function selectAllCheckBoxListner(){
    let selectAllBx = document.querySelector('#selectAll');
    selectAllBx.addEventListener('change',function(event){

        let checkBxs = document.querySelectorAll('.dataCheckBoxes');

        checkBxs.forEach(function(box){
            checkBoxCount++;
            if(selectAllBx.checked == true)
            {
                box.checked = true;
                checkBoxSelectedCount++;
            }
            else{
                box.checked = false;
                checkBoxSelectedCount--;
            }
        });
        if(selectAllBx.checked == true)
        {
            document.querySelector('#deleteButton').disabled = false;
            document.querySelector('#editButton').disabled = false;
        }
        else{
            document.querySelector('#deleteButton').disabled = true;
            document.querySelector('#editButton').disabled = true;
            checkBoxSelectedCount=0;
        }

    });
}

async function createContact(){
    console.log('dsfasd');
    let createForm = document.getElementById('createContact');
    createForm.addEventListener('submit',async function(event){
        event.preventDefault();
        await sendCreateRequest();
        
        window.location.reload();
    })
    
}

function sendCreateRequest(){
    console.log('creatngggg')
    let full_name = document.getElementById('full_name').value;
    let title = document.getElementById('title').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let twitter_id = document.getElementById('twitter_id').value;
    let address = document.getElementById('address').value;
    let about = document.getElementById('about').value;
    let jsonobj = {
        'name':full_name,
        'email':email,
        'mobile':phone
    }
    return new Promise((resolve, reject)=>{
        let xhr = new XMLHttpRequest();
        let url = 'https://newaccount1608018282199.freshdesk.com/api/v2/contacts';
        let params = JSON.stringify(jsonobj);
        xhr.open('POST',url,true);
        xhr.setRequestHeader('Authorization','WEFnRnlTV241R2xucndlY2pvekE6WA==');
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==201)
            {
                resolve('CREATE SUCCESS');
                console.log('CREATE SUCCESS');
            }
            else if(xhr.readyState == 4 && xhr.status!=201)
            {
                reject('Internal Service Error');
            }
        }
        xhr.send(params);
    });
}
