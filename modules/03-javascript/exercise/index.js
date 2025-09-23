console.log("Hello from JavaScript");
alert("Hello from JavaScript");
console.log("JavaScript Alert");

// ============================================================================
// COMPREHENSIVE JAVASCRIPT DEMONSTRATION
// ============================================================================

console.log("\n=== STARTING JAVASCRIPT DEMONSTRATION ===\n");

// ============================================================================
// 1. LET & CONST VARIABLES
// ============================================================================
console.log("1. LET & CONST VARIABLES");
console.log("========================");

// let - for variables that can be reassigned
let userName = "John Doe";
let userAge = 25;
let isLoggedIn = false;

console.log("Initial values:");
console.log("userName:", userName);
console.log("userAge:", userAge);
console.log("isLoggedIn:", isLoggedIn);

// Reassigning let variables
userName = "Jane Smith";
userAge = 30;
isLoggedIn = true;

console.log("After reassignment:");
console.log("userName:", userName);
console.log("userAge:", userAge);
console.log("isLoggedIn:", isLoggedIn);

// const - for variables that cannot be reassigned
const PI = 3.14159;
const COMPANY_NAME = "TechCorp";
const MAX_USERS = 100;

console.log("Constants:");
console.log("PI:", PI);
console.log("COMPANY_NAME:", COMPANY_NAME);
console.log("MAX_USERS:", MAX_USERS);

// ============================================================================
// 2. DATA TYPES
// ============================================================================
console.log("\n2. DATA TYPES");
console.log("=============");

// Primitive Data Types
let stringExample = "Hello World!";
let numberExample = 42;
let booleanExample = true;
let undefinedExample;
let nullExample = null;
let symbolExample = Symbol("unique");
let bigIntExample = 9007199254740991n;

console.log("String:", stringExample, "| Type:", typeof stringExample);
console.log("Number:", numberExample, "| Type:", typeof numberExample);
console.log("Boolean:", booleanExample, "| Type:", typeof booleanExample);
console.log("Undefined:", undefinedExample, "| Type:", typeof undefinedExample);
console.log("Null:", nullExample, "| Type:", typeof nullExample);
console.log("Symbol:", symbolExample, "| Type:", typeof symbolExample);
console.log("BigInt:", bigIntExample, "| Type:", typeof bigIntExample);

// Object Data Type
let objectExample = {
    name: "Alice",
    age: 28,
    city: "New York"
};
console.log("Object:", objectExample, "| Type:", typeof objectExample);

// ============================================================================
// 3. ARRAYS FOR STORING MULTIPLE VALUES
// ============================================================================
console.log("\n3. ARRAYS FOR STORING MULTIPLE VALUES");
console.log("=====================================");

// Creating arrays
let fruits = ["apple", "banana", "orange", "grape"];
let numbers = [1, 2, 3, 4, 5];
let mixedArray = ["John", 25, true, null, {hobby: "reading"}];

console.log("Fruits array:", fruits);
console.log("Numbers array:", numbers);
console.log("Mixed array:", mixedArray);

// Array methods
console.log("Array length:", fruits.length);
console.log("First fruit:", fruits[0]);
console.log("Last fruit:", fruits[fruits.length - 1]);

// Adding elements
fruits.push("mango");
console.log("After push:", fruits);

fruits.unshift("strawberry");
console.log("After unshift:", fruits);

// Removing elements
let removedFruit = fruits.pop();
console.log("Removed fruit:", removedFruit);
console.log("After pop:", fruits);

// Array iteration
console.log("Iterating through fruits:");
for (let i = 0; i < fruits.length; i++) {
    console.log(`Fruit ${i + 1}: ${fruits[i]}`);
}

// ============================================================================
// 4. JAVASCRIPT FUNCTIONS WITH PARAMETERS AND RETURN TYPES
// ============================================================================
console.log("\n4. JAVASCRIPT FUNCTIONS");
console.log("=======================");

// Function declaration
function greetUser(name, age) {
    return `Hello ${name}! You are ${age} years old.`;
}

// Function expression
const calculateArea = function(length, width) {
    return length * width;
};

// Arrow function
const calculateCircleArea = (radius) => {
    return PI * radius * radius;
};

// Arrow function (shorter syntax)
const square = x => x * x;

// Function with default parameters
function createProfile(name = "Anonymous", age = 0, city = "Unknown") {
    return {
        name: name,
        age: age,
        city: city,
        profile: `${name} from ${city}, ${age} years old`
    };
}

// Function that returns multiple values (using object)
function getPersonInfo(person) {
    return {
        fullName: person.name,
        isAdult: person.age >= 18,
        ageGroup: person.age < 18 ? "Minor" : person.age < 65 ? "Adult" : "Senior"
    };
}

// Testing functions
console.log("Function results:");
console.log(greetUser("Alice", 25));
console.log("Rectangle area:", calculateArea(5, 3));
console.log("Circle area:", calculateCircleArea(4).toFixed(2));
console.log("Square of 7:", square(7));
console.log("Default profile:", createProfile());
console.log("Custom profile:", createProfile("Bob", 30, "Boston"));

let person = { name: "Charlie", age: 17 };
console.log("Person info:", getPersonInfo(person));

