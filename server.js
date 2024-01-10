// Import required modules
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());


// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

// Serve static files from the 'src' directory
app.use(express.static(__dirname + '/src'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'payroll_management',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');

    // Check the connection by executing a simple query
    db.query('SELECT 1 + 1 AS result', (queryErr, results) => {
        if (queryErr) {
            console.error('Error executing query:', queryErr);
            return;
        }

        console.log('Database connection test result:', results[0].result);
    });
});

// Home route
app.get('/', (req, res) => {
    console.log('Received a request to the home route');
    res.sendFile(__dirname + '/src/index.html');
});

  
app.get('/addEmployee', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'add_emp.html'));
});

app.get('/deleteEmployee', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'delete_emp.html'));
});

app.get('/getPayslip', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'get_payslip.html'));
});

// Add new employee route
app.post('/addEmployee', (req, res) => {
    const { name, designation, basicpay, loan, joiningdate } = req.body;

    // Insert new employee into the database with basicpay
    const sql = 'INSERT INTO employees (name, designation, basicpay, loan, joiningdate) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, designation, basicpay, loan, joiningdate], (err, result) => {
        if (err) {
            console.error('Error adding employee:', err);
            res.status(500).json({ error: 'Error adding employee' });
            return;
        }
        console.log('Employee added successfully:', result);
        res.status(201).json({ message: 'Employee added successfully' });
    });
});

// Delete employee route
app.delete('/deleteEmployee/:id', (req, res) => {
    const employeeId = req.params.id;

    // Delete employee from the database
    const sql = 'DELETE FROM employees WHERE employee_id = ?';
    db.query(sql, [employeeId], (err, result) => {
        if (err) {
            console.error('Error deleting employee:', err);
            res.status(500).json({ error: 'Error deleting employee' });
            return;
        }
        console.log('Employee deleted successfully:', result);
        res.json({ message: 'Employee deleted successfully' });
    });
});

// Add a new route to get all employees
app.get('/getAllEmployees', (req, res) => {
    // Retrieve all employees from the database
    
    const getAllEmployeesQuery = 'SELECT * FROM employees';
    db.query(getAllEmployeesQuery, (err, results) => {
        if (err) {
            console.error('Error getting all employees:', err);
            res.status(500).json({ error: 'Error getting all employees' });
            return;
        }

        // Send the list of employees as a response
        console.log('list suces!!!',results);
        res.json({ employees: results });

    });
});

// Get payslip route
app.get('/getPayslip/:id', (req, res) => {
    const employeeId = req.params.id;

    // Fetch employee details from the database
    const fetchEmployeeQuery = 'SELECT * FROM employees WHERE employee_id = ?';
    db.query(fetchEmployeeQuery, [employeeId], (fetchErr, employeeResult) => {
        if (fetchErr) {
            console.error('Error fetching employee details:', fetchErr);
            res.status(500).json({ error: 'Error fetching employee details' });
            return;
        }

        if (employeeResult.length === 0) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }

        const employee = employeeResult[0];

        // Calculate net pay based on the provided formula
        const netPay = (employee.basicpay + employee.mealallowance + employee.houserent) -
            (employee.providentfund + employee.professionaltax + employee.loan);

        // Create the payslip object
        const payslip = {
            employeeId: employee.employee_id,
            name: employee.name,
            designation: employee.designation,
            basicpay: employee.basicpay,
            mealallowance: employee.mealallowance,
            houserent: employee.houserent,
            providentfund: employee.providentfund,
            professionaltax: employee.professionaltax,
            loan: employee.loan,
            netPay: netPay,
        };

        console.log('Payslip generated successfully:', payslip);
        res.json({ payslip });
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
