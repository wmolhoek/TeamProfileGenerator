const inquirer = require("inquirer");
const joi = require("joi");
const Employee = require("./lib/employee");
const Engineer = require("./lib/engineer");
const Intern = require("./lib/intern");
const Manager = require("./lib/manager");
const render = require("./lib/htmlRenderer");
const fs = require("fs");

const employeeQs = [{
    type: "input",
    message: "Team member name:",
    name: "name",
    validate: validateName
},
{
    type: "number",
    message: "Team member ID:",
    name: "id",
    validate: validateID
},
{
    type: "input",
    message: "Email address:",
    name: "email",
    validate: validateEmail
}];

const managerQs = [{
    type: "input",
    message: "Manager office number:",
    name: "officeNum",
    validate: validateName
}];

const engineerQs = [{
    type: "input",
    message: "Engineer's GitHub handle:",
    name: "github",
    validate: validateName
}];

const internQs = [{
    type: "input",
    message: "Intern's school:",
    name: "school",
    validate: validateName
}];

let fullQs = [];
const manager = [];
const engineers = [];
const interns = [];

function getRole() {
    inquirer.prompt(
        {
            type: "list",
            message: "What type of team member would you like to add?",
            name: "title",
            choices: [
                "Manager",
                "Engineer",
                "Intern",
                "Done"
            ],
            validate: validateTitle
        }

    ).then(function (data) {
        console.log(data.title) 
        if (data.title === "Done") {
            renderHTML();
        }
        else if (data.title === "Manager") {
            fullQs = [...employeeQs, ...managerQs];
            getData(data.title);
        }
        else if (data.title === "Engineer") {
            fullQs = [...employeeQs, ...engineerQs];
            getData(data.title);
        }
        else if (data.title === "Intern") {
            fullQs = [...employeeQs, ...internQs];
            getData(data.title);
        }
    });
}

function getData(title) {
    inquirer.prompt(fullQs).then(function (data) {
        const { name, id, email, officeNum, github, school } = data;
        switch (title) {
            case "Manager":
                manager.push(new Manager(name, id, email, officeNum));
                break;
            case "Engineer":
                engineers.push(new Engineer(name, id, email, github));
                break;
            case "Intern":
                interns.push(new Intern(name, id, email, school));
                break;
        }
        console.log("================================");
        console.log(manager);
        console.log(engineers);
        console.log(interns);
        getRole();
    });

}

async function renderHTML(){
    console.log("getting ready to render HTML");
    try {
        const employees = [...manager, ...engineers, ...interns];
        console.log("================================");
        console.log(employees)
        const htmlcontent = await render(employees);
        fs.writeFile("output/team_profile.html", htmlcontent, err => {
            if (err){
                return console.log(err);
            }
            console.log("HTML file created!")
        });
    }
    catch (err) {
        console.log(err);
    }
    
    
};

function onValidation(err, val) {
    if (err) {
        console.log(err.message);
        valid = err.message;
    }
    else {
        valid = true;
    }

    return valid;
}

function validateTitle(title) {
    return joi.validate(title, joi.array().min(1), onValidation);
}

function validateName(name) {
    return joi.validate(name, joi.string().required(), onValidation);
}

function validateID(id) {
    return joi.validate(id, joi.number().integer().min(1).max(999999), onValidation);
}

function validateEmail(email) {
    return joi.validate(email, joi.string().email({ minDomainSegments: 2 }), onValidation);
}

getRole();

