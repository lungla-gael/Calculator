// operations
function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    if (b === 0) {
        return "error";
    } else {
        return a / b;        
    }
}
function operate(operator, a, b) {
    switch (operator) {
        case "+":
            return add(a,b);
            break;
        case "-":
            return subtract(a,b);
            break;
        case "x":
            return multiply(a,b);
            break;
        case "÷":
            return divide(a,b);
            break;
        default:
            break;
    }
}

// create calculator buttons
let operatorButtons = [];
let numberButtons = [];
function createCalculator() {
    let numberArray = [7,8,9,4,5,6,1,2,3,0,".","←"];
    let numbersContainer = document.querySelector("#numbers-container");
    for (let index = 0; index < numberArray.length ;  index++) {
        let flexItem = document.createElement('button');
        if (numberArray[index] === "." || numberArray[index] === "←") {
            flexItem.style.fontSize = "larger";
            flexItem.style.backgroundColor = "teal";
        }
        flexItem.textContent = numberArray[index];
        numbersContainer.appendChild(flexItem);  
        if (isNaN(numberArray[index])) {
            operatorButtons[index] = flexItem;
        }else{
            numberButtons[index] = flexItem;
        }
    }
    
    let operatorArray = ["Clear","÷","x","-","+","="];
    let operatorsContainer = document.querySelector("#operators-container");
    operatorArray.forEach(element => {
        let flexItem = document.createElement('button');
        flexItem.textContent = element;
        if (element === "=" || element === "Clear") {
            flexItem.style.width = "4.3cm";
        }else{
            flexItem.style.fontSize = "larger";
        }
        if (element === "Clear") {
            flexItem.style.backgroundColor = "red";
        } 
        operatorsContainer.appendChild(flexItem); 
        operatorButtons.push(flexItem);    
    });
    
}
createCalculator();

//reset calculator object
function defaultCalculator() {
    let calculator = {
        firstValue : 0,
        operator: null,
        secondValue : 0,
        primaryFirstValue : 0,
        primaryOperator : null,  
        transientValue : 0 ,
        transientOperator : null
    };
    return calculator;
}

// add event listener for each operator button
operatorButtons.forEach(operatorButton => {
    operatorButton.addEventListener('click', function (){
        let content = operatorButton.textContent;
        clickOperatorButton(content)});
});

// add event listener for each number button
numberButtons.forEach(numberButton => {
    numberButton.addEventListener('click', function(){
        let content = numberButton.textContent;
        clickNumberButton(content);
    });
});

let result = 0;
let calculator = defaultCalculator();

let textArea = document.querySelector("textarea");
function clickNumberButton(content) {
    let value = content;
    let prevText = textArea.textContent;
    if (isNaN(prevText[prevText.length-1]) && prevText[prevText.length-1] !== ".") {
        textArea.textContent += " ";
    }
    textArea.textContent += value;
}

function evaluateSecondValue() {
    let noIndex = textArea.textContent.lastIndexOf(calculator.secondValue);
    if (textArea.textContent[noIndex-2] === "-" && 
                textArea.textContent[noIndex-4] == "-" ||
                textArea.textContent[noIndex-4] == "x" ||
                textArea.textContent[noIndex-4] == "÷") {
        calculator.secondValue = "-"+calculator.secondValue;
    }    
}

function clickOperatorButton(content) {
    let value = content;
    if (value === "Clear") {
        textArea.textContent = null;
        calculator = defaultCalculator();
    }else if(value === "←" || value === "Backspace"){
        let lastValue = textArea.textContent[textArea.textContent.length-1];
        textArea.textContent = textArea.textContent.replace(lastValue,"");
    }else if(value === "."){
        let lastValue = textArea.textContent[textArea.textContent.length-1];
        if (Number(lastValue) || lastValue === "0") {
            textArea.textContent += value;            
        }
    }else if (value === "=" || value === "Enter") {
        value = "=";
        textArea.textContent += " ";
        textArea.textContent += value; 
        textArea.textContent += " ";
        let prevIndex = textArea.textContent.lastIndexOf(calculator.operator);
        let valueIndex = textArea.textContent.indexOf(value);
        calculator.secondValue = Number(textArea.textContent.substring((prevIndex+2),(valueIndex-1)));
        evaluateSecondValue();
        if (calculator.transientValue !== 0) {
           result = operate(calculator.transientOperator,calculator.transientValue,
                    operate(calculator.operator,Math.abs(calculator.primaryFirstValue),
                            calculator.secondValue));
        }else{
            result = operate(calculator.primaryOperator,calculator.primaryFirstValue,calculator.secondValue);
        }
        if (isNaN(result) ) {
            textArea.textContent = "ERROR";
        }else{
            if (parseInt(result) === result) {
                textArea.textContent += result;                
            } else {
                textArea.textContent += result.toFixed(2);
            }
        }
        calculator = defaultCalculator();
    }else{
        let operatorExists = false;
        operatorButtons.forEach(btn => {
            let content = btn.textContent;
            if (value === content) {
                operatorExists = true;
            }
        });
        if (operatorExists) {
            textArea.textContent += " ";
            textArea.textContent += value;
            let valueIndex = textArea.textContent.lastIndexOf(value);
            let prevIndex = textArea.textContent.lastIndexOf(calculator.operator,(textArea.textContent.length-2));
            switch (prevIndex) {
                case -1:
                    calculator.firstValue = Number(textArea.textContent.substring(0,(valueIndex-1)));
                    calculator.primaryFirstValue = calculator.firstValue;
                    calculator.primaryOperator = value;
                    break;        
                default:
                    calculator.secondValue = Number(textArea.textContent.substring((prevIndex+2),(valueIndex-1)));
                    evaluateSecondValue();
                    if (textArea.textContent[prevIndex] === "÷" || textArea.textContent[prevIndex] === "x") {
                        if (calculator.secondValue === 0) {;
                        }else{
                            let initial = operate(calculator.operator,
                                        calculator.primaryFirstValue,calculator.secondValue);
                            if (calculator.transientValue !== 0) {
                                calculator.firstValue = operate(calculator.transientOperator,
                                            calculator.transientValue,initial);                        
                            }else{
                                calculator.firstValue = initial;
                            }
                            calculator.primaryFirstValue = calculator.firstValue;
                            calculator.primaryOperator = value;
                            calculator.transientOperator = null;
                            calculator.transientValue = 0;
                        }
                    } else{
                        if (value === "+" || value === "-") {
                           calculator.firstValue = 
                                operate(calculator.primaryOperator,calculator.primaryFirstValue,calculator.secondValue);
                            calculator.primaryFirstValue = calculator.firstValue;
                            calculator.primaryOperator = value;
                        }else{
                            calculator.firstValue = calculator.secondValue;
                            calculator.transientValue = calculator.primaryFirstValue;
                            calculator.transientOperator = calculator.primaryOperator;
                            calculator.primaryFirstValue = calculator.primaryOperator+calculator.firstValue;
                            calculator.primaryOperator = value;
                        }
                    }   
                    break;
            }            
        }
        calculator.operator = value;
    }
}

//keyboard support
function keyPressed(e) {
    if (Number(e.key)) {
        clickNumberButton(e.key);        
    } else {
        clickOperatorButton(e.key);
    }
}
window.addEventListener('keydown', keyPressed);