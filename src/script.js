function addEmployee() {
    const employeeName = document.getElementById('employeeName').value;
    const employeedesignation= document.getElementById('employeedesignation').value;
    const basicpay = document.getElementById('basicpay').value;
    const loan = document.getElementById('loan').value;
    const joiningdate = document.getElementById('joiningdate').value;

    // Send data to the backend using fetch or XMLHttpRequest
    fetch('http://localhost:3001/addEmployee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: employeeName, designation: employeedesignation, basicpay: basicpay,loan: loan,joiningdate: joiningdate, }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById('result').innerText = 'Employee added successfully!';
        document.getElementById("employeeName").value = "";
        document.getElementById("employeedesignation").value = "";
        document.getElementById("basicpay").value = "";
        document.getElementById("loan").value = "";
        document.getElementById("joiningdate").value = "";
        document.getElementById('result').innerText = '';


    })
    .catch(error => {
        console.error('Error adding employee:', error);
    });
}

function deleteEmployee() {
    const employeeIdToDelete = document.getElementById('employeeIdToDelete').value;

    // Send data to the backend using fetch or XMLHttpRequest
    fetch(`http://localhost:3001/deleteEmployee/${employeeIdToDelete}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        document.getElementById('result').innerText = 'Employee deleted successfully!';
        document.getElementById('error').innerText = ''; // Clear any previous error messages
        document.getElementById('employeeIdToDelete').value = '';
    })
    .catch(error => {
        console.error('Error deleting employee:', error);
        document.getElementById('error').innerText = 'Error deleting employee: ' + error.message;
    });
}


function getAllEmployees() {
    // Send a request to the backend to get all employees
    fetch('http://localhost:3001/getAllEmployees')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);

            // Display the list of employees in a table
            const employeeTable = document.getElementById('employeeTable');
            
            // Check if tbody exists before using querySelector
            const tbody = employeeTable && employeeTable.querySelector('tbody');
            
            if (!tbody) {
                console.error('Error: tbody not found.');
                return;
            }

            tbody.innerHTML = ''; // Clear previous content

            if (data && data.employees) {
                data.employees.forEach(employee => {
                    const row = tbody.insertRow();
                    row.insertCell(0).innerText = employee.employee_id;
                    row.insertCell(1).innerText = employee.name;
                    row.insertCell(2).innerText = employee.designation;
                    row.insertCell(3).innerText = employee.basicpay;
                    row.insertCell(4).innerText = employee.mealallowance;
                    row.insertCell(5).innerText = employee.houserent;
                    row.insertCell(6).innerText = employee.providentfund;
                    row.insertCell(7).innerText = employee.professionaltax;
                    row.insertCell(8).innerText = employee.loan;
                    
                });
            } else {
                // Handle the case when no employees are found
                alert('No employees found.');
            }
        })
        .catch(error => {
            console.error('Error getting all employees:', error);
            alert(`Error getting employees: ${error.message}`);
        });
}

// Call getAllEmployees when the page loads
window.onload = getAllEmployees;



function getPayslip() {
    const employeeIdForPayslip = document.getElementById('employeeIdForPayslip').value;

    // Send data to the backend using fetch or XMLHttpRequest
    fetch(`http://localhost:3001/getPayslip/${employeeIdForPayslip}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        // Update table with payslip data
        const resultRow = document.getElementById('resultRow');

        if (data && data.payslip) {

            resultRow.cells[0].innerText = data.payslip.employeeId;
            resultRow.cells[1].innerText = data.payslip.name;
            resultRow.cells[2].innerText = data.payslip.designation;
            resultRow.cells[3].innerText = data.payslip.basicpay;
            resultRow.cells[4].innerText = data.payslip.mealallowance;
            resultRow.cells[5].innerText = data.payslip.houserent;
            resultRow.cells[6].innerText = data.payslip.providentfund;
            resultRow.cells[7].innerText = data.payslip.professionaltax;
            resultRow.cells[8].innerText = data.payslip.loan;
            resultRow.cells[9].innerText = data.payslip.netPay;

        } else {
            // Handle the case when no payslip data is received
            alert('No payslip data found for the provided employee ID.');
        }


    })
    .catch(error => {
        console.error('Error getting payslip:', error);
    });
}

