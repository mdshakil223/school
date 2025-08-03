async function searchStudent() {
  const roll = document.getElementById("rollInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (roll === "") {
    resultDiv.innerHTML = `<p style="color:red;">Please enter your roll number.</p>`;
    return;
  }

  const sheetID = "1srb2ivDP4N1WBsZK0P42ShghENtf_2xU_bDU6LLWXis";
  const sheetName = "Result";
  const url = `https://opensheet.elk.sh/${sheetID}/${sheetName}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    const student = data.find(item => item.Roll === roll);

    if (student) {
      resultDiv.innerHTML = `
        <div id="printArea">
          <h2>Student Information</h2>
          <p><strong>Roll:</strong> ${student.Roll}</p>
          <p><strong>Name:</strong> ${student.Name}</p>
          <p><strong>Result:</strong> ${student.Failed}</p>
          <p><strong>Total Number:</strong> ${student["Total Number"]}</p>
          <p><strong>Merit Position:</strong> ${student["Marit Position"]}</p>
        </div>
        <button onclick="printResult()">Print Result</button>
      `;
    } else {
      resultDiv.innerHTML = `<p style="color:red;">No student found with Roll: ${roll}</p>`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<p style="color:red;">Error fetching data. Please try again.</p>`;
    console.error(error);
  }
}

// ✅ প্রিন্ট করার ফাংশন
function printResult() {
  const printContents = document.getElementById("printArea").innerHTML;
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>Student Result</title>');
  printWindow.document.write('</head><body >');
  printWindow.document.write(printContents);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}
