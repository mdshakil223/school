async function searchStudent() {
  const roll = document.getElementById("rollInput").value.trim();
  const group = document.getElementById("groupInput").value;
  const exam = document.getElementById("examInput").value;
  const year = document.getElementById("yearInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!roll || !group || !exam || !year) {
    resultDiv.innerHTML = `<p style="color:red;">Please fill in all fields.</p>`;
    resultDiv.style.display = "block";
    return;
  }

  const sheetID = "1srb2ivDP4N1WBsZK0P42ShghENtf_2xU_bDU6LLWXis";
  const sheetName = "Result";
  const url = `https://opensheet.elk.sh/${sheetID}/${sheetName}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    const student = data.find(item =>
      item.Roll.trim() === roll &&
      item.Group.trim().toUpperCase() === group.toUpperCase() &&
      item.Exam.trim().toLowerCase() === exam.toLowerCase() &&
      item.Year.trim() === year
    );

    if (student) {
      const failedCount = parseInt(student.Failed);
      const resultText = failedCount === 0 ? "Passed" : `Failed in ${failedCount} Subject${failedCount > 1 ? "s" : ""}`;

      resultDiv.innerHTML = `
        <div id="printArea">
          <h2>Student Information</h2>
          <table class="result-table">
            <tr><th>Roll</th><td>${student.Roll}</td></tr>
            <tr><th>Name</th><td>${student.Name}</td></tr>
            <tr><th>Group</th><td>${student.Group}</td></tr>
            <tr><th>Exam</th><td>${student.Exam}</td></tr>
            <tr><th>Year</th><td>${student.Year}</td></tr>
            <tr><th>Result</th><td>${resultText}</td></tr>
            <tr><th>Total Number</th><td>${student["Total Number"]}</td></tr>
            <tr><th>Merit Position</th><td>${student["Marit Position"]}</td></tr>
          </table>
        </div>
        <button onclick="printResult()">Print Result</button>
      `;
    } else {
      resultDiv.innerHTML = `<p style="color:red;">No student found with the given details.</p>`;
    }
    resultDiv.style.display = "block";
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = `<p style="color:red;">Error fetching data. Please try again later.</p>`;
    resultDiv.style.display = "block";
  }
}

function printResult() {
  const printContents = document.getElementById("printArea").innerHTML;
  const printWindow = window.open("", "", "height=600,width=800");
  printWindow.document.write(`
    <html>
      <head>
        <title>Student Result</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { text-align: center; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 10px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}
