/*
    Name: Vincent Gordon
    Email: vincent_gordon@student.uml.edu
    Copyright (c) 2023 by Vincent.
    Date of file creation: May 28th 2023 at 12:32 pm
    Last updated by Vincent June 16th 2023 at 1:53 pm
*/

$(function () {
    var maxNum = 50;
    var minNum = -50;
    var table = document.getElementById("table");

    /*
        Create objects for each of the four inputs holding 3 things: A control variable (error),
        The message element from the HTML, and the input field element from the HTML.
        I chose to use objects since I can change the inner contents while inside of a function call easier.
        The control variable, error, wants to be true for the checks further down. 
    */
    var minRow = {
        error: true,
        msg: $('#minRowError'),
        value: $('#minRow')
    }

    var maxRow = {
        error: true,
        msg: $('#maxRowError'),
        value: $('#maxRow')
    }

    var minCol = {
        error: true,
        msg: $('#minColError'),
        value: $('#minCol')
    }

    var maxCol = {
        error: true,
        msg: $('#maxColError'),
        value: $('#maxCol')
    }

    var $createTable = $('#createTable');

    //The button to create the table. This just calls a function which does everything already.
    $createTable.on("click", () => {
        updateTable();
    })

    //The keyboard events corresponding to the input boxes.
    keyEvents();

    function validateNum(selection, opposite) {
        var selectVal = parseFloat(selection.value.val()).toFixed();

        //Make sure values are within -50 and 50.
        if (selection.value.val().length == 0) {
            selection.msg.text("Cannot be empty.");
            selection.error = false;
            return false;
        }
        else if(parseInt(selectVal) > maxNum || parseInt(selectVal) < minNum) {
            selection.msg.text("The value must be between -50 and 50.");
            selection.error = false;
            return false;
        }
        else {
            selection.msg.text("");
            selection.error = true;
            return true;
        }
    }

    function validateMinMax(min, max, type) {
        //Check for empty string. If it is, then this won't work as parseFloat on an empty string causes NaN, not 0.
        //With this in mind, the one with 0 length gets returned false to end the function call early.
        if (min.value.val().length == 0 || max.value.val().length == 0) {
            return false;
        }

        var minVal = parseInt(parseFloat(min.value.val()).toFixed());
        var maxVal = parseInt(parseFloat(max.value.val()).toFixed());

        //Checks for minimum being smaller than maximum row/column.
        //The type variable tells whether it was a row or a column causing the error.
        if (minVal <= maxVal) {
            min.error = true;
            max.error = true;
            min.msg.text("");
            max.msg.text("");
        }
        else if (minVal > maxNum || minVal < minNum) {
            min.error = false;
            max.error = false;
            if (type == "row") {
                max.msg.text("Must be larger than or equal to the minimum row.");
            }
            else {
                max.msg.text("Must be larger than or equal to the minimum column.");
            }
        }
        else if (maxVal > maxNum || maxVal < minNum) {
            min.error = false;
            max.error = false;
            if (type == "row") {
                min.msg.text("Must be smaller than or equal to the minimum row.");
            }
            else {
                min.msg.text("Must be smaller than or equal to the minimum column.");
            }
        }
        else {
            min.error = false;
            max.error = false;
            if (type == "row") {
                min.msg.text("Must be smaller than or equal to the minimum row.");
                max.msg.text("Must be larger than or equal to the minimum row.");
            }
            else {
                min.msg.text("Must be smaller than or equal to the minimum column.");
                max.msg.text("Must be larger than or equal to the minimum column.");
            }
        }
    }

    function keyEvents () {
        //Check for whenever a key is no longer being pressed. Run the validation function with the appropriate objects passed in.
        //It has to check both the min and max rows here to display the correct messages. If only 1 was called, there is a chance
        //that the one being worked on works out so it then goes into validateMinMax and deletes the error message from before on the other one. This was a bug.
        //The click functions are here to ensure that when clicking the arrows(since type num in html has arrows), it still checks for validation.
        minRow.value.keyup(() => {
            if (validateNum(minRow, maxRow) && validateNum(maxRow, minRow)) {
                validateMinMax(minRow, maxRow, "row");
            }
        })

        minRow.value.click(() => {
            if (validateNum(minRow, maxRow) && validateNum(maxRow, minRow)) {
                validateMinMax(minRow, maxRow, "row");
            }
        })

        maxRow.value.keyup(() => {
            if (validateNum(maxRow, minRow) && validateNum(minRow, maxRow)) {
                validateMinMax(minRow, maxRow, "row");
            }
        })

        maxRow.value.click(() => {
            if (validateNum(maxRow, minRow) && validateNum(minRow, maxRow)) {
                validateMinMax(minRow, maxRow, "row");
            }
        })

        minCol.value.keyup(() => {
            if (validateNum(minCol, maxCol) && validateNum(maxCol, minCol)) {
                validateMinMax(minCol, maxCol, "col");
            }
        })

        minCol.value.click(() => {
            if (validateNum(minCol, maxCol) && validateNum(maxCol, minCol)) {
                validateMinMax(minCol, maxCol, "col");
            }
        })

        maxCol.value.keyup(() => {
            if (validateNum(maxCol, minCol) && validateNum(minCol, maxCol)) {
                validateMinMax(minCol, maxCol, "col");
            }
        })

        maxCol.value.click(() => {
            if (validateNum(maxCol, minCol) && validateNum(minCol, maxCol)) {
                validateMinMax(minCol, maxCol, "col");
            }
        })
    }

    function updateTable() {
        //The if statement checks if all jQuery checks have passed. If any haven't, do nothing.
        if (minRow.error == true && maxRow.error == true && minCol.error == true && maxCol.error == true) {
            var minRowVal = parseInt(parseFloat(minRow.value.val()).toFixed());
            var maxRowVal = parseInt(parseFloat(maxRow.value.val()).toFixed());
            var minColVal = parseInt(parseFloat(minCol.value.val()).toFixed());
            var maxColVal = parseInt(parseFloat(maxCol.value.val()).toFixed());
    
            table.innerText = ""; //Get rid of the previous table, then put the new one in.

            table.appendChild(populateTable(null, minRowVal, maxRowVal, minColVal, maxColVal));
            return table;
        }
    }

    function populateTable(table, minRow, maxRow, minCol, maxCol) {
        var negCount = 0;
        var offsetCol = 0;
        var offsetRow = 0;
    
        //Create a new table element to populate.
        if (!table) table = document.createElement('table');
    
        /*
        Create the table using tr and td. Create text nodes to insert the calculated value.
        I have made the tables start 1 lower than the minimum row/col so that I can insert the header.
        This is shown as the first 3 pieces of the if statements. The top one is if its the top left corner (which should be empty)
        The 2nd down is if its the first row and the 3rd is if it isn't the first row but is the first column. The 4th is basic calculation.
        */
        for (var i = minRow - 1; i <= maxRow; i++) {
            var row = document.createElement('tr');
            for (var j = minCol - 1; j <= maxCol; j++) {
                //Check if the data cell being added is a header (outside row and column) or a regular cell.
                if (i < minRow) {
                    var th = document.createElement('th');
                    th.setAttribute('class', 'top');
                    row.appendChild(th);
                }
                else if (i >= minRow && j < minCol) {
                    var th = document.createElement('th');
                    th.setAttribute('class', 'side');
                    row.appendChild(th);
                }
                else {
                    row.appendChild(document.createElement('td'));
                }
    
                //check if negative j
                if (j < 0) {
                    if(i < minRow && j < minCol) {
                        row.cells[negCount].appendChild(document.createTextNode(""));
                    }
                    else if(i < minRow) {
                        row.cells[negCount].appendChild(document.createTextNode(minCol + offsetCol));
                        offsetCol++;
                    }
                    else if(j < minCol && i >= minRow) {
                        row.cells[negCount].appendChild(document.createTextNode(minRow + offsetRow));
                        offsetRow++;
                    }
                    else {
                        row.cells[negCount].appendChild(document.createTextNode(i * j));
                    }
                    negCount++;
                }
                else {
                    if(i < minRow && j < minCol) {
                        row.cells[j - minCol + 1].appendChild(document.createTextNode(""));
                    }
                    else if(i < minRow) {
                        row.cells[j - minCol + 1].appendChild(document.createTextNode(minCol + offsetCol));
                        offsetCol++;
                    }
                    else if(j < minCol && i >= minRow) {
                        row.cells[j - minCol + 1].appendChild(document.createTextNode(minRow + offsetRow));
                        offsetRow++;
                    }
                    else {
                        row.cells[j - minCol + 1].appendChild(document.createTextNode(i * j));
                    }
                }
            }
            negCount = 0;
            offsetCol = 0;
            table.appendChild(row);
        }
        return table;
    }

    function reset() {
        //Resets the values in the input fields and sliders. This is so it sets at the center of 0 everytime for ease of use.
        minRow.value.val(0);
        maxRow.value.val(0);
        minCol.value.val(0);
        maxCol.value.val(0);

        updateTable();
    }

    reset();
})

function formSubmit() {return false;} //Prevents page refresh.