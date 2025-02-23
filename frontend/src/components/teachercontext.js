import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherContext = createContext(undefined);

export const useTeacherContext = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error('useTeacherContext must be used within a TeacherProvider');
  }
  return context;
};

export const TeacherProvider = ({ children }) => {
  const [teacherData, setTeacherData] = useState(null);
  const navigate=useNavigate();
  const fetchTeacherData = useCallback(async () => {
    try {
      const mockData = {
        username: 'varuna',
        sections: [
          { name: 'A31', subjects: ['PP', 'CN', 'OS'] },
          { name: 'A32', subjects: ['PP', 'OS'] }
        ]
      };
      setTeacherData(mockData);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    }
  }, []);

  const logout = () => {
    console.log('Logging out');
    navigate('/login');
  };

  return (
    <TeacherContext.Provider value={{ teacherData, fetchTeacherData, logout }}>
      {children}
    </TeacherContext.Provider>
  );
};
