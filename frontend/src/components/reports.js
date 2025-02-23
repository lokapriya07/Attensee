import React, { useEffect, useState } from 'react';

function Reports() {
  const [students, setStudents] = useState([]);

  // Fetch monthly report data from the backend
  useEffect(() => {
    fetch('http://localhost:5000/report') // Assuming the backend is running locally
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => console.error('Error fetching report:', error));
  }, []);

  // Handle CSV download
  const downloadCSV = () => {
    fetch('http://localhost:5000/download')
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'monthly_engagement_report.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error('Error downloading CSV:', error));
  };

  return (
    <div className="App">
      <h1>Monthly Engagement Report</h1>
      <button onClick={downloadCSV} className="download-btn">
        Download CSV
      </button>
      <table className="report-table">
        <thead>
          <tr>
            <th>Roll Number</th>
            <th>Name</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              key={student.id}
              className={student.engagedPercentage < 65 ? 'low-engagement' : ''}
            >
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>
                <span
                  className={
                    student.engagedPercentage < 65
                      ? 'low-percentage'
                      : 'normal-percentage'
                  }
                >
                  {student.engagedPercentage}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        /* App container styling */
        .App {
          text-align: center;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        h1 {
          color: #2c3e50;
          font-size: 2.5rem;
          margin-bottom: 20px;
        }

        /* Button styling */
        .download-btn {
          background-color: #2ecc71; /* Green button */
          color: white;
          padding: 10px 20px;
          margin-bottom: 20px;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
        }

        .download-btn:hover {
          background-color: #27ae60; /* Darker green on hover */
        }

        /* Table styling */
        .report-table {
          width: 80%;
          margin: 20px auto;
          border-collapse: collapse;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }

        .report-table thead {
          background-color: #f4f4f4;
        }

        .report-table th,
        .report-table td {
          padding: 15px;
          text-align: center;
          border: 1px solid #ddd;
        }

        .report-table th {
          font-weight: bold;
          color: #2c3e50;
        }

        .report-table td {
          font-size: 1rem;
          color: #34495e;
        }

        

        

        /* Highlighting rows with low engagement */
        .low-engagement {
          background-color: #f1c40f; /* Yellow for low engagement */
        }
      `}</style>
    </div>
  );
}

export default Reports;
