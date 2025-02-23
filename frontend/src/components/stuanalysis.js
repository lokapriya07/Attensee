import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const mockStudents = [
    { id: 1, name: 'Alice', engagement: 'Disengaged', color: 'red' },
    { id: 2, name: 'Bob', engagement: 'Moderately engaged', color: 'yellow' },
    { id: 3, name: 'Charlie', engagement: 'Fully engaged', color: 'green' },
];

const StudentAnalysis = () => {
    const { studentId } = useParams();  // Capture studentId from the URL
    const [student, setStudent] = useState(null);

    useEffect(() => {
        // Simulate fetching student data (you can replace this with an actual API call)
        const studentData = mockStudents.find(student => student.id === parseInt(studentId));

        if (studentData) {
            setStudent(studentData);
        } else {
            // Handle the case if no student is found
            console.log('Student not found');
        }
    }, [studentId]);

    if (!student) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Student Analysis: {student.name}</h2>
            <p>Status: {student.engagement}</p>
            <p>Color: <span style={{ color: student.color }}>{student.color}</span></p>
            {/* You can add more analysis here, such as engagement analysis, history, etc. */}
        </div>
    );
};

export default StudentAnalysis;