// ============================================================================
// 5. APPLYING LOGIC USING IF-ELSE CONDITIONS
// ============================================================================
console.log("\n5. IF-ELSE CONDITIONS");
console.log("====================");

// Simple if-else
let temperature = 25;
if (temperature > 30) {
    console.log("It's hot outside!");
} else if (temperature > 20) {
    console.log("Nice weather!");
} else {
    console.log("It's cold outside!");
}

// Function using if-else logic
function checkGrade(score) {
    if (score >= 90) {
        return "A - Excellent!";
    } else if (score >= 80) {
        return "B - Good job!";
    } else if (score >= 70) {
        return "C - Not bad!";
    } else if (score >= 60) {
        return "D - Need improvement";
    } else {
        return "F - Study harder!";
    }
}

// Function to determine access level
function checkAccess(user) {
    if (user.isActive && user.age >= 18) {
        if (user.role === "admin") {
            return "Full access granted";
        } else if (user.role === "user") {
            return "Standard access granted";
        } else {
            return "Limited access granted";
        }
    } else {
        return "Access denied";
    }
}

// Testing conditional logic
console.log("Grade for 85:", checkGrade(85));
console.log("Grade for 92:", checkGrade(92));
console.log("Grade for 55:", checkGrade(55));

let testUser1 = { isActive: true, age: 25, role: "admin" };
let testUser2 = { isActive: false, age: 30, role: "user" };
let testUser3 = { isActive: true, age: 16, role: "user" };

console.log("Admin user access:", checkAccess(testUser1));
console.log("Inactive user access:", checkAccess(testUser2));
console.log("Minor user access:", checkAccess(testUser3));

// Ternary operator examples
let status = isLoggedIn ? "Welcome back!" : "Please log in";
console.log("Status:", status);

let userType = userAge >= 18 ? "Adult" : "Minor";
console.log("User type:", userType);

// ============================================================================
// 6. LOOPS & LOOP METHODS
// ============================================================================
console.log("\n6. LOOPS & LOOP METHODS");
console.log("=======================");

// For loop
console.log("For loop - counting to 5:");
for (let i = 1; i <= 5; i++) {
    console.log(`Count: ${i}`);
}

// While loop
console.log("While loop - countdown from 5:");
let countdown = 5;
while (countdown > 0) {
    console.log(`Countdown: ${countdown}`);
    countdown--;
}

// Do-while loop
console.log("Do-while loop - at least one execution:");
let counter = 0;
do {
    console.log(`Counter: ${counter}`);
    counter++;
} while (counter < 3);

// For...of loop (for arrays)
console.log("For...of loop - iterating fruits:");
let favoriteFruits = ["apple", "banana", "cherry"];
for (let fruit of favoriteFruits) {
    console.log(`I like ${fruit}`);
}

// For...in loop (for objects)
console.log("For...in loop - iterating object properties:");
let car = { brand: "Toyota", model: "Camry", year: 2022, color: "blue" };
for (let property in car) {
    console.log(`${property}: ${car[property]}`);
}

// Array methods with loops
let numbersToProcess = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// forEach method
console.log("forEach method:");
numbersToProcess.forEach((num, index) => {
    console.log(`Index ${index}: ${num}`);
});

// map method
console.log("map method - doubling numbers:");
let doubledNumbers = numbersToProcess.map(num => num * 2);
console.log("Original:", numbersToProcess);
console.log("Doubled:", doubledNumbers);

// filter method
console.log("filter method - even numbers only:");
let evenNumbers = numbersToProcess.filter(num => num % 2 === 0);
console.log("Even numbers:", evenNumbers);

// reduce method
console.log("reduce method - sum of all numbers:");
let sum = numbersToProcess.reduce((accumulator, current) => accumulator + current, 0);
console.log("Sum:", sum);

// find method
console.log("find method - first number greater than 5:");
let firstLargeNumber = numbersToProcess.find(num => num > 5);
console.log("First number > 5:", firstLargeNumber);

// some method
console.log("some method - check if any number is greater than 8:");
let hasLargeNumber = numbersToProcess.some(num => num > 8);
console.log("Has number > 8:", hasLargeNumber);

// every method
console.log("every method - check if all numbers are positive:");
let allPositive = numbersToProcess.every(num => num > 0);
console.log("All positive:", allPositive);

// Complex example: Processing student data
console.log("\nComplex example - Student grade processing:");
let students = [
    { name: "Alice", score: 85 },
    { name: "Bob", score: 92 },
    { name: "Charlie", score: 78 },
    { name: "Diana", score: 96 },
    { name: "Eve", score: 73 }
];

// Add grades to students
let studentsWithGrades = students.map(student => ({
    ...student,
    grade: checkGrade(student.score)
}));

console.log("Students with grades:");
studentsWithGrades.forEach(student => {
    console.log(`${student.name}: ${student.score} - ${student.grade}`);
});

// Filter students who passed (score >= 80)
let passingStudents = students.filter(student => student.score >= 80);
console.log("Students who passed:", passingStudents.map(s => s.name));

// Calculate average score
let averageScore = students.reduce((sum, student) => sum + student.score, 0) / students.length;
console.log("Average score:", averageScore.toFixed(2));

console.log("\n=== JAVASCRIPT DEMONSTRATION COMPLETE ===");