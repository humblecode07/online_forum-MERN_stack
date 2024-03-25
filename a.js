// Javascript program to convert infix to prefix
// program to implement stack data structure
class Stack {
    constructor() {
        this.items = [];
    }
    
    // add element to the stack
    push(element) {
        return this.items.push(element);
    }
    
    // remove element from the stack
    pop() {
        if (this.items.length > 0) {
        return this.items.pop();
        }
    }
    
    // view the last element
    top() {
        return this.items[this.items.length - 1];
    }
    
    // check if the stack is empty
    isEmpty() {
        return this.items.length == 0;
    }
    
    // the size of the stack
    size() {
        return this.items.length;
    }
    
    // empty the stack
    clear() {
        this.items = [];
    }
    }
    
    function isalpha(c) {
    if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")) {
        return true;
    }
    return false;
    }
    
    function isdigit(c) {
    if (c >= "0" && c <= "9") {
        return true;
    }
    return false;
    }
    function isOperator(c) {
    return !isalpha(c) && !isdigit(c);
    }
    
    function getPriority(C) {
    if (C == "-" || C == "+") return 1;
    else if (C == "*" || C == "/") return 2;
    else if (C == "^") return 3;
    return 0;
    }
    
    function infixToPostfix(infix) {
    infix = "(" + infix + ")";
    
    var l = infix.length;
    let char_stack = new Stack();
    var output = "";
    
    for (var i = 0; i < l; i++) {
        // If the scanned character is an
        // operand, add it to output.
        if (isalpha(infix[i]) || isdigit(infix[i])) output += infix[i];
        // If the scanned character is an
        // ‘(‘, push it to the stack.
        else if (infix[i] == "(") char_stack.push("(");
        // If the scanned character is an
        // ‘)’, pop and output from the stack
        // until an ‘(‘ is encountered.
        else if (infix[i] == ")") {
        while (char_stack.top() != "(") {
            output += char_stack.top();
            char_stack.pop();
        }
    
        // Remove '(' from the stack
        char_stack.pop();
        }
    
        // Operator found
        else {
        if (isOperator(char_stack.top())) {
            if (infix[i] == "^") {
            while (getPriority(infix[i]) <= getPriority(char_stack.top())) {
                output += char_stack.top();
                char_stack.pop();
            }
            } else {
            while (getPriority(infix[i]) < getPriority(char_stack.top())) {
                output += char_stack.top();
                char_stack.pop();
            }
            }
    
            // Push current Operator on stack
            char_stack.push(infix[i]);
        }
        }
    }
    while (!char_stack.isEmpty()) {
        output += char_stack.top();
        char_stack.pop();
    }
    
    return output;
    }
    
    function infixToPrefix(infix) {
    /* Reverse String
    * Replace ( with ) and vice versa
    * Get Postfix
    * Reverse Postfix * */
    var l = infix.length;
    
    // Reverse infix
    infix = infix.split("").reverse().join("");
    
    // Replace ( with ) and vice versa
    var infixx = infix.split("");
    for (var i = 0; i < l; i++) {
        if (infixx[i] == "(") {
        infixx[i] = ")";
        } else if (infixx[i] == ")") {
        infixx[i] = "(";
        }
    }
    infix = infixx.join("");
    
    var prefix = infixToPostfix(infix);
    
    // Reverse postfix
    prefix = prefix.split("").reverse().join("");
    return prefix;
    }
    
    // Driver code
    
    var s = "a+b*(c/d)";
    console.log(infixToPrefix(s));
    