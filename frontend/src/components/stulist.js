import React from 'react';
import { Link } from 'react-router-dom';

const mockStudents = [
  { id: 1, name: 'Alice', engagement: 'Disengaged', color: 'red' },
  { id: 2, name: 'Bob', engagement: 'Moderately engaged', color: 'yellow' },
  { id: 3, name: 'Charlie', engagement: 'Fully engaged', color: 'green' },
];

const StudentList = () => {
  return (
    <div>
      {mockStudents.map(student => (
        <div key={student.id} style={{ marginBottom: '20px' }}>
          <h3>{student.name}</h3>
          <p>Status: {student.engagement}</p>
          <p>Color: <span style={{ color: student.color }}>{student.color}</span></p>
          {/* Link to the individual analysis component */}
          <Link to={`/student/${student.id}`}>View More</Link>
        </div>
      ))}
    </div>
  );
};

export default StudentList;
