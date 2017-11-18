"use strict";

let items = {
    headers: ["Select display range"],
    data: [
        ["today"],
        ["yesterday"],
        ["week"],
        ["month"],
        ["forever"],
    ]};
let commands =  {
    today: () => {
        console.log("today");
    },
    yesterday: () => {
        console.log("yesterday");
    },
    week: () => {
        console.log("week");
    },
    month: () => {
        console.log("forever");
    },
};

commands[items.data[0][0]]();
