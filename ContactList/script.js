/*
 * cl for Contact List.  Declaring main object.
 */
var cl = {};

/*
 * Array that stores all contact data in local database
 */
cl.contactsArray = [];

/*
 * Variable that saves the ID of the current contact that is being edited
 */
cl.currentContactId = "";

/*
 * document.getElementById
 */
cl.contactNameId = document.getElementById("contactName");
cl.contactPhoneId = document.getElementById("contactPhone");
cl.contactEmailId = document.getElementById("contactEmail");
cl.contactAddressId = document.getElementById("contactAddress");
cl.contactGroupId = document.getElementById("contactGroup");
cl.displayContactsId = document.getElementById("displayContacts");

/*
 * Contact object constructor
 */
cl.Contact = function (name, phone, email, address, group) {
    this.id = null;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.address = address;
    this.group = group;
}

/*
 * Prototype for cl.Contact
 */
cl.Contact.prototype.addId = function (id) {
    this.id = id;
}
cl.Contact.prototype.editGroup = function (group) {
    this.group = group;
}

/*
 * Firebase Related (For this sample app, we won't be using master AJAX)
 */
cl.firebaseURL = "https://docodo-contactlist.firebaseio.com/";


/*
 * Create Read Update Delete functionalizty goes here
 */

// [Create]
cl.createContact = function () {
    // Grab the value from the Group dropdown list
    var e = cl.contactGroupId;
    var selectedGroup = e.options[e.selectedIndex].value;

    // Construct a new Object that will be used to be added to local array and firebase.
    var newContact = new cl.Contact(cl.contactNameId.value, cl.contactPhoneId.value, cl.contactEmailId.value, cl.contactAddressId.value, selectedGroup);

    // Start new XMLHttpRequest
    var request = new XMLHttpRequest();
    request.open("POST", cl.firebaseURL + ".json", true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            //Run this block of code on success
            console.log(JSON.parse(this.response));
            newContact.addId(JSON.parse(this.response).name);
            cl.contactsArray.push(newContact);
            cl.displayContacts();
        }
        else {
            //Run this block of code on bad status
            alert("Error on " + "POST" + " : " + this.response);
        }
    }
    request.onerror = function () {
        alert("Server error on " + "POST");
    }
    //Send data to firebase after turning it into JSON format
    request.send(JSON.stringify(newContact));

    //debug tool
    console.log(cl.contactsArray);
}

// [Read]
cl.getContactsOnLoad = function(){
    // Start new XMLHttpRequest
    var request = new XMLHttpRequest();
    request.open("GET", cl.firebaseURL + ".json", true);
    request.send();
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            //Run this block of code on success
            var data = (JSON.parse(this.response));
            for (var i in data) {
                data[i].id = i;
                cl.contactsArray.push(data[i]);
                cl.displayContacts();
            }
        }
        else {
            //Run this block of code on bad status
            alert("Error on " + "POST" + " : " + this.response);
        }
    }
    
    request.onerror = function () {
        alert("Server error on " + "POST");
    }
}
cl.displayContacts = function () {
    cl.displayContactsId.innerHTML = "";
    var h = "";
    for (var i = 0; i < cl.contactsArray.length; i++) {
        h += "<tr>";
        h += "<td>" + cl.contactsArray[i].name + "</td>";
        h += "<td>" + cl.contactsArray[i].phone + "</td>";
        h += "<td>" + cl.contactsArray[i].email + "</td>";
        h += "<td>" + cl.contactsArray[i].address + "</td>";
        h += "<td>" + cl.contactsArray[i].group + "</td>";
        h += "<td>" + "<button class='btn btn-primary btn-sm' data-toggle='modal' data-target='#myModal' onclick='cl.editModal(\"" + cl.contactsArray[i].id + "\")'><span class='glyphicon glyphicon-edit'</button>";
        h += "<button class='btn btn-danger btn-sm' onclick='cl.deleteContact(\"" + cl.contactsArray[i].id + "\")'><span class='glyphicon glyphicon-trash'</button></td>"
        h += "</tr>";
    }
    cl.displayContactsId.innerHTML = h;
}

// [Update]
cl.editModal = function (id) {
    cl.currentContactId = id;
    for (var i = 0; i < cl.contactsArray.length; i++) {
        if (cl.contactsArray[i].id == id) {
            $("#editName").val(cl.contactsArray[i].name);
            $("#editPhone").val(cl.contactsArray[i].phone);
            $("#editEmail").val(cl.contactsArray[i].email);
            $("#editAddress").val(cl.contactsArray[i].address);
            $("#editGroup").val(cl.contactsArray[i].group);
        }
    }
}
cl.saveChanges = function () {
    var data;
    for (var i = 0; i < cl.contactsArray.length; i++) {
        if (cl.contactsArray[i].id == cl.currentContactId) {
            data = new cl.Contact(
                document.getElementById("editName").value,
                document.getElementById("editPhone").value,
                document.getElementById("editPhone").value,
                document.getElementById("editAddress").value,
                document.getElementById("editGroup").value
                );

            cl.contactsArray[i] = data;
            cl.displayContacts();
        }
    }

    var request = new XMLHttpRequest();
    request.open("PUT", cl.firebaseURL + cl.currentContactId + ".json", true);
    request.send(JSON.stringify(data));
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            //Run this block of code on success
            cl.displayContacts();
        }
        else {
            //Run this block of code on bad status
            alert("Error on " + "PUT" + " : " + this.response);
        }
    }
    request.onerror = function () {
        alert("Server error on " + "POST");
    }
    
}

// [Deleate]
cl.deleteContact = function (id) {
    var request = new XMLHttpRequest();
    request.open("DELETE", cl.firebaseURL + id + ".json", true);
    request.send();
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            //Run this block of code on success
            for (var i = 0; i < cl.contactsArray.length; i++) {
                if (cl.contactsArray[i].id == id) {
                    cl.contactsArray.splice(i, 1);
                }
            }
            cl.displayContacts();
        }
        else {
            //Run this block of code on bad status
            alert("Error on " + "DELETE" + " : " + this.response);
        }
    }
    request.onerror = function () {
        alert("Server error on " + "POST");
    }
}

/*
 * Initial GET when application loads
 */
cl.getContactsOnLoad();

