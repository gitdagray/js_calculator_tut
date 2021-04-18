const initApp = () => {

    const currentValueElem = document.querySelector('.currentvalue');
    const previousValueElem = document.querySelector('.previousvalue');
    let itemArray = [];
    let equationArray = [];
    let newNumberFlag = false;

    const inputButtons = document.querySelectorAll('.number');
    inputButtons.forEach(button => {
        button.addEventListener('click', (event) => {

            const newInput = event.target.textContent;
            if (newNumberFlag) {
                currentValueElem.value =
                    newInput === '.'
                        ? "0."
                        : newInput;
                newNumberFlag = false;
            } else if (currentValueElem.value.includes('.') && newInput === '.') {
                return;
            } else {
                currentValueElem.value =
                    currentValueElem.value == 0 && currentValueElem.value.length == 1 && newInput !== '.'
                        ? newInput
                        : `${currentValueElem.value}${newInput}`;
            }
        });
    });

    const opButtons = document.querySelectorAll('.operator');
    opButtons.forEach(button => {
        button.addEventListener('click', (event) => {

            // equal sign showing
            if (newNumberFlag) {
                previousValueElem.textContent = "";
                itemArray = [];
            }

            const newOperator = event.target.textContent;
            let currentVal = parseFloat(currentValueElem.value);
            if (isNaN(currentVal)) currentVal = 0;

            // begin new equation 
            if (!itemArray.length) {
                itemArray.push(currentVal, newOperator);
                previousValueElem.textContent =
                    `${currentVal} 
                     ${newOperator}`;
                return newNumberFlag = true;
            }

            // complete equation 
            if (itemArray.length) {

                itemArray.push(currentVal); // 3rd elem

                const equationObj = {
                    num1: parseFloat(itemArray[0]),
                    num2: parseFloat(currentVal),
                    op: itemArray[1]
                }

                equationArray.push(equationObj);
                const equationString =
                    `${equationObj['num1']} ${equationObj['op']} ${equationObj['num2']}`;

                if (divByZero(equationString)) {
                    equationArray.pop();
                    currentValueElem.value = "/0=🤯💩";
                    // start new equation 
                    itemArray = [0, newOperator];
                } else {
                    const newValue = calculate(equationString);
                    previousValueElem.textContent = `${newValue} ${newOperator}`;
                    // start new equation 
                    itemArray = [newValue, newOperator];
                }

                newNumberFlag = true;
                console.log(equationArray);
            }
        });
    });

    const equalsButton = document.querySelector('.equals');
    equalsButton.addEventListener('click', () => {
        const currentVal = currentValueElem.value;
        let equationObj;

        // pressing equals repeatedly
        if (!itemArray.length && equationArray.length) {
            const lastEquation = equationArray[equationArray.length - 1];
            equationObj = {
                num1: parseFloat(currentVal),
                num2: lastEquation.num2,
                op: lastEquation.op
            }
        } else if (!itemArray.length) {
            return currentVal;
        } else {
            itemArray.push(currentVal);
            equationObj = {
                num1: parseFloat(itemArray[0]),
                num2: parseFloat(currentVal),
                op: itemArray[1]
            }
        }

        equationArray.push(equationObj);

        const equationString =
            `${equationObj['num1']} ${equationObj['op']} ${equationObj['num2']}`;

        previousValueElem.textContent = `${equationString} =`;

        if (divByZero(equationString)) {
            equationArray.pop();
            currentValueElem.value = "/0=🤯💩";
        } else {
            currentValueElem.value = calculate(equationString);
        }

        newNumberFlag = true;
        itemArray = [];
        console.log(equationArray);
    });

    const clearButtons = document.querySelectorAll('.clear, .clearEntry');
    clearButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            currentValueElem.value = 0;
            previousValueElem.textContent = '';
            if (event.target.classList.contains('clear')) {
                itemArray = [];
                equationArray = [];
            }
        });
    });

    const deleteButton = document.querySelector('.delete');
    deleteButton.addEventListener('click', () => {
        currentValueElem.value = currentValueElem.value.slice(0, -1);
        if (!currentValueElem.value.length) currentValueElem.value = 0;
    });

    const signChangeButton = document.querySelector('.signChange');
    signChangeButton.addEventListener('click', () => {
        currentValueElem.value = parseFloat(currentValueElem.value) * -1;
    });

}

document.addEventListener("DOMContentLoaded", initApp);

const divByZero = (equation) => {
    return /(\/ 0$)/.test(equation);
}

const calculate = (equation, currentValueElem) => {
    console.log(equation);
    //const regex = /(^[*/=])|(\s)/g;
    //equation = equation.replace(regex, '');
    /* const divByZero = /(\/ 0$)/.test(equation);
    console.log(divByZero)
    if (divByZero) return currentValueElem.value = 0; */
    //return currentValueElem.value = eval(equation);
    return eval(equation);
}