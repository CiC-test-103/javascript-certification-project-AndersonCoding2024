// Necessary Imports (you will need to use this)
const { Student } = require('./Student')

/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data               // Student
  next               // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next
  }
}
const fs = require('fs').promises;
/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head              // Object
  tail              // Object
  length            // Number representing size of LinkedList

  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
    // TODO
    this.head = null; // Start with an empty list
    this.tail = null; // No tail at initialization
    this.length = 0; // No elements initially
  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
  addStudent(newStudent) {
    // TODO
    const newNode = new Node(newStudent);
    if (this.head === null) { // If the list is empty
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode; // Link the current tail to the new node
      this.tail = newNode; // Update the tail to the new node
    }
    this.length++; // Increment the list size
  }

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
  removeStudent(email) {
    // TODO
    if (!this.head) return;
    if (this.head.data.getEmail() === email) {
      this.head = this.head.next; // Remove the head
      this.length--; // Decrement length
      return;
    }
    let current = this.head;
    while (current.next !== null && current.next.data.getEmail()!== email) {
      current = current.next;
    }
    if (current.next !== null) {
      current.next = current.next.next; // Skip the node to remove
      this.length--; // Decrement length
    }
  }

  /**
   * REQUIRES:  email (String)
   * EFFECTS:   None
   * RETURNS:   The Student or -1 if not found
   */
  findStudent(email) {
    // TODO
    let current = this.head;
    while (current !== null) {
      if (current.data.getEmail() === email) return current.data;
      current = current.next;
    }
    return -1; // Not found
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  clearStudents() {
    // TODO
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
    // TODO
    let current = this.head;
    let students = [];
    while (current !== null) {
      students.push(current.data.getName());
      current = current.next;
    }
    //return "";
    return students.join (', '); 
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  #sortStudentsByName() {
    // TODO
    let students = [];
    let current = this.head;
    while (current !== null) {
      students.push(current.data);
      current = current.next;
    }
    students.sort((a, b) => a.getName().localeCompare(b.getName()));
    //return []; 
    return students;
  }

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterBySpecialization(specialization) {
    // TODO
    let sortedStudents = this.#sortStudentsByName();
    return sortedStudents.filter(student => student.getSpecialization() === specialization);
    //return [];
  }

  /**
   * REQUIRES:  minYear (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minYear, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinYear(minYear) {
    // TODO
    let sortedStudents = this.#sortStudentsByName();
    return sortedStudents.filter(student => student.getYear() >= minYear);
    // return [];
  }

  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  async saveToJson(fileName) {
    // TODO
    try {
      let students = [];
      let current = this.head;
      while (current !== null) {
        students.push({
          name: current.data.getName(),
          year: current.data.getYear(),
          email: current.data.getEmail(),
          specialization: current.data.getSpecialization(),
        });
      current = current.next;
    }
    await fs.writeFile(fileName, JSON.stringify(students, null, 2), 'utf-8');
    console.log(`Data saved succesfully to ${fileName}`);
    } catch (error) {
      console.error("Error saving file:", error);
    }
  }

  /**
   * REQUIRES:  A valid file name (String) that exists
   * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   *  - Use clearStudents() to perform overwriting
   */
  async loadFromJSON(fileName) {
    // TODO
    try{
      const data = JSON.parse(await fs.readFile(fileName, 'utf-8'));
      this.clearStudents(); // Clear the existing LinkedList
      
      for (const studentData of data){
        const { name, year, email, specialization } = studentData;
        const newStudent = new Student(name, year, email, specialization);
        this.addStudent(newStudent); // Add each student to the list;
    } 
    console.log(`Data loaded sucessefully from ${fileName}`);
    } catch (error){
      console.log("Error loading file:", error);
    };
  }  
}

module.exports = { LinkedList }
